const { createClient } = require('@libsql/client');
const path = require('path');
const os = require('os');
const fs = require('fs');

async function migrateDb(dbPath, label) {
  console.log(`\nMigrating ${label}: ${dbPath}`);
  
  if (!fs.existsSync(dbPath)) {
    console.log(`  SKIPPED - file not found`);
    return;
  }

  const db = createClient({ url: 'file:' + dbPath });

  // Check current Rental columns
  const pragma = await db.execute("PRAGMA table_info('Rental')");
  const existingCols = pragma.rows.map(x => x.name);
  console.log('  Existing Rental columns:', existingCols.join(', '));

  // Add missing columns
  const migrations = [
    { col: 'selectedPackage', sql: "ALTER TABLE Rental ADD COLUMN \"selectedPackage\" TEXT NOT NULL DEFAULT 'HOURLY'" },
    { col: 'settlementAmount', sql: "ALTER TABLE Rental ADD COLUMN \"settlementAmount\" REAL DEFAULT 0" },
    { col: 'isAccident', sql: "ALTER TABLE Rental ADD COLUMN \"isAccident\" INTEGER NOT NULL DEFAULT 0" },
  ];

  for (const m of migrations) {
    if (!existingCols.includes(m.col)) {
      try {
        await db.execute(m.sql);
        console.log(`  + Added column: ${m.col}`);
      } catch(e) {
        console.error(`  ! Failed to add ${m.col}:`, e.message);
      }
    } else {
      console.log(`  ✓ Column exists: ${m.col}`);
    }
  }

  // Add MaintenanceExpense table if missing
  const tables = await db.execute("SELECT name FROM sqlite_master WHERE type='table'");
  const tableNames = tables.rows.map(x => x.name);
  
  if (!tableNames.includes('MaintenanceExpense')) {
    await db.execute(`CREATE TABLE "MaintenanceExpense" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "vehicleId" TEXT NOT NULL,
      "date" DATETIME NOT NULL,
      "amount" REAL NOT NULL,
      "remarks" TEXT,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "MaintenanceExpense_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
    )`);
    console.log('  + Created MaintenanceExpense table');
  } else {
    console.log('  ✓ MaintenanceExpense table exists');
  }

  // Add Vehicle columns if missing
  const vehiclePragma = await db.execute("PRAGMA table_info('Vehicle')");
  const vehicleCols = vehiclePragma.rows.map(x => x.name);
  const vehicleMigrations = [
    { col: 'rate1hr', sql: 'ALTER TABLE Vehicle ADD COLUMN "rate1hr" REAL' },
    { col: 'rate3hr', sql: 'ALTER TABLE Vehicle ADD COLUMN "rate3hr" REAL' },
    { col: 'rate6hr', sql: 'ALTER TABLE Vehicle ADD COLUMN "rate6hr" REAL' },
    { col: 'rate12hr', sql: 'ALTER TABLE Vehicle ADD COLUMN "rate12hr" REAL' },
    { col: 'rate24hr', sql: 'ALTER TABLE Vehicle ADD COLUMN "rate24hr" REAL' },
    { col: 'description', sql: 'ALTER TABLE Vehicle ADD COLUMN "description" TEXT' },
  ];
  for (const m of vehicleMigrations) {
    if (!vehicleCols.includes(m.col)) {
      try {
        await db.execute(m.sql);
        console.log(`  + Added Vehicle column: ${m.col}`);
      } catch(e) { console.error(`  ! Failed: ${m.col}`, e.message); }
    }
  }

  db.close();
  console.log(`  Done!`);
}

async function main() {
  // Migrate the live app.db
  const appDb = path.join(os.homedir(), 'AppData/Roaming/rental-vehicle-app/app.db');
  await migrateDb(appDb, 'app.db (live)');

  // Migrate template.db so future installs are correct
  const templateDb = path.join(__dirname, '..', 'template.db');
  await migrateDb(templateDb, 'template.db');

  console.log('\nAll migrations complete!');
}

main().catch(e => { console.error('Fatal:', e); process.exit(1); });
