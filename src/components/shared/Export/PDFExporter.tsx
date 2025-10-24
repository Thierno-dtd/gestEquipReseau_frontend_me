import { jsPDF } from 'jspdf';
import { RackDetail, EquipmentDetail, Site, Zone } from '@models/infrastructure';
import { toast } from 'sonner';
import { formatDateTime } from '@utils/formatters';

interface PDFExportOptions {
  includeMetadata?: boolean;
  includeTimestamp?: boolean;
  pageOrientation?: 'portrait' | 'landscape';
}

export class PDFExporter {
  private pdf: jsPDF;

  constructor(orientation: 'portrait' | 'landscape' = 'portrait') {
    this.pdf = new jsPDF({
      orientation,
      unit: 'mm',
      format: 'a4',
    });
  }

  // Export Site
  exportSite(site: Site, zones: Zone[], options: PDFExportOptions = {}) {
    try {
      const { includeMetadata = true, includeTimestamp = true } = options;

      // Title
      this.pdf.setFontSize(20);
      this.pdf.setFont('helvetica', 'bold');
      this.pdf.text(`Site: ${site.name}`, 20, 20);

      // Timestamp
      if (includeTimestamp) {
        this.pdf.setFontSize(10);
        this.pdf.setFont('helvetica', 'normal');
        this.pdf.text(`Exporté le: ${formatDateTime(new Date())}`, 20, 28);
      }

      let yPosition = 40;

      // Site Information
      this.pdf.setFontSize(14);
      this.pdf.setFont('helvetica', 'bold');
      this.pdf.text('Informations du site', 20, yPosition);
      yPosition += 8;

      this.pdf.setFontSize(10);
      this.pdf.setFont('helvetica', 'normal');
      this.pdf.text(`Adresse: ${site.address}`, 20, yPosition);
      yPosition += 6;
      this.pdf.text(`Ville: ${site.city}, ${site.country}`, 20, yPosition);
      yPosition += 6;
      this.pdf.text(`Statut: ${site.status}`, 20, yPosition);
      yPosition += 10;

      // Statistics
      this.pdf.setFontSize(12);
      this.pdf.setFont('helvetica', 'bold');
      this.pdf.text('Statistiques', 20, yPosition);
      yPosition += 8;

      this.pdf.setFontSize(10);
      this.pdf.setFont('helvetica', 'normal');
      this.pdf.text(`Zones: ${site.zonesCount}`, 20, yPosition);
      yPosition += 6;
      this.pdf.text(`Baies: ${site.racksCount}`, 20, yPosition);
      yPosition += 6;
      this.pdf.text(`Équipements: ${site.equipmentsCount}`, 20, yPosition);
      yPosition += 10;

      // Zones List
      if (zones.length > 0) {
        this.pdf.setFontSize(12);
        this.pdf.setFont('helvetica', 'bold');
        this.pdf.text('Zones', 20, yPosition);
        yPosition += 8;

        zones.forEach((zone, index) => {
          if (yPosition > 270) {
            this.pdf.addPage();
            yPosition = 20;
          }

          this.pdf.setFontSize(10);
          this.pdf.setFont('helvetica', 'bold');
          this.pdf.text(`${index + 1}. ${zone.name}`, 25, yPosition);
          yPosition += 6;

          this.pdf.setFont('helvetica', 'normal');
          this.pdf.text(`Type: ${zone.type}`, 30, yPosition);
          yPosition += 5;
          this.pdf.text(`Baies: ${zone.racksCount} | Équipements: ${zone.equipmentsCount}`, 30, yPosition);
          yPosition += 8;
        });
      }

      // Metadata
      if (includeMetadata) {
        this.addMetadata({
          title: `Site - ${site.name}`,
          subject: 'Export Infrastructure Réseau',
          author: 'InfraMap',
          keywords: 'infrastructure, réseau, site',
          creator: 'InfraMap Application',
        });
      }

      return this.pdf;
    } catch (error) {
      console.error('PDF Export Error:', error);
      toast.error('Erreur lors de la génération du PDF');
      throw error;
    }
  }

