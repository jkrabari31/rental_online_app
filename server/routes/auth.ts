import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';
import { compareSync } from 'bcryptjs';

const router = Router();

// POST /api/auth/login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400).json({ error: 'Username and password are required.' });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { username },
      include: { branch: true },
    });

    if (!user || !user.isActive) {
      res.status(401).json({ error: 'Invalid credentials.' });
      return;
    }

    const passwordValid = compareSync(password, user.passwordHash);
    if (!passwordValid) {
      res.status(401).json({ error: 'Invalid credentials.' });
      return;
    }

    // Set session
    req.session.user = {
      id: user.id,
      username: user.username,
      displayName: user.displayName,
      role: user.role,
      branchId: user.branchId || undefined,
      branchName: user.branch?.name || undefined,
    };

    res.json({
      user: req.session.user,
    });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// POST /api/auth/logout
router.post('/logout', (req: Request, res: Response) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
      res.status(500).json({ error: 'Failed to logout.' });
      return;
    }
    res.clearCookie('connect.sid');
    res.json({ success: true });
  });
});

// GET /api/auth/me
router.get('/me', (req: Request, res: Response) => {
  if (!req.session.user) {
    res.status(401).json({ error: 'Not authenticated.' });
    return;
  }
  res.json({ user: req.session.user });
});

export default router;
