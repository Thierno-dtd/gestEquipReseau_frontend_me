import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { modificationsAPI } from '@services/api';
import { useModifications } from '@hooks/useModifications';
import { 
  X, 
  CheckCircle, 
  XCircle, 
  User, 
  Calendar,
  FileText,
  AlertTriangle
} from 'lucide-react';
import Loading from '@components/shared/Common/Loading';
import Badge from '@components/shared/Common/Badge';
import { ModificationStatus } from '@models/modifications';
import { formatDateTime } from '@utils/formatters';
import { toast } from 'sonner';

const ChangeDetailModal = () => {
  const { modificationId } = useParams<{ modificationId: string }>();
  const navigate = useNavigate();
  const [validationComment, setValidationComment] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const { approveModification, rejectModification, isApproving, isRejecting } = useModifications();

  // Récupérer les détails de la modification
  const { data: modification, isLoading } = useQuery({
    queryKey: ['modification', modificationId],
    queryFn: () => modificationsAPI.getModificationById(modificationId!),
    enabled: !!modificationId,
  });

  const handleApprove = () => {
    if (!modification) return;

    approveModification(
      { id: modification.id, comment: validationComment },
      {
        onSuccess: () => {
          navigate('/modifications');
        },
      }
    );
  };

  const handleReject = () => {
    if (!modification) return;

    if (!rejectReason.trim()) {
      toast.error('Veuillez fournir une raison pour le rejet');
      return;
    }

    rejectModification(
      { id: modification.id, reason: rejectReason },
      {
        onSuccess: () => {
          navigate('/modifications');
        },
      }
    );
  };

  if (isLoading) {
    return <Loading fullScreen text="Chargement..." />;
  }

  if (!modification) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600 dark:text-gray-400">Modification non trouvée</p>
      </div>
    );
  }

  const isPending = modification.status === ModificationStatus.PENDING;

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Détails de la modification
                </h2>
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
            <button
              onClick={() => navigate('/modifications')}
              className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Type de modification */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Type de modification
              </h3>
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                  {modification.type}
                </span>
                <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm font-medium">
                  {modification.entity}
                </span>
              </div>
            </div>

            {/* Proposé par */}
            <div className="flex items-start gap-3">
              <User className="w-5 h-5 text-gray-400 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Proposé par
                </p>
                <p className="text-gray-900 dark:text-white">
                  {modification.proposedByName}
                  {modification.proposedByCompany && (
                    <span className="text-gray-600 dark:text-gray-400">
                      {' '}({modification.proposedByCompany})
                    </span>
                  )}
                </p>
              </div>
            </div>

            {/* Date */}
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Date de proposition
                </p>
                <p className="text-gray-900 dark:text-white">
                  {formatDateTime(modification.proposedAt)}
                </p>
              </div>
            </div>

            {/* Justification */}
            <div className="flex items-start gap-3">
              <FileText className="w-5 h-5 text-gray-400 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Justification
                </p>
                <p className="text-gray-900 dark:text-white">
                  {modification.justification}
                </p>
              </div>
            </div>

            {/* Données */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Données de la modification
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Anciennes données */}
                {modification.oldData && (
                  <div className="bg-red-50 dark:bg-red-900/10 rounded-lg p-4 border border-red-200 dark:border-red-800">
                    <h4 className="text-sm font-semibold text-red-900 dark:text-red-400 mb-2">
                      Anciennes valeurs
                    </h4>
                    <pre className="text-xs text-red-800 dark:text-red-300 overflow-auto">
                      {JSON.stringify(modification.oldData, null, 2)}
                    </pre>
                  </div>
                )}

                {/* Nouvelles données */}
                <div className="bg-green-50 dark:bg-green-900/10 rounded-lg p-4 border border-green-200 dark:border-green-800">
                  <h4 className="text-sm font-semibold text-green-900 dark:text-green-400 mb-2">
                    Nouvelles valeurs
                  </h4>
                  <pre className="text-xs text-green-800 dark:text-green-300 overflow-auto">
                    {JSON.stringify(modification.newData, null, 2)}
                  </pre>
                </div>
              </div>
            </div>

            {/* Validation info si déjà validée */}
            {modification.validatedBy && (
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Informations de validation
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Validé par:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {modification.validatedByName}
                    </span>
                  </div>
                  {modification.validatedAt && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Date:</span>
                      <span className="text-gray-900 dark:text-white">
                        {formatDateTime(modification.validatedAt)}
                      </span>
                    </div>
                  )}
                  {modification.validationComment && (
                    <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                      <p className="text-gray-600 dark:text-gray-400 mb-1">Commentaire:</p>
                      <p className="text-gray-900 dark:text-white">
                        {modification.validationComment}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Actions si en attente */}
            {isPending && (
              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                {!showRejectForm ? (
                  <div className="space-y-4">
                    {/* Commentaire optionnel */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Commentaire (optionnel)
                      </label>
                      <textarea
                        value={validationComment}
                        onChange={(e) => setValidationComment(e.target.value)}
                        placeholder="Ajouter un commentaire..."
                        rows={3}
                        className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-gray-900 dark:text-white placeholder:text-gray-400"
                      />
                    </div>

                    {/* Boutons d'action */}
                    <div className="flex gap-3">
                      <button
                        onClick={() => setShowRejectForm(true)}
                        disabled={isRejecting}
                        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <XCircle className="w-5 h-5" />
                        Rejeter
                      </button>
                      <button
                        onClick={handleApprove}
                        disabled={isApproving}
                        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isApproving ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Approbation...
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-5 h-5" />
                            Approuver
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400">
                      <AlertTriangle className="w-5 h-5" />
                      <h4 className="font-semibold">Confirmer le rejet</h4>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Raison du rejet *
                      </label>
                      <textarea
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        placeholder="Expliquez pourquoi cette modification est rejetée..."
                        rows={4}
                        className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-gray-900 dark:text-white placeholder:text-gray-400"
                      />
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => setShowRejectForm(false)}
                        className="flex-1 px-6 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg font-medium transition-colors"
                      >
                        Annuler
                      </button>
                      <button
                        onClick={handleReject}
                        disabled={isRejecting || !rejectReason.trim()}
                        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isRejecting ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Rejet...
                          </>
                        ) : (
                          <>
                            <XCircle className="w-5 h-5" />
                            Confirmer le rejet
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangeDetailModal;