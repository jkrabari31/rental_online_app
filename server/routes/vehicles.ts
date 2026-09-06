import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';
import { requireAuth, getBranchScope } from '../middleware/auth.js';

const router = Router();

// GET /api/vehicles
router.get('/', requireAuth, async (req: Request, res: Response) => {
  try {
    const branchId = getBranchScope(req);
    const status = req.query.status as string | undefined;
    const includeAllBranches = req.query.includeAllBranches === 'true';

    const where: any = {};
    if (branchId && !includeAllBranches) where.branchId = branchId;
    if (status) where.status = status;

    const vehicles = await prisma.vehicle.findMany({
      where,
      include: { branch: true },
      orderBy: { createdAt: 'desc' },
    });

    res.json(vehicles);
  } catch (error: any) {
    console.error('Get vehicles error:', error);
    res.status(500).json({ error: 'Failed to load vehicles.' });
  }
});

// POST /api/vehicles
router.post('/', requireAuth, async (req: Request, res: Response) => {
  try {
    const user = req.session.user!;
    const targetBranchId = (req.body.branchId || req.query.branchId) as string | undefined;
    let branchId = user.role === 'ADMIN' ? (targetBranchId || user.branchId) : user.branchId;

    if (!branchId && user.role === 'ADMIN') {
      const firstBranch = await prisma.branch.findFirst({
        where: { isActive: true },
        orderBy: { createdAt: 'asc' },
      });
      if (firstBranch) {
        branchId = firstBranch.id;
      }
    }

    if (!branchId) {
      res.status(400).json({ error: 'Branch ID is required. Please create or select a branch.' });
      return;
    }

    const {
      vehicleNumber,
      vehicleName,
      vehicleType,
      hourlyRate,
      securityDeposit,
      rate1hr,
      rate3hr,
      rate6hr,
      rate12hr,
      rate24hr,
      description,
      status,
    } = req.body;

    if (!vehicleNumber || !vehicleName) {
      res.status(400).json({ error: 'Vehicle number and name are required.' });
      return;
    }

    const vehicle = await prisma.vehicle.create({
      data: {
        vehicleNumber: String(vehicleNumber).trim().toUpperCase(),
        vehicleName: String(vehicleName).trim(),
        vehicleType: String(vehicleType || 'Scooter').trim(),
        hourlyRate: Number(hourlyRate) || 0,
        securityDeposit: Number(securityDeposit) || 0,
        rate1hr: rate1hr !== undefined && rate1hr !== null && rate1hr !== '' ? Number(rate1hr) : null,
        rate3hr: rate3hr !== undefined && rate3hr !== null && rate3hr !== '' ? Number(rate3hr) : null,
        rate6hr: rate6hr !== undefined && rate6hr !== null && rate6hr !== '' ? Number(rate6hr) : null,
        rate12hr: rate12hr !== undefined && rate12hr !== null && rate12hr !== '' ? Number(rate12hr) : null,
        rate24hr: rate24hr !== undefined && rate24hr !== null && rate24hr !== '' ? Number(rate24hr) : null,
        description: description ? String(description).trim() : null,
        status: ['AVAILABLE', 'RENTED', 'INACTIVE'].includes(status) ? status : 'AVAILABLE',
        branchId,
      },
      include: { branch: true },
    });

    res.status(201).json(vehicle);
  } catch (error: any) {
    console.error('Create vehicle error:', error);
    if (error.code === 'P2002') {
      res.status(400).json({ error: 'Vehicle number already exists.' });
      return;
    }
    res.status(500).json({ error: 'Failed to create vehicle: ' + error.message });
  }
});

