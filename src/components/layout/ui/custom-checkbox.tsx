import React from "react";
import Checkbox from "@mui/material/Checkbox";

interface CustomCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
  size?: "small" | "medium" | "large";
}

const CustomCheckbox: React.FC<CustomCheckboxProps> = ({
  checked,
  onChange,
  disabled = false,
  className = "",
  size = "medium"
}) => {
  // Scale based on size
  const getScale = () => {
    switch (size) {
      case "small": return "scale(1.2)";
      case "medium": return "scale(1.5)";
      case "large": return "scale(1.8)";
      default: return "scale(1.5)";
    }
  };

  // SVG size based on size
  const getSvgSize = () => {
    switch (size) {
      case "small": return { width: "16", height: "16" };
      case "medium": return { width: "20", height: "20" };
      case "large": return { width: "24", height: "24" };
      default: return { width: "20", height: "20" };
    }
  };

  const svgSize = getSvgSize();

  const uncheckedIcon = (
    <svg width={svgSize.width} height={svgSize.height} viewBox="0 0 24 24">
      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="3"
        ry="3"
        fill="#e0e0e0" // grey inside
        stroke="#d1d1d1" // border grey
        strokeWidth="2"
      />
    </svg>
  );

  const checkedIcon = (
    <svg width={svgSize.width} height={svgSize.height} viewBox="0 0 24 24">
      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="3"
        ry="3"
        fill="#e0e0e0" // grey inside
        stroke="#2C2C2C" // dark border
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
  );

  return (
    <Checkbox
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      disabled={disabled}
      disableRipple
      className={className}
      sx={{
        transform: getScale(),
        p: 0, // remove extra padding
        '&.Mui-disabled': {
          opacity: 0.5,
        },
      }}
      icon={uncheckedIcon}
      checkedIcon={checkedIcon}
    />
  );
};

export default CustomCheckbox;