// Rôles utilisateurs
export enum UserRole {
    ADMIN = 'ADMIN',
    NETWORK_MANAGER = 'NETWORK_MANAGER', // Responsable réseau interne
    TECHNICIAN = 'TECHNICIAN', // Technicien interne
    CONTRACTOR = 'CONTRACTOR', // Prestataire externe
    VIEWER = 'VIEWER', // Lecture seule
  }
  
  // Permissions
  export enum Permission {
    // Infrastructure
    VIEW_INFRASTRUCTURE = 'VIEW_INFRASTRUCTURE',
    EDIT_INFRASTRUCTURE = 'EDIT_INFRASTRUCTURE',
    DELETE_INFRASTRUCTURE = 'DELETE_INFRASTRUCTURE',
    
    // Modifications
    PROPOSE_MODIFICATION = 'PROPOSE_MODIFICATION',
    VALIDATE_MODIFICATION = 'VALIDATE_MODIFICATION',
    REJECT_MODIFICATION = 'REJECT_MODIFICATION',
    
    // Utilisateurs
    MANAGE_USERS = 'MANAGE_USERS',
    MANAGE_ROLES = 'MANAGE_ROLES',
    
    // Export
    EXPORT_DATA = 'EXPORT_DATA',
    
    // QR Code
    SCAN_QR = 'SCAN_QR',
  }
  
  // Utilisateur
  export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    password?: string
    role: UserRole;
    permissions: Permission[];
    company?: string; // Pour les prestataires
    avatar?: string;
    isActive: boolean;
    createdAt: string;
    lastLogin?: string;
  }
  
  // Données de login
  export interface LoginCredentials {
    email: string;
    password: string;
    rememberMe?: boolean;
  }
  
  // Réponse d'authentification
  export interface AuthResponse {
    user: User;
    token: string;
    refreshToken: string;
    expiresIn: number;
  }
  
  // État d'authentification
  export interface AuthState {
    user: User | null;
    token: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
  }
  
  // Permissions par rôle (pour la logique frontend)
  export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
    [UserRole.ADMIN]: [
      Permission.VIEW_INFRASTRUCTURE,
      Permission.EDIT_INFRASTRUCTURE,
      Permission.DELETE_INFRASTRUCTURE,
      Permission.PROPOSE_MODIFICATION,
      Permission.VALIDATE_MODIFICATION,
      Permission.REJECT_MODIFICATION,
      Permission.MANAGE_USERS,
      Permission.MANAGE_ROLES,
      Permission.EXPORT_DATA,
      Permission.SCAN_QR,
    ],
    [UserRole.NETWORK_MANAGER]: [
      Permission.VIEW_INFRASTRUCTURE,
      Permission.EDIT_INFRASTRUCTURE,
      Permission.PROPOSE_MODIFICATION,
      Permission.VALIDATE_MODIFICATION,
      Permission.REJECT_MODIFICATION,
      Permission.EXPORT_DATA,
      Permission.SCAN_QR,
    ],
    [UserRole.TECHNICIAN]: [
      Permission.VIEW_INFRASTRUCTURE,
      Permission.PROPOSE_MODIFICATION,
      Permission.SCAN_QR,
    ],
    [UserRole.CONTRACTOR]: [
      Permission.VIEW_INFRASTRUCTURE,
      Permission.PROPOSE_MODIFICATION,
      Permission.SCAN_QR,
    ],
    [UserRole.VIEWER]: [
      Permission.VIEW_INFRASTRUCTURE,
    ],
  };