import React, { useState } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertCircle, 
  MessageSquare,
  User,
  Calendar
} from 'lucide-react';

interface ValidationWorkflowProps {
  modification: ModificationProposal;
  onApprove?: (comment?: string) => Promise<void>;
  onReject?: (reason: string) => Promise<void>;
  onCancel?: () => void;
  userRole: 'proposer' | 'validator' | 'viewer';
}

export interface ModificationProposal {
  id: string;
  type: 'equipment_add' | 'equipment_remove' | 'connection_add' | 'connection_remove' | 'equipment_edit';
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  proposedBy: {
    id: string;
    name: string;
    email: string;
  };
  proposedAt: Date;
  reviewedBy?: {
    id: string;
    name: string;
    email: string;
  };
  reviewedAt?: Date;
  data: any;
  comment?: string;
  rejectionReason?: string;
}

const statusConfig = {
  pending: {
    label: 'En attente',
    icon: Clock,
    color: 'yellow',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    textColor: 'text-yellow-700',
    iconColor: 'text-yellow-500',
  },
  approved: {
    label: 'Approuvée',
    icon: CheckCircle,
    color: 'green',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    textColor: 'text-green-700',
    iconColor: 'text-green-500',
  },
  rejected: {
    label: 'Rejetée',
    icon: XCircle,
    color: 'red',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    textColor: 'text-red-700',
    iconColor: 'text-red-500',
  },
  cancelled: {
    label: 'Annulée',
    icon: AlertCircle,
    color: 'gray',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-200',
    textColor: 'text-gray-700',
    iconColor: 'text-gray-500',
  },
};

const modificationTypeLabels = {
  equipment_add: 'Ajout d\'équipement',
  equipment_remove: 'Suppression d\'équipement',
  equipment_edit: 'Modification d\'équipement',
  connection_add: 'Ajout de connexion',
  connection_remove: 'Suppression de connexion',
};

const ValidationWorkflow: React.FC<ValidationWorkflowProps> = ({
  modification,
  onApprove,
  onReject,
  onCancel,
  userRole,
}) => {
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [approvalComment, setApprovalComment] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const config = statusConfig[modification.status];
  const StatusIcon = config.icon;

  const handleApprove = async () => {
    if (!onApprove) return;
    
    setIsSubmitting(true);
    try {
      await onApprove(approvalComment || undefined);
      setShowApproveDialog(false);
    } catch (error) {
      console.error('Error approving modification:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (!onReject || !rejectionReason.trim()) return;
    
    setIsSubmitting(true);
    try {
      await onReject(rejectionReason);
      setShowRejectDialog(false);
    } catch (error) {
      console.error('Error rejecting modification:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  };

  return (
    <div className="space-y-4">
      {/* Statut actuel */}
      <div className={`${config.bgColor} ${config.borderColor} border-2 rounded-lg p-4`}>
        <div className="flex items-center gap-3 mb-3">
          <StatusIcon className={`w-6 h-6 ${config.iconColor}`} />
          <div>
            <h3 className={`font-semibold ${config.textColor}`}>
              Statut : {config.label}
            </h3>
            <p className="text-sm text-gray-600">
              {modificationTypeLabels[modification.type]}
            </p>
          </div>
        </div>

        {/* Timeline */}
        <div className="space-y-3 mt-4">
          {/* Proposition */}
          <div className="flex gap-3">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-blue-600" />
              </div>
              {(modification.status === 'approved' || modification.status === 'rejected') && (
                <div className="w-0.5 h-full bg-gray-300 my-1" />
              )}
            </div>
            <div className="flex-1 pb-3">
              <div className="text-sm font-medium text-gray-900">
                Proposée par {modification.proposedBy.name}
              </div>
              <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                <Calendar className="w-3 h-3" />
                {formatDate(modification.proposedAt)}
              </div>
              {modification.comment && (
                <div className="mt-2 text-sm text-gray-600 bg-white rounded p-2 border border-gray-200">
                  <MessageSquare className="w-3 h-3 inline mr-1" />
                  {modification.comment}
                </div>
              )}
            </div>
          </div>

          {/* Validation/Rejet */}
          {(modification.status === 'approved' || modification.status === 'rejected') && 
           modification.reviewedBy && (
            <div className="flex gap-3">
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 ${config.bgColor} rounded-full flex items-center justify-center`}>
                  <StatusIcon className={`w-4 h-4 ${config.iconColor}`} />
                </div>
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900">
                  {modification.status === 'approved' ? 'Approuvée' : 'Rejetée'} par{' '}
                  {modification.reviewedBy.name}
                </div>
                <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                  <Calendar className="w-3 h-3" />
                  {modification.reviewedAt && formatDate(modification.reviewedAt)}
                </div>
                {modification.rejectionReason && (
                  <div className="mt-2 text-sm text-red-600 bg-red-50 rounded p-2 border border-red-200">
                    <AlertCircle className="w-3 h-3 inline mr-1" />
                    {modification.rejectionReason}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Actions de validation */}
      {userRole === 'validator' && modification.status === 'pending' && (
        <div className="flex gap-3">
          <button
            onClick={() => setShowRejectDialog(true)}
            className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
          >
            <XCircle className="w-5 h-5" />
            Rejeter
          </button>
          <button
            onClick={() => setShowApproveDialog(true)}
            className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
          >
            <CheckCircle className="w-5 h-5" />
            Approuver
          </button>
        </div>
      )}

      {/* Dialog d'approbation */}
      {showApproveDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Approuver la modification
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Vous êtes sur le point d'approuver cette modification. Cette action est
              irréversible.
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Commentaire (optionnel)
              </label>
              <textarea
                value={approvalComment}
                onChange={(e) => setApprovalComment(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Ajouter un commentaire..."
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowApproveDialog(false)}
                disabled={isSubmitting}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Annuler
              </button>
              <button
                onClick={handleApprove}
                disabled={isSubmitting}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'Approbation...' : 'Confirmer'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dialog de rejet */}
      {showRejectDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Rejeter la modification
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Veuillez indiquer la raison du rejet de cette modification.
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Raison du rejet *
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Expliquez pourquoi cette modification est rejetée..."
              />
              {!rejectionReason.trim() && (
                <p className="mt-1 text-xs text-red-600">
                  La raison du rejet est obligatoire
                </p>
              )}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowRejectDialog(false)}
                disabled={isSubmitting}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Annuler
              </button>
              <button
                onClick={handleReject}
                disabled={isSubmitting || !rejectionReason.trim()}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'Rejet...' : 'Confirmer le rejet'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ValidationWorkflow;