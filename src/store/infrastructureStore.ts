import { create } from 'zustand';
import { Site, Zone, Rack, Equipment } from '@/models/infrastructure';

interface InfrastructureStore {
  // Current navigation state
  currentSite: Site | null;
  currentZone: Zone | null;
  currentRack: Rack | null;
  currentEquipment: Equipment | null;

  // Cache des données
  sites: Site[];
  zones: Zone[];
  racks: Rack[];

  // Loading states
  isLoadingSites: boolean;
  isLoadingZones: boolean;
  isLoadingRacks: boolean;

  // Actions de navigation
  setCurrentSite: (site: Site | null) => void;
  setCurrentZone: (zone: Zone | null) => void;
  setCurrentRack: (rack: Rack | null) => void;
  setCurrentEquipment: (equipment: Equipment | null) => void;
  
  // Navigation avec reset automatique
  navigateToSite: (site: Site) => void;
  navigateToZone: (zone: Zone) => void;
  navigateToRack: (rack: Rack) => void;
  navigateBack: () => void;
  resetNavigation: () => void;

  // Cache management
  setSites: (sites: Site[]) => void;
  setZones: (zones: Zone[]) => void;
  setRacks: (racks: Rack[]) => void;
  
  // Loading states
  setLoadingSites: (isLoading: boolean) => void;
  setLoadingZones: (isLoading: boolean) => void;
  setLoadingRacks: (isLoading: boolean) => void;

  // Getters
  getBreadcrumbs: () => Array<{ label: string; href?: string }>;
}

export const useInfrastructureStore = create<InfrastructureStore>((set, get) => ({
  // Initial state
  currentSite: null,
  currentZone: null,
  currentRack: null,
  currentEquipment: null,
  sites: [],
  zones: [],
  racks: [],
  isLoadingSites: false,
  isLoadingZones: false,
  isLoadingRacks: false,

  // Navigation actions
  setCurrentSite: (site) => set({ currentSite: site }),
  setCurrentZone: (zone) => set({ currentZone: zone }),
  setCurrentRack: (rack) => set({ currentRack: rack }),
  setCurrentEquipment: (equipment) => set({ currentEquipment: equipment }),

  navigateToSite: (site) => set({
    currentSite: site,
    currentZone: null,
    currentRack: null,
    currentEquipment: null,
  }),

  navigateToZone: (zone) => set({
    currentZone: zone,
    currentRack: null,
    currentEquipment: null,
  }),

  navigateToRack: (rack) => set({
    currentRack: rack,
    currentEquipment: null,
  }),

  navigateBack: () => {
    const state = get();
    if (state.currentEquipment) {
      set({ currentEquipment: null });
    } else if (state.currentRack) {
      set({ currentRack: null });
    } else if (state.currentZone) {
      set({ currentZone: null });
    } else if (state.currentSite) {
      set({ currentSite: null });
    }
  },

  resetNavigation: () => set({
    currentSite: null,
    currentZone: null,
    currentRack: null,
    currentEquipment: null,
  }),

  // Cache management
  setSites: (sites) => set({ sites }),
  setZones: (zones) => set({ zones }),
  setRacks: (racks) => set({ racks }),

  // Loading states
  setLoadingSites: (isLoading) => set({ isLoadingSites: isLoading }),
  setLoadingZones: (isLoading) => set({ isLoadingZones: isLoading }),
  setLoadingRacks: (isLoading) => set({ isLoadingRacks: isLoading }),

  // Getters
  getBreadcrumbs: () => {
    const state = get();
    const breadcrumbs: Array<{ label: string; href?: string }> = [{ label: 'Accueil', href: '/' }];

    if (state.currentSite) {
      breadcrumbs.push({
        label: state.currentSite.name,
        href: `/sites/${state.currentSite.id}`,
      });
    }

    if (state.currentZone) {
      breadcrumbs.push({
        label: state.currentZone.name,
        href: `/zones/${state.currentZone.id}`,
      });
    }

    if (state.currentRack) {
      breadcrumbs.push({
        label: state.currentRack.name,
        href: `/racks/${state.currentRack.id}`,
      });
    }

    if (state.currentEquipment) {
      breadcrumbs.push({
        label: state.currentEquipment.name,
      });
    }

    return breadcrumbs;
  },
}));