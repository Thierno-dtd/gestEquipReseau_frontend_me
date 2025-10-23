import { useEffect } from 'react';
import { useSyncStore } from '@/store/syncStore';
import { toast } from 'sonner';

export const useNetworkStatus = () => {
  const { isOnline, setOnline } = useSyncStore();

  useEffect(() => {
    const handleOnline = () => {
      setOnline(true);
      toast.success('Connexion rétablie', {
        description: 'Synchronisation en cours...',
      });
    };

    const handleOffline = () => {
      setOnline(false);
      toast.warning('Mode hors ligne', {
        description: 'Les modifications seront synchronisées plus tard',
        duration: 5000,
      });
    };

    // Set initial state
    setOnline(navigator.onLine);

    // Listen to online/offline events
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [setOnline]);

  return {
    isOnline,
    isOffline: !isOnline,
  };
};