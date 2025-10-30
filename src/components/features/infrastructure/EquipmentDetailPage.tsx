import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { infrastructureAPI } from '@services/api';
import { 
  ArrowLeft, 
  Edit, 
  Wifi, 
  WifiOff, 
  AlertCircle,
  Router,
  Cable,
  Info
} from 'lucide-react';
import Loading from '@components/shared/Common/Loading';
import Badge from '@components/shared/Common/Badge';
import { EquipmentStatus, NetworkType, PortStatus } from '@models/infrastructure';

const EquipmentDetailPage = () => {
  const { equipmentId } = useParams<{ equipmentId: string }>();
  const navigate = useNavigate();

  // Récupérer les détails de l'équipement
  const { data: equipmentDetail, isLoading } = useQuery({
    queryKey: ['equipment', equipmentId],
    queryFn: () => infrastructureAPI.getEquipmentById(equipmentId!),
    enabled: !!equipmentId,
  });

  if (isLoading) {
    return <Loading fullScreen text="Chargement de l'équipement..." />;
  }

  if (!equipmentDetail) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <p className="text-gray-600 dark:text-gray-400">Équipement non trouvé</p>
      </div>
    );
  }

  const { rack, ports, connections } = equipmentDetail.data;
  console.log(JSON.stringify(rack));

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
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {equipmentDetail.name}
              </h1>
              <Badge
                variant={equipmentDetail.networkType === NetworkType.IT ? 'it' : 'ot'}
                networkType={equipmentDetail.networkType}
              >
                {equipmentDetail.networkType}
              </Badge>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {rack.name} • Position U{equipmentDetail.position}
            </p>
          </div>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
          <Edit className="w-5 h-5" />
          Modifier
        </button>
      </div>

      {/* Status Card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {equipmentDetail.status === EquipmentStatus.ONLINE ? (
              <Wifi className="w-8 h-8 text-green-500" />
            ) : equipmentDetail.status === EquipmentStatus.OFFLINE ? (
              <WifiOff className="w-8 h-8 text-red-500" />
            ) : (
              <AlertCircle className="w-8 h-8 text-yellow-500" />
            )}
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Statut</p>
              <Badge variant="status" status={equipmentDetail.status}>
                {equipmentDetail.status}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Informations générales */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Info className="w-5 h-5" />
          Informations générales
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Type</p>
            <p className="font-medium text-gray-900 dark:text-white">
              {equipmentDetail.type}
            </p>
          </div>
          {equipmentDetail.manufacturer && (
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Fabricant</p>
              <p className="font-medium text-gray-900 dark:text-white">
                {equipmentDetail.manufacturer}
              </p>
            </div>
          )}
          {equipmentDetail.model && (
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Modèle</p>
              <p className="font-medium text-gray-900 dark:text-white">
                {equipmentDetail.model}
              </p>
            </div>
          )}
          {equipmentDetail.serialNumber && (
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">N° de série</p>
              <p className="font-medium text-gray-900 dark:text-white font-mono">
                {equipmentDetail.serialNumber}
              </p>
            </div>
          )}
          {equipmentDetail.ipAddress && (
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Adresse IP</p>
              <p className="font-medium text-gray-900 dark:text-white font-mono">
                {equipmentDetail.ipAddress}
              </p>
            </div>
          )}
          {equipmentDetail.macAddress && (
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Adresse MAC</p>
              <p className="font-medium text-gray-900 dark:text-white font-mono">
                {equipmentDetail.macAddress}
              </p>
            </div>
          )}
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Hauteur</p>
            <p className="font-medium text-gray-900 dark:text-white">
              {equipmentDetail.height}U
            </p>
          </div>
          {equipmentDetail.powerConsumption && (
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Consommation</p>
              <p className="font-medium text-gray-900 dark:text-white">
                {equipmentDetail.powerConsumption}W
              </p>
            </div>
          )}
          {equipmentDetail.firmware && (
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Firmware</p>
              <p className="font-medium text-gray-900 dark:text-white">
                {equipmentDetail.firmware}
              </p>
            </div>
          )}
        </div>

        {equipmentDetail.description && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Description</p>
            <p className="text-gray-900 dark:text-white">
              {equipmentDetail.description}
            </p>
          </div>
        )}
      </div>

      {/* Ports */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Router className="w-5 h-5" />
            Ports ({ports.length})
          </h3>
        </div>

        {ports.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
            <Router className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 dark:text-gray-400">Aucun port configuré</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {ports.map((port) => (
              <div
                key={port.id}
                onClick={() => navigate(`/ports/${port.id}`)}
                className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 hover:border-primary hover:shadow-md transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      port.status === PortStatus.UP
                        ? 'bg-green-500'
                        : port.status === PortStatus.DOWN
                        ? 'bg-red-500'
                        : 'bg-gray-400'
                    }`} />
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {port.name}
                    </h4>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                    {port.type}
                  </span>
                </div>

                <div className="space-y-1 text-sm">
                  {port.speed && (
                    <p className="text-gray-600 dark:text-gray-400">
                      Vitesse: {port.speed}
                    </p>
                  )}
                  {port.vlan && (
                    <p className="text-gray-600 dark:text-gray-400">
                      VLAN: {port.vlan}
                    </p>
                  )}
                  {port.connectedTo && (
                    <div className="flex items-center gap-1 text-primary">
                      <Cable className="w-4 h-4" />
                      <span>Connecté</span>
                    </div>
                  )}
                </div>

                {port.description && (
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 truncate">
                    {port.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Connexions */}
      {connections.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Cable className="w-5 h-5" />
            Connexions ({connections.length})
          </h3>

          <div className="space-y-3">
            {connections.map((connection) => (
              <div
                key={connection.id}
                className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`w-2 h-2 rounded-full ${
                        connection.status === PortStatus.UP
                          ? 'bg-green-500'
                          : 'bg-red-500'
                      }`} />
                      <span className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                        {connection.type}
                      </span>
                      {connection.label && (
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {connection.label}
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      {connection.cableType && (
                        <div>
                          <p className="text-gray-600 dark:text-gray-400">Type de câble</p>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {connection.cableType}
                          </p>
                        </div>
                      )}
                      {connection.length && (
                        <div>
                          <p className="text-gray-600 dark:text-gray-400">Longueur</p>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {connection.length}m
                          </p>
                        </div>
                      )}
                      {connection.throughput && (
                        <div>
                          <p className="text-gray-600 dark:text-gray-400">Débit</p>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {connection.throughput} Mbps
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Garantie */}
      {(equipmentDetail.purchaseDate || equipmentDetail.warrantyEnd) && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
            Informations de garantie
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {equipmentDetail.purchaseDate && (
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Date d'achat
                </p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {new Date(equipmentDetail.purchaseDate).toLocaleDateString('fr-FR')}
                </p>
              </div>
            )}
            {equipmentDetail.warrantyEnd && (
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Fin de garantie
                </p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {new Date(equipmentDetail.warrantyEnd).toLocaleDateString('fr-FR')}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EquipmentDetailPage;