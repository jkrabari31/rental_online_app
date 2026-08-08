import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';
import { requireAdmin } from '../middleware/auth.js';

const router = Router();

// GET /api/branches
router.get('/', requireAdmin, async (req: Request, res: Response) => {
  try {
    const branches = await prisma.branch.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { vehicles: true, users: true, rentals: true },
        },
      },
    });
    res.json(branches);
  } catch (error: any) {
    console.error('Get branches error:', error);
    res.status(500).json({ error: 'Failed to load branches.' });
  }
});

// POST /api/branches
router.post('/', requireAdmin, async (req: Request, res: Response) => {
  try {
    const branch = await prisma.branch.create({
      data: {
        name: req.body.name,
        location: req.body.location || null,
        contactNumber: req.body.contactNumber || null,
      },
    });
    res.status(201).json(branch);
  } catch (error: any) {
    console.error('Create branch error:', error);
    res.status(500).json({ error: 'Failed to create branch.' });
  }
});

// PUT /api/branches/:id
router.put('/:id', requireAdmin, async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { id: _, createdAt, updatedAt, _count, users, vehicles, rentals, customers, maintenance, ...data } = req.body;

    const branch = await prisma.branch.update({
      where: { id },
      data,
    });
    res.json(branch);
  } catch (error: any) {
    console.error('Update branch error:', error);
    res.status(500).json({ error: 'Failed to update branch.' });
  }
});

// DELETE /api/branches/:id — Deactivate (soft delete)
router.delete('/:id', requireAdmin, async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const branch = await prisma.branch.update({
      where: { id },
      data: { isActive: false },
    });
    res.json(branch);
  } catch (error: any) {
    console.error('Delete branch error:', error);
    res.status(500).json({ error: 'Failed to deactivate branch.' });
  }
});

export default router;
