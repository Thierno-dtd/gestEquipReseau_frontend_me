import { useAuthStore } from '@store/authStore';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authAPI } from '@services/api';
import { LoginCredentials } from '@models/auth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useEffect } from 'react';

export const useAuth = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, token, setUser, logout: storeLogout } = useAuthStore();

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: (credentials: LoginCredentials) => authAPI.login(credentials),
    onSuccess: (data) => {
      setUser(data.user);
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('refreshToken', data.refreshToken);
      toast.success('Connexion réussie');
      navigate('/');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erreur de connexion');
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: () => authAPI.logout(),
    onSuccess: () => {
      storeLogout();
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      queryClient.clear();
      toast.success('Déconnexion réussie');
      navigate('/login');
    },
    onError: () => {
      // Force logout même en cas d'erreur
      storeLogout();
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      queryClient.clear();
      navigate('/login');
    },
  });

  // Get current user
  const { data: currentUser, isLoading, error } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => authAPI.getCurrentUser(),
    enabled: !!token,
    retry: false,
  });

  // Handle query success/error
  useEffect(() => {
    if (currentUser) {
      setUser(currentUser);
    }
  }, [currentUser, setUser]);

  useEffect(() => {
    if (error) {
      storeLogout();
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
    }
  }, [error, storeLogout]);

  const login = (credentials: LoginCredentials) => {
    loginMutation.mutate(credentials);
  };

  const logout = () => {
    logoutMutation.mutate();
  };

  const isAuthenticated = !!user && !!token;

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    loginMutation,
    logoutMutation,
  };
};