  // Export Rack
  exportRack(rack: RackDetail, options: PDFExportOptions = {}) {
    try {
      const { includeMetadata = true, includeTimestamp = true } = options;

      // Title
      this.pdf.setFontSize(20);
      this.pdf.setFont('helvetica', 'bold');
      this.pdf.text(`Baie: ${rack.name}`, 20, 20);

      // Timestamp
      if (includeTimestamp) {
        this.pdf.setFontSize(10);
        this.pdf.setFont('helvetica', 'normal');
        this.pdf.text(`Exporté le: ${formatDateTime(new Date())}`, 20, 28);
      }

      let yPosition = 40;

      // Rack Information
      this.pdf.setFontSize(14);
      this.pdf.setFont('helvetica', 'bold');
      this.pdf.text('Informations de la baie', 20, yPosition);
      yPosition += 8;

      this.pdf.setFontSize(10);
      this.pdf.setFont('helvetica', 'normal');
      this.pdf.text(`Code: ${rack.code}`, 20, yPosition);
      yPosition += 6;
      this.pdf.text(`Zone: ${rack.zone.name}`, 20, yPosition);
      yPosition += 6;
      this.pdf.text(`Hauteur: ${rack.usedHeight}U / ${rack.height}U utilisés`, 20, yPosition);
      yPosition += 6;
      this.pdf.text(`Statut: ${rack.status}`, 20, yPosition);
      yPosition += 10;

      // Power info
      if (rack.powerCapacity) {
        this.pdf.text(`Puissance: ${rack.powerUsage?.toFixed(1) || 0} kW / ${rack.powerCapacity} kW`, 20, yPosition);
        yPosition += 6;
      }

      if (rack.temperature) {
        this.pdf.text(`Température: ${rack.temperature}°C`, 20, yPosition);
        yPosition += 10;
      }

      // Equipments
      if (rack.equipments.length > 0) {
        this.pdf.setFontSize(12);
        this.pdf.setFont('helvetica', 'bold');
        this.pdf.text(`Équipements (${rack.equipments.length})`, 20, yPosition);
        yPosition += 8;

        rack.equipments
          .sort((a, b) => b.position - a.position)
          .forEach((equipment, index) => {
            if (yPosition > 270) {
              this.pdf.addPage();
              yPosition = 20;
            }

            this.pdf.setFontSize(10);
            this.pdf.setFont('helvetica', 'bold');
            this.pdf.text(`U${equipment.position} - ${equipment.name}`, 25, yPosition);
            yPosition += 6;

            this.pdf.setFont('helvetica', 'normal');
            this.pdf.text(`Type: ${equipment.type} | ${equipment.networkType}`, 30, yPosition);
            yPosition += 5;
            
            if (equipment.ipAddress) {
              this.pdf.text(`IP: ${equipment.ipAddress}`, 30, yPosition);
              yPosition += 5;
            }
            
            this.pdf.text(`Ports: ${equipment.portsCount} | Hauteur: ${equipment.height}U`, 30, yPosition);
            yPosition += 8;
          });
      }

      // Metadata
      if (includeMetadata) {
        this.addMetadata({
          title: `Baie - ${rack.name}`,
          subject: 'Export Infrastructure Réseau',
          author: 'InfraMap',
          keywords: 'infrastructure, réseau, baie, rack',
          creator: 'InfraMap Application',
        });
      }

      return this.pdf;
    } catch (error) {
      console.error('PDF Export Error:', error);
      toast.error('Erreur lors de la génération du PDF');
      throw error;
    }
  }

