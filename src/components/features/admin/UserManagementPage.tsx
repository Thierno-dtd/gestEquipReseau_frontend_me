import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, UserPlus, Edit, Trash2, Shield, Mail } from 'lucide-react';
import Loading from '@components/shared/Common/Loading';
import { UserRole } from '@models/auth';
import { getRoleLabel } from '@utils/permissions';

// Mock API (à remplacer par la vraie API)
const mockUsers = [
  {
    id: '1',
    email: 'admin@inframap.com',
    firstName: 'Jean',
    lastName: 'Dupont',
    role: UserRole.ADMIN,
    company: null,
    isActive: true,
    lastLogin: '2024-10-24T10:30:00Z',
    createdAt: '2024-01-15T00:00:00Z',
  },
  {
    id: '2',
    email: 'manager@inframap.com',
    firstName: 'Marie',
    lastName: 'Martin',
    role: UserRole.NETWORK_MANAGER,
    company: null,
    isActive: true,
    lastLogin: '2024-10-24T09:15:00Z',
    createdAt: '2024-02-10T00:00:00Z',
  },
  {
    id: '3',
    email: 'tech@inframap.com',
    firstName: 'Pierre',
    lastName: 'Dubois',
    role: UserRole.TECHNICIAN,
    company: null,
    isActive: true,
    lastLogin: '2024-10-23T16:45:00Z',
    createdAt: '2024-03-05T00:00:00Z',
  },
  {
    id: '4',
    email: 'contractor@prestataire-a.com',
    firstName: 'Sophie',
    lastName: 'Bernard',
    role: UserRole.CONTRACTOR,
    company: 'Prestataire A',
    isActive: true,
    lastLogin: '2024-10-24T08:00:00Z',
    createdAt: '2024-04-20T00:00:00Z',
  },
  {
    id: '5',
    email: 'viewer@inframap.com',
    firstName: 'Luc',
    lastName: 'Petit',
    role: UserRole.VIEWER,
    company: null,
    isActive: false,
    lastLogin: '2024-09-15T14:20:00Z',
    createdAt: '2024-05-30T00:00:00Z',
  },
];

const UserManagementPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<UserRole | 'ALL'>('ALL');
  const [showInactive, setShowInactive] = useState(false);

  // Mock query (à remplacer par useQuery avec la vraie API)
  const { data: users, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: async () => mockUsers,
  });

  const filteredUsers = (users || []).filter(user => {
    const matchSearch = 
      user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.company?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchRole = roleFilter === 'ALL' || user.role === roleFilter;
    const matchActive = showInactive || user.isActive;

    return matchSearch && matchRole && matchActive;
  });

  const getRoleBadgeVariant = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMIN:
        return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400';
      case UserRole.NETWORK_MANAGER:
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400';
      case UserRole.TECHNICIAN:
        return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400';
      case UserRole.CONTRACTOR:
        return 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400';
      case UserRole.VIEWER:
        return 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300';
      default:
        return 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300';
    }
  };

  if (isLoading) {
    return <Loading fullScreen text="Chargement des utilisateurs..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Gestion des utilisateurs
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {filteredUsers.length} utilisateur(s)
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
          <UserPlus className="w-5 h-5" />
          Nouvel utilisateur
        </button>
      </div>

      {/* Filters */}
      <div className="space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher par nom, email ou entreprise..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-gray-900 dark:text-white placeholder:text-gray-400"
          />
        </div>

        {/* Role Filter + Show Inactive */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setRoleFilter('ALL')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              roleFilter === 'ALL'
                ? 'bg-primary text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
            }`}
          >
            Tous
          </button>
          {Object.values(UserRole).map((role) => (
            <button
              key={role}
              onClick={() => setRoleFilter(role)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                roleFilter === role
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
              }`}
            >
              {getRoleLabel(role)}
            </button>
          ))}

          <label className="flex items-center gap-2 ml-auto cursor-pointer">
            <input
              type="checkbox"
              checked={showInactive}
              onChange={(e) => setShowInactive(e.target.checked)}
              className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Afficher inactifs
            </span>
          </label>
        </div>
      </div>

      {/* Users Table/Cards */}
      <div className="space-y-3">
        {filteredUsers.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
            <UserPlus className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 dark:text-gray-400">Aucun utilisateur trouvé</p>
          </div>
        ) : (
          filteredUsers.map((user) => (
            <div
              key={user.id}
              className={`bg-white dark:bg-gray-800 rounded-xl p-5 border transition-all ${
                user.isActive
                  ? 'border-gray-200 dark:border-gray-700 hover:border-primary hover:shadow-md'
                  : 'border-gray-300 dark:border-gray-600 opacity-60'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-4 flex-1">
                  {/* Avatar */}
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                    {user.firstName[0]}{user.lastName[0]}
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {user.firstName} {user.lastName}
                      </h3>
                      {!user.isActive && (
                        <span className="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full">
                          Inactif
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
                      <Mail className="w-4 h-4" />
                      <span>{user.email}</span>
                    </div>

                    {user.company && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {user.company}
                      </p>
                    )}
                  </div>
                </div>

                {/* Role Badge */}
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleBadgeVariant(user.role)}`}>
                  <Shield className="w-3 h-3 inline mr-1" />
                  {getRoleLabel(user.role)}
                </span>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-200 dark:border-gray-700 mb-3">
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Dernière connexion</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {new Date(user.lastLogin).toLocaleDateString('fr-FR')}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Créé le</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg font-medium transition-colors">
                  <Edit className="w-4 h-4" />
                  Modifier
                </button>
                <button className="px-4 py-2 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 rounded-lg font-medium transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total utilisateurs</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {users?.length || 0}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Utilisateurs actifs</p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
            {users?.filter(u => u.isActive).length || 0}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Prestataires</p>
          <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
            {users?.filter(u => u.role === UserRole.CONTRACTOR).length || 0}
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserManagementPage;