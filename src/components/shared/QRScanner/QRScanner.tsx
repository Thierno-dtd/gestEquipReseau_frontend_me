import { useEffect, useRef, useState } from 'react';
import { QrScanner } from '@yudiel/react-qr-scanner';
import CameraStream from './CameraStream';

interface QRScannerProps {
  onScan: (result: string) => void;
  onError?: (error: Error) => void;
  className?: string;
}

const QRScanner = ({ onScan, onError, className = '' }: QRScannerProps) => {
  const [scanning, setScanning] = useState(true);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const scanCountRef = useRef<number>(0); // ✅ Correction: ajout de la valeur initiale
  const videoRef = useRef<HTMLVideoElement>(null); // ✅ Correction: type non-nullable

  useEffect(() => {
    requestCameraPermission();
  }, []);

  const requestCameraPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      setHasPermission(true);
      stream.getTracks().forEach(track => track.stop());
    } catch (err) {
      console.error('Camera permission denied:', err);
      setHasPermission(false);
      onError?.(err as Error);
    }
  };

  const handleScan = (result: string) => {
    if (!scanning) return;
    
    scanCountRef.current += 1;
    
    // Éviter les scans multiples du même code
    if (scanCountRef.current === 1) {
      setScanning(false);
      onScan(result);
      
      // Réactiver le scan après 2 secondes
      setTimeout(() => {
        scanCountRef.current = 0;
        setScanning(true);
      }, 2000);
    }
  };

  const handleError = (error: Error) => {
    console.error('QR Scanner error:', error);
    onError?.(error);
  };

  if (hasPermission === null) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">
            Demande d'accès à la caméra...
          </p>
        </div>
      </div>
    );
  }

  if (hasPermission === false) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <div className="text-center p-6 bg-red-50 dark:bg-red-900/20 rounded-lg">
          <span className="material-symbols-outlined text-5xl text-red-500 mb-4">
            no_photography
          </span>
          <p className="text-red-600 dark:text-red-400 font-medium mb-2">
            Accès à la caméra refusé
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Veuillez autoriser l'accès à la caméra dans les paramètres de votre navigateur
          </p>
          <button
            onClick={requestCameraPermission}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <QrScanner
        onDecode={handleScan}
        onError={handleError}
        videoRef={videoRef}
        constraints={{
          facingMode: 'environment',
          aspectRatio: 1
        }}
        containerStyle={{
          width: '100%',
          height: '100%',
          borderRadius: '0.75rem',
          overflow: 'hidden'
        }}
        videoStyle={{
          objectFit: 'cover'
        }}
      />
      
      {/* Overlay avec cadre de scan */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="absolute inset-0 flex items-center justify-center p-8">
          <div className="relative w-full max-w-sm aspect-square">
            {/* Cadre de scan */}
            <div className="absolute inset-0 border-4 border-primary rounded-xl"></div>
            
            {/* Coins animés */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-white rounded-tl-xl"></div>
            <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-white rounded-tr-xl"></div>
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-white rounded-bl-xl"></div>
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-white rounded-br-xl"></div>
            
            {/* Ligne de scan animée */}
            {scanning && (
              <div className="absolute top-0 w-full h-1 bg-primary animate-scan-line shadow-[0_0_10px_2px_rgba(17,147,212,0.8)]"></div>
            )}
          </div>
        </div>
      </div>

      {/* Indicateur de statut */}
      {!scanning && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
          <span className="material-symbols-outlined">check_circle</span>
          <span className="text-sm font-medium">Code détecté !</span>
        </div>
      )}

      <style>{`
        @keyframes scan {
          0% { transform: translateY(0); }
          100% { transform: translateY(100%); }
        }
        .animate-scan-line {
          animation: scan 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default QRScanner;