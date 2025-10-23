/**
 * Application-wide constants
 */

// API Configuration
export const API_CONFIG = {
    BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
    TIMEOUT: parseInt(import.meta.env.VITE_API_TIMEOUT || '30000'),
    ENDPOINTS: {
      AUTH: {
        LOGIN: '/api/auth/login',
        LOGOUT: '/api/auth/logout',
        REFRESH: '/api/auth/refresh',
        ME: '/api/auth/me',
      },
      INFRASTRUCTURE: {
        SITES: '/api/sites',
        ZONES: '/api/zones',
        RACKS: '/api/racks',
        EQUIPMENTS: '/api/equipments',
        PORTS: '/api/ports',
        CONNECTIONS: '/api/connections',
      },
      MODIFICATIONS: {
        LIST: '/api/modifications',
        CREATE: '/api/modifications',
        APPROVE: '/api/modifications/:id/approve',
        REJECT: '/api/modifications/:id/reject',
        HISTORY: '/api/modifications/history',
      },
      USERS: {
        LIST: '/api/users',
        CREATE: '/api/users',
        UPDATE: '/api/users/:id',
        DELETE: '/api/users/:id',
      },
      NOTIFICATIONS: {
        LIST: '/api/notifications',
        MARK_READ: '/api/notifications/:id/read',
        MARK_ALL_READ: '/api/notifications/read-all',
      },
    },
  } as const;
  
  // Application Info
  export const APP_INFO = {
    NAME: import.meta.env.VITE_APP_NAME || 'InfraMap',
    VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
    DESCRIPTION: 'Gestion de l\'infrastructure réseau en temps réel',
  } as const;
  
  // Storage Keys
  export const STORAGE_KEYS = {
    AUTH_TOKEN: 'inframap_auth_token',
    REFRESH_TOKEN: 'inframap_refresh_token',
    USER: 'inframap_user',
    THEME: 'inframap_theme',
    LANGUAGE: 'inframap_language',
  } as const;
  
  // IndexedDB Configuration
  export const IDB_CONFIG = {
    NAME: import.meta.env.VITE_IDB_NAME || 'inframap-db',
    VERSION: parseInt(import.meta.env.VITE_IDB_VERSION || '1'),
    STORES: {
      SITES: 'sites',
      ZONES: 'zones',
      RACKS: 'racks',
      EQUIPMENTS: 'equipments',
      PORTS: 'ports',
      CONNECTIONS: 'connections',
      MODIFICATIONS: 'modifications',
      OFFLINE_QUEUE: 'offline_queue',
    },
  } as const;
  
  // Network Status
  export const NETWORK_STATUS = {
    ONLINE: 'online',
    OFFLINE: 'offline',
    CHECKING: 'checking',
  } as const;
  
  // Modification Status
  export const MODIFICATION_STATUS = {
    PENDING: 'pending',
    APPROVED: 'approved',
    REJECTED: 'rejected',
    APPLIED: 'applied',
  } as const;
  
  // Equipment Types
  export const EQUIPMENT_TYPES = {
    SWITCH: 'switch',
    ROUTER: 'router',
    SERVER: 'server',
    FIREWALL: 'firewall',
    ACCESS_POINT: 'access_point',
    PLC: 'plc',
    HMI: 'hmi',
    SENSOR: 'sensor',
    OTHER: 'other',
  } as const;
  
  // Network Types
  export const NETWORK_TYPES = {
    IT: 'IT',
    OT: 'OT',
  } as const;
  
  // Port Status
  export const PORT_STATUS = {
    ACTIVE: 'active',
    INACTIVE: 'inactive',
    DOWN: 'down',
    ERROR: 'error',
    EMPTY: 'empty',
  } as const;
  
  // Connection Types
  export const CONNECTION_TYPES = {
    COPPER: 'copper',
    FIBER: 'fiber',
    WIRELESS: 'wireless',
  } as const;
  
  // Toast Duration
  export const TOAST_DURATION = {
    SHORT: 3000,
    MEDIUM: 5000,
    LONG: 7000,
  } as const;
  
  // Pagination
  export const PAGINATION = {
    DEFAULT_PAGE_SIZE: 20,
    PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
  } as const;
  
  // Date Formats
  export const DATE_FORMATS = {
    FULL: 'dd/MM/yyyy HH:mm:ss',
    DATE: 'dd/MM/yyyy',
    TIME: 'HH:mm:ss',
    SHORT: 'dd/MM/yyyy HH:mm',
    RELATIVE: 'relative', // il y a X minutes/heures
  } as const;
  
  // File Upload
  export const FILE_UPLOAD = {
    MAX_SIZE: 5 * 1024 * 1024, // 5MB
    ACCEPTED_TYPES: ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf'],
  } as const;
  
  // QR Code
  export const QR_CODE = {
    PREFIX: 'INFRAMAP',
    VERSION: '1',
    SCAN_INTERVAL: 100, // ms
  } as const;
  
  // Colors for IT/OT
  export const COLORS = {
    IT: {
      PRIMARY: '#007BFF',
      LIGHT: '#CCE5FF',
      DARK: '#0056B3',
    },
    OT: {
      PRIMARY: '#FF9800',
      LIGHT: '#FFE0B2',
      DARK: '#E65100',
    },
    STATUS: {
      ONLINE: '#28a745',
      OFFLINE: '#dc3545',
      WARNING: '#ffc107',
      INFO: '#17a2b8',
    },
  } as const;
  
  // Regex Patterns
  export const REGEX = {
    EMAIL: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
    IP_V4: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
    MAC_ADDRESS: /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/,
    PORT_NUMBER: /^([1-9][0-9]{0,3}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5])$/,
  } as const;
  
  // Feature Flags
  export const FEATURES = {
    OFFLINE_MODE: import.meta.env.VITE_ENABLE_OFFLINE_MODE === 'true',
    QR_SCANNER: import.meta.env.VITE_ENABLE_QR_SCANNER === 'true',
    NOTIFICATIONS: import.meta.env.VITE_ENABLE_NOTIFICATIONS === 'true',
  } as const;
  
  // Cache Configuration
  export const CACHE_CONFIG = {
    MAX_SIZE: parseInt(import.meta.env.VITE_MAX_CACHE_SIZE || '50') * 1024 * 1024, // in bytes
    EXPIRATION: parseInt(import.meta.env.VITE_CACHE_EXPIRATION || '86400'), // in seconds
  } as const;