import { useSyncStore } from '@store/syncStore';
import { useOfflineSync } from '@hooks/useOfflineSync';
import { formatRelativeTime } from '@utils/formatters';
import { 
  CloudOff, 
  Cloud, 
  RefreshCw, 
  CheckCircle,
  AlertCircle,
  Clock
} from 'lucide-react';

const SyncStatus = () => {
  const { isOnline, pendingChanges, lastSync, isSyncing, syncError } = useSyncStore();
  const { forceSync, canSync } = useOfflineSync();

  const pendingCount = pendingChanges.length;

  return (
    <div className={`
      flex items-center justify-between p-3 rounded-lg border transition-all
      ${isOnline 
        ? 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800' 
        : 'bg-orange-50 dark:bg-orange-900/10 border-orange-200 dark:border-orange-800'
      }
    `}>
      <div className="flex items-center gap-3">
        {/* Icon */}
        <div className={`
          flex items-center justify-center w-10 h-10 rounded-full
          ${isOnline 
            ? 'bg-green-100 dark:bg-green-900/30' 
            : 'bg-orange-100 dark:bg-orange-900/30'
          }
        `}>
          {isSyncing ? (
            <RefreshCw className="w-5 h-5 text-blue-600 dark:text-blue-400 animate-spin" />
          ) : isOnline ? (
            <Cloud className="w-5 h-5 text-green-600 dark:text-green-400" />
          ) : (
            <CloudOff className="w-5 h-5 text-orange-600 dark:text-orange-400" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <p className={`text-sm font-semibold ${
              isOnline 
                ? 'text-green-900 dark:text-green-400' 
                : 'text-orange-900 dark:text-orange-400'
            }`}>
              {isSyncing ? 'Synchronisation...' : isOnline ? 'En ligne' : 'Hors ligne'}
            </p>

            {pendingCount > 0 && (
              <span className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                <Clock className="w-3 h-3" />
                {pendingCount} en attente
              </span>
            )}
          </div>

          {/* Last sync / Error */}
          {syncError ? (
            <div className="flex items-center gap-1 text-xs text-red-600 dark:text-red-400">
              <AlertCircle className="w-3 h-3" />
              <span>{syncError}</span>
            </div>
          ) : lastSync ? (
            <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
              <CheckCircle className="w-3 h-3" />
              <span>Dernière sync: {formatRelativeTime(lastSync)}</span>
            </div>
          ) : (
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {isOnline ? 'Connecté' : 'Mode hors ligne actif'}
            </p>
          )}
        </div>
      </div>

      {/* Sync Button */}
      {canSync && (
        <button
          onClick={forceSync}
          disabled={isSyncing}
          className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/10 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Forcer la synchronisation"
        >
          <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
          Sync
        </button>
      )}
    </div>
  );
};

export default SyncStatus;