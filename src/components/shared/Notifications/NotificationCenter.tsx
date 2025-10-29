import { useState, useMemo } from 'react';
import { useNotificationStore } from '@store/notificationStore';
import { NotificationStatus, NotificationType } from '@models/notifications';
import NotificationCard from './NotificationCard';
import ValidationQueue from './ValidationQueue';
import SyncStatus from './SyncStatus';
import { Bell, CheckCheck, Trash2, Filter, X } from 'lucide-react';

const NotificationCenter = () => {
  const { 
    notifications, 
    unreadCount,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearRead 
  } = useNotificationStore();

  const [isOpen, setIsOpen] = useState(false);
  const [filterType, setFilterType] = useState<NotificationType | 'ALL'>('ALL');
  const [filterStatus, setFilterStatus] = useState<NotificationStatus | 'ALL'>('ALL');
  const [showFilters, setShowFilters] = useState(false);

  // Filtrer les notifications
  const filteredNotifications = useMemo(() => {
    return notifications.filter(notif => {
      const matchType = filterType === 'ALL' || notif.type === filterType;
      const matchStatus = filterStatus === 'ALL' || notif.status === filterStatus;
      return matchType && matchStatus;
    });
  }, [notifications, filterType, filterStatus]);

  // Grouper par date
  const groupedNotifications = useMemo(() => {
    const groups: Record<string, typeof notifications> = {
      today: [],
      yesterday: [],
      older: []
    };

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    filteredNotifications.forEach(notif => {
      const notifDate = new Date(notif.createdAt);
      const notifDay = new Date(notifDate.getFullYear(), notifDate.getMonth(), notifDate.getDate());

      if (notifDay.getTime() === today.getTime()) {
        groups.today.push(notif);
      } else if (notifDay.getTime() === yesterday.getTime()) {
        groups.yesterday.push(notif);
      } else {
        groups.older.push(notif);
      }
    });

    return groups;
  }, [filteredNotifications]);

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
        aria-label="Notifications"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-bold text-white bg-red-500 rounded-full">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Panel */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:relative lg:inset-auto">
          {/* Overlay (mobile only) */}
          <div 
            className="fixed inset-0 bg-black/50 lg:hidden"
            onClick={() => setIsOpen(false)}
          />

          {/* Panel */}
          <div className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white dark:bg-gray-900 shadow-xl lg:absolute lg:right-0 lg:top-12 lg:bottom-auto lg:rounded-lg lg:max-h-[600px] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                  Notifications
                </h2>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 text-xs font-bold text-white bg-red-500 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`p-2 rounded-lg transition-colors ${
                    showFilters 
                      ? 'bg-primary text-white' 
                      : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                  title="Filtres"
                >
                  <Filter className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors lg:hidden"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Filters */}
            {showFilters && (
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 space-y-3">
                <div>
                  <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2 block">
                    Type
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {['ALL', ...Object.values(NotificationType)].map(type => (
                      <button
                        key={type}
                        onClick={() => setFilterType(type as any)}
                        className={`px-3 py-1 text-xs rounded-full transition-colors ${
                          filterType === type
                            ? 'bg-primary text-white'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {type === 'ALL' ? 'Tous' : type}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2 block">
                    Statut
                  </label>
                  <div className="flex gap-2">
                    {['ALL', NotificationStatus.UNREAD, NotificationStatus.READ].map(status => (
                      <button
                        key={status}
                        onClick={() => setFilterStatus(status as any)}
                        className={`flex-1 px-3 py-1 text-xs rounded-full transition-colors ${
                          filterStatus === status
                            ? 'bg-primary text-white'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {status === 'ALL' ? 'Tous' : status === 'unread' ? 'Non lus' : 'Lus'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Status Components */}
            <div className="p-4 space-y-3 border-b border-gray-200 dark:border-gray-700">
              <SyncStatus />
              <ValidationQueue />
            </div>

            {/* Actions */}
            {notifications.length > 0 && (
              <div className="flex items-center gap-2 px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-primary hover:bg-primary/10 rounded-lg transition-colors"
                  >
                    <CheckCheck className="w-4 h-4" />
                    Tout marquer comme lu
                  </button>
                )}
                
                <button
                  onClick={clearRead}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors ml-auto"
                >
                  <Trash2 className="w-4 h-4" />
                  Effacer les lues
                </button>
              </div>
            )}

            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {filteredNotifications.length === 0 ? (
                <div className="text-center py-12">
                  <Bell className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500 dark:text-gray-400">
                    {notifications.length === 0 
                      ? 'Aucune notification' 
                      : 'Aucune notification correspondant aux filtres'
                    }
                  </p>
                </div>
              ) : (
                <>
                  {groupedNotifications.today.length > 0 && (
                    <div>
                      <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase">
                        Aujourd'hui
                      </h3>
                      <div className="space-y-2">
                        {groupedNotifications.today.map(notif => (
                          <NotificationCard
                            key={notif.id}
                            notification={notif}
                            onMarkAsRead={markAsRead}
                            onDelete={removeNotification}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {groupedNotifications.yesterday.length > 0 && (
                    <div>
                      <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase">
                        Hier
                      </h3>
                      <div className="space-y-2">
                        {groupedNotifications.yesterday.map(notif => (
                          <NotificationCard
                            key={notif.id}
                            notification={notif}
                            onMarkAsRead={markAsRead}
                            onDelete={removeNotification}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {groupedNotifications.older.length > 0 && (
                    <div>
                      <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase">
                        Plus ancien
                      </h3>
                      <div className="space-y-2">
                        {groupedNotifications.older.map(notif => (
                          <NotificationCard
                            key={notif.id}
                            notification={notif}
                            onMarkAsRead={markAsRead}
                            onDelete={removeNotification}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NotificationCenter;