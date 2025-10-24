import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { infrastructureAPI } from '@services/api/infrastructure';
import { Equipment } from '@models/infrastructure';
import RackDiagram from './RackDiagram';
import Loading from '@components/shared/Common/Loading';
import { 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Download,
  Settings,
  Eye,
  EyeOff
} from 'lucide-react';

interface NetworkVisualizationContainerProps {
  rackId: string;
  onEquipmentClick?: (equipment: Equipment) => void;
  editable?: boolean;
}

const NetworkVisualizationContainer = ({
  rackId,
  onEquipmentClick,
  editable = false,
}: NetworkVisualizationContainerProps) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showLabels, setShowLabels] = useState(true);
  const [showMinimap, setShowMinimap] = useState(true);

  // Récupérer les données du rack
  const { data: rack, isLoading, error } = useQuery({
    queryKey: ['rack', rackId],
    queryFn: () => infrastructureAPI.getRackById(rackId),
    enabled: !!rackId,
  });

  const toggleFullscreen = () => {
    const element = document.getElementById('network-viz-container');
    
    if (!document.fullscreenElement) {
      element?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleExport = () => {
    // TODO: Implémenter l'export SVG/PNG
    console.log('Export diagram');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[600px] bg-gray-50 dark:bg-gray-900 rounded-lg">
        <Loading text="Chargement du diagramme réseau..." />
      </div>
    );
  }

  if (error || !rack) {
    return (
      <div className="flex items-center justify-center h-[600px] bg-gray-50 dark:bg-gray-900 rounded-lg">
        <div className="text-center">
          <p className="text-red-500 mb-2">Erreur lors du chargement</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Impossible de charger le diagramme réseau
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-gray-900 dark:text-white">
            Diagramme réseau - {rack.name}
          </h3>
          <span className="px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded">
            {rack.equipments.length} équipements
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Toggle Labels */}
          <button
            onClick={() => setShowLabels(!showLabels)}
            className={`p-2 rounded-lg transition-colors ${
              showLabels 
                ? 'bg-primary text-white' 
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
            title={showLabels ? 'Masquer les labels' : 'Afficher les labels'}
          >
            {showLabels ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </button>

          {/* Toggle Minimap */}
          <button
            onClick={() => setShowMinimap(!showMinimap)}
            className="p-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
            title="Toggle minimap"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* Export */}
          <button
            onClick={handleExport}
            className="p-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
            title="Exporter"
          >
            <Download className="w-4 h-4" />
          </button>

          {/* Fullscreen */}
          <button
            onClick={toggleFullscreen}
            className="p-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
            title="Plein écran"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Diagram */}
      <div 
        id="network-viz-container"
        className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
        style={{ height: isFullscreen ? '100vh' : '600px' }}
      >
        <RackDiagram
          rack={rack}
          onNodeClick={onEquipmentClick}
          editable={editable}
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
            Équipements
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {rack.equipments.length}
          </p>
        </div>

        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
            Ports totaux
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {rack.equipments.reduce((sum, eq) => sum + (eq.ports?.length || 0), 0)}
          </p>
        </div>

        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
            Ports connectés
          </p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
            {rack.equipments.reduce(
              (sum, eq) => sum + (eq.ports?.filter(p => p.connectedTo).length || 0),
              0
            )}
          </p>
        </div>

        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
            Occupation
          </p>
          <p className="text-2xl font-bold text-primary">
            {((rack.usedHeight / rack.height) * 100).toFixed(0)}%
          </p>
        </div>
      </div>

      {/* Info */}
      <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg border border-blue-200 dark:border-blue-800">
        <p className="text-sm text-blue-900 dark:text-blue-400">
          <strong>💡 Astuce:</strong> {editable 
            ? 'Cliquez sur un équipement pour voir les détails. Glissez pour connecter les ports.'
            : 'Cliquez sur un équipement pour voir les détails. Mode lecture seule.'
          }
        </p>
      </div>
    </div>
  );
};

export default NetworkVisualizationContainer;