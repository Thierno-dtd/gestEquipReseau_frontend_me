import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface PendingChange {
  id: string;
  type: 'CREATE' | 'UPDATE' | 'DELETE';
  entity: string;
  data: any;
  timestamp: string;
  retryCount: number;
}

interface SyncStore {
  // État de connexion
  isOnline: boolean;
  setOnline: (isOnline: boolean) => void;

  // Synchronisation
  isSyncing: boolean;
  lastSync: string | null;
  syncError: string | null;
  setSyncing: (isSyncing: boolean) => void;
  setLastSync: (timestamp: string) => void;
  setSyncError: (error: string | null) => void;

  // Queue de modifications en attente
  pendingChanges: PendingChange[];
  addPendingChange: (change: Omit<PendingChange, 'id' | 'timestamp' | 'retryCount'>) => void;
  removePendingChange: (id: string) => void;
  clearPendingChanges: () => void;
  incrementRetryCount: (id: string) => void;

  // Getters
  getPendingChangesCount: () => number;
  hasPendingChanges: () => boolean;
}

export const useSyncStore = create<SyncStore>()(
  persist(
    (set, get) => ({
      // Initial state
      isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
      isSyncing: false,
      lastSync: null,
      syncError: null,
      pendingChanges: [],

      // Actions
      setOnline: (isOnline) => set({ isOnline }),
      
      setSyncing: (isSyncing) => set({ isSyncing }),
      
      setLastSync: (timestamp) => set({ lastSync: timestamp, syncError: null }),
      
      setSyncError: (error) => set({ syncError: error }),

      addPendingChange: (change) => {
        const newChange: PendingChange = {
          ...change,
          id: `pending_${Date.now()}_${Math.random()}`,
          timestamp: new Date().toISOString(),
          retryCount: 0,
        };
        set((state) => ({
          pendingChanges: [...state.pendingChanges, newChange],
        }));
      },

      removePendingChange: (id) => set((state) => ({
        pendingChanges: state.pendingChanges.filter((c) => c.id !== id),
      })),

      clearPendingChanges: () => set({ pendingChanges: [] }),

      incrementRetryCount: (id) => set((state) => ({
        pendingChanges: state.pendingChanges.map((c) =>
          c.id === id ? { ...c, retryCount: c.retryCount + 1 } : c
        ),
      })),

      getPendingChangesCount: () => get().pendingChanges.length,
      
      hasPendingChanges: () => get().pendingChanges.length > 0,
    }),
    {
      name: 'inframap-sync',
      partialize: (state) => ({
        lastSync: state.lastSync,
        pendingChanges: state.pendingChanges,
      }),
    }
  )
);