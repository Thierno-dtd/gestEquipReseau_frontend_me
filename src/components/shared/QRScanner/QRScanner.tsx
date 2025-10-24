import { useEffect, useRef } from 'react';
import { Camera, Zap, ZapOff, AlertCircle, Loader } from 'lucide-react';
import { useCameraStream } from './useCameraStream';
import { useQRScan } from '@hooks/useQRScan';
import CameraStream from './CameraStream';

interface QRScannerProps {
  onScan?: (data: string) => void;
  onError?: (error: Error) => void;
}

const QRScanner = ({ onScan, onError }: QRScannerProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const scanIntervalRef = useRef<number>();

  const {
    stream,
    isLoading,
    error: cameraError,
    hasPermission,
    startStream,
    stopStream,
    toggleFlash,
    isFlashOn,
    hasFlash,
  } = useCameraStream({
    facingMode: 'environment',
    autoStart: true,
  });

  const {
    isScanning,
    result,
    scanFromCanvas,
    handleScanResult,
    startScanning,
    stopScanning,
  } = useQRScan();

  // Démarrer le scan quand le stream est prêt
  useEffect(() => {
    if (stream && videoRef.current && canvasRef.current) {
      startScanning();
      
      // Scanner en continu
      scanIntervalRef.current = window.setInterval(() => {
        if (videoRef.current && canvasRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
          const scanResult = scanFromCanvas(canvasRef.current, videoRef.current);
          
          if (scanResult) {
            handleScanResult(scanResult);
            onScan?.(scanResult.data);
            stopScanning();
            
            // Arrêter le scan après détection
            if (scanIntervalRef.current) {
              clearInterval(scanIntervalRef.current);
            }
          }
        }
      }, 100); // Scanner toutes les 100ms
    }

    return () => {
      if (scanIntervalRef.current) {
        clearInterval(scanIntervalRef.current);
      }
    };
  }, [stream, scanFromCanvas, handleScanResult, startScanning, stopScanning, onScan]);

  // Gérer les erreurs
  useEffect(() => {
    if (cameraError) {
      onError?.(cameraError);
    }
  }, [cameraError, onError]);

  const handleRetry = () => {
    stopStream();
    startStream();
  };

  // Afficher le loader pendant le chargement
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8">
        <Loader className="w-12 h-12 text-primary animate-spin mb-4" />
        <p className="text-gray-600 dark:text-gray-400">
          Accès à la caméra en cours...
        </p>
      </div>
    );
  }

  // Afficher l'erreur si pas de permission ou erreur caméra
  if (cameraError || !hasPermission) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4">
          <AlertCircle className="w-8 h-8 text-red-500" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Erreur d'accès à la caméra
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
          {cameraError?.message || 'Impossible d\'accéder à la caméra'}
        </p>
        <button
          onClick={handleRetry}
          className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full flex flex-col">
      {/* Instructions */}
      <div className="p-4 bg-background-light dark:bg-background-dark">
        <div className="flex items-center gap-3">
          <Camera className="w-5 h-5 text-primary" />
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Placez le QR code dans le cadre pour le scanner
          </p>
        </div>
      </div>

      {/* Zone de scan */}
      <div className="flex-1 relative bg-black">
        {/* Video + Canvas cachés */}
        <CameraStream 
          stream={stream} 
          videoRef={videoRef}
        />
        <canvas
          ref={canvasRef}
          className="hidden"
        />

        {/* Overlay avec cadre de scan */}
        <div className="absolute inset-0 flex items-center justify-center p-8">
          <div className="relative w-full max-w-sm aspect-square">
            {/* Cadre de scan */}
            <div className="absolute inset-0 border-4 border-dashed border-primary rounded-xl animate-pulse" />
            
            {/* Coins du cadre */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-xl" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-xl" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-xl" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-xl" />

            {/* Ligne de scan animée */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-primary shadow-lg shadow-primary animate-scan-line" />
          </div>
        </div>

        {/* Overlay sombre autour du cadre */}
        <div className="absolute inset-0 bg-black/50" style={{
          WebkitMaskImage: 'radial-gradient(circle, transparent 40%, black 60%)',
          maskImage: 'radial-gradient(circle, transparent 40%, black 60%)',
        }} />

        {/* Status */}
        {isScanning && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
            <div className="flex items-center gap-2 px-4 py-2 bg-primary/90 text-white rounded-full">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
              <span className="text-sm font-medium">Scan en cours...</span>
            </div>
          </div>
        )}

        {/* Résultat */}
        {result && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
            <div className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-full">
              <Camera className="w-4 h-4" />
              <span className="text-sm font-medium">QR Code détecté !</span>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="p-4 bg-background-light dark:bg-background-dark border-t border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-center gap-4">
          {/* Flash toggle */}
          {hasFlash && (
            <button
              onClick={toggleFlash}
              className={`flex items-center justify-center w-14 h-14 rounded-full transition-colors ${
                isFlashOn
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
              }`}
              aria-label="Toggle flash"
            >
              {isFlashOn ? (
                <Zap className="w-6 h-6" fill="currentColor" />
              ) : (
                <ZapOff className="w-6 h-6" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Style pour l'animation */}
      <style>{`
        @keyframes scan-line {
          0% { transform: translateY(0); }
          100% { transform: translateY(300px); }
        }
        .animate-scan-line {
          animation: scan-line 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default QRScanner;