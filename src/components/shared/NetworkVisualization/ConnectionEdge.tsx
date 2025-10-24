import { memo } from 'react';
import { 
  BaseEdge, 
  EdgeProps, 
  getSmoothStepPath,
  EdgeLabelRenderer 
} from '@xyflow/react';

interface ConnectionEdgeData {
  sourcePort?: {
    id: string;
    number: number;
    status: string;
    type: string;
    vlan?: string;
  };
  label?: string;
}

const ConnectionEdge = memo(({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  data,
  markerEnd,
}: EdgeProps<ConnectionEdgeData>) => {
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const isActive = data?.sourcePort?.status === 'UP';
  const portType = data?.sourcePort?.type || 'ETHERNET';

  // Couleur selon le type et statut
  const getEdgeColor = () => {
    if (!isActive) return '#9CA3AF'; // gray-400
    
    switch (portType) {
      case 'FIBER':
        return '#FCD34D'; // yellow-300
      case 'SFP':
      case 'QSFP':
        return '#60A5FA'; // blue-400
      default:
        return '#34D399'; // green-400
    }
  };

  const edgeColor = getEdgeColor();

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          ...style,
          stroke: edgeColor,
          strokeWidth: 2,
          strokeDasharray: isActive ? 'none' : '5,5',
        }}
      />

      {/* Label */}
      {data?.label && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
              pointerEvents: 'all',
            }}
            className="nodrag nopan"
          >
            <div className="px-2 py-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow-md text-xs font-medium text-gray-900 dark:text-white">
              {data.label}
            </div>
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
});

ConnectionEdge.displayName = 'ConnectionEdge';

export default ConnectionEdge;