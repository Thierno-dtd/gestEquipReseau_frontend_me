import { RackDetail, EquipmentDetail } from '@models/infrastructure';
import { toast } from 'sonner';

interface SVGExportOptions {
  width?: number;
  height?: number;
  includeMetadata?: boolean;
  theme?: 'light' | 'dark';
}

export class SVGExporter {
  private width: number;
  private height: number;
  private theme: 'light' | 'dark';

  constructor(options: SVGExportOptions = {}) {
    this.width = options.width || 800;
    this.height = options.height || 1200;
    this.theme = options.theme || 'light';
  }

  // Couleurs selon le thème
  private getColors() {
    if (this.theme === 'dark') {
      return {
        background: '#1a2831',
        text: '#e1e3e4',
        border: '#374151',
        primary: '#1193d4',
        it: '#007BFF',
        ot: '#FF9800',
        online: '#28a745',
        offline: '#dc3545',
        warning: '#ffc107',
      };
    }
    return {
      background: '#ffffff',
      text: '#111827',
      border: '#e5e7eb',
      primary: '#1193d4',
      it: '#007BFF',
      ot: '#FF9800',
      online: '#28a745',
      offline: '#dc3545',
      warning: '#ffc107',
    };
  }

  // Exporter un rack
  exportRack(rack: RackDetail, options: SVGExportOptions = {}): string {
    try {
      const colors = this.getColors();
      const { equipments } = rack;
      const uHeight = 30; // Hauteur d'une unité en pixels
      const padding = 40;
      const rackWidth = 400;
      const totalHeight = this.height;

      let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${this.width}" height="${totalHeight}" viewBox="0 0 ${this.width} ${totalHeight}">`;
      
      // Background
      svg += `<rect width="${this.width}" height="${totalHeight}" fill="${colors.background}"/>`;

      // Title
      svg += `<text x="${padding}" y="${padding}" font-size="24" font-weight="bold" fill="${colors.text}">${rack.name}</text>`;
      svg += `<text x="${padding}" y="${padding + 25}" font-size="14" fill="${colors.text}" opacity="0.7">${rack.code} - ${rack.zone.name}</text>`;

      // Info badges
      let badgeY = padding + 50;
      svg += `<rect x="${padding}" y="${badgeY}" width="120" height="30" rx="4" fill="${colors.primary}" opacity="0.2"/>`;
      svg += `<text x="${padding + 10}" y="${badgeY + 20}" font-size="12" fill="${colors.primary}">${rack.usedHeight}/${rack.height}U</text>`;

      svg += `<rect x="${padding + 130}" y="${badgeY}" width="150" height="30" rx="4" fill="${colors.primary}" opacity="0.2"/>`;
      svg += `<text x="${padding + 140}" y="${badgeY + 20}" font-size="12" fill="${colors.primary}">${equipments.length} équipements</text>`;

      // Rack frame
      const rackY = badgeY + 50;
      svg += `<rect x="${padding}" y="${rackY}" width="${rackWidth}" height="${rack.height * uHeight}" fill="none" stroke="${colors.border}" stroke-width="2"/>`;

      // U markers
      for (let u = 0; u <= rack.height; u++) {
        const y = rackY + (u * uHeight);
        svg += `<line x1="${padding}" y1="${y}" x2="${padding - 10}" y2="${y}" stroke="${colors.border}" stroke-width="1"/>`;
        svg += `<text x="${padding - 15}" y="${y + 5}" font-size="10" text-anchor="end" fill="${colors.text}" opacity="0.5">U${rack.height - u}</text>`;
      }

      // Equipments
      equipments
        .sort((a, b) => b.position - a.position)
        .forEach((eq) => {
          const eqY = rackY + ((rack.height - eq.position - eq.height + 1) * uHeight);
          const eqHeight = eq.height * uHeight;
          const eqColor = eq.networkType === 'IT' ? colors.it : colors.ot;

          // Equipment box
          svg += `<rect x="${padding + 5}" y="${eqY + 2}" width="${rackWidth - 10}" height="${eqHeight - 4}" rx="4" fill="${eqColor}" opacity="0.2" stroke="${eqColor}" stroke-width="2"/>`;

          // Equipment name
          svg += `<text x="${padding + 15}" y="${eqY + (eqHeight / 2) + 5}" font-size="12" font-weight="600" fill="${colors.text}">${eq.name}</text>`;
          
          // Equipment type
          svg += `<text x="${padding + 15}" y="${eqY + (eqHeight / 2) + 20}" font-size="10" fill="${colors.text}" opacity="0.7">${eq.type}</text>`;

          // Status indicator
          const statusColor = eq.status === 'ONLINE' ? colors.online : eq.status === 'OFFLINE' ? colors.offline : colors.warning;
          svg += `<circle cx="${padding + rackWidth - 20}" cy="${eqY + 15}" r="6" fill="${statusColor}"/>`;

          // Network type badge
          svg += `<rect x="${padding + rackWidth - 65}" y="${eqY + 8}" width="35" height="16" rx="8" fill="${eqColor}"/>`;
          svg += `<text x="${padding + rackWidth - 47}" y="${eqY + 19}" font-size="10" font-weight="bold" fill="white" text-anchor="middle">${eq.networkType}</text>`;
        });

      // Legend
      const legendY = rackY + (rack.height * uHeight) + 40;
      svg += `<text x="${padding}" y="${legendY}" font-size="14" font-weight="bold" fill="${colors.text}">Légende</text>`;
      
      // IT
      svg += `<rect x="${padding}" y="${legendY + 10}" width="80" height="20" rx="4" fill="${colors.it}" opacity="0.2"/>`;
      svg += `<text x="${padding + 10}" y="${legendY + 24}" font-size="11" fill="${colors.it}">IT (Informatique)</text>`;

      // OT
      svg += `<rect x="${padding + 100}" y="${legendY + 10}" width="80" height="20" rx="4" fill="${colors.ot}" opacity="0.2"/>`;
      svg += `<text x="${padding + 110}" y="${legendY + 24}" font-size="11" fill="${colors.ot}">OT (Industriel)</text>`;

      // Status
      svg += `<circle cx="${padding}" cy="${legendY + 50}" r="5" fill="${colors.online}"/>`;
      svg += `<text x="${padding + 15}" y="${legendY + 54}" font-size="11" fill="${colors.text}">En ligne</text>`;

      svg += `<circle cx="${padding + 100}" cy="${legendY + 50}" r="5" fill="${colors.offline}"/>`;
      svg += `<text x="${padding + 115}" y="${legendY + 54}" font-size="11" fill="${colors.text}">Hors ligne</text>`;

      // Metadata
      if (options.includeMetadata) {
        svg += `<text x="${padding}" y="${totalHeight - 30}" font-size="10" fill="${colors.text}" opacity="0.5">Généré par InfraMap - ${new Date().toLocaleString('fr-FR')}</text>`;
      }

      svg += '</svg>';
      return svg;
    } catch (error) {
      console.error('SVG Export Error:', error);
      toast.error('Erreur lors de la génération du SVG');
      throw error;
    }
  }

