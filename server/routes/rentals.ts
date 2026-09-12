import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';
import { requireAuth, requireAdmin, getBranchScope } from '../middleware/auth.js';

const router = Router();

// GET /api/rentals
router.get('/', requireAuth, async (req: Request, res: Response) => {
  try {
    const branchId = getBranchScope(req);
    const where: any = {};
    if (branchId) {
      where.OR = [
        { branchId },
        { vehicle: { branchId } },
      ];
    }

    if (req.query.status) where.status = req.query.status as string;

    if (req.query.returnDateGte || req.query.returnDateLte) {
      where.returnDate = {};
      if (req.query.returnDateGte) where.returnDate.gte = new Date(req.query.returnDateGte as string);
      if (req.query.returnDateLte) where.returnDate.lte = new Date(req.query.returnDateLte as string);
    }
    if (req.query.pickupDateGte || req.query.pickupDateLte) {
      where.pickupDate = {};
      if (req.query.pickupDateGte) where.pickupDate.gte = new Date(req.query.pickupDateGte as string);
      if (req.query.pickupDateLte) where.pickupDate.lte = new Date(req.query.pickupDateLte as string);
    }

    if (req.query.vehicleId) where.vehicleId = req.query.vehicleId as string;

    const rentals = await prisma.rental.findMany({
      where,
      include: {
        customer: { select: { id: true, name: true, mobileNumber: true, email: true, address: true, idProofType: true, idProofNumber: true } },
        vehicle: { select: { id: true, vehicleName: true, vehicleNumber: true, vehicleType: true, hourlyRate: true, securityDeposit: true, rate1hr: true, rate3hr: true, rate6hr: true, rate12hr: true, rate24hr: true, status: true, branchId: true, branch: { select: { id: true, name: true } } } },
        branch: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(rentals);
  } catch (error: any) {
    console.error('Get rentals error:', error);
    res.status(500).json({ error: 'Failed to load rentals.' });
  }
});

// POST /api/rentals — Create rental
router.post('/', requireAuth, async (req: Request, res: Response) => {
  try {
    const { customerData, ...rentalData } = req.body;

    if (!rentalData.vehicleId) {
      res.status(400).json({ error: 'Vehicle ID is required to create a rental.' });
      return;
    }

    // Verify vehicle availability
    const targetVehicle = await prisma.vehicle.findUnique({ where: { id: rentalData.vehicleId } });
    if (!targetVehicle) {
      res.status(404).json({ error: 'Selected vehicle not found.' });
      return;
    }
    if (targetVehicle.status === 'RENTED') {
      res.status(400).json({ error: 'This vehicle is currently already on rent.' });
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

    let customer;
    if (customerData.id) {
      const { id, createdAt, updatedAt, ...updateData } = customerData;
      customer = await prisma.customer.update({
        where: { id: customerData.id },
        data: updateData,
      });
    } else {
      customer = await prisma.customer.create({
        data: {
          name: customerData.name || '',
          mobileNumber: customerData.mobileNumber || '',
          email: customerData.email || null,
          address: customerData.address || null,
          idProofType: customerData.idProofType || 'Aadhaar Card',
          idProofNumber: customerData.idProofNumber || '',
          branchId,
        },
      });
    }

    const depositPaymentMode = (rentalData.depositPaymentMode === 'ONLINE' ? 'ONLINE' : 'CASH');

    const [rental] = await prisma.$transaction([
      prisma.rental.create({
        data: {
          vehicleId: rentalData.vehicleId,
          customerId: customer.id,
          branchId,
          pickupDate: new Date(rentalData.pickupDate),
          depositAmount: Number(rentalData.depositAmount) || 0,
          depositPaymentMode,
          paymentMode: depositPaymentMode,
          selectedPackage: rentalData.selectedPackage || 'HOURLY',
          notes: rentalData.notes || null,
        },
      }),
      prisma.vehicle.update({
        where: { id: rentalData.vehicleId },
        data: { status: 'RENTED' },
      }),
    ]);

    res.status(201).json(rental);
  } catch (error: any) {
    console.error('Create rental error:', error);
    res.status(500).json({ error: 'Failed to create rental: ' + error.message });
  }
});

// POST /api/rentals/:id/return — Complete return
router.post('/:id/return', requireAuth, async (req: Request, res: Response) => {
  try {
    const user = req.session.user!;
    const paramId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const rentalId = parseInt(paramId, 10);

    if (isNaN(rentalId)) {
      res.status(400).json({ error: 'Invalid rental ID.' });
      return;
    }

    const rental = await prisma.rental.findUnique({ where: { id: rentalId } });
    if (!rental) {
      res.status(404).json({ error: 'Rental record not found.' });
      return;
    }

    if (rental.status === 'COMPLETED') {
      res.status(400).json({ error: 'This rental has already been marked as completed.' });
      return;
    }

    if (user.role !== 'ADMIN' && user.branchId && rental.branchId !== user.branchId) {
      res.status(403).json({ error: 'You do not have permission to return rentals for another branch.' });
      return;
    }

    const { returnData, vehicleId } = req.body;
    const targetVehicleId = vehicleId || rental.vehicleId;

    const [completedRental] = await prisma.$transaction([
      prisma.rental.update({
        where: { id: rentalId },
        data: {
          returnDate: returnData?.returnDate ? new Date(returnData.returnDate) : new Date(),
          totalHours: Number(returnData?.totalHours) || 0,
          totalAmount: Number(returnData?.totalAmount) || 0,
          settlementAmount: Number(returnData?.settlementAmount) || 0,
          paymentMode: returnData?.paymentMode || 'CASH',
          notes: returnData?.notes || rental.notes || null,
          status: 'COMPLETED',
        },
      }),
      prisma.vehicle.update({
        where: { id: targetVehicleId },
        data: { status: 'AVAILABLE' },
      }),
    ]);

    res.json(completedRental);
  } catch (error: any) {
    console.error('Return vehicle error:', error);
    res.status(500).json({ error: 'Failed to complete return: ' + error.message });
  }
});

// POST /api/rentals/:id/swap — Swap vehicle
router.post('/:id/swap', requireAuth, async (req: Request, res: Response) => {
  try {
    const paramId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const rentalId = parseInt(paramId, 10);
    if (isNaN(rentalId)) {
      res.status(400).json({ error: 'Invalid rental ID.' });
      return;
    }
    const { oldVehicleId, newVehicleId, oldVehicleStatus, notesAppend } = req.body;

    const rental = await prisma.rental.findUnique({ where: { id: rentalId } });
    if (!rental) {
      res.status(404).json({ error: 'Rental not found.' });
      return;
    }

    const newNotes = rental.notes ? `${rental.notes}\n\n${notesAppend}` : notesAppend;

    const [updatedRental] = await prisma.$transaction([
      prisma.rental.update({
        where: { id: rentalId },
        data: { vehicleId: newVehicleId, notes: newNotes },
      }),
      prisma.vehicle.update({
        where: { id: oldVehicleId },
        data: { status: oldVehicleStatus || 'AVAILABLE' },
      }),
      prisma.vehicle.update({
        where: { id: newVehicleId },
        data: { status: 'RENTED' },
      }),
    ]);

    res.json(updatedRental);
  } catch (error: any) {
    console.error('Swap vehicle error:', error);
    res.status(500).json({ error: 'Failed to swap vehicle: ' + error.message });
  }
});

// PATCH /api/rentals/:id/accident — Toggle accident flag
router.patch('/:id/accident', requireAuth, async (req: Request, res: Response) => {
  try {
    const paramId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const rentalId = parseInt(paramId, 10);
    if (isNaN(rentalId)) {
      res.status(400).json({ error: 'Invalid rental ID.' });
      return;
    }
    const { isAccident } = req.body;

    const rental = await prisma.rental.update({
      where: { id: rentalId },
      data: { isAccident: Boolean(isAccident) },
    });

    res.json(rental);
  } catch (error: any) {
    console.error('Toggle accident error:', error);
    res.status(500).json({ error: 'Failed to update accident status.' });
  }
});

// POST /api/rentals/truncate — Delete all completed rentals (admin only)
router.post('/truncate', requireAdmin, async (req: Request, res: Response) => {
  try {
    const result = await prisma.rental.deleteMany({
      where: { status: 'COMPLETED' },
    });

    res.json({ success: true, count: result.count });
  } catch (error: any) {
    console.error('Truncate error:', error);
    res.status(500).json({ error: 'Failed to truncate completed rentals.' });
  }
});

export default router;
