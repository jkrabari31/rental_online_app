import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { BranchManagement } from './pages/BranchManagement';
import { UserManagement } from './pages/UserManagement';
import { Vehicles } from './pages/Vehicles';
import { ActiveRentals } from './pages/ActiveRentals';
import { CompletedRentals } from './pages/CompletedRentals';
import { Reports } from './pages/Reports';
import { Settings } from './pages/Settings';
import { Maintenance } from './pages/Maintenance';

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
        <Route path="/maintenance" element={<Maintenance />} />

        {/* Admin Only Routes */}
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
          path="/completed" 
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <CompletedRentals />
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