  // Exporter un équipement avec ses ports
  exportEquipment(equipment: EquipmentDetail, options: SVGExportOptions = {}): string {
    try {
      const colors = this.getColors();
      const { ports } = equipment;
      const padding = 40;
      const portHeight = 40;
      const equipmentHeight = 200;
      const totalHeight = equipmentHeight + (ports.length * portHeight) + padding * 4;

      let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${this.width}" height="${totalHeight}" viewBox="0 0 ${this.width} ${totalHeight}">`;
      
      // Background
      svg += `<rect width="${this.width}" height="${totalHeight}" fill="${colors.background}"/>`;

      // Title
      svg += `<text x="${padding}" y="${padding}" font-size="24" font-weight="bold" fill="${colors.text}">${equipment.name}</text>`;
      
      const eqColor = equipment.networkType === 'IT' ? colors.it : colors.ot;
      svg += `<rect x="${padding}" y="${padding + 10}" width="50" height="20" rx="10" fill="${eqColor}"/>`;
      svg += `<text x="${padding + 25}" y="${padding + 24}" font-size="12" font-weight="bold" fill="white" text-anchor="middle">${equipment.networkType}</text>`;

      // Equipment info box
      const infoY = padding + 50;
      svg += `<rect x="${padding}" y="${infoY}" width="${this.width - padding * 2}" height="${equipmentHeight}" rx="8" fill="none" stroke="${colors.border}" stroke-width="2"/>`;

      let textY = infoY + 30;
      const leftCol = padding + 20;
      const rightCol = this.width / 2 + padding;

      // Left column
      svg += `<text x="${leftCol}" y="${textY}" font-size="12" fill="${colors.text}" opacity="0.7">Type:</text>`;
      svg += `<text x="${leftCol}" y="${textY + 20}" font-size="14" font-weight="600" fill="${colors.text}">${equipment.type}</text>`;

      if (equipment.manufacturer) {
        textY += 50;
        svg += `<text x="${leftCol}" y="${textY}" font-size="12" fill="${colors.text}" opacity="0.7">Fabricant:</text>`;
        svg += `<text x="${leftCol}" y="${textY + 20}" font-size="14" fill="${colors.text}">${equipment.manufacturer}</text>`;
      }

      if (equipment.model) {
        textY += 40;
        svg += `<text x="${leftCol}" y="${textY}" font-size="12" fill="${colors.text}" opacity="0.7">Modèle:</text>`;
        svg += `<text x="${leftCol}" y="${textY + 20}" font-size="14" fill="${colors.text}">${equipment.model}</text>`;
      }

      // Right column
      textY = infoY + 30;
      if (equipment.ipAddress) {
        svg += `<text x="${rightCol}" y="${textY}" font-size="12" fill="${colors.text}" opacity="0.7">Adresse IP:</text>`;
        svg += `<text x="${rightCol}" y="${textY + 20}" font-size="14" font-family="monospace" fill="${colors.text}">${equipment.ipAddress}</text>`;
        textY += 50;
      }

      svg += `<text x="${rightCol}" y="${textY}" font-size="12" fill="${colors.text}" opacity="0.7">Statut:</text>`;
      const statusColor = equipment.status === 'ONLINE' ? colors.online : equipment.status === 'OFFLINE' ? colors.offline : colors.warning;
      svg += `<circle cx="${rightCol}" cy="${textY + 15}" r="6" fill="${statusColor}"/>`;
      svg += `<text x="${rightCol + 15}" y="${textY + 20}" font-size="14" fill="${colors.text}">${equipment.status}</text>`;

      textY += 40;
      svg += `<text x="${rightCol}" y="${textY}" font-size="12" fill="${colors.text}" opacity="0.7">Ports:</text>`;
      svg += `<text x="${rightCol}" y="${textY + 20}" font-size="14" fill="${colors.text}">${ports.length}</text>`;

      // Ports section
      const portsY = infoY + equipmentHeight + 30;
      svg += `<text x="${padding}" y="${portsY}" font-size="18" font-weight="bold" fill="${colors.text}">Ports</text>`;

      ports.forEach((port, index) => {
        const portY = portsY + 30 + (index * portHeight);
        const portColor = port.status === 'UP' ? colors.online : port.status === 'DOWN' ? colors.offline : colors.border;

        svg += `<rect x="${padding}" y="${portY}" width="${this.width - padding * 2}" height="${portHeight - 5}" rx="4" fill="${colors.border}" opacity="0.1" stroke="${portColor}" stroke-width="2"/>`;

        // Port name
        svg += `<text x="${padding + 15}" y="${portY + 20}" font-size="14" font-weight="600" fill="${colors.text}">${port.name}</text>`;
        
        // Port type
        svg += `<text x="${padding + 15}" y="${portY + 35}" font-size="11" fill="${colors.text}" opacity="0.7">${port.type}</text>`;

        // Speed
        if (port.speed) {
          svg += `<text x="${this.width / 2}" y="${portY + 20}" font-size="12" fill="${colors.text}">${port.speed}</text>`;
        }

        // Status indicator
        svg += `<circle cx="${this.width - padding - 30}" cy="${portY + 17}" r="6" fill="${portColor}"/>`;
        svg += `<text x="${this.width - padding - 20}" y="${portY + 22}" font-size="11" fill="${colors.text}">${port.status}</text>`;
      });

      // Metadata
      if (options.includeMetadata) {
        svg += `<text x="${padding}" y="${totalHeight - 20}" font-size="10" fill="${colors.text}" opacity="0.5">Généré par InfraMap - ${new Date().toLocaleString('fr-FR')}</text>`;
      }

      svg += '</svg>';
      return svg;
    } catch (error) {
      console.error('SVG Export Error:', error);
      toast.error('Erreur lors de la génération du SVG');
      throw error;
    }
  }

