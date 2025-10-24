import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

export interface TreeNode {
  id: string;
  label: string;
  type: 'site' | 'zone' | 'rack' | 'equipment';
  path: string;
  children?: TreeNode[];
  networkType?: 'IT' | 'OT';
  status?: 'active' | 'inactive' | 'warning' | 'error';
  metadata?: {
    equipmentCount?: number;
    activeCount?: number;
    warningCount?: number;
  };
}

interface NavigationTreeProps {
  data: TreeNode[];
  selectedId?: string;
  onSelect?: (node: TreeNode) => void;
  className?: string;
}

const NavigationTree = ({ 
  data, 
  selectedId, 
  onSelect,
  className = '' 
}: NavigationTreeProps) => {
  const navigate = useNavigate();
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

  const toggleNode = (nodeId: string) => {
    setExpandedNodes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId);
      } else {
        newSet.add(nodeId);
      }
      return newSet;
    });
  };

  const handleNodeClick = (node: TreeNode) => {
    if (node.children && node.children.length > 0) {
      toggleNode(node.id);
    }
    
    onSelect?.(node);
    navigate(node.path);
  };

  const getNodeIcon = (type: string, networkType?: string) => {
    switch (type) {
      case 'site':
        return 'business';
      case 'zone':
        return 'apartment';
      case 'rack':
        return 'dns';
      case 'equipment':
        return networkType === 'OT' ? 'memory' : 'router';
      default:
        return 'folder';
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'active':
        return 'bg-status-green';
      case 'warning':
        return 'bg-status-orange';
      case 'error':
        return 'bg-status-red';
      case 'inactive':
        return 'bg-gray-400';
      default:
        return 'bg-gray-400';
    }
  };

  const getNetworkTypeColor = (networkType?: string) => {
    return networkType === 'IT' ? 'bg-it-blue' : 'bg-ot-orange';
  };

  const renderNode = (node: TreeNode, level: number = 0) => {
    const isExpanded = expandedNodes.has(node.id);
    const isSelected = selectedId === node.id;
    const hasChildren = node.children && node.children.length > 0;

    return (
      <div key={node.id} className="select-none">
        {/* Node item */}
        <div
          className={`
            flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors
            ${isSelected 
              ? 'bg-primary/10 dark:bg-primary/20' 
              : 'hover:bg-gray-100 dark:hover:bg-gray-800'
            }
          `}
          style={{ paddingLeft: `${level * 1.5 + 0.75}rem` }}
          onClick={() => handleNodeClick(node)}
        >
          {/* Expand/Collapse icon */}
          {hasChildren && (
            <span 
              className={`
                material-symbols-outlined text-lg text-gray-500 dark:text-gray-400 transition-transform
                ${isExpanded ? 'rotate-90' : ''}
              `}
            >
              chevron_right
            </span>
          )}
          {!hasChildren && <div className="w-5" />}

          {/* Node icon */}
          <div 
            className={`
              flex items-center justify-center w-10 h-10 rounded-lg shrink-0
              ${node.networkType 
                ? getNetworkTypeColor(node.networkType) 
                : 'bg-gray-500'
              }
            `}
          >
            <span className="material-symbols-outlined text-white text-xl">
              {getNodeIcon(node.type, node.networkType)}
            </span>
          </div>

          {/* Node content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className={`
                text-sm font-medium truncate
                ${isSelected 
                  ? 'text-primary dark:text-primary' 
                  : 'text-gray-900 dark:text-white'
                }
              `}>
                {node.label}
              </p>
              
              {/* Network type badge */}
              {node.networkType && (
                <span className={`
                  text-xs px-2 py-0.5 rounded-full font-medium
                  ${node.networkType === 'IT' 
                    ? 'bg-it-blue/20 text-it-blue' 
                    : 'bg-ot-orange/20 text-ot-orange'
                  }
                `}>
                  {node.networkType}
                </span>
              )}
            </div>

            {/* Metadata */}
            {node.metadata && (
              <div className="flex items-center gap-2 mt-1">
                {node.metadata.equipmentCount !== undefined && (
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {node.metadata.equipmentCount} équipement(s)
                  </span>
                )}
                {node.metadata.warningCount !== undefined && node.metadata.warningCount > 0 && (
                  <span className="text-xs text-status-orange">
                    {node.metadata.warningCount} alerte(s)
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Status indicator */}
          {node.status && (
            <div className={`w-2 h-2 rounded-full shrink-0 ${getStatusColor(node.status)}`} />
          )}
        </div>

        {/* Children */}
        {hasChildren && isExpanded && (
          <div className="mt-1">
            {node.children!.map(child => renderNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`space-y-1 ${className}`}>
      {data.map(node => renderNode(node))}
    </div>
  );
};

export default NavigationTree;