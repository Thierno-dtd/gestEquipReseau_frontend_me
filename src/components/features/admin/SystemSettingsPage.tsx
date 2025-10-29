import { useState } from 'react';
import { 
  Settings, 
  Bell, 
  Database, 
  Shield, 
  Mail,
  Download,
  Upload,
  Trash2,
  RefreshCw,
  Check
} from 'lucide-react';
import { toast } from 'sonner';

const SystemSettingsPage = () => {
  const [activeTab, setActiveTab] = useState<'general' | 'notifications' | 'security' | 'data'>('general');
  const [settings, setSettings] = useState({
    // General
    siteName: 'InfraMap',
    language: 'fr',
    timezone: 'Europe/Paris',
    
    // Notifications
    emailNotifications: true,
    pushNotifications: false,
    modificationAlerts: true,
    criticalAlerts: true,
    
    // Security
    sessionTimeout: 30,
    requireMfa: false,
    passwordExpiration: 90,
    
    // Data
    autoBackup: true,
    backupFrequency: 'daily',
    retentionDays: 90,
  });

  const handleSave = () => {
    toast.success('Paramètres sauvegardés');
  };

  const handleExport = () => {
    toast.success('Export des données lancé');
  };

  const handleImport = () => {
    toast.info('Sélectionnez un fichier à importer');
  };

  const handleClearCache = () => {
    toast.success('Cache vidé avec succès');
  };

  const tabs = [
    { id: 'general', label: 'Général', icon: Settings },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Sécurité', icon: Shield },
    { id: 'data', label: 'Données', icon: Database },
  ] as const;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Paramètres système
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Configuration globale de l'application
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 font-medium transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        {/* General Tab */}
        {activeTab === 'general' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Paramètres généraux
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nom de l'application
                </label>
                <input
                  type="text"
                  value={settings.siteName}
                  onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Langue
                </label>
                <select
                  value={settings.language}
                  onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="fr">Français</option>
                  <option value="en">English</option>
                  <option value="es">Español</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Fuseau horaire
                </label>
                <select
                  value={settings.timezone}
                  onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="Europe/Paris">Europe/Paris (CET)</option>
                  <option value="Europe/London">Europe/London (GMT)</option>
                  <option value="America/New_York">America/New_York (EST)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Paramètres de notifications
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      Notifications par email
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Recevoir les alertes par email
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.emailNotifications}
                    onChange={(e) => setSettings({ ...settings, emailNotifications: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                </label>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      Notifications push
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Notifications en temps réel
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.pushNotifications}
                    onChange={(e) => setSettings({ ...settings, pushNotifications: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                </label>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    Alertes de modification
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Notifications pour les modifications en attente
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.modificationAlerts}
                    onChange={(e) => setSettings({ ...settings, modificationAlerts: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                </label>
              </div>

              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    Alertes critiques
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Notifications pour les incidents critiques
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.criticalAlerts}
                    onChange={(e) => setSettings({ ...settings, criticalAlerts: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Paramètres de sécurité
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Timeout de session (minutes)
                </label>
                <input
                  type="number"
                  value={settings.sessionTimeout}
                  onChange={(e) => setSettings({ ...settings, sessionTimeout: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  min="5"
                  max="120"
                />
              </div>

              <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    Authentification à deux facteurs (MFA)
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Exiger MFA pour tous les utilisateurs
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.requireMfa}
                    onChange={(e) => setSettings({ ...settings, requireMfa: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Expiration du mot de passe (jours)
                </label>
                <input
                  type="number"
                  value={settings.passwordExpiration}
                  onChange={(e) => setSettings({ ...settings, passwordExpiration: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  min="30"
                  max="365"
                />
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  Les utilisateurs devront changer leur mot de passe tous les {settings.passwordExpiration} jours
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Data Tab */}
        {activeTab === 'data' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Gestion des données
            </h3>

            {/* Backup Settings */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900 dark:text-white">Sauvegarde automatique</h4>
              
              <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    Activer les sauvegardes automatiques
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Sauvegarde régulière de la base de données
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.autoBackup}
                    onChange={(e) => setSettings({ ...settings, autoBackup: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Fréquence de sauvegarde
                </label>
                <select
                  value={settings.backupFrequency}
                  onChange={(e) => setSettings({ ...settings, backupFrequency: e.target.value })}
                  disabled={!settings.autoBackup}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="hourly">Toutes les heures</option>
                  <option value="daily">Quotidienne</option>
                  <option value="weekly">Hebdomadaire</option>
                  <option value="monthly">Mensuelle</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Durée de rétention (jours)
                </label>
                <input
                  type="number"
                  value={settings.retentionDays}
                  onChange={(e) => setSettings({ ...settings, retentionDays: parseInt(e.target.value) })}
                  disabled={!settings.autoBackup}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  min="7"
                  max="365"
                />
              </div>
            </div>

            {/* Data Actions */}
            <div className="space-y-3 pt-6 border-t border-gray-200 dark:border-gray-700">
              <h4 className="font-medium text-gray-900 dark:text-white mb-3">Actions sur les données</h4>
              
              <button
                onClick={handleExport}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                <Download className="w-5 h-5" />
                Exporter toutes les données
              </button>

              <button
                onClick={handleImport}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <Upload className="w-5 h-5" />
                Importer des données
              </button>

              <button
                onClick={handleClearCache}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 rounded-lg hover:bg-orange-200 dark:hover:bg-orange-900/50 transition-colors"
              >
                <RefreshCw className="w-5 h-5" />
                Vider le cache
              </button>

              <button
                onClick={() => {
                  if (confirm('Êtes-vous sûr de vouloir supprimer toutes les données ? Cette action est irréversible.')) {
                    toast.error('Suppression annulée par sécurité');
                  }
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
              >
                <Trash2 className="w-5 h-5" />
                Supprimer toutes les données
              </button>
            </div>

            {/* Storage Info */}
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-start gap-3">
                <Database className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                <div>
                  <h5 className="font-medium text-blue-900 dark:text-blue-400 mb-1">
                    Informations de stockage
                  </h5>
                  <div className="text-sm text-blue-800 dark:text-blue-500 space-y-1">
                    <p>• Base de données: 2.4 GB</p>
                    <p>• Cache: 156 MB</p>
                    <p>• Dernière sauvegarde: Il y a 2 heures</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Save Button */}
      <div className="flex justify-end gap-3">
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
        >
          <Check className="w-5 h-5" />
          Enregistrer les modifications
        </button>
      </div>
    </div>
  );
};

export default SystemSettingsPage;