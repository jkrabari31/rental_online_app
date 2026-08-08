import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';
import { requireAdmin } from '../middleware/auth.js';
import { hashSync } from 'bcryptjs';

const router = Router();

// GET /api/users
router.get('/', requireAdmin, async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        username: true,
        displayName: true,
        role: true,
        branchId: true,
        branch: { select: { id: true, name: true } },
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    res.json(users);
  } catch (error: any) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Failed to load users.' });
  }
});

// POST /api/users
router.post('/', requireAdmin, async (req: Request, res: Response) => {
  try {
    const { username, password, displayName, role, branchId } = req.body;

    if (!username || !password || !displayName) {
      res.status(400).json({ error: 'Username, password, and display name are required.' });
      return;
    }

    if (role === 'BRANCH' && !branchId) {
      res.status(400).json({ error: 'Branch users must be assigned to a branch.' });
      return;
    }

    const user = await prisma.user.create({
      data: {
        username,
        passwordHash: hashSync(password, 12),
        displayName,
        role: role || 'BRANCH',
        branchId: branchId || null,
      },
      select: {
        id: true,
        username: true,
        displayName: true,
        role: true,
        branchId: true,
        isActive: true,
        createdAt: true,
      },
    });

    res.status(201).json(user);
  } catch (error: any) {
    console.error('Create user error:', error);
    if (error.code === 'P2002') {
      res.status(400).json({ error: 'Username already exists.' });
      return;
    }
    res.status(500).json({ error: 'Failed to create user.' });
  }
});

// PUT /api/users/:id
router.put('/:id', requireAdmin, async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { password, username: _u, id: _id, createdAt, updatedAt, branch, passwordHash: _ph, ...data } = req.body;

    const updateData: any = { ...data };

    if (password && password.trim() !== '') {
      updateData.passwordHash = hashSync(password, 12);
    }

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        username: true,
        displayName: true,
        role: true,
        branchId: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.json(user);
  } catch (error: any) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Failed to update user.' });
  }
});

// DELETE /api/users/:id — Deactivate (soft delete)
router.delete('/:id', requireAdmin, async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    if (req.session.user!.id === id) {
      res.status(400).json({ error: 'Cannot deactivate your own account.' });
      return;
    }

    const user = await prisma.user.update({
      where: { id },
      data: { isActive: false },
    });

    res.json(user);
  } catch (error: any) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Failed to deactivate user.' });
  }
});

export default router;
