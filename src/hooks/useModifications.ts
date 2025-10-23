import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { modificationsAPI } from '@/services/api/modifications';
import { ModificationProposal, ModificationStatus } from '@/models/modifications';
import { toast } from 'sonner';
import { useNetworkStatus } from './useNetworkStatus';
import { offlineQueue } from '@/services/sync/offlineQueue';

export const useModifications = () => {
  const queryClient = useQueryClient();
  const { isOnline } = useNetworkStatus();

  // Get all modifications
  const { data: modifications, isLoading } = useQuery({
    queryKey: ['modifications'],
    queryFn: () => modificationsAPI.getModifications(),
  });

  // Get pending modifications
  const { data: pendingModifications } = useQuery({
    queryKey: ['modifications', 'pending'],
    queryFn: () => modificationsAPI.getPendingModifications(),
  });

  // Create modification
  const createMutation = useMutation({
    mutationFn: (data: Omit<ModificationProposal, 'id' | 'status' | 'createdAt'>) => {
      if (!isOnline) {
        return offlineQueue.addModification(data);
      }
      return modificationsAPI.createModification(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['modifications'] });
      toast.success(
        isOnline
          ? 'Modification proposée avec succès'
          : 'Modification enregistrée (sera synchronisée)'
      );
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erreur lors de la création');
    },
  });

  // Approve modification
  const approveMutation = useMutation({
    mutationFn: ({ id, comment }: { id: string; comment?: string }) =>
        modificationsAPI.approveModification(id, comment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['modifications'] });
      toast.success('Modification approuvée');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erreur lors de l\'approbation');
    },
  });

  // Reject modification
  const rejectMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
        modificationsAPI.rejectModification(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['modifications'] });
      toast.success('Modification rejetée');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erreur lors du rejet');
    },
  });

  return {
    modifications,
    pendingModifications,
    isLoading,
    createModification: createMutation.mutate,
    approveModification: approveMutation.mutate,
    rejectModification: rejectMutation.mutate,
    isCreating: createMutation.isPending,
    isApproving: approveMutation.isPending,
    isRejecting: rejectMutation.isPending,
  };
};

// Hook pour une modification spécifique
export const useModification = (id: string) => {
  return useQuery({
    queryKey: ['modification', id],
    queryFn: () => modificationsAPI.getModificationById(id),
    enabled: !!id,
  });
};

// Hook pour l'historique des modifications
export const useModificationHistory = (filters?: {
  status?: ModificationStatus;
  userId?: string;
  startDate?: Date;
  endDate?: Date;
}) => {
    return useQuery({
        queryKey: ['modifications', 'history', filters],
        queryFn: () => {
          if (!filters?.userId) {
            throw new Error("userId is required to fetch modification history");
          }
          return modificationsAPI.getHistory(filters.userId);
        },
        enabled: !!filters?.userId, // ✅ évite que la requête s’exécute sans userId
      });
};