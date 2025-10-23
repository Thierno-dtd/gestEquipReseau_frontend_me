import { get, post } from './client';
import { AuthResponse, LoginCredentials, User } from '@models/auth';

// Endpoints d'authentification
export const authAPI = {
  // Login
  login: (credentials: LoginCredentials): Promise<AuthResponse> => {
    return post<AuthResponse>('/auth/login', credentials).then((res) => res.data);
  },

  // Logout
  logout: (): Promise<void> => {
    return post('/auth/logout').then(() => undefined);
  },

  // Refresh token
  refreshToken: (refreshToken: string): Promise<AuthResponse> => {
    return post<AuthResponse>('/auth/refresh', { refreshToken }).then((res) => res.data);
  },

  // Get current user
  getCurrentUser: (): Promise<User> => {
    return get<User>('/auth/me').then((res) => res.data);
  },

  // Forgot password
  forgotPassword: (email: string): Promise<void> => {
    return post('/auth/forgot-password', { email }).then(() => undefined);
  },

  // Reset password
  resetPassword: (token: string, newPassword: string): Promise<void> => {
    return post('/auth/reset-password', { token, newPassword }).then(() => undefined);
  },

  // Change password
  changePassword: (oldPassword: string, newPassword: string): Promise<void> => {
    return post('/auth/change-password', { oldPassword, newPassword }).then(() => undefined);
  },
};