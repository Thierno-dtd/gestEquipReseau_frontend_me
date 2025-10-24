import { useSyncStore } from '@/store/syncStore'
import { CloudArrowUpIcon, CloudIcon } from '@heroicons/react/24/outline'

export default function SyncStatus() {
  const { isOnline, pendingChanges, lastSync } = useSyncStore()

  return (
    <div className="flex items-center justify-between p-2 bg-gray-100 dark:bg-gray-800 rounded-md text-sm">
      <div className="flex items-center gap-2">
        {isOnline ? (
          <CloudArrowUpIcon className="w-5 h-5 text-green-500" />
        ) : (
          <CloudIcon className="w-5 h-5 text-red-500" />
        )}
        <span className="text-gray-700 dark:text-gray-300">
          {isOnline ? 'Connecté' : 'Hors ligne'} — {pendingChanges.length} changement(s) en attente
        </span>
      </div>
      {lastSync && (
        <span className="text-xs text-gray-500 dark:text-gray-400">
          Dernière sync : {new Date(lastSync).toLocaleTimeString()}
        </span>
      )}
    </div>
  )
}
