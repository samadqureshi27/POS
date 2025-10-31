"use client";

import React from "react";
import { Package, Edit2, Trash2, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { InventoryItem } from "@/lib/util/inventoryApi";

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

  const getStockStatus = (item: InventoryItem) => {
    if (!item.trackStock) return { label: "Service", color: "text-purple-600 bg-purple-50", icon: CheckCircle2 };
    if (item.currentStock === 0) return { label: "Out of Stock", color: "text-red-600 bg-red-50", icon: AlertCircle };
    if (item.reorderPoint && item.currentStock && item.currentStock <= item.reorderPoint) {
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
                const status = getStockStatus(item);
                const StatusIcon = status.icon;

                return (
                  <tr key={item.ID} className="hover:shadow-lg transition-shadow duration-200">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center border border-gray-200">
                          <Package className="h-5 w-5 text-gray-600" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{item.name}</div>
                          {item.category && (
                            <div className="text-xs text-gray-500">{item.category}</div>
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
                      {item.trackStock ? (
                        <span className="text-gray-900 font-medium">{item.currentStock || 0}</span>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <StatusIcon className={`h-4 w-4 ${status.color.split(' ')[0]}`} />
                        <span className={`text-sm ${status.color.split(' ')[0]}`}>{status.label}</span>
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
        const status = getStockStatus(item);
        const StatusIcon = status.icon;

        return (
          <div
            key={item.ID}
            className="group relative bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-200"
          >
            {/* Card Header - Icon */}
            <div className="relative h-32 bg-gray-50 flex items-center justify-center border-b border-gray-200">
              <Package className="h-12 w-12 text-gray-300" />

              {/* Status Badge */}
              <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>
                <StatusIcon className="h-3 w-3 inline mr-1" />
                {status.label}
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
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Type:</span>
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                    item.type === "stock"
                      ? "bg-green-100 text-green-700"
                      : "bg-purple-100 text-purple-700"
                  }`}>
                    {item.type}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Unit:</span>
                  <span className="text-gray-900 font-medium">{item.baseUnit}</span>
                </div>

                {item.trackStock && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Stock:</span>
                    <span className="text-gray-900 font-bold text-lg">{item.currentStock || 0}</span>
                  </div>
                )}

                {item.category && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Category:</span>
                    <span className="text-gray-700 text-xs truncate max-w-[120px]">{item.category}</span>
                  </div>
                )}
              </div>

              {/* Reorder Point Indicator */}
              {item.trackStock && item.reorderPoint && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
                    <span>Reorder Point</span>
                    <span className="font-medium">{item.reorderPoint}</span>
                  </div>
                  <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        (item.currentStock || 0) <= item.reorderPoint
                          ? "bg-red-500"
                          : "bg-green-500"
                      }`}
                      style={{
                        width: `${Math.min(((item.currentStock || 0) / (item.reorderPoint * 2)) * 100, 100)}%`,
                      }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
