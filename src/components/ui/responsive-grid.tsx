"use client";

import React, { ReactNode } from "react";
import { Edit2, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";

export type ViewMode = "grid" | "list";

export interface GridColumn<T> {
  key: keyof T | string;
  header: string;
  render?: (item: T) => ReactNode;
  className?: string;
}

export interface ResponsiveGridProps<T> {
  // Data
  items: T[];
  loading?: boolean;
  viewMode?: ViewMode;

  // Pagination
  showPagination?: boolean;
  currentPage?: number;
  totalPages?: number;
  totalItems?: number;
  itemsPerPage?: number;
  onPageChange?: (page: number) => void;

  // Empty state
  emptyIcon?: ReactNode;
  emptyTitle?: string;
  emptyDescription?: string;

  // Loading state
  loadingText?: string;

  // Item identification
  getItemId: (item: T) => string;

  // Grid view configuration
  gridColumns?: string; // Tailwind grid-cols class, e.g., "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
  renderGridCard?: (item: T, actions: ReactNode) => ReactNode;

  // List view configuration
  columns?: GridColumn<T>[];

  // Actions
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  customActions?: (item: T) => ReactNode;
  showActions?: boolean;

  // Styling
  className?: string;
  cardClassName?: string;
}

export default function ResponsiveGrid<T>({
  items,
  loading = false,
  viewMode = "grid",
  showPagination = false,
  currentPage = 1,
  totalPages = 1,
  totalItems,
  itemsPerPage = 20,
  onPageChange,
  emptyIcon,
  emptyTitle = "No items found",
  emptyDescription = "Start by adding your first item",
  loadingText = "Loading...",
  getItemId,
  gridColumns = "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
  renderGridCard,
  columns = [],
  onEdit,
  onDelete,
  customActions,
  showActions = true,
  className = "",
  cardClassName = "",
}: ResponsiveGridProps<T>) {
  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-gray-400 mx-auto mb-4 stroke-1" />
          <p className="text-gray-500 font-medium text-sm">{loadingText}</p>
        </div>
      </div>
    );
  }

  // Empty state
  if (items.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center max-w-md">
          {emptyIcon && (
            <div className="mx-auto mb-4 flex items-center justify-center text-gray-200">
              {emptyIcon}
            </div>
          )}
          <h3 className="text-lg font-semibold text-gray-800 mb-2">{emptyTitle}</h3>
          <p className="text-gray-500 text-sm">{emptyDescription}</p>
        </div>
      </div>
    );
  }

  // Render actions
  const renderActions = (item: T) => {
    if (customActions) {
      return customActions(item);
    }

    return (
      <div className="flex items-center gap-1 justify-end">
        {onEdit && (
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(item);
            }}
            className="h-7 w-7 rounded-sm hover:bg-gray-100 text-gray-500"
          >
            <Edit2 className="h-3.5 w-3.5" />
          </Button>
        )}
        {onDelete && (
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(item);
            }}
            className="h-7 w-7 rounded-sm hover:bg-red-50 text-gray-500 hover:text-red-600"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>
    );
  };

  // List View
  if (viewMode === "list") {
    return (
      <div className="space-y-4">
        <div className={className}>
          <div className="bg-white border border-[#d5d5dd] rounded-sm overflow-hidden shadow-none">
            <table className="min-w-full divide-y divide-[#d5d5dd]">
              <thead className="bg-gray-50/50">
                <tr>
                  {columns.map((column, index) => (
                    <th
                      key={index}
                      className={`px-6 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider ${column.className || ""}`}
                    >
                      {column.header}
                    </th>
                  ))}
                  {showActions && (onEdit || onDelete || customActions) && (
                    <th className="px-6 py-3 text-right text-[10px] font-bold text-gray-500 uppercase tracking-wider w-24">
                      ACTIONS
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-[#d5d5dd]">
                {items.map((item) => (
                  <tr key={getItemId(item)} className="hover:bg-gray-50/50 transition-colors duration-150">
                    {columns.map((column, colIndex) => (
                      <td
                        key={colIndex}
                        className={`px-6 py-3 text-sm text-gray-700 ${column.className || ""}`}
                      >
                        {column.render
                          ? column.render(item)
                          : String((item as any)[column.key] || "—")}
                      </td>
                    ))}
                    {showActions && (onEdit || onDelete || customActions) && (
                      <td className="px-6 py-3 text-right w-24 whitespace-nowrap">
                        {renderActions(item)}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination for List View */}
        {showPagination && onPageChange && totalPages > 1 && (
          <div className="bg-white border border-[#d5d5dd] rounded-sm p-4">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
              onPageChange={onPageChange}
            />
          </div>
        )}
      </div>
    );
  }

  // Grid View
  return (
    <div className="space-y-4">
      <div className={`grid ${gridColumns} gap-4 ${className}`}>
        {items.map((item) => {
          const itemId = getItemId(item);
          const actions = renderActions(item);

          if (renderGridCard) {
            return (
              <div key={itemId} className={cardClassName}>
                {renderGridCard(item, actions)}
              </div>
            );
          }

          // Default grid card (basic fallback)
          return (
            <div
              key={itemId}
              className={`group bg-white border border-[#d5d5dd] rounded-sm overflow-hidden hover:shadow-md transition-all duration-200 ${cardClassName}`}
            >
              <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-black text-gray-300 tracking-wider uppercase mb-2 block">
                      ID: {itemId.slice(-6).toUpperCase()}
                    </span>
                    <div className="text-xs text-gray-600 line-clamp-3">
                      {typeof item === 'object' && (item as any).name ? (item as any).name : JSON.stringify(item)}
                    </div>
                  </div>
                  {/* Desktop: Hover, Mobile: Always visible */}
                  <div className="flex-shrink-0 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                    {actions}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination for Grid View */}
      {showPagination && onPageChange && totalPages > 1 && (
        <div className="bg-white border border-[#d5d5dd] rounded-sm p-4 shadow-none">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
}
