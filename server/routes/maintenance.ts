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
    const user = req.session.user!;
    const branchId = user.role === 'ADMIN'
      ? (req.body.branchId || req.query.branchId)
      : user.branchId;

    if (!branchId) {
      res.status(400).json({ error: 'Branch ID is required.' });
      return;
    }

    const record = await prisma.maintenanceExpense.create({
      data: {
        vehicleId: req.body.vehicleId,
        branchId,
        date: new Date(req.body.date),
        amount: parseFloat(req.body.amount),
        remarks: req.body.remarks || null,
      },
    });

    res.status(201).json(record);
  } catch (error: any) {
    console.error('Create maintenance error:', error);
    res.status(500).json({ error: 'Failed to create maintenance record.' });
  }
});

export default router;