// PUT /api/vehicles/:id
router.put('/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const user = req.session.user!;

    const existing = await prisma.vehicle.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ error: 'Vehicle not found.' });
      return;
    }

    // Branch scoping
    if (user.role !== 'ADMIN' && user.branchId && existing.branchId !== user.branchId) {
      res.status(403).json({ error: 'You do not have permission to modify this vehicle.' });
      return;
    }

    const {
      vehicleNumber,
      vehicleName,
      vehicleType,
      hourlyRate,
      securityDeposit,
      rate1hr,
      rate3hr,
      rate6hr,
      rate12hr,
      rate24hr,
      description,
      status,
      branchId,
    } = req.body;

    const dataToUpdate: any = {};
    if (vehicleNumber !== undefined) dataToUpdate.vehicleNumber = String(vehicleNumber).trim().toUpperCase();
    if (vehicleName !== undefined) dataToUpdate.vehicleName = String(vehicleName).trim();
    if (vehicleType !== undefined) dataToUpdate.vehicleType = String(vehicleType).trim();
    if (hourlyRate !== undefined) dataToUpdate.hourlyRate = Number(hourlyRate);
    if (securityDeposit !== undefined) dataToUpdate.securityDeposit = Number(securityDeposit);
    if (rate1hr !== undefined) dataToUpdate.rate1hr = rate1hr !== null && rate1hr !== '' ? Number(rate1hr) : null;
    if (rate3hr !== undefined) dataToUpdate.rate3hr = rate3hr !== null && rate3hr !== '' ? Number(rate3hr) : null;
    if (rate6hr !== undefined) dataToUpdate.rate6hr = rate6hr !== null && rate6hr !== '' ? Number(rate6hr) : null;
    if (rate12hr !== undefined) dataToUpdate.rate12hr = rate12hr !== null && rate12hr !== '' ? Number(rate12hr) : null;
    if (rate24hr !== undefined) dataToUpdate.rate24hr = rate24hr !== null && rate24hr !== '' ? Number(rate24hr) : null;
    if (description !== undefined) dataToUpdate.description = description ? String(description).trim() : null;
    if (user.role === 'ADMIN' && branchId) dataToUpdate.branchId = branchId;

    if (status !== undefined) {
      if (status === 'AVAILABLE') {
        const activeRental = await prisma.rental.findFirst({
          where: { vehicleId: id, status: 'ACTIVE' },
        });
        if (activeRental) {
          res.status(400).json({ error: 'Cannot set vehicle to AVAILABLE — it has an active rental. Complete the return first.' });
          return;
        }
      }
      if (['AVAILABLE', 'RENTED', 'INACTIVE'].includes(status)) {
        dataToUpdate.status = status;
      }
    }

    const vehicle = await prisma.vehicle.update({
      where: { id },
      data: dataToUpdate,
      include: { branch: true },
    });

    res.json(vehicle);
  } catch (error: any) {
    console.error('Update vehicle error:', error);
    if (error.code === 'P2002') {
      res.status(400).json({ error: 'Vehicle number already exists.' });
      return;
    }
    res.status(500).json({ error: 'Failed to update vehicle: ' + error.message });
  }
});

// DELETE /api/vehicles/:id
router.delete('/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const user = req.session.user!;

    const vehicle = await prisma.vehicle.findUnique({ where: { id } });
    if (!vehicle) {
      res.status(404).json({ error: 'Vehicle not found.' });
      return;
    }

    if (user.role !== 'ADMIN' && user.branchId && vehicle.branchId !== user.branchId) {
      res.status(403).json({ error: 'You do not have permission to delete this vehicle.' });
      return;
    }

    // Check for active rentals
    const activeRental = await prisma.rental.findFirst({
      where: { vehicleId: id, status: 'ACTIVE' },
    });
    if (activeRental) {
      res.status(400).json({ error: 'Cannot delete vehicle with an active rental. Complete or cancel the rental first.' });
      return;
    }

    // Check if vehicle has historical rentals or maintenance records
    const rentalCount = await prisma.rental.count({ where: { vehicleId: id } });
    if (rentalCount > 0) {
      // Set to INACTIVE instead of deleting to preserve financial/rental audit history
      await prisma.vehicle.update({
        where: { id },
        data: { status: 'INACTIVE' },
      });
      res.json({ success: true, message: 'Vehicle has rental history, marked as INACTIVE to preserve records.' });
      return;
    }

    // Delete associated maintenance if any
    await prisma.maintenanceExpense.deleteMany({ where: { vehicleId: id } });
    await prisma.vehicle.delete({ where: { id } });
    res.json({ success: true });
  } catch (error: any) {
    console.error('Delete vehicle error:', error);
    res.status(500).json({ error: 'Failed to delete vehicle: ' + error.message });
  }
});

export default router;
