"use client";

import React from "react";
import { ChevronDown } from "lucide-react";
import Checkbox from "@mui/material/Checkbox";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Plus, Trash2, Search, AlertCircle, CheckCircle, X, Edit, Filter, Save, ImageIcon, } from "lucide-react";
import { useState, useEffect, useRef } from "react";

interface MenuItemOptions {
  ID: number;
  Name: string;
  DisplayType: "Radio" | "Select" | "Checkbox"; // Radio = one, Select = one or none, Checkbox = multiple
  Priority: number;
  OptionValue: string[];
  OptionPrice: number[];
}

interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

class MenuAPI {
  private static delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  private static mockData: MenuItemOptions[] = [
    {
      ID: 1,
      Name: "Cheese Type",
      DisplayType: "Radio",
      Priority: 1,
      OptionValue: ["Mozzarella", "Cheddar", "Parmesan"],
      OptionPrice: [0, 0.5, 1],
    },
    {
      ID: 2,
      Name: "Toppings",
      DisplayType: "Checkbox",
      Priority: 2,
      OptionValue: ["Olives", "Mushrooms", "Pepperoni", "Onions"],
      OptionPrice: [0.5, 0.5, 1, 0.3],
    },
    {
      ID: 3,
      Name: "Cold Drink",
      DisplayType: "Select",
      Priority: 3,
      OptionValue: ["Coke", "Sprite", "Fanta"],
      OptionPrice: [1.5, 1.5, 1.5],
    },
    {
      ID: 4,
      Name: "Bread Type",
      DisplayType: "Radio",
      Priority: 4,
      OptionValue: ["White", "Whole Wheat", "Multigrain"],
      OptionPrice: [0, 0.2, 0.3],
    },
    {
      ID: 5,
      Name: "Sauce",
      DisplayType: "Checkbox",
      Priority: 5,
      OptionValue: ["Tomato", "Barbecue", "Garlic", "Pesto"],
      OptionPrice: [0, 0.5, 0.3, 0.7],
    },
    {
      ID: 6,
      Name: "Spice Level",
      DisplayType: "Select",
      Priority: 6,
      OptionValue: ["Mild", "Medium", "Hot"],
      OptionPrice: [0, 0, 0],
    },
    {
      ID: 7,
      Name: "Add-ons",
      DisplayType: "Checkbox",
      Priority: 7,
      OptionValue: ["Extra Cheese", "Bacon", "Avocado"],
      OptionPrice: [1, 1.5, 2],
    },
    {
      ID: 8,
      Name: "Cooking Preference",
      DisplayType: "Radio",
      Priority: 8,
      OptionValue: ["Rare", "Medium", "Well Done"],
      OptionPrice: [0, 0, 0],
    },
    {
      ID: 9,
      Name: "Side Dish",
      DisplayType: "Select",
      Priority: 9,
      OptionValue: ["Fries", "Salad", "Coleslaw"],
      OptionPrice: [2, 2.5, 2],
    },
    {
      ID: 10,
      Name: "Serving Size",
      DisplayType: "Radio",
      Priority: 10,
      OptionValue: ["Small", "Medium", "Large"],
      OptionPrice: [0, 1, 2],
    },
  ];

  // ✅ GET /api/menu-items/
  static async getMenuItemOptions(): Promise<ApiResponse<MenuItemOptions[]>> {
    await this.delay(800);
    return {
      success: true,
      data: [...this.mockData],
      message: "Menu items fetched successfully",
    };
  }

  // ✅ POST /api/menu-items/
  static async createMenuItemOptions(
    item: Omit<MenuItemOptions, "ID">
  ): Promise<ApiResponse<MenuItemOptions>> {
    await this.delay(1000);
    const newId = this.mockData.length > 0 ? Math.max(...this.mockData.map(i => i.ID)) + 1 : 1;
    const newItem: MenuItemOptions = {
      ...item,
      ID: newId,
      OptionValue: item.OptionValue ?? [],
      OptionPrice: item.OptionPrice ?? [],
    };
    this.mockData.push(newItem);
    return {
      success: true,
      data: newItem,
      message: "Menu item created successfully",
    };
  }

  // ✅ PUT /api/menu-items/{id}/
  static async updateMenuItemOptions(
    id: number,
    item: Partial<MenuItemOptions>
  ): Promise<ApiResponse<MenuItemOptions>> {
    await this.delay(800);
    const index = this.mockData.findIndex((i) => i.ID === id);
    if (index === -1) throw new Error("Item not found");

    if (item.OptionValue) {
      item.OptionValue = item.OptionValue.filter((v) => v.trim() !== "");
    }
    if (item.OptionPrice) {
      item.OptionPrice = item.OptionPrice.filter((p) => p >= 0);
    }

    this.mockData[index] = { ...this.mockData[index], ...item };
    return {
      success: true,
      data: this.mockData[index],
      message: "Menu item updated successfully",
    };
  }

