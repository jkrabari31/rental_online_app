import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import { autoUpdater } from 'electron-updater';
import path from 'path';
import fs from 'fs';
import Module from 'module';

const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;

// Enable touch events for touchscreen laptops
app.commandLine.appendSwitch('touch-events', 'enabled');

// Disable hardware acceleration for maximum compatibility (works on all PCs including low-end & NVIDIA GPU laptops)
app.disableHardwareAcceleration();

// Memory optimization flags for long-running sessions (24hr+)
app.commandLine.appendSwitch('js-flags', '--max-old-space-size=256 --gc-interval=100');
app.commandLine.appendSwitch('disable-renderer-backgrounding');

fs.writeFileSync(path.join(app.getPath('userData'), 'crash-log.txt'), 'App started\n', { flag: 'a' });
process.on('uncaughtException', (err) => {
  fs.writeFileSync(path.join(app.getPath('userData'), 'crash-log.txt'), `Uncaught Exception: ${err.message}\n${err.stack}\n`, { flag: 'a' });
});
process.on('unhandledRejection', (reason, promise) => {
  fs.writeFileSync(path.join(app.getPath('userData'), 'crash-log.txt'), `Unhandled Rejection at: ${promise}, reason: ${reason}\n`, { flag: 'a' });
});



const logMsg = (msg: string) => { fs.writeFileSync(path.join(app.getPath('userData'), 'crash-log.txt'), msg + '\n', { flag: 'a' }); };

logMsg('Initializing Prisma...');
const { PrismaLibSql } = require('@prisma/adapter-libsql');
const { PrismaClient } = require('../prisma-client');

let dbPath = isDev
  ? path.join(__dirname, '../dev.db')
  : path.join(app.getPath('userData'), 'app.db');

logMsg(`dbPath is ${dbPath}`);

if (!isDev) {
  const bundledDbPath = path.join(process.resourcesPath, 'template.db');
  const needsCopy = !fs.existsSync(dbPath);

  if (needsCopy) {
    logMsg('dbPath does not exist, looking for bundled db...');
    if (fs.existsSync(bundledDbPath)) {
      logMsg('Bundled db found, copying...');
      fs.mkdirSync(path.dirname(dbPath), { recursive: true });
      fs.copyFileSync(bundledDbPath, dbPath);
      logMsg('Copied successfully.');
    } else {
      logMsg('Bundled db NOT found.');
    }
  } else {
    // If existing db is too small (< 8KB), it's empty/corrupt — re-copy from template.
    logMsg('dbPath already exists. Validating...');
    const stats = fs.statSync(dbPath);
    logMsg(`db file size: ${stats.size} bytes`);
    if (stats.size < 8192) {
      logMsg('DB too small (likely empty/corrupt). Re-copying from template...');
      if (fs.existsSync(bundledDbPath)) {
        fs.copyFileSync(bundledDbPath, dbPath);
        logMsg('Re-copied successfully.');
      } else {
        logMsg('Template db not found for re-copy!');
      }
    } else {
      logMsg('DB size OK.');
    }
  }
}

logMsg('Instantiating PrismaLibSql...');
const adapter = new PrismaLibSql({ url: `file:${dbPath}` });
logMsg('Instantiating PrismaClient...');
const prisma = new PrismaClient({ adapter });
logMsg('Prisma ready.');