  // Export Equipment
  exportEquipment(equipment: EquipmentDetail, options: PDFExportOptions = {}) {
    try {
      const { includeMetadata = true, includeTimestamp = true } = options;

      // Title
      this.pdf.setFontSize(20);
      this.pdf.setFont('helvetica', 'bold');
      this.pdf.text(`Équipement: ${equipment.name}`, 20, 20);

      // Timestamp
      if (includeTimestamp) {
        this.pdf.setFontSize(10);
        this.pdf.setFont('helvetica', 'normal');
        this.pdf.text(`Exporté le: ${formatDateTime(new Date())}`, 20, 28);
      }

      let yPosition = 40;

      // Equipment Information
      this.pdf.setFontSize(14);
      this.pdf.setFont('helvetica', 'bold');
      this.pdf.text('Informations de l\'équipement', 20, yPosition);
      yPosition += 8;

      this.pdf.setFontSize(10);
      this.pdf.setFont('helvetica', 'normal');
      this.pdf.text(`Type: ${equipment.type}`, 20, yPosition);
      yPosition += 6;
      this.pdf.text(`Réseau: ${equipment.networkType}`, 20, yPosition);
      yPosition += 6;
      this.pdf.text(`Baie: ${equipment.rack.name}`, 20, yPosition);
      yPosition += 6;
      this.pdf.text(`Position: U${equipment.position}`, 20, yPosition);
      yPosition += 6;
      this.pdf.text(`Statut: ${equipment.status}`, 20, yPosition);
      yPosition += 10;

      // Technical details
      if (equipment.manufacturer || equipment.model) {
        this.pdf.setFontSize(12);
        this.pdf.setFont('helvetica', 'bold');
        this.pdf.text('Détails techniques', 20, yPosition);
        yPosition += 8;

        this.pdf.setFontSize(10);
        this.pdf.setFont('helvetica', 'normal');
        if (equipment.manufacturer) {
          this.pdf.text(`Fabricant: ${equipment.manufacturer}`, 20, yPosition);
          yPosition += 6;
        }
        if (equipment.model) {
          this.pdf.text(`Modèle: ${equipment.model}`, 20, yPosition);
          yPosition += 6;
        }
        if (equipment.serialNumber) {
          this.pdf.text(`N° série: ${equipment.serialNumber}`, 20, yPosition);
          yPosition += 6;
        }
        yPosition += 4;
      }

      // Network details
      if (equipment.ipAddress || equipment.macAddress) {
        this.pdf.setFontSize(12);
        this.pdf.setFont('helvetica', 'bold');
        this.pdf.text('Configuration réseau', 20, yPosition);
        yPosition += 8;

        this.pdf.setFontSize(10);
        this.pdf.setFont('helvetica', 'normal');
        if (equipment.ipAddress) {
          this.pdf.text(`Adresse IP: ${equipment.ipAddress}`, 20, yPosition);
          yPosition += 6;
        }
        if (equipment.macAddress) {
          this.pdf.text(`Adresse MAC: ${equipment.macAddress}`, 20, yPosition);
          yPosition += 6;
        }
        yPosition += 4;
      }

      // Ports
      if (equipment.ports.length > 0) {
        this.pdf.setFontSize(12);
        this.pdf.setFont('helvetica', 'bold');
        this.pdf.text(`Ports (${equipment.ports.length})`, 20, yPosition);
        yPosition += 8;

        equipment.ports.forEach((port) => {
          if (yPosition > 270) {
            this.pdf.addPage();
            yPosition = 20;
          }

          this.pdf.setFontSize(10);
          this.pdf.setFont('helvetica', 'bold');
          this.pdf.text(`${port.name} - ${port.type}`, 25, yPosition);
          yPosition += 6;

          this.pdf.setFont('helvetica', 'normal');
          this.pdf.text(`Statut: ${port.status}${port.speed ? ` | Vitesse: ${port.speed}` : ''}`, 30, yPosition);
          yPosition += 5;

          if (port.connectedTo) {
            this.pdf.text('✓ Connecté', 30, yPosition);
            yPosition += 5;
          }
          yPosition += 3;
        });
      }

      // Metadata
      if (includeMetadata) {
        this.addMetadata({
          title: `Équipement - ${equipment.name}`,
          subject: 'Export Infrastructure Réseau',
          author: 'InfraMap',
          keywords: 'infrastructure, réseau, équipement',
          creator: 'InfraMap Application',
        });
      }

      return this.pdf;
    } catch (error) {
      console.error('PDF Export Error:', error);
      toast.error('Erreur lors de la génération du PDF');
      throw error;
    }
  }

  // Add metadata
  private addMetadata(metadata: {
    title?: string;
    subject?: string;
    author?: string;
    keywords?: string;
    creator?: string;
  }) {
    const { title, subject, author, keywords, creator } = metadata;

    if (title) this.pdf.setProperties({ title });
    if (subject) this.pdf.setProperties({ subject });
    if (author) this.pdf.setProperties({ author });
    if (keywords) this.pdf.setProperties({ keywords });
    if (creator) this.pdf.setProperties({ creator });
  }

  // Save PDF
  save(filename: string) {
    try {
      this.pdf.save(filename);
      toast.success('PDF exporté avec succès');
    } catch (error) {
      console.error('PDF Save Error:', error);
      toast.error('Erreur lors de la sauvegarde du PDF');
      throw error;
    }
  }

  // Get PDF as blob
  getBlob(): Blob {
    return this.pdf.output('blob');
  }

  // Get PDF as data URL
  getDataURL(): string {
    return this.pdf.output('dataurlstring');
  }
}

// Helper functions
export const exportSiteToPDF = (
  site: Site,
  zones: Zone[],
  filename?: string,
  options?: PDFExportOptions
) => {
  const exporter = new PDFExporter(options?.pageOrientation);
  exporter.exportSite(site, zones, options);
  exporter.save(filename || `site-${site.name}-${Date.now()}.pdf`);
};

export const exportRackToPDF = (
  rack: RackDetail,
  filename?: string,
  options?: PDFExportOptions
) => {
  const exporter = new PDFExporter(options?.pageOrientation);
  exporter.exportRack(rack, options);
  exporter.save(filename || `rack-${rack.name}-${Date.now()}.pdf`);
};

export const exportEquipmentToPDF = (
  equipment: EquipmentDetail,
  filename?: string,
  options?: PDFExportOptions
) => {
  const exporter = new PDFExporter(options?.pageOrientation);
  exporter.exportEquipment(equipment, options);
  exporter.save(filename || `equipment-${equipment.name}-${Date.now()}.pdf`);
};