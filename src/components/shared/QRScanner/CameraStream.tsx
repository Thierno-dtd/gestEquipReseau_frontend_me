import { useEffect, RefObject } from 'react';

interface CameraStreamProps {
  stream: MediaStream | null;
  videoRef: RefObject<HTMLVideoElement>;
  className?: string;
}

const CameraStream = ({ stream, videoRef, className = '' }: CameraStreamProps) => {
  useEffect(() => {
    if (stream && videoRef.current) {
      const video = videoRef.current;
      
      // Attacher le stream à la vidéo
      video.srcObject = stream;
      
      // Jouer la vidéo quand elle est prête
      video.onloadedmetadata = () => {
        video.play().catch((err) => {
          console.error('Error playing video:', err);
        });
      };
    }

    // Cleanup
    return () => {
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    };
  }, [stream, videoRef]);

  return (
    <video
      ref={videoRef}
      autoPlay
      playsInline
      muted
      className={`w-full h-full object-cover ${className}`}
    />
  );
};

export default CameraStream;