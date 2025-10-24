import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Flashlight, Camera, Keyboard } from 'lucide-react';
import { useQRScan } from '@hooks/useQRScan';
import { toast } from 'sonner';

const QRScannerPage = () => {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
  const [hasCamera, setHasCamera] = useState(false);
  const [isFlashOn, setIsFlashOn] = useState(false);
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [manualCode, setManualCode] = useState('');
  
  const {
    isScanning,
    result,
    scanFromCanvas,
    handleScanResult,
    startScanning,
    stopScanning,
    parseQRCode,
  } = useQRScan();

  // Initialiser la caméra
  useEffect(() => {
    const initCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'environment', // Caméra arrière sur mobile
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          streamRef.current = stream;
          setHasCamera(true);
          startScanning();
        }
      } catch (error) {
        console.error('Camera error:', error);
        toast.error('Impossible d\'accéder à la caméra');
        setHasCamera(false);
      }
    };

    initCamera();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      stopScanning();
    };
  }, []);

  // Scanner en continu
  useEffect(() => {
    if (!isScanning || !videoRef.current || !canvasRef.current) return;

    const scanInterval = setInterval(() => {
      if (videoRef.current?.readyState === videoRef.current?.HAVE_ENOUGH_DATA) {
        const scanResult = scanFromCanvas(canvasRef.current!, videoRef.current!);
        if (scanResult) {
          handleScanResult(scanResult);
          clearInterval(scanInterval);
        }
      }
    }, 100);

    return () => clearInterval(scanInterval);
  }, [isScanning, scanFromCanvas, handleScanResult]);

  // Toggle flash
  const toggleFlash = async () => {
    if (!streamRef.current) return;

    try {
      const track = streamRef.current.getVideoTracks()[0];
      const capabilities = track.getCapabilities() as any;

      if (capabilities.torch) {
        await track.applyConstraints({
          advanced: [{ torch: !isFlashOn }] as any,
        });
        setIsFlashOn(!isFlashOn);
      } else {
        toast.error('Flash non disponible sur cet appareil');
      }
    } catch (error) {
      console.error('Flash error:', error);
      toast.error('Erreur lors de l\'activation du flash');
    }
  };

  // Saisie manuelle
  const handleManualSubmit = () => {
    if (!manualCode.trim()) {
      toast.error('Veuillez saisir un code');
      return;
    }

    const parsedResult = parseQRCode(manualCode);
    handleScanResult(parsedResult);
    setShowManualEntry(false);
    setManualCode('');
  };

  return (
    <div className="min-h-screen bg-background-dark text-white flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between p-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center justify-center w-12 h-12 rounded-lg hover:bg-gray-800 transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-bold">Scanner QR Code</h1>
        <button
          onClick={toggleFlash}
          className={`flex items-center justify-center w-12 h-12 rounded-lg transition-colors ${
            isFlashOn ? 'bg-primary text-white' : 'hover:bg-gray-800'
          }`}
          disabled={!hasCamera}
        >
          <Flashlight className="w-6 h-6" />
        </button>
      </header>

      {/* Instructions */}
      <p className="text-center text-gray-400 px-4 pb-4">
        Placez le code QR dans le cadre pour le scanner
      </p>

      {/* Scanner Area */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="relative w-full max-w-md aspect-square">
          {hasCamera ? (
            <>
              {/* Video */}
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="absolute inset-0 w-full h-full object-cover rounded-xl"
              />
              
              {/* Canvas caché pour le scan */}
              <canvas ref={canvasRef} className="hidden" />
              
              {/* Overlay avec cadre */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full h-full border-4 border-dashed border-primary rounded-xl relative">
                  {/* Corners */}
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-xl" />
                  <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-xl" />
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-xl" />
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-xl" />
                  
                  {/* Scanning line */}
                  {isScanning && (
                    <div className="absolute top-0 left-0 right-0 h-1 bg-primary animate-scan-line" />
                  )}
                </div>
              </div>

              {/* Status */}
              {result && (
                <div className="absolute bottom-4 left-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg text-center font-medium">
                  ✓ Code scanné avec succès
                </div>
              )}
            </>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-800 rounded-xl">
              <Camera className="w-16 h-16 text-gray-600 mb-4" />
              <p className="text-gray-400 text-center">
                Caméra non disponible
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="p-4 space-y-3">
        {/* Manual Entry Button */}
        <button
          onClick={() => setShowManualEntry(true)}
          className="w-full flex items-center justify-center gap-2 bg-primary/20 text-white py-4 rounded-lg font-medium hover:bg-primary/30 transition-colors"
        >
          <Keyboard className="w-5 h-5" />
          Saisie manuelle
        </button>
      </div>

      {/* Manual Entry Modal */}
      {showManualEntry && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-surface-dark rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Saisie manuelle du code</h3>
            
            <input
              type="text"
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value)}
              placeholder="Ex: RACK:123 ou EQUIPMENT:456"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-primary"
              autoFocus
            />

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowManualEntry(false);
                  setManualCode('');
                }}
                className="flex-1 bg-gray-700 text-white py-3 rounded-lg font-medium hover:bg-gray-600 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleManualSubmit}
                className="flex-1 bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                Valider
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <nav className="border-t border-gray-800 bg-surface-dark">
        <div className="flex justify-around py-2">
          <button
            onClick={() => navigate('/')}
            className="flex flex-col items-center gap-1 p-2 text-gray-400"
          >
            <span className="material-symbols-outlined">home</span>
            <span className="text-xs">Accueil</span>
          </button>
          <button className="flex flex-col items-center gap-1 p-2 text-primary">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
              qr_code_scanner
            </span>
            <span className="text-xs">Scan</span>
          </button>
          <button
            onClick={() => navigate('/sites')}
            className="flex flex-col items-center gap-1 p-2 text-gray-400"
          >
            <span className="material-symbols-outlined">map</span>
            <span className="text-xs">Carte</span>
          </button>
          <button
            onClick={() => navigate('/profile')}
            className="flex flex-col items-center gap-1 p-2 text-gray-400"
          >
            <span className="material-symbols-outlined">person</span>
            <span className="text-xs">Profil</span>
          </button>
        </div>
      </nav>

      <style>{`
        @keyframes scan {
          0% { transform: translateY(0); }
          100% { transform: translateY(100%); }
        }
        .animate-scan-line {
          animation: scan 3s ease-in-out infinite;
          box-shadow: 0 0 10px 2px #1193d4;
        }
      `}</style>
    </div>
  );
};

export default QRScannerPage;