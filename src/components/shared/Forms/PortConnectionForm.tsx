import React, { useState, useEffect } from 'react';
import { Cable, Search, X, Save, AlertCircle, ArrowRight } from 'lucide-react';
import FormLayout from './FormLayout';

interface PortConnectionFormProps {
  sourcePort: PortInfo;
  onSubmit: (connection: ConnectionData) => Promise<void>;
  onCancel: () => void;
  initialData?: Partial<ConnectionData>;
  availableEquipments?: Equipment[];
}

interface PortInfo {
  id: string;
  portNumber: number;
  equipmentId: string;
  equipmentName: string;
}

interface Equipment {
  id: string;
  name: string;
  type: string;
  rackId: string;
  rackName: string;
  ports: Port[];
}

interface Port {
  id: string;
  portNumber: number;
  status: 'available' | 'connected' | 'reserved';
  type?: string;
}

export interface ConnectionData {
  sourcePortId: string;
  targetPortId: string;
  cableType: 'fiber' | 'copper' | 'dac' | 'other';
  cableLength?: number;
  cableColor?: string;
  vlan?: string;
  bandwidth?: string;
  description?: string;
}

const cableTypes = [
  { value: 'fiber', label: 'Fibre optique', color: 'yellow' },
  { value: 'copper', label: 'Câble cuivre', color: 'blue' },
  { value: 'dac', label: 'DAC', color: 'black' },
  { value: 'other', label: 'Autre', color: 'gray' },
];

const cableColors = [
  { value: 'yellow', label: 'Jaune', hex: '#FCD34D' },
  { value: 'blue', label: 'Bleu', hex: '#60A5FA' },
  { value: 'red', label: 'Rouge', hex: '#F87171' },
  { value: 'green', label: 'Vert', hex: '#4ADE80' },
  { value: 'orange', label: 'Orange', hex: '#FB923C' },
  { value: 'black', label: 'Noir', hex: '#374151' },
  { value: 'white', label: 'Blanc', hex: '#F3F4F6' },
  { value: 'gray', label: 'Gris', hex: '#9CA3AF' },
];

