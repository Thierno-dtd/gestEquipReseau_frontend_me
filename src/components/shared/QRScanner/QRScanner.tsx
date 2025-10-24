import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Camera, X, AlertCircle } from 'lucide-react';

interface QRScannerProps {
  onScan: (decodedText: string) => void;
  onError?: (error: string) => void;
  onClose?: () => void;
  isOpen?: boolean;
}

const QRScanner: React.FC<QRScannerProps> = ({
  onScan,
  onError,
  onClose,
  isOpen = true,
}) => {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cameras, setCameras] = useState<any[]>([]);
  const [selectedCamera, setSelectedCamera] = useState<string>('');

  useEffect(() => {
    // Récupérer la liste des caméras disponibles
    Html5Qrcode.getCameras()
      .then((devices) => {
        if (devices && devices.length) {
          setCameras(devices);
          // Privilégier la caméra arrière
          const backCamera = devices.find((device) =>
            device.label.toLowerCase().includes('back')
          );
          setSelectedCamera(backCamera?.id || devices[0].id);
        } else {
          setError('Aucune caméra détectée sur cet appareil');
        }
      })
      .catch((err) => {
        setError('Erreur lors de l\'accès aux caméras');
        onError?.(err.message);
      });

    return () => {
      stopScanning();
    };
  }, []);

  useEffect(() => {
    if (isOpen && selectedCamera && !isScanning) {
      startScanning();
    } else if (!isOpen && isScanning) {
      stopScanning();
    }
  }, [isOpen, selectedCamera]);

  const startScanning = async () => {
    if (!selectedCamera) return;

    try {
      const scanner = new Html5Qrcode('qr-reader');
      scannerRef.current = scanner;

      await scanner.start(
        selectedCamera,
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
        },
        (decodedText) => {
          onScan(decodedText);
          stopScanning();
        },
        (errorMessage) => {
          // Ignorer les erreurs de scan normales
          console.debug('QR scan error:', errorMessage);
        }
      );

      setIsScanning(true);
      setError(null);
    } catch (err: any) {
      setError('Impossible de démarrer le scanner');
      onError?.(err.message);
    }
  };

  const stopScanning = async () => {
    if (scannerRef.current && isScanning) {
      try {
        await scannerRef.current.stop();
        scannerRef.current = null;
        setIsScanning(false);
      } catch (err) {
        console.error('Error stopping scanner:', err);
      }
    }
  };

  const handleCameraChange = (cameraId: string) => {
    stopScanning();
    setSelectedCamera(cameraId);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex flex-col">
      {/* Header */}
      <div className="bg-gray-900 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Camera className="w-6 h-6 text-blue-400" />
          <h2 className="text-lg font-semibold text-white">Scanner QR Code</h2>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            aria-label="Fermer"
          >
            <X className="w-6 h-6 text-gray-400" />
          </button>
        )}
      </div>

      {/* Camera Selector */}
      {cameras.length > 1 && (
        <div className="bg-gray-900 px-4 pb-4">
          <select
            value={selectedCamera}
            onChange={(e) => handleCameraChange(e.target.value)}
            className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-blue-500"
          >
            {cameras.map((camera) => (
              <option key={camera.id} value={camera.id}>
                {camera.label || `Caméra ${camera.id}`}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Scanner Container */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="relative max-w-md w-full">
          {error ? (
            <div className="bg-red-900/50 border border-red-700 rounded-lg p-6 text-center">
              <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
              <p className="text-red-200 text-sm">{error}</p>
            </div>
          ) : (
            <div className="relative">
              <div
                id="qr-reader"
                className="rounded-lg overflow-hidden shadow-2xl"
              />
              {/* Scanning Overlay */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-blue-500" />
                <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-blue-500" />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-blue-500" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-blue-500" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-gray-900 p-4 text-center">
        <p className="text-gray-400 text-sm">
          Positionnez le QR code dans le cadre pour le scanner
        </p>
      </div>
    </div>
  );
};

export default QRScanner;