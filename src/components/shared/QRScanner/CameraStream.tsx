import { RefObject, useEffect } from 'react';
import { useCameraStream } from './useCameraStream';

export interface CameraStreamProps {
  videoRef: RefObject<HTMLVideoElement>; // ✅ Type non-nullable
  onStreamReady?: (stream: MediaStream) => void;
  onStreamError?: (error: Error) => void;
  facingMode?: 'user' | 'environment';
}

const CameraStream = ({ 
  videoRef, 
  onStreamReady, 
  onStreamError,
  facingMode = 'environment'
}: CameraStreamProps) => {
  const { stream, error, isLoading, startStream, stopStream } = useCameraStream({
    facingMode
  });

  useEffect(() => {
    startStream();
    return () => stopStream();
  }, [startStream, stopStream]);

  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
      videoRef.current.play().catch(err => {
        console.error('Error playing video:', err);
        onStreamError?.(err);
      });
      onStreamReady?.(stream);
    }
  }, [stream, videoRef, onStreamReady, onStreamError]);

  useEffect(() => {
    if (error) {
      onStreamError?.(error);
    }
  }, [error, onStreamError]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-full h-full bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-white text-sm">Initialisation de la caméra...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center w-full h-full bg-gray-900">
        <div className="text-center p-6">
          <span className="material-symbols-outlined text-5xl text-red-500 mb-4">
            videocam_off
          </span>
          <p className="text-red-400 font-medium mb-2">Erreur caméra</p>
          <p className="text-gray-400 text-sm">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <video
      ref={videoRef}
      autoPlay
      playsInline
      muted
      className="w-full h-full object-cover"
    />
  );
};

export default CameraStream;