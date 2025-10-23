import { useState, useCallback } from 'react';
import jsQR from 'jsqr';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface QRScanResult {
  data: string;
  type: 'rack' | 'equipment' | 'port' | 'unknown';
  id?: string;
}

export const useQRScan = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<QRScanResult | null>(null);
  const navigate = useNavigate();

  const parseQRCode = (data: string): QRScanResult => {
    try {
      // Format attendu: TYPE:ID (ex: RACK:123, EQUIPMENT:456, PORT:789)
      const [type, id] = data.split(':');
      
      if (type && id) {
        const normalizedType = type.toLowerCase();
        if (['rack', 'equipment', 'port'].includes(normalizedType)) {
          return {
            data,
            type: normalizedType as 'rack' | 'equipment' | 'port',
            id,
          };
        }
      }
      
      return { data, type: 'unknown' };
    } catch (error) {
      return { data, type: 'unknown' };
    }
  };

  const scanFromCanvas = useCallback((
    canvas: HTMLCanvasElement,
    video: HTMLVideoElement
  ): QRScanResult | null => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const code = jsQR(imageData.data, imageData.width, imageData.height);

    if (code) {
      return parseQRCode(code.data);
    }

    return null;
  }, []);

  const handleScanResult = useCallback((scanResult: QRScanResult) => {
    setResult(scanResult);
    setIsScanning(false);

    if (scanResult.type === 'unknown') {
      toast.error('QR Code non reconnu');
      return;
    }

    toast.success(`${scanResult.type.toUpperCase()} scanné avec succès`);

    // Navigation selon le type
    switch (scanResult.type) {
      case 'rack':
        navigate(`/rack/${scanResult.id}`);
        break;
      case 'equipment':
        navigate(`/equipment/${scanResult.id}`);
        break;
      case 'port':
        navigate(`/port/${scanResult.id}`);
        break;
    }
  }, [navigate]);

  const startScanning = () => {
    setIsScanning(true);
    setResult(null);
  };

  const stopScanning = () => {
    setIsScanning(false);
  };

  const resetScan = () => {
    setResult(null);
    setIsScanning(false);
  };

  return {
    isScanning,
    result,
    scanFromCanvas,
    handleScanResult,
    startScanning,
    stopScanning,
    resetScan,
    parseQRCode,
  };
};