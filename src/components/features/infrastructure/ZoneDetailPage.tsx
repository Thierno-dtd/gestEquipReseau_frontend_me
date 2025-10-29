import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { infrastructureAPI } from '@services/api';
import { ArrowLeft, Plus, Search, Grid3X3, List, MapPin } from 'lucide-react';
import Loading from '@components/shared/Common/Loading';
import Badge from '@components/shared/Common/Badge';
import { EquipmentStatus } from '@models/infrastructure';
import { useState } from 'react';

const ZoneDetailPage = () => {
  const { zoneId } = useParams<{ zoneId: string }>();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid');
  const [searchQuery, setSearchQuery] = useState('');

  // Récupérer les détails de la zone
  const { data: zone, isLoading: zoneLoading } = useQuery({
    queryKey: ['zone', zoneId],
    queryFn: () => infrastructureAPI.getZoneById(zoneId!),
    enabled: !!zoneId,
  });

  // Récupérer les racks de la zone
  const { data: racksData, isLoading: racksLoading } = useQuery({
    queryKey: ['racks', zoneId],
    queryFn: () => infrastructureAPI.getRacks(zoneId),
    enabled: !!zoneId,
  });

  const isLoading = zoneLoading || racksLoading;
  const racks = racksData?.data.Rack || [];

  // Filtrer les racks selon la recherche
  const filteredRacks = racks.filter(rack =>
    rack.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    rack.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return <Loading fullScreen text="Chargement de la zone..." />;
  }

  if (!zone) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <p className="text-gray-600 dark:text-gray-400">Zone non trouvée</p>
      </div>
    );
  }

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
              {zone.name}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <MapPin className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {zone.building ? `${zone.building} - ` : ''}
                {zone.floor ? `Étage ${zone.floor}` : 'Rez-de-chaussée'}
              </span>
            </div>
          </div>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
          <Plus className="w-5 h-5" />
          Nouvelle baie
        </button>
      </div>

      {/* Info Card */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Type</p>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            {zone.type}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Baies</p>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            {zone.racksCount}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Équipements</p>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            {zone.equipmentsCount}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Statut</p>
          <Badge variant="status" status={zone.status as EquipmentStatus}>
            {zone.status}
          </Badge>
        </div>
      </div>

      {/* Description */}
      {zone.description && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
            Description
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {zone.description}
          </p>
        </div>
      )}

      {/* Search + View Toggle */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher une baie..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-gray-900 dark:text-white placeholder:text-gray-400"
          />
        </div>

        <div className="flex items-center gap-2 bg-white dark:bg-gray-800 rounded-lg p-1 border border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded ${
              viewMode === 'grid'
                ? 'bg-primary text-white'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
            } transition-colors`}
          >
            <Grid3X3 className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded ${
              viewMode === 'list'
                ? 'bg-primary text-white'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
            } transition-colors`}
          >
            <List className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Racks Grid/List */}
      {filteredRacks.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <p className="text-gray-600 dark:text-gray-400">Aucune baie trouvée</p>
        </div>
      ) : (
        <div className={
          viewMode === 'grid'
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
            : 'space-y-3'
        }>
          {filteredRacks.map((rack) => (
            <div
              key={rack.id}
              onClick={() => navigate(`/racks/${rack.id}`)}
              className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 hover:border-primary hover:shadow-md transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    {rack.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {rack.code}
                  </p>
                </div>
                <Badge variant="status" status={rack.status as EquipmentStatus}>
                  {rack.status}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Hauteur</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {rack.usedHeight}/{rack.height}U
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Équipements</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {rack.equipmentsCount}
                  </p>
                </div>
                {rack.powerUsage && rack.powerCapacity && (
                  <>
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">Puissance</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {rack.powerUsage.toFixed(1)}/{rack.powerCapacity} kW
                      </p>
                    </div>
                  </>
                )}
                {rack.temperature && (
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Température</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {rack.temperature}°C
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ZoneDetailPage;