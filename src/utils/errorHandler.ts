import { APIError } from '@models/api';
import { toast } from 'sonner';

// Classe d'erreur personnalisée
export class AppError extends Error {
  constructor(
    message: string,
    public code: string = 'UNKNOWN_ERROR',
    public details?: any
  ) {
    super(message);
    this.name = 'AppError';
  }
}

// Parser les erreurs API
export const parseAPIError = (error: any): APIError => {
  // Si c'est déjà une APIError
  if (error.code && error.message) {
    return error as APIError;
  }

  // Si c'est une erreur Axios
  if (error.response) {
    return {
      code: error.response.data?.code || 'API_ERROR',
      message: error.response.data?.message || 'Une erreur est survenue',
      details: error.response.data?.details,
      field: error.response.data?.field,
      timestamp: new Date().toISOString(),
    };
  }

  // Si c'est une erreur réseau
  if (error.request) {
    return {
      code: 'NETWORK_ERROR',
      message: 'Impossible de joindre le serveur',
      timestamp: new Date().toISOString(),
    };
  }

  // Erreur générique
  return {
    code: 'UNKNOWN_ERROR',
    message: error.message || 'Une erreur inconnue est survenue',
    timestamp: new Date().toISOString(),
  };
};

// Afficher une erreur avec toast
export const showError = (error: any, defaultMessage?: string) => {
  const apiError = parseAPIError(error);
  const message = defaultMessage || apiError.message;
  
  toast.error(message, {
    description: apiError.details ? JSON.stringify(apiError.details) : undefined,
  });
};

// Gérer les erreurs de validation
export const handleValidationError = (error: APIError) => {
  if (error.field) {
    return {
      [error.field]: error.message,
    };
  }
  return null;
};

// Logger les erreurs (à adapter selon votre système de logging)
export const logError = (error: Error | APIError, context?: string) => {
  if (import.meta.env.VITE_ENV === 'development') {
    console.error(`[${context || 'Error'}]`, error);
  }
  
  // TODO: Envoyer à un service de logging (Sentry, LogRocket, etc.)
};

// Gérer les erreurs 401 (non autorisé)
export const handle401Error = () => {
  toast.error('Session expirée', {
    description: 'Veuillez vous reconnecter',
  });
  // La déconnexion est gérée dans l'intercepteur API
};

// Gérer les erreurs 403 (interdit)
export const handle403Error = () => {
  toast.error('Accès refusé', {
    description: 'Vous n\'avez pas les permissions nécessaires',
  });
};

// Gérer les erreurs 404 (non trouvé)
export const handle404Error = (resource?: string) => {
  toast.error('Ressource introuvable', {
    description: resource ? `${resource} n'existe pas ou a été supprimé` : undefined,
  });
};

// Gérer les erreurs 500 (erreur serveur)
export const handle500Error = () => {
  toast.error('Erreur serveur', {
    description: 'Une erreur est survenue côté serveur. Veuillez réessayer plus tard.',
  });
};