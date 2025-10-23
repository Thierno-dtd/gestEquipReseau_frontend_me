import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@store/authStore';
import LoginForm from './LoginForm';
import { Network } from 'lucide-react';

const LoginPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen bg-background-dark text-text-dark-primary font-display flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <header className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-xl mb-4">
            <Network className="text-primary" size={48} />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">InfraMap</h1>
          <p className="text-gray-400">
            Gestion de l'infrastructure réseau en temps réel
          </p>
        </header>

        {/* Formulaire de connexion */}
        <main className="bg-surface-dark rounded-xl shadow-2xl p-8">
          <LoginForm />
        </main>

        {/* Footer */}
        <footer className="text-center mt-8">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} InfraMap. Tous droits réservés.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default LoginPage;