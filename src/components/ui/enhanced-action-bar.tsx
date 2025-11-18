"use client";

import React from 'react';
import { Plus, Trash2, Search, Grid3x3, List, Upload, Download, FileDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

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
      switch (color) {
        case 'green':
          return 'bg-green-600 text-white';
        case 'red':
          return 'bg-red-600 text-white';
        case 'purple':
          return 'bg-purple-600 text-white';
        case 'blue':
          return 'bg-blue-600 text-white';
        default:
          return 'bg-gray-900 text-white';
      }
    }
    return 'bg-gray-100 text-gray-700 hover:bg-gray-200';
  };

  return (
    <div className={`bg-white border border-grey rounded-lg p-4 mb-6 hover:shadow-lg transition-shadow duration-200 ${containerClassName}`}>
      <div className={`flex flex-col lg:flex-row gap-4 items-center justify-between ${className}`}>
        {/* Search */}
        {showSearch && onSearchChange && (
          <div className="relative flex-1 w-full lg:max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-12 bg-gray-50 border-gray-300 h-11"
            />
          </div>
        )}

        {/* Filters & Actions */}
        <div className="flex items-center gap-3 w-full lg:w-auto flex-wrap">
          {/* Filter Pills */}
          {filters.map((filter, filterIndex) => (
            <div key={filterIndex} className="flex gap-2">
              {filter.label && (
                <span className="text-sm text-gray-600 self-center mr-1">{filter.label}:</span>
              )}
              {filter.options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => filter.onChange(option.value)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${getFilterPillColor(
                    option.color,
                    filter.activeValue === option.value
                  )}`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          ))}

          {/* View Mode Toggle */}
          {showViewToggle && onViewModeChange && (
            <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => onViewModeChange('grid')}
                className={`p-2 rounded-md transition-all ${
                  viewMode === 'grid'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                title="Grid View"
              >
                <Grid3x3 className="h-5 w-5" />
              </button>
              <button
                onClick={() => onViewModeChange('list')}
                className={`p-2 rounded-md transition-all ${
                  viewMode === 'list'
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
          {secondaryActions}

          {/* Primary Action */}
          {onPrimaryAction && (
            <Button
              onClick={onPrimaryAction}
              className="bg-gray-900 hover:bg-black text-white"
              disabled={primaryActionDisabled}
            >
              {primaryActionIcon}
              {primaryActionLabel}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

const EnhancedActionBar = React.memo(EnhancedActionBarComponent);
EnhancedActionBar.displayName = 'EnhancedActionBar';

export default EnhancedActionBar;
