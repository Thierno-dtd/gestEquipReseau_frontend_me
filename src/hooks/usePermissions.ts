import { useAuthStore } from '@/store/authStore';
import { Permission, UserRole } from '@/models/auth';
import { hasPermission as checkPermission } from '@/utils/permissions';

export const usePermissions = () => {
  const { user } = useAuthStore();
  const permissions = user?.permissions || [];
  const role = user?.role;

  const hasPermission = (permission: Permission): boolean => {
    return user ? checkPermission(user, permission) : false;
  };

  const hasAnyPermission = (perms: Permission[]): boolean => {
    return user ? perms.some((perm) => checkPermission(user, perm)) : false;
  };

  const hasAllPermissions = (perms: Permission[]): boolean => {
    return user ? perms.every((perm) => checkPermission(user, perm)) : false;
  };

  const hasRole = (requiredRole: UserRole): boolean => {
    return role === requiredRole;
  };

  const hasAnyRole = (roles: UserRole[]): boolean => {
    return role ? roles.includes(role) : false;
  };

  // Permissions spécifiques
  const canViewInfrastructure = hasPermission(Permission.VIEW_INFRASTRUCTURE);
  const canEditInfrastructure = hasPermission(Permission.EDIT_INFRASTRUCTURE);
  const canApproveModifications = hasPermission(Permission.PROPOSE_MODIFICATION);
  const canManageUsers = hasPermission(Permission.MANAGE_USERS);
  const canExportData = hasPermission(Permission.EXPORT_DATA);
  const canViewReports = hasPermission(Permission.VIEW_INFRASTRUCTURE);

  // Roles
  const isAdmin = hasRole(UserRole.ADMIN);
  const isNetworkManager = hasRole(UserRole.NETWORK_MANAGER);
  const isTechnician = hasRole(UserRole.TECHNICIAN);
  const isContractor = hasRole(UserRole.CONTRACTOR);
  const isReadOnly = hasRole(UserRole.VIEWER);

  return {
    permissions,
    role,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasRole,
    hasAnyRole,
    // Shortcuts
    canViewInfrastructure,
    canEditInfrastructure,
    canApproveModifications,
    canManageUsers,
    canExportData,
    canViewReports,
    isAdmin,
    isNetworkManager,
    isTechnician,
    isContractor,
    isReadOnly,
  };
};