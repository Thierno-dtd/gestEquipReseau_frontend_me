import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { infrastructureAPI } from '@services/api';
import { ArrowLeft, Plus, QrCode, Thermometer, Zap, Package } from 'lucide-react';
import Loading from '@components/shared/Common/Loading';
import Badge from '@components/shared/Common/Badge';
import { EquipmentStatus, NetworkType } from '@models/infrastructure';

const RackDetailPage = () => {
  const { rackId } = useParams<{ rackId: string }>();
  const navigate = useNavigate();

  // Récupérer les détails de la baie avec équipements
  const { data: rackDetail, isLoading } = useQuery({
    queryKey: ['rack', rackId],
    queryFn: () => infrastructureAPI.getRackById(rackId!),
    enabled: !!rackId,
  });

  if (isLoading) {
    return <Loading fullScreen text="Chargement de la baie..." />;
  }

  if (!rackDetail) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <p className="text-gray-600 dark:text-gray-400">Baie non trouvée</p>
      </div>
    );
  }

  const { zone, equipments } = rackDetail.data;
  const usagePercent = (rackDetail.usedHeight / rackDetail.height) * 100;

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
              {rackDetail.name}
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {zone.name} • Code: {rackDetail.code}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white rounded-lg transition-colors">
            <QrCode className="w-5 h-5" />
            QR Code
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
            <Plus className="w-5 h-5" />
            Ajouter équipement
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Occupation */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <Package className="w-4 h-4 text-primary" />
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Occupation
            </p>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {rackDetail.usedHeight}/{rackDetail.height}U
          </p>
          <div className="mt-2 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all ${
                usagePercent > 80
                  ? 'bg-red-500'
                  : usagePercent > 60
                  ? 'bg-yellow-500'
                  : 'bg-green-500'
              }`}
              style={{ width: `${usagePercent}%` }}
            />
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
            {usagePercent.toFixed(0)}% utilisé
          </p>
        </div>

        {/* Équipements */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
            Équipements
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {rackDetail.equipmentsCount}
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
            {equipments.filter(e => e.networkType === NetworkType.IT).length} IT •{' '}
            {equipments.filter(e => e.networkType === NetworkType.OT).length} OT
          </p>
        </div>

        {/* Puissance */}
        {rackDetail.powerCapacity && (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-yellow-500" />
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Puissance
              </p>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {rackDetail.powerUsage?.toFixed(1) || 0} kW
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              Capacité: {rackDetail.powerCapacity} kW
            </p>
          </div>
        )}

        {/* Température */}
        {rackDetail.temperature && (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-2">
              <Thermometer className="w-4 h-4 text-red-500" />
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Température
              </p>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {rackDetail.temperature}°C
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              {rackDetail.temperature > 25 ? 'Élevée' : 'Normale'}
            </p>
          </div>
        )}
      </div>

      {/* Position */}
      {(rackDetail.row || rackDetail.position) && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
            Position
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {rackDetail.row && `Rangée: ${rackDetail.row}`}
            {rackDetail.row && rackDetail.position && ' • '}
            {rackDetail.position && `Position: ${rackDetail.position}`}
          </p>
        </div>
      )}

      {/* Équipements List */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
          Équipements ({equipments.length})
        </h2>

        {equipments.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 dark:text-gray-400">Aucun équipement</p>
          </div>
        ) : (
          <div className="space-y-3">
            {equipments
              .sort((a, b) => b.position - a.position) // Trier du haut vers le bas
              .map((equipment) => (
                <div
                  key={equipment.id}
                  onClick={() => navigate(`/equipments/${equipment.id}`)}
                  className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 hover:border-primary hover:shadow-md transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      {/* Position U */}
                      <div className="flex flex-col items-center justify-center w-12 h-12 bg-gray-100 dark:bg-gray-900 rounded-lg">
                        <span className="text-xs text-gray-600 dark:text-gray-400">U</span>
                        <span className="text-lg font-bold text-gray-900 dark:text-white">
                          {equipment.position}
                        </span>
                      </div>

                      {/* Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {equipment.name}
                          </h3>
                          <Badge
                            variant={equipment.networkType === NetworkType.IT ? 'it' : 'ot'}
                            networkType={equipment.networkType}
                          >
                            {equipment.networkType}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                          <span>{equipment.type}</span>
                          {equipment.manufacturer && (
                            <>
                              <span>•</span>
                              <span>{equipment.manufacturer}</span>
                            </>
                          )}
                          {equipment.model && (
                            <>
                              <span>•</span>
                              <span>{equipment.model}</span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Status */}
                      <Badge variant="status" status={equipment.status as EquipmentStatus}>
                        {equipment.status}
                      </Badge>
                    </div>
                  </div>

                  {/* Additional Info */}
                  <div className="grid grid-cols-3 gap-4 mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Hauteur</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {equipment.height}U
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Ports</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {equipment.portsCount}
                      </p>
                    </div>
                    {equipment.ipAddress && (
                      <div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">IP</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white font-mono">
                          {equipment.ipAddress}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RackDetailPage;