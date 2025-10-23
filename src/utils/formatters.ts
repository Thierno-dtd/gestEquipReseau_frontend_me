import { format, formatDistanceToNow, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

// Format de date
export const formatDate = (date: string | Date, formatStr: string = 'dd/MM/yyyy'): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, formatStr, { locale: fr });
};

// Format date avec heure
export const formatDateTime = (date: string | Date): string => {
  return formatDate(date, 'dd/MM/yyyy HH:mm');
};

// Format distance temporelle ("il y a 2 heures")
export const formatRelativeTime = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return formatDistanceToNow(dateObj, { addSuffix: true, locale: fr });
};

// Format adresse IP
export const formatIP = (ip: string): string => {
  return ip.trim();
};

// Format MAC address
export const formatMAC = (mac: string): string => {
  return mac.toUpperCase().replace(/[^A-F0-9]/g, '').match(/.{1,2}/g)?.join(':') || mac;
};

// Format taille de fichier
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

// Format puissance (kW, W)
export const formatPower = (watts: number): string => {
  if (watts >= 1000) {
    return `${(watts / 1000).toFixed(2)} kW`;
  }
  return `${watts} W`;
};

// Format vitesse (Gbps, Mbps)
export const formatSpeed = (mbps: number): string => {
  if (mbps >= 1000) {
    return `${(mbps / 1000).toFixed(1)} Gbps`;
  }
  return `${mbps} Mbps`;
};

// Format température
export const formatTemperature = (celsius: number): string => {
  return `${celsius.toFixed(1)}°C`;
};

// Format pourcentage
export const formatPercentage = (value: number, total: number): string => {
  const percent = (value / total) * 100;
  return `${percent.toFixed(1)}%`;
};

// Format ID court
export const formatShortId = (id: string, length: number = 8): string => {
  return id.substring(0, length);
};

// Format nom complet
export const formatFullName = (firstName: string, lastName: string): string => {
  return `${firstName} ${lastName}`;
};

// Capitaliser première lettre
export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

// Format numéro de téléphone
export const formatPhone = (phone: string): string => {
  return phone.replace(/(\d{2})(?=\d)/g, '$1 ').trim();
};