  // ✅ DELETE /api/menu-items/{id}/
  static async deleteMenuItemOptions(id: number): Promise<ApiResponse<null>> {
    await this.delay(600);
    const index = this.mockData.findIndex((i) => i.ID === id);
    if (index === -1) throw new Error("Item not found");

    this.mockData.splice(index, 1);

    // Reassign IDs sequentially
    this.mockData = this.mockData.map((item, idx) => ({
      ...item,
      ID: idx + 1,
    }));

    return {
      success: true,
      data: null,
      message: "Menu item deleted successfully",
    };
  }

  // ✅ DELETE /api/menu-items/bulk-delete/
  static async bulkDeleteMenuItemOptions(
    ids: number[]
  ): Promise<ApiResponse<null>> {
    await this.delay(1000);
    this.mockData = this.mockData.filter((item) => !ids.includes(item.ID));

    // Reassign IDs sequentially
    this.mockData = this.mockData.map((item, idx) => ({
      ...item,
      ID: idx + 1,
    }));

    return {
      success: true,
      data: null,
      message: `${ids.length} menu items deleted successfully`,
    };
  }
}


const Toast = ({
  message,
  type,
  onClose,
}: {
  message: string;
  type: "success" | "error";
  onClose: () => void;
}) => (
  <div
    className={`fixed top-4 right-4 px-4 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2 ${type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"
      }`}
  >
    {type === "success" ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
    <span>{message}</span>
    <button onClick={onClose} className="ml-2">
      <X size={16} />
    </button>
  </div>
);

const CategoryPage = () => {
  const [MenuItemOptionss, setMenuItemOptionss] = useState<MenuItemOptions[]>([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingItem, setEditingItem] = useState<MenuItemOptions | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [DisplayFilter, setDisplayFilter] = useState<"" | "Radio" | "Select" | "Checkbox">(
    ""
  );

  // Modal form state
  const [formData, setFormData] = useState<Omit<MenuItemOptions, "ID">>({
    Name: "",
    DisplayType: "Radio",
    Priority: 1,
    OptionValue: [],
    OptionPrice: [],
  });
  const [preview, setPreview] = useState<string | null>(null);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    loadMenuItemOptionss();
  }, []);

  // Modal form effect
  useEffect(() => {
    if (editingItem) {
      setFormData({
        Name: editingItem.Name,
        DisplayType: editingItem.DisplayType,
        OptionValue: editingItem.OptionValue,
        OptionPrice: editingItem.OptionPrice,
        Priority: editingItem.Priority,
      });
    } else {
      setFormData({
        Name: "",
        DisplayType: "Radio",
        OptionValue: [],
        OptionPrice: [],
        Priority: 1,
      });
      setPreview(null);
    }
  }, [editingItem, isModalOpen]);

  const loadMenuItemOptionss = async () => {
    try {
      setLoading(true);
      const response = await MenuAPI.getMenuItemOptions();
      if (response.success) {
        setMenuItemOptionss(response.data);
      } else {
        throw new Error(response.message || "Failed to fetch category items");
      }
    } catch (error) {
      console.error("Error fetching category items:", error);
      showToast("Failed to load category items", "error");
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = MenuItemOptionss.filter((item) => {
    const matchesSearch =
      item.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.Priority.toString().includes(searchTerm);
    const matchesStatus = DisplayFilter ? item.DisplayType === DisplayFilter : true;
    return matchesStatus && matchesSearch;
  });

  const handleCreateItem = async (itemData: Omit<MenuItemOptions, "ID">) => {
    try {
      setActionLoading(true);
      const response = await MenuAPI.createMenuItemOptions(itemData);
      if (response.success) {
        setMenuItemOptionss((prevItems) => [...prevItems, response.data]);
        setIsModalOpen(false);
        setSearchTerm("");
        setDisplayFilter("");
        showToast(response.message || "Item created successfully", "success");
      }
    } catch (error) {
      console.error("Error creating item:", error);
      showToast("Failed to create menu item", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateItem = async (itemData: Omit<MenuItemOptions, "ID">) => {
    if (!editingItem) return;
    try {
      setActionLoading(true);
      const response = await MenuAPI.updateMenuItemOptions(
        editingItem.ID,
        itemData
      );
      if (response.success) {
        setMenuItemOptionss(
          MenuItemOptionss.map((item) =>
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
      const response = await MenuAPI.bulkDeleteMenuItemOptions(selectedItems);
      if (response.success) {
        setMenuItemOptionss((prev) => {
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

  // Modal form handlers
  const handleModalSubmit = () => {
    if (
      !formData.Name.trim() ||
      !formData.DisplayType.trim() ||
      formData.Priority < 1
    ) {
      return;
    }

    if (editingItem) {
      handleUpdateItem(formData);
    } else {
      handleCreateItem(formData);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const isAllSelected = selectedItems.length === filteredItems.length && filteredItems.length > 0;
  const isSomeSelected = selectedItems.length > 0;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-b-2 border-yellow-600 rounded-full mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading categories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-6 p-6 bg-gray-50 min-h-screen">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <h1 className="text-3xl font-semibold mb-4 pl-20">Menu Options</h1>

      {/* Action bar */}
      <div className="mb-6 flex items-center justify-between gap-4 flex-wrap">
        {/* Action Buttons */}
        <div className="flex gap-3 pl-20">
          <button
            onClick={() => setIsModalOpen(true)}
            disabled={selectedItems.length > 0}
            className={`flex items-center text-center gap-2 w-[100px] px-4 py-2 rounded-lg transition-colors ${selectedItems.length === 0
              ? "bg-[#2C2C2C] text-white hover:bg-gray-700"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
          >
            <Plus size={16} />
            Add
          </button>

          <button
            onClick={handleDeleteSelected}
            disabled={!isSomeSelected || actionLoading}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${isSomeSelected && !actionLoading
              ? "bg-[#2C2C2C] text-white hover:bg-gray-700"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
          >
            <Trash2 size={16} />
            {actionLoading ? "Deleting..." : "Delete Selected"}
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative flex-1 min-w-[200px]">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={16}
          />
          <input
            type="text"
            placeholder="Search POS..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d9d9e1]"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg ml-20 shadow-sm overflow-hidden">
        <div className="overflow-y-auto">
          <table className="min-w-full divide-y divide-gray-200 table-fixed">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left">
                  <Checkbox
                    checked={isAllSelected}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                  />
                </th>
                <th className="relative px-4 py-3 text-left">
                  ID
                  <span className="absolute left-0 top-[15%] h-[70%] w-[2.5px] bg-[#d9d9e1]"></span>
                </th>
                <th className="relative px-4 py-3 text-left">
                  Name
                  <span className="absolute left-0 top-[15%] h-[70%] w-[2.5px] bg-[#d9d9e1]"></span>
                </th>
                <th className="relative px-4 py-3 text-left">
                  <div className="flex flex-col gap-1">
                    <DropdownMenu.Root>
                      <DropdownMenu.Trigger className="px-2 py-1 rounded text-sm bg-transparent border-none outline-none hover:bg-transparent flex items-center gap-2 focus:outline-none focus:ring-0">
                        {DisplayFilter || "Display Type"}
                        <ChevronDown
                          size={14}
                          className="text-gray-500 ml-auto"
                        />
                      </DropdownMenu.Trigger>

                      <DropdownMenu.Portal>
                        <DropdownMenu.Content
                          className="min-w-[320px] rounded-md bg-white shadow-md border-none p-1 relative outline-none"
                          sideOffset={6}
                        >
                          <DropdownMenu.Arrow className="fill-white stroke-gray-200 w-5 h-3" />

                          <DropdownMenu.Item
                            className="px-3 py-1 text-sm cursor-pointer hover:bg-gray-100 rounded outline-none"
                            onClick={() => setDisplayFilter("")}
                          >
                            Display Type
                          </DropdownMenu.Item>
                          <DropdownMenu.Item
                            className="px-3 py-1 text-sm cursor-pointer hover:bg-green-100 text-green-700 rounded outline-none"
                            onClick={() => setDisplayFilter("Radio")}
                          >
                            Radio
                          </DropdownMenu.Item>
                          <DropdownMenu.Item
                            className="px-3 py-1 text-sm cursor-pointer hover:bg-red-100 text-red-700 rounded outline-none"
                            onClick={() => setDisplayFilter("Select")}
                          >
                            Select
                          </DropdownMenu.Item>
                          <DropdownMenu.Item
                            className="px-3 py-1 text-sm cursor-pointer hover:bg-red-100 text-blue-700 rounded outline-none"
                            onClick={() => setDisplayFilter("Checkbox")}
                          >
                            Checkbox
                          </DropdownMenu.Item>
                        </DropdownMenu.Content>
                      </DropdownMenu.Portal>
                    </DropdownMenu.Root>
                    <span className="absolute left-0 top-[15%] h-[70%] w-[2.5px] bg-[#d9d9e1]"></span>
                  </div>
                </th>
                <th className="relative px-4 py-3 text-left">
                  Priority
                  <span className="absolute left-0 top-[15%] h-[70%] w-[2.5px] bg-[#d9d9e1]"></span>
                </th>
                <th className="relative px-4 py-3 text-left">
                  Actions
                  <span className="absolute left-0 top-[15%] h-[70%] w-[2.5px] bg-[#d9d9e1]"></span>
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {filteredItems.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    {searchTerm || DisplayFilter
                      ? "No categories match your search criteria."
                      : "No categories found."}
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr key={item.ID} className="bg-white hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <Checkbox
                        checked={selectedItems.includes(item.ID)}
                        onChange={(e) =>
                          handleSelectItem(item.ID, e.target.checked)
                        }
                      />
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                      {item.ID}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                      {item.Name}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span
                        className={`inline-block w-20 text-center px-2 py-[2px] rounded-md text-xs font-medium border
      ${item.DisplayType === "Radio" ? "text-green-600 border-green-600" : ""}
      ${item.DisplayType === "Select" ? "text-red-600 border-red-600" : ""}
      
      ${item.DisplayType === "Checkbox" ? "text-blue-600 border-blue-600" : ""}
    `}
                      >
                        {item.DisplayType}
                      </span>
                    </td>

                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                      {item.Priority}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setEditingItem(item);
                            setIsModalOpen(true);
                          }}
                          className="text-gray-600 hover:text-gray-800 p-1"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center ">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto shadow-lg relative">
            <h2 className="text-xl font-semibold mb-4">
              {editingItem ? "Edit Category" : "Add New Category"}
            </h2>
            <div className="space-y-3">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={formData.Name}
                  onChange={(e) =>
                    setFormData({ ...formData, Name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d9d9e1]"
                  required
                />
              </div>


              {/*Display Type DropDown*/}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Display Type
                </label>

                <DropdownMenu.Root >
                  <DropdownMenu.Trigger className="w-full px-3 py-2 border border-gray-300 rounded-lg flex items-center justify-between text-sm bg-white outline-none hover:bg-gray-50 focus:ring-2 focus:ring-[#d9d9e1]">
                    {formData.DisplayType || "Select Display Type"}
                    <ChevronDown size={14} className="text-gray-500" />
                  </DropdownMenu.Trigger>

                  <DropdownMenu.Portal>
                    <DropdownMenu.Content
                      className="min-w-[220px] rounded-md bg-white shadow-md border border-gray-200 p-1 outline-none ml-45" 
                      sideOffset={6}
                    >
                      <DropdownMenu.Arrow className="fill-white stroke-gray-200 w-5 h-3 mr-90
                      " />

                      <DropdownMenu.Item
                        className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 rounded outline-none"
                        onClick={() =>
                          setFormData({ ...formData, DisplayType: "Radio" })
                        }
                      >
                        Radio
                      </DropdownMenu.Item>

                      <DropdownMenu.Item
                        className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 rounded outline-none"
                        onClick={() =>
                          setFormData({ ...formData, DisplayType: "Select" })
                        }
                      >
                        Select
                      </DropdownMenu.Item>

                      <DropdownMenu.Item
                        className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 rounded outline-none"
                        onClick={() =>
                          setFormData({ ...formData, DisplayType: "Checkbox" })
                        }
                      >
                        Checkbox
                      </DropdownMenu.Item>
                    </DropdownMenu.Content>
                  </DropdownMenu.Portal>
                </DropdownMenu.Root>
              </div>

              {/* Priority */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <input
                  type="number"
                  value={formData.Priority}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      Priority: Number(e.target.value) || 1,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d9d9e1]"
                  min={1}
                  required
                />
              </div>

              {/* Action buttons */}
              <div className="flex gap-3 pt-4 justify-end">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-1"
                >
                  <X size={12} />
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleModalSubmit}
                  disabled={!formData.Name.trim() || !formData.DisplayType.trim()}
                  className={`px-4 py-2 rounded-lg flex items-center justify-center gap-1 ${formData.Name.trim() && formData.DisplayType.trim()
                    ? "bg-[#2C2C2C] text-white hover:bg-gray-700"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                >
                  <Save size={12} />
                  {editingItem ? "Update" : "Save & Close"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
