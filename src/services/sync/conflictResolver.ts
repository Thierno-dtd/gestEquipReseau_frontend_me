// Résolution de conflits lors de la synchronisation
import { ModificationProposal, ModificationType } from '@models/modifications';

export enum ConflictResolutionStrategy {
  SERVER_WINS = 'SERVER_WINS',
  CLIENT_WINS = 'CLIENT_WINS',
  LATEST_WINS = 'LATEST_WINS',
  MANUAL = 'MANUAL',
}

export interface Conflict {
  id: string;
  localChange: ModificationProposal;
  serverChange: ModificationProposal;
  type: 'edit_conflict' | 'delete_conflict' | 'version_conflict';
  timestamp: string;
}

export interface ConflictResolution {
  resolved: boolean;
  action: 'keep_local' | 'keep_server' | 'merge' | 'manual';
  mergedData?: any;
}

class ConflictResolver {
  private conflicts: Map<string, Conflict> = new Map();

  // Détecter les conflits
  detectConflict(
    localChange: ModificationProposal,
    serverChange: ModificationProposal
  ): Conflict | null {
    if (localChange.entityId !== serverChange.entityId) {
      return null;
    }

    const localTime = new Date(localChange.createdAt).getTime();
    const serverTime = new Date(serverChange.createdAt).getTime();

    if (Math.abs(localTime - serverTime) < 1000) {
      const conflict: Conflict = {
        id: `${localChange.id}_${serverChange.id}`,
        localChange,
        serverChange,
        type: this.determineConflictType(localChange, serverChange),
        timestamp: new Date().toISOString(),
      };

      this.conflicts.set(conflict.id, conflict);
      return conflict;
    }

    return null;
  }

  private determineConflictType(
    local: ModificationProposal,
    server: ModificationProposal
  ): Conflict['type'] {
    if (local.type === ModificationType.DELETE || server.type === ModificationType.DELETE) {
      return 'delete_conflict';
    }

    if (local.type === ModificationType.UPDATE && server.type === ModificationType.UPDATE) {
      return 'edit_conflict';
    }

    return 'version_conflict';
  }

  autoResolve(conflict: Conflict): ConflictResolution {
    switch (conflict.type) {
      case 'delete_conflict':
        return {
          resolved: true,
          action: 'keep_server',
        };

      case 'version_conflict':
        const localTime = new Date(conflict.localChange.createdAt).getTime();
        const serverTime = new Date(conflict.serverChange.createdAt).getTime();
        
        return {
          resolved: true,
          action: serverTime > localTime ? 'keep_server' : 'keep_local',
        };

      case 'edit_conflict':
        const merged = this.attemptMerge(conflict.localChange, conflict.serverChange);
        
        if (merged) {
          return {
            resolved: true,
            action: 'merge',
            mergedData: merged,
          };
        }
        
        return {
          resolved: false,
          action: 'manual',
        };

      default:
        return {
          resolved: false,
          action: 'manual',
        };
    }
  }

  private attemptMerge(
    local: ModificationProposal,
    server: ModificationProposal
  ): any | null {
    try {
      const localData = local.newData || {};
      const serverData = server.newData || {};
      const merged: any = { ...serverData };

      for (const key in localData) {
        if (!(key in serverData)) {
          merged[key] = localData[key];
        } else if (localData[key] === serverData[key]) {
          merged[key] = localData[key];
        } else {
          return null;
        }
      }

      return merged;
    } catch (error) {
      console.error('Merge failed:', error);
      return null;
    }
  }

  manualResolve(
    conflictId: string,
    action: 'keep_local' | 'keep_server' | 'custom',
    customData?: any
  ): ConflictResolution {
    const conflict = this.conflicts.get(conflictId);
    if (!conflict) {
      throw new Error('Conflict not found');
    }

    const resolution: ConflictResolution = {
      resolved: true,
      action: action === 'custom' ? 'merge' : action,
      mergedData: customData,
    };

    this.conflicts.delete(conflictId);
    return resolution;
  }

  getPendingConflicts(): Conflict[] {
    return Array.from(this.conflicts.values());
  }

  clearConflict(conflictId: string): void {
    this.conflicts.delete(conflictId);
  }

  clearAllConflicts(): void {
    this.conflicts.clear();
  }

  getConflictCount(): number {
    return this.conflicts.size;
  }
}

export const conflictResolver = new ConflictResolver();