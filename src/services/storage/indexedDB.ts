import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { DB_NAME, DB_VERSION, STORES } from './constants';

// Schéma de la base de données
interface InfraMapDB extends DBSchema {
  [STORES.SITES]: {
    key: string;
    value: any;
    indexes: { 'by-name': string };
  };
  [STORES.ZONES]: {
    key: string;
    value: any;
    indexes: { 'by-site': string };
  };
  [STORES.RACKS]: {
    key: string;
    value: any;
    indexes: { 'by-zone': string; 'by-qr': string };
  };
  [STORES.EQUIPMENTS]: {
    key: string;
    value: any;
    indexes: { 'by-rack': string };
  };
  [STORES.PORTS]: {
    key: string;
    value: any;
    indexes: { 'by-equipment': string };
  };
  [STORES.CONNECTIONS]: {
    key: string;
    value: any;
  };
  [STORES.MODIFICATIONS]: {
    key: string;
    value: any;
    indexes: { 'by-status': string };
  };
  [STORES.OFFLINE_QUEUE]: {
    key: string;
    value: any;
    indexes: { 'by-timestamp': number };
  };
  [STORES.CACHE]: {
    key: string;
    value: {
      data: any;
      timestamp: number;
      expiresAt: number;
    };
  };
}

let dbInstance: IDBPDatabase<InfraMapDB> | null = null;

// Initialiser la base de données
export const initDB = async (): Promise<IDBPDatabase<InfraMapDB>> => {
  if (dbInstance) return dbInstance;

  dbInstance = await openDB<InfraMapDB>(DB_NAME, DB_VERSION, {
    upgrade(db, oldVersion, newVersion) {
      console.log(`Upgrading DB from ${oldVersion} to ${newVersion}`);

      // Créer les stores si nécessaire
      if (!db.objectStoreNames.contains(STORES.SITES)) {
        const sitesStore = db.createObjectStore(STORES.SITES, { keyPath: 'id' });
        sitesStore.createIndex('by-name', 'name');
      }

      if (!db.objectStoreNames.contains(STORES.ZONES)) {
        const zonesStore = db.createObjectStore(STORES.ZONES, { keyPath: 'id' });
        zonesStore.createIndex('by-site', 'siteId');
      }

      if (!db.objectStoreNames.contains(STORES.RACKS)) {
        const racksStore = db.createObjectStore(STORES.RACKS, { keyPath: 'id' });
        racksStore.createIndex('by-zone', 'zoneId');
        racksStore.createIndex('by-qr', 'qrCode');
      }

      if (!db.objectStoreNames.contains(STORES.EQUIPMENTS)) {
        const equipmentsStore = db.createObjectStore(STORES.EQUIPMENTS, { keyPath: 'id' });
        equipmentsStore.createIndex('by-rack', 'rackId');
      }

      if (!db.objectStoreNames.contains(STORES.PORTS)) {
        const portsStore = db.createObjectStore(STORES.PORTS, { keyPath: 'id' });
        portsStore.createIndex('by-equipment', 'equipmentId');
      }

      if (!db.objectStoreNames.contains(STORES.CONNECTIONS)) {
        db.createObjectStore(STORES.CONNECTIONS, { keyPath: 'id' });
      }

      if (!db.objectStoreNames.contains(STORES.MODIFICATIONS)) {
        const modsStore = db.createObjectStore(STORES.MODIFICATIONS, { keyPath: 'id' });
        modsStore.createIndex('by-status', 'status');
      }

      if (!db.objectStoreNames.contains(STORES.OFFLINE_QUEUE)) {
        const queueStore = db.createObjectStore(STORES.OFFLINE_QUEUE, { keyPath: 'id' });
        queueStore.createIndex('by-timestamp', 'timestamp');
      }

      if (!db.objectStoreNames.contains(STORES.CACHE)) {
        db.createObjectStore(STORES.CACHE, { keyPath: 'key' });
      }
    },
  });

  return dbInstance;
};

// Obtenir l'instance de la DB
export const getDB = async (): Promise<IDBPDatabase<InfraMapDB>> => {
  if (!dbInstance) {
    dbInstance = await initDB();
  }
  return dbInstance;
};

// Fermer la connexion
export const closeDB = () => {
  if (dbInstance) {
    dbInstance.close();
    dbInstance = null;
  }
};