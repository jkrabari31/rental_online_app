import 'dotenv/config';
import express from 'express';
import session from 'express-session';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.set('trust proxy', 1);
const PORT = parseInt(process.env.PORT || '3001');
const isDev = process.env.NODE_ENV !== 'production';

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (isDev) {
  app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
  }));
}

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'fallback-secret-change-me',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: !isDev, // HTTPS only in production
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    sameSite: isDev ? 'lax' : 'strict',
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

// In production, serve the React build
if (!isDev) {
  const distPath = path.join(__dirname, '../dist');
  app.use(express.static(distPath));

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
