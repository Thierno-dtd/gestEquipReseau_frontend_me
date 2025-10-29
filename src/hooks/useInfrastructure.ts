import { useQuery } from '@tanstack/react-query';
import { infrastructureAPI } from '@/services/api';
import { useInfrastructureStore } from '@/store/infrastructureStore';

export const useInfrastructure = () => {
  const { currentSite, currentZone, currentRack, setCurrentSite, setCurrentZone, setCurrentRack } = useInfrastructureStore();

  // Sites
  const { data: sites, isLoading: sitesLoading } = useQuery({
    queryKey: ['sites'],
    queryFn: () => infrastructureAPI.getSites(),
  });

  // Zones for current site
  const { data: zones, isLoading: zonesLoading } = useQuery({
    queryKey: ['zones', currentSite],
    queryFn: () => infrastructureAPI.getZones(currentSite!.id),
    enabled: !!currentSite,
  });

  // Racks for current zone
  const { data: racks, isLoading: racksLoading } = useQuery({
    queryKey: ['racks', currentZone],
    queryFn: () => infrastructureAPI.getRacks(currentZone!.id),
    enabled: !!currentZone,
  });

  // Equipment for current rack
  const { data: equipment, isLoading: equipmentLoading } = useQuery({
    queryKey: ['equipment', currentRack],
    queryFn: () => infrastructureAPI.getEquipments(currentRack!.id),
    enabled: !!currentRack,
  });

  return {
    sites,
    zones,
    racks,
    equipment,
    sitesLoading,
    zonesLoading,
    racksLoading,
    equipmentLoading,
    currentSite,
    currentZone,
    currentRack,
    setCurrentSite,
    setCurrentZone,
    setCurrentRack,
  };
};

// Hook pour un site spécifique
export const useSite = (siteId: string) => {
  return useQuery({
    queryKey: ['site', siteId],
    queryFn: () => infrastructureAPI.getSiteById(siteId),
    enabled: !!siteId,
  });
};

// Hook pour une zone spécifique
export const useZone = (zoneId: string) => {
  return useQuery({
    queryKey: ['zone', zoneId],
    queryFn: () => infrastructureAPI.getZoneById(zoneId),
    enabled: !!zoneId,
  });
};

// Hook pour une baie spécifique
export const useRack = (rackId: string) => {
  return useQuery({
    queryKey: ['rack', rackId],
    queryFn: () => infrastructureAPI.getRackById(rackId),
    enabled: !!rackId,
  });
};

// Hook pour un équipement spécifique
export const useEquipment = (equipmentId: string) => {
  return useQuery({
    queryKey: ['equipment', equipmentId],
    queryFn: () => infrastructureAPI.getEquipmentById(equipmentId),
    enabled: !!equipmentId,
  });
};

// Hook pour un port spécifique
export const usePort = (portId: string) => {
  return useQuery({
    queryKey: ['port', portId],
    queryFn: () => infrastructureAPI.getPortById(portId),
    enabled: !!portId,
  });
};