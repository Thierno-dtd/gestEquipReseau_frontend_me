import { get, put, del } from './client';
import { Notification } from '@models/notifications';
import { PaginatedResponse } from '@models/api';

// Endpoints notifications
export const notificationsAPI = {
  // Obtenir toutes les notifications
  getNotifications: (params?: any): Promise<PaginatedResponse<Notification>> => {
    return get<PaginatedResponse<Notification>>('/notifications', params)
      .then((res) => res.data);
  },

  // Obtenir les notifications non lues
  getUnreadNotifications: (params?: any): Promise<PaginatedResponse<Notification>> => {
    return get<PaginatedResponse<Notification>>('/notifications/unread', params)
      .then((res) => res.data);
  },

  // Marquer comme lue
  markAsRead: (id: string): Promise<void> => {
    return put(`/notifications/${id}/read`).then(() => undefined);
  },

  // Marquer toutes comme lues
  markAllAsRead: (): Promise<void> => {
    return put('/notifications/read-all').then(() => undefined);
  },

  // Supprimer une notification
  deleteNotification: (id: string): Promise<void> => {
    return del(`/notifications/${id}`).then(() => undefined);
  },

  // Supprimer toutes les notifications lues
  deleteReadNotifications: (): Promise<void> => {
    return del('/notifications/read').then(() => undefined);
  },

  // Obtenir le nombre de notifications non lues
  getUnreadCount: (): Promise<number> => {
    return get<{ count: number }>('/notifications/unread/count')
      .then((res) => res.data.count);
  },

  // S'abonner aux notifications (WebSocket/SSE)
  // Note: À implémenter selon la méthode de push choisie
  subscribe: (callback: (notification: Notification) => void) => {
    // TODO: Implémenter WebSocket ou Server-Sent Events
    console.log('Notification subscription', callback);
  },
};