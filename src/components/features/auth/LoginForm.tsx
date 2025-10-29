import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Lock, LogIn } from 'lucide-react';
import { useAuthStore } from '@store/authStore';
import { authAPI } from '@services/api';
import { loginSchema, LoginFormData } from '@utils/validators';
import { toast } from 'sonner';

const LoginForm = () => {
  const navigate = useNavigate();
  const { login, setError } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authAPI.login(data);
      login(response.user, response.token, response.refreshToken);
      toast.success('Connexion réussie !');
      navigate('/');
    } catch (error: any) {
      const errorMessage = error.message || 'Une erreur est survenue lors de la connexion';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Email */}
      <div>
        <label 
          htmlFor="email" 
          className="block text-sm font-medium text-text-dark-secondary mb-1"
        >
          E-mail
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-dark-secondary " />
          <input
            id="email"
            type="email"
            {...register('email')}
            className="w-full bg-[#101c22] border-none rounded-lg pl-10 pr-4 py-3 focus:ring-2 focus:ring-primary text-text-dark-primary placeholder:text-text-dark-secondary/70"
            placeholder="votre.email@entreprise.com"
            disabled={isLoading}
          />
        </div>
        {errors.email && (
          <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
        )}
      </div>

      {/* Mot de passe */}
      <div>
        <label 
          htmlFor="password" 
          className="block text-sm font-medium text-text-dark-secondary mb-1"
        >
          Mot de passe
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-dark-secondary" />
          <input
            id="password"
            type="password"
            {...register('password')}
            className="w-full bg-[#101c22] border-none rounded-lg pl-10 pr-4 py-3 focus:ring-2 focus:ring-primary text-text-dark-primary placeholder:text-text-dark-secondary/70"
            placeholder="••••••••"
            disabled={isLoading}
          />
        </div>
        {errors.password && (
          <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
        )}
      </div>

      {/* Mot de passe oublié */}
      <div className="text-right">
        <a 
          href="/forgot-password" 
          className="text-[#1193d4] text-sm text-primary hover:underline"
        >
          Mot de passe oublié ?
        </a>
      </div>

      {/* Bouton de connexion */}
      <div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full btn-primary font-bold py-4 px-4 rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background-dark focus:ring-primary transition-colors duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Connexion en cours...
            </>
          ) : (
            <>
              <LogIn className="w-5 h-5" />
              Se connecter
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default LoginForm;