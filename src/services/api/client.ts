import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { APIResponse, APIError } from '@models/api';
import { useAuthStore } from '@store/authStore';
import { useSyncStore } from '@store/syncStore';

// Configuration de base
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const API_TIMEOUT = parseInt(import.meta.env.VITE_API_TIMEOUT) || 30000;

// Créer l'instance Axios
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur de requête
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Ajouter le token d'authentification
    const token = useAuthStore.getState().token;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Ajouter un ID de requête unique
    if (config.headers) {
      config.headers['X-Request-ID'] = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur de réponse
apiClient.interceptors.response.use(
  (response) => {
    // Transformation de la réponse si nécessaire
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Gestion de l'erreur 401 (non autorisé)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Tenter de rafraîchir le token
        const refreshToken = useAuthStore.getState().refreshToken;
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refreshToken,
          });

          const { token, refreshToken: newRefreshToken } = response.data;
          useAuthStore.getState().setTokens(token, newRefreshToken);

          // Réessayer la requête originale avec le nouveau token
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
          }
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Si le refresh échoue, déconnecter l'utilisateur
        useAuthStore.getState().logout();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    // Gestion mode hors ligne
    if (!navigator.onLine) {
      useSyncStore.getState().setOnline(false);
      
      // Si c'est une mutation (POST, PUT, DELETE), ajouter à la queue
      if (originalRequest.method && ['post', 'put', 'delete', 'patch'].includes(originalRequest.method.toLowerCase())) {
        // TODO: Ajouter à la queue offline
        console.log('Requête ajoutée à la queue offline');
      }
    }

    // Formatter l'erreur
    const responseData = error.response?.data as any;
    const apiError: APIError = {
      code: responseData?.code || 'UNKNOWN_ERROR',
      message: responseData?.message || error.message || 'Une erreur est survenue',
      details: responseData?.details,
      field: responseData?.field,
      timestamp: new Date().toISOString(),
    };

    return Promise.reject(apiError);
  }
);

// Méthodes helper
export const get = <T = any>(url: string, params?: any): Promise<APIResponse<T>> => {
  return apiClient.get(url, { params }).then((res) => res.data);
};

export const post = <T = any>(url: string, data?: any): Promise<APIResponse<T>> => {
  return apiClient.post(url, data).then((res) => res.data);
};

export const put = <T = any>(url: string, data?: any): Promise<APIResponse<T>> => {
  return apiClient.put(url, data).then((res) => res.data);
};

export const patch = <T = any>(url: string, data?: any): Promise<APIResponse<T>> => {
  return apiClient.patch(url, data).then((res) => res.data);
};

export const del = <T = any>(url: string): Promise<APIResponse<T>> => {
  return apiClient.delete(url).then((res) => res.data);
};

// Export de l'instance pour les cas spéciaux
export default apiClient;