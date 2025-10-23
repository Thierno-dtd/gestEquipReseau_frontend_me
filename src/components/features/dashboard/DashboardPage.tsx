import { useQuery } from '@tanstack/react-query';
import { infrastructureAPI } from '@services/api/infrastructure';
import { useNavigate } from 'react-router-dom';
import { Building2, Plus, Search } from 'lucide-react';
import Loading from '@components/shared/Common/Loading';
import Badge from '@components/shared/Common/Badge';
import { EquipmentStatus } from '@models/infrastructure';

const SiteListPage = () => {
  const navigate = useNavigate();
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['sites'],
    queryFn: () => infrastructureAPI.getSites(),
  });

  if (isLoading) return <Loading fullScreen text="Chargement des sites..." />;
  
  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">Erreur lors du chargement des sites</p>
      </div>
    );
  }

  const sites = data?.data || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Sites</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {sites.length} site(s) trouvé(s)
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
          <Plus className="w-5 h-5" />
          Nouveau site
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Rechercher un site..."
          className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Sites Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sites.map((site) => (
          <div
            key={site.id}
            onClick={() => navigate(`/sites/${site.id}`)}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {site.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {site.city}
                  </p>
                </div>
              </div>
              <Badge variant="status" status={site.status as EquipmentStatus}>
                {site.status}
              </Badge>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {site.zonesCount}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Zones</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {site.racksCount}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Baies</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {site.equipmentsCount}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Équipements</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SiteListPage;