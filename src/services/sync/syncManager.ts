import apiClient from '../api/client';
import { getQueueItems, removeFromQueue, incrementRetryCount } from './offlineQueue';
import { useSyncStore } from '@store/syncStore';
import { toast } from 'sonner';

// Synchroniser la queue
export const syncQueue = async (): Promise<void> => {
  const { setSyncing, setLastSync, setSyncError } = useSyncStore.getState();
  
  setSyncing(true);
  setSyncError(null);

  try {
    const queueItems = await getQueueItems();
    
    if (queueItems.length === 0) {
      setLastSync(new Date().toISOString());
      setSyncing(false);
      return;
    }

    toast.info(`Synchronisation de ${queueItems.length} modification(s)...`);

    let successCount = 0;
    let errorCount = 0;

    // Traiter chaque élément
    for (const item of queueItems) {
      try {
        await apiClient({
          method: item.method,
          url: item.url,
          data: item.data,
        });

        await removeFromQueue(item.id);
        successCount++;
      } catch (error) {
        errorCount++;
        
        // Incrémenter le compteur de retry
        await incrementRetryCount(item.id);
        
        // Si on a atteint le nombre max de retries, supprimer
        if (item.retryCount >= item.maxRetries) {
          await removeFromQueue(item.id);
          console.error(`Max retries reached for queue item ${item.id}`, error);
        }
      }
    }

    // Mise à jour du statut
    if (errorCount === 0) {
      toast.success(`${successCount} modification(s) synchronisée(s)`);
      setLastSync(new Date().toISOString());
    } else {
      toast.warning(`${successCount} synchronisée(s), ${errorCount} en erreur`);
      setSyncError(`${errorCount} modifications n'ont pas pu être synchronisées`);
    }
  } catch (error: any) {
    console.error('Sync error:', error);
    setSyncError(error.message || 'Erreur lors de la synchronisation');
    toast.error('Erreur de synchronisation');
  } finally {
    setSyncing(false);
  }
};

// Synchroniser automatiquement quand on revient en ligne
export const setupAutoSync = (): void => {
  window.addEventListener('online', () => {
    const { setOnline } = useSyncStore.getState();
    setOnline(true);
    toast.success('Connexion rétablie');
    
    // Synchroniser après un court délai
    setTimeout(() => {
      syncQueue();
    }, 1000);
  });

  window.addEventListener('offline', () => {
    const { setOnline } = useSyncStore.getState();
    setOnline(false);
    toast.warning('Mode hors ligne activé');
  });
};