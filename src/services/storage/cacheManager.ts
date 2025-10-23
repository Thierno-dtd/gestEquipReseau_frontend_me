import { getDB } from './indexedDB';
import { STORES, CACHE_DURATION } from './constants';

// Sauvegarder dans le cache
export const setCache = async (
  key: string,
  data: any,
  duration: number = CACHE_DURATION.MEDIUM
): Promise<void> => {
  const db = await getDB();
  const timestamp = Date.now();
  const expiresAt = timestamp + duration;

  await db.put(STORES.CACHE, {
    data,
    timestamp,
    expiresAt,
  }, key);
};

// Récupérer depuis le cache
export const getCache = async <T = any>(key: string): Promise<T | null> => {
  const db = await getDB();
  const cached = await db.get(STORES.CACHE, key);

  if (!cached) return null;

  // Vérifier si le cache a expiré
  if (Date.now() > cached.expiresAt) {
    await db.delete(STORES.CACHE, key);
    return null;
  }

  return cached.data as T;
};

// Supprimer un élément du cache
export const deleteCache = async (key: string): Promise<void> => {
  const db = await getDB();
  await db.delete(STORES.CACHE, key);
};

// Nettoyer le cache expiré
export const clearExpiredCache = async (): Promise<void> => {
  const db = await getDB();
  const now = Date.now();
  const tx = db.transaction(STORES.CACHE, 'readwrite');
  const store = tx.objectStore(STORES.CACHE);
  
  let cursor = await store.openCursor();
  
  while (cursor) {
    if (cursor.value.expiresAt < now) {
      await cursor.delete();
    }
    cursor = await cursor.continue();
  }
  
  await tx.done;
};

// Vider tout le cache
export const clearAllCache = async (): Promise<void> => {
  const db = await getDB();
  await db.clear(STORES.CACHE);
};