  // Sauvegarder le SVG
  save(svgContent: string, filename: string) {
    try {
      const blob = new Blob([svgContent], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success('SVG exporté avec succès');
    } catch (error) {
      console.error('SVG Save Error:', error);
      toast.error('Erreur lors de la sauvegarde du SVG');
      throw error;
    }
  }

  // Obtenir le SVG comme data URL
  getDataURL(svgContent: string): string {
    return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svgContent)))}`;
  }

  // Obtenir le SVG comme blob
  getBlob(svgContent: string): Blob {
    return new Blob([svgContent], { type: 'image/svg+xml' });
  }
}

// Helper functions
export const exportRackToSVG = (
  rack: RackDetail,
  filename?: string,
  options?: SVGExportOptions
) => {
  const exporter = new SVGExporter(options);
  const svg = exporter.exportRack(rack, options);
  exporter.save(svg, filename || `rack-${rack.name}-${Date.now()}.svg`);
};

export const exportEquipmentToSVG = (
  equipment: EquipmentDetail,
  filename?: string,
  options?: SVGExportOptions
) => {
  const exporter = new SVGExporter(options);
  const svg = exporter.exportEquipment(equipment, options);
  exporter.save(svg, filename || `equipment-${equipment.name}-${Date.now()}.svg`);
};