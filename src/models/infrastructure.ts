// Type de réseau
export enum NetworkType {
    IT = 'IT', // Informatique
    OT = 'OT', // Opérationnel/Industriel
  }
  
  // Statut d'équipement
  export enum EquipmentStatus {
    ONLINE = 'ONLINE',
    OFFLINE = 'OFFLINE',
    WARNING = 'WARNING',
    MAINTENANCE = 'MAINTENANCE',
    ERROR = 'ERROR',
  }
  
  // Type de port
  export enum PortType {
    ETHERNET = 'ETHERNET',
    FIBER = 'FIBER',
    SFP = 'SFP',
    QSFP = 'QSFP',
    CONSOLE = 'CONSOLE',
    USB = 'USB',
  }
  
  // Statut de port
  export enum PortStatus {
    UP = 'UP',
    DOWN = 'DOWN',
    DISABLED = 'DISABLED',
    ERROR = 'ERROR',
  }
  
  // Type de connexion
  export enum ConnectionType {
    COPPER = 'COPPER',
    FIBER = 'FIBER',
    WIRELESS = 'WIRELESS',
  }
  
  // Site
  export interface Site {
    id: string;
    name: string;
    address: string;
    city: string;
    country: string;
    status: EquipmentStatus;
    zonesCount: number;
    racksCount: number;
    equipmentsCount: number;
    portsCount: number;
    description?: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
    createdAt: string;
    updatedAt: string;
  }
  
  // Zone
  export interface Zone {
    id: string;
    siteId: string;
    name: string;
    description?: string;
    type: string; // 'DATACENTER', 'PRODUCTION', 'OFFICE', etc.
    racksCount: number;
    equipmentsCount: number;
    status: EquipmentStatus;
    floor?: string;
    building?: string;
    createdAt: string;
    updatedAt: string;
  }
  
  // Baie/Rack
  export interface Rack {
    id: string;
    zoneId: string;
    name: string;
    code: string; // Ex: RACK-01A
    qrCode?: string;
    height: number; // En U (unités de rack)
    usedHeight: number;
    width?: number;
    depth?: number;
    equipmentsCount: number;
    status: EquipmentStatus;
    powerCapacity?: number; // En kW
    powerUsage?: number; // En kW
    temperature?: number; // En °C
    row?: string;
    position?: string;
    createdAt: string;
    updatedAt: string;
  }
  
  // Équipement
  export interface Equipment {
    id: string;
    rackId: string;
    name: string;
    type: string; // 'SWITCH', 'ROUTER', 'SERVER', 'FIREWALL', etc.
    manufacturer?: string;
    model?: string;
    serialNumber?: string;
    networkType: NetworkType;
    status: EquipmentStatus;
    ipAddress?: string;
    macAddress?: string;
    position: number; // Position en U dans le rack
    height: number; // Hauteur en U
    portsCount: number;
    powerConsumption?: number; // En W
    firmware?: string;
    purchaseDate?: string;
    warrantyEnd?: string;
    description?: string;
    createdAt: string;
    updatedAt: string;
  }
  
  // Port
  export interface Port {
    id: string;
    equipmentId: string;
    name: string;
    number: number;
    type: PortType;
    status: PortStatus;
    speed?: string; // '1Gbps', '10Gbps', etc.
    vlan?: string;
    description?: string;
    connectedTo?: string; // ID du port connecté
    createdAt: string;
    updatedAt: string;
  }
  
  // Connexion entre ports
  export interface Connection {
    id: string;
    sourcePortId: string;
    targetPortId: string;
    type: ConnectionType;
    length?: number; // En mètres
    cableType?: string;
    label?: string;
    status: PortStatus;
    throughput?: number; // En Mbps
    createdAt: string;
    updatedAt: string;
  }
  
  // Vue détaillée avec relations
  export interface RackDetail extends Rack {
    zone: Zone;
    equipments: Equipment[];
  }
  
  export interface EquipmentDetail extends Equipment {
    rack: Rack;
    ports: Port[];
    connections: Connection[];
  }
  
  export interface PortDetail extends Port {
    equipment: Equipment;
    connection?: Connection;
    connectedPort?: Port;
  }