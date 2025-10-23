// Re-exports de tous les types
export * from './auth';
export * from './infrastructure';
export * from './modifications';
export * from './api';

// Types communs
export interface Timestamp {
  createdAt: string;
  updatedAt: string;
}

export interface Identifiable {
  id: string;
}

// Notifications
export enum NotificationType {
  INFO = 'INFO',
  SUCCESS = 'SUCCESS',
  WARNING = 'WARNING',
  ERROR = 'ERROR',
}

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  actionUrl?: string;
  actionLabel?: string;
  metadata?: Record<string, any>;
  createdAt: string;
}

// QR Code
export interface QRCodeData {
  type: 'RACK' | 'EQUIPMENT';
  id: string;
  metadata?: Record<string, any>;
}

// Sync
export interface SyncStatus {
  isOnline: boolean;
  lastSync: string | null;
  pendingChanges: number;
  isSyncing: boolean;
  syncError: string | null;
}

// UI State
export interface ModalState {
  isOpen: boolean;
  data?: any;
}

export interface DrawerState {
  isOpen: boolean;
  data?: any;
}

// Breadcrumb
export interface BreadcrumbItem {
  label: string;
  href?: string;
  isActive?: boolean;
}

// Table
export interface TableColumn<T = any> {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: T) => React.ReactNode;
  width?: string;
}

// File Upload
export interface FileUpload {
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
}

// Export Options
export interface ExportOptions {
  format: 'PDF' | 'SVG' | 'PNG' | 'CSV' | 'XLSX';
  filename: string;
  includeMetadata?: boolean;
}

// Device Info (pour PWA)
export interface DeviceInfo {
  type: 'mobile' | 'tablet' | 'desktop';
  os: string;
  browser: string;
  isPWA: boolean;
  hasCamera: boolean;
  isOnline: boolean;
}