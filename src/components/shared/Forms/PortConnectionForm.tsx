import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { connectionSchema, ConnectionFormData } from '@utils/validators';
import { ConnectionType } from '@models/infrastructure';
import { Cable, Save, X } from 'lucide-react';

interface PortConnectionFormProps {
  sourcePortId?: string;
  onSubmit: (data: ConnectionFormData) => void;
  onCancel?: () => void;
  isLoading?: boolean;
}

const PortConnectionForm = ({
  sourcePortId,
  onSubmit,
  onCancel,
  isLoading = false,
}: PortConnectionFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ConnectionFormData>({
    resolver: zodResolver(connectionSchema),
    defaultValues: {
      sourcePortId: sourcePortId || '',
      type: ConnectionType.COPPER,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Port source (si pas fourni) */}
      {!sourcePortId && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Port source *
          </label>
          <input
            {...register('sourcePortId')}
            type="text"
            className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Rechercher un port..."
          />
          {errors.sourcePortId && (
            <p className="mt-1 text-sm text-red-500">{errors.sourcePortId.message}</p>
          )}
        </div>
      )}

      {/* Port cible */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Port de destination *
        </label>
        <input
          {...register('targetPortId')}
          type="text"
          className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Rechercher un port..."
        />
        {errors.targetPortId && (
          <p className="mt-1 text-sm text-red-500">{errors.targetPortId.message}</p>
        )}
      </div>

      {/* Type de connexion */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Type de câble *
        </label>
        <div className="grid grid-cols-3 gap-3">
          {Object.values(ConnectionType).map((type) => (
            <label key={type} className="cursor-pointer">
              <input
                {...register('type')}
                type="radio"
                value={type}
                className="peer sr-only"
              />
              <div className="px-4 py-3 text-center border-2 border-gray-200 dark:border-gray-700 rounded-lg peer-checked:border-primary peer-checked:bg-primary/10 peer-checked:text-primary transition-all">
                <Cable className="w-5 h-5 mx-auto mb-1" />
                <span className="text-xs font-medium">{type}</span>
              </div>
            </label>
          ))}
        </div>
        {errors.type && (
          <p className="mt-1 text-sm text-red-500">{errors.type.message}</p>
        )}
      </div>

      {/* Longueur et type de câble */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Longueur (m)
          </label>
          <input
            {...register('length', { valueAsNumber: true })}
            type="number"
            min="0"
            step="0.1"
            className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Ex: 5"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Référence câble
          </label>
          <input
            {...register('cableType')}
            type="text"
            className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Ex: Cat6"
          />
        </div>
      </div>

      {/* Label */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Label / Étiquette
        </label>
        <input
          {...register('label')}
          type="text"
          className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Ex: LINK-A01-B02"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg font-medium transition-colors"
          >
            <X className="w-5 h-5" />
            Annuler
          </button>
        )}
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium transition-colors"
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Création...
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              Créer la connexion
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default PortConnectionForm;