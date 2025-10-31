"use client";

import React, { useState, useEffect, useRef } from "react";
import { Package, Plus, Settings2, Search, Grid3x3, List, TrendingUp, AlertTriangle, Zap, Upload, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AdvancedMetricCard } from "@/components/ui/advanced-metric-card";
import UnitsManagementModal from "./_components/units-management-modal";
import InventoryItemModal from "./_components/inventory-item-modal";
import InventoryGrid from "./_components/inventory-grid";
import { InventoryAPI, type InventoryItem } from "@/lib/util/inventoryApi";
import { exportToCSV, importFromCSV } from "@/lib/util/csvUtil";

export default function ItemsPage() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "stock" | "service">("all");
  const [filterStatus, setFilterStatus] = useState<"all" | "Active" | "Inactive">("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Modals
  const [isUnitsModalOpen, setIsUnitsModalOpen] = useState(false);
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);

  // Stats
  const [stats, setStats] = useState({
    totalItems: 0,
    stockItems: 0,
    lowStock: 0,
    outOfStock: 0,
  });

  // Load items
  const loadItems = async () => {
    setLoading(true);
    const filters: any = { q: searchQuery };
    if (filterType !== "all") filters.type = filterType;
    if (filterStatus !== "all") filters.status = filterStatus;

    const response = await InventoryAPI.getInventoryItems(filters);
    if (response.success && response.data) {
      setItems(response.data);
      calculateStats(response.data);
    }
    setLoading(false);
  };

  const calculateStats = (itemsList: InventoryItem[]) => {
    setStats({
      totalItems: itemsList.length,
      stockItems: itemsList.filter(i => i.trackStock).length,
      lowStock: itemsList.filter(i => i.currentStock && i.reorderPoint && i.currentStock <= i.reorderPoint).length,
      outOfStock: itemsList.filter(i => i.currentStock === 0).length,
    });
  };

  useEffect(() => {
    loadItems();
  }, [searchQuery, filterType, filterStatus]);

  const handleAddItem = () => {
    setEditingItem(null);
    setIsItemModalOpen(true);
  };

  const handleEditItem = (item: InventoryItem) => {
    setEditingItem(item);
    setIsItemModalOpen(true);
  };

  const handleDeleteItem = async (item: InventoryItem) => {
    if (!window.confirm(`Delete "${item.name}"?`)) return;

    const response = await InventoryAPI.deleteInventoryItem(item.ID);
    if (response.success) {
      loadItems();
    }
  };

  const handleItemSave = async (data: Partial<InventoryItem>) => {
    let response;
    if (editingItem) {
      response = await InventoryAPI.updateInventoryItem(editingItem.ID, data);
    } else {
      response = await InventoryAPI.createInventoryItem({
        ...data,
        Status: data.Status || "Active",
        Priority: 1,
      } as any);
    }

    if (response.success) {
      setIsItemModalOpen(false);
      loadItems();
    }
  };

  // CSV Import/Export Handlers
  const handleExport = () => {
    exportToCSV(items, "inventory");
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const importedItems = await importFromCSV(file);

      if (window.confirm(`Import ${importedItems.length} items? This will create new inventory items.`)) {
        for (const item of importedItems) {
          await InventoryAPI.createInventoryItem({
            ...item,
            Status: item.Status || "Active",
            Priority: item.Priority || 1,
          } as any);
        }
        loadItems();
        alert(`Successfully imported ${importedItems.length} items!`);
      }
    } catch (error) {
      alert("Failed to import CSV. Please check the file format.");
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-50">
      {/* Main Content */}
      <div className="md:ml-2 p-4 md:p-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                Inventory Hub
              </h1>
              <p className="text-gray-600 text-sm mt-1">Manage your items, units, and stock levels</p>
            </div>

            {/* CSV Import/Export Buttons */}
            <div className="flex gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleImport}
                className="hidden"
              />
              <Button
                onClick={handleImportClick}
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                <Upload className="h-4 w-4 mr-2" />
                Import CSV
              </Button>
              <Button
                onClick={handleExport}
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
                disabled={items.length === 0}
              >
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            <AdvancedMetricCard
              title="Total Items"
              subtitle="All inventory"
              value={stats.totalItems}
              icon="inventory"
              format="number"
            />

            <AdvancedMetricCard
              title="Stock Tracked"
              subtitle="Monitored items"
              value={stats.stockItems}
              icon="target"
              format="number"
              status="good"
            />

            <AdvancedMetricCard
              title="Low Stock"
              subtitle="Needs reorder"
              value={stats.lowStock}
              icon="inventory"
              format="number"
              status={stats.lowStock > 0 ? "warning" : "neutral"}
            />

            <AdvancedMetricCard
              title="Out of Stock"
              subtitle="Urgent action"
              value={stats.outOfStock}
              icon="inventory"
              format="number"
              status={stats.outOfStock > 0 ? "critical" : "good"}
            />
          </div>
        </div>

        {/* Action Bar */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6 shadow-sm">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 w-full lg:max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search items by name, SKU, or barcode..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 bg-gray-50 border-gray-300 h-11"
              />
            </div>

            {/* Filters & Actions */}
            <div className="flex items-center gap-3 w-full lg:w-auto flex-wrap">
              {/* Type Filter Pills */}
              <div className="flex gap-2">
                <button
                  onClick={() => setFilterType("all")}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    filterType === "all"
                      ? "bg-gray-900 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilterType("stock")}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    filterType === "stock"
                      ? "bg-gray-900 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Stock
                </button>
                <button
                  onClick={() => setFilterType("service")}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    filterType === "service"
                      ? "bg-gray-900 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Service
                </button>
              </div>

              {/* Status Filter Pills */}
              <div className="flex gap-2">
                <button
                  onClick={() => setFilterStatus("all")}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    filterStatus === "all"
                      ? "bg-gray-900 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  All Status
                </button>
                <button
                  onClick={() => setFilterStatus("Active")}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    filterStatus === "Active"
                      ? "bg-green-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Active
                </button>
                <button
                  onClick={() => setFilterStatus("Inactive")}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    filterStatus === "Inactive"
                      ? "bg-red-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Inactive
                </button>
              </div>

              {/* View Mode Toggle */}
              <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-md transition-all ${
                    viewMode === "grid"
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <Grid3x3 className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-md transition-all ${
                    viewMode === "list"
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <List className="h-5 w-5" />
                </button>
              </div>

              {/* Primary Actions */}
              <Button
                onClick={() => setIsUnitsModalOpen(true)}
                className="bg-gray-700 hover:bg-gray-800 text-white"
              >
                <Settings2 className="h-5 w-5 mr-2" />
                Units
              </Button>

              <Button
                onClick={handleAddItem}
                className="bg-gray-900 hover:bg-black text-white"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add Item
              </Button>
            </div>
          </div>
        </div>

        {/* Inventory Grid */}
        <InventoryGrid
          items={items}
          loading={loading}
          viewMode={viewMode}
          onEdit={handleEditItem}
          onDelete={handleDeleteItem}
        />
      </div>

      {/* Modals */}
      <UnitsManagementModal
        isOpen={isUnitsModalOpen}
        onClose={() => setIsUnitsModalOpen(false)}
        onRefresh={loadItems}
      />

      <InventoryItemModal
        isOpen={isItemModalOpen}
        onClose={() => setIsItemModalOpen(false)}
        editingItem={editingItem}
        onSave={handleItemSave}
      />
    </div>
  );
}
