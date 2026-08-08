import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';
import { requireAuth, getBranchScope } from '../middleware/auth.js';

const router = Router();

// GET /api/customers
router.get('/', requireAuth, async (req: Request, res: Response) => {
  try {
    const branchId = getBranchScope(req);
    const where: any = {};
    if (branchId) where.branchId = branchId;

    const customers = await prisma.customer.findMany({ where });
    res.json(customers);
  } catch (error: any) {
    console.error('Get customers error:', error);
    res.status(500).json({ error: 'Failed to load customers.' });
  }
});

// GET /api/customers/find?mobileNumber=xxx
router.get('/find', requireAuth, async (req: Request, res: Response) => {
  try {
    const mobileNumber = req.query.mobileNumber as string;
    if (!mobileNumber) {
      res.status(400).json({ error: 'Mobile number is required.' });
      return;
    }

    const branchId = getBranchScope(req);
    const where: any = { mobileNumber };
    if (branchId) where.branchId = branchId;

    const customer = await prisma.customer.findFirst({
      where,
      orderBy: { createdAt: 'desc' },
    });

    res.json(customer);
  } catch (error: any) {
    console.error('Find customer error:', error);
    res.status(500).json({ error: 'Failed to find customer.' });
  }
});

export default router;
