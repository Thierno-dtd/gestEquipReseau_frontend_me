import { getDB } from '../storage/indexedDB';
import { STORES } from '../storage/constants';

export interface QueueItem {
  id: string;
  method: 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  url: string;
  data?: any;
  timestamp: number;
  retryCount: number;
  maxRetries: number;
}

// Ajouter à la queue
export const addToQueue = async (item: Omit<QueueItem, 'id' | 'timestamp' | 'retryCount'>): Promise<void> => {
  const db = await getDB();
  const queueItem: QueueItem = {
    ...item,
    id: `queue_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    timestamp: Date.now(),
    retryCount: 0,
  };

  await db.add(STORES.OFFLINE_QUEUE, queueItem);
};

// Obtenir tous les éléments de la queue
export const getQueueItems = async (): Promise<QueueItem[]> => {
  const db = await getDB();
  return await db.getAllFromIndex(STORES.OFFLINE_QUEUE, 'by-timestamp');
};

// Supprimer un élément de la queue
export const removeFromQueue = async (id: string): Promise<void> => {
  const db = await getDB();
  await db.delete(STORES.OFFLINE_QUEUE, id);
};

// Incrémenter le compteur de retry
export const incrementRetryCount = async (id: string): Promise<void> => {
  const db = await getDB();
  const item = await db.get(STORES.OFFLINE_QUEUE, id);
  
  if (item) {
    item.retryCount += 1;
    await db.put(STORES.OFFLINE_QUEUE, item);
  }
};

// Vider la queue
export const clearQueue = async (): Promise<void> => {
  const db = await getDB();
  await db.clear(STORES.OFFLINE_QUEUE);
};

// Obtenir le nombre d'éléments dans la queue
export const getQueueCount = async (): Promise<number> => {
  const db = await getDB();
  return await db.count(STORES.OFFLINE_QUEUE);
};