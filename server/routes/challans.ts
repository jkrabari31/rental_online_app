import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const router = Router();

// GET /api/challans — List challans
router.get('/', requireAuth, async (req: Request, res: Response) => {
  try {
    const { status, vehicleId, customerId, mobileNumber, branchId } = req.query;

    const where: any = {};

    if (status && status !== 'ALL') {
      where.status = status as string;
    }

    if (vehicleId) {
      where.vehicleId = vehicleId as string;
    }

    if (customerId) {
      where.customerId = customerId as string;
    }

    if (mobileNumber) {
      where.customer = {
        mobileNumber: mobileNumber as string,
      };
    }

    if (branchId && branchId !== 'ALL') {
      where.branchId = branchId as string;
    }

    const challans = await prisma.challan.findMany({
      where,
      include: {
        vehicle: {
          select: {
            id: true,
            vehicleName: true,
            vehicleNumber: true,
            vehicleType: true,
          },
        },
        customer: {
          select: {
            id: true,
            name: true,
            mobileNumber: true,
            idProofType: true,
            idProofNumber: true,
          },
        },
        rental: {
          select: {
            id: true,
            pickupDate: true,
            returnDate: true,
            status: true,
            selectedPackage: true,
          },
        },
        branch: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        challanDate: 'desc',
      },
    });

    res.json(challans);
  } catch (error: any) {
    console.error('Get challans error:', error);
    res.status(500).json({ error: 'Failed to fetch challans: ' + error.message });
  }
});

// GET /api/challans/check-customer — Quick check for pending fines by mobile number or customerId
router.get('/check-customer', requireAuth, async (req: Request, res: Response) => {
  try {
    const mobileNumber = req.query.mobileNumber as string | undefined;
    const customerId = req.query.customerId as string | undefined;

    if (!mobileNumber && !customerId) {
      res.status(400).json({ error: 'mobileNumber or customerId is required.' });
      return;
    }

    const where: any = {
      status: 'PENDING',
    };

    if (customerId) {
      where.customerId = customerId;
    } else if (mobileNumber) {
      where.customer = {
        mobileNumber: mobileNumber.trim(),
      };
    }

    const pendingChallans = await prisma.challan.findMany({
      where,
      include: {
        vehicle: {
          select: {
            id: true,
            vehicleName: true,
            vehicleNumber: true,
          },
        },
        customer: {
          select: {
            id: true,
            name: true,
            mobileNumber: true,
          },
        },
        branch: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        challanDate: 'desc',
      },
    });

    const totalPendingAmount = pendingChallans.reduce((sum, c) => sum + (c.amount || 0), 0);

    res.json({
      hasPending: pendingChallans.length > 0,
      totalPendingAmount,
      count: pendingChallans.length,
      pendingChallans,
    });
  } catch (error: any) {
    console.error('Check customer challans error:', error);
    res.status(500).json({ error: 'Failed to check customer challan status: ' + error.message });
  }
});

// POST /api/challans/auto-match — Find the rental & customer who had the vehicle at the challan violation date & time
router.post('/auto-match', requireAuth, async (req: Request, res: Response) => {
  try {
    const { vehicleId, challanDate } = req.body;

    if (!vehicleId || !challanDate) {
      res.status(400).json({ error: 'vehicleId and challanDate are required.' });
      return;
    }

    const targetDate = new Date(challanDate);
    if (isNaN(targetDate.getTime())) {
      res.status(400).json({ error: 'Invalid challan date and time.' });
      return;
    }

    // 1. Look for exact match: rental where pickupDate <= targetDate and (returnDate >= targetDate OR status is ACTIVE and pickupDate <= targetDate)
    const exactRental = await prisma.rental.findFirst({
      where: {
        vehicleId,
        pickupDate: { lte: targetDate },
        OR: [
          { returnDate: { gte: targetDate } },
          { status: 'ACTIVE' },
        ],
      },
      include: {
        customer: true,
        vehicle: true,
        branch: true,
      },
      orderBy: {
        pickupDate: 'desc',
      },
    });

    if (exactRental) {
      res.json({
        matched: true,
        rental: exactRental,
        customer: exactRental.customer,
        vehicle: exactRental.vehicle,
      });
      return;
    }

    // 2. If no exact match, search for rentals within +/- 48 hours for helpful suggestions
    const startWindow = new Date(targetDate.getTime() - 48 * 60 * 60 * 1000);
    const endWindow = new Date(targetDate.getTime() + 48 * 60 * 60 * 1000);

    const nearbyRentals = await prisma.rental.findMany({
      where: {
        vehicleId,
        OR: [
          { pickupDate: { gte: startWindow, lte: endWindow } },
          { returnDate: { gte: startWindow, lte: endWindow } },
        ],
      },
      include: {
        customer: true,
        vehicle: true,
        branch: true,
      },
      orderBy: {
        pickupDate: 'desc',
      },
      take: 5,
    });

    res.json({
      matched: false,
      message: 'No exact rental was found covering this exact date & time.',
      nearbyRentals,
    });
  } catch (error: any) {
    console.error('Auto match challan error:', error);
    res.status(500).json({ error: 'Failed to auto-match rental: ' + error.message });
  }
});

