import { 
    mockSites, 
    mockZones, 
    mockRacks, 
    mockEquipments, 
    mockPorts,
    mockConnections,
    mockUsers,
    mockModifications,
    delay 
  } from '../data/mockData';
  import { APIResponse, PaginatedResponse } from '@models/api';
  
  // Helper pour simuler les réponses API
  const createResponse = <T>(data: T): APIResponse<T> => ({
    success: true,
    data,
    timestamp: new Date().toISOString(),
  });
  
  const createPaginatedResponse = <T>(items: T[], label: string): any => ({
    [label]: items,
    pagination: {
      page: 1,
      pageSize: items.length,
      totalPages: 1,
      totalItems: items.length,
      hasNext: false,
      hasPrevious: false,
    },
  });
  
  // Services Mock
  export const mockInfrastructureAPI = {
    // Sites
    getSites: async () => {
      await delay(500);
      return createResponse(createPaginatedResponse(mockSites,"Site"));
    },
  
    getSiteById: async (id: string) => {
      await delay(300);
      const site = mockSites.find(s => s.id === id);
      if (!site) throw new Error('Site not found');
      return createResponse(site);
    },
  
    // Zones
    getZones: async (siteId?: string) => {
      await delay(500);
      const zones = siteId 
        ? mockZones.filter(z => z.siteId === siteId)
        : mockZones;
      return createResponse(createPaginatedResponse(zones,"Zone"));
    },
  
    getZoneById: async (id: string) => {
      await delay(300);
      const zone = mockZones.find(z => z.id === id);
      if (!zone) throw new Error('Zone not found');
      return createResponse(zone);
    },
  
    // Racks
    getRacks: async (zoneId?: string) => {
      await delay(500);
      const racks = zoneId 
        ? mockRacks.filter(r => r.zoneId === zoneId)
        : mockRacks;
      return createResponse(createPaginatedResponse(racks,"Rack"));
    },
  
    getRackById: async (id: string) => {
      await delay(300);
      const rack = mockRacks.find(r => r.id === id);
      if (!rack) throw new Error('Rack not found');
      
      const zone = mockZones.find(z => z.id === rack.zoneId);
      const equipments = mockEquipments.filter(e => e.rackId === id);
  
      return createResponse({
        ...rack,
        zone: zone!,
        equipments,
      });
    },
  
    // Equipments
    getEquipments: async (rackId?: string) => {
      await delay(500);
      const equipments = rackId 
        ? mockEquipments.filter(e => e.rackId === rackId)
        : mockEquipments;
      return createResponse(createPaginatedResponse(equipments,"Equipment"));
    },
  
    getEquipmentById: async (id: string) => {
      await delay(300);
      const equipment = mockEquipments.find(e => e.id === id);
      if (!equipment) throw new Error('Equipment not found');
      
      const rack = mockRacks.find(r => r.id === equipment.rackId);
      const ports = mockPorts.filter(p => p.equipmentId === id);
      const connections = mockConnections.filter(
        c => ports.some(p => p.id === c.sourcePortId || p.id === c.targetPortId)
      );
  
      return createResponse({
        ...equipment,
        rack: rack!,
        ports,
        connections,
      });
    },
  
    // Ports
    getPorts: async (equipmentId?: string) => {
      await delay(500);
      const ports = equipmentId 
        ? mockPorts.filter(p => p.equipmentId === equipmentId)
        : mockPorts;
      return createResponse(createPaginatedResponse(ports,"Port"));
    },
  
    getPortById: async (id: string) => {
      await delay(300);
      const port = mockPorts.find(p => p.id === id);
      if (!port) throw new Error('Port not found');
      
      const equipment = mockEquipments.find(e => e.id === port.equipmentId);
      const connection = mockConnections.find(
        c => c.sourcePortId === id || c.targetPortId === id
      );
      const connectedPort = connection 
        ? mockPorts.find(p => p.id === (connection.sourcePortId === id ? connection.targetPortId : connection.sourcePortId))
        : undefined;
  
      return createResponse({
        ...port,
        equipment: equipment!,
        connection,
        connectedPort,
      });
    },
  
    // Connections
    getConnections: async () => {
      await delay(500);
      return createResponse(createPaginatedResponse(mockConnections,"Connection"));
    },
  };
  
  export const mockAuthAPI = {
    login: async (credentials: { email: string; password: string }) => {
      await delay(800);
      const user = mockUsers.find(
          u => u.email === credentials.email && u.password === credentials.password
      );
      if (!user) throw new Error('Invalid credentials');

      // Retirer le mot de passe avant de renvoyer l'utilisateur
      const { password, ...userWithoutPassword } = user;

      return createResponse({
        user: userWithoutPassword,
        token: 'mock_token_' + Date.now(),
        refreshToken: 'mock_refresh_' + Date.now(),
        expiresIn: 3600,
      });
    },
  
    getCurrentUser: async () => {
      await delay(300);
      return createResponse(mockUsers[0]);
    },
  
    logout: async () => {
      await delay(300);
      return createResponse({});
    },
  };
  
  export const mockModificationsAPI = {
    getModifications: async () => {
      await delay(500);
      return createResponse(createPaginatedResponse(mockModifications,"Modifications"));
    },
  
    getPendingModifications: async () => {
      await delay(500);
      const pending = mockModifications.filter(m => m.status === 'PENDING');
      return createResponse(createPaginatedResponse(pending,"Pending"));
    },
  
    getStats: async () => {
      await delay(300);
      return createResponse({
        total: mockModifications.length,
        pending: mockModifications.filter(m => m.status === 'PENDING').length,
        approved: mockModifications.filter(m => m.status === 'APPROVED').length,
        rejected: mockModifications.filter(m => m.status === 'REJECTED').length,
        byType: {},
        byEntity: {},
        byUser: {},
      });
    },
  };