import { useState, useEffect, useCallback, useRef } from 'react';

interface UseCameraStreamOptions {
  facingMode?: 'user' | 'environment';
  width?: number;
  height?: number;
  autoStart?: boolean;
}

interface UseCameraStreamReturn {
  stream: MediaStream | null;
  isLoading: boolean;
  error: Error | null;
  hasPermission: boolean;
  startStream: () => Promise<void>;
  stopStream: () => void;
  toggleFlash: () => Promise<void>;
  isFlashOn: boolean;
  hasFlash: boolean;
}

export const useCameraStream = (
  options: UseCameraStreamOptions = {}
): UseCameraStreamReturn => {
  const {
    facingMode = 'environment',
    width = 1280,
    height = 720,
    autoStart = true,
  } = options;

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [hasPermission, setHasPermission] = useState(false);
  const [isFlashOn, setIsFlashOn] = useState(false);
  const [hasFlash, setHasFlash] = useState(false);
  
  const streamRef = useRef<MediaStream | null>(null);

  // Démarrer le stream
  const startStream = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Vérifier si getUserMedia est supporté
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Votre navigateur ne supporte pas l\'accès à la caméra');
      }

      // Demander l'accès à la caméra
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: facingMode },
          width: { ideal: width },
          height: { ideal: height },
        },
        audio: false,
      });

      // Vérifier si le flash est disponible
      const videoTrack = mediaStream.getVideoTracks()[0];
      const capabilities = videoTrack.getCapabilities() as any;
      setHasFlash(!!capabilities.torch);

      streamRef.current = mediaStream;
      setStream(mediaStream);
      setHasPermission(true);
      setError(null);
    } catch (err) {
      console.error('Camera error:', err);
      
      let errorMessage = 'Impossible d\'accéder à la caméra';
      
      if (err instanceof Error) {
        if (err.name === 'NotAllowedError') {
          errorMessage = 'Permission refusée. Veuillez autoriser l\'accès à la caméra.';
        } else if (err.name === 'NotFoundError') {
          errorMessage = 'Aucune caméra trouvée sur cet appareil.';
        } else if (err.name === 'NotReadableError') {
          errorMessage = 'La caméra est déjà utilisée par une autre application.';
        } else if (err.name === 'OverconstrainedError') {
          errorMessage = 'La caméra ne supporte pas les paramètres demandés.';
        } else {
          errorMessage = err.message;
        }
      }
      
      setError(new Error(errorMessage));
      setHasPermission(false);
    } finally {
      setIsLoading(false);
    }
  }, [facingMode, width, height]);

  // Arrêter le stream
  const stopStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        track.stop();
      });
      streamRef.current = null;
      setStream(null);
      setIsFlashOn(false);
    }
  }, []);

  // Toggle flash
  const toggleFlash = useCallback(async () => {
    if (!streamRef.current) return;

    try {
      const videoTrack = streamRef.current.getVideoTracks()[0];
      const capabilities = videoTrack.getCapabilities() as any;

      if (!capabilities.torch) {
        throw new Error('Flash non disponible sur cet appareil');
      }

      const newFlashState = !isFlashOn;
      
      await videoTrack.applyConstraints({
        advanced: [{ torch: newFlashState }] as any,
      });

      setIsFlashOn(newFlashState);
    } catch (err) {
      console.error('Flash error:', err);
      throw new Error('Erreur lors de l\'activation du flash');
    }
  }, [isFlashOn]);

  // Auto-start si demandé
  useEffect(() => {
    if (autoStart) {
      startStream();
    }

    // Cleanup au démontage
    return () => {
      stopStream();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Gérer la visibilité de la page
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && streamRef.current) {
        // Pause le stream quand la page est cachée
        streamRef.current.getVideoTracks().forEach(track => {
          track.enabled = false;
        });
      } else if (!document.hidden && streamRef.current) {
        // Reprend le stream quand la page est visible
        streamRef.current.getVideoTracks().forEach(track => {
          track.enabled = true;
        });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return {
    stream,
    isLoading,
    error,
    hasPermission,
    startStream,
    stopStream,
    toggleFlash,
    isFlashOn,
    hasFlash,
  };
};