// POST /api/challans — Create a new Challan entry
router.post('/', requireAuth, async (req: Request, res: Response) => {
  try {
    const {
      vehicleId,
      rentalId,
      customerId,
      challanNumber,
      challanDate,
      amount,
      reason,
      notes,
    } = req.body;

    if (!vehicleId) {
      res.status(400).json({ error: 'Vehicle is required.' });
      return;
    }

    if (!challanDate) {
      res.status(400).json({ error: 'Challan violation date & time is required.' });
      return;
    }

    const fineAmount = parseFloat(amount);
    if (isNaN(fineAmount) || fineAmount <= 0) {
      res.status(400).json({ error: 'A valid fine amount greater than 0 is required.' });
      return;
    }

    // Resolve vehicle
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: vehicleId },
      include: { branch: true },
    });

    if (!vehicle) {
      res.status(404).json({ error: 'Vehicle not found.' });
      return;
    }

    let finalCustomerId = customerId;
    let finalRentalId = rentalId ? parseInt(String(rentalId), 10) : null;
    let finalBranchId = vehicle.branchId;

    // If rentalId is provided, retrieve customer and branch from it
    if (finalRentalId && !isNaN(finalRentalId)) {
      const rental = await prisma.rental.findUnique({
        where: { id: finalRentalId },
      });
      if (rental) {
        finalCustomerId = finalCustomerId || rental.customerId;
        finalBranchId = rental.branchId || finalBranchId;
      }
    }

    if (!finalCustomerId) {
      res.status(400).json({ error: 'Customer could not be resolved. Please ensure a customer is linked to this challan.' });
      return;
    }

    const customer = await prisma.customer.findUnique({
      where: { id: finalCustomerId },
    });

    if (!customer) {
      res.status(404).json({ error: 'Customer not found.' });
      return;
    }

    const challan = await prisma.challan.create({
      data: {
        challanNumber: challanNumber ? String(challanNumber).trim() : null,
        vehicleId,
        rentalId: finalRentalId && !isNaN(finalRentalId) ? finalRentalId : null,
        customerId: finalCustomerId,
        branchId: finalBranchId,
        challanDate: new Date(challanDate),
        amount: fineAmount,
        reason: reason ? String(reason).trim() : 'Traffic Violation',
        notes: notes ? String(notes).trim() : null,
        status: 'PENDING',
      },
      include: {
        vehicle: true,
        customer: true,
        rental: true,
        branch: true,
      },
    });

    res.status(201).json(challan);
  } catch (error: any) {
    console.error('Create challan error:', error);
    res.status(500).json({ error: 'Failed to create challan: ' + error.message });
  }
});

// POST /api/challans/:id/pay — Clear / Pay a challan fine (Accessible by both Admin and Branch staff upon collecting fine)
router.post('/:id/pay', requireAuth, async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const { paidPaymentMode, paymentNotes } = req.body;

    if (!paidPaymentMode || !['CASH', 'ONLINE'].includes(paidPaymentMode)) {
      res.status(400).json({ error: 'Payment mode (CASH or ONLINE) is required to clear challan.' });
      return;
    }

    const existingChallan = await prisma.challan.findUnique({
      where: { id },
    });

    if (!existingChallan) {
      res.status(404).json({ error: 'Challan record not found.' });
      return;
    }

    if (existingChallan.status === 'PAID') {
      res.status(400).json({ error: 'This challan has already been paid and cleared.' });
      return;
    }

    const updated = await prisma.challan.update({
      where: { id },
      data: {
        status: 'PAID',
        paidAt: new Date(),
        paidPaymentMode: paidPaymentMode as 'CASH' | 'ONLINE',
        paymentNotes: paymentNotes ? String(paymentNotes).trim() : null,
      },
      include: {
        vehicle: true,
        customer: true,
        rental: true,
        branch: true,
      },
    });

    res.json(updated);
  } catch (error: any) {
    console.error('Pay challan error:', error);
    res.status(500).json({ error: 'Failed to clear challan: ' + error.message });
  }
});

// DELETE /api/challans/:id — Admin only: Delete/cancel wrongly entered challan
router.delete('/:id', requireAdmin, async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    await prisma.challan.delete({
      where: { id },
    });

    res.json({ success: true, message: 'Challan deleted successfully.' });
  } catch (error: any) {
    console.error('Delete challan error:', error);
    res.status(500).json({ error: 'Failed to delete challan: ' + error.message });
  }
});

export default router;
