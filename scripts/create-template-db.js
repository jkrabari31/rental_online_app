const { createClient } = require('@libsql/client');
const fs = require('fs');
const path = require('path');

const templatePath = path.join(__dirname, '..', 'template.db');

// Delete old template.db if exists
if (fs.existsSync(templatePath)) {
  fs.unlinkSync(templatePath);
  console.log('Deleted old template.db');
}

const db = createClient({ url: 'file:' + templatePath });

async function main() {
  await db.execute('PRAGMA journal_mode=WAL;');

  await db.execute(`CREATE TABLE IF NOT EXISTS "Vehicle" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "vehicleNumber" TEXT NOT NULL,
    "vehicleName" TEXT NOT NULL,
    "vehicleType" TEXT NOT NULL,
    "hourlyRate" REAL NOT NULL,
    "securityDeposit" REAL NOT NULL,
    "rate1hr" REAL,
    "rate3hr" REAL,
    "rate6hr" REAL,
    "rate12hr" REAL,
    "rate24hr" REAL,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'AVAILABLE',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`);

  await db.execute(`CREATE UNIQUE INDEX IF NOT EXISTS "Vehicle_vehicleNumber_key" ON "Vehicle"("vehicleNumber")`);

  await db.execute(`CREATE TABLE IF NOT EXISTS "MaintenanceExpense" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "vehicleId" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "amount" REAL NOT NULL,
    "remarks" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "MaintenanceExpense_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
  )`);

  await db.execute(`CREATE TABLE IF NOT EXISTS "Customer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "mobileNumber" TEXT NOT NULL,
    "email" TEXT,
    "address" TEXT,
    "idProofType" TEXT NOT NULL,
    "idProofNumber" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`);

  await db.execute(`CREATE TABLE IF NOT EXISTS "Rental" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "customerId" TEXT NOT NULL,
    "vehicleId" TEXT NOT NULL,
    "pickupDate" DATETIME NOT NULL,
    "returnDate" DATETIME,
    "depositAmount" REAL NOT NULL,
    "selectedPackage" TEXT NOT NULL DEFAULT 'HOURLY',
    "notes" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "totalHours" REAL,
    "totalAmount" REAL,
    "settlementAmount" REAL DEFAULT 0,
    "isAccident" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Rental_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Rental_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
  )`);

  await db.execute(`CREATE INDEX IF NOT EXISTS "Rental_status_idx" ON "Rental"("status")`);
  await db.execute(`CREATE INDEX IF NOT EXISTS "Rental_returnDate_idx" ON "Rental"("returnDate")`);
  await db.execute(`CREATE INDEX IF NOT EXISTS "Rental_customerId_idx" ON "Rental"("customerId")`);
  await db.execute(`CREATE INDEX IF NOT EXISTS "Rental_vehicleId_idx" ON "Rental"("vehicleId")`);

  await db.execute(`CREATE TABLE IF NOT EXISTS "Setting" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "currencySymbol" TEXT NOT NULL DEFAULT '$',
    "hourlyRoundingRule" TEXT NOT NULL DEFAULT 'EXACT',
    "defaultDepositAmount" REAL NOT NULL DEFAULT 0,
    "companyName" TEXT NOT NULL DEFAULT 'My Rental Company',
    "companyAddress" TEXT NOT NULL DEFAULT '',
    "companyContact" TEXT NOT NULL DEFAULT '',
    "receiptLogoPath" TEXT,
    "receiptFooterText" TEXT NOT NULL DEFAULT 'Thank you for your business!',
    "settingsPassword" TEXT NOT NULL DEFAULT '06062026',
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`);

  console.log('SUCCESS: template.db created with all tables!');
  console.log('Location:', templatePath);
  db.close();
}

main().catch(e => {
  console.error('FAILED:', e);
  process.exit(1);
});
