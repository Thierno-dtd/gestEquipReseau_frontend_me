import { useQuery } from '@tanstack/react-query';
import { infrastructureAPI } from '@services/api/infrastructure';
import { X, Cable, Activity, Info, Link as LinkIcon } from 'lucide-react';
import Loading from '@components/shared/Common/Loading';

interface PortDetailPanelProps {
  portId: string;
  onClose: () => void;
}

const PortDetailPanel = ({ portId, onClose }: PortDetailPanelProps) => {
  const { data: portDetail, isLoading } = useQuery({
    queryKey: ['port', portId],
    queryFn: () => infrastructureAPI.getPortById(portId),
    enabled: !!portId,
  });

  if (isLoading) {
    return (
      <div className="w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-4">
        <Loading text="Chargement..." />
      </div>
    );
  }

  if (!portDetail) {
    return null;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'UP':
        return 'bg-green-500';
      case 'DOWN':
        return 'bg-red-500';
      case 'DISABLED':
        return 'bg-gray-500';
      case 'ERROR':
        return 'bg-orange-500';
      default:
        return 'bg-gray-400';
    }
  };

  return (
    <div className="w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <Cable className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-gray-900 dark:text-white">
            {portDetail.name}
          </h3>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Status */}
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${getStatusColor(portDetail.status)}`} />
          <div className="flex-1">
            <p className="text-xs text-gray-600 dark:text-gray-400">Statut</p>
            <p className="font-medium text-gray-900 dark:text-white">
              {portDetail.status}
            </p>
          </div>
          <Activity className="w-5 h-5 text-gray-400" />
        </div>

        {/* Info */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-gray-400" />
            <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
              Informations
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400">Type</p>
              <p className="font-medium text-gray-900 dark:text-white">
                {portDetail.type}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400">Numéro</p>
              <p className="font-medium text-gray-900 dark:text-white">
                Port {portDetail.number}
              </p>
            </div>

            {portDetail.speed && (
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400">Vitesse</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {portDetail.speed}
                </p>
              </div>
            )}

            {portDetail.vlan && (
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400">VLAN</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {portDetail.vlan}
                </p>
              </div>
            )}
          </div>

          {portDetail.description && (
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Description</p>
              <p className="text-sm text-gray-900 dark:text-white">
                {portDetail.description}
              </p>
            </div>
          )}
        </div>

        {/* Equipment */}
        <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
            Équipement
          </p>
          <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <p className="font-medium text-gray-900 dark:text-white mb-1">
              {portDetail.equipment.name}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {portDetail.equipment.type}
            </p>
          </div>
        </div>

        {/* Connection */}
        {portDetail.connection && portDetail.connectedPort ? (
          <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-2">
              <LinkIcon className="w-4 h-4 text-green-500" />
              <p className="text-xs font-medium text-green-600 dark:text-green-400">
                Connecté
              </p>
            </div>

            <div className="p-3 bg-green-50 dark:bg-green-900/10 rounded-lg border border-green-200 dark:border-green-800">
              <p className="font-medium text-gray-900 dark:text-white mb-1">
                {portDetail.connectedPort.name}
              </p>
              <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                <p>Type: {portDetail.connection.type}</p>
                {portDetail.connection.cableType && (
                  <p>Câble: {portDetail.connection.cableType}</p>
                )}
                {portDetail.connection.length && (
                  <p>Longueur: {portDetail.connection.length}m</p>
                )}
                {portDetail.connection.throughput && (
                  <p>Débit: {portDetail.connection.throughput} Mbps</p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
            <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg text-center">
              <Cable className="w-6 h-6 text-gray-400 mx-auto mb-1" />
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Port non connecté
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PortDetailPanel;