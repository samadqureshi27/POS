"use client";

import React from "react";

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

const ButtonPage: React.FC<ToggleSwitchProps> = ({
  checked,
  onChange,
  disabled = false,
}) => {
  const handleToggle = () => {
    if (disabled) return;
    onChange(!checked);
  };

  return (
    <label
      className={`
        relative inline-block cursor-pointer w-14 h-8
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
      `}
    >
      <input
        type="checkbox"
        className="sr-only"
        checked={checked}
        onChange={handleToggle}
        disabled={disabled}
      />

      {/* Slider background */}
      <span
        className={`
          absolute inset-0 rounded-xl transition-colors duration-400
          ${checked ? "bg-green-500" : "bg-red-600"}
        `}
      />

      {/* Slider circle */}
      <span
        className={`
          absolute bg-white rounded-lg transition-transform duration-400
          h-6 w-6 left-1 bottom-1
          ${checked ? "translate-x-6" : "translate-x-0"}
        `}
      />
    </label>
  );
};

export default ButtonPage;
