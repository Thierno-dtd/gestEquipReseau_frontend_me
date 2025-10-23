import { create } from 'zustand';
import { Notification, NotificationStatus, NotificationPriority, NotificationType } from '@models/notifications';

interface NotificationStore {
  notifications: Notification[];
  unreadCount: number;

  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'status'>) => void;
  removeNotification: (id: string) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
  clearRead: () => void;

  getUnreadNotifications: () => Notification[];
  getNotificationById: (id: string) => Notification | undefined;
}

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  notifications: [],
  unreadCount: 0,

  addNotification: (notification) => {
    const newNotification: Notification = {
      ...notification,
      id: `notif_${Date.now()}_${Math.random()}`,
      createdAt: new Date().toISOString(),
      status: NotificationStatus.UNREAD,
      priority: notification.priority || NotificationPriority.MEDIUM,
      type: notification.type || NotificationType.INFO,
    };

    set((state) => ({
      notifications: [newNotification, ...state.notifications],
      unreadCount: state.unreadCount + 1,
    }));
  },

  removeNotification: (id) => set((state) => {
    const notification = state.notifications.find((n) => n.id === id);
    return {
      notifications: state.notifications.filter((n) => n.id !== id),
      unreadCount: notification && notification.status === NotificationStatus.UNREAD
        ? state.unreadCount - 1
        : state.unreadCount,
    };
  }),

  markAsRead: (id) => set((state) => {
    const notification = state.notifications.find((n) => n.id === id);
    if (!notification || notification.status !== NotificationStatus.UNREAD) return state;

    return {
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, status: NotificationStatus.READ, readAt: new Date().toISOString() } : n
      ),
      unreadCount: state.unreadCount - 1,
    };
  }),

  markAllAsRead: () => set((state) => ({
    notifications: state.notifications.map((n) => ({
      ...n,
      status: NotificationStatus.READ,
      readAt: new Date().toISOString(),
    })),
    unreadCount: 0,
  })),

  clearAll: () => set({
    notifications: [],
    unreadCount: 0,
  }),

  clearRead: () => set((state) => ({
    notifications: state.notifications.filter((n) => n.status === NotificationStatus.UNREAD),
  })),

  getUnreadNotifications: () =>
    get().notifications.filter((n) => n.status === NotificationStatus.UNREAD),

  getNotificationById: (id) =>
    get().notifications.find((n) => n.id === id),
}));
