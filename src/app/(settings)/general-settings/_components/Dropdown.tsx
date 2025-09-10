import React, { useState, useCallback, useMemo, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { DropdownProps } from '@/types';

const SettingsDropdown = React.memo<DropdownProps>(
  ({ value, options, onValueChange, placeholder }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleToggle = useCallback(() => setIsOpen((prev) => !prev), []);

    const handleSelect = useCallback(
      (optionValue: string) => {
        onValueChange(optionValue);
        setIsOpen(false);
      },
      [onValueChange]
    );

    const selectedLabel = useMemo(
      () => options.find((opt) => opt.value === value)?.label || placeholder,
      [options, value, placeholder]
    );

    // Close dropdown on outside click
    useEffect(() => {
      if (!isOpen) return;

      const handleClickOutside = (event: MouseEvent) => {
        const target = event.target as Element;
        if (!target.closest(".dropdown-container")) {
          setIsOpen(false);
        }
      };

      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }, [isOpen]);

    return (
      <div className="relative dropdown-container">
        <button
          type="button"
          onClick={handleToggle}
          className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#d9d9e1] bg-white text-left flex items-center justify-between"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
        >
          {selectedLabel}
          <ChevronDown size={16} className="text-gray-400" />
        </button>

        {isOpen && (
          <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                className="w-full px-3 py-2 text-left hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
                onClick={() => handleSelect(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }
);

SettingsDropdown.displayName = "SettingsDropdown";
export default SettingsDropdown;