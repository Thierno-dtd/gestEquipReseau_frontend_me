import { User, UserRole, Permission, ROLE_PERMISSIONS } from '@models/auth';

// Vérifier si un utilisateur a une permission
export const hasPermission = (user: User | null, permission: Permission): boolean => {
  if (!user) return false;
  return user.permissions.includes(permission);
};

// Vérifier si un utilisateur a au moins une des permissions
export const hasAnyPermission = (user: User | null, permissions: Permission[]): boolean => {
  if (!user) return false;
  return permissions.some(p => user.permissions.includes(p));
};

// Vérifier si un utilisateur a toutes les permissions
export const hasAllPermissions = (user: User | null, permissions: Permission[]): boolean => {
  if (!user) return false;
  return permissions.every(p => user.permissions.includes(p));
};

// Vérifier le rôle
export const hasRole = (user: User | null, role: UserRole): boolean => {
  if (!user) return false;
  return user.role === role;
};

// Vérifier si admin
export const isAdmin = (user: User | null): boolean => {
  return hasRole(user, UserRole.ADMIN);
};

// Vérifier si responsable réseau
export const isNetworkManager = (user: User | null): boolean => {
  return hasRole(user, UserRole.NETWORK_MANAGER);
};

// Vérifier si prestataire
export const isContractor = (user: User | null): boolean => {
  return hasRole(user, UserRole.CONTRACTOR);
};

// Peut proposer des modifications
export const canProposeModification = (user: User | null): boolean => {
  return hasPermission(user, Permission.PROPOSE_MODIFICATION);
};

// Peut valider des modifications
export const canValidateModification = (user: User | null): boolean => {
  return hasPermission(user, Permission.VALIDATE_MODIFICATION);
};

// Peut éditer l'infrastructure
export const canEditInfrastructure = (user: User | null): boolean => {
  return hasPermission(user, Permission.EDIT_INFRASTRUCTURE);
};

// Peut gérer les utilisateurs
export const canManageUsers = (user: User | null): boolean => {
  return hasPermission(user, Permission.MANAGE_USERS);
};

// Obtenir toutes les permissions pour un rôle
export const getPermissionsForRole = (role: UserRole): Permission[] => {
  return ROLE_PERMISSIONS[role] || [];
};

// Obtenir le label du rôle
export const getRoleLabel = (role: UserRole): string => {
  const labels: Record<UserRole, string> = {
    [UserRole.ADMIN]: 'Administrateur',
    [UserRole.NETWORK_MANAGER]: 'Responsable Réseau',
    [UserRole.TECHNICIAN]: 'Technicien',
    [UserRole.CONTRACTOR]: 'Prestataire',
    [UserRole.VIEWER]: 'Lecture seule',
  };
  return labels[role];
};

// Obtenir le label de permission
export const getPermissionLabel = (permission: Permission): string => {
  const labels: Record<Permission, string> = {
    [Permission.VIEW_INFRASTRUCTURE]: 'Voir l\'infrastructure',
    [Permission.EDIT_INFRASTRUCTURE]: 'Modifier l\'infrastructure',
    [Permission.DELETE_INFRASTRUCTURE]: 'Supprimer l\'infrastructure',
    [Permission.PROPOSE_MODIFICATION]: 'Proposer des modifications',
    [Permission.VALIDATE_MODIFICATION]: 'Valider des modifications',
    [Permission.REJECT_MODIFICATION]: 'Rejeter des modifications',
    [Permission.MANAGE_USERS]: 'Gérer les utilisateurs',
    [Permission.MANAGE_ROLES]: 'Gérer les rôles',
    [Permission.EXPORT_DATA]: 'Exporter les données',
    [Permission.SCAN_QR]: 'Scanner QR code',
  };
  return labels[permission];
};