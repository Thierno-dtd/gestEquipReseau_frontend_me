import { useEffect } from 'react';
import { useSyncStore } from '@/store/syncStore';
import { useNetworkStatus } from './useNetworkStatus';
import { syncManager } from '@/services/sync/syncManager';
import { toast } from 'sonner';

export const useOfflineSync = () => {
  const { isOnline } = useNetworkStatus();
  const {
    pendingChangesCount,
    lastSync,
    isSyncing,
    setIsSyncing,
    setSyncStatus,
    setLastSync,
  } = useSyncStore();

  useEffect(() => {
    if (isOnline && pendingChangesCount > 0 && !isSyncing) {
      handleSync();
    }
  }, [isOnline, pendingChangesCount]);

  const handleSync = async () => {
    if (isSyncing) return;

    setIsSyncing(true);
    setSyncStatus('syncing');

    try {
      const result = await syncManager.syncPendingChanges();
      
      if (result.success) {
        setLastSync(new Date());
        setSyncStatus('synced');
        toast.success(
          `Synchronisation réussie: ${result.synced} modification(s)`
        );
      } else {
        setSyncStatus('error');
        toast.error(
          `Erreur de synchronisation: ${result.failed} échec(s)`
        );
      }
    } catch (error) {
      setSyncStatus('error');
      toast.error('Erreur lors de la synchronisation');
      console.error('Sync error:', error);
    } finally {
      setIsSyncing(false);
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