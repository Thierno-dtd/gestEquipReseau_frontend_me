import { NetworkType, EquipmentStatus } from '@models/infrastructure';
import { ModificationStatus } from '@models/modifications';
import { getStatusDotClass, getNetworkBadgeClass } from '@utils/colors';

interface BadgeProps {
  variant?: 'default' | 'it' | 'ot' | 'status' | 'modification';
  children: React.ReactNode;
  status?: EquipmentStatus;
  networkType?: NetworkType;
  modificationStatus?: ModificationStatus;
  className?: string;
}

const Badge = ({ 
  variant = 'default', 
  children, 
  status,
  networkType,
  modificationStatus,
  className = '' 
}: BadgeProps) => {
  let badgeClasses = 'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ';

  // Variant par défaut
  if (variant === 'default') {
    badgeClasses += 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300';
  }

  // Badge IT/OT
  if (variant === 'it' || variant === 'ot') {
    badgeClasses += networkType ? getNetworkBadgeClass(networkType) : '';
  }

  // Badge de statut
  if (variant === 'status' && status) {
    const statusColors = {
      ONLINE: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
      OFFLINE: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
      WARNING: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
      MAINTENANCE: 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300',
      ERROR: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
    };
    badgeClasses += statusColors[status];
  }

  // Badge de modification
  if (variant === 'modification' && modificationStatus) {
    const modColors = {
      PROPOSED: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
      PENDING: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
      APPROVED: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
      REJECTED: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
      APPLIED: 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300',
      CANCELLED: 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300',
    };
    badgeClasses += modColors[modificationStatus];
  }

  return (
    <span className={`${badgeClasses} ${className}`}>
      {(variant === 'status' && status) && (
        <span className={`w-2 h-2 rounded-full ${getStatusDotClass(status)}`} />
      )}
      {children}
    </span>
  );
};

export default Badge;