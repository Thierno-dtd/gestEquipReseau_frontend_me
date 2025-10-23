import { useEffect } from 'react';
import { useSyncStore } from '@store/syncStore';
import { useNetworkStatus } from './useNetworkStatus';
import { toast } from 'sonner';

// Note: syncManager devrait être créé
// Pour l'instant, on simule la synchronisation
const syncManager = {
  syncPendingChanges: async () => {
    // Simulation de synchronisation
    return {
      success: true,
      synced: 0,
      failed: 0,
    };
  },
};

export const useOfflineSync = () => {
  const { isOnline } = useNetworkStatus();
  const {
    pendingChanges,
    lastSync,
    isSyncing,
    setSyncing,
    setSyncError,
    setLastSync,
  } = useSyncStore();

  const pendingChangesCount = pendingChanges.length;

  useEffect(() => {
    if (isOnline && pendingChangesCount > 0 && !isSyncing) {
      handleSync();
    }
  }, [isOnline, pendingChangesCount]);

  const handleSync = async () => {
    if (isSyncing) return;

    setSyncing(true);
    setSyncError(null);

    try {
      const result = await syncManager.syncPendingChanges();
      
      if (result.success) {
        setLastSync(new Date().toISOString());
        toast.success(
          `Synchronisation réussie: ${result.synced} modification(s)`
        );
      } else {
        setSyncError(`Erreur: ${result.failed} échec(s)`);
        toast.error(
          `Erreur de synchronisation: ${result.failed} échec(s)`
        );
      }
    } catch (error) {
      setSyncError('Erreur lors de la synchronisation');
      toast.error('Erreur lors de la synchronisation');
      console.error('Sync error:', error);
    } finally {
      setSyncing(false);
    }
  };

  const forceSync = () => {
    if (isOnline) {
      handleSync();
    } else {
      toast.error('Impossible de synchroniser hors ligne');
    }
  };

  return {
    isOnline,
    pendingChangesCount,
    lastSync,
    isSyncing,
    forceSync,
    canSync: isOnline && pendingChangesCount > 0 && !isSyncing,
  };
};