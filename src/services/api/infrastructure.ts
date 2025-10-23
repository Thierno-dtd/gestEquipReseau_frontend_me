import { get } from './client';
import { 
  Site, 
  Zone, 
  Rack, 
  Equipment, 
  Port, 
  Connection,
  RackDetail,
  EquipmentDetail,
  PortDetail
} from '@models/infrastructure';
import { PaginatedResponse } from '@models/api';

// Endpoints infrastructure (GET seulement - mutations via modifications)
export const infrastructureAPI = {
  // Sites
  getSites: (params?: any): Promise<PaginatedResponse<Site>> => {
    return get<PaginatedResponse<Site>>('/sites', params).then((res) => res.data);
  },

  getSiteById: (id: string): Promise<Site> => {
    return get<Site>(`/sites/${id}`).then((res) => res.data);
  },

  // Zones
  getZones: (siteId?: string, params?: any): Promise<PaginatedResponse<Zone>> => {
    const url = siteId ? `/sites/${siteId}/zones` : '/zones';
    return get<PaginatedResponse<Zone>>(url, params).then((res) => res.data);
  },

  getZoneById: (id: string): Promise<Zone> => {
    return get<Zone>(`/zones/${id}`).then((res) => res.data);
  },

  // Racks
  getRacks: (zoneId?: string, params?: any): Promise<PaginatedResponse<Rack>> => {
    const url = zoneId ? `/zones/${zoneId}/racks` : '/racks';
    return get<PaginatedResponse<Rack>>(url, params).then((res) => res.data);
  },

  getRackById: (id: string): Promise<RackDetail> => {
    return get<RackDetail>(`/racks/${id}`).then((res) => res.data);
  },

  getRackByQRCode: (qrCode: string): Promise<RackDetail> => {
    return get<RackDetail>(`/racks/qr/${qrCode}`).then((res) => res.data);
  },

  // Equipments
  getEquipments: (rackId?: string, params?: any): Promise<PaginatedResponse<Equipment>> => {
    const url = rackId ? `/racks/${rackId}/equipments` : '/equipments';
    return get<PaginatedResponse<Equipment>>(url, params).then((res) => res.data);
  },

  getEquipmentById: (id: string): Promise<EquipmentDetail> => {
    return get<EquipmentDetail>(`/equipments/${id}`).then((res) => res.data);
  },

  // Ports
  getPorts: (equipmentId?: string, params?: any): Promise<PaginatedResponse<Port>> => {
    const url = equipmentId ? `/equipments/${equipmentId}/ports` : '/ports';
    return get<PaginatedResponse<Port>>(url, params).then((res) => res.data);
  },

  getPortById: (id: string): Promise<PortDetail> => {
    return get<PortDetail>(`/ports/${id}`).then((res) => res.data);
  },

  // Connections
  getConnections: (params?: any): Promise<PaginatedResponse<Connection>> => {
    return get<PaginatedResponse<Connection>>('/connections', params).then((res) => res.data);
  },

  getConnectionById: (id: string): Promise<Connection> => {
    return get<Connection>(`/connections/${id}`).then((res) => res.data);
  },

  // Search
  search: (query: string, params?: any): Promise<any> => {
    return get('/search', { q: query, ...params }).then((res) => res.data);
  },
};