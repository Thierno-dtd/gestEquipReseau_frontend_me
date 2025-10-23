// Constantes pour IndexedDB

export const DB_NAME = import.meta.env.VITE_DB_NAME || 'inframap_db';
export const DB_VERSION = parseInt(import.meta.env.VITE_DB_VERSION) || 1;

// Noms des stores
export const STORES = {
  SITES: 'sites',
  ZONES: 'zones',
  RACKS: 'racks',
  EQUIPMENTS: 'equipments',
  PORTS: 'ports',
  CONNECTIONS: 'connections',
  MODIFICATIONS: 'modifications',
  OFFLINE_QUEUE: 'offline_queue',
  CACHE: 'cache',
} as const;

// Durée de cache (en millisecondes)
export const CACHE_DURATION = {
  SHORT: 5 * 60 * 1000,      // 5 minutes
  MEDIUM: 30 * 60 * 1000,    // 30 minutes
  LONG: 60 * 60 * 1000,      // 1 heure
  VERY_LONG: 24 * 60 * 60 * 1000, // 24 heures
};

// Clés de cache
export const CACHE_KEYS = {
  SITES_LIST: 'sites_list',
  ZONES_LIST: 'zones_list',
  RACKS_LIST: 'racks_list',
  USER_PROFILE: 'user_profile',
};