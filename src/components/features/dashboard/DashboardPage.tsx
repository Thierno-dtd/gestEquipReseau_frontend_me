import { useQuery } from '@tanstack/react-query';
import { infrastructureAPI } from '@services/api';
import { Building2, Server, Cable, Activity } from 'lucide-react';
import Loading from '@components/shared/Common/Loading';
import { useNavigate } from 'react-router-dom';
import {Site} from "@/models";

const DashboardPage = () => {
  const navigate = useNavigate();
  
  const { data, isLoading } = useQuery({
    queryKey: ['sites'],
    queryFn: () => infrastructureAPI.getSites(),
  });

  const sites: Site[] = data?.data.Site || [];

  // Calculer les statistiques
  const stats = {
    totalSites: sites.length,
    totalZones: sites.reduce((sum:any, site:any) => sum + site.zonesCount, 0),
    totalRacks: sites.reduce((sum:any, site:any) => sum + site.racksCount, 0),
    totalEquipments: sites.reduce((sum:any, site:any) => sum + site.equipmentsCount, 0),
  };

  if (isLoading) return <Loading fullScreen text="Chargement du tableau de bord..." />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Tableau de bord
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Vue d'ensemble de votre infrastructure réseau
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <Building2 className="w-6 h-6 text-blue-500" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
            {stats.totalSites}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Sites</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center">
              <Activity className="w-6 h-6 text-green-500" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
            {stats.totalZones}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Zones</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <Server className="w-6 h-6 text-purple-500" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
            {stats.totalRacks}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Baies</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-orange-500/10 flex items-center justify-center">
              <Cable className="w-6 h-6 text-orange-500" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
            {stats.totalEquipments}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Équipements</p>
        </div>
      </div>

      {/* Sites List */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Sites récents
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sites.slice(0, 6).map((site:any) => (
            <div
              key={site.id}
              onClick={() => navigate(`/sites/${site.id}`)}
              className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 hover:border-primary hover:shadow-md transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-primary" />
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
              <div className="grid grid-cols-3 gap-2 text-xs text-gray-600 dark:text-gray-400">
                <div className="text-center">
                  <p className="font-bold text-gray-900 dark:text-white">{site.zonesCount}</p>
                  <p>Zones</p>
                </div>
                <div className="text-center">
                  <p className="font-bold text-gray-900 dark:text-white">{site.racksCount}</p>
                  <p>Baies</p>
                </div>
                <div className="text-center">
                  <p className="font-bold text-gray-900 dark:text-white">{site.equipmentsCount}</p>
                  <p>Équip.</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;