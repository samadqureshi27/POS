/**
 * PageContainer Component
 *
 * Standardized page container with consistent padding and layout.
 * Use this as the root wrapper for all pages to ensure consistent spacing.
 */

import React from "react";
import { cn } from "@/lib/utils";

export interface PageContainerProps {
  /** Page content */
  children: React.ReactNode;

  /** Custom className */
  className?: string;

  /**
   * Padding variant
   * - "default": p-6 (24px)
   * - "tight": p-4 (16px)
   * - "none": no padding
   */
  padding?: "default" | "tight" | "none";

  /**
   * Max width constraint
   * - "full": w-full (no constraint)
   * - "container": max-w-7xl mx-auto
   */
  maxWidth?: "full" | "container";

  /**
   * Whether this page has a submenu
   * Adds top margin to account for fixed submenu positioning
   */
  hasSubmenu?: boolean;
}

export const PageContainer: React.FC<PageContainerProps> = ({
  children,
  className,
  padding = "default",
  maxWidth = "full",
  hasSubmenu = false,
}) => {
  return (
    <div className={cn(
      "min-h-screen bg-background",
      padding === "default" && "p-6",
      padding === "tight" && "p-4",
      maxWidth === "container" && "max-w-7xl mx-auto",
      maxWidth === "full" && "w-full",
      hasSubmenu && "pt-16", // Add top padding for submenu clearance
      className
    )}>
      {children}
    </div>
  );
};

/**
 * Standard spacing constants for consistent gaps throughout the app
 */
export const SPACING = {
  /** Gap between major sections (e.g., header to content): 32px */
  section: "mb-8",

  /** Gap between cards in a grid: 24px */
  cardGrid: "gap-6",

  /** Gap between form elements: 24px */
  form: "gap-6",

  /** Gap within a card (between elements): 16px */
  cardContent: "gap-4",

  /** Small gap for inline elements: 8px */
  inline: "gap-2",
} as const;

export default PageContainer;
