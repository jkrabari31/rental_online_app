import 'dotenv/config';
import express from 'express';
import session from 'express-session';
import cors from 'cors';
import compression from 'compression';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

import connectPgSimple from 'connect-pg-simple';
import pg from 'pg';

// Route imports
import authRoutes from './routes/auth.js';
import dashboardRoutes from './routes/dashboard.js';
import vehicleRoutes from './routes/vehicles.js';
import rentalRoutes from './routes/rentals.js';
import customerRoutes from './routes/customers.js';
import maintenanceRoutes from './routes/maintenance.js';
import settingsRoutes from './routes/settings.js';
import branchRoutes from './routes/branches.js';
import userRoutes from './routes/users.js';
import backupRoutes from './routes/backup.js';
import analyticsRoutes from './routes/analytics.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.set('trust proxy', 1);
const PORT = parseInt(process.env.PORT || '3001');
const isDev = process.env.NODE_ENV !== 'production';

// Middleware
app.use(compression()); // Gzip compress all responses (typically 60-80% size reduction on JSON)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

if (isDev) {
  app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
  }));
}

// Session store in PostgreSQL
const PgSessionStore = connectPgSimple(session);
const sessionPool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});
sessionPool.on('error', (err) => {
  console.error('Unexpected error on idle session PostgreSQL client:', err);
});

// Session configuration
app.use(session({
  store: new PgSessionStore({
    pool: sessionPool,
    tableName: 'session',
    createTableIfMissing: true,
  }),
  secret: process.env.SESSION_SECRET || 'sb-bike-rental-secure-session-key-2026',
  resave: false,
  saveUninitialized: false,
  rolling: true, // Resets 24-hour expiration on every user request
  cookie: {
    // Only enforce HTTPS secure cookies if COOKIE_SECURE is explicitly true
    // This allows immediate deployment to HTTP VPS without silent cookie drops
    secure: process.env.COOKIE_SECURE === 'true',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    sameSite: 'lax',
  },
}));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/rentals', rentalRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/branches', branchRoutes);
app.use('/api/users', userRoutes);
app.use('/api/backup', backupRoutes);
app.use('/api/analytics', analyticsRoutes);

// Explicit 404 for non-existent /api routes
app.use('/api', (req, res) => {
  res.status(404).json({ error: `API route not found: ${req.method} ${req.originalUrl}` });
});

// Serve the React build whenever dist exists (production or built server)
const distPath = path.join(__dirname, '../dist');
if (fs.existsSync(distPath)) {
  // Vite assets have content hashes — cache aggressively (1 year)
  app.use('/assets', express.static(path.join(distPath, 'assets'), { maxAge: '1y', immutable: true }));
  app.use(express.static(distPath, { maxAge: '1h' }));

  // All non-API routes serve the React SPA
  app.use((req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(distPath, 'index.html'));
    }
  });
}

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 Server running on http://localhost:${PORT}`);
  if (isDev) {
    console.log(`📦 API ready at http://localhost:${PORT}/api`);
    console.log(`🖥️  Frontend dev server at http://localhost:5173\n`);
  }
});

export default app;
