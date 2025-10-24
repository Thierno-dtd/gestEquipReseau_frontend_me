import React from 'react';
import { X } from 'lucide-react';

interface FormLayoutProps {
  title: string;
  subtitle?: string;
  onClose?: () => void;
  children: React.ReactNode;
  width?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

const widthClasses = {
  sm: 'max-w-md',
  md: 'max-w-2xl',
  lg: 'max-w-4xl',
  xl: 'max-w-6xl',
  full: 'max-w-full',
};

const FormLayout: React.FC<FormLayoutProps> = ({
  title,
  subtitle,
  onClose,
  children,
  width = 'lg',
}) => {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className={`relative bg-white rounded-lg shadow-2xl w-full ${widthClasses[width]} transform transition-all`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="border-b border-gray-200 px-6 py-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-900">
                  {title}
                </h2>
                {subtitle && (
                  <p className="mt-1 text-sm text-gray-600">{subtitle}</p>
                )}
              </div>
              {onClose && (
                <button
                  type="button"
                  onClick={onClose}
                  className="ml-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="Fermer"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-6 max-h-[calc(100vh-200px)] overflow-y-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormLayout;