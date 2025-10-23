import { useQuery } from '@tanstack/react-query';
import { modificationsAPI } from '@services/api/modifications';
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  TrendingUp,
  Users,
  AlertCircle
} from 'lucide-react';
import Loading from '@components/shared/Common/Loading';
import { useNavigate } from 'react-router-dom';

const ValidationDashboard = () => {
  const navigate = useNavigate();

  // Récupérer les statistiques
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['modifications', 'stats'],
    queryFn: () => modificationsAPI.getStats(),
  });

  // Récupérer les modifications en attente
  const { data: pendingData, isLoading: pendingLoading } = useQuery({
    queryKey: ['modifications', 'pending'],
    queryFn: () => modificationsAPI.getPendingModifications(),
  });

  const isLoading = statsLoading || pendingLoading;
  const pendingModifications = pendingData?.data || [];

  if (isLoading) {
    return <Loading fullScreen text="Chargement du tableau de bord..." />;
  }

  const approvalRate = stats 
    ? ((stats.approved / (stats.total || 1)) * 100).toFixed(1)
    : '0';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Tableau de bord des validations
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Vue d'ensemble des modifications et validations
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-blue-500" />
            </div>
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
              Total
            </span>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
            {stats?.total || 0}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Modifications
          </p>
        </div>

        {/* En attente */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 rounded-lg bg-yellow-500/10 flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-500" />
            </div>
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
              En attente
            </span>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
            {stats?.pending || 0}
          </p>
          <button
            onClick={() => navigate('/modifications')}
            className="text-sm text-primary hover:underline"
          >
            Voir les demandes
          </button>
        </div>

        {/* Approuvées */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-500" />
            </div>
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
              Approuvées
            </span>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
            {stats?.approved || 0}
          </p>
          <p className="text-sm text-green-600 dark:text-green-400">
            Taux: {approvalRate}%
          </p>
        </div>

        {/* Rejetées */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 rounded-lg bg-red-500/10 flex items-center justify-center">
              <XCircle className="w-6 h-6 text-red-500" />
            </div>
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
              Rejetées
            </span>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
            {stats?.rejected || 0}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {stats?.total ? ((stats.rejected / stats.total) * 100).toFixed(1) : '0'}%
          </p>
        </div>
      </div>

      {/* Stats par type et entité */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Par type */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Par type de modification
          </h3>
          {stats?.byType && Object.keys(stats.byType).length > 0 ? (
            <div className="space-y-3">
              {Object.entries(stats.byType).map(([type, count]) => (
                <div key={type} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {type}
                  </span>
                  <div className="flex items-center gap-3">
                    <div className="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all"
                        style={{
                          width: `${((count as number) / (stats.total || 1)) * 100}%`
                        }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white min-w-[2rem] text-right">
                      {count as number}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center py-4">
              Aucune donnée disponible
            </p>
          )}
        </div>

        {/* Par entité */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Par entité
          </h3>
          {stats?.byEntity && Object.keys(stats.byEntity).length > 0 ? (
            <div className="space-y-3">
              {Object.entries(stats.byEntity).map(([entity, count]) => (
                <div key={entity} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {entity}
                  </span>
                  <div className="flex items-center gap-3">
                    <div className="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500 rounded-full transition-all"
                        style={{
                          width: `${((count as number) / (stats.total || 1)) * 100}%`
                        }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white min-w-[2rem] text-right">
                      {count as number}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center py-4">
              Aucune donnée disponible
            </p>
          )}
        </div>
      </div>

      {/* Par utilisateur */}
      {stats?.byUser && Object.keys(stats.byUser).length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Modifications par utilisateur
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {Object.entries(stats.byUser)
              .sort((a, b) => (b[1] as number) - (a[1] as number))
              .slice(0, 6)
              .map(([userId, count]) => (
                <div
                  key={userId}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg"
                >
                  <span className="text-sm text-gray-700 dark:text-gray-300 truncate">
                    {userId}
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {count as number}
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Modifications récentes en attente */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Modifications en attente
          </h3>
          {pendingModifications.length > 0 && (
            <button
              onClick={() => navigate('/modifications')}
              className="text-sm text-primary hover:underline font-medium"
            >
              Voir tout ({pendingModifications.length})
            </button>
          )}
        </div>

        {pendingModifications.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700 text-center">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
            <p className="text-gray-600 dark:text-gray-400">
              Aucune modification en attente
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
              Toutes les demandes ont été traitées
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {pendingModifications.slice(0, 5).map((modification) => (
              <div
                key={modification.id}
                onClick={() => navigate(`/modifications/${modification.id}`)}
                className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 hover:border-primary hover:shadow-md transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-yellow-500" />
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {modification.type} - {modification.entity}
                    </h4>
                  </div>
                  <span className="text-xs px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 rounded-full">
                    En attente
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <span>{modification.proposedByName}</span>
                  <span>•</span>
                  <span>
                    {new Date(modification.proposedAt).toLocaleDateString('fr-FR')}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-1">
                  {modification.justification}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Alertes */}
      {stats && stats.pending > 5 && (
        <div className="bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
            <div>
              <h4 className="font-semibold text-yellow-900 dark:text-yellow-400 mb-1">
                Attention : Modifications en attente
              </h4>
              <p className="text-sm text-yellow-800 dark:text-yellow-500">
                Il y a actuellement {stats.pending} modifications en attente de validation.
                Pensez à les traiter pour éviter les retards dans les opérations.
              </p>
              <button
                onClick={() => navigate('/modifications')}
                className="mt-3 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Traiter maintenant
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ValidationDashboard;