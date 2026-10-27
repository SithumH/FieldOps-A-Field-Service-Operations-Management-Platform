import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ClipboardList, 
  CalendarClock, 
  Users, 
  UserSquare2, 
  Package, 
  Receipt, 
  Settings, 
  Wrench,
  LogOut,
  User as UserIcon
} from 'lucide-react';
import { useAuth } from '../../features/auth/AuthContext';

export const AppLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, login, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  const handleSwitchRole = async (email: string) => {
    await login(email, 'Password123!');
  };

  const currentRole = user?.role || 'ORG_ADMIN';

  // Role-based navigation rules
  const allNavigation = [
    {
      name: 'Dashboard',
      href: '/',
      icon: LayoutDashboard,
      roles: ['ORG_ADMIN', 'SUPER_ADMIN', 'DISPATCHER', 'TECHNICIAN', 'FINANCE', 'CUSTOMER'],
    },
    {
      name: 'Service Requests',
      href: '/requests',
      icon: ClipboardList,
      roles: ['ORG_ADMIN', 'SUPER_ADMIN', 'DISPATCHER', 'CUSTOMER'],
    },
    {
      name: currentRole === 'TECHNICIAN' ? 'My Assigned Jobs' : 'Work Orders',
      href: '/work-orders',
      icon: Wrench,
      roles: ['ORG_ADMIN', 'SUPER_ADMIN', 'DISPATCHER', 'TECHNICIAN', 'FINANCE'],
    },
    {
      name: 'Dispatch & Schedule',
      href: '/dispatch',
      icon: CalendarClock,
      roles: ['ORG_ADMIN', 'SUPER_ADMIN', 'DISPATCHER'],
    },
    {
      name: 'Technicians',
      href: '/technicians',
      icon: UserSquare2,
      roles: ['ORG_ADMIN', 'SUPER_ADMIN', 'DISPATCHER'],
    },
    {
      name: 'Customers',
      href: '/customers',
      icon: Users,
      roles: ['ORG_ADMIN', 'SUPER_ADMIN', 'DISPATCHER', 'FINANCE'],
    },
    {
      name: 'Inventory & Parts',
      href: '/inventory',
      icon: Package,
      roles: ['ORG_ADMIN', 'SUPER_ADMIN', 'DISPATCHER', 'TECHNICIAN'],
    },
    {
      name: 'Invoices & Billing',
      href: '/invoices',
      icon: Receipt,
      roles: ['ORG_ADMIN', 'SUPER_ADMIN', 'FINANCE'],
    },
    {
      name: 'Settings',
      href: '/settings',
      icon: Settings,
      roles: ['ORG_ADMIN', 'SUPER_ADMIN'],
    },
  ];

  // Filter navigation items strictly based on the current user's role
  const navigation = allNavigation.filter((item) =>
    item.roles.includes(currentRole),
  );

  const initials = user
    ? `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase() || 'FO'
    : 'FO';

  const roleBadgeStyle = (role?: string) => {
    switch (role) {
      case 'ORG_ADMIN':
      case 'SUPER_ADMIN':
        return 'bg-stone-100 text-stone-800 border-stone-300';
      case 'DISPATCHER':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'TECHNICIAN':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'FINANCE':
        return 'bg-stone-100 text-stone-700 border-stone-300';
      default:
        return 'bg-stone-100 text-stone-800 border-stone-200';
    }
  };

  const getPortalLabel = (role?: string) => {
    switch (role) {
      case 'TECHNICIAN':
        return 'Technician Workspace';
      case 'DISPATCHER':
        return 'Dispatch Operations';
      case 'FINANCE':
        return 'Billing & Accounting';
      default:
        return 'Operations Console';
    }
  };

  return (
    <div className="flex h-screen bg-stone-50 font-sans">
      {/* Sidebar - Deep Forest Pine */}
      <aside className="w-64 bg-[#142319] text-stone-300 flex flex-col border-r border-[#1f3727]">
        <div className="h-16 flex items-center px-6 gap-3 border-b border-[#1f3727]">
          <div className="w-8 h-8 rounded-lg bg-[#2d6a4f] flex items-center justify-center text-white font-bold text-lg shadow-sm">
            F
          </div>
          <div>
            <h1 className="text-stone-100 font-bold text-base leading-none">FieldOps</h1>
            <span className="text-[11px] text-emerald-400 font-medium tracking-wide">
              {getPortalLabel(user?.role)}
            </span>
          </div>
        </div>

        {/* Role-Based Nav Menu */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-emerald-600/70">
            Navigation
          </div>
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isActive
                    ? 'bg-[#2d6a4f] text-white shadow-xs font-semibold'
                    : 'text-stone-300 hover:text-white hover:bg-[#1c3224]'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer User Card with Logout */}
        <div className="p-4 border-t border-[#1f3727] flex items-center justify-between gap-3 bg-[#0d1711]">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-full bg-[#2d6a4f] flex items-center justify-center font-bold text-white text-xs shrink-0 shadow-sm">
              {initials}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-stone-100 truncate">
                {user ? `${user.firstName} ${user.lastName}` : 'Apex Mechanical'}
              </p>
              <p className="text-[11px] text-stone-400 truncate">
                {user?.role || 'Dispatcher'}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Log Out"
            className="p-1.5 rounded-lg text-stone-400 hover:text-rose-400 hover:bg-rose-950/40 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-stone-200 flex items-center justify-between px-6 lg:px-8">
          <div>
            <h2 className="text-base lg:text-lg font-bold text-stone-800 leading-tight">
              {getPortalLabel(user?.role)}
            </h2>
            <p className="text-xs text-stone-500 hidden sm:block">
              {user?.organization?.name || 'Apex Mechanical Services'}
            </p>
          </div>

          <div className="flex items-center gap-3 lg:gap-4">
            {/* Role Switcher for local demo */}
            <div className="hidden md:flex items-center bg-stone-100 p-1 rounded-xl border border-stone-200 text-xs">
              <span className="text-[11px] font-semibold text-stone-500 px-2">
                Role:
              </span>
              <button
                onClick={() => handleSwitchRole('admin@apexservices.lk')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                  currentRole === 'ORG_ADMIN'
                    ? 'bg-[#2d6a4f] text-white shadow-xs font-semibold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Admin
              </button>
              <button
                onClick={() => handleSwitchRole('dispatch@apexservices.lk')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                  currentRole === 'DISPATCHER'
                    ? 'bg-[#2d6a4f] text-white shadow-xs font-semibold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Dispatcher
              </button>
              <button
                onClick={() => handleSwitchRole('kasun.technician@apexservices.lk')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                  currentRole === 'TECHNICIAN'
                    ? 'bg-[#2d6a4f] text-white shadow-xs font-semibold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Technician
              </button>
            </div>

            {/* Current User Info & Logout Button */}
            {user && (
              <div className="flex items-center gap-3 pl-3 border-l border-stone-200">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-stone-100 flex items-center justify-center text-stone-600">
                    <UserIcon className="w-3.5 h-3.5" />
                  </div>
                  <div className="hidden sm:block text-right">
                    <span className="text-xs font-bold text-stone-800 block leading-tight">
                      {user.firstName} {user.lastName}
                    </span>
                    <span className={`inline-block px-1.5 py-0.2 rounded text-[10px] font-semibold border ${roleBadgeStyle(user.role)}`}>
                      {user.role}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Log Out</span>
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8 bg-stone-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
