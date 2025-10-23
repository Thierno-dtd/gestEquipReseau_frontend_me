// Réponse API générique
export interface APIResponse<T = any> {
    success: boolean;
    data: T;
    message?: string;
    timestamp: string;
  }
  
  // Réponse avec pagination
  export interface PaginatedResponse<T = any> {
    data: T[];
    pagination: {
      page: number;
      pageSize: number;
      totalPages: number;
      totalItems: number;
      hasNext: boolean;
      hasPrevious: boolean;
    };
  }
  
  // Erreur API
  export interface APIError {
    code: string;
    message: string;
    details?: Record<string, any>;
    field?: string; // Pour les erreurs de validation
    timestamp: string;
  }
  
  // Paramètres de pagination
  export interface PaginationParams {
    page?: number;
    pageSize?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }
  
  // Paramètres de recherche
  export interface SearchParams {
    query?: string;
    filters?: Record<string, any>;
  }
  
  // Requête avec pagination et recherche
  export interface QueryParams extends PaginationParams, SearchParams {}
  
  // Status de requête
  export enum RequestStatus {
    IDLE = 'IDLE',
    LOADING = 'LOADING',
    SUCCESS = 'SUCCESS',
    ERROR = 'ERROR',
  }
  
  // État de requête générique
  export interface RequestState<T = any> {
    data: T | null;
    status: RequestStatus;
    error: APIError | null;
    isLoading: boolean;
    isSuccess: boolean;
    isError: boolean;
  }
  
  // Headers API
  export interface APIHeaders {
    'Content-Type': string;
    'Authorization'?: string;
    'X-Request-ID'?: string;
    [key: string]: string | undefined;
  }
  
  // Configuration de la requête
  export interface RequestConfig {
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    url: string;
    data?: any;
    params?: Record<string, any>;
    headers?: Partial<APIHeaders>;
    timeout?: number;
    withCredentials?: boolean;
    requiresAuth?: boolean;
  }
  
  // Réponse de santé de l'API
  export interface HealthCheck {
    status: 'healthy' | 'degraded' | 'unhealthy';
    timestamp: string;
    services: {
      database: boolean;
      cache: boolean;
      storage: boolean;
    };
    version: string;
  }