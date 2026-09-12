import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';
import { requireAdmin, requireAuth } from '../middleware/auth.js';

const router = Router();

// In-memory cache for settings (queried on nearly every page load, rarely changes)
let settingsCache: { data: any; expiresAt: number } | null = null;
const SETTINGS_CACHE_TTL = 60_000; // 60 seconds

// GET /api/settings — readable by ALL logged-in users (branch needs rounding rule)
router.get('/', requireAuth, async (req: Request, res: Response) => {
  try {
    // Serve from cache if valid
    if (settingsCache && Date.now() < settingsCache.expiresAt) {
      res.json(settingsCache.data);
      return;
    }

    let setting = await prisma.setting.findFirst();
    if (!setting) {
      setting = await prisma.setting.create({ data: {} });
    }

    // Populate cache
    settingsCache = { data: setting, expiresAt: Date.now() + SETTINGS_CACHE_TTL };

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
      // Invalidate cache immediately after update
      settingsCache = null;
      res.json(updated);
    } else {
      const created = await prisma.setting.create({ data: req.body });
      settingsCache = null;
      res.json(created);
    }
  } catch (error: any) {
    console.error('Update settings error:', error);
    res.status(500).json({ error: 'Failed to update settings.' });
  }
});

export default router;
