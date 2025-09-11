import React from "react";
import Checkbox from "@mui/material/Checkbox";

interface CustomCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

const CustomCheckbox: React.FC<CustomCheckboxProps> = ({ 
  checked, 
  onChange, 
  disabled = false 
}) => {
  return (
    <Checkbox
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      disabled={disabled}
      disableRipple
      sx={{
        transform: "scale(1.5)",
        p: 0,
      }}
      icon={
        <svg width="20" height="20" viewBox="0 0 24 24">
          <rect
            x="3"
            y="3"
            width="18"
            height="18"
            rx="3"
            ry="3"
            fill="#e0e0e0"
            stroke="#d1d1d1"
            strokeWidth="2"
          />
        </svg>
      }
      checkedIcon={
        <svg width="20" height="20" viewBox="0 0 24 24">
          <rect
            x="3"
            y="3"
            width="18"
            height="18"
            rx="3"
            ry="3"
            fill="#e0e0e0"
            stroke="#2C2C2C"
            strokeWidth="2"
          />
          <path
            d="M9 12.5l2 2 4-4.5"
            fill="none"
            stroke="#2C2C2C"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      }
    />
  );
};

export default CustomCheckbox;