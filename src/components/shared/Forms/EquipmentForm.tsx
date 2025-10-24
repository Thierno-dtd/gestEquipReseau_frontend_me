import React, { useState } from 'react';
import { Server, Wifi, HardDrive, X, Save, AlertCircle } from 'lucide-react';
import FormLayout from './FormLayout';

interface EquipmentFormProps {
  rackId: string;
  onSubmit: (equipment: EquipmentData) => Promise<void>;
  onCancel: () => void;
  initialData?: Partial<EquipmentData>;
  mode?: 'create' | 'edit';
}

export interface EquipmentData {
  name: string;
  type: 'switch' | 'router' | 'server' | 'firewall' | 'storage' | 'other';
  manufacturer: string;
  model: string;
  serialNumber: string;
  rackUnit: number;
  height: number; // Nombre de U occupés
  networkType: 'IT' | 'OT';
  ipAddress?: string;
  macAddress?: string;
  description?: string;
  portCount: number;
}

const equipmentTypes = [
  { value: 'switch', label: 'Switch', icon: Wifi },
  { value: 'router', label: 'Routeur', icon: Wifi },
  { value: 'server', label: 'Serveur', icon: Server },
  { value: 'firewall', label: 'Firewall', icon: Server },
  { value: 'storage', label: 'Stockage', icon: HardDrive },
  { value: 'other', label: 'Autre', icon: Server },
];

