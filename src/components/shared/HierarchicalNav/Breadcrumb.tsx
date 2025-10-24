import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

export interface BreadcrumbItem {
  id: string;
  label: string;
  path: string;
  type: 'site' | 'zone' | 'rack' | 'equipment' | 'port';
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

const Breadcrumb = ({ items, className = '' }: BreadcrumbProps) => {
  const navigate = useNavigate();

  const visibleItems = useMemo(() => {
    // Sur mobile, afficher seulement les 2 derniers items si plus de 3
    if (items.length > 3) {
      return [
        items[0],
        { id: 'ellipsis', label: '...', path: '', type: 'site' as const },
        ...items.slice(-2)
      ];
    }
    return items;
  }, [items]);

  const handleItemClick = (item: BreadcrumbItem) => {
    if (item.id !== 'ellipsis' && item.path) {
      navigate(item.path);
    }
  };

  if (items.length === 0) return null;

  return (
    <nav 
      className={`flex items-center gap-2 overflow-x-auto scrollbar-hide ${className}`}
      aria-label="Breadcrumb"
    >
      <ol className="flex items-center gap-2 text-sm">
        {visibleItems.map((item, index) => {
          const isLast = index === visibleItems.length - 1;
          const isEllipsis = item.id === 'ellipsis';

          return (
            <li key={item.id} className="flex items-center gap-2">
              {/* Breadcrumb item */}
              {isEllipsis ? (
                <span className="text-gray-500 dark:text-gray-400 px-1">
                  {item.label}
                </span>
              ) : isLast ? (
                <span className="font-semibold text-gray-900 dark:text-white whitespace-nowrap">
                  {item.label}
                </span>
              ) : (
                <button
                  onClick={() => handleItemClick(item)}
                  className="text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors whitespace-nowrap"
                >
                  {item.label}
                </button>
              )}

              {/* Separator */}
              {!isLast && (
                <span className="material-symbols-outlined text-base text-gray-400 dark:text-gray-500">
                  chevron_right
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;