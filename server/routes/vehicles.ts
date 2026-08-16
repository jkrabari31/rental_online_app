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
    const branchId = user.role === 'ADMIN' ? targetBranchId : user.branchId;

    if (!branchId) {
      res.status(400).json({ error: 'Branch ID is required.' });
      return;
    }

    const vehicle = await prisma.vehicle.create({
      data: {
        ...req.body,
        branchId,
      },
    });

    res.status(201).json(vehicle);
  } catch (error: any) {
    console.error('Create vehicle error:', error);
    if (error.code === 'P2002') {
      res.status(400).json({ error: 'Vehicle number already exists.' });
      return;
    }
    res.status(500).json({ error: 'Failed to create vehicle.' });
  }
});

// PUT /api/vehicles/:id
router.put('/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { id: _, createdAt, updatedAt, branchId: _b, branch: _br, rentals: _r, maintenance: _m, ...data } = req.body;

    if (data.status === 'AVAILABLE') {
      const activeRental = await prisma.rental.findFirst({
        where: { vehicleId: id, status: 'ACTIVE' },
      });
      if (activeRental) {
        res.status(400).json({ error: 'Cannot set vehicle to AVAILABLE — it has an active rental. Complete the return first.' });
        return;
      }
    }

    const vehicle = await prisma.vehicle.update({
      where: { id },
      data,
    });

    res.json(vehicle);
  } catch (error: any) {
    console.error('Update vehicle error:', error);
    res.status(500).json({ error: 'Failed to update vehicle.' });
  }
});

// DELETE /api/vehicles/:id
router.delete('/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    await prisma.vehicle.delete({ where: { id } });
    res.json({ success: true });
  } catch (error: any) {
    console.error('Delete vehicle error:', error);
    res.status(500).json({ error: 'Failed to delete vehicle.' });
  }
});

export default router;
