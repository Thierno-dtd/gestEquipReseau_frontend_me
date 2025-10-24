import { useNotificationStore } from '@/store/notificationStore'
import NotificationCard from './NotificationCard'
import ValidationQueue from './ValidationQueue'
import SyncStatus from './SyncStatus'

export default function NotificationCenter() {
  const { notifications } = useNotificationStore()

  return (
    <aside className="w-full max-w-md p-4 space-y-4 bg-white dark:bg-gray-900 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Centre de Notifications</h2>
      <SyncStatus />
      <ValidationQueue />
      <div className="space-y-2">
        {notifications.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">Aucune notification pour le moment.</p>
        ) : (
          notifications.map((notif) => (
            <NotificationCard key={notif.id} notification={notif} />
          ))
        )}
      </div>
    </aside>
  )
}
