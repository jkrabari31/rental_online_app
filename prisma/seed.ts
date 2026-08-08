import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Seeding database...');

  // Create default admin user (idempotent — only if no admin exists)
  const existingAdmin = await prisma.user.findFirst({
    where: { role: 'ADMIN' },
  });

  if (!existingAdmin) {
    const { hashSync } = await import('bcryptjs');
    await prisma.user.create({
      data: {
        username: 'admin',
        passwordHash: hashSync('admin123', 12),
        displayName: 'Administrator',
        role: 'ADMIN',
        isActive: true,
      },
    });
    console.log('✅ Default admin user created (admin / admin123)');
  } else {
    console.log('ℹ️  Admin user already exists, skipping.');
  }

  // Create default settings (idempotent — only if no settings exist)
  const existingSettings = await prisma.setting.findFirst();

  if (!existingSettings) {
    await prisma.setting.create({
      data: {
        currencySymbol: '₹',
        hourlyRoundingRule: 'EXACT',
        defaultDepositAmount: 0,
        companyName: 'SB Bike Rental',
        companyAddress: '',
        companyContact: '',
        receiptFooterText: 'Thank you for your business!',
      },
    });
    console.log('✅ Default settings created');
  } else {
    console.log('ℹ️  Settings already exist, skipping.');
  }

  console.log('🌱 Seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
