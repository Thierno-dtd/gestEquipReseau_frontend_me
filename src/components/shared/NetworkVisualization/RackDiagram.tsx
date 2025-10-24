import { useCallback, useState } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Node,
  Edge,
  Connection,
  addEdge,
  useNodesState,
  useEdgesState,
  ConnectionMode,
  NodeTypes,
  EdgeTypes,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { RackDetail, Equipment, Port, Connection as EquipmentConnection } from '@models/infrastructure';
import EquipmentNode, { EquipmentWithPorts } from './EquipmentNode';
import ConnectionEdge, { ConnectionEdgeData } from './ConnectionEdge';
import ITOTLegend from './ITOTLegend';
import PortDetailPanel from './PortDetailPanel';
import { NETWORK_COLORS } from '@utils/colors';

interface RackDiagramProps {
  rack: RackDetail;
  onNodeClick?: (equipment: Equipment) => void;
  onConnectionCreate?: (connection: Partial<EquipmentConnection>) => void;
  editable?: boolean;
}

const nodeTypes: NodeTypes = {
  equipment: EquipmentNode,
};

const edgeTypes: EdgeTypes = {
  connection: ConnectionEdge,
};

const RackDiagram = ({ 
  rack, 
  onNodeClick, 
  onConnectionCreate,
  editable = false 
}: RackDiagramProps) => {
  const [selectedPort, setSelectedPort] = useState<string | null>(null);

  // Générer les nodes depuis les équipements
  const generateNodes = useCallback((): Node[] => {
    return rack.equipments.map((equipment, index) => {
      const yPosition = (rack.height - equipment.position) * 50;
      const xPosition = 100 + (index % 3) * 300;

      // ✅ Créer un équipement avec ports
      const equipmentWithPorts: EquipmentWithPorts = {
        ...equipment,
        ports: equipment.ports || [], // S'assurer que ports existe
      };

      return {
        id: equipment.id,
        type: 'equipment',
        position: { x: xPosition, y: yPosition },
        data: {
          equipment: equipmentWithPorts,
          onPortClick: (portId: string) => setSelectedPort(portId),
        },
        draggable: editable,
      };
    });
  }, [rack, editable]);

  // Générer les edges depuis les connexions
  const generateEdges = useCallback((): Edge<ConnectionEdgeData>[] => {
    const edges: Edge<ConnectionEdgeData>[] = [];
    
    rack.equipments.forEach(equipment => {
      equipment.ports?.forEach(port => {
        if (port.connectedTo) {
          const targetEquipment = rack.equipments.find(e => 
            e.ports?.some(p => p.id === port.connectedTo)
          );

          if (targetEquipment) {
            edges.push({
              id: `${port.id}-${port.connectedTo}`,
              source: equipment.id,
              target: targetEquipment.id,
              type: 'connection',
              data: {
                id: `${port.id}-${port.connectedTo}`,
                source: equipment.id,
                target: targetEquipment.id,
                sourcePort: {
                  id: port.id,
                  number: port.number,
                  status: port.status,
                  type: port.type,
                  vlan: port.vlan,
                },
                label: port.vlan || '',
              },
              animated: port.status === 'UP',
            });
          }
        }
      });
    });

    return edges;
  }, [rack]);

  const [nodes, setNodes, onNodesChange] = useNodesState(generateNodes());
  const [edges, setEdges, onEdgesChange] = useEdgesState(generateEdges());

  // Gérer la création de connexion
  const onConnect = useCallback(
    (params: Connection) => {
      if (!editable) return;

      const newEdge: Edge = {
        id: `${params.source}-${params.target}`,
        source: params.source!,
        target: params.target!,
        type: 'connection',
      };

      setEdges((eds) => addEdge(newEdge, eds));

      if (onConnectionCreate) {
        onConnectionCreate({
          sourcePortId: params.source!,
          targetPortId: params.target!,
        });
      }
    },
    [editable, setEdges, onConnectionCreate]
  );

  // Gérer le clic sur un node
  const handleNodeClick = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      const equipment = rack.equipments.find(e => e.id === node.id);
      if (equipment && onNodeClick) {
        onNodeClick(equipment);
      }
    },
    [rack, onNodeClick]
  );

  return (
    <div className="relative w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={handleNodeClick}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        connectionMode={ConnectionMode.Loose}
        fitView
        minZoom={0.1}
        maxZoom={2}
        defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
        className="bg-gray-50 dark:bg-gray-900"
      >
        <Background 
          gap={20} 
          size={1}
          color="#e5e7eb"
        />
        <Controls 
          showInteractive={editable}
          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg"
        />
        <MiniMap
          nodeColor={(node) => {
            const equipment = rack.equipments.find(e => e.id === node.id);
            return equipment?.networkType === 'IT' 
              ? NETWORK_COLORS.IT.primary 
              : NETWORK_COLORS.OT.primary;
          }}
          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg"
        />
      </ReactFlow>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-10">
        <ITOTLegend />
      </div>

      {/* Port Detail Panel */}
      {selectedPort && (
        <div className="absolute right-4 top-4 z-10">
          <PortDetailPanel
            portId={selectedPort}
            onClose={() => setSelectedPort(null)}
          />
        </div>
      )}

      {/* Rack Info */}
      <div className="absolute top-4 left-4 z-10 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-3">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
          {rack.name}
        </h3>
        <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
          <span>{rack.usedHeight}U / {rack.height}U</span>
          <span>•</span>
          <span>{rack.equipments.length} équipements</span>
        </div>
      </div>
    </div>
  );
};

export default RackDiagram;