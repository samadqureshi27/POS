"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface GridActionButton {
  label: string;
  onClick: () => void;
  variant?: "edit" | "delete" | "custom";
  className?: string;
}

export interface GridActionButtonsProps {
  actions: GridActionButton[];
  className?: string;
}

/**
 * Reusable action buttons component for grid views
 * Matches the style from recipe-management page
 */
export function GridActionButtons({ actions, className }: GridActionButtonsProps) {
  if (actions.length === 0) return null;

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {actions.map((action, index) => {
        const baseClasses = "px-3 py-1 text-sm rounded-sm transition-all cursor-pointer";
        
        let variantClasses = "";
        if (action.variant === "edit") {
          variantClasses = "bg-gray-900 hover:bg-black text-white";
        } else if (action.variant === "delete") {
          variantClasses = "bg-red-600 hover:bg-red-700 text-white";
        } else {
          // Custom variant - use provided className or default
          variantClasses = action.className || "bg-gray-900 hover:bg-black text-white";
        }

        return (
          <button
            key={index}
            onClick={(e) => {
              e.stopPropagation();
              action.onClick();
            }}
            className={cn(baseClasses, variantClasses, action.className)}
          >
            {action.label}
          </button>
        );
      })}
    </div>
  );
}

