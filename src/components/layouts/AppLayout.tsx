import { ReactNode, useEffect } from 'react';
import { useAuthStore } from '@store/authStore';
import { useUIStore } from '@store/uiStore';
import { useSyncStore } from '@store/syncStore';
import Header from './Header';
import Sidebar from './Sidebar';
import MobileBottomNav from './MobileBottomNav';

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const { isAuthenticated } = useAuthStore();
  const { isSidebarOpen, isDarkMode } = useUIStore();
  const { isOnline, setOnline } = useSyncStore();

  // Gérer le mode sombre
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Gérer le statut en ligne/hors ligne
  useEffect(() => {
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [setOnline]);

  if (!isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      {/* Header fixe */}
      <Header />

      <div className="flex h-[calc(100vh-64px)]">
        {/* Sidebar desktop */}
        <aside
          className={`hidden md:block transition-all duration-300 ${
            isSidebarOpen ? 'w-64' : 'w-0'
          } overflow-hidden`}
        >
          <Sidebar />
        </aside>

        {/* Contenu principal */}
        <main className="flex-1 overflow-y-auto pb-16 md:pb-0">
          {/* Indicateur hors ligne */}
          {!isOnline && (
            <div className="bg-yellow-500 text-white px-4 py-2 text-center text-sm font-medium">
              Mode hors ligne - Les modifications seront synchronisées à la reconnexion
            </div>
          )}

          <div className="container mx-auto p-4 md:p-6">
            {children}
          </div>
        </main>
      </div>

      {/* Navigation mobile */}
      <div className="md:hidden">
        <MobileBottomNav />
      </div>
    </div>
  );
};

export default AppLayout;