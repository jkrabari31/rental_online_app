const { createClient } = require('@libsql/client');
const path = require('path');
const os = require('os');

const dbPath = path.join(os.homedir(), 'AppData/Roaming/rental-vehicle-app/app.db');
console.log('Fixing db at:', dbPath);

const db = createClient({ url: 'file:' + dbPath });

async function main() {
  // Check existing tables
  const r = await db.execute("SELECT name FROM sqlite_master WHERE type='table'");
  console.log('Tables found:', r.rows.map(x => x.name).join(', '));

  // Add missing MaintenanceExpense table if not exists
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

  // Try a test query on each table
  const vehicle = await db.execute('SELECT COUNT(*) as cnt FROM Vehicle');
  console.log('Vehicle count:', vehicle.rows[0].cnt);
  
  const customer = await db.execute('SELECT COUNT(*) as cnt FROM Customer');
  console.log('Customer count:', customer.rows[0].cnt);
  
  const rental = await db.execute('SELECT COUNT(*) as cnt FROM Rental');
  console.log('Rental count:', rental.rows[0].cnt);
  
  const setting = await db.execute('SELECT COUNT(*) as cnt FROM Setting');
  console.log('Setting count:', setting.rows[0].cnt);

  // Check Setting table columns
  const settingInfo = await db.execute("PRAGMA table_info('Setting')");
  console.log('Setting columns:', settingInfo.rows.map(x => x.name).join(', '));

  console.log('\nAll checks passed!');
  db.close();
}

main().catch(e => { console.error('Error:', e.message); process.exit(1); });
