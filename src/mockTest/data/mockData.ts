// /api/mockData.ts
import { 
    Site, 
    Zone, 
    Rack, 
    Equipment, 
    Port, 
    Connection,
    RackDetail,
    EquipmentDetail,
    PortDetail,
    NetworkType,
    EquipmentStatus,
    PortType,
    PortStatus,
    ConnectionType
  } from '@models/infrastructure';
  import { 
    ModificationProposal, 
    ModificationStatus, 
    ModificationType, 
    ModificationEntity 
  } from '@models/modifications';
  import { User, UserRole, Permission } from '@models/auth';
  
  // =====================
  // UTILISATEURS MOCK
  // =====================
  export const mockUsers: User[] = [
    {
      id: 'user-1',
      email: 'admin@inframap.com',
      firstName: 'Admin',
      lastName: 'Système',
      role: UserRole.ADMIN,
      permissions: [
        Permission.VIEW_INFRASTRUCTURE,
        Permission.EDIT_INFRASTRUCTURE,
        Permission.DELETE_INFRASTRUCTURE,
        Permission.PROPOSE_MODIFICATION,
        Permission.VALIDATE_MODIFICATION,
        Permission.REJECT_MODIFICATION,
        Permission.MANAGE_USERS,
        Permission.MANAGE_ROLES,
        Permission.EXPORT_DATA,
        Permission.SCAN_QR,
      ],
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z',
      lastLogin: '2024-10-29T10:00:00Z',
    },
    {
      id: 'user-2',
      email: 'manager@inframap.com',
      firstName: 'Marie',
      lastName: 'Dupont',
      role: UserRole.NETWORK_MANAGER,
      permissions: [
        Permission.VIEW_INFRASTRUCTURE,
        Permission.EDIT_INFRASTRUCTURE,
        Permission.PROPOSE_MODIFICATION,
        Permission.VALIDATE_MODIFICATION,
        Permission.REJECT_MODIFICATION,
        Permission.EXPORT_DATA,
        Permission.SCAN_QR,
      ],
      isActive: true,
      createdAt: '2024-02-01T00:00:00Z',
      lastLogin: '2024-10-29T09:00:00Z',
    },
    {
      id: 'user-3',
      email: 'tech@inframap.com',
      firstName: 'Pierre',
      lastName: 'Martin',
      role: UserRole.TECHNICIAN,
      permissions: [
        Permission.VIEW_INFRASTRUCTURE,
        Permission.PROPOSE_MODIFICATION,
        Permission.SCAN_QR,
      ],
      isActive: true,
      createdAt: '2024-03-01T00:00:00Z',
      lastLogin: '2024-10-28T15:00:00Z',
    },
  ];
  
  // =====================
  // SITES MOCK
  // =====================
  export const mockSites: Site[] = [
    {
      id: 'site-1',
      name: 'Siège Social Paris',
      address: '10 Avenue des Champs-Élysées',
      city: 'Paris',
      country: 'France',
      status: EquipmentStatus.ONLINE,
      zonesCount: 3,
      racksCount: 12,
      equipmentsCount: 45,
      portsCount: 240,
      description: 'Site principal avec datacenter et bureaux',
      coordinates: { lat: 48.8566, lng: 2.3522 },
      createdAt: '2024-01-15T00:00:00Z',
      updatedAt: '2024-10-20T00:00:00Z',
    },
    {
      id: 'site-2',
      name: 'Datacenter Lyon',
      address: '50 Rue de la République',
      city: 'Lyon',
      country: 'France',
      status: EquipmentStatus.ONLINE,
      zonesCount: 5,
      racksCount: 30,
      equipmentsCount: 120,
      portsCount: 650,
      description: 'Datacenter principal de production',
      coordinates: { lat: 45.7640, lng: 4.8357 },
      createdAt: '2024-01-10T00:00:00Z',
      updatedAt: '2024-10-25T00:00:00Z',
    },
    {
      id: 'site-3',
      name: 'Usine Toulouse',
      address: '100 Route Industrielle',
      city: 'Toulouse',
      country: 'France',
      status: EquipmentStatus.WARNING,
      zonesCount: 4,
      racksCount: 8,
      equipmentsCount: 35,
      portsCount: 180,
      description: 'Site industriel avec réseau OT',
      coordinates: { lat: 43.6047, lng: 1.4442 },
      createdAt: '2024-02-01T00:00:00Z',
      updatedAt: '2024-10-28T00:00:00Z',
    },
  ];
  
  // =====================
  // ZONES MOCK
  // =====================
  export const mockZones: Zone[] = [
    {
      id: 'zone-1',
      siteId: 'site-1',
      name: 'Datacenter Principal',
      type: 'DATACENTER',
      racksCount: 10,
      equipmentsCount: 40,
      status: EquipmentStatus.ONLINE,
      floor: 'RDC',
      building: 'Bâtiment A',
      description: 'Salle serveurs principale',
      createdAt: '2024-01-15T00:00:00Z',
      updatedAt: '2024-10-20T00:00:00Z',
    },
    {
      id: 'zone-2',
      siteId: 'site-1',
      name: 'Zone Bureaux',
      type: 'OFFICE',
      racksCount: 2,
      equipmentsCount: 5,
      status: EquipmentStatus.ONLINE,
      floor: '1er étage',
      building: 'Bâtiment A',
      createdAt: '2024-01-15T00:00:00Z',
      updatedAt: '2024-10-20T00:00:00Z',
    },
    {
      id: 'zone-3',
      siteId: 'site-2',
      name: 'Salle Production',
      type: 'PRODUCTION',
      racksCount: 20,
      equipmentsCount: 80,
      status: EquipmentStatus.ONLINE,
      floor: 'RDC',
      building: 'Datacenter',
      createdAt: '2024-01-10T00:00:00Z',
      updatedAt: '2024-10-25T00:00:00Z',
    },
    {
      id: 'zone-4',
      siteId: 'site-3',
      name: 'Atelier Production',
      type: 'PRODUCTION',
      racksCount: 5,
      equipmentsCount: 20,
      status: EquipmentStatus.WARNING,
      floor: 'RDC',
      building: 'Atelier',
      description: 'Zone OT - Contrôle production',
      createdAt: '2024-02-01T00:00:00Z',
      updatedAt: '2024-10-28T00:00:00Z',
    },
  ];
  
  // =====================
  // RACKS MOCK
  // =====================
  export const mockRacks: Rack[] = [
    {
      id: 'rack-1',
      zoneId: 'zone-1',
      name: 'RACK-DC-01',
      code: 'DC01',
      qrCode: 'RACK:rack-1',
      height: 42,
      usedHeight: 25,
      width: 600,
      depth: 1000,
      equipmentsCount: 8,
      status: EquipmentStatus.ONLINE,
      powerCapacity: 5,
      powerUsage: 3.2,
      temperature: 22,
      row: 'A',
      position: '1',
      createdAt: '2024-01-15T00:00:00Z',
      updatedAt: '2024-10-20T00:00:00Z',
    },
    {
      id: 'rack-2',
      zoneId: 'zone-1',
      name: 'RACK-DC-02',
      code: 'DC02',
      qrCode: 'RACK:rack-2',
      height: 42,
      usedHeight: 30,
      width: 600,
      depth: 1000,
      equipmentsCount: 10,
      status: EquipmentStatus.ONLINE,
      powerCapacity: 5,
      powerUsage: 4.1,
      temperature: 23,
      row: 'A',
      position: '2',
      createdAt: '2024-01-15T00:00:00Z',
      updatedAt: '2024-10-20T00:00:00Z',
    },
    {
      id: 'rack-3',
      zoneId: 'zone-3',
      name: 'RACK-PROD-01',
      code: 'PROD01',
      qrCode: 'RACK:rack-3',
      height: 42,
      usedHeight: 20,
      width: 600,
      depth: 1000,
      equipmentsCount: 6,
      status: EquipmentStatus.ONLINE,
      powerCapacity: 5,
      powerUsage: 2.8,
      temperature: 21,
      row: 'B',
      position: '1',
      createdAt: '2024-01-10T00:00:00Z',
      updatedAt: '2024-10-25T00:00:00Z',
    },
  ];
  
  // =====================
  // EQUIPMENTS MOCK
  // =====================
  export const mockEquipments: Equipment[] = [
    {
      id: 'equip-1',
      rackId: 'rack-1',
      name: 'SW-CORE-01',
      type: 'SWITCH',
      manufacturer: 'Cisco',
      model: 'Catalyst 9300',
      serialNumber: 'FCW2234A1B2',
      networkType: NetworkType.IT,
      status: EquipmentStatus.ONLINE,
      ipAddress: '192.168.1.1',
      macAddress: '00:1A:2B:3C:4D:5E',
      position: 40,
      height: 1,
      portsCount: 48,
      powerConsumption: 150,
      firmware: 'IOS-XE 17.3',
      createdAt: '2024-01-15T00:00:00Z',
      updatedAt: '2024-10-20T00:00:00Z',
    },
    {
      id: 'equip-2',
      rackId: 'rack-1',
      name: 'SW-ACCESS-01',
      type: 'SWITCH',
      manufacturer: 'Cisco',
      model: 'Catalyst 2960',
      serialNumber: 'FCW2235A2C3',
      networkType: NetworkType.IT,
      status: EquipmentStatus.ONLINE,
      ipAddress: '192.168.1.10',
      macAddress: '00:1A:2B:3C:4D:5F',
      position: 38,
      height: 1,
      portsCount: 24,
      powerConsumption: 80,
      createdAt: '2024-01-15T00:00:00Z',
      updatedAt: '2024-10-20T00:00:00Z',
    },
    {
      id: 'equip-3',
      rackId: 'rack-1',
      name: 'FW-01',
      type: 'FIREWALL',
      manufacturer: 'Fortinet',
      model: 'FortiGate 100F',
      serialNumber: 'FGT100F3G20001234',
      networkType: NetworkType.IT,
      status: EquipmentStatus.ONLINE,
      ipAddress: '192.168.1.254',
      position: 36,
      height: 1,
      portsCount: 10,
      powerConsumption: 50,
      createdAt: '2024-01-15T00:00:00Z',
      updatedAt: '2024-10-20T00:00:00Z',
    },
    {
      id: 'equip-4',
      rackId: 'rack-2',
      name: 'SRV-APP-01',
      type: 'SERVER',
      manufacturer: 'Dell',
      model: 'PowerEdge R640',
      serialNumber: 'DL640ABC123',
      networkType: NetworkType.IT,
      status: EquipmentStatus.ONLINE,
      ipAddress: '192.168.2.10',
      position: 30,
      height: 2,
      portsCount: 4,
      powerConsumption: 500,
      createdAt: '2024-01-15T00:00:00Z',
      updatedAt: '2024-10-20T00:00:00Z',
    },
    {
      id: 'equip-5',
      rackId: 'rack-3',
      name: 'PLC-PROD-01',
      type: 'PLC',
      manufacturer: 'Siemens',
      model: 'S7-1500',
      serialNumber: 'S71500XYZ789',
      networkType: NetworkType.OT,
      status: EquipmentStatus.ONLINE,
      ipAddress: '10.0.1.10',
      position: 20,
      height: 1,
      portsCount: 8,
      powerConsumption: 30,
      description: 'Automate programmable - Ligne production A',
      createdAt: '2024-01-10T00:00:00Z',
      updatedAt: '2024-10-25T00:00:00Z',
    },
  ];
  
  // =====================
  // PORTS MOCK
  // =====================
  export const mockPorts: Port[] = [
    // Ports pour SW-CORE-01
    ...Array.from({ length: 48 }, (_, i) => ({
      id: `port-1-${i + 1}`,
      equipmentId: 'equip-1',
      name: `Gi1/0/${i + 1}`,
      number: i + 1,
      type: PortType.ETHERNET,
      status: i < 10 ? PortStatus.UP : PortStatus.DOWN,
      speed: '1Gbps',
      vlan: i < 10 ? '100' : undefined,
      connectedTo: i === 0 ? 'port-2-1' : undefined,
      createdAt: '2024-01-15T00:00:00Z',
      updatedAt: '2024-10-20T00:00:00Z',
    })),
    // Ports pour SW-ACCESS-01
    ...Array.from({ length: 24 }, (_, i) => ({
      id: `port-2-${i + 1}`,
      equipmentId: 'equip-2',
      name: `Fa0/${i + 1}`,
      number: i + 1,
      type: PortType.ETHERNET,
      status: i < 12 ? PortStatus.UP : PortStatus.DOWN,
      speed: '100Mbps',
      vlan: i < 12 ? '200' : undefined,
      connectedTo: i === 0 ? 'port-1-1' : undefined,
      createdAt: '2024-01-15T00:00:00Z',
      updatedAt: '2024-10-20T00:00:00Z',
    })),
  ];
  
  // =====================
  // CONNECTIONS MOCK
  // =====================
  export const mockConnections: Connection[] = [
    {
      id: 'conn-1',
      sourcePortId: 'port-1-1',
      targetPortId: 'port-2-1',
      type: ConnectionType.COPPER,
      length: 5,
      cableType: 'Cat6',
      label: 'UPLINK SW-ACCESS-01',
      status: PortStatus.UP,
      throughput: 1000,
      createdAt: '2024-01-15T00:00:00Z',
      updatedAt: '2024-10-20T00:00:00Z',
    },
  ];
  
  // =====================
  // MODIFICATIONS MOCK
  // =====================
  export const mockModifications: ModificationProposal[] = [
    {
      id: 'mod-1',
      type: ModificationType.CREATE,
      entity: ModificationEntity.EQUIPMENT,
      status: ModificationStatus.PENDING,
      newData: {
        name: 'SW-NEW-01',
        type: 'SWITCH',
        rackId: 'rack-1',
        networkType: NetworkType.IT,
      },
      proposedBy: 'user-3',
      proposedByName: 'Pierre Martin',
      proposedAt: '2024-10-28T14:00:00Z',
      justification: 'Ajout d\'un nouveau switch pour extension réseau bureau',
      createdAt: '2024-10-28T14:00:00Z',
      updatedAt: '2024-10-28T14:00:00Z',
    },
    {
      id: 'mod-2',
      type: ModificationType.UPDATE,
      entity: ModificationEntity.EQUIPMENT,
      entityId: 'equip-1',
      status: ModificationStatus.APPROVED,
      oldData: {
        ipAddress: '192.168.1.1',
      },
      newData: {
        ipAddress: '192.168.1.2',
      },
      proposedBy: 'user-3',
      proposedByName: 'Pierre Martin',
      proposedAt: '2024-10-27T10:00:00Z',
      justification: 'Changement d\'adresse IP pour conformité nouveau plan d\'adressage',
      validatedBy: 'user-2',
      validatedByName: 'Marie Dupont',
      validatedAt: '2024-10-27T11:00:00Z',
      validationComment: 'Approuvé - Modification conforme',
      createdAt: '2024-10-27T10:00:00Z',
      updatedAt: '2024-10-27T11:00:00Z',
    },
    {
      id: 'mod-3',
      type: ModificationType.CONNECT,
      entity: ModificationEntity.CONNECTION,
      status: ModificationStatus.PENDING,
      newData: {
        sourcePortId: 'port-1-5',
        targetPortId: 'port-2-10',
        type: 'COPPER',
        cableType: 'Cat6',
      },
      proposedBy: 'user-3',
      proposedByName: 'Pierre Martin',
      proposedAt: '2024-10-29T09:00:00Z',
      justification: 'Connexion nouveau poste de travail',
      createdAt: '2024-10-29T09:00:00Z',
      updatedAt: '2024-10-29T09:00:00Z',
    },
  ];
  
  // =====================
  // FONCTION HELPER
  // =====================
  export const generateMockId = (prefix: string): string => {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };
  
  export const delay = (ms: number = 500): Promise<void> => {
    return new Promise(resolve => setTimeout(resolve, ms));
  };