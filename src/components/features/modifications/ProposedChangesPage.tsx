import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { modificationsAPI } from '@services/api';
import { Search, Filter, CheckCircle, XCircle, Clock, Eye } from 'lucide-react';
import Loading from '@components/shared/Common/Loading';
import Badge from '@components/shared/Common/Badge';
import { ModificationStatus } from '@models/modifications';
import { useNavigate } from 'react-router-dom';
import { formatRelativeTime } from '@utils/formatters';

const ProposedChangesPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ModificationStatus | 'ALL'>('ALL');

  // Récupérer toutes les modifications
  const { data: modificationsData, isLoading } = useQuery({
    queryKey: ['modifications', statusFilter],
    queryFn: () => modificationsAPI.getModifications(
      statusFilter !== 'ALL' ? { status: [statusFilter] } : undefined
    ),
  });

  const modifications = modificationsData?.data.Modification || [];

  // Filtrer par recherche
  const filteredModifications = modifications.filter(mod =>
    mod.justification.toLowerCase().includes(searchQuery.toLowerCase()) ||
    mod.proposedByName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    mod.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Compter par statut
  const statusCounts = {
    ALL: modifications.length,
    [ModificationStatus.PENDING]: modifications.filter(m => m.status === ModificationStatus.PENDING).length,
    [ModificationStatus.APPROVED]: modifications.filter(m => m.status === ModificationStatus.APPROVED).length,
    [ModificationStatus.REJECTED]: modifications.filter(m => m.status === ModificationStatus.REJECTED).length,
  };

  if (isLoading) {
    return <Loading fullScreen text="Chargement des modifications..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Modifications à valider
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Gérez les propositions de modifications de l'infrastructure
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Rechercher par ID, utilisateur ou justification..."
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
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          <Filter className="w-4 h-4" />
          Tout ({statusCounts.ALL})
        </button>
        <button
          onClick={() => setStatusFilter(ModificationStatus.PENDING)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
            statusFilter === ModificationStatus.PENDING
              ? 'bg-yellow-500 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          <Clock className="w-4 h-4" />
          En attente ({statusCounts[ModificationStatus.PENDING]})
        </button>
        <button
          onClick={() => setStatusFilter(ModificationStatus.APPROVED)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
            statusFilter === ModificationStatus.APPROVED
              ? 'bg-green-500 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          <CheckCircle className="w-4 h-4" />
          Approuvées ({statusCounts[ModificationStatus.APPROVED]})
        </button>
        <button
          onClick={() => setStatusFilter(ModificationStatus.REJECTED)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
            statusFilter === ModificationStatus.REJECTED
              ? 'bg-red-500 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          <XCircle className="w-4 h-4" />
          Rejetées ({statusCounts[ModificationStatus.REJECTED]})
        </button>
      </div>

      {/* Modifications List */}
      {filteredModifications.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <Clock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600 dark:text-gray-400">
            {searchQuery 
              ? 'Aucune modification trouvée'
              : 'Aucune modification en attente'
            }
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredModifications.map((modification) => (
            <div
              key={modification.id}
              className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 hover:border-primary hover:shadow-md transition-all"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {modification.type} - {modification.entity}
                    </h3>
                    <Badge 
                      variant="modification" 
                      modificationStatus={modification.status}
                    >
                      {modification.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    ID: {modification.id}
                  </p>
                </div>
              </div>

              {/* Info */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Proposé par:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {modification.proposedByName}
                    {modification.proposedByCompany && ` (${modification.proposedByCompany})`}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Date:</span>
                  <span className="text-gray-900 dark:text-white">
                    {formatRelativeTime(modification.proposedAt)}
                  </span>
                </div>
              </div>

              {/* Justification */}
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3 mb-4">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Justification:
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {modification.justification}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3">
                {modification.status === ModificationStatus.PENDING ? (
                  <>
                    <button
                      onClick={() => navigate(`/modifications/${modification.id}`)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 rounded-lg font-medium transition-colors"
                    >
                      <XCircle className="w-4 h-4" />
                      Rejeter
                    </button>
                    <button
                      onClick={() => navigate(`/modifications/${modification.id}`)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-500/10 hover:bg-green-500/20 text-green-600 dark:text-green-400 rounded-lg font-medium transition-colors"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Approuver
                    </button>
                    <button
                      onClick={() => navigate(`/modifications/${modification.id}`)}
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      Détails
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => navigate(`/modifications/${modification.id}`)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    Voir les détails
                  </button>
                )}
              </div>

              {/* Validation Info */}
              {modification.validatedBy && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <span>
                      {modification.status === ModificationStatus.APPROVED ? 'Approuvé' : 'Rejeté'} par:
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {modification.validatedByName}
                    </span>
                    {modification.validatedAt && (
                      <>
                        <span>•</span>
                        <span>{formatRelativeTime(modification.validatedAt)}</span>
                      </>
                    )}
                  </div>
                  {modification.validationComment && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                      Commentaire: {modification.validationComment}
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProposedChangesPage;