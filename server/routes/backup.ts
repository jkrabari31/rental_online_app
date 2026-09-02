import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';
import { requireAdmin } from '../middleware/auth.js';

const router = Router();

// ==========================================
// 1. FULL SYSTEM BACKUP (EXPORT ALL DATA)
// ==========================================
// GET /api/backup/full
router.get('/full', requireAdmin, async (req: Request, res: Response) => {
  try {
    const [
      branches,
      users,
      vehicles,
      customers,
      rentals,
      maintenance,
      settings,
    ] = await Promise.all([
      prisma.branch.findMany(),
      prisma.user.findMany({
        select: {
          id: true,
          username: true,
          passwordHash: true,
          displayName: true,
          role: true,
          branchId: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      prisma.vehicle.findMany({
        include: {
          branch: { select: { id: true, name: true } },
        },
      }),
      prisma.customer.findMany({
        include: {
          branch: { select: { id: true, name: true } },
        },
      }),
      prisma.rental.findMany({
        include: {
          branch: { select: { id: true, name: true } },
          customer: { select: { id: true, name: true, mobileNumber: true } },
          vehicle: { select: { id: true, vehicleName: true, vehicleNumber: true } },
        },
      }),
      prisma.maintenanceExpense.findMany({
        include: {
          branch: { select: { id: true, name: true } },
          vehicle: { select: { id: true, vehicleName: true, vehicleNumber: true } },
        },
      }),
      prisma.setting.findFirst(),
    ]);

    const backupPayload = {
      app: 'SB_BIKE_RENTAL',
      version: '2.0.0',
      exportedAt: new Date().toISOString(),
      metadata: {
        totalBranches: branches.length,
        totalUsers: users.length,
        totalVehicles: vehicles.length,
        totalCustomers: customers.length,
        totalRentals: rentals.length,
        totalMaintenance: maintenance.length,
      },
      data: {
        settings: settings || null,
        branches,
        users,
        vehicles,
        customers,
        rentals,
        maintenance,
      },
    };

    res.setHeader('Content-Type', 'application/json');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="sb_rental_backup_${new Date().toISOString().slice(0, 10)}.json"`
    );
    res.json(backupPayload);
  } catch (error: any) {
    console.error('Full backup error:', error);
    res.status(500).json({ error: 'Failed to generate database backup: ' + error.message });
  }
});

// ==========================================
// 2. FULL SYSTEM RESTORE (IMPORT ALL DATA)
// ==========================================
// POST /api/backup/restore
router.post('/restore', requireAdmin, async (req: Request, res: Response) => {
  try {
    const { payload, mode } = req.body; // mode: 'MERGE' (default) or 'OVERWRITE'

    if (!payload || !payload.data) {
      res.status(400).json({ error: 'Invalid backup format. Missing data object.' });
      return;
    }

    const { settings, branches, users, vehicles, customers, rentals, maintenance } = payload.data;

    let restoredStats = {
      branches: 0,
      users: 0,
      vehicles: 0,
      customers: 0,
      rentals: 0,
      maintenance: 0,
      settings: false,
    };

    // 1. Restore Settings
    if (settings) {
      const existing = await prisma.setting.findFirst();
      const { id, updatedAt, ...settingData } = settings;
      if (existing) {
        await prisma.setting.update({
          where: { id: existing.id },
          data: settingData,
        });
      } else {
        await prisma.setting.create({
          data: settingData,
        });
      }
      restoredStats.settings = true;
    }

    // 2. Restore Branches
    if (Array.isArray(branches)) {
      for (const b of branches) {
        const { users: _u, vehicles: _v, rentals: _r, customers: _c, maintenance: _m, ...bData } = b;
        await prisma.branch.upsert({
          where: { id: bData.id },
          create: bData,
          update: {
            name: bData.name,
            location: bData.location,
            contactNumber: bData.contactNumber,
            isActive: bData.isActive ?? true,
          },
        });
        restoredStats.branches++;
      }
    }

    // 3. Restore Users
    if (Array.isArray(users)) {
      for (const u of users) {
        const { branch: _b, ...uData } = u;
        // Check if user exists by id or username
        const existing = await prisma.user.findFirst({
          where: { OR: [{ id: uData.id }, { username: uData.username }] },
        });

        if (existing) {
          await prisma.user.update({
            where: { id: existing.id },
            data: {
              displayName: uData.displayName,
              role: uData.role,
              branchId: uData.branchId,
              isActive: uData.isActive,
              passwordHash: uData.passwordHash || existing.passwordHash,
            },
          });
        } else {
          await prisma.user.create({
            data: uData,
          });
        }
        restoredStats.users++;
      }
    }

    // 4. Restore Vehicles
    if (Array.isArray(vehicles)) {
      for (const v of vehicles) {
        const { branch: _b, rentals: _r, maintenance: _m, ...vData } = v;
        // Verify branch exists or fallback
        if (vData.branchId) {
          const branchExists = await prisma.branch.findUnique({ where: { id: vData.branchId } });
          if (!branchExists && branches && branches[0]) {
            vData.branchId = branches[0].id;
          }
        }

        await prisma.vehicle.upsert({
          where: { vehicleNumber: vData.vehicleNumber },
          create: vData,
          update: {
            vehicleName: vData.vehicleName,
            vehicleType: vData.vehicleType,
            branchId: vData.branchId,
            hourlyRate: vData.hourlyRate,
            securityDeposit: vData.securityDeposit,
            rate1hr: vData.rate1hr,
            rate3hr: vData.rate3hr,
            rate6hr: vData.rate6hr,
            rate12hr: vData.rate12hr,
            rate24hr: vData.rate24hr,
            description: vData.description,
            status: vData.status,
          },
        });
        restoredStats.vehicles++;
      }
    }

    // 5. Restore Customers
    if (Array.isArray(customers)) {
      for (const c of customers) {
        const { branch: _b, rentals: _r, ...cData } = c;
        await prisma.customer.upsert({
          where: { id: cData.id },
          create: cData,
          update: {
            name: cData.name,
            mobileNumber: cData.mobileNumber,
            email: cData.email,
            address: cData.address,
            idProofType: cData.idProofType,
            idProofNumber: cData.idProofNumber,
            branchId: cData.branchId,
          },
        });
        restoredStats.customers++;
      }
    }

    // 6. Restore Rentals (if provided)
    if (Array.isArray(rentals)) {
      for (const r of rentals) {
        const { branch: _b, customer: _c, vehicle: _v, ...rData } = r;
        const exists = await prisma.rental.findUnique({ where: { id: rData.id } });
        if (!exists) {
          // Check that foreign keys exist
          const [bExists, cExists, vExists] = await Promise.all([
            prisma.branch.findUnique({ where: { id: rData.branchId } }),
            prisma.customer.findUnique({ where: { id: rData.customerId } }),
            prisma.vehicle.findUnique({ where: { id: rData.vehicleId } }),
          ]);

          if (bExists && cExists && vExists) {
            await prisma.rental.create({
              data: {
                id: rData.id,
                branchId: rData.branchId,
                customerId: rData.customerId,
                vehicleId: rData.vehicleId,
                pickupDate: new Date(rData.pickupDate),
                returnDate: rData.returnDate ? new Date(rData.returnDate) : null,
                depositAmount: rData.depositAmount,
                selectedPackage: rData.selectedPackage || 'HOURLY',
                notes: rData.notes,
                status: rData.status,
                totalHours: rData.totalHours,
                totalAmount: rData.totalAmount,
                settlementAmount: rData.settlementAmount,
                paymentMode: rData.paymentMode || 'CASH',
                isAccident: rData.isAccident || false,
                createdAt: rData.createdAt ? new Date(rData.createdAt) : undefined,
              },
            });
            restoredStats.rentals++;
          }
        }
      }
    }

    res.json({
      success: true,
      message: 'System restore completed successfully!',
      stats: restoredStats,
    });
  } catch (error: any) {
    console.error('System restore error:', error);
    res.status(500).json({ error: 'Failed to restore database: ' + error.message });
  }
});

// ==========================================
// 3. VEHICLE FLEET EXPORT (JSON / API)
// ==========================================
// GET /api/backup/vehicles
router.get('/vehicles', requireAdmin, async (req: Request, res: Response) => {
  try {
    const vehicles = await prisma.vehicle.findMany({
      include: {
        branch: { select: { id: true, name: true, location: true } },
      },
      orderBy: [{ branch: { name: 'asc' } }, { vehicleName: 'asc' }],
    });

    res.json(vehicles);
  } catch (error: any) {
    console.error('Vehicle export error:', error);
    res.status(500).json({ error: 'Failed to export vehicles: ' + error.message });
  }
});

// ==========================================
// 4. VEHICLE FLEET BULK IMPORT (EXCEL / JSON)
// ==========================================
// POST /api/backup/vehicles/import
router.post('/vehicles/import', requireAdmin, async (req: Request, res: Response) => {
  try {
    const { vehicles } = req.body;

    if (!Array.isArray(vehicles) || vehicles.length === 0) {
      res.status(400).json({ error: 'No vehicles provided for import.' });
      return;
    }

    // Cache existing branches by name and ID
    const allBranches = await prisma.branch.findMany();
    const branchMap = new Map<string, string>(); // lowercase name -> branch id
    allBranches.forEach((b) => {
      branchMap.set(b.name.trim().toLowerCase(), b.id);
      branchMap.set(b.id.toLowerCase(), b.id);
    });

    // Default branch fallback if none matched
    let defaultBranchId = allBranches[0]?.id;
    if (!defaultBranchId) {
      const newMain = await prisma.branch.create({
        data: { name: 'Main Branch', location: 'Headquarters' },
      });
      defaultBranchId = newMain.id;
      branchMap.set('main branch', newMain.id);
      branchMap.set(newMain.id.toLowerCase(), newMain.id);
    }

    let createdCount = 0;
    let updatedCount = 0;
    const errors: string[] = [];

    for (let i = 0; i < vehicles.length; i++) {
      const item = vehicles[i];
      const rowNum = i + 1;

      // Extract & normalize fields
      const regNumber = String(item.vehicleNumber || item['Registration Number'] || item['Vehicle Number'] || '').trim().toUpperCase();
      const name = String(item.vehicleName || item['Vehicle Name'] || item['Name'] || '').trim();
      const type = String(item.vehicleType || item['Vehicle Type'] || item['Type'] || 'Scooter').trim();
      const hourlyRate = parseFloat(item.hourlyRate || item['Hourly Rate'] || item['Rate/Hr'] || '0') || 0;
      const securityDeposit = parseFloat(item.securityDeposit || item['Security Deposit'] || item['Deposit'] || '0') || 0;

      const rate1hr = item.rate1hr !== undefined && item.rate1hr !== '' ? parseFloat(item.rate1hr || item['1hr Rate']) : null;
      const rate3hr = item.rate3hr !== undefined && item.rate3hr !== '' ? parseFloat(item.rate3hr || item['3hr Rate']) : null;
      const rate6hr = item.rate6hr !== undefined && item.rate6hr !== '' ? parseFloat(item.rate6hr || item['6hr Rate']) : null;
      const rate12hr = item.rate12hr !== undefined && item.rate12hr !== '' ? parseFloat(item.rate12hr || item['12hr Rate']) : null;
      const rate24hr = item.rate24hr !== undefined && item.rate24hr !== '' ? parseFloat(item.rate24hr || item['24hr Rate']) : null;

      const status = String(item.status || item['Status'] || 'AVAILABLE').trim().toUpperCase();
      const description = item.description || item['Description'] || item['Notes'] || null;

      const branchNameInput = String(item.branchName || item.branch || item['Branch'] || item['Branch Name'] || '').trim();

      if (!regNumber || !name) {
        errors.push(`Row ${rowNum}: Missing Vehicle Name or Registration Number.`);
        continue;
      }

      // Resolve branch: check by name or create if specified
      let resolvedBranchId = defaultBranchId;
      if (branchNameInput) {
        const lowerName = branchNameInput.toLowerCase();
        if (branchMap.has(lowerName)) {
          resolvedBranchId = branchMap.get(lowerName)!;
        } else {
          // Auto-create branch if new branch name in import
          const newBranch = await prisma.branch.create({
            data: { name: branchNameInput },
          });
          resolvedBranchId = newBranch.id;
          branchMap.set(lowerName, newBranch.id);
          branchMap.set(newBranch.id.toLowerCase(), newBranch.id);
        }
      }

      const existingVehicle = await prisma.vehicle.findUnique({
        where: { vehicleNumber: regNumber },
      });

      if (existingVehicle) {
        await prisma.vehicle.update({
          where: { vehicleNumber: regNumber },
          data: {
            vehicleName: name,
            vehicleType: type,
            branchId: resolvedBranchId,
            hourlyRate,
            securityDeposit,
            rate1hr: rate1hr ?? existingVehicle.rate1hr,
            rate3hr: rate3hr ?? existingVehicle.rate3hr,
            rate6hr: rate6hr ?? existingVehicle.rate6hr,
            rate12hr: rate12hr ?? existingVehicle.rate12hr,
            rate24hr: rate24hr ?? existingVehicle.rate24hr,
            status: ['AVAILABLE', 'RENTED', 'INACTIVE'].includes(status) ? status : existingVehicle.status,
            description: description || existingVehicle.description,
          },
        });
        updatedCount++;
      } else {
        await prisma.vehicle.create({
          data: {
            vehicleNumber: regNumber,
            vehicleName: name,
            vehicleType: type,
            branchId: resolvedBranchId,
            hourlyRate,
            securityDeposit,
            rate1hr,
            rate3hr,
            rate6hr,
            rate12hr,
            rate24hr,
            status: ['AVAILABLE', 'RENTED', 'INACTIVE'].includes(status) ? status : 'AVAILABLE',
            description,
          },
        });
        createdCount++;
      }
    }

    res.json({
      success: true,
      created: createdCount,
      updated: updatedCount,
      total: createdCount + updatedCount,
      errors,
    });
  } catch (error: any) {
    console.error('Vehicle import error:', error);
    res.status(500).json({ error: 'Failed to import vehicles: ' + error.message });
  }
});

export default router;
