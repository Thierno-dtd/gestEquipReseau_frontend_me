import { NavLink } from 'react-router-dom';
import { Home, Building2, QrCode, User } from 'lucide-react';

const MobileBottomNav = () => {
  const navItems = [
    {
      label: 'Accueil',
      icon: Home,
      path: '/',
    },
    {
      label: 'Sites',
      icon: Building2,
      path: '/sites',
    },
    {
      label: 'Scanner',
      icon: QrCode,
      path: '/scan',
    },
    {
      label: 'Profil',
      icon: User,
      path: '/profile',
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-surface-light dark:bg-surface-dark border-t border-gray-200 dark:border-gray-800">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center flex-1 h-full gap-1 transition-colors ${
                isActive
                  ? 'text-primary'
                  : 'text-gray-500 dark:text-gray-400'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon 
                  className="w-6 h-6" 
                  fill={isActive ? 'currentColor' : 'none'}
                />
                <span className="text-xs font-medium">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default MobileBottomNav;