// Auto-migrate: ensure all columns exist (handles upgrades from old installs)
async function runMigrations() {
  try {
    const { createClient: migrateClient } = require('@libsql/client');
    const mdb = migrateClient({ url: `file:${dbPath}` });

    const rentalCols = await mdb.execute("PRAGMA table_info('Rental')");
    const rentalColNames = rentalCols.rows.map((r: any) => r.name);

    const rentalMigrations = [
      { col: 'selectedPackage', sql: "ALTER TABLE Rental ADD COLUMN \"selectedPackage\" TEXT NOT NULL DEFAULT 'HOURLY'" },
      { col: 'settlementAmount', sql: 'ALTER TABLE Rental ADD COLUMN "settlementAmount" REAL DEFAULT 0' },
      { col: 'isAccident', sql: 'ALTER TABLE Rental ADD COLUMN "isAccident" INTEGER NOT NULL DEFAULT 0' },
    ];
    for (const m of rentalMigrations) {
      if (!rentalColNames.includes(m.col)) {
        await mdb.execute(m.sql);
        logMsg(`Migration: added Rental.${m.col}`);
      }
    }

    const vehicleCols = await mdb.execute("PRAGMA table_info('Vehicle')");
    const vehicleColNames = vehicleCols.rows.map((r: any) => r.name);
    const vehicleMigrations = [
      { col: 'rate1hr', sql: 'ALTER TABLE Vehicle ADD COLUMN "rate1hr" REAL' },
      { col: 'rate3hr', sql: 'ALTER TABLE Vehicle ADD COLUMN "rate3hr" REAL' },
      { col: 'rate6hr', sql: 'ALTER TABLE Vehicle ADD COLUMN "rate6hr" REAL' },
      { col: 'rate12hr', sql: 'ALTER TABLE Vehicle ADD COLUMN "rate12hr" REAL' },
      { col: 'rate24hr', sql: 'ALTER TABLE Vehicle ADD COLUMN "rate24hr" REAL' },
      { col: 'description', sql: 'ALTER TABLE Vehicle ADD COLUMN "description" TEXT' },
    ];
    for (const m of vehicleMigrations) {
      if (!vehicleColNames.includes(m.col)) {
        await mdb.execute(m.sql);
        logMsg(`Migration: added Vehicle.${m.col}`);
      }
    }

    // Create MaintenanceExpense if missing
    const tables = await mdb.execute("SELECT name FROM sqlite_master WHERE type='table'");
    const tableNames = tables.rows.map((r: any) => r.name);
    if (!tableNames.includes('MaintenanceExpense')) {
      await mdb.execute(`CREATE TABLE "MaintenanceExpense" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "vehicleId" TEXT NOT NULL,
        "date" DATETIME NOT NULL,
        "amount" REAL NOT NULL,
        "remarks" TEXT,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "MaintenanceExpense_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
      )`);
      logMsg('Migration: created MaintenanceExpense table');
    }

    mdb.close();
    logMsg('Migrations complete.');
  } catch (e: any) {
    logMsg('Migration error: ' + e.message);
  }
}



let mainWindow: BrowserWindow | null = null;

// Periodic memory cleanup for 24hr+ sessions — runs every 5 minutes
let cleanupInterval: ReturnType<typeof setInterval> | null = null;

function startMemoryCleanup() {
  if (cleanupInterval) clearInterval(cleanupInterval);
  cleanupInterval = setInterval(() => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.session.clearCache().catch(() => { });
    }
  }, 5 * 60 * 1000); // 5 minutes
}

function createWindow() {
  logMsg('createWindow called');
  try {
    mainWindow = new BrowserWindow({
      width: 1200,
      height: 800,
      icon: isDev ? path.join(__dirname, '../public/logo.png') : path.join(__dirname, '../dist/logo.png'),
      webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
        nodeIntegration: false,
        contextIsolation: true,
        backgroundThrottling: false, // Prevent throttling when window loses focus
      },
    });

    if (isDev) {
      logMsg('Loading dev URL');
      mainWindow.loadURL('http://localhost:5173');
    } else {
      logMsg('Loading prod URL');
      mainWindow.loadFile(path.join(__dirname, '../dist/index.html')).catch(err => logMsg('Load failed: ' + err.message));
    }

    startMemoryCleanup();
    logMsg('Window loaded');
  } catch (e: any) {
    logMsg('createWindow error: ' + e.message);
  }
}

