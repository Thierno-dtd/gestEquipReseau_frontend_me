import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Building2, 
  ClipboardCheck,
  History,
  Users,
  Settings,
  QrCode
} from 'lucide-react';
import { useAuthStore } from '@store/authStore';
import { Permission } from '@models/auth';

interface NavItem {
  label: string;
  icon: React.ReactNode;
  path: string;
  permission?: Permission;
  badge?: number;
}

const Sidebar = () => {
  const { hasPermission } = useAuthStore();

  const navItems: NavItem[] = [
    {
      label: 'Tableau de bord',
      icon: <LayoutDashboard className="w-5 h-5" />,
      path: '/',
    },
    {
      label: 'Infrastructure',
      icon: <Building2 className="w-5 h-5" />,
      path: '/sites',
      permission: Permission.VIEW_INFRASTRUCTURE,
    },
    {
      label: 'Scanner QR',
      icon: <QrCode className="w-5 h-5" />,
      path: '/scan',
      permission: Permission.SCAN_QR,
    },
    {
      label: 'Modifications',
      icon: <ClipboardCheck className="w-5 h-5" />,
      path: '/modifications',
      permission: Permission.PROPOSE_MODIFICATION,
    },
    {
      label: 'Historique',
      icon: <History className="w-5 h-5" />,
      path: '/history',
      permission: Permission.VIEW_INFRASTRUCTURE,
    },
    {
      label: 'Utilisateurs',
      icon: <Users className="w-5 h-5" />,
      path: '/users',
      permission: Permission.MANAGE_USERS,
    },
    {
      label: 'Paramètres',
      icon: <Settings className="w-5 h-5" />,
      path: '/settings',
    },
  ];

  const filteredNavItems = navItems.filter(item => 
    !item.permission || hasPermission(item.permission)
  );

  return (
    <nav className="h-full bg-surface-light dark:bg-surface-dark border-r border-gray-200 dark:border-gray-800">
      <div className="flex flex-col gap-1 p-4">
        {filteredNavItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-primary text-white'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`
            }
          >
            {item.icon}
            <span className="text-sm font-medium">{item.label}</span>
            {item.badge && item.badge > 0 && (
              <span className="ml-auto flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-bold text-white bg-red-500 rounded-full">
                {item.badge}
              </span>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default Sidebar;