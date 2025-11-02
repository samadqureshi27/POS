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
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading inventory...</p>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center max-w-md">
          <div className="mx-auto mb-6 flex items-center justify-center">
            <Package className="h-16 w-16 text-gray-300" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">No items found</h3>
          <p className="text-gray-600 text-base">Start by adding your first inventory item</p>
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
      <div className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Item</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">SKU</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Unit</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Stock</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {items.map((item, rowIndex) => {
                const itemStatus = getItemStatus(item);
                const StatusIcon = itemStatus.icon;

                return (
                  <tr
                    key={item._id || item.id}
                    className={`transition-all duration-150 hover:bg-gray-50 ${
                      rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50/30"
                    }`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`h-10 w-10 rounded-lg flex items-center justify-center border ${
                          item.type === "stock"
                            ? "bg-green-50 border-green-200"
                            : "bg-purple-50 border-purple-200"
                        }`}>
                          <Package className={`h-5 w-5 ${
                            item.type === "stock" ? "text-green-600" : "text-purple-600"
                          }`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-900">{item.name}</div>
                          {item.categoryId && (
                            <div className="text-xs text-gray-500 truncate">
                              {typeof item.categoryId === 'object' && item.categoryId.name
                                ? item.categoryId.name
                                : typeof item.categoryId === 'string' ? item.categoryId : ''}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-700 font-mono text-sm">{item.sku || "—"}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        item.type === "stock"
                          ? "bg-green-100 text-green-700"
                          : "bg-purple-100 text-purple-700"
                      }`}>
                        {item.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-700 font-medium">
                      {item.baseUnit}
                    </td>
                    <td className="px-6 py-4">
                      {(item.type === "stock" || item.trackStock) ? (
                        <span className="text-gray-900 font-semibold">{item.quantity || 0}</span>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <StatusIcon className={`h-4 w-4 ${itemStatus.color.split(' ')[0]}`} />
                        <span className={`text-sm font-medium ${itemStatus.color.split(' ')[0]}`}>{itemStatus.label}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEdit(item)}
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 h-8 w-8 p-0"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDelete(item)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {items.map((item) => {
        const itemStatus = getItemStatus(item);
        const stockStatus = getStockStatus(item);
        const isActive = item.isActive !== false;

        return (
          <div
            key={item._id || item.id}
            className="group relative bg-white border-2 border-gray-200 rounded-xl overflow-hidden hover:shadow-xl hover:border-gray-300 transition-all duration-200"
          >
            {/* Card Header with Gradient Background */}
            <div className={`relative h-28 flex items-center justify-center border-b-2 ${
              item.type === "stock"
                ? "bg-gradient-to-br from-green-50 to-green-100 border-green-200"
                : "bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200"
            }`}>
              <Package className={`h-14 w-14 ${
                item.type === "stock" ? "text-green-400" : "text-purple-400"
              }`} />

              {/* Status Badge - Top Left */}
              <div className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-bold shadow-sm ${
                isActive
                  ? "bg-green-500 text-white"
                  : "bg-red-500 text-white"
              }`}>
                {itemStatus.label}
              </div>

              {/* Type Badge - Top Right */}
              <div className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-bold shadow-sm ${
                item.type === "stock"
                  ? "bg-green-600 text-white"
                  : "bg-purple-600 text-white"
              }`}>
                {item.type}
              </div>

              {/* Hover Actions Overlay */}
              <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center gap-3">
                <Button
                  onClick={() => onEdit(item)}
                  className="bg-white hover:bg-gray-100 text-gray-900"
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
              {/* Item Name */}
              <h3 className="text-base font-bold text-gray-900 mb-2 truncate" title={item.name}>
                {item.name}
              </h3>

              {/* SKU & Category */}
              <div className="mb-3 min-h-[2.5rem] space-y-1">
                {item.sku && (
                  <p className="text-xs text-gray-600">
                    <span className="font-medium">SKU:</span> {item.sku}
                  </p>
                )}
                {item.categoryId ? (
                  <p className="text-xs text-gray-600 truncate">
                    <span className="font-medium">Category:</span> {typeof item.categoryId === 'object' && item.categoryId.name
                      ? item.categoryId.name
                      : typeof item.categoryId === 'string' ? item.categoryId : 'Uncategorized'}
                  </p>
                ) : !item.sku && (
                  <p className="text-xs text-gray-400 italic">
                    No SKU or category assigned
                  </p>
                )}
              </div>

              {/* Stats Row */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-200 mb-3">
                {/* Unit Badge */}
                <div className="flex items-center gap-2">
                  <div className={`flex items-center justify-center h-7 w-7 rounded-lg ${
                    item.type === "stock" ? "bg-green-100" : "bg-purple-100"
                  }`}>
                    <span className={`text-xs font-bold ${
                      item.type === "stock" ? "text-green-700" : "text-purple-700"
                    }`}>
                      {item.baseUnit?.slice(0, 3)}
                    </span>
                  </div>
                  <span className="text-xs text-gray-600 font-medium">
                    {item.baseUnit}
                  </span>
                </div>

                {/* Stock Quantity */}
                <div className="text-xs text-gray-500">
                  {(item.type === "stock" || item.trackStock) ? (
                    <div className="text-right">
                      <div className={`font-semibold ${
                        stockStatus.label === "Out of Stock" ? "text-red-600" :
                        stockStatus.label === "Low Stock" ? "text-yellow-600" :
                        "text-green-600"
                      }`}>
                        {item.quantity || 0} {item.baseUnit}
                      </div>
                    </div>
                  ) : (
                    <span className="italic">Service Item</span>
                  )}
                </div>
              </div>

              {/* Stock Threshold Progress Bar */}
              {(item.type === "stock" || item.trackStock) && item.reorderPoint && (
                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-gray-600 font-medium">Stock Level</span>
                    <span className="text-gray-900 font-bold">
                      {item.quantity || 0} / {item.reorderPoint}
                    </span>
                  </div>
                  <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
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
                    <span></span>
                    <span className="text-yellow-600 font-medium">Threshold</span>
                    <span>{item.reorderPoint * 2}</span>
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
