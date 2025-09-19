"use client";
// Reusable Data Table Component following shadcn/ui patterns
import React from "react";
import { MoreHorizontal } from "lucide-react";
import { Button } from "./button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { cn } from "@/lib/utils";

export interface DataTableColumn<T> {
  key: string;
  title: string;
  dataIndex?: keyof T;
  render?: (value: any, record: T, index: number) => React.ReactNode;
  width?: string;
  align?: "left" | "center" | "right";
  sortable?: boolean;
  filterable?: boolean;
  filterComponent?: React.ReactNode;
  hideOnMobile?: boolean;
  mobileLabel?: string;
}

export interface DataTableAction<T> {
  key: string;
  label: string;
  icon?: React.ReactNode;
  onClick: (record: T) => void;
  variant?: "default" | "destructive";
}

export interface DataTableProps<T> {
  data: T[];
  columns: DataTableColumn<T>[];
  actions?: DataTableAction<T>[];
  selectable?: boolean;
  selectedItems?: (string | number)[];
  onSelectAll?: (checked: boolean) => void;
  onSelectItem?: (id: string | number, checked: boolean) => void;
  getRowId?: (record: T) => string | number;
  maxHeight?: string;
  className?: string;
  emptyMessage?: string;
  loading?: boolean;
  onRowClick?: (record: T) => void;
  mobileResponsive?: boolean;
  nameColumn?: string;
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  actions = [],
  selectable = false,
  selectedItems = [],
  onSelectAll,
  onSelectItem,
  getRowId = (record) => record.id || record.ID || String(record),
  maxHeight = "600px",
  className,
  emptyMessage = "No data available",
  loading = false,
  onRowClick,
  mobileResponsive = false,
  nameColumn = "name"

}: DataTableProps<T>) {
  const isAllSelected = selectable && data.length > 0 && selectedItems.length === data.length;
  const isIndeterminate = selectable && selectedItems.length > 0 && selectedItems.length < data.length;

  if (loading) {
    return (
      <div className="w-full">
        <div className="rounded-md border">
          <div className="relative overflow-auto" style={{ maxHeight, overflowY: 'scroll' }}>
            <table className="w-full caption-bottom text-sm">
              <thead className="[&_tr]:border-b">
                <tr className="border-b transition-colors hover:bg-muted/50">
                  {selectable && (
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground w-12">
                      <div className="h-4 w-4 bg-muted animate-pulse rounded" />
                    </th>
                  )}
                  {columns.map((column) => (
                    <th key={column.key} className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      <div className="h-4 bg-muted animate-pulse rounded w-20" />
                    </th>
                  ))}
                  {actions.length > 0 && (
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      <div className="h-4 bg-muted animate-pulse rounded w-16" />
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {[...Array(5)].map((_, i) => (
                  <tr key={i} className="border-b transition-colors hover:bg-muted/50">
                    {selectable && (
                      <td className="p-4 align-middle">
                        <div className="h-4 w-4 bg-muted animate-pulse rounded" />
                      </td>
                    )}
                    {columns.map((column) => (
                      <td key={column.key} className="p-4 align-middle">
                        <div className="h-4 bg-muted animate-pulse rounded w-24" />
                      </td>
                    ))}
                    {actions.length > 0 && (
                      <td className="p-4 align-middle">
                        <div className="h-8 w-8 bg-muted animate-pulse rounded" />
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("w-full", className)}>
      <div className={cn(
        "rounded-sm border",
        mobileResponsive && "responsive-customer-table"
      )}>
        <div className={cn("relative", mobileResponsive && "table-container")} style={{ maxHeight, overflowY: 'auto', overflowX: 'auto' }}>
          <table className="w-full caption-bottom text-sm">
            <thead className="[&_tr]:border-b">
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                {selectable && (
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground w-12">
                    <input
                      type="checkbox"
                      checked={isAllSelected}
                      ref={(el) => {
                        if (el) el.indeterminate = isIndeterminate;
                      }}
                      onChange={(e) => onSelectAll?.(e.target.checked)}
                      className="h-4 w-4 rounded border border-input bg-background"
                    />
                  </th>
                )}
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className={cn(
                      "h-12 px-4 text-left align-middle font-medium text-muted-foreground",
                      column.align === "center" && "text-center",
                      column.align === "right" && "text-right",
                      column.width && `w-[${column.width}]`,
                      column.hideOnMobile && "hidden md:table-cell",
                      // Add vertical lines only when mobile responsive
                      mobileResponsive && "relative"
                    )}
                  >
                    {column.filterable && column.filterComponent ? (
                      column.filterComponent
                    ) : (
                      column.title
                    )}
                    {mobileResponsive && (
                      <span className="absolute left-0 top-[15%] h-[70%] w-[1.5px] bg-gray-300"></span>
                    )}
                  </th>
                ))}
                {actions.length > 0 && (
                  <th className={cn(
                    "h-12 px-4 text-left align-middle font-medium text-muted-foreground",
                    mobileResponsive && "relative"
                  )}>
                    Actions
                    {mobileResponsive && (
                      <span className="absolute left-0 top-[15%] h-[70%] w-[2px] bg-gray-300"></span>
                    )}
                  </th>
                )}
              </tr>
            </thead>
            <tbody className={cn(
              "[&_tr:last-child]:border-0",
              mobileResponsive && "divide-y divide-gray-100"
            )}>
              {data.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length + (selectable ? 1 : 0) + (actions.length > 0 ? 1 : 0)}
                    className="h-24 text-center text-muted-foreground"
                  >
                    {emptyMessage}
                  </td>
                </tr>
              ) : (
                data.map((record, index) => {
                  const rowId = getRowId(record);
                  const isSelected = selectedItems.includes(rowId);

                  return (
                    <tr 
                      key={`${rowId}-${index}`}
                      className={cn(
                        "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
                        isSelected && "bg-muted/50",
                        onRowClick && "cursor-pointer",
                        mobileResponsive && "bg-white hover:bg-gray-50"
                      )}
                      onClick={() => onRowClick?.(record)}
                    >
                      {selectable && (
                        <td className={cn(
                          "p-4 align-middle",
                          mobileResponsive && "card-checkbox-cell"
                        )}>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => onSelectItem?.(rowId, e.target.checked)}
                            className="h-4 w-4 rounded border border-input bg-background"
                          />
                        </td>
                      )}
                      {columns.map((column) => {
                        const value = column.dataIndex ? record[column.dataIndex] : null;
                        const content = column.render ? column.render(value, record, index) : value;
                        const isNameColumn = column.key === nameColumn || column.dataIndex === nameColumn || column.dataIndex === "Name" || column.dataIndex === "name";

                        return (
                          <td
                            key={`${column.key}-${index}`}
                            className={cn(
                              "p-4 align-middle",
                              column.align === "center" && "text-center",
                              column.align === "right" && "text-right",
                              column.hideOnMobile && "hidden md:table-cell",
                              // Apply mobile styles only when mobileResponsive is true
                              mobileResponsive && "whitespace-nowrap text-sm",
                              mobileResponsive && isNameColumn && "card-name-cell font-medium"
                            )}
                            data-label={mobileResponsive ? (column.mobileLabel || column.title) : undefined}
                          >
                            {content}
                          </td>
                        );
                      })}
                      {actions.length > 0 && (
                        <td className={cn(
                          "p-4 align-middle",
                          mobileResponsive && "card-actions-cell"
                        )}>
                          <DropdownMenu modal={false}>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className={cn(
                                "h-8 w-8 p-0",
                                mobileResponsive && "desktop-edit-icon"
                              )}>
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {actions.map((action) => (
                                <DropdownMenuItem
                                  key={`${action.key}-${index}`}
                                  onClick={() => action.onClick(record)}
                                  className={cn(
                                    "cursor-pointer",
                                    action.variant === "destructive" && "text-destructive focus:text-destructive"
                                  )}
                                >
                                  {action.icon && <span className="mr-2 h-4 w-4">{action.icon}</span>}
                                  {action.label}
                                </DropdownMenuItem>
                              ))}
                            </DropdownMenuContent>
                          </DropdownMenu>
                          {mobileResponsive && actions.length > 0 && (
                            <Button
                              variant="outline"
                              className="mobile-edit-button w-full"
                              onClick={(e) => {
                                e.stopPropagation();
                                actions[0].onClick(record);
                              }}
                            >
                              {actions[0].label || "Edit"}
                            </Button>
                          )}
                        </td>
                      )}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default DataTable;
