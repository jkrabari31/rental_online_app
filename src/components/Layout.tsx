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
  MapPin,
  Menu,
  X
} from 'lucide-react';
import { useAppStore } from '../store';
import { useAuth } from '../contexts/AuthContext';
import { useEffect, useState } from 'react';

export function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, setTheme } = useAppStore();
  const { user, isAdmin, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  // Auto-close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

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
    { name: 'Executive Analysis', path: '/analytics', icon: BarChart3 },
    { name: 'Branch Management', path: '/admin/branches', icon: Building2 },
    { name: 'User Credentials', path: '/admin/users', icon: Users },
    { name: 'Vehicles', path: '/vehicles', icon: Car },
    { name: 'Active Rentals', path: '/rentals', icon: FileText },
    { name: 'Completed Rentals', path: '/completed', icon: CheckCircle },
    { name: 'Maintenance', path: '/maintenance', icon: Wrench },
    { name: 'Reports', path: '/reports', icon: FileText },
    { name: 'Settings', path: '/settings', icon: Settings },
  ] : [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Vehicles', path: '/vehicles', icon: Car },
    { name: 'Active Rentals', path: '/rentals', icon: FileText },
    { name: 'Completed Rentals', path: '/completed', icon: CheckCircle },
    { name: 'Maintenance', path: '/maintenance', icon: Wrench },
  ];

  return (
    <div className="flex flex-col lg:flex-row h-screen w-full bg-background text-foreground overflow-hidden">
      {/* ───────────────────────────────────────────────────────────── */}
      {/* MOBILE STICKY TOP APP BAR (Screens < 1024px) */}
      {/* ───────────────────────────────────────────────────────────── */}
      <header className="lg:hidden sticky top-0 z-40 flex items-center justify-between px-4 py-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 p-0.5 flex items-center justify-center shrink-0">
              <div className="w-full h-full bg-white dark:bg-slate-900 rounded-[6px] flex items-center justify-center overflow-hidden p-0.5">
                <img 
                  src="/logo.png" 
                  alt="SB Logo" 
                  className="w-full h-full object-contain" 
                  onError={(e) => { 
                    e.currentTarget.style.display = 'none'; 
                    e.currentTarget.parentElement!.innerHTML = '<span class="text-blue-600 font-extrabold text-[10px]">SB</span>'; 
                  }} 
                />
              </div>
            </div>
            <span className="font-extrabold text-sm tracking-tight text-slate-900 dark:text-white">SB Bike Rental</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? <Moon className="w-4 h-4 text-slate-500" /> : <Sun className="w-4 h-4 text-amber-400" />}
          </button>
        </div>
      </header>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* MOBILE SLIDE-OVER DRAWER & BACKDROP (Screens < 1024px) */}
      {/* ───────────────────────────────────────────────────────────── */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop Overlay */}
          <div 
            className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs transition-opacity duration-300"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer Content */}
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 shadow-2xl z-10 animate-in slide-in-from-left duration-300">
            {/* Drawer Header */}
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 p-0.5 flex items-center justify-center shrink-0">
                  <div className="w-full h-full bg-white dark:bg-slate-900 rounded-[10px] flex items-center justify-center overflow-hidden p-0.5">
                    <img src="/logo.png" alt="SB Logo" className="w-full h-full object-contain" />
                  </div>
                </div>
                <div>
                  <h2 className="text-sm font-extrabold text-slate-900 dark:text-white">SB Bike Rental</h2>
                  <p className="text-[10px] text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider">Management Portal</p>
                </div>
              </div>

              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* User Badge */}
            <div className="p-3 mx-3 mt-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700/60 flex items-center space-x-2.5">
              <div className={`p-1.5 rounded-lg shrink-0 ${isAdmin ? 'bg-emerald-500/10 text-emerald-600' : 'bg-blue-500/10 text-blue-600'}`}>
                {isAdmin ? <ShieldCheck className="w-4 h-4" /> : <MapPin className="w-4 h-4" />}
              </div>
              <div className="truncate">
                <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{user?.displayName}</p>
                <p className="text-[10px] text-slate-500 truncate">{user?.role} {user?.branchName ? `• ${user.branchName}` : ''}</p>
              </div>
            </div>

            {/* Drawer Navigation Links */}
            <nav className="flex-1 py-3 px-3 space-y-1 overflow-y-auto">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path || (location.pathname.startsWith(item.path) && item.path !== '/dashboard' && item.path !== '/admin/dashboard');
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-xl transition-all duration-150 text-sm font-medium ${
                      isActive 
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 shadow-md shadow-blue-500/20 text-white font-semibold' 
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-blue-600'
                    }`}
                  >
                    <item.icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span className="truncate">{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Drawer Footer Actions */}
            <div className="p-3 border-t border-slate-100 dark:border-slate-800 space-y-1 bg-slate-50/50 dark:bg-slate-900/50">
              <button 
                onClick={handleLogout}
                className="flex items-center space-x-3 w-full px-3.5 py-2 rounded-xl text-rose-600 dark:text-rose-400 font-medium text-xs hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
              >
                <LogOut className="w-4 h-4 text-rose-500" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* DESKTOP SIDEBAR (Screens >= 1024px) */}
      {/* ───────────────────────────────────────────────────────────── */}
      <aside className="hidden lg:flex w-64 border-r border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/90 backdrop-blur-xl text-slate-700 dark:text-slate-200 flex-col shadow-[2px_0_24px_rgba(0,0,0,0.03)] z-20 select-none">
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800/80 flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 p-0.5 flex items-center justify-center shrink-0 shadow-md shadow-blue-500/20">
            <div className="w-full h-full bg-white dark:bg-slate-900 rounded-[14px] flex items-center justify-center overflow-hidden p-1">
              <img 
                src="/logo.png" 
                alt="SB Group Logo" 
                className="w-full h-full object-contain" 
                onError={(e) => { 
                  e.currentTarget.style.display = 'none'; 
                  e.currentTarget.parentElement!.innerHTML = '<span class="text-blue-600 font-extrabold text-sm tracking-tighter">SB</span>'; 
                }} 
              />
            </div>
          </div>
          <div className="overflow-hidden">
            <h1 className="text-base font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-900 dark:from-white dark:via-blue-200 dark:to-indigo-200 bg-clip-text text-transparent truncate">
              SB Bike Rental
            </h1>
            <p className="text-[10px] text-blue-600 dark:text-blue-400 font-bold tracking-widest uppercase">
              Management Portal
            </p>
          </div>
        </div>

        {/* User Info Badge */}
        <div className="px-3.5 py-3 mx-3 mt-3.5 bg-gradient-to-r from-blue-50/80 via-indigo-50/40 to-slate-50/90 dark:from-slate-800/80 dark:to-slate-800/50 rounded-2xl border border-blue-100/80 dark:border-slate-700/60 shadow-xs flex items-center justify-between">
          <div className="flex items-center space-x-2.5 min-w-0">
            <div className={`p-2 rounded-xl shrink-0 ${isAdmin ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-blue-500/10 text-blue-600 dark:text-blue-400'}`}>
              {isAdmin ? <ShieldCheck className="w-4 h-4" /> : <MapPin className="w-4 h-4" />}
            </div>
            <div className="truncate">
              <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{user?.displayName}</p>
              <div className="flex items-center space-x-1.5 mt-0.5">
                <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                  isAdmin 
                    ? 'bg-emerald-100 text-emerald-700 border border-emerald-200/80 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800' 
                    : 'bg-blue-100 text-blue-700 border border-blue-200/80 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800'
                }`}>
                  {user?.role}
                </span>
                {user?.branchName && (
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium truncate max-w-[85px]" title={user.branchName}>
                    • {user.branchName}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (location.pathname.startsWith(item.path) && item.path !== '/dashboard' && item.path !== '/admin/dashboard');
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-xl transition-all duration-200 text-sm ${
                  isActive 
                    ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 shadow-md shadow-blue-500/25 text-white font-semibold' 
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100/90 dark:hover:bg-slate-800/70 hover:text-blue-600 dark:hover:text-white font-medium'
                }`}
              >
                <item.icon className={`w-4 h-4 shrink-0 transition-transform duration-200 ${isActive ? 'text-white scale-110' : 'text-slate-400 group-hover:text-blue-600'}`} />
                <span className="truncate">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer Actions */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-800/80 space-y-1 bg-slate-50/50 dark:bg-slate-900/50">
          <button 
            onClick={toggleTheme}
            className="flex items-center space-x-3 w-full px-3.5 py-2 rounded-xl text-slate-600 dark:text-slate-300 font-medium text-xs hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-all duration-150"
          >
            {theme === 'light' ? <Moon className="w-4 h-4 text-slate-400" /> : <Sun className="w-4 h-4 text-amber-400" />}
            <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
          </button>
          
          <button 
            onClick={handleLogout}
            className="flex items-center space-x-3 w-full px-3.5 py-2 rounded-xl text-rose-600 dark:text-rose-400 font-medium text-xs hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all duration-150"
          >
            <LogOut className="w-4 h-4 text-rose-500" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* MAIN CONTENT AREA */}
      {/* ───────────────────────────────────────────────────────────── */}
      <main className="flex-1 overflow-auto bg-transparent">
        <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto w-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
