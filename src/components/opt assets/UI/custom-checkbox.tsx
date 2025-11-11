"use client";
import React from "react";
import { Checkbox } from "./checkbox";
import { cn } from "@/lib/utils";

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
  // Size-based styling
  const getSizeClasses = () => {
    switch (size) {
      case "small":
        return "scale-110";
      case "medium":
        return "scale-125";
      case "large":
        return "scale-150";
      default:
        return "scale-125";
    }
  };

  return (
    <Checkbox
      checked={checked}
      onCheckedChange={onChange}
      disabled={disabled}
      className={cn(
        getSizeClasses(),
        "data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
        "border-input data-[state=checked]:border-primary",
        className
      )}
    />
  );
};

export default CustomCheckbox;