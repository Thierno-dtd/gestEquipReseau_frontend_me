import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { infrastructureAPI } from '@services/api';
import { Building2, ChevronDown, Search, MapPin, Check } from 'lucide-react';
import { Site } from '@models/infrastructure';
import Loading from '@components/shared/Common/Loading';

interface SiteSelectorProps {
  selectedSiteId?: string;
  onSiteSelect?: (site: Site) => void;
  className?: string;
  showSearch?: boolean;
}

const SiteSelector = ({ 
  selectedSiteId, 
  onSiteSelect,
  className = '',
  showSearch = true
}: SiteSelectorProps) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch sites
  const { data: sitesData, isLoading } = useQuery({
    queryKey: ['sites'],
    queryFn: () => infrastructureAPI.getSites(),
  });

  const sites = sitesData?.data || [];
  const selectedSite = sites.find(site => site.id === selectedSiteId);

  // Filter sites based on search
  const filteredSites = sites.filter(site =>
    site.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    site.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
    site.country.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle site selection
  const handleSiteSelect = (site: Site) => {
    if (onSiteSelect) {
      onSiteSelect(site);
    } else {
      navigate(`/sites/${site.id}`);
    }
    setIsOpen(false);
    setSearchQuery('');
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.site-selector-container')) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className={`relative site-selector-container ${className}`}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-3 px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Building2 className="w-5 h-5 text-primary" />
          </div>
          
          {selectedSite ? (
            <div className="flex-1 min-w-0 text-left">
              <p className="font-semibold text-gray-900 dark:text-white truncate">
                {selectedSite.name}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                {selectedSite.city}, {selectedSite.country}
              </p>
            </div>
          ) : (
            <span className="text-gray-600 dark:text-gray-400">
              Sélectionner un site
            </span>
          )}
        </div>

        <ChevronDown 
          className={`w-5 h-5 text-gray-400 transition-transform flex-shrink-0 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 mt-2 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl max-h-96 overflow-hidden">
          {/* Search */}
          {showSearch && (
            <div className="p-3 border-b border-gray-200 dark:border-gray-700">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher un site..."
                  className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  autoFocus
                />
              </div>
            </div>
          )}

          {/* Sites List */}
          <div className="overflow-y-auto max-h-80">
            {isLoading ? (
              <div className="p-8">
                <Loading text="Chargement des sites..." />
              </div>
            ) : filteredSites.length === 0 ? (
              <div className="p-8 text-center">
                <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 dark:text-gray-400">
                  {searchQuery ? 'Aucun site trouvé' : 'Aucun site disponible'}
                </p>
              </div>
            ) : (
              <div className="py-2">
                {filteredSites.map((site) => {
                  const isSelected = site.id === selectedSiteId;

                  return (
                    <button
                      key={site.id}
                      onClick={() => handleSiteSelect(site)}
                      className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                        isSelected ? 'bg-primary/10 dark:bg-primary/20' : ''
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        isSelected ? 'bg-primary/20' : 'bg-gray-100 dark:bg-gray-900'
                      }`}>
                        <Building2 className={`w-5 h-5 ${
                          isSelected ? 'text-primary' : 'text-gray-600 dark:text-gray-400'
                        }`} />
                      </div>

                      <div className="flex-1 min-w-0 text-left">
                        <div className="flex items-center gap-2 mb-1">
                          <p className={`font-semibold truncate ${
                            isSelected 
                              ? 'text-primary' 
                              : 'text-gray-900 dark:text-white'
                          }`}>
                            {site.name}
                          </p>
                          {isSelected && (
                            <Check className="w-4 h-4 text-primary flex-shrink-0" />
                          )}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                          <MapPin className="w-3 h-3" />
                          <span className="truncate">
                            {site.city}, {site.country}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-1 flex-shrink-0">
                        <span className="text-xs font-medium text-gray-900 dark:text-white">
                          {site.zonesCount} zones
                        </span>
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                          {site.racksCount} baies
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SiteSelector;