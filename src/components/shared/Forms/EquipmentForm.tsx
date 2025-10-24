import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { equipmentSchema, EquipmentFormData } from '@utils/validators';
import { NetworkType, Equipment } from '@models/infrastructure';
import { Save, X } from 'lucide-react';
import { toast } from 'sonner';

interface EquipmentFormProps {
  equipment?: Equipment;
  rackId?: string;
  onSubmit: (data: EquipmentFormData) => void;
  onCancel?: () => void;
  isLoading?: boolean;
}

const EquipmentForm = ({
  equipment,
  rackId,
  onSubmit,
  onCancel,
  isLoading = false,
}: EquipmentFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<EquipmentFormData>({
    resolver: zodResolver(equipmentSchema),
    defaultValues: equipment
      ? {
          name: equipment.name,
          rackId: equipment.rackId,
          type: equipment.type,
          manufacturer: equipment.manufacturer || '',
          model: equipment.model || '',
          serialNumber: equipment.serialNumber || '',
          networkType: equipment.networkType,
          position: equipment.position,
          height: equipment.height,
          ipAddress: equipment.ipAddress || '',
          macAddress: equipment.macAddress || '',
          powerConsumption: equipment.powerConsumption,
          description: equipment.description || '',
        }
      : {
          rackId: rackId || '',
          networkType: NetworkType.IT,
          position: 1,
          height: 1,
        },
  });

  const networkType = watch('networkType');

  const handleFormSubmit = (data: EquipmentFormData) => {
    try {
      onSubmit(data);
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de la soumission');
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Nom de l'équipement */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Nom de l'équipement *
        </label>
        <input
          {...register('name')}
          type="text"
          disabled={!!equipment}
          className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
          placeholder="Ex: Switch-Core-01"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>

      {/* Type de réseau */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Type de réseau *
        </label>
        <div className="flex gap-3">
          <label className="flex-1 cursor-pointer">
            <input
              {...register('networkType')}
              type="radio"
              value={NetworkType.IT}
              className="peer sr-only"
            />
            <div className="px-4 py-3 text-center border-2 border-gray-200 dark:border-gray-700 rounded-lg peer-checked:border-it-blue peer-checked:bg-it-blue/10 peer-checked:text-it-blue transition-all">
              <span className="font-medium">IT</span>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Informatique
              </p>
            </div>
          </label>
          <label className="flex-1 cursor-pointer">
            <input
              {...register('networkType')}
              type="radio"
              value={NetworkType.OT}
              className="peer sr-only"
            />
            <div className="px-4 py-3 text-center border-2 border-gray-200 dark:border-gray-700 rounded-lg peer-checked:border-ot-orange peer-checked:bg-ot-orange/10 peer-checked:text-ot-orange transition-all">
              <span className="font-medium">OT</span>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Industriel
              </p>
            </div>
          </label>
        </div>
        {errors.networkType && (
          <p className="mt-1 text-sm text-red-500">{errors.networkType.message}</p>
        )}
      </div>

      {/* Type d'équipement */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Type d'équipement *
        </label>
        <select
          {...register('type')}
          className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">Sélectionner...</option>
          {networkType === NetworkType.IT ? (
            <>
              <option value="SWITCH">Switch</option>
              <option value="ROUTER">Routeur</option>
              <option value="FIREWALL">Pare-feu</option>
              <option value="SERVER">Serveur</option>
              <option value="ACCESS_POINT">Point d'accès</option>
            </>
          ) : (
            <>
              <option value="PLC">Automate (PLC)</option>
              <option value="HMI">IHM</option>
              <option value="SENSOR">Capteur</option>
              <option value="ACTUATOR">Actionneur</option>
              <option value="SCADA">SCADA</option>
            </>
          )}
          <option value="OTHER">Autre</option>
        </select>
        {errors.type && (
          <p className="mt-1 text-sm text-red-500">{errors.type.message}</p>
        )}
      </div>

      {/* Position et hauteur */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Position (U) *
          </label>
          <input
            {...register('position', { valueAsNumber: true })}
            type="number"
            min="1"
            max="52"
            className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {errors.position && (
            <p className="mt-1 text-sm text-red-500">{errors.position.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Hauteur (U) *
          </label>
          <input
            {...register('height', { valueAsNumber: true })}
            type="number"
            min="1"
            max="10"
            className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {errors.height && (
            <p className="mt-1 text-sm text-red-500">{errors.height.message}</p>
          )}
        </div>
      </div>

      {/* Fabricant et modèle */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Fabricant
          </label>
          <input
            {...register('manufacturer')}
            type="text"
            className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Ex: Cisco"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Modèle
          </label>
          <input
            {...register('model')}
            type="text"
            className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Ex: Catalyst 9300"
          />
        </div>
      </div>

      {/* N° de série */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Numéro de série
        </label>
        <input
          {...register('serialNumber')}
          type="text"
          className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Ex: ABC123456789"
        />
      </div>

      {/* Adresses IP et MAC */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Adresse IP
          </label>
          <input
            {...register('ipAddress')}
            type="text"
            className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary font-mono"
            placeholder="192.168.1.1"
          />
          {errors.ipAddress && (
            <p className="mt-1 text-sm text-red-500">{errors.ipAddress.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Adresse MAC
          </label>
          <input
            {...register('macAddress')}
            type="text"
            className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary font-mono"
            placeholder="00:1A:2B:3C:4D:5E"
          />
        </div>
      </div>

      {/* Consommation */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Consommation (W)
        </label>
        <input
          {...register('powerConsumption', { valueAsNumber: true })}
          type="number"
          min="0"
          step="0.1"
          className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Ex: 250"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Description
        </label>
        <textarea
          {...register('description')}
          rows={3}
          className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
          placeholder="Informations complémentaires..."
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X className="w-5 h-5" />
            Annuler
          </button>
        )}
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Enregistrement...
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              {equipment ? 'Modifier' : 'Créer'}
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default EquipmentForm;