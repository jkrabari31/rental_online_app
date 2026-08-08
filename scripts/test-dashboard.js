const { createClient } = require('@libsql/client');
const path = require('path');
const os = require('os');

const dbPath = path.join(os.homedir(), 'AppData/Roaming/rental-vehicle-app/app.db');
const db = createClient({ url: 'file:' + dbPath });

async function main() {
  console.log('Testing dashboard query...');
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  // Test vehicle count
  try {
    const r = await db.execute('SELECT COUNT(*) as cnt FROM Vehicle');
    console.log('vehicle count:', r.rows[0].cnt);
  } catch(e) { console.error('vehicle count failed:', e.message); }

  // Test rental aggregate (this is what Prisma generates for aggregate)
  try {
    const r = await db.execute({
      sql: 'SELECT SUM(totalAmount) as total FROM Rental WHERE returnDate >= ?',
      args: [today.toISOString()]
    });
    console.log('revenue today:', r.rows[0].total);
  } catch(e) { console.error('revenue today failed:', e.message); }

  // Test rental findMany with include
  try {
    const r = await db.execute({
      sql: `SELECT r.id, r.status, c.name as customerName, v.vehicleName 
            FROM Rental r 
            JOIN Customer c ON r.customerId = c.id 
            JOIN Vehicle v ON r.vehicleId = v.id 
            WHERE r.status = ? 
            ORDER BY r.pickupDate DESC 
            LIMIT 10`,
      args: ['ACTIVE']
    });
    console.log('active rentals:', r.rows.length);
  } catch(e) { console.error('active rentals failed:', e.message); }

  // Check if Rental has returnDate column
  const pragma = await db.execute("PRAGMA table_info('Rental')");
  console.log('Rental columns:', pragma.rows.map(x => x.name).join(', '));

  db.close();
}

main().catch(e => { console.error('Script error:', e); });
