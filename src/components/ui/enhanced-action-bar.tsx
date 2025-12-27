"use client";

import React from 'react';
import { Plus, Trash2, Search, Grid3x3, List, Upload, Download, FileDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SearchBar from './search-bar';
import { cn } from '@/lib/utils';

export type FilterPill = {
  label: string;
  value: string;
  color?: 'default' | 'green' | 'red' | 'purple' | 'blue';
};

export type ViewMode = 'grid' | 'list';

interface EnhancedActionBarProps {
  // Search props
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  showSearch?: boolean;

  // Filter pills
  filters?: {
    label?: string;
    options: FilterPill[];
    activeValue: string;
    onChange: (value: string) => void;
  }[];

  // View mode toggle
  viewMode?: ViewMode;
  onViewModeChange?: (mode: ViewMode) => void;
  showViewToggle?: boolean;

  // Primary action button
  onPrimaryAction?: () => void;
  primaryActionLabel?: string;
  primaryActionIcon?: React.ReactNode;
  primaryActionDisabled?: boolean;

  // Secondary actions (rendered before primary action)
  secondaryActions?: React.ReactNode;

  // Layout and styling
  className?: string;
  containerClassName?: string;
}

const EnhancedActionBarComponent: React.FC<EnhancedActionBarProps> = ({
  // Search defaults
  searchValue = "",
  onSearchChange,
  searchPlaceholder = "Search...",
  showSearch = true,

  // Filters
  filters = [],

  // View mode
  viewMode = 'grid',
  onViewModeChange,
  showViewToggle = false,

  // Primary action
  onPrimaryAction,
  primaryActionLabel = "Add",
  primaryActionIcon = <Plus className="h-5 w-5 mr-2" />,
  primaryActionDisabled = false,

  // Secondary actions
  secondaryActions,

  // Styling
  className = "",
  containerClassName = "",
}) => {
  const getFilterPillColor = (color: string = 'default', isActive: boolean) => {
    if (isActive) {
      return 'bg-gray-900 text-white';
    }
    return 'bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-gray-700';
  };

  return (
    <div className={cn(`bg-white border border-[#d5d5dd] rounded-sm py-2 px-2 mb-6 hover:shadow-md transition-shadow duration-200 min-w-0 max-w-full overflow-x-hidden`, containerClassName)}>
      <div className={cn(`flex flex-col xl:flex-row gap-4 items-stretch xl:items-center justify-between min-w-0 max-w-full`, className)}>
        {/* Search */}
        {showSearch && onSearchChange && (
          <div className="flex-1 w-full xl:max-w-md">
            <SearchBar
              searchValue={searchValue}
              onSearchChange={onSearchChange}
              searchPlaceholder={searchPlaceholder}
            />
          </div>
        )}

        {/* Filters & Actions */}
        <div className="flex flex-wrap items-center gap-4 w-full xl:w-auto">
          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-4 flex-1 xl:flex-none">
            {filters.map((filter, filterIndex) => (
              <div key={filterIndex} className="flex flex-wrap gap-2 items-center">
                {filter.label && (
                  <span className="text-[10px] uppercase font-bold text-gray-400 mr-1 tracking-wider">{filter.label}</span>
                )}
                <div className="flex gap-1">
                  {filter.options.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => filter.onChange(option.value)}
                      className={`px-4 py-2 rounded-sm text-sm font-medium transition-all ${getFilterPillColor(
                        option.color,
                        filter.activeValue === option.value
                      )}`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-4 w-full sm:w-auto justify-end sm:justify-start mt-2 sm:mt-0 ml-auto">
            {/* View Mode Toggle */}
            {showViewToggle && onViewModeChange && (
              <div className="flex gap-1 bg-gray-100 p-1 rounded-sm">
                <button
                  onClick={() => onViewModeChange('grid')}
                  className={`p-2 rounded-sm transition-all ${viewMode === 'grid'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                    }`}
                  title="Grid View"
                >
                  <Grid3x3 className="h-5 w-5" />
                </button>
                <button
                  onClick={() => onViewModeChange('list')}
                  className={`p-2 rounded-sm transition-all ${viewMode === 'list'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                    }`}
                  title="List View"
                >
                  <List className="h-5 w-5" />
                </button>
              </div>
            )}

            {/* Secondary Actions */}
            {secondaryActions && (
              <div className="flex items-center gap-2">
                {secondaryActions}
              </div>
            )}

            {/* Primary Action */}
            {onPrimaryAction && (
              <Button
                onClick={onPrimaryAction}
                className="bg-gray-900 hover:bg-black text-white h-[40px] px-6 rounded-sm text-sm font-medium"
                disabled={primaryActionDisabled}
              >
                {primaryActionIcon}
                {primaryActionLabel}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const EnhancedActionBar = React.memo(EnhancedActionBarComponent);
EnhancedActionBar.displayName = 'EnhancedActionBar';

export default EnhancedActionBar;
