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
          <Loader2 className="h-12 w-12 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">{loadingText}</p>
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
            <div className="mx-auto mb-6 flex items-center justify-center">
              {emptyIcon}
            </div>
          )}
          <h3 className="text-2xl font-bold text-gray-900 mb-3">{emptyTitle}</h3>
          <p className="text-gray-600 text-base">{emptyDescription}</p>
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
      <div className="flex items-center gap-2">
        {onEdit && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(item)}
            className="h-8 w-8 hover:bg-blue-50 hover:text-blue-600"
          >
            <Edit2 className="h-4 w-4" />
          </Button>
        )}
        {onDelete && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(item)}
            className="h-8 w-8 hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 className="h-4 w-4" />
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
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {columns.map((column, index) => (
                    <th
                      key={index}
                      className={`px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider ${column.className || ""}`}
                    >
                      {column.header}
                    </th>
                  ))}
                  {showActions && (onEdit || onDelete || customActions) && (
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {items.map((item) => (
                  <tr key={getItemId(item)} className="hover:bg-gray-50">
                    {columns.map((column, colIndex) => (
                      <td
                        key={colIndex}
                        className={`px-6 py-4 ${column.className || ""}`}
                      >
                        {column.render
                          ? column.render(item)
                          : String((item as any)[column.key] || "—")}
                      </td>
                    ))}
                    {showActions && (onEdit || onDelete || customActions) && (
                      <td className="px-6 py-4 text-right">
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
          <div className="bg-white border border-gray-200 rounded-xl p-4">
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
      <div className={`grid ${gridColumns} gap-5 ${className}`}>
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
              className={`group relative bg-white border-2 border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-xl hover:border-gray-300 transition-all duration-200 ${cardClassName}`}
            >
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <pre className="text-xs text-gray-600 overflow-auto">
                      {JSON.stringify(item, null, 2)}
                    </pre>
                  </div>
                  <div className="ml-3 flex-shrink-0">{actions}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination for Grid View */}
      {showPagination && onPageChange && totalPages > 1 && (
        <div className="bg-white border border-gray-200 rounded-xl p-4">
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
