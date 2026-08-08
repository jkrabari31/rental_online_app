import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';
import { requireAdmin } from '../middleware/auth.js';

const router = Router();

// GET /api/settings
router.get('/', requireAdmin, async (req: Request, res: Response) => {
  try {
    let setting = await prisma.setting.findFirst();
    if (!setting) {
      setting = await prisma.setting.create({ data: {} });
    }
    res.json(setting);
  } catch (error: any) {
    console.error('Get settings error:', error);
    res.status(500).json({ error: 'Failed to load settings.' });
  }
});

// PUT /api/settings
router.put('/', requireAdmin, async (req: Request, res: Response) => {
  try {
    const setting = await prisma.setting.findFirst();
    if (setting) {
      const { id, updatedAt, ...updateData } = req.body;
      const updated = await prisma.setting.update({
        where: { id: setting.id },
        data: updateData,
      });
      res.json(updated);
    } else {
      const created = await prisma.setting.create({ data: req.body });
      res.json(created);
    }
  } catch (error: any) {
    console.error('Update settings error:', error);
    res.status(500).json({ error: 'Failed to update settings.' });
  }
});

export default router;
