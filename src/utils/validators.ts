import { z } from 'zod';

// Schémas de validation pour les formulaires

// Login
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'L\'email est requis')
    .email('Email invalide'),
  password: z
    .string()
    .min(1, 'Le mot de passe est requis')
    .min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
  rememberMe: z.boolean().optional(),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// Site
export const siteSchema = z.object({
  name: z
    .string()
    .min(1, 'Le nom est requis')
    .max(100, 'Le nom est trop long'),
  address: z.string().min(1, 'L\'adresse est requise'),
  city: z.string().min(1, 'La ville est requise'),
  country: z.string().min(1, 'Le pays est requis'),
  description: z.string().optional(),
});

export type SiteFormData = z.infer<typeof siteSchema>;

// Zone
export const zoneSchema = z.object({
  name: z.string().min(1, 'Le nom est requis').max(100),
  siteId: z.string().min(1, 'Le site est requis'),
  type: z.string().min(1, 'Le type est requis'),
  description: z.string().optional(),
  floor: z.string().optional(),
  building: z.string().optional(),
});

export type ZoneFormData = z.infer<typeof zoneSchema>;

// Rack
export const rackSchema = z.object({
  name: z.string().min(1, 'Le nom est requis'),
  code: z.string().min(1, 'Le code est requis'),
  zoneId: z.string().min(1, 'La zone est requise'),
  height: z
    .number()
    .min(1, 'La hauteur doit être au moins 1U')
    .max(52, 'La hauteur ne peut pas dépasser 52U'),
  width: z.number().positive().optional(),
  depth: z.number().positive().optional(),
  powerCapacity: z.number().positive().optional(),
  row: z.string().optional(),
  position: z.string().optional(),
});

export type RackFormData = z.infer<typeof rackSchema>;

// Equipment
export const equipmentSchema = z.object({
  name: z.string().min(1, 'Le nom est requis'),
  rackId: z.string().min(1, 'La baie est requise'),
  type: z.string().min(1, 'Le type est requis'),
  manufacturer: z.string().optional(),
  model: z.string().optional(),
  serialNumber: z.string().optional(),
  networkType: z.enum(['IT', 'OT'], {
    errorMap: () => ({ message: 'Type de réseau invalide' }),
  }),
  position: z.number().min(1, 'La position est requise'),
  height: z.number().min(1, 'La hauteur est requise'),
  ipAddress: z.string().ip({ version: 'v4' }).optional().or(z.literal('')),
  macAddress: z.string().optional(),
  powerConsumption: z.number().positive().optional(),
  description: z.string().optional(),
});

export type EquipmentFormData = z.infer<typeof equipmentSchema>;

// Port
export const portSchema = z.object({
  name: z.string().min(1, 'Le nom est requis'),
  equipmentId: z.string().min(1, 'L\'équipement est requis'),
  number: z.number().min(1),
  type: z.enum(['ETHERNET', 'FIBER', 'SFP', 'QSFP', 'CONSOLE', 'USB']),
  speed: z.string().optional(),
  vlan: z.string().optional(),
  description: z.string().optional(),
});

export type PortFormData = z.infer<typeof portSchema>;

// Connection
export const connectionSchema = z.object({
  sourcePortId: z.string().min(1, 'Le port source est requis'),
  targetPortId: z.string().min(1, 'Le port cible est requis'),
  type: z.enum(['COPPER', 'FIBER', 'WIRELESS']),
  length: z.number().positive().optional(),
  cableType: z.string().optional(),
  label: z.string().optional(),
});

export type ConnectionFormData = z.infer<typeof connectionSchema>;

// Modification
export const modificationProposalSchema = z.object({
  type: z.enum(['CREATE', 'UPDATE', 'DELETE', 'CONNECT', 'DISCONNECT']),
  entity: z.enum(['SITE', 'ZONE', 'RACK', 'EQUIPMENT', 'PORT', 'CONNECTION']),
  entityId: z.string().optional(),
  newData: z.record(z.any()),
  justification: z
    .string()
    .min(10, 'La justification doit contenir au moins 10 caractères')
    .max(500, 'La justification est trop longue'),
  siteId: z.string().optional(),
  zoneId: z.string().optional(),
  rackId: z.string().optional(),
});

export type ModificationProposalFormData = z.infer<typeof modificationProposalSchema>;

// Validation de modification
export const validationSchema = z.object({
  comment: z.string().max(500, 'Le commentaire est trop long').optional(),
});

export type ValidationFormData = z.infer<typeof validationSchema>;

// User
export const userSchema = z.object({
  email: z.string().email('Email invalide'),
  firstName: z.string().min(1, 'Le prénom est requis'),
  lastName: z.string().min(1, 'Le nom est requis'),
  role: z.enum(['ADMIN', 'NETWORK_MANAGER', 'TECHNICIAN', 'CONTRACTOR', 'VIEWER']),
  company: z.string().optional(),
});

export type UserFormData = z.infer<typeof userSchema>;