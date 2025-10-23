import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationsAPI } from '@/services/api/notifications';
import { useNotificationStore } from '@/store/notificationStore';
import { toast } from 'sonner';

export const useNotifications = () => {
  const queryClient = useQueryClient();
  const {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead: markAllAsReadStore,
    removeNotification,
  } = useNotificationStore();

  // Fetch notifications
  const { data, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => notificationsAPI.getNotifications(),
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  // Update store when data changes
  useEffect(() => {
    if (data?.data) {
      data.data.forEach((notif) => addNotification(notif));
    }
  }, [data]);

  // Mark as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: (id: string) => notificationsAPI.markAsRead(id),
    onSuccess: (_, id) => {
      markAsRead(id);
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
    onError: () => {
      toast.error('Erreur lors du marquage de la notification');
    },
  });

  // Mark all as read mutation
  const markAllAsReadMutation = useMutation({
    mutationFn: () => notificationsAPI.markAllAsRead(),
    onSuccess: () => {
      markAllAsReadStore();
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast.success('Toutes les notifications ont été marquées comme lues');
    },
    onError: () => {
      toast.error('Erreur lors du marquage des notifications');
    },
  });

  // Delete notification mutation
  const deleteNotificationMutation = useMutation({
    mutationFn: (id: string) => notificationsAPI.deleteNotification(id),
    onSuccess: (_, id) => {
      removeNotification(id);
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast.success('Notification supprimée');
    },
    onError: () => {
      toast.error('Erreur lors de la suppression');
    },
  });

  return {
    notifications,
    unreadCount,
    isLoading,
    markAsRead: markAsReadMutation.mutate,
    markAllAsRead: markAllAsReadMutation.mutate,
    deleteNotification: deleteNotificationMutation.mutate,
  };
};