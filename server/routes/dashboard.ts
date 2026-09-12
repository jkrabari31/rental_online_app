import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';
import { requireAuth, requireAdmin, getBranchScope } from '../middleware/auth.js';

const router = Router();

// GET /api/dashboard
router.get('/', requireAuth, async (req: Request, res: Response) => {
  try {
    const branchId = getBranchScope(req);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const branchFilter = branchId ? { branchId } : {};

    const [
      totalVehicles,
      availableVehicles,
      onRentVehicles,
      revenueTodayAggr,
      revenueMonthAggr,
      activeRentals,
      completedRentals,
    ] = await Promise.all([
      prisma.vehicle.count({ where: branchFilter }),
      prisma.vehicle.count({ where: { ...branchFilter, status: 'AVAILABLE' } }),
      prisma.vehicle.count({ where: { ...branchFilter, status: 'RENTED' } }),
      prisma.rental.aggregate({
        _sum: { totalAmount: true },
        where: { ...branchFilter, status: 'COMPLETED', returnDate: { gte: today } },
      }),
      prisma.rental.aggregate({
        _sum: { totalAmount: true },
        where: { ...branchFilter, status: 'COMPLETED', returnDate: { gte: startOfMonth } },
      }),
      prisma.rental.findMany({
        where: { ...branchFilter, status: 'ACTIVE' },
        include: { customer: true, vehicle: true },
        take: 10,
        orderBy: { pickupDate: 'desc' },
      }),
      prisma.rental.findMany({
        where: { ...branchFilter, status: 'COMPLETED' },
        include: { customer: true, vehicle: true },
        take: 10,
        orderBy: { returnDate: 'desc' },
      }),
    ]);

    res.json({
      totalVehicles,
      availableVehicles,
      onRentVehicles,
      revenueToday: revenueTodayAggr._sum.totalAmount || 0,
      revenueMonth: revenueMonthAggr._sum.totalAmount || 0,
      activeRentals,
      completedRentals,
    });
  } catch (error: any) {
    console.error('Dashboard error:', error);
    res.status(500).json({ error: 'Failed to load dashboard stats.' });
  }
});

// GET /api/dashboard/admin — Master dashboard for admin
router.get('/admin', requireAdmin, async (req: Request, res: Response) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    // Overall stats
    const [
      totalVehicles,
      availableVehicles,
      onRentVehicles,
      totalActiveRentals,
      revenueTodayAggr,
      revenueMonthAggr,
      totalBranches,
    ] = await Promise.all([
      prisma.vehicle.count(),
      prisma.vehicle.count({ where: { status: 'AVAILABLE' } }),
      prisma.vehicle.count({ where: { status: 'RENTED' } }),
      prisma.rental.count({ where: { status: 'ACTIVE' } }),
      prisma.rental.aggregate({
        _sum: { totalAmount: true },
        where: { status: 'COMPLETED', returnDate: { gte: today } },
      }),
      prisma.rental.aggregate({
        _sum: { totalAmount: true },
        where: { status: 'COMPLETED', returnDate: { gte: startOfMonth } },
      }),
      prisma.branch.count({ where: { isActive: true } }),
    ]);

    // Per-branch breakdown — use groupBy to avoid N+1 queries
    const branches = await prisma.branch.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    });

    // Batch: group vehicle counts, active rental counts, and revenue by branchId in 4 queries total
    const [vehiclesByBranch, activeRentalsByBranch, revTodayByBranch, revMonthByBranch] = await Promise.all([
      prisma.vehicle.groupBy({
        by: ['branchId'],
        _count: { id: true },
      }),
      prisma.rental.groupBy({
        by: ['branchId'],
        _count: { id: true },
        where: { status: 'ACTIVE' },
      }),
      prisma.rental.groupBy({
        by: ['branchId'],
        _sum: { totalAmount: true },
        where: { status: 'COMPLETED', returnDate: { gte: today } },
      }),
      prisma.rental.groupBy({
        by: ['branchId'],
        _sum: { totalAmount: true },
        where: { status: 'COMPLETED', returnDate: { gte: startOfMonth } },
      }),
    ]);

    // Index results by branchId for O(1) lookup
    const vehicleCountMap = new Map(vehiclesByBranch.map(v => [v.branchId, v._count.id]));
    const activeRentalCountMap = new Map(activeRentalsByBranch.map(a => [a.branchId, a._count.id]));
    const revTodayMap = new Map(revTodayByBranch.map(r => [r.branchId, r._sum.totalAmount || 0]));
    const revMonthMap = new Map(revMonthByBranch.map(r => [r.branchId, r._sum.totalAmount || 0]));

    const branchStats = branches.map((branch) => ({
      id: branch.id,
      name: branch.name,
      location: branch.location,
      vehicles: vehicleCountMap.get(branch.id) || 0,
      activeRentals: activeRentalCountMap.get(branch.id) || 0,
      revenueToday: revTodayMap.get(branch.id) || 0,
      revenueMonth: revMonthMap.get(branch.id) || 0,
    }));

    res.json({
      overall: {
        totalVehicles,
        availableVehicles,
        onRentVehicles,
        totalActiveRentals,
        revenueToday: revenueTodayAggr._sum.totalAmount || 0,
        revenueMonth: revenueMonthAggr._sum.totalAmount || 0,
        totalBranches,
      },
      branches: branchStats,
    });
  } catch (error: any) {
    console.error('Admin dashboard error:', error);
    res.status(500).json({ error: 'Failed to load admin dashboard.' });
  }
});

export default router;
