import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { infrastructureAPI } from '@services/api';
import { 
  Building2, 
  Plus, 
  Edit, 
  Trash2, 
  ChevronRight,
  MapPin,
  Layers,
  Server,
  FolderTree
} from 'lucide-react';
import Loading from '@components/shared/Common/Loading';
import Badge from '@components/shared/Common/Badge';
import { EquipmentStatus } from '@models/infrastructure';

const HierarchyManagerPage = () => {
  const [expandedSites, setExpandedSites] = useState<Set<string>>(new Set());

  const { data: sitesData, isLoading } = useQuery({
    queryKey: ['sites'],
    queryFn: () => infrastructureAPI.getSites(),
  });

  const sites = sitesData?.data || [];

  const toggleSite = (siteId: string) => {
    const newExpanded = new Set(expandedSites);
    if (newExpanded.has(siteId)) {
      newExpanded.delete(siteId);
    } else {
      newExpanded.add(siteId);
    }
    setExpandedSites(newExpanded);
  };

  if (isLoading) {
    return <Loading fullScreen text="Chargement de la hiérarchie..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Gestion de la hiérarchie
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Organisez votre infrastructure réseau
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
          <Plus className="w-5 h-5" />
          Nouveau site
        </button>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-2">
            <Building2 className="w-5 h-5 text-primary" />
            <p className="text-sm text-gray-600 dark:text-gray-400">Sites</p>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {sites.length}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-2">
            <Layers className="w-5 h-5 text-blue-500" />
            <p className="text-sm text-gray-600 dark:text-gray-400">Zones</p>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {sites.reduce((acc, site) => acc + site.zonesCount, 0)}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-2">
            <Server className="w-5 h-5 text-green-500" />
            <p className="text-sm text-gray-600 dark:text-gray-400">Baies</p>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {sites.reduce((acc, site) => acc + site.racksCount, 0)}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-2">
            <FolderTree className="w-5 h-5 text-orange-500" />
            <p className="text-sm text-gray-600 dark:text-gray-400">Équipements</p>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {sites.reduce((acc, site) => acc + site.equipmentsCount, 0)}
          </p>
        </div>
      </div>

      {/* Hierarchy Tree */}
      <div className="space-y-3">
        {sites.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
            <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 dark:text-gray-400">Aucun site configuré</p>
          </div>
        ) : (
          sites.map((site) => (
            <div
              key={site.id}
              className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700"
            >
              {/* Site Header */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3 flex-1">
                    <button
                      onClick={() => toggleSite(site.id)}
                      className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                    >
                      <ChevronRight 
                        className={`w-5 h-5 transition-transform ${
                          expandedSites.has(site.id) ? 'rotate-90' : ''
                        }`}
                      />
                    </button>
                    
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-primary" />
                    </div>

                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {site.name}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <MapPin className="w-4 h-4" />
                        <span>{site.city}, {site.country}</span>
                      </div>
                    </div>

                    <Badge variant="status" status={site.status as EquipmentStatus}>
                      {site.status}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                      <Edit className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    </button>
                    <button className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                    </button>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 pl-12">
                  <div className="text-center py-2 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <p className="text-xl font-bold text-gray-900 dark:text-white">
                      {site.zonesCount}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Zones</p>
                  </div>
                  <div className="text-center py-2 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <p className="text-xl font-bold text-gray-900 dark:text-white">
                      {site.racksCount}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Baies</p>
                  </div>
                  <div className="text-center py-2 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <p className="text-xl font-bold text-gray-900 dark:text-white">
                      {site.equipmentsCount}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Équipements</p>
                  </div>
                </div>
              </div>

              {/* Expanded Content */}
              {expandedSites.has(site.id) && (
                <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-900">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      Zones du site
                    </h4>
                    <button className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm rounded-lg transition-colors border border-gray-200 dark:border-gray-700">
                      <Plus className="w-4 h-4" />
                      Ajouter une zone
                    </button>
                  </div>

                  <div className="space-y-2">
                    {/* Mock zones - à remplacer par vraies données */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Layers className="w-5 h-5 text-blue-500" />
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            Zone Production
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            10 baies • 45 équipements
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors">
                          <Edit className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        </button>
                        <button className="p-1.5 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition-colors">
                          <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                        </button>
                      </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-lg p-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Layers className="w-5 h-5 text-blue-500" />
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            Data Center
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            25 baies • 120 équipements
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors">
                          <Edit className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        </button>
                        <button className="p-1.5 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition-colors">
                          <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default HierarchyManagerPage;