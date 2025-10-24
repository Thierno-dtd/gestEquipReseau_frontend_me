import { NETWORK_COLORS } from '@utils/colors';
import { Server, Wifi, WifiOff, AlertCircle } from 'lucide-react';

const ITOTLegend = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4 space-y-3">
      <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
        Légende
      </h4>

      {/* Network Types */}
      <div className="space-y-2">
        <p className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase">
          Types de réseau
        </p>
        
        <div className="flex items-center gap-2">
          <div 
            className="w-4 h-4 rounded"
            style={{ backgroundColor: NETWORK_COLORS.IT.primary }}
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Fibre optique
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-8 h-0.5 bg-blue-400" />
          <span className="text-sm text-gray-700 dark:text-gray-300">
            SFP/QSFP
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-8 h-0.5 bg-gray-400 border-dashed border-t-2 border-gray-400" />
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Inactif
          </span>
        </div>
      </div>
    </div>
  );
};

export default ITOTLegend;-300">
            IT (Informatique)
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div 
            className="w-4 h-4 rounded"
            style={{ backgroundColor: NETWORK_COLORS.OT.primary }}
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">
            OT (Opérationnel)
          </span>
        </div>
      </div>

      {/* Status */}
      <div className="space-y-2 pt-2 border-t border-gray-200 dark:border-gray-700">
        <p className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase">
          Statuts
        </p>
        
        <div className="flex items-center gap-2">
          <Wifi className="w-4 h-4 text-green-500" />
          <span className="text-sm text-gray-700 dark:text-gray-300">
            En ligne
          </span>
        </div>

        <div className="flex items-center gap-2">
          <WifiOff className="w-4 h-4 text-red-500" />
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Hors ligne
          </span>
        </div>

        <div className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-yellow-500" />
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Attention
          </span>
        </div>
      </div>

      {/* Ports */}
      <div className="space-y-2 pt-2 border-t border-gray-200 dark:border-gray-700">
        <p className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase">
          Ports
        </p>
        
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-green-500 rounded text-white text-xs flex items-center justify-center font-bold">
            1
          </div>
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Actif
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-red-500 rounded text-white text-xs flex items-center justify-center font-bold">
            2
          </div>
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Inactif
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-gray-300 dark:bg-gray-600 rounded text-gray-700 dark:text-gray-300 text-xs flex items-center justify-center font-bold">
            3
          </div>
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Vide
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-green-500 rounded text-white text-xs flex items-center justify-center font-bold ring-2 ring-blue-400">
            4
          </div>
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Connecté
          </span>
        </div>
      </div>

      {/* Connections */}
      <div className="space-y-2 pt-2 border-t border-gray-200 dark:border-gray-700">
        <p className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase">
          Connexions
        </p>
        
        <div className="flex items-center gap-2">
          <div className="w-8 h-0.5 bg-green-400" />
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Ethernet
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-8 h-0.5 bg-yellow-300" />
          <span className="text-sm text-gray-700 dark:text-gray