const EquipmentForm: React.FC<EquipmentFormProps> = ({
  rackId,
  onSubmit,
  onCancel,
  initialData,
  mode = 'create',
}) => {
  const [formData, setFormData] = useState<EquipmentData>({
    name: initialData?.name || '',
    type: initialData?.type || 'switch',
    manufacturer: initialData?.manufacturer || '',
    model: initialData?.model || '',
    serialNumber: initialData?.serialNumber || '',
    rackUnit: initialData?.rackUnit || 1,
    height: initialData?.height || 1,
    networkType: initialData?.networkType || 'IT',
    ipAddress: initialData?.ipAddress || '',
    macAddress: initialData?.macAddress || '',
    description: initialData?.description || '',
    portCount: initialData?.portCount || 24,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Le nom est requis';
    }

    if (!formData.manufacturer.trim()) {
      newErrors.manufacturer = 'Le fabricant est requis';
    }

    if (!formData.model.trim()) {
      newErrors.model = 'Le modèle est requis';
    }

    if (formData.rackUnit < 1 || formData.rackUnit > 42) {
      newErrors.rackUnit = 'L\'unité de rack doit être entre 1 et 42';
    }

    if (formData.height < 1 || formData.height > 10) {
      newErrors.height = 'La hauteur doit être entre 1 et 10 U';
    }

    if (formData.portCount < 1 || formData.portCount > 96) {
      newErrors.portCount = 'Le nombre de ports doit être entre 1 et 96';
    }

    if (formData.ipAddress && !/^(\d{1,3}\.){3}\d{1,3}$/.test(formData.ipAddress)) {
      newErrors.ipAddress = 'Adresse IP invalide';
    }

    if (formData.macAddress && !/^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/.test(formData.macAddress)) {
      newErrors.macAddress = 'Adresse MAC invalide';
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
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: keyof EquipmentData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <FormLayout
      title={mode === 'create' ? 'Ajouter un équipement' : 'Modifier l\'équipement'}
      onClose={onCancel}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Type d'équipement */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Type d'équipement *
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {equipmentTypes.map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                type="button"
                onClick={() => handleChange('type', value)}
                className={`flex items-center gap-2 p-3 rounded-lg border-2 transition-all ${
                  formData.type === value
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm font-medium">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Type de réseau */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Type de réseau *
          </label>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => handleChange('networkType', 'IT')}
              className={`flex-1 p-3 rounded-lg border-2 transition-all ${
                formData.networkType === 'IT'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <div className="font-semibold">IT</div>
              <div className="text-xs text-gray-600">Informatique</div>
            </button>
            <button
              type="button"
              onClick={() => handleChange('networkType', 'OT')}
              className={`flex-1 p-3 rounded-lg border-2 transition-all ${
                formData.networkType === 'OT'
                  ? 'border-orange-500 bg-orange-50 text-orange-700'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <div className="font-semibold">OT</div>
              <div className="text-xs text-gray-600">Industriel</div>
            </button>
          </div>
        </div>

        {/* Informations générales */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nom *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.name ? 'border-red-500' : 'border-gray-300 focus:ring-blue-500'
              }`}
              placeholder="Ex: SW-PROD-01"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.name}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fabricant *
            </label>
            <input
              type="text"
              value={formData.manufacturer}
              onChange={(e) => handleChange('manufacturer', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.manufacturer ? 'border-red-500' : 'border-gray-300 focus:ring-blue-500'
              }`}
              placeholder="Ex: Cisco"
            />
            {errors.manufacturer && (
              <p className="mt-1 text-sm text-red-600">{errors.manufacturer}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Modèle *
            </label>
            <input
              type="text"
              value={formData.model}
              onChange={(e) => handleChange('model', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.model ? 'border-red-500' : 'border-gray-300 focus:ring-blue-500'
              }`}
              placeholder="Ex: Catalyst 2960"
            />
            {errors.model && (
              <p className="mt-1 text-sm text-red-600">{errors.model}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Numéro de série
            </label>
            <input
              type="text"
              value={formData.serialNumber}
              onChange={(e) => handleChange('serialNumber', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ex: FCW1234A5B6"
            />
          </div>
        </div>

        {/* Position dans le rack */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Unité de rack *
            </label>
            <input
              type="number"
              min="1"
              max="42"
              value={formData.rackUnit}
              onChange={(e) => handleChange('rackUnit', parseInt(e.target.value))}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.rackUnit ? 'border-red-500' : 'border-gray-300 focus:ring-blue-500'
              }`}
            />
            {errors.rackUnit && (
              <p className="mt-1 text-sm text-red-600">{errors.rackUnit}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hauteur (U) *
            </label>
            <input
              type="number"
              min="1"
              max="10"
              value={formData.height}
              onChange={(e) => handleChange('height', parseInt(e.target.value))}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.height ? 'border-red-500' : 'border-gray-300 focus:ring-blue-500'
              }`}
            />
            {errors.height && (
              <p className="mt-1 text-sm text-red-600">{errors.height}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre de ports *
            </label>
            <input
              type="number"
              min="1"
              max="96"
              value={formData.portCount}
              onChange={(e) => handleChange('portCount', parseInt(e.target.value))}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.portCount ? 'border-red-500' : 'border-gray-300 focus:ring-blue-500'
              }`}
            />
            {errors.portCount && (
              <p className="mt-1 text-sm text-red-600">{errors.portCount}</p>
            )}
          </div>
        </div>

        {/* Réseau */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Adresse IP
            </label>
            <input
              type="text"
              value={formData.ipAddress}
              onChange={(e) => handleChange('ipAddress', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.ipAddress ? 'border-red-500' : 'border-gray-300 focus:ring-blue-500'
              }`}
              placeholder="192.168.1.1"
            />
            {errors.ipAddress && (
              <p className="mt-1 text-sm text-red-600">{errors.ipAddress}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Adresse MAC
            </label>
            <input
              type="text"
              value={formData.macAddress}
              onChange={(e) => handleChange('macAddress', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.macAddress ? 'border-red-500' : 'border-gray-300 focus:ring-blue-500'
              }`}
              placeholder="00:1A:2B:3C:4D:5E"
            />
            {errors.macAddress && (
              <p className="mt-1 text-sm text-red-600">{errors.macAddress}</p>
            )}
          </div>
        </div>

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
            placeholder="Notes ou informations supplémentaires..."
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
            disabled={isSubmitting}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4 inline mr-2" />
            {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </div>
      </form>
    </FormLayout>
  );
};

export default EquipmentForm;