import React from "react";

interface CustomCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

const CustomCheckbox: React.FC<CustomCheckboxProps> = ({
  checked,
  onChange,
  disabled = false
}) => (
  <button
    onClick={() => !disabled && onChange(!checked)}
    disabled={disabled}
    className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-colors ${
      disabled 
        ? 'bg-gray-100 border-gray-300 cursor-not-allowed'
        : checked
        ? 'bg-white border-gray-800'
        : 'bg-white border-gray-300 hover:border-gray-400'
    }`}
  >
    {checked && (
      <svg
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-gray-800"
      >
        <polyline points="20,6 9,17 4,12"></polyline>
      </svg>
    )}
  </button>
);

export default CustomCheckbox;