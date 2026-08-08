import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Car, 
  FileText, 
  CheckCircle, 
  BarChart3, 
  Settings, 
  Moon, 
  Sun, 
  Wrench, 
  Building2, 
  Users, 
  LogOut,
  ShieldCheck,
  MapPin
} from 'lucide-react';
import { useAppStore } from '../store';
import { useAuth } from '../contexts/AuthContext';
import { useEffect } from 'react';

export function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, setTheme } = useAppStore();
  const { user, isAdmin, logout } = useAuth();

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Define navigation items based on user role
  const navItems = isAdmin ? [
    { name: 'Master Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Branch Management', path: '/admin/branches', icon: Building2 },
    { name: 'User Credentials', path: '/admin/users', icon: Users },
    { name: 'Vehicles', path: '/vehicles', icon: Car },
    { name: 'Active Rentals', path: '/rentals', icon: FileText },
    { name: 'Maintenance', path: '/maintenance', icon: Wrench },
    { name: 'Completed Rentals', path: '/completed', icon: CheckCircle },
    { name: 'Reports', path: '/reports', icon: BarChart3 },
    { name: 'Settings', path: '/settings', icon: Settings },
  ] : [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Vehicles', path: '/vehicles', icon: Car },
    { name: 'Active Rentals', path: '/rentals', icon: FileText },
    { name: 'Maintenance', path: '/maintenance', icon: Wrench },
  ];

  return (
    <div className="flex h-screen w-full bg-background text-foreground overflow-hidden">
      <aside className="w-64 border-r border-slate-800/50 bg-slate-950 text-slate-300 flex flex-col shadow-xl z-10 select-none">
        {/* Brand Header */}
        <div className="p-6 border-b border-slate-800/50 flex items-center space-x-3">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center p-0.5 overflow-hidden shrink-0 shadow-sm">
            <img 
              src="/logo.png" 
              alt="SB Group Logo" 
              className="w-full h-full object-contain rounded-full" 
              onError={(e) => { 
                e.currentTarget.style.display = 'none'; 
                e.currentTarget.parentElement!.innerHTML = '<span class="text-red-600 font-bold text-lg">SB</span>'; 
              }} 
            />
          </div>
          <div className="overflow-hidden">
            <h1 className="text-xl font-bold bg-gradient-to-r from-red-500 to-red-400 bg-clip-text text-transparent truncate tracking-tight">
              SB Bike Rental
            </h1>
            <p className="text-[11px] text-slate-400 font-medium tracking-wide uppercase">Online Portal</p>
          </div>
        </div>

        {/* User Info Badge */}
        <div className="px-4 py-3 mx-3 mt-4 bg-slate-900/80 rounded-xl border border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2.5 min-w-0">
            <div className="p-2 bg-blue-600/20 text-blue-400 rounded-lg shrink-0">
              {isAdmin ? <ShieldCheck className="w-4 h-4 text-emerald-400" /> : <MapPin className="w-4 h-4 text-blue-400" />}
            </div>
            <div className="truncate">
              <p className="text-sm font-semibold text-white truncate">{user?.displayName}</p>
              <div className="flex items-center space-x-1.5 mt-0.5">
                <span className={`text-[10px] font-extrabold uppercase px-1.5 py-0.2 rounded ${isAdmin ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'}`}>
                  {user?.role}
                </span>
                {user?.branchName && (
                  <span className="text-[11px] text-slate-400 truncate max-w-[90px]" title={user.branchName}>
                    • {user.branchName}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-3 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (location.pathname.startsWith(item.path) && item.path !== '/dashboard' && item.path !== '/admin/dashboard');
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-xl transition-all duration-200 font-medium text-sm ${
                  isActive 
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 shadow-md text-white font-semibold' 
                    : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                }`}
              >
                <item.icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span className="truncate">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer Actions */}
        <div className="p-3 border-t border-slate-800/50 space-y-1">
          <button 
            onClick={toggleTheme}
            className="flex items-center space-x-3 w-full px-3.5 py-2 rounded-xl text-slate-300 font-medium text-sm hover:bg-slate-900 hover:text-white transition-all duration-200"
          >
            {theme === 'light' ? <Moon className="w-4 h-4 text-slate-400" /> : <Sun className="w-4 h-4 text-amber-400" />}
            <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
          </button>
          
          <button 
            onClick={handleLogout}
            className="flex items-center space-x-3 w-full px-3.5 py-2 rounded-xl text-red-400 font-medium text-sm hover:bg-red-500/10 transition-all duration-200"
          >
            <LogOut className="w-4 h-4 text-red-400" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-auto bg-transparent">
        <div className="p-8 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
