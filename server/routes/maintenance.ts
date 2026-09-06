import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';
import { requireAuth, getBranchScope } from '../middleware/auth.js';

const router = Router();

// GET /api/maintenance
router.get('/', requireAuth, async (req: Request, res: Response) => {
  try {
    const branchId = getBranchScope(req);
    const where: any = {};
    if (branchId) where.branchId = branchId;

    const records = await prisma.maintenanceExpense.findMany({
      where,
      include: { vehicle: true },
      orderBy: { date: 'desc' },
    });

    res.json(records);
  } catch (error: any) {
    console.error('Get maintenance error:', error);
    res.status(500).json({ error: 'Failed to load maintenance records.' });
  }
});

// POST /api/maintenance
router.post('/', requireAuth, async (req: Request, res: Response) => {
  try {
    const { vehicleId, date, amount, remarks } = req.body;
    if (!vehicleId) {
      res.status(400).json({ error: 'Vehicle ID is required.' });
      return;
    }

    const targetVehicle = await prisma.vehicle.findUnique({ where: { id: vehicleId } });
    if (!targetVehicle) {
      res.status(404).json({ error: 'Selected vehicle not found.' });
      return;
    }

    const user = req.session.user!;
    let branchId = user.role === 'ADMIN'
      ? (req.body.branchId || req.query.branchId || user.branchId || targetVehicle.branchId)
      : (user.branchId || targetVehicle.branchId);

    if (!branchId) {
      branchId = targetVehicle.branchId;
    }

    if (!branchId) {
      res.status(400).json({ error: 'Branch ID is required.' });
      return;
    }

    const record = await prisma.maintenanceExpense.create({
      data: {
        vehicleId,
        branchId,
        date: new Date(date),
        amount: parseFloat(amount) || 0,
        remarks: remarks || null,
      },
    });

    res.status(201).json(record);
  } catch (error: any) {
    console.error('Create maintenance error:', error);
    res.status(500).json({ error: 'Failed to create maintenance record.' });
  }
});

// PUT /api/maintenance/:id
router.put('/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const user = req.session.user!;

    const existing = await prisma.maintenanceExpense.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ error: 'Maintenance record not found.' });
      return;
    }

    if (user.role !== 'ADMIN' && user.branchId && existing.branchId !== user.branchId) {
      res.status(403).json({ error: 'You do not have permission to modify this maintenance record.' });
      return;
    }

    const { vehicleId, date, amount, remarks } = req.body;
    const updateData: any = {};
    if (vehicleId) updateData.vehicleId = vehicleId;
    if (date) updateData.date = new Date(date);
    if (amount !== undefined) updateData.amount = parseFloat(amount);
    if (remarks !== undefined) updateData.remarks = remarks || null;

    const record = await prisma.maintenanceExpense.update({
      where: { id },
      data: updateData,
      include: { vehicle: true },
    });

    res.json(record);
  } catch (error: any) {
    console.error('Update maintenance error:', error);
    res.status(500).json({ error: 'Failed to update maintenance record: ' + error.message });
  }
});

// DELETE /api/maintenance/:id
router.delete('/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const user = req.session.user!;

    const existing = await prisma.maintenanceExpense.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ error: 'Maintenance record not found.' });
      return;
    }

    if (user.role !== 'ADMIN' && user.branchId && existing.branchId !== user.branchId) {
      res.status(403).json({ error: 'You do not have permission to delete this maintenance record.' });
      return;
    }

    await prisma.maintenanceExpense.delete({ where: { id } });
    res.json({ success: true });
  } catch (error: any) {
    console.error('Delete maintenance error:', error);
    res.status(500).json({ error: 'Failed to delete maintenance record: ' + error.message });
  }
});

export default router;
