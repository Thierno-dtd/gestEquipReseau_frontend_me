// src/components/shared/Notifications/NotificationCard.tsx
import React from 'react';
import { Notification } from '@models/notifications';
import dayjs from 'dayjs';

type NotificationCardProps = {
  notification: Notification;
  onClick?: () => void;
};

export const NotificationCard: React.FC<NotificationCardProps> = ({ notification, onClick }) => {
  const { id, title, message, createdAt, read } = notification;
  return (
    <div
      onClick={onClick}
      className={`
        flex items-start p-4 mb-2 border rounded-lg cursor-pointer
        ${read ? 'bg-gray-100 border-gray-200' : 'bg-white border-blue-300'}
      `}
    >
      <div className="flex-1">
        <h3 className="text-base font-semibold text-gray-800">{title}</h3>
        <p className="text-sm text-gray-600 mt-1">{message}</p>
      </div>
      <div className="ml-4 text-right text-xs text-gray-500">
        {dayjs(createdAt).format('DD MMM YYYY HH:mm')}
      </div>
    </div>
  );
};
