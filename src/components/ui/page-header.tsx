<<<<<<< HEAD
/**
 * PageHeader Component
 *
 * Standardized page header with consistent styling across all pages.
 * Supports optional actions/buttons on the right side.
 */

import React from "react";
import { cn } from "@/lib/utils";

export interface PageHeaderProps {
  /** Main page title */
  title: string;

  /** Optional subtitle/description */
  subtitle?: string;

  /** Optional actions/buttons to display on the right */
  actions?: React.ReactNode;

  /** Custom className for the container */
  className?: string;

  /** Custom className for the title */
  titleClassName?: string;
}

const PageHeaderComponent: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  actions,
  className,
  titleClassName,
}) => {
  return (
    <div className={cn(
      "flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8",
      className
    )}>
      <div className="flex-1">
        <h1 className={cn(
          "text-3xl font-semibold tracking-tight text-foreground",
          titleClassName
        )}>
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm text-muted-foreground mt-1">
            {subtitle}
          </p>
        )}
      </div>

      {actions && (
        <div className="flex items-center gap-2">
          {actions}
        </div>
      )}
    </div>
  );
};

export const PageHeader = React.memo(PageHeaderComponent);
PageHeader.displayName = 'PageHeader';

export default PageHeader;
=======
/**
 * PageHeader Component
 *
 * Standardized page header with consistent styling across all pages.
 * Supports optional actions/buttons on the right side.
 */

import React from "react";
import { cn } from "@/lib/utils";

export interface PageHeaderProps {
  /** Main page title */
  title: string;

  /** Optional subtitle/description */
  subtitle?: string;

  /** Optional actions/buttons to display on the right */
  actions?: React.ReactNode;

  /** Custom className for the container */
  className?: string;

  /** Custom className for the title */
  titleClassName?: string;
}

const PageHeaderComponent: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  actions,
  className,
  titleClassName,
}) => {
  return (
    <div className={cn(
      "flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8",
      className
    )}>
      <div className="flex-1">
        <h1 className={cn(
          "text-3xl font-semibold tracking-tight text-foreground",
          titleClassName
        )}>
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm text-muted-foreground mt-1">
            {subtitle}
          </p>
        )}
      </div>

      {actions && (
        <div className="flex items-center gap-2">
          {actions}
        </div>
      )}
    </div>
  );
};

export const PageHeader = React.memo(PageHeaderComponent);
PageHeader.displayName = 'PageHeader';

export default PageHeader;
>>>>>>> 69081f1dbe186cba9b8621cfc2802f1b2f2b1f15