const PortConnectionForm: React.FC<PortConnectionFormProps> = ({
  sourcePort,
  onSubmit,
  onCancel,
  initialData,
  availableEquipments = [],
}) => {
  const [formData, setFormData] = useState<ConnectionData>({
    sourcePortId: sourcePort.id,
    targetPortId: initialData?.targetPortId || '',
    cableType: initialData?.cableType || 'fiber',
    cableLength: initialData?.cableLength,
    cableColor: initialData?.cableColor || 'blue',
    vlan: initialData?.vlan || '',
    bandwidth: initialData?.bandwidth || '1G',
    description: initialData?.description || '',
  });

  const [selectedEquipment, setSelectedEquipment] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredEquipments = availableEquipments.filter((eq) =>
    eq.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    eq.rackName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedEquipmentData = availableEquipments.find(
    (eq) => eq.id === selectedEquipment
  );

  const availablePorts = selectedEquipmentData?.ports.filter(
    (port) => port.status === 'available'
  ) || [];

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.targetPortId) {
      newErrors.targetPortId = 'Vous devez sélectionner un port de destination';
    }

    if (formData.cableLength && (formData.cableLength < 0 || formData.cableLength > 1000)) {
      newErrors.cableLength = 'La longueur doit être entre 0 et 1000 m';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Error submitting connection:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: keyof ConnectionData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <FormLayout
      title="Connecter un port"
      onClose={onCancel}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Port source */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-blue-900 mb-2">Port source</h3>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Cable className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-medium text-gray-900">{sourcePort.equipmentName}</div>
              <div className="text-sm text-gray-600">Port {sourcePort.portNumber}</div>
            </div>
          </div>
        </div>

        {/* Type de câble */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Type de câble *
          </label>
          <div className="grid grid-cols-2 gap-3">
            {cableTypes.map(({ value, label }) => (
              <button
                key={value}
                type="button"
                onClick={() => handleChange('cableType', value)}
                className={`p-3 rounded-lg border-2 transition-all ${
                  formData.cableType === value
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <span className="text-sm font-medium">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Couleur du câble */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Couleur du câble
          </label>
          <div className="grid grid-cols-4 gap-2">
            {cableColors.map(({ value, label, hex }) => (
              <button
                key={value}
                type="button"
                onClick={() => handleChange('cableColor', value)}
                className={`p-2 rounded-lg border-2 transition-all ${
                  formData.cableColor === value
                    ? 'border-blue-500'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <div
                  className="w-full h-8 rounded mb-1"
                  style={{ backgroundColor: hex }}
                />
                <span className="text-xs">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Longueur du câble */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Longueur (mètres)
            </label>
            <input
              type="number"
              min="0"
              max="1000"
              step="0.1"
              value={formData.cableLength || ''}
              onChange={(e) => handleChange('cableLength', parseFloat(e.target.value))}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.cableLength ? 'border-red-500' : 'border-gray-300 focus:ring-blue-500'
              }`}
              placeholder="Ex: 5"
            />
            {errors.cableLength && (
              <p className="mt-1 text-sm text-red-600">{errors.cableLength}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bande passante
            </label>
            <select
              value={formData.bandwidth}
              onChange={(e) => handleChange('bandwidth', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="100M">100 Mbps</option>
              <option value="1G">1 Gbps</option>
              <option value="10G">10 Gbps</option>
              <option value="40G">40 Gbps</option>
              <option value="100G">100 Gbps</option>
            </select>
          </div>
        </div>

        {/* VLAN */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            VLAN
          </label>
          <input
            type="text"
            value={formData.vlan}
            onChange={(e) => handleChange('vlan', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ex: 100, 200-210"
          />
        </div>

        {/* Recherche équipement destination */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Équipement de destination *
          </label>
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher un équipement..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Liste des équipements */}
          <div className="border border-gray-300 rounded-lg max-h-48 overflow-y-auto">
            {filteredEquipments.length > 0 ? (
              filteredEquipments.map((equipment) => (
                <button
                  key={equipment.id}
                  type="button"
                  onClick={() => setSelectedEquipment(equipment.id)}
                  className={`w-full text-left p-3 border-b last:border-b-0 hover:bg-gray-50 transition-colors ${
                    selectedEquipment === equipment.id ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="font-medium text-gray-900">{equipment.name}</div>
                  <div className="text-sm text-gray-600">
                    {equipment.type} • {equipment.rackName}
                  </div>
                </button>
              ))
            ) : (
              <div className="p-4 text-center text-gray-500 text-sm">
                Aucun équipement trouvé
              </div>
            )}
          </div>
        </div>

        {/* Sélection du port destination */}
        {selectedEquipment && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Port de destination *
            </label>
            {availablePorts.length > 0 ? (
              <div className="grid grid-cols-4 md:grid-cols-6 gap-2 max-h-48 overflow-y-auto">
                {availablePorts.map((port) => (
                  <button
                    key={port.id}
                    type="button"
                    onClick={() => handleChange('targetPortId', port.id)}
                    className={`p-3 rounded-lg border-2 text-center transition-all ${
                      formData.targetPortId === port.id
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="text-sm font-medium">{port.portNumber}</div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                <AlertCircle className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
                <p className="text-sm text-yellow-700">
                  Aucun port disponible sur cet équipement
                </p>
              </div>
            )}
            {errors.targetPortId && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.targetPortId}
              </p>
            )}
          </div>
        )}

        {/* Aperçu de la connexion */}
        {formData.targetPortId && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-green-900 mb-3">Aperçu de la connexion</h3>
            <div className="flex items-center justify-between">
              <div className="text-center">
                <div className="font-medium text-gray-900">{sourcePort.equipmentName}</div>
                <div className="text-sm text-gray-600">Port {sourcePort.portNumber}</div>
              </div>
              <div className="flex items-center gap-2 text-green-600">
                <ArrowRight className="w-5 h-5" />
                <Cable className="w-5 h-5" />
                <ArrowRight className="w-5 h-5" />
              </div>
              <div className="text-center">
                <div className="font-medium text-gray-900">
                  {selectedEquipmentData?.name}
                </div>
                <div className="text-sm text-gray-600">
                  Port{' '}
                  {
                    availablePorts.find((p) => p.id === formData.targetPortId)
                      ?.portNumber
                  }
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Notes sur cette connexion..."
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <X className="w-4 h-4 inline mr-2" />
            Annuler
          </button>
          <button
            type="submit"
            disabled={isSubmitting || !formData.targetPortId}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4 inline mr-2" />
            {isSubmitting ? 'Connexion...' : 'Connecter'}
          </button>
        </div>
      </form>
    </FormLayout>
  );
};

export default PortConnectionForm;