import { useState } from 'react';
import { X, Download, FileText, Image } from 'lucide-react';
import { RackDetail, EquipmentDetail, Site, Zone } from '@models/infrastructure';
import { exportSiteToPDF, exportRackToPDF, exportEquipmentToPDF } from './PDFExporter';
import { exportRackToSVG, exportEquipmentToSVG } from './SVGExporter';
import { toast } from 'sonner';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: Site | Zone | RackDetail | EquipmentDetail;
  type: 'site' | 'zone' | 'rack' | 'equipment';
  zones?: Zone[];
}

type ExportFormat = 'PDF' | 'SVG';
type ExportOrientation = 'portrait' | 'landscape';

const ExportModal = ({ isOpen, onClose, data, type, zones = [] }: ExportModalProps) => {
  const [format, setFormat] = useState<ExportFormat>('PDF');
  const [orientation, setOrientation] = useState<ExportOrientation>('portrait');
  const [includeMetadata, setIncludeMetadata] = useState(true);
  const [includeTimestamp, setIncludeTimestamp] = useState(true);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isExporting, setIsExporting] = useState(false);

  if (!isOpen) return null;

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const filename = `${type}-${(data as any).name || 'export'}-${Date.now()}`;

      if (format === 'PDF') {
        const options = {
          includeMetadata,
          includeTimestamp,
          pageOrientation: orientation,
        };

        switch (type) {
          case 'site':
            exportSiteToPDF(data as Site, zones, `${filename}.pdf`, options);
            break;
          case 'rack':
            exportRackToPDF(data as RackDetail, `${filename}.pdf`, options);
            break;
          case 'equipment':
            exportEquipmentToPDF(data as EquipmentDetail, `${filename}.pdf`, options);
            break;
          default:
            toast.error('Type non supporté pour l’export PDF');
        }
      } else if (format === 'SVG') {
        const options = {
          includeMetadata,
          theme,
        };

        switch (type) {
          case 'rack':
            exportRackToSVG(data as RackDetail, `${filename}.svg`, options);
            break;
          case 'equipment':
            exportEquipmentToSVG(data as EquipmentDetail, `${filename}.svg`, options);
            break;
          default:
            toast.error('Type non supporté pour l’export SVG');
        }
      }

      toast.success('Export réussi 🎉');
      onClose();
    } catch (error) {
      console.error('Export error:', error);
      toast.error("Erreur lors de l'export");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-lg w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Download className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Exporter {type === 'site' ? 'le site' : type === 'zone' ? 'la zone' : type === 'rack' ? 'la baie' : "l'équipement"}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {(data as any).name}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Format */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Format d'export
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setFormat('PDF')}
                className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all ${
                  format === 'PDF'
                    ? 'border-primary bg-primary/5'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <FileText className={`w-6 h-6 ${format === 'PDF' ? 'text-primary' : 'text-gray-400'}`} />
                <div className="text-left">
                  <p className="font-medium text-gray-900 dark:text-white">PDF</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Document portable</p>
                </div>
              </button>

              <button
                onClick={() => setFormat('SVG')}
                disabled={type === 'site' || type === 'zone'}
                className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all ${
                  format === 'SVG'
                    ? 'border-primary bg-primary/5'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                } ${(type === 'site' || type === 'zone') ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <Image className={`w-6 h-6 ${format === 'SVG' ? 'text-primary' : 'text-gray-400'}`} />
                <div className="text-left">
                  <p className="font-medium text-gray-900 dark:text-white">SVG</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Image vectorielle</p>
                </div>
              </button>
            </div>
          </div>

          {/* Orientation (PDF only) */}
          {format === 'PDF' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Orientation
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setOrientation('portrait')}
                  className={`p-3 rounded-lg border-2 text-center transition-all ${
                    orientation === 'portrait'
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400'
                  }`}
                >
                  <div className="w-6 h-8 mx-auto mb-1 border-2 border-current rounded" />
                  <p className="text-sm font-medium">Portrait</p>
                </button>

                <button
                  onClick={() => setOrientation('landscape')}
                  className={`p-3 rounded-lg border-2 text-center transition-all ${
                    orientation === 'landscape'
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400'
                  }`}
                >
                  <div className="w-8 h-6 mx-auto mb-1 border-2 border-current rounded" />
                  <p className="text-sm font-medium">Paysage</p>
                </button>
              </div>
            </div>
          )}

          {/* Thème (SVG only) */}
          {format === 'SVG' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Thème
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setTheme('light')}
                  className={`p-3 rounded-lg border-2 text-center transition-all ${
                    theme === 'light'
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <div className="w-full h-12 mb-2 rounded bg-white border-2 border-gray-300" />
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Clair</p>
                </button>

                <button
                  onClick={() => setTheme('dark')}
                  className={`p-3 rounded-lg border-2 text-center transition-all ${
                    theme === 'dark'
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <div className="w-full h-12 mb-2 rounded bg-gray-800 border-2 border-gray-600" />
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Sombre</p>
                </button>
              </div>
            </div>
          )}

          {/* Options */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Options
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={includeMetadata}
                  onChange={(e) => setIncludeMetadata(e.target.checked)}
                  className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary focus:ring-2"
                />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Inclure les métadonnées
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Ajouter les informations du document
                  </p>
                </div>
              </label>

              {format === 'PDF' && (
                <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={includeTimestamp}
                    onChange={(e) => setIncludeTimestamp(e.target.checked)}
                    className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary focus:ring-2"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Inclure l'horodatage
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Date et heure d'export
                    </p>
                  </div>
                </label>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            disabled={isExporting}
            className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Annuler
          </button>

          <button
            onClick={handleExport}
            disabled={isExporting}
            className="flex-1 px-4 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Download className="w-5 h-5" />
            {isExporting ? 'Export en cours...' : 'Exporter'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportModal;
