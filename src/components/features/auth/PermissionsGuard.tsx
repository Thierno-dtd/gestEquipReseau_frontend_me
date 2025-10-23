import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { usePermissions } from '@/hooks/usePermissions';
import { Permission, UserRole } from '@/models/auth';
import Loading  from '@/components/shared/Common/Loading';

interface PermissionsGuardProps {
  children: ReactNode;
  requiredPermissions?: Permission[];
  requiredRoles?: UserRole[];
  requireAll?: boolean; // true = toutes les permissions, false = au moins une
  fallback?: ReactNode;
}

export const PermissionsGuard = ({
  children,
  requiredPermissions = [],
  requiredRoles = [],
  requireAll = false,
  fallback,
}: PermissionsGuardProps) => {
  const location = useLocation();
  const { isAuthenticated, isLoading } = useAuth();
  const { hasPermission, hasRole, hasAnyPermission, hasAllPermissions, hasAnyRole } = usePermissions();

  if (isLoading) {
    return <Loading />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Vérifier les permissions
  if (requiredPermissions.length > 0) {
    const hasRequiredPermissions = requireAll
      ? hasAllPermissions(requiredPermissions)
      : hasAnyPermission(requiredPermissions);

    if (!hasRequiredPermissions) {
      return fallback ? (
        <>{fallback}</>
      ) : (
        <Navigate to="/unauthorized" replace />
      );
    }
  }

  // Vérifier les rôles
  if (requiredRoles.length > 0) {
    const hasRequiredRoles = hasAnyRole(requiredRoles);

    if (!hasRequiredRoles) {
      return fallback ? (
        <>{fallback}</>
      ) : (
        <Navigate to="/unauthorized" replace />
      );
    }
  }

  return <>{children}</>;
};

// HOC pour protéger les routes
export const withPermissions = (
  Component: React.ComponentType<any>,
  permissions?: Permission[],
  roles?: UserRole[],
  requireAll = false
) => {
  return (props: any) => (
    <PermissionsGuard
      requiredPermissions={permissions}
      requiredRoles={roles}
      requireAll={requireAll}
    >
      <Component {...props} />
    </PermissionsGuard>
  );
};

// Composant pour affichage conditionnel basé sur les permissions
interface CanProps {
  permission?: Permission;
  permissions?: Permission[];
  role?: UserRole;
  roles?: UserRole[];
  requireAll?: boolean;
  children: ReactNode;
  fallback?: ReactNode;
}

export const Can = ({
  permission,
  permissions = [],
  role,
  roles = [],
  requireAll = false,
  children,
  fallback = null,
}: CanProps) => {
  const { hasPermission, hasRole, hasAnyPermission, hasAllPermissions, hasAnyRole } = usePermissions();

  // Check single permission
  if (permission && !hasPermission(permission)) {
    return <>{fallback}</>;
  }

  // Check multiple permissions
  if (permissions.length > 0) {
    const hasRequiredPermissions = requireAll
      ? hasAllPermissions(permissions)
      : hasAnyPermission(permissions);

    if (!hasRequiredPermissions) {
      return <>{fallback}</>;
    }
  }

  // Check single role
  if (role && !hasRole(role)) {
    return <>{fallback}</>;
  }

  // Check multiple roles
  if (roles.length > 0 && !hasAnyRole(roles)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};