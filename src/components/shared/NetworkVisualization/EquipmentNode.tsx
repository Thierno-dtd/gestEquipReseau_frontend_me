import { memo } from 'react';
import { Handle, Position, NodeProps, Node } from '@xyflow/react';
import { Equipment, Port } from '@models/infrastructure';
import { Server, Wifi, WifiOff, AlertCircle } from 'lucide-react';
import { getNetworkColor, getStatusColor } from '@utils/colors';

// ✅ Étendre Equipment pour inclure les ports
export interface EquipmentWithPorts extends Equipment {
  ports?: Port[];
}

// ✅ Interface qui représente les données du node
interface EquipmentNodeData extends Record<string, unknown> {
  equipment: EquipmentWithPorts;
  onPortClick?: (portId: string) => void;
}

// ✅ Type complet du node (pas juste NodeProps)
export type EquipmentNodeType = Node<EquipmentNodeData>;

// ✅ Utiliser le type 'data' directement avec assertion ou extraction
const EquipmentNode = memo(({ data }: NodeProps<EquipmentNodeData>) => {
  // ✅ TypeScript comprend maintenant que data est de type EquipmentNodeData
  const { equipment, onPortClick } = data as EquipmentNodeData;
  const networkColor = getNetworkColor(equipment.networkType);
  const statusColor = getStatusColor(equipment.status);

  return (
    <div 
      className="relative bg-white dark:bg-gray-800 rounded-lg shadow-lg border-2 transition-all hover:shadow-xl"
      style={{ 
        borderColor: networkColor.primary,
        minWidth: 220,
        maxWidth: 280
      }}
    >
      {/* Handle - Top */}
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3"
        style={{ background: networkColor.primary }}
      />

      {/* Header */}
      <div 
        className="px-3 py-2 rounded-t-lg flex items-center justify-between"
        style={{ backgroundColor: networkColor.bg }}
      >
        <div className="flex items-center gap-2">
          <Server className="w-4 h-4" style={{ color: networkColor.primary }} />
          <span 
            className="text-xs font-bold uppercase"
            style={{ color: networkColor.text }}
          >
            {equipment.networkType}
          </span>
        </div>

        {/* Status Indicator */}
        <div className="flex items-center gap-1">
          {equipment.status === 'ONLINE' ? (
            <Wifi className="w-4 h-4 text-green-500" />
          ) : equipment.status === 'OFFLINE' ? (
            <WifiOff className="w-4 h-4 text-red-500" />
          ) : (
            <AlertCircle className="w-4 h-4 text-yellow-500" />
          )}
          <div 
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: statusColor.bg }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="p-3 space-y-2">
        {/* Equipment Name */}
        <h3 className="font-semibold text-gray-900 dark:text-white text-sm truncate">
          {equipment.name}
        </h3>

        {/* Equipment Info */}
        <div className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
          <div className="flex justify-between">
            <span>Type:</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {equipment.type}
            </span>
          </div>

          {equipment.manufacturer && (
            <div className="flex justify-between">
              <span>Fabricant:</span>
              <span className="font-medium text-gray-900 dark:text-white truncate ml-2">
                {equipment.manufacturer}
              </span>
            </div>
          )}

          {equipment.ipAddress && (
            <div className="flex justify-between">
              <span>IP:</span>
              <span className="font-mono text-gray-900 dark:text-white">
                {equipment.ipAddress}
              </span>
            </div>
          )}

          <div className="flex justify-between pt-1 border-t border-gray-200 dark:border-gray-700">
            <span>Position:</span>
            <span className="font-medium text-gray-900 dark:text-white">
              U{equipment.position}
            </span>
          </div>

          <div className="flex justify-between">
            <span>Hauteur:</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {equipment.height}U
            </span>
          </div>
        </div>

        {/* Ports - Vérifier que ports existe */}
        {equipment.ports && equipment.ports.length > 0 && (
          <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              Ports ({equipment.ports.length})
            </p>
            <div className="grid grid-cols-6 gap-1">
              {equipment.ports.slice(0, 12).map((port) => (
                <button
                  key={port.id}
                  onClick={() => onPortClick?.(port.id)}
                  className={`
                    w-6 h-6 rounded text-xs font-bold flex items-center justify-center
                    transition-all hover:scale-110
                    ${port.status === 'UP' 
                      ? 'bg-green-500 text-white' 
                      : port.status === 'DOWN'
                      ? 'bg-red-500 text-white'
                      : 'bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
                    }
                    ${port.connectedTo ? 'ring-2 ring-blue-400' : ''}
                  `}
                  title={`Port ${port.number} - ${port.status}`}
                >
                  {port.number}
                </button>
              ))}
              {equipment.ports.length > 12 && (
                <div className="col-span-6 text-center text-xs text-gray-500 dark:text-gray-400 mt-1">
                  +{equipment.ports.length - 12} ports
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Handle - Bottom */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3"
        style={{ background: networkColor.primary }}
      />
    </div>
  );
});

EquipmentNode.displayName = 'EquipmentNode';

export default EquipmentNode;