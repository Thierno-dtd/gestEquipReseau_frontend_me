import { get, post, del } from './client';
import { 
  ModificationProposal,
  CreateModificationPayload,
  ModificationStats,
  ModificationFilters
} from '@models/modifications';
import { PaginatedResponse } from '@models/api';

// Endpoints modifications
export const modificationsAPI = {
  // Lister les modifications
  getModifications: (filters?: ModificationFilters, params?: any): Promise<PaginatedResponse<ModificationProposal>> => {
    return get<PaginatedResponse<ModificationProposal>>('/modifications', { ...filters, ...params })
      .then((res) => res.data);
  },

  // Obtenir une modification par ID
  getModificationById: (id: string): Promise<ModificationProposal> => {
    return get<ModificationProposal>(`/modifications/${id}`).then((res) => res.data);
  },

  // Créer une proposition de modification
  createModification: (payload: CreateModificationPayload): Promise<ModificationProposal> => {
    return post<ModificationProposal>('/modifications', payload).then((res) => res.data);
  },

  // Valider (approuver) une modification
  approveModification: (id: string, comment?: string): Promise<ModificationProposal> => {
    return post<ModificationProposal>(`/modifications/${id}/approve`, { comment })
      .then((res) => res.data);
  },

  // Rejeter une modification
  rejectModification: (id: string, comment?: string): Promise<ModificationProposal> => {
    return post<ModificationProposal>(`/modifications/${id}/reject`, { comment })
      .then((res) => res.data);
  },

  // Annuler une modification
  cancelModification: (id: string): Promise<ModificationProposal> => {
    return del<ModificationProposal>(`/modifications/${id}`).then((res) => res.data);
  },

  // Obtenir les statistiques
  getStats: (filters?: ModificationFilters): Promise<ModificationStats> => {
    return get<ModificationStats>('/modifications/stats', filters).then((res) => res.data);
  },

  // Obtenir l'historique d'une modification
  getHistory: (id: string): Promise<any[]> => {
    return get<any[]>(`/modifications/${id}/history`).then((res) => res.data);
  },

  // Modifications en attente de validation
  getPendingModifications: (params?: any): Promise<PaginatedResponse<ModificationProposal>> => {
    return get<PaginatedResponse<ModificationProposal>>('/modifications/pending', params)
      .then((res) => res.data);
  },

  // Mes modifications
  getMyModifications: (params?: any): Promise<PaginatedResponse<ModificationProposal>> => {
    return get<PaginatedResponse<ModificationProposal>>('/modifications/my', params)
      .then((res) => res.data);
  },
};