import { NetworkType, EquipmentStatus } from '@/models/infrastructure';

// Couleurs IT/OT
export const NETWORK_COLORS = {
  IT: {
    primary: '#007BFF',
    light: '#4DA3FF',
    dark: '#0056B3',
    bg: 'rgba(0, 123, 255, 0.1)',
    text: '#0056B3',
  },
  OT: {
    primary: '#FF9800',
    light: '#FFB547',
    dark: '#C77700',
    bg: 'rgba(255, 152, 0, 0.1)',
    text: '#C77700',
  },
} as const;

// Couleurs de statut
export const STATUS_COLORS = {
  ONLINE: {
    bg: '#28a745',
    text: '#ffffff',
    border: '#28a745',
  },
  OFFLINE: {
    bg: '#dc3545',
    text: '#ffffff',
    border: '#dc3545',
  },
  WARNING: {
    bg: '#ffc107',
    text: '#000000',
    border: '#ffc107',
  },
  MAINTENANCE: {
    bg: '#6c757d',
    text: '#ffffff',
    border: '#6c757d',
  },
  ERROR: {
    bg: '#dc3545',
    text: '#ffffff',
    border: '#dc3545',
  },
} as const;

// Couleurs des modifications
export const MODIFICATION_COLORS = {
  PROPOSED: {
    bg: '#17a2b8',
    text: '#ffffff',
    light: 'rgba(23, 162, 184, 0.1)',
  },
  PENDING: {
    bg: '#ffc107',
    text: '#000000',
    light: 'rgba(255, 193, 7, 0.1)',
  },
  APPROVED: {
    bg: '#28a745',
    text: '#ffffff',
    light: 'rgba(40, 167, 69, 0.1)',
  },
  REJECTED: {
    bg: '#dc3545',
    text: '#ffffff',
    light: 'rgba(220, 53, 69, 0.1)',
  },
  APPLIED: {
    bg: '#6c757d',
    text: '#ffffff',
    light: 'rgba(108, 117, 125, 0.1)',
  },
  CANCELLED: {
    bg: '#6c757d',
    text: '#ffffff',
    light: 'rgba(108, 117, 125, 0.1)',
  },
} as const;

// Helper functions
export const getNetworkColor = (networkType: NetworkType) => {
  return NETWORK_COLORS[networkType];
};

export const getStatusColor = (status: EquipmentStatus) => {
  return STATUS_COLORS[status];
};

export const getStatusDotClass = (status: EquipmentStatus): string => {
  const colorMap = {
    ONLINE: 'bg-green-500',
    OFFLINE: 'bg-red-500',
    WARNING: 'bg-yellow-500',
    MAINTENANCE: 'bg-gray-500',
    ERROR: 'bg-red-500',
  };
  return colorMap[status];
};

export const getNetworkBadgeClass = (networkType: NetworkType): string => {
  return networkType === NetworkType.IT
    ? 'bg-it text-white'
    : 'bg-ot text-white';
};