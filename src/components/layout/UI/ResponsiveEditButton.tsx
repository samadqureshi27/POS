import React from 'react';
import { Edit } from 'lucide-react';

interface ResponsiveEditButtonProps {
  onClick: (e: React.MouseEvent) => void;
  disabled?: boolean;
  className?: string;
}

const ResponsiveEditButton: React.FC<ResponsiveEditButtonProps> = ({ 
  onClick, 
  disabled = false, 
  className = '' 
}) => {
  return (
    <>
      {/* Desktop Edit Icon - Hidden on mobile */}
      <button
        onClick={onClick}
        disabled={disabled}
        className={`desktop-edit-icon cursor-pointer text-gray-600 hover:text-gray-800 p-1 ${className} ${
          disabled ? 'opacity-50' : ''
        }`}
        title="Edit"
      >
        <Edit size={16} />
      </button>

      {/* Mobile Edit Button - Hidden on desktop */}
      <button
        onClick={onClick}
        disabled={disabled}
        className={`mobile-edit-button w-full bg-[#2C2C2C] text-white hover:bg-gray-700 px-4 py-2 rounded-sm transition-colors flex cursor-pointer items-center justify-center gap-2 mt-3 ${className} ${
          disabled ? 'opacity-50  bg-gray-400' : ''
        }`}
      >
        <Edit size={16} />
        Edit
      </button>
    </>
  );
};

export default ResponsiveEditButton;