logMsg('Waiting for app ready...');
app.whenReady().then(async () => {
  logMsg('App ready fired');
  await runMigrations();
  createWindow();

  // Auto-updater setup
  autoUpdater.on('update-downloaded', () => {
    logMsg('Update downloaded');
    dialog.showMessageBox({
      type: 'info',
      title: 'Update Ready',
      message: 'A new version of the app has been downloaded. Restart the application to apply the updates.',
      buttons: ['Restart', 'Later']
    }).then((result) => {
      if (result.response === 0) {
        autoUpdater.quitAndInstall();
      }
    });
  });

  autoUpdater.on('error', (err) => {
    logMsg('AutoUpdater error: ' + err.message);
  });

  if (!isDev) {
    logMsg('Checking for updates...');
    autoUpdater.checkForUpdatesAndNotify().catch(err => logMsg('Update check failed: ' + err.message));
  }

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// IPC Handlers
ipcMain.handle('get-dashboard-stats', async () => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const [
      totalVehicles,
      availableVehicles,
      onRentVehicles,
      revenueTodayAggr,
      revenueMonthAggr,
      activeRentals,
      completedRentals
    ] = await Promise.all([
      prisma.vehicle.count(),
      prisma.vehicle.count({ where: { status: 'AVAILABLE' } }),
      prisma.vehicle.count({ where: { status: 'RENTED' } }),
      prisma.rental.aggregate({
        _sum: { totalAmount: true },
        where: { status: 'COMPLETED', returnDate: { gte: today } }
      }),
      prisma.rental.aggregate({
        _sum: { totalAmount: true },
        where: { status: 'COMPLETED', returnDate: { gte: startOfMonth } }
      }),
      prisma.rental.findMany({
        where: { status: 'ACTIVE' },
        include: { customer: true, vehicle: true },
        take: 10,
        orderBy: { pickupDate: 'desc' }
      }),
      prisma.rental.findMany({
        where: { status: 'COMPLETED' },
        include: { customer: true, vehicle: true },
        take: 10,
        orderBy: { returnDate: 'desc' }
      })
    ]);

    return {
      totalVehicles,
      availableVehicles,
      onRentVehicles,
      revenueToday: revenueTodayAggr._sum.totalAmount || 0,
      revenueMonth: revenueMonthAggr._sum.totalAmount || 0,
      activeRentals,
      completedRentals
    };
  } catch (e: any) {
    logMsg('IPC ERROR get-dashboard-stats: ' + e.message + '\n' + e.stack);
    throw e;
  }
});


// Settings
ipcMain.handle('get-settings', async () => {
  let setting = await prisma.setting.findFirst();
  if (!setting) {
    setting = await prisma.setting.create({ data: {} });
  }
  return setting;
});

ipcMain.handle('update-settings', async (_, data) => {
  const setting = await prisma.setting.findFirst();
  if (setting) {
    const { id, updatedAt, ...updateData } = data;
    return await prisma.setting.update({
      where: { id: setting.id },
      data: updateData
    });
  }
});

// Vehicles
ipcMain.handle('get-vehicles', async (_, filter = {}) => {
  return await prisma.vehicle.findMany({ where: filter, orderBy: { createdAt: 'desc' } });
});

ipcMain.handle('create-vehicle', async (_, data) => {
  return await prisma.vehicle.create({ data });
});

ipcMain.handle('update-vehicle', async (_, { id, ...data }) => {
  // Prevent manually changing status to AVAILABLE if vehicle has active rentals
  if (data.status === 'AVAILABLE') {
    const activeRental = await prisma.rental.findFirst({
      where: { vehicleId: id, status: 'ACTIVE' }
    });
    if (activeRental) {
      throw new Error('Cannot set vehicle to AVAILABLE — it has an active rental. Complete the return first.');
    }
  }
  return await prisma.vehicle.update({ where: { id }, data });
});

ipcMain.handle('delete-vehicle', async (_, id) => {
  return await prisma.vehicle.delete({ where: { id } });
});

// Maintenance
ipcMain.handle('get-maintenance', async () => {
  return await prisma.maintenanceExpense.findMany({
    include: { vehicle: true },
    orderBy: { date: 'desc' }
  });
});

ipcMain.handle('create-maintenance', async (_, data) => {
  return await prisma.maintenanceExpense.create({ data });
});

// Customers
ipcMain.handle('get-customers', async () => {
  return await prisma.customer.findMany();
});

// Find customer by mobile number (optimized — returns only 1 result instead of loading all)
ipcMain.handle('find-customer-by-mobile', async (_, mobileNumber: string) => {
  return await prisma.customer.findFirst({
    where: { mobileNumber },
    orderBy: { createdAt: 'desc' }
  });
});

// Rentals
ipcMain.handle('create-rental', async (_, data) => {
  const { customerData, ...rentalData } = data;

  if (!rentalData.vehicleId) {
    throw new Error("Vehicle ID is required to create a rental.");
  }

  // Create or update customer
  let customer;
  if (customerData.id) {
    customer = await prisma.customer.update({ where: { id: customerData.id }, data: customerData });
  } else {
    customer = await prisma.customer.create({ data: customerData });
  }

  // Atomic transaction: create rental + update vehicle status together
  // If either fails, both are rolled back — prevents status mismatch
  const [rental] = await prisma.$transaction([
    prisma.rental.create({
      data: {
        ...rentalData,
        customerId: customer.id
      }
    }),
    prisma.vehicle.update({
      where: { id: rentalData.vehicleId },
      data: { status: 'RENTED' }
    })
  ]);

  return rental;
});

ipcMain.handle('toggle-rental-accident', async (_, { rentalId, isAccident }) => {
  return await prisma.rental.update({
    where: { id: rentalId },
    data: { isAccident }
  });
});

ipcMain.handle('return-vehicle', async (_, { rentalId, returnData, vehicleId }) => {
  // Atomic transaction: update rental + update vehicle status together
  const [rental] = await prisma.$transaction([
    prisma.rental.update({
      where: { id: rentalId },
      data: {
        ...returnData,
        status: 'COMPLETED'
      }
    }),
    prisma.vehicle.update({
      where: { id: vehicleId },
      data: { status: 'AVAILABLE' }
    })
  ]);

  return rental;
});

ipcMain.handle('swap-vehicle', async (_, { rentalId, oldVehicleId, newVehicleId, oldVehicleStatus, notesAppend }) => {
  const rental = await prisma.rental.findUnique({ where: { id: rentalId } });
  if (!rental) throw new Error("Rental not found");

  const newNotes = rental.notes ? `${rental.notes}\n\n${notesAppend}` : notesAppend;

  const [updatedRental] = await prisma.$transaction([
    prisma.rental.update({
      where: { id: rentalId },
      data: { vehicleId: newVehicleId, notes: newNotes }
    }),
    prisma.vehicle.update({
      where: { id: oldVehicleId },
      data: { status: oldVehicleStatus }
    }),
    prisma.vehicle.update({
      where: { id: newVehicleId },
      data: { status: 'RENTED' }
    })
  ]);
  
  return updatedRental;
});

ipcMain.handle('get-rentals', async (_, filter: any = {}) => {
  if (filter.returnDate) {
    if (filter.returnDate.gte) filter.returnDate.gte = new Date(filter.returnDate.gte);
    if (filter.returnDate.lte) filter.returnDate.lte = new Date(filter.returnDate.lte);
  }
  if (filter.pickupDate) {
    if (filter.pickupDate.gte) filter.pickupDate.gte = new Date(filter.pickupDate.gte);
    if (filter.pickupDate.lte) filter.pickupDate.lte = new Date(filter.pickupDate.lte);
  }
  return await prisma.rental.findMany({
    where: filter,
    include: { customer: true, vehicle: true },
    orderBy: { createdAt: 'desc' }
  });
});

ipcMain.handle('truncate-completed-rentals', async () => {
  return await prisma.rental.deleteMany({
    where: { status: 'COMPLETED' }
  });
});

// Database Backup
ipcMain.handle('backup-database', async () => {
  const { dialog } = await import('electron');
  const result = await dialog.showSaveDialog(mainWindow!, {
    title: 'Backup Database',
    defaultPath: `rental-backup-${new Date().toISOString().slice(0, 10)}.db`,
    filters: [{ name: 'SQLite Database', extensions: ['db'] }]
  });

  if (!result.canceled && result.filePath) {
    fs.copyFileSync(dbPath, result.filePath);
    return { success: true, path: result.filePath };
  }
  return { success: false };
});

// Database Restore
ipcMain.handle('restore-database', async () => {
  const { dialog } = await import('electron');
  const result = await dialog.showOpenDialog(mainWindow!, {
    title: 'Restore Database',
    filters: [{ name: 'SQLite Database', extensions: ['db'] }],
    properties: ['openFile']
  });

  if (!result.canceled && result.filePaths[0]) {
    fs.copyFileSync(result.filePaths[0], dbPath);
    // Restart the app to reload the database
    app.relaunch();
    app.exit(0);
    return { success: true };
  }
  return { success: false };
});

// Factory Reset
ipcMain.handle('factory-reset', async () => {
  try {
    const templatePath = path.join(process.resourcesPath, 'template.db');
    if (fs.existsSync(templatePath)) {
      fs.copyFileSync(templatePath, dbPath);
    } else {
      // In dev mode, process.resourcesPath won't have it, fallback to root template.db
      const devTemplatePath = path.join(__dirname, '../template.db');
      if (fs.existsSync(devTemplatePath)) {
        fs.copyFileSync(devTemplatePath, dbPath);
      } else {
        throw new Error("Template DB not found");
      }
    }

    app.relaunch();
    app.exit(0);
    return { success: true };
  } catch (e: any) {
    logMsg('Factory reset failed: ' + e.message);
    return { success: false, error: e.message };
  }
});
