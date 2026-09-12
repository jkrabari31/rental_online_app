import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';
import { requireAdmin } from '../middleware/auth.js';

const router = Router();

// GET /api/analytics (admin only)
router.get('/', requireAdmin, async (req: Request, res: Response) => {
  try {
    const userRole = req.session.user?.role;
    const userBranchId = req.session.user?.branchId;

    // Filter query parameters
    let requestedBranchId = req.query.branchId as string;
    const startDateParam = req.query.startDate as string;
    const endDateParam = req.query.endDate as string;
    const datePresetParam = req.query.preset as string;

    // Enforce branch scope for non-admins
    if (userRole !== 'ADMIN' && userBranchId) {
      requestedBranchId = userBranchId;
    }

    // Date range handling
    const isAllTime = !startDateParam || startDateParam === 'ALL' || datePresetParam === 'ALL';
    let start: Date;
    let end: Date;

    if (!isAllTime && startDateParam && endDateParam) {
      const parsedStart = new Date(startDateParam);
      const parsedEnd = new Date(endDateParam);
      if (!isNaN(parsedStart.getTime()) && !isNaN(parsedEnd.getTime())) {
        start = parsedStart;
        start.setHours(0, 0, 0, 0);
        end = parsedEnd;
        end.setHours(23, 59, 59, 999);
        // Add extra 1 day buffer to end to avoid UTC timezone clipping
        end = new Date(end.getTime() + 86400000);
      } else {
        start = new Date('2020-01-01T00:00:00.000Z');
        end = new Date('2030-12-31T23:59:59.999Z');
      }
    } else {
      // Default: wide range or all time
      start = new Date('2020-01-01T00:00:00.000Z');
      end = new Date('2030-12-31T23:59:59.999Z');
    }

    const branchFilter = requestedBranchId && requestedBranchId !== 'ALL' ? { branchId: requestedBranchId } : {};

    // Run all independent DB queries in parallel instead of sequentially
    const dateCondition = isAllTime ? {} : {
      OR: [
        { returnDate: { gte: start, lte: end } },
        { returnDate: null, createdAt: { gte: start, lte: end } },
        { returnDate: null, pickupDate: { gte: start, lte: end } },
      ],
    };

    const maintDateCondition = isAllTime ? {} : {
      date: {
        gte: start,
        lte: end,
      },
    };

    const [branches, completedRentals, activeRentals, vehicles, maintenanceExpenses] = await Promise.all([
      // 1. Fetch Branches
      prisma.branch.findMany({
        where: { isActive: true },
        orderBy: { name: 'asc' },
      }),

      // 2. Fetch completed rentals
      prisma.rental.findMany({
        where: {
          ...branchFilter,
          status: 'COMPLETED',
          ...dateCondition,
        },
        include: {
          branch: { select: { id: true, name: true, location: true } },
          vehicle: { select: { id: true, vehicleName: true, vehicleNumber: true } },
        },
        orderBy: { returnDate: 'asc' },
      }),

      // 3. Fetch active rentals (only need count + branchId)
      prisma.rental.findMany({
        where: {
          ...branchFilter,
          status: 'ACTIVE',
        },
        select: {
          id: true,
          branchId: true,
          branch: { select: { id: true, name: true } },
        },
      }),

      // 4. Fetch fleet vehicles
      prisma.vehicle.findMany({
        where: branchFilter,
        select: {
          id: true,
          vehicleName: true,
          vehicleNumber: true,
          status: true,
          branchId: true,
          branch: { select: { id: true, name: true } },
        },
      }),

      // 5. Fetch maintenance expenses
      prisma.maintenanceExpense.findMany({
        where: {
          ...branchFilter,
          ...maintDateCondition,
        },
        include: {
          branch: { select: { id: true, name: true } },
          vehicle: { select: { id: true, vehicleName: true, vehicleNumber: true } },
        },
        orderBy: { date: 'asc' },
      }),
    ]);

    // ==========================================
    // AGGREGATIONS & KPI CALCULATIONS
    // ==========================================

    let totalRevenue = 0;
    let cashRevenue = 0;
    let onlineRevenue = 0;
    let cashCount = 0;
    let onlineCount = 0;

    const branchRevMap = new Map<string, { revenue: number; rentalsCount: number }>();
    const vehicleRevMap = new Map<string, { id: string; name: string; number: string; branchName: string; revenue: number; trips: number; expenses: number }>();
    const timelineMap = new Map<string, { revenue: number; maintenance: number; rentalsCount: number; cash: number; online: number }>();

    // Pre-populate with all fleet vehicles so every vehicle is included
    vehicles.forEach((v) => {
      vehicleRevMap.set(v.id, {
        id: v.id,
        name: v.vehicleName,
        number: v.vehicleNumber,
        branchName: v.branch?.name || 'Main Branch',
        revenue: 0,
        trips: 0,
        expenses: 0,
      });
    });

    // Process Completed Rentals with Split Payment Accuracy
    completedRentals.forEach((r) => {
      const amount = Number(r.totalAmount) || 0;
      totalRevenue += amount;

      const depAmount = Math.min(Number(r.depositAmount) || 0, amount);
      const remainingAmount = Math.max(0, amount - depAmount);

      const depMode = ((r as any).depositPaymentMode || r.paymentMode || 'CASH').toUpperCase();
      const finalMode = (r.paymentMode || 'CASH').toUpperCase();

      let rentalCash = 0;
      let rentalOnline = 0;

      // Advance deposit portion
      if (depAmount > 0) {
        if (depMode === 'ONLINE') rentalOnline += depAmount;
        else rentalCash += depAmount;
      }

      // Final settlement / extra hours portion
      if (remainingAmount > 0) {
        if (finalMode === 'ONLINE') rentalOnline += remainingAmount;
        else rentalCash += remainingAmount;
      }

      if (amount === 0) {
        if (finalMode === 'ONLINE') onlineCount++;
        else cashCount++;
      } else {
        if (rentalOnline > 0) onlineCount++;
        if (rentalCash > 0) cashCount++;
      }

      cashRevenue += rentalCash;
      onlineRevenue += rentalOnline;

      // Branch Map
      const bName = r.branch?.name || (branches.length > 0 ? branches[0].name : 'Main Branch');
      const bData = branchRevMap.get(bName) || { revenue: 0, rentalsCount: 0 };
      bData.revenue += amount;
      bData.rentalsCount++;
      branchRevMap.set(bName, bData);

      // Vehicle Map
      const vKey = r.vehicleId;
      let vData = vehicleRevMap.get(vKey);
      if (!vData) {
        vData = {
          id: vKey,
          name: r.vehicle?.vehicleName || 'Vehicle',
          number: r.vehicle?.vehicleNumber || 'N/A',
          branchName: r.branch?.name || 'Main Branch',
          revenue: 0,
          trips: 0,
          expenses: 0,
        };
        vehicleRevMap.set(vKey, vData);
      }
      vData.revenue += amount;
      vData.trips++;

      // Timeline Map (by day)
      const targetDate = r.returnDate || r.pickupDate || r.createdAt;
      if (targetDate) {
        const dObj = new Date(targetDate);
        if (!isNaN(dObj.getTime())) {
          const dayStr = dObj.toISOString().slice(0, 10);
          const dayData = timelineMap.get(dayStr) || { revenue: 0, maintenance: 0, rentalsCount: 0, cash: 0, online: 0 };
          dayData.revenue += amount;
          dayData.rentalsCount++;
          dayData.online += rentalOnline;
          dayData.cash += rentalCash;
          timelineMap.set(dayStr, dayData);
        }
      }
    });

    // Process Maintenance Expenses
    let totalMaintenance = 0;
    const branchMaintMap = new Map<string, number>();
    const maintCategoryMap = new Map<string, { amount: number; count: number }>();

    maintenanceExpenses.forEach((m) => {
      const cost = Number(m.amount) || 0;
      totalMaintenance += cost;

      // Branch maintenance
      const bName = m.branch?.name || (branches.length > 0 ? branches[0].name : 'Main Branch');
      branchMaintMap.set(bName, (branchMaintMap.get(bName) || 0) + cost);

      // Category breakdown (using remarks or default)
      const cat = m.remarks?.trim() || 'General Maintenance';
      const catData = maintCategoryMap.get(cat) || { amount: 0, count: 0 };
      catData.amount += cost;
      catData.count++;
      maintCategoryMap.set(cat, catData);

      // Vehicle Maintenance Expense
      if (m.vehicleId) {
        let vData = vehicleRevMap.get(m.vehicleId);
        if (!vData) {
          vData = {
            id: m.vehicleId,
            name: m.vehicle?.vehicleName || 'Vehicle',
            number: m.vehicle?.vehicleNumber || 'N/A',
            branchName: m.branch?.name || 'Main Branch',
            revenue: 0,
            trips: 0,
            expenses: 0,
          };
          vehicleRevMap.set(m.vehicleId, vData);
        }
        vData.expenses += cost;
      }

      // Timeline Map
      const targetDate = m.date || m.createdAt;
      if (targetDate) {
        const dObj = new Date(targetDate);
        if (!isNaN(dObj.getTime())) {
          const dayStr = dObj.toISOString().slice(0, 10);
          const dayData = timelineMap.get(dayStr) || { revenue: 0, maintenance: 0, rentalsCount: 0, cash: 0, online: 0 };
          dayData.maintenance += cost;
          timelineMap.set(dayStr, dayData);
        }
      }
    });

    const netProfit = totalRevenue - totalMaintenance;

    // Fleet Status Metrics
    let availableVehicles = 0;
    let rentedVehicles = 0;
    let inactiveVehicles = 0;
    const branchFleetMap = new Map<string, { available: number; rented: number; inactive: number; total: number }>();

    vehicles.forEach((v) => {
      if (v.status === 'AVAILABLE') availableVehicles++;
      else if (v.status === 'RENTED') rentedVehicles++;
      else inactiveVehicles++;

      const bName = v.branch?.name || (branches.length > 0 ? branches[0].name : 'Main Branch');
      const fData = branchFleetMap.get(bName) || { available: 0, rented: 0, inactive: 0, total: 0 };
      if (v.status === 'AVAILABLE') fData.available++;
      else if (v.status === 'RENTED') fData.rented++;
      else fData.inactive++;
      fData.total++;
      branchFleetMap.set(bName, fData);
    });

    const totalVehicles = vehicles.length;
    const utilizationRate = totalVehicles > 0 ? ((rentedVehicles / totalVehicles) * 100).toFixed(1) : '0';

    // Format Branch Revenue & Comparison List
    let branchRevenueList = branches.map((b) => {
      const revData = branchRevMap.get(b.name) || { revenue: 0, rentalsCount: 0 };
      const maintCost = branchMaintMap.get(b.name) || 0;
      const fleet = branchFleetMap.get(b.name) || { available: 0, rented: 0, inactive: 0, total: 0 };
      return {
        branchId: b.id,
        branchName: b.name,
        location: b.location || '',
        revenue: Math.round(revData.revenue),
        maintenance: Math.round(maintCost),
        netProfit: Math.round(revData.revenue - maintCost),
        rentalsCount: revData.rentalsCount,
        vehiclesCount: fleet.total,
      };
    });

    // If no branch table records, create fallback entry with global figures
    if (branchRevenueList.length === 0) {
      branchRevenueList = [{
        branchId: 'global',
        branchName: 'Main Fleet',
        location: 'Headquarters',
        revenue: Math.round(totalRevenue),
        maintenance: Math.round(totalMaintenance),
        netProfit: Math.round(netProfit),
        rentalsCount: completedRentals.length,
        vehiclesCount: totalVehicles,
      }];
    }

    // Format Payment Mode Split
    const totalPaymentsVolume = onlineRevenue + cashRevenue;
    const paymentSplit = [
      {
        name: 'Online / UPI',
        value: Math.round(onlineRevenue),
        count: onlineCount,
        percentage: totalPaymentsVolume > 0 ? ((onlineRevenue / totalPaymentsVolume) * 100).toFixed(1) : '0',
        color: '#3b82f6',
      },
      {
        name: 'Cash',
        value: Math.round(cashRevenue),
        count: cashCount,
        percentage: totalPaymentsVolume > 0 ? ((cashRevenue / totalPaymentsVolume) * 100).toFixed(1) : '0',
        color: '#10b981',
      },
    ];

    // Format Fleet Distribution by Branch
    let fleetDistribution = Array.from(branchFleetMap.entries()).map(([name, data]) => ({
      branchName: name,
      available: data.available,
      rented: data.rented,
      inactive: data.inactive,
      total: data.total,
    }));

    if (fleetDistribution.length === 0 && totalVehicles > 0) {
      fleetDistribution = [{
        branchName: 'Main Fleet',
        available: availableVehicles,
        rented: rentedVehicles,
        inactive: inactiveVehicles,
        total: totalVehicles,
      }];
    }

    // Format Maintenance by Category
    const maintenanceByCategory = Array.from(maintCategoryMap.entries()).map(([category, data]) => ({
      category,
      amount: Math.round(data.amount),
      count: data.count,
    })).sort((a, b) => b.amount - a.amount);

    // Format Timeline (Sorted Chronologically)
    const timeline = Array.from(timelineMap.entries())
      .map(([dateStr, data]) => {
        const d = new Date(dateStr);
        const formatted = `${d.getDate()} ${d.toLocaleString('default', { month: 'short' })}`;
        return {
          date: dateStr,
          dateFormatted: formatted,
          revenue: Math.round(data.revenue),
          maintenance: Math.round(data.maintenance),
          net: Math.round(data.revenue - data.maintenance),
          rentalsCount: data.rentalsCount,
          cash: Math.round(data.cash),
          online: Math.round(data.online),
        };
      })
      .sort((a, b) => a.date.localeCompare(b.date));

    // All Fleet Vehicles Performance & Maintenance Analytics (All vehicles across branches)
    const allVehiclesAnalytics = Array.from(vehicleRevMap.values())
      .map((v) => ({
        ...v,
        revenue: Math.round(v.revenue),
        expenses: Math.round(v.expenses),
        netProfit: Math.round(v.revenue - v.expenses),
      }))
      .sort((a, b) => b.revenue - a.revenue || b.trips - a.trips || a.name.localeCompare(b.name));

    res.json({
      kpis: {
        totalRevenue: Math.round(totalRevenue),
        totalMaintenance: Math.round(totalMaintenance),
        netProfit: Math.round(netProfit),
        cashRevenue: Math.round(cashRevenue),
        onlineRevenue: Math.round(onlineRevenue),
        cashCount,
        onlineCount,
        totalVehicles,
        availableVehicles,
        rentedVehicles,
        inactiveVehicles,
        utilizationRate,
        totalCompletedRentals: completedRentals.length,
        totalActiveRentals: activeRentals.length,
      },
      branches: branches.map((b) => ({ id: b.id, name: b.name })),
      branchRevenueList,
      paymentSplit,
      fleetDistribution,
      maintenanceByCategory,
      timeline,
      topVehicles: allVehiclesAnalytics,
      allVehicles: allVehiclesAnalytics,
      filters: {
        branchId: requestedBranchId || 'ALL',
        startDate: start.toISOString(),
        endDate: end.toISOString(),
      },
    });
  } catch (error: any) {
    console.error('Analytics aggregation error:', error);
    res.status(500).json({ error: 'Failed to generate analytics data: ' + error.message });
  }
});

export default router;
