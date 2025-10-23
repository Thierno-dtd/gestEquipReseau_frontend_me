import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@store/authStore';
import LoginForm from './LoginForm';

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
      <div className="w-full max-w-sm">
        {/* Header */}
        <header className="text-center mb-10">
          <div className="inline-block p-4 bg-surface-dark rounded-xl mb-4">
            <span className="material-symbols-outlined text-primary" style={{ fontSize: '48px' }}>
              lan
            </span>
          </div>
          <h1 className="text-3xl font-bold text-text-dark-primary">InfraMap</h1>
          <p className="text-text-dark-secondary mt-1">
            Gestion de l'infrastructure réseau en temps réel
          </p>
        </header>

        {/* Formulaire de connexion */}
        <main>
          <LoginForm />
        </main>

        {/* Footer */}
        <footer className="text-center mt-12">
          <p className="text-xs text-text-dark-secondary">
            © {new Date().getFullYear()} InfraMap. Tous droits réservés.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default LoginPage;