import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

interface FilterOption {
  value: string;
  label: string;
  className?: string;
}

interface FilterDropdownProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: FilterOption[];
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({ 
  label, 
  value, 
  onChange, 
  options 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
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
    <div className="relative" ref={dropdownRef}>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="px-2 py-1 rounded text-sm bg-transparent border-none outline-none hover:bg-transparent flex items-center gap-2 focus:outline-none focus:ring-0 cursor-pointer"
      >
        {value || label}
        <ChevronDown size={14} className="text-gray-500 ml-auto" />
      </div>
      {isOpen && (
        <div className="absolute z-50 mt-1 min-w-[200px] bg-white rounded-sm shadow-lg border border-gray-200 py-1">
          {options.map((option) => (
            <div
              key={option.value}
              className={`px-3 py-1 text-sm cursor-pointer hover:bg-gray-100 ${option.className || ''}`}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FilterDropdown;