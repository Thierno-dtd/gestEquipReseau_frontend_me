// src/components/shared/Notifications/NotificationCenter.tsx
import React, { useEffect } from 'react';
import { useNotificationStore } from '@store/notificationStore';
import { NotificationCard } from './NotificationCard';

export const NotificationCenter: React.FC = () => {
  const { notifications, fetchNotifications, markAsRead } = useNotificationStore();

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  if (notifications.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500">
        Aucune notification à afficher.
      </div>
    );
  }

  return (
    <div className="max-h-[400px] overflow-y-auto p-4">
      {notifications.map((notif) => (
        <NotificationCard
          key={notif.id}
          notification={notif}
          onClick={() => markAsRead(notif.id)}
        />
      ))}
    </div>
  );
};
