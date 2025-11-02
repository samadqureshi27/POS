"use client";

import React from "react";
import { Package, Edit2, Trash2, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { InventoryItem } from "@/lib/services/inventory-service";

interface InventoryGridProps {
  items: InventoryItem[];
  loading: boolean;
  viewMode: "grid" | "list";
  onEdit: (item: InventoryItem) => void;
  onDelete: (item: InventoryItem) => void;
}

export default function InventoryGrid({
  items,
  loading,
  viewMode,
  onEdit,
  onDelete,
}: InventoryGridProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Loading inventory...</p>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No items found</h3>
          <p className="text-gray-500">Start by adding your first inventory item</p>
        </div>
      </div>
    );
  }

  const getItemStatus = (item: InventoryItem) => {
    if (item.isActive === false) {
      return { label: "Inactive", color: "text-red-600 bg-red-50", icon: AlertCircle };
    }
    return { label: "Active", color: "text-green-600 bg-green-50", icon: CheckCircle2 };
  };

  const getStockStatus = (item: InventoryItem) => {
    // Stock items should always show stock status
    if (item.type !== "stock" && !item.trackStock) {
      return { label: "Not Tracked", color: "text-gray-600 bg-gray-50", icon: CheckCircle2 };
    }
    if (item.quantity === 0) return { label: "Out of Stock", color: "text-red-600 bg-red-50", icon: AlertCircle };
    if (item.reorderPoint && item.quantity && item.quantity <= item.reorderPoint) {
      return { label: "Low Stock", color: "text-yellow-600 bg-yellow-50", icon: AlertCircle };
    }
    return { label: "In Stock", color: "text-green-600 bg-green-50", icon: CheckCircle2 };
  };

  if (viewMode === "list") {
    return (
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Item</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">SKU</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Unit</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Stock</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-right text-xs font-medium text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {items.map((item) => {
                const itemStatus = getItemStatus(item);
                const StatusIcon = itemStatus.icon;

                return (
                  <tr key={item._id || item.id} className="hover:shadow-lg transition-shadow duration-200">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center border border-gray-200">
                          <Package className="h-5 w-5 text-gray-600" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{item.name}</div>
                          {item.categoryId && (
                            <div className="text-xs text-gray-500">
                              {typeof item.categoryId === 'object' && item.categoryId.name
                                ? item.categoryId.name
                                : typeof item.categoryId === 'string' ? item.categoryId : ''}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-gray-700 font-mono text-sm">{item.sku || "—"}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.type === "stock"
                          ? "bg-green-100 text-green-700"
                          : "bg-purple-100 text-purple-700"
                      }`}>
                        {item.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                      {item.baseUnit}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {(item.type === "stock" || item.trackStock) ? (
                        <span className="text-gray-900 font-medium">{item.quantity || 0}</span>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <StatusIcon className={`h-4 w-4 ${itemStatus.color.split(' ')[0]}`} />
                        <span className={`text-sm ${itemStatus.color.split(' ')[0]}`}>{itemStatus.label}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEdit(item)}
                          className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDelete(item)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // Grid View
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {items.map((item) => {
        const itemStatus = getItemStatus(item);
        const stockStatus = getStockStatus(item);

        return (
          <div
            key={item._id || item.id}
            className="group relative bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-200"
          >
            {/* Card Header - Icon */}
            <div className="relative h-32 bg-gray-50 flex items-center justify-center border-b border-gray-200">
              <Package className="h-12 w-12 text-gray-300" />

              {/* Type Badge */}
              <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium ${
                item.type === "stock"
                  ? "bg-green-100 text-green-700"
                  : "bg-purple-100 text-purple-700"
              }`}>
                {item.type}
              </div>

              {/* Hover Actions Overlay */}
              <div className="absolute inset-0 background-grey opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-3">
                <Button
                  onClick={() => onEdit(item)}
                  className="bg-gray-900 hover:bg-black text-white"
                  size="sm"
                >
                  <Edit2 className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button
                  onClick={() => onDelete(item)}
                  className="bg-red-600 hover:bg-red-700 text-white"
                  size="sm"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </div>
            </div>

            {/* Card Content */}
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">{item.name}</h3>
              {item.sku && (
                <p className="text-xs text-gray-500 font-mono mb-3">{item.sku}</p>
              )}

              {/* Info Grid */}
              <div className="space-y-2 mb-4">
                {/* Item Status */}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Status:</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${itemStatus.color}`}>
                    {itemStatus.label}
                  </span>
                </div>

                {/* Stock Status */}
                {item.trackStock && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Stock Status:</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${stockStatus.color}`}>
                      {stockStatus.label}
                    </span>
                  </div>
                )}

                {/* Category */}
                {item.categoryId && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Category:</span>
                    <span className="text-gray-700 text-xs truncate max-w-[120px]">
                      {typeof item.categoryId === 'object' && item.categoryId.name
                        ? item.categoryId.name
                        : typeof item.categoryId === 'string' ? item.categoryId : ''}
                    </span>
                  </div>
                )}

                {/* Unit */}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Unit:</span>
                  <span className="text-gray-900 font-medium">{item.baseUnit}</span>
                </div>

                {/* Current Stock Quantity - Show for stock items by default */}
                {(item.type === "stock" || item.trackStock) && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Quantity:</span>
                    <span className="text-gray-900 font-bold text-lg">{item.quantity || 0} {item.baseUnit}</span>
                  </div>
                )}
              </div>

              {/* Reorder Point Info - Show if tracking stock or stock item */}
              {(item.type === "stock" || item.trackStock) && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="text-gray-600">
                      {item.reorderPoint ? 'Stock Level' : 'Current Stock'}
                    </span>
                    <span className="text-gray-900 font-medium">
                      {item.quantity !== undefined ? item.quantity : 'N/A'} {item.baseUnit}
                      {item.reorderPoint && ` / ${item.reorderPoint} (threshold)`}
                    </span>
                  </div>

                  {/* Show progress bar only if reorderPoint is set */}
                  {item.reorderPoint && (
                    <>
                      <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                        {/* Progress bar */}
                        <div
                          className={`h-full transition-all ${
                            (item.quantity || 0) <= item.reorderPoint
                              ? "bg-red-500"
                              : "bg-green-500"
                          }`}
                          style={{
                            width: `${Math.min(((item.quantity || 0) / (item.reorderPoint * 2)) * 100, 100)}%`,
                          }}
                        ></div>
                        {/* Threshold marker */}
                        <div
                          className="absolute top-0 bottom-0 w-0.5 bg-yellow-500"
                          style={{ left: '50%' }}
                        ></div>
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
                        <span>0</span>
                        <span className="text-yellow-600">← Threshold</span>
                        <span>{item.reorderPoint * 2}</span>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
