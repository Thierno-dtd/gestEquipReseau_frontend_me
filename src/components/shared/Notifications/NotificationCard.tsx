import { Notification } from '@/models/notifications'
import { formatRelative } from 'date-fns'
import { fr } from 'date-fns/locale'
import { BellIcon } from '@heroicons/react/24/outline'

type Props = {
  notification: Notification
}

export default function NotificationCard({ notification }: Props) {
  return (
    <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700">
      <BellIcon className="w-5 h-5 text-blue-500 mt-1" />
      <div className="flex-1">
        <p className="text-sm text-gray-800 dark:text-gray-100">{notification.message}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {formatRelative(new Date(notification.createdAt), new Date(), { locale: fr })}
        </p>
      </div>
    </div>
  )
}
