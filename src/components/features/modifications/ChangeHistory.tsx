import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { modificationsAPI } from '@services/api/modifications';
import { useAuthStore } from '@store/authStore';
import { Search, Filter, Calendar, User, FileText } from 'lucide-react';
import Loading from '@components/shared/Common/Loading';
import Badge from '@components/shared/Common/Badge';
import { ModificationStatus } from '@models/modifications';
import { formatDateTime, formatRelativeTime } from '@utils/formatters';

const ChangeHistory = () => {
  const { user } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ModificationStatus | 'ALL'>('ALL');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Récupérer l'historique
  const { data: history, isLoading } = useQuery({
    queryKey: ['modifications', 'history', user?.id],
    queryFn: () => modificationsAPI.getHistory(user?.id || ''),
    enabled: !!user?.id,
  });

  const modifications = history || [];

  // Filtrer
  const filteredModifications = modifications.filter(mod => {
    const matchSearch = 
      mod.justification.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mod.proposedByName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mod.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchStatus = statusFilter === 'ALL' || mod.status === statusFilter;

    return matchSearch && matchStatus;
  });

  if (isLoading) {
    return <Loading fullScreen text="Chargement de l'historique..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Historique des modifications
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Consultez l'historique complet de toutes les modifications
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Rechercher dans l'historique..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-gray-900 dark:text-white placeholder:text-gray-400"
        />
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2">
        <button
          onClick={() => setStatusFilter('ALL')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
            statusFilter === 'ALL'
              ? 'bg-primary text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
          }`}
        >
          <Filter className="w-4 h-4" />
          Tout
        </button>
        {Object.values(ModificationStatus).map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
              statusFilter === status
                ? 'bg-primary text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Timeline */}
      {filteredModifications.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600 dark:text-gray-400">
            Aucun historique trouvé
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Grouper par date */}
          {Object.entries(
            filteredModifications.reduce((groups, mod) => {
              const date = new Date(mod.createdAt).toLocaleDateString('fr-FR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              });
              if (!groups[date]) {
                groups[date] = [];
              }
              groups[date].push(mod);
              return groups;
            }, {} as Record<string, typeof modifications>)
          ).map(([date, mods]) => (
            <div key={date}>
              {/* Date Header */}
              <div className="flex items-center gap-3 mb-4">
                <Calendar className="w-5 h-5 text-gray-400" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {date}
                </h3>
              </div>

              {/* Timeline Items */}
              <div className="relative pl-8 space-y-4">
                {/* Timeline Line */}
                <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700" />

                {mods.map((modification, index) => {
                  const isExpanded = expandedId === modification.id;
                  const isLast = index === mods.length - 1;

                  return (
                    <div key={modification.id} className="relative">
                      {/* Timeline Dot */}
                      <div className={`absolute -left-[1.85rem] top-2 w-4 h-4 rounded-full border-4 ${
                        modification.status === ModificationStatus.APPROVED
                          ? 'bg-green-500 border-green-200 dark:border-green-800'
                          : modification.status === ModificationStatus.REJECTED
                          ? 'bg-red-500 border-red-200 dark:border-red-800'
                          : modification.status === ModificationStatus.PENDING
                          ? 'bg-yellow-500 border-yellow-200 dark:border-yellow-800'
                          : 'bg-gray-500 border-gray-200 dark:border-gray-700'
                      }`} />

                      {/* Card */}
                      <div
                        onClick={() => setExpandedId(isExpanded ? null : modification.id)}
                        className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 hover:border-primary hover:shadow-md transition-all cursor-pointer"
                      >
                        {/* Header */}
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold text-gray-900 dark:text-white">
                                {modification.type} - {modification.entity}
                              </h4>
                              <Badge 
                                variant="modification" 
                                modificationStatus={modification.status}
                              >
                                {modification.status}
                              </Badge>
                            </div>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                              ID: {modification.id}
                            </p>
                          </div>
                          <span className="text-xs text-gray-500 dark:text-gray-500">
                            {formatRelativeTime(modification.createdAt)}
                          </span>
                        </div>

                        {/* Info */}
                        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-2">
                          <div className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            <span>{modification.proposedByName}</span>
                          </div>
                          {modification.proposedByCompany && (
                            <span>({modification.proposedByCompany})</span>
                          )}
                        </div>

                        {/* Justification */}
                        <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                          {modification.justification}
                        </p>

                        {/* Expanded Details */}
                        {isExpanded && (
                          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
                            <div>
                              <h5 className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                Détails complets
                              </h5>
                              <div className="text-sm space-y-1">
                                <div className="flex justify-between">
                                  <span className="text-gray-600 dark:text-gray-400">Date:</span>
                                  <span className="text-gray-900 dark:text-white">
                                    {formatDateTime(modification.proposedAt)}
                                  </span>
                                </div>
                                {modification.validatedBy && (
                                  <>
                                    <div className="flex justify-between">
                                      <span className="text-gray-600 dark:text-gray-400">
                                        Validé par:
                                      </span>
                                      <span className="text-gray-900 dark:text-white">
                                        {modification.validatedByName}
                                      </span>
                                    </div>
                                    {modification.validatedAt && (
                                      <div className="flex justify-between">
                                        <span className="text-gray-600 dark:text-gray-400">
                                          Date validation:
                                        </span>
                                        <span className="text-gray-900 dark:text-white">
                                          {formatDateTime(modification.validatedAt)}
                                        </span>
                                      </div>
                                    )}
                                  </>
                                )}
                              </div>
                            </div>

                            {modification.validationComment && (
                              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
                                <h5 className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                                  Commentaire de validation:
                                </h5>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  {modification.validationComment}
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChangeHistory;