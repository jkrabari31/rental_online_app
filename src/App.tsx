import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { Suspense, lazy } from 'react';

// Lazy-load all pages for code-splitting (each becomes a separate JS chunk)
const Dashboard = lazy(() => import('./pages/Dashboard').then(m => ({ default: m.Dashboard })));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard').then(m => ({ default: m.AdminDashboard })));
const BranchManagement = lazy(() => import('./pages/BranchManagement').then(m => ({ default: m.BranchManagement })));
const UserManagement = lazy(() => import('./pages/UserManagement').then(m => ({ default: m.UserManagement })));
const Vehicles = lazy(() => import('./pages/Vehicles').then(m => ({ default: m.Vehicles })));
const ActiveRentals = lazy(() => import('./pages/ActiveRentals').then(m => ({ default: m.ActiveRentals })));
const CompletedRentals = lazy(() => import('./pages/CompletedRentals').then(m => ({ default: m.CompletedRentals })));
const Reports = lazy(() => import('./pages/Reports').then(m => ({ default: m.Reports })));
const Analysis = lazy(() => import('./pages/Analysis').then(m => ({ default: m.Analysis })));
const Settings = lazy(() => import('./pages/Settings').then(m => ({ default: m.Settings })));
const Maintenance = lazy(() => import('./pages/Maintenance').then(m => ({ default: m.Maintenance })));

// Lightweight loading fallback for lazy-loaded pages
function PageLoader() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-pulse text-muted-foreground text-sm">Loading...</div>
    </div>
  );
}

/** Smart index redirect based on user role */
function IndexRedirect() {
  const { user } = useAuth();
  if (user?.role === 'ADMIN') {
    return <Navigate to="/admin/dashboard" replace />;
  }
  return <Navigate to="/dashboard" replace />;
}

function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
    <Routes>
      {/* Public Login Route */}
      <Route path="/login" element={<Login />} />

      {/* Authenticated Layout Container */}
      <Route 
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        {/* Smart Root Redirect */}
        <Route path="/" element={<IndexRedirect />} />

        {/* Branch & Shared Routes */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/vehicles" element={<Vehicles />} />
        <Route path="/rentals" element={<ActiveRentals />} />
        <Route path="/completed" element={<CompletedRentals />} />
        <Route path="/maintenance" element={<Maintenance />} />

        {/* Admin Only Routes */}
        <Route 
          path="/analytics" 
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <Analysis />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/dashboard" 
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/branches" 
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <BranchManagement />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/users" 
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <UserManagement />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/reports" 
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <Reports />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/settings" 
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <Settings />
            </ProtectedRoute>
          } 
        />
      </Route>

      {/* Fallback Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    </Suspense>
  );
}

function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <AppRoutes />
      </HashRouter>
    </AuthProvider>
  );
}

export default App;
