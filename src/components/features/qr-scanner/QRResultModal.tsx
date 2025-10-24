import { useNavigate } from 'react-router-dom';
import { X, CheckCircle, Server, Package, Cable, AlertCircle } from 'lucide-react';

interface QRResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: {
    data: string;
    type: 'rack' | 'equipment' | 'port' | 'unknown';
    id?: string;
  };
  details?: {
    name?: string;
    location?: string;
    status?: string;
    info?: string;
  };
}

const QRResultModal = ({ isOpen, onClose, result, details }: QRResultModalProps) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const getIcon = () => {
    switch (result.type) {
      case 'rack':
        return <Server className="w-12 h-12 text-primary" />;
      case 'equipment':
        return <Package className="w-12 h-12 text-primary" />;
      case 'port':
        return <Cable className="w-12 h-12 text-primary" />;
      default:
        return <AlertCircle className="w-12 h-12 text-yellow-500" />;
    }
  };

  const getTitle = () => {
    switch (result.type) {
      case 'rack':
        return 'Baie détectée';
      case 'equipment':
        return 'Équipement détecté';
      case 'port':
        return 'Port détecté';
      default:
        return 'Code non reconnu';
    }
  };

  const handleNavigate = () => {
    if (result.type === 'unknown' || !result.id) return;

    switch (result.type) {
      case 'rack':
        navigate(`/racks/${result.id}`);
        break;
      case 'equipment':
        navigate(`/equipments/${result.id}`);
        break;
      case 'port':
        navigate(`/ports/${result.id}`);
        break;
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full animate-slide-in-bottom">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            {result.type !== 'unknown' && (
              <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            )}
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              {getTitle()}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {result.type === 'unknown' ? (
            <div className="text-center py-4">
              <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400 mb-2">
                Ce code QR n'est pas reconnu par le système
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                Code scanné: <span className="font-mono">{result.data}</span>
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Icon */}
              <div className="flex justify-center">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                  {getIcon()}
                </div>
              </div>

              {/* Details */}
              <div className="space-y-3">
                {details?.name && (
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Nom</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {details.name}
                    </p>
                  </div>
                )}

                {details?.location && (
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Emplacement</p>
                    <p className="text-base text-gray-900 dark:text-white">
                      {details.location}
                    </p>
                  </div>
                )}

                {details?.status && (
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Statut</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`w-2 h-2 rounded-full ${
                        details.status === 'online' || details.status === 'ONLINE'
                          ? 'bg-green-500'
                          : details.status === 'offline' || details.status === 'OFFLINE'
                          ? 'bg-red-500'
                          : 'bg-yellow-500'
                      }`} />
                      <span className="text-base text-gray-900 dark:text-white capitalize">
                        {details.status}
                      </span>
                    </div>
                  </div>
                )}

                {details?.info && (
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Information</p>
                    <p className="text-base text-gray-900 dark:text-white">
                      {details.info}
                    </p>
                  </div>
                )}

                {/* QR Code Data */}
                <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    ID: <span className="font-mono">{result.id || result.data}</span>
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg font-medium transition-colors"
          >
            Fermer
          </button>
          {result.type !== 'unknown' && result.id && (
            <button
              onClick={handleNavigate}
              className="flex-1 px-4 py-3 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium transition-colors"
            >
              Voir les détails
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QRResultModal;