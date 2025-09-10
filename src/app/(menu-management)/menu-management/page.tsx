"use client";

import React, { useState, useEffect, useRef } from "react";
import { Loader2 } from "lucide-react";
import {Toast} from "@/components/layout/ui/Toast";
import MenuActionBar from "./_components/menu-actionbar";
import MenuTable from "./_components/menu-table";
import TabNavigation from "./_components/tab-menu";
import ImageUpload from "./_components/image-upload";
import Toggle from "./_components/toggle";
import MenuAPI, { MenuItem } from "@/lib/util/Menu1API";
import PriceTab from "./_components/price-table";
import MealTab from "./_components/meal-tab";
import SpecialsTab from "./_components/specials-tab";
// import PriceTab from './components/price-table';

// Constants
const sizeOptions = ["Small", "Regular", "Large", "Extra Large"];
const mealTimeOptions = ["Morning", "Afternoon", "Evening"];

const MenuManagementPage = () => {
  // State management
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<"" | "Active" | "Inactive">("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Menu Items");
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [formData, setFormData] = useState<Omit<MenuItem, "ID">>({
    Name: "",
    Price: 0,
    Category: "",
    StockQty: "",
    Status: "Inactive",
    Description: "",
    MealType: "Morning",
    Priority: 1,
    MinimumQuantity: 0,
    ShowOnMenu: "Inactive",
    Featured: "Inactive",
    StaffPick: "Inactive",
    DisplayType: "Select a type",
    Displaycat: "Var",
    SpecialStartDate: "",
    SpecialEndDate: "",
    SpecialPrice: 0,
    OverRide: [],
    OptionValue: [],
    OptionPrice: [],
    MealValue: [],
    MealPrice: [],
    PName: [],
    PPrice: [],
    ShowOnMain: "Inactive",
    SubTBE: "Inactive",
    Deal: "Inactive",
    Special: "Inactive",
  });

  // util functions
  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const loadMenuItems = async () => {
    try {
      setLoading(true);
      const response = await MenuAPI.getMenuItems();
      if (response.success) {
        setMenuItems(response.data);
      } else {
        throw new Error(response.message || "Failed to fetch menu items");
      }
    } catch (error) {
      console.error("Error fetching menu items:", error);
      showToast("Failed to load menu items", "error");
    } finally {
      setLoading(false);
    }
  };

  // Effects
  useEffect(() => {
    loadMenuItems();
  }, []);

  useEffect(() => {
    if (editingItem) {
      setFormData({
        Name: editingItem.Name,
        Price: editingItem.Price || 0,
        Category: editingItem.Category,
        StockQty: editingItem.StockQty,
        Status: editingItem.Status,
        Description: editingItem.Description || "",
        MealType: editingItem.MealType || "Morning",
        Priority: editingItem.Priority || 1,
        MinimumQuantity: editingItem.MinimumQuantity || 0,
        ShowOnMenu: editingItem.ShowOnMenu || "Inactive",
        Featured: editingItem.Featured || "Inactive",
        StaffPick: editingItem.StaffPick || "Inactive",
        ShowOnMain: editingItem.ShowOnMain || "Inactive",
        Deal: editingItem.Deal || "Inactive",
        Special: editingItem.Special || "Inactive",
        SubTBE: editingItem.SubTBE || "Inactive",
        DisplayType: editingItem.DisplayType || "Select a type",
        Displaycat: editingItem.Displaycat || "Var",
        SpecialStartDate: editingItem.SpecialStartDate || "",
        SpecialEndDate: editingItem.SpecialEndDate || "",
        SpecialPrice: editingItem.SpecialPrice || 0,
        OverRide: editingItem.OverRide || [],
        OptionValue: editingItem.OptionValue || [],
        OptionPrice: editingItem.OptionPrice || [],
        MealValue: editingItem.MealValue || [],
        MealPrice: editingItem.MealPrice || [],
        PName: editingItem.PName || [],
        PPrice: editingItem.PPrice || [],
      });
    } else {
      setFormData({
        Name: "",
        Price: 0,
        Category: "",
        StockQty: "",
        Status: "Inactive",
        Description: "",
        MealType: "Morning",
        Priority: 1,
        MinimumQuantity: 0,
        ShowOnMenu: "Inactive",
        Featured: "Inactive",
        StaffPick: "Inactive",
        DisplayType: "Select a type",
        Displaycat: "Var",
        SpecialStartDate: "",
        SpecialEndDate: "",
        SpecialPrice: 0,
        OptionValue: [],
        OptionPrice: [],
        OverRide: [],
        MealValue: [],
        MealPrice: [],
        PName: [],
        PPrice: [],
        ShowOnMain: "Inactive",
        SubTBE: "Inactive",
        Deal: "Inactive",
        Special: "Inactive",
      });
      setPreview(null);
    }
  }, [editingItem, isModalOpen]);

  useEffect(() => {
    if (isModalOpen) {
      setActiveTab("Menu Items");
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isModalOpen]);

  // Computed values
  const filteredItems = menuItems.filter((item) => {
    const matchesSearch =
      item.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.Category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "" || item.Status === statusFilter;
    const matchesCategory = categoryFilter === "" || item.Category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const isFormValid = () => {
    const isPriceValid = formData.Displaycat === "Var" || formData.Price > 0;
    
    return (
      formData.Name?.trim() &&
      formData.DisplayType &&
      isPriceValid &&
      preview &&
      formData.Description?.trim() &&
      formData.MealType &&
      formData.Priority > 0 &&
      formData.MinimumQuantity >= 0 &&
      formData.OptionValue?.length > 0 &&
      formData.OptionValue.every((val) => val.trim() !== "") &&
      formData.OptionPrice?.length === formData.OptionValue?.length
    );
  };

  const categories = [...new Set(menuItems.map((item) => item.Category))];
  const isAllSelected = selectedItems.length === filteredItems.length && filteredItems.length > 0;

  // Event handlers
  const handleCreateItem = async (itemData: Omit<MenuItem, "ID">) => {
    try {
      setActionLoading(true);
      const response = await MenuAPI.createMenuItem(itemData);
      if (response.success) {
        setMenuItems((prevItems) => [...prevItems, response.data]);
        setIsModalOpen(false);
        setSearchTerm("");
        showToast(response.message || "Item created successfully", "success");
      }
    } catch (error) {
      console.error("Error creating item:", error);
      showToast("Failed to create menu item", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateItem = async (itemData: Omit<MenuItem, "ID">) => {
    if (!editingItem) return;
    try {
      setActionLoading(true);
      const response = await MenuAPI.updateMenuItem(editingItem.ID, itemData);
      if (response.success) {
        setMenuItems(
          menuItems.map((item) =>
            item.ID === editingItem.ID ? response.data : item
          )
        );
        setIsModalOpen(false);
        setEditingItem(null);
        showToast(response.message || "Item updated successfully", "success");
      }
    } catch (error) {
      showToast("Failed to update menu item", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedItems.length === 0) return;
    try {
      setActionLoading(true);
      const response = await MenuAPI.bulkDeleteMenuItem(selectedItems);
      if (response.success) {
        setMenuItems((prev) => {
          const remaining = prev.filter((i) => !selectedItems.includes(i.ID));
          return remaining.map((it, idx) => ({ ...it, ID: idx + 1 }));
        });
        setSelectedItems([]);
        showToast(response.message || "Items deleted successfully", "success");
      }
    } catch (error) {
      showToast("Failed to delete menu items", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectedItems(checked ? filteredItems.map((item) => item.ID) : []);
  };

  const handleSelectItem = (itemId: number, checked: boolean) => {
    setSelectedItems(
      checked
        ? [...selectedItems, itemId]
        : selectedItems.filter((id) => id !== itemId)
    );
  };

  const handleModalSubmit = () => {
    if (!formData.Name.trim()) {
      showToast("Please enter a menu item name", "error");
      return;
    }

    if (editingItem) {
      handleUpdateItem(formData);
    } else {
      handleCreateItem(formData);
    }
  };

  const handleStatusChange = (
    field: keyof typeof formData,
    isActive: boolean
  ) => {
    setFormData({
      ...formData,
      [field]: isActive ? "Active" : "Inactive",
    });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  // Handler for status filter change
  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value as "" | "Active" | "Inactive");
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-b-2 border-yellow-600 rounded-full mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading Menu Management...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-w-full h-full overflow-y-hidden">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <h1 className="text-3xl font-semibold mt-14 mb-8">Menu Management</h1>

      <MenuActionBar
        selectedItems={selectedItems}
        onAddClick={() => setIsModalOpen(true)}
        onDeleteClick={handleDeleteSelected}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        actionLoading={actionLoading}
      />

      <MenuTable
        filteredItems={filteredItems}
        selectedItems={selectedItems}
        isAllSelected={isAllSelected}
        onSelectAll={handleSelectAll}
        onSelectItem={handleSelectItem}
        onEditItem={(item) => {
          setEditingItem(item);
          setIsModalOpen(true);
        }}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        statusFilter={statusFilter}
        setStatusFilter={handleStatusFilterChange}
        categories={categories}
      />
      
      

      {/* Modal */}
      
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-sm w-full max-w-lg h-[70vh] lg:max-w-2xl shadow-sm flex flex-col sm:mx-4">
            <div className="flex-shrink-0">
              <h1 className="text-xl sm:text-2xl px-4 sm:px-6 pt-3 sm:pt-4 font-medium">
                {editingItem ? "Edit Menu Item" : "Add Menu Item"}
              </h1>

              <TabNavigation
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                formData={formData}
              />
            </div>

            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              {activeTab === "Menu Items" && (
                <div className="space-y-6 max-w-2xl mx-auto">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Menu Item Name
                    </label>
                    <input
                      type="text"
                      value={formData.Name}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          Name: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#d9d9e1]"
                      placeholder="Sweet / Spicy Sausage Wrap"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Category
                      </label>
                      <input
                        type="text"
                        value={formData.Category}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            Category: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#d9d9e1]"
                        placeholder="Enter category"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Display Type
                      </label>
                      <select
                        value={formData.Displaycat}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            Displaycat: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#d9d9e1]"
                      >
                        <option value="Var">Var</option>
                        <option value="Qty">Qty</option>
                        <option value="Weight">Weight</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price
                    </label>
                    <input
                      type="number"
                      value={formData.Price || ""}
                      disabled={formData.Displaycat === "Var"}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          Price: Number(e.target.value) || 0,
                        });
                      }}
                      className={`w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#d9d9e1] ${
                        formData.Displaycat === "Var"
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : ""
                      }`}
                      placeholder="0.00"
                    />
                  </div>

                  <ImageUpload
                    preview={preview}
                    setPreview={setPreview}
                    fileInputRef={fileInputRef}
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={formData.Description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          Description: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#d9d9e1]"
                      rows={3}
                      placeholder="Enter description"
                    />
                  </div>
                </div>
              )}

              {activeTab === "Details" && (
                <div className="space-y-6 max-w-2xl mx-auto">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Meal Time
                      </label>
                      <select
                        value={formData.MealType}
                        onChange={(e) =>
                          setFormData({ ...formData, MealType: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#d9d9e1]"
                      >
                        {mealTimeOptions.map((time) => (
                          <option key={time} value={time}>
                            {time}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Priority
                      </label>
                      <input
                        type="number"
                        value={formData.Priority || ""}
                        onChange={(e) => {
                          const value = Number(e.target.value);
                          setFormData({
                            ...formData,
                            Priority: value || 1,
                          });
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#d9d9e1]"
                        placeholder="1"
                        min={1}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Minimum Quantity
                    </label>
                    <input
                      type="number"
                      value={formData.MinimumQuantity || ""}
                      onChange={(e) => {
                        const value = Number(e.target.value);
                        setFormData({
                          ...formData,
                          MinimumQuantity: value || 0,
                        });
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#d9d9e1]"
                      placeholder="0"
                      min={0}
                    />
                  </div>

                  <div className="space-y-4">
                    {[
                      { key: "Featured", label: "Feature" },
                      { key: "StaffPick", label: "Staff pick" },
                      { key: "ShowOnMain", label: "Show on Main" },
                      { key: "SubTBE", label: "Subtract Stock" },
                    ].map(({ key, label }) => (
                      <div key={key} className="flex items-center justify-between">
                        <label className="block text-sm font-medium text-gray-700">
                          {label}
                        </label>
                        <Toggle
                          checked={formData[key as keyof typeof formData] === "Active"}
                          onChange={(checked) =>
                            handleStatusChange(key as keyof typeof formData, checked)
                          }
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "Options" && (
                <div className="max-w-4xl mx-auto">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Menu Item Option
                  </label>

                  <div className="flex items-center gap-2 mb-4">
                    <select
                      onChange={(e) => {
                        const size = e.target.value;
                        if (size && !formData.OptionValue?.includes(size)) {
                          setFormData({
                            ...formData,
                            OptionValue: [...(formData.OptionValue || []), size],
                            OptionPrice: [...(formData.OptionPrice || []), 0],
                          });
                        }
                        e.target.value = "";
                      }}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#d9d9e1]"
                    >
                      <option value="">Add New Size Option</option>
                      {sizeOptions.map((size) => (
                        <option key={size} value={size}>
                          {size}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-4">
                    {(formData.OptionValue || []).map((opt, idx) => (
                      <div
                        key={idx}
                        className="border border-gray-200 rounded-sm p-4 bg-white flex justify-between items-center"
                      >
                        <div className="flex gap-4 flex-1">
                          <input
                            type="text"
                            value={opt}
                            onChange={(e) => {
                              const updated = [...(formData.OptionValue || [])];
                              updated[idx] = e.target.value;
                              setFormData({
                                ...formData,
                                OptionValue: updated,
                              });
                            }}
                            className="flex-1 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#d9d9e1]"
                            placeholder="Size name"
                          />
                          <input
                            type="number"
                            step="0.01"
                            value={formData.OptionPrice?.[idx] || 0}
                            onChange={(e) => {
                              const updated = [...(formData.OptionPrice || [])];
                              updated[idx] = Number(e.target.value) || 0;
                              setFormData({
                                ...formData,
                                OptionPrice: updated,
                              });
                            }}
                            className="w-24 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#d9d9e1]"
                            placeholder="0.00"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const updatedValues = (formData.OptionValue || []).filter(
                              (_, i) => i !== idx
                            );
                            const updatedPrices = (formData.OptionPrice || []).filter(
                              (_, i) => i !== idx
                            );
                            setFormData({
                              ...formData,
                              OptionValue: updatedValues,
                              OptionPrice: updatedPrices,
                            });
                          }}
                          className="ml-2 text-red-500 hover:text-red-700"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "Meal" && (
                <MealTab
                  formData={formData}
                  setFormData={setFormData}
                  handleStatusChange={handleStatusChange}
                />
              )}

              {activeTab === "Specials" && (
                <SpecialsTab
                  formData={formData}
                  setFormData={setFormData}
                  handleStatusChange={handleStatusChange}
                />
              )}

              {activeTab === "Price" && (
                <PriceTab
                  formData={formData}
                  setFormData={setFormData}
                />
              )}
            </div>

            <div className="flex-shrink-0 flex flex-col sm:flex-row justify-end gap-3 p-4 border-t border-gray-200 bg-white">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 border border-gray-300 rounded-sm hover:bg-gray-50 order-2 sm:order-1"
                disabled={actionLoading}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleModalSubmit}
                disabled={actionLoading || !isFormValid()}
                className={`px-4 py-2 min-w-[120px] rounded-sm transition-colors text-white order-1 sm:order-2 ${
                  actionLoading || !isFormValid()
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-black hover:bg-gray-700"
                }`}
              >
                {actionLoading ? (
                  <div className="flex items-center gap-2 justify-center">
                    <Loader2 className="animate-spin w-4 h-4" />
                    {editingItem ? "Updating..." : "Saving..."}
                  </div>
                ) : editingItem ? (
                  "Update"
                ) : (
                  "Save & Close"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuManagementPage;