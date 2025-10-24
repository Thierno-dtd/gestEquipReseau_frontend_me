import { Component, ErrorInfo, ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo
    });

    // Appeler le callback onError si fourni
    this.props.onError?.(error, errorInfo);

    // Log l'erreur dans un service de monitoring (Sentry, etc.)
    // logErrorToService(error, errorInfo);
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // Si un fallback personnalisé est fourni, l'utiliser
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Sinon, afficher l'UI d'erreur par défaut
      return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            {/* Icône d'erreur */}
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-4xl text-red-600 dark:text-red-400">
                  error
                </span>
              </div>
            </div>

            {/* Titre */}
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-2">
              Une erreur est survenue
            </h1>

            {/* Message */}
            <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
              Nous sommes désolés, quelque chose s'est mal passé. Veuillez réessayer.
            </p>

            {/* Détails de l'erreur (en mode développement) */}
            {import.meta.env.MODE === 'development' && this.state.error && (
              <details className="mb-6 p-4 bg-gray-100 dark:bg-gray-900 rounded-lg">
                <summary className="cursor-pointer text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Détails techniques
                </summary>
                <div className="text-xs text-red-600 dark:text-red-400 font-mono overflow-auto">
                  <p className="font-bold mb-2">{this.state.error.toString()}</p>
                  {this.state.errorInfo && (
                    <pre className="whitespace-pre-wrap">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  )}
                </div>
              </details>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={this.handleReset}
                className="flex-1 bg-primary text-white font-medium py-3 px-4 rounded-lg hover:bg-primary/90 transition-colors"
              >
                Réessayer
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white font-medium py-3 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Accueil
              </button>
            </div>

            {/* Contact support */}
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-4">
              Si le problème persiste, contactez le support technique
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;