// Statut de modification
export enum ModificationStatus {
    PROPOSED = 'PROPOSED', // Proposée
    PENDING = 'PENDING', // En attente de validation
    APPROVED = 'APPROVED', // Approuvée
    REJECTED = 'REJECTED', // Rejetée
    APPLIED = 'APPLIED', // Appliquée
    CANCELLED = 'CANCELLED', // Annulée
  }
  
  // Type de modification
  export enum ModificationType {
    CREATE = 'CREATE',
    UPDATE = 'UPDATE',
    DELETE = 'DELETE',
    CONNECT = 'CONNECT', // Connexion de ports
    DISCONNECT = 'DISCONNECT', // Déconnexion de ports
  }
  
  // Entité modifiée
  export enum ModificationEntity {
    SITE = 'SITE',
    ZONE = 'ZONE',
    RACK = 'RACK',
    EQUIPMENT = 'EQUIPMENT',
    PORT = 'PORT',
    CONNECTION = 'CONNECTION',
  }
  
  // Proposition de modification
  export interface ModificationProposal {
    id: string;
    type: ModificationType;
    entity: ModificationEntity;
    entityId?: string; // ID de l'entité modifiée (null pour CREATE)
    status: ModificationStatus;
    
    // Données
    oldData?: Record<string, any>; // Données avant modification
    newData: Record<string, any>; // Données après modification
    
    // Métadonnées
    proposedBy: string; // User ID
    proposedByName: string;
    proposedByCompany?: string;
    proposedAt: string;
    justification: string; // Raison de la modification
    
    // Validation
    validatedBy?: string; // User ID du validateur
    validatedByName?: string;
    validatedAt?: string;
    validationComment?: string;
    
    // Références
    siteId?: string;
    zonId?: string;
    rackId?: string;
    
    createdAt: string;
    updatedAt: string;
  }
  
  // Historique des modifications
  export interface ModificationHistory {
    id: string;
    proposalId: string;
    action: string; // 'CREATED', 'APPROVED', 'REJECTED', 'APPLIED', etc.
    performedBy: string;
    performedByName: string;
    performedAt: string;
    comment?: string;
    metadata?: Record<string, any>;
  }
  
  // Requête de validation
  export interface ValidationRequest {
    proposalId: string;
    action: 'APPROVE' | 'REJECT';
    comment?: string;
  }
  
  // Statistiques des modifications
  export interface ModificationStats {
    total: number;
    proposed: number;
    pending: number;
    approved: number;
    rejected: number;
    applied: number;
    byType: Record<ModificationType, number>;
    byEntity: Record<ModificationEntity, number>;
    byUser: Record<string, number>;
  }
  
  // Filtre de modifications
  export interface ModificationFilters {
    status?: ModificationStatus[];
    type?: ModificationType[];
    entity?: ModificationEntity[];
    proposedBy?: string[];
    siteId?: string;
    zoneId?: string;
    rackId?: string;
    dateFrom?: string;
    dateTo?: string;
    search?: string;
  }
  
  // Payload pour créer une modification
  export interface CreateModificationPayload {
    type: ModificationType;
    entity: ModificationEntity;
    entityId?: string;
    newData: Record<string, any>;
    justification: string;
    siteId?: string;
    zoneId?: string;
    rackId?: string;
  }