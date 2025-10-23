import { Clock, CheckCircle, XCircle, FileText } from 'lucide-react';
import { ModificationProposal } from '@models/modifications';
import { formatDateTime } from '@utils/formatters';

interface ChangeTimelineProps {
  modification: ModificationProposal;
}

const ChangeTimeline = ({ modification }: ChangeTimelineProps) => {
  const events = [
    {
      id: 1,
      type: 'created',
      title: 'Modification proposée',
      description: `Par ${modification.proposedByName}${
        modification.proposedByCompany ? ` (${modification.proposedByCompany})` : ''
      }`,
      date: modification.proposedAt,
      icon: FileText,
      iconColor: 'text-blue-500',
      iconBg: 'bg-blue-500/10',
    },
  ];

  // Ajouter événement de validation si applicable
  if (modification.validatedBy) {
    const isApproved = modification.status === 'APPROVED';
    events.push({
      id: 2,
      type: isApproved ? 'approved' : 'rejected',
      title: isApproved ? 'Modification approuvée' : 'Modification rejetée',
      description: `Par ${modification.validatedByName}`,
      date: modification.validatedAt || new Date().toISOString(),
      icon: isApproved ? CheckCircle : XCircle,
      iconColor: isApproved ? 'text-green-500' : 'text-red-500',
      iconBg: isApproved ? 'bg-green-500/10' : 'bg-red-500/10',
    });
  }

  // Ajouter événement d'application si statut = APPLIED
  if (modification.status === 'APPLIED') {
    events.push({
      id: 3,
      type: 'applied',
      title: 'Modification appliquée',
      description: 'Les changements ont été appliqués à l\'infrastructure',
      date: modification.updatedAt,
      icon: CheckCircle,
      iconColor: 'text-green-500',
      iconBg: 'bg-green-500/10',
    });
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <Clock className="w-5 h-5" />
        Chronologie
      </h3>

      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700" />

        {/* Events */}
        <div className="space-y-6">
          {events.map((event, index) => {
            const Icon = event.icon;
            const isLast = index === events.length - 1;

            return (
              <div key={event.id} className="relative flex gap-4">
                {/* Icon */}
                <div className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-full ${event.iconBg}`}>
                  <Icon className={`w-6 h-6 ${event.iconColor}`} />
                </div>

                {/* Content */}
                <div className="flex-1 pt-1">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                    {event.title}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {event.description}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-500">
                    <Clock className="w-3 h-3" />
                    <span>{formatDateTime(event.date)}</span>
                  </div>

                  {/* Comment si présent */}
                  {event.type !== 'created' && modification.validationComment && (
                    <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        <span className="font-medium">Commentaire:</span>{' '}
                        {modification.validationComment}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Status actuel si en attente */}
        {modification.status === 'PENDING' && (
          <div className="relative flex gap-4 mt-6 opacity-50">
            <div className="relative z-10 flex items-center justify-center w-12 h-12 rounded-full bg-yellow-500/10 border-2 border-dashed border-yellow-500">
              <Clock className="w-6 h-6 text-yellow-500" />
            </div>
            <div className="flex-1 pt-1">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                En attente de validation
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Cette modification attend d'être approuvée ou rejetée
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChangeTimeline;