import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { infrastructureAPI } from '@services/api';
import { ArrowLeft, Cable, Activity, Edit, Link as LinkIcon } from 'lucide-react';
import Loading from '@components/shared/Common/Loading';
import { PortStatus } from '@models/infrastructure';

const PortDetailPage = () => {
  const { portId } = useParams<{ portId: string }>();
  const navigate = useNavigate();

  // Récupérer les détails du port
  const { data: portDetail, isLoading } = useQuery({
    queryKey: ['port', portId],
    queryFn: () => infrastructureAPI.getPortById(portId!),
    enabled: !!portId,
  });

  if (isLoading) {
    return <Loading fullScreen text="Chargement du port..." />;
  }

  if (!portDetail) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <p className="text-gray-600 dark:text-gray-400">Port non trouvé</p>
      </div>
    );
  }

  const { equipment, connection, connectedPort } = portDetail.data;

  const getStatusColor = (status: PortStatus) => {
    switch (status) {
      case PortStatus.UP:
        return 'bg-green-500';
      case PortStatus.DOWN:
        return 'bg-red-500';
      case PortStatus.DISABLED:
        return 'bg-gray-500';
      case PortStatus.ERROR:
        return 'bg-orange-500';
      default:
        return 'bg-gray-400';
    }
  };

  const getStatusLabel = (status: PortStatus) => {
    switch (status) {
      case PortStatus.UP:
        return 'Actif';
      case PortStatus.DOWN:
        return 'Inactif';
      case PortStatus.DISABLED:
        return 'Désactivé';
      case PortStatus.ERROR:
        return 'Erreur';
      default:
        return 'Inconnu';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {portDetail.name}
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {equipment.name} • Port #{portDetail.number}
            </p>
          </div>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
          <Edit className="w-5 h-5" />
          Modifier
        </button>
      </div>

      {/* Status Card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-4">
          <div className={`w-16 h-16 rounded-full ${getStatusColor(portDetail.status)} bg-opacity-20 flex items-center justify-center`}>
            <Activity className={`w-8 h-8 ${getStatusColor(portDetail.status).replace('bg-', 'text-')}`} />
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Statut du port</p>
            <div className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${getStatusColor(portDetail.status)}`} />
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                {getStatusLabel(portDetail.status)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Informations du port */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Informations du port
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Type de port</p>
            <p className="font-medium text-gray-900 dark:text-white">
              {portDetail.type}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Numéro</p>
            <p className="font-medium text-gray-900 dark:text-white">
              Port {portDetail.number}
            </p>
          </div>
          {portDetail.speed && (
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Vitesse</p>
              <p className="font-medium text-gray-900 dark:text-white">
                {portDetail.speed}
              </p>
            </div>
          )}
          {portDetail.vlan && (
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">VLAN</p>
              <p className="font-medium text-gray-900 dark:text-white">
                {portDetail.vlan}
              </p>
            </div>
          )}
        </div>

        {portDetail.description && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Description</p>
            <p className="text-gray-900 dark:text-white">
              {portDetail.description}
            </p>
          </div>
        )}
      </div>

      {/* Équipement parent */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Équipement
        </h3>
        <div
          onClick={() => navigate(`/equipments/${equipment.id}`)}
          className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
              {equipment.name}
            </h4>
            <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
              <span>{equipment.type}</span>
              {equipment.ipAddress && (
                <>
                  <span>•</span>
                  <span className="font-mono">{equipment.ipAddress}</span>
                </>
              )}
            </div>
          </div>
          <ArrowLeft className="w-5 h-5 text-gray-400 rotate-180" />
        </div>
      </div>

      {/* Connexion */}
      {connection && connectedPort ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Cable className="w-5 h-5" />
            Connexion active
          </h3>

          {/* Info connexion */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/10 rounded-lg border border-green-200 dark:border-green-800">
              <LinkIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
              <div className="flex-1">
                <p className="text-sm font-medium text-green-900 dark:text-green-400">
                  Connecté à {connectedPort.name}
                </p>
                <p className="text-xs text-green-700 dark:text-green-500 mt-1">
                  Type: {connection.type}
                  {connection.length && ` • Longueur: ${connection.length}m`}
                </p>
              </div>
            </div>

            {/* Détails de la connexion */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {connection.cableType && (
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Type de câble
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {connection.cableType}
                  </p>
                </div>
              )}
              {connection.throughput && (
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Débit
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {connection.throughput} Mbps
                  </p>
                </div>
              )}
              {connection.label && (
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Label
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {connection.label}
                  </p>
                </div>
              )}
            </div>

            {/* Port connecté */}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Port de destination
              </p>
              <div
                onClick={() => navigate(`/ports/${connectedPort.id}`)}
                className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                    {connectedPort.name}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {connectedPort.type}
                    {connectedPort.speed && ` • ${connectedPort.speed}`}
                  </p>
                </div>
                <ArrowLeft className="w-5 h-5 text-gray-400 rotate-180" />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700 text-center">
          <Cable className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Ce port n'est connecté à aucun autre port
          </p>
          <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
            Créer une connexion
          </button>
        </div>
      )}

      {/* Métadonnées */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
          Métadonnées
        </h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Date de création</span>
            <span className="text-gray-900 dark:text-white">
              {new Date(portDetail.createdAt).toLocaleDateString('fr-FR')}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Dernière modification</span>
            <span className="text-gray-900 dark:text-white">
              {new Date(portDetail.updatedAt).toLocaleDateString('fr-FR')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortDetailPage;