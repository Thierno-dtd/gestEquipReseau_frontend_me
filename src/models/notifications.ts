
// Type de notification
export enum NotificationType {
    INFO = 'info',
    SUCCESS = 'success',
    WARNING = 'warning',
    ERROR = 'error',
    MODIFICATION = 'modification',
    SYSTEM = 'system',
    MESSAGE = 'message',
  }
  
  // Priorité de notification
  export enum NotificationPriority {
    LOW = 'low',
    MEDIUM = 'medium',
    HIGH = 'high',
    URGENT = 'urgent',
  }
  
  // Statut de lecture
  export enum NotificationStatus {
    UNREAD = 'unread',
    READ = 'read',
    ARCHIVED = 'archived',
  }
  
  // Canaux disponibles
  export enum NotificationChannel {
    IN_APP = 'in_app',
    EMAIL = 'email',
    PUSH = 'push',
    SMS = 'sms',
    WEBHOOK = 'webhook',
  }
  
  // ====================
  // 🔔 Entité principale
  // ====================
  
  export interface Notification {
    id: string;
    type: NotificationType;
    priority: NotificationPriority;
    status: NotificationStatus;
    title: string;
    message: string;
    details?: string;
  
    // Métadonnées système
    createdAt: string;
    readAt?: string;
    archivedAt?: string;
  
    // Lien ou action associée
    actionUrl?: string;
    actionLabel?: string;
  
    // Contexte utilisateur ou objet concerné
    userId?: string;
    relatedEntity?: {
      type: 'site' | 'zone' | 'rack' | 'equipment' | 'modification';
      id: string;
      name: string;
    };
  
    // Données supplémentaires (flexible)
    metadata?: Record<string, any>;
  }
  
  // ====================
  // 🧾 Création / Payload
  // ====================
  
  export interface CreateNotificationPayload {
    type: NotificationType;
    priority?: NotificationPriority;
    title: string;
    message: string;
    details?: string;
    actionUrl?: string;
    actionLabel?: string;
    userId?: string;
    relatedEntity?: {
      type: 'site' | 'zone' | 'rack' | 'equipment' | 'modification';
      id: string;
      name: string;
    };
    metadata?: Record<string, any>;
  }
  
  // ====================
  // 🔍 Filtres et Statistiques
  // ====================
  
  export interface NotificationFilters {
    type?: NotificationType;
    priority?: NotificationPriority;
    status?: NotificationStatus;
    userId?: string;
    dateFrom?: string;
    dateTo?: string;
    search?: string;
  }
  
  export interface NotificationStats {
    total: number;
    unread: number;
    byType: Record<NotificationType, number>;
    byPriority: Record<NotificationPriority, number>;
    recent: Notification[];
  }
  
  // ====================
  // ⚙️ Préférences et Réglages
  // ====================
  
  export interface NotificationPreferences {
    email: boolean;
    push: boolean;
    inApp: boolean;
    types: {
      [key in NotificationType]: boolean;
    };
    quietHours: {
      enabled: boolean;
      start: string; // Format HH:mm
      end: string;   // Format HH:mm
    };
  }
  
  export interface NotificationSettings {
    preferences: NotificationPreferences;
    frequency: 'realtime' | 'hourly' | 'daily' | 'weekly';
    digest: boolean;
    digestTime: string; // Format HH:mm
  }
  
  // ====================
  // ⚡ Actions et Groupes
  // ====================
  
  export interface NotificationAction {
    id: string;
    label: string;
    action: () => void;
    variant?: 'primary' | 'secondary' | 'danger';
  }
  
  export interface NotificationGroup {
    id: string;
    title: string;
    notifications: Notification[];
    count: number;
    unreadCount: number;
    lastNotification?: Notification;
  }
  
  // ====================
  // 🧱 Templates & Webhooks
  // ====================
  
  export interface NotificationTemplate {
    id: string;
    name: string;
    type: NotificationType;
    title: string;
    message: string;
    variables: string[];
    isSystem: boolean;
  }
  
  export interface NotificationWebhook {
    id: string;
    url: string;
    events: NotificationType[];
    secret?: string;
    isActive: boolean;
    createdAt: string;
    lastTriggered?: string;
  }
  
  // ====================
  // 🧩 Configuration Canaux & Règles
  // ====================
  
  export interface NotificationChannelConfig {
    channel: NotificationChannel;
    enabled: boolean;
    settings: Record<string, any>;
  }
  
  export interface NotificationRule {
    id: string;
    name: string;
    description?: string;
    conditions: {
      entityType: string;
      eventType: string;
      filters?: Record<string, any>;
    };
    actions: {
      type: NotificationType;
      priority: NotificationPriority;
      template: string;
      channels: NotificationChannel[];
    };
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  }
  