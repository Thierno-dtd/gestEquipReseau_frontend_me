import { Notification, NotificationPriority, NotificationType } from '@models/notifications';
import { formatRelativeTime } from '@utils/formatters';
import { 
  Bell, 
  CheckCircle, 
  AlertCircle, 
  Info, 
  AlertTriangle,
  Settings,
  MessageSquare,
  X
} from 'lucide-react';

interface NotificationCardProps {
  notification: Notification;
  onMarkAsRead?: (id: string) => void;
  onDelete?: (id: string) => void;
  onClick?: (notification: Notification) => void;
}

const NotificationCard = ({ 
  notification, 
  onMarkAsRead, 
  onDelete,
  onClick 
}: NotificationCardProps) => {
  const getIcon = () => {
    switch (notification.type) {
      case NotificationType.SUCCESS:
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case NotificationType.ERROR:
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case NotificationType.WARNING:
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case NotificationType.MODIFICATION:
        return <Settings className="w-5 h-5 text-blue-500" />;
      case NotificationType.MESSAGE:
        return <MessageSquare className="w-5 h-5 text-purple-500" />;
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getPriorityColor = () => {
    switch (notification.priority) {
      case NotificationPriority.URGENT:
        return 'border-l-4 border-l-red-500';
      case NotificationPriority.HIGH:
        return 'border-l-4 border-l-orange-500';
      case NotificationPriority.MEDIUM:
        return 'border-l-4 border-l-blue-500';
      default:
        return 'border-l-4 border-l-gray-400';
    }
  };

  const isUnread = notification.status === 'unread';

  return (
    <div
      className={`
        relative flex items-start gap-3 p-4 rounded-lg border transition-all
        ${isUnread 
          ? 'bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800' 
          : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
        }
        ${getPriorityColor()}
        ${onClick ? 'cursor-pointer hover:shadow-md' : ''}
      `}
      onClick={() => onClick?.(notification)}
    >
      {/* Icon */}
      <div className="flex-shrink-0 mt-0.5">
        {getIcon()}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h4 className={`text-sm font-semibold ${
            isUnread 
              ? 'text-gray-900 dark:text-white' 
              : 'text-gray-700 dark:text-gray-300'
          }`}>
            {notification.title}
          </h4>
          
          {isUnread && (
            <span className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full" />
          )}
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
          {notification.message}
        </p>

        {notification.details && (
          <p className="text-xs text-gray-500 dark:text-gray-500 mb-2 line-clamp-1">
            {notification.details}
          </p>
        )}

        <div className="flex items-center justify-between gap-2">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {formatRelativeTime(notification.createdAt)}
          </span>

          {notification.actionUrl && notification.actionLabel && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                window.location.href = notification.actionUrl!;
              }}
              className="text-xs font-medium text-primary hover:underline"
            >
              {notification.actionLabel}
            </button>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 flex-shrink-0">
        {isUnread && onMarkAsRead && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMarkAsRead(notification.id);
            }}
            className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
            title="Marquer comme lu"
          >
            <CheckCircle className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          </button>
        )}

        {onDelete && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(notification.id);
            }}
            className="p-1.5 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition-colors"
            title="Supprimer"
          >
            <X className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          </button>
        )}
      </div>
    </div>
  );
};

export default NotificationCard;