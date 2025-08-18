"use client";

import React from "react";
import { ChevronDown } from "lucide-react";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import {
  Plus,
  Trash2,
  Search,
  AlertCircle,
  CheckCircle,
  X,
  Edit,
  Filter,
  Save,
  ImageIcon,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";

interface CategoryItem {
  ID: number;
  Name: string;
  Status: "Active" | "Inactive";
  Description: string;
  Parent: string;
  Priority: number;
  Image?: string;
}

interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

class MenuAPI {
  private static delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  private static mockData: CategoryItem[] = [
    {
      ID: 1,
      Name: "Pizza",
      Status: "Inactive",
      Description: "Delicious Italian pizzas with various toppings.",
      Parent: "None",
      Priority: 1,
      Image: "",
    },
    {
      ID: 2,
      Name: "Salads",
      Status: "Active",
      Description: "Fresh and healthy salads.",
      Parent: "None",
      Priority: 2,
      Image: "",
    },
    {
      ID: 3,
      Name: "Burgers",
      Status: "Active",
      Description: "Juicy burgers with beef, chicken, or veggie patties.",
      Parent: "None",
      Priority: 3,
      Image: "",
    },
    {
      ID: 4,
      Name: "Appetizers",
      Status: "Inactive",
      Description: "Tasty starters to begin your meal.",
      Parent: "None",
      Priority: 4,
      Image: "",
    },
    {
      ID: 5,
      Name: "Desserts",
      Status: "Active",
      Description: "Sweet treats to finish your meal.",
      Parent: "None",
      Priority: 5,
      Image: "",
    },
    {
      ID: 6,
      Name: "Main Course",
      Status: "Active",
      Description: "Hearty main dishes for lunch or dinner.",
      Parent: "None",
      Priority: 6,
      Image: "",
    },
    {
      ID: 7,
      Name: "Beverages",
      Status: "Active",
      Description: "Refreshing drinks and beverages.",
      Parent: "None",
      Priority: 7,
      Image: "",
    },
    {
      ID: 8,
      Name: "Sides",
      Status: "Inactive",
      Description: "Perfect sides to complement your meal.",
      Parent: "None",
      Priority: 8,
      Image: "",
    },
    {
      ID: 9,
      Name: "Soups",
      Status: "Active",
      Description: "Warm and comforting soups.",
      Parent: "None",
      Priority: 9,
      Image: "",
    },
    {
      ID: 10,
      Name: "Kids Menu",
      Status: "Inactive",
      Description: "Special menu items for kids.",
      Parent: "None",
      Priority: 10,
      Image: "",
    },
  ];

  // GET /api/menu-items/
  static async getCategoryItems(): Promise<ApiResponse<CategoryItem[]>> {
    await this.delay(800);
    return {
      success: true,
      data: [...this.mockData],
      message: "Category items fetched successfully",
    };
  }

  // POST /api/menu-items/
  static async createCategoryItem(
    item: Omit<CategoryItem, "ID">
  ): Promise<ApiResponse<CategoryItem>> {
    await this.delay(1000);
    const newId = this.mockData.length + 1;
    const newItem: CategoryItem = {
      ...item,
      ID: newId,
      Image: item.Image || "",
    };
    this.mockData.push(newItem);
    return {
      success: true,
      data: newItem,
      message: "Category item created successfully",
    };
  }

  // PUT /api/menu-items/{id}/
  static async updateCategoryItem(
    id: number,
    item: Partial<CategoryItem>
  ): Promise<ApiResponse<CategoryItem>> {
    await this.delay(800);
    const index = this.mockData.findIndex((i) => i.ID === id);
    if (index === -1) throw new Error("Item not found");

    this.mockData[index] = { ...this.mockData[index], ...item };
    return {
      success: true,
      data: this.mockData[index],
      message: "Category item updated successfully",
    };
  }

  // DELETE /api/menu-items/{id}/
  static async deleteCategoryItem(id: number): Promise<ApiResponse<null>> {
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
      message: "Category item deleted successfully",
    };
  }

  // DELETE /api/menu-items/bulk-delete/
  static async bulkDeleteCategoryItems(
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
      message: `${ids.length} Category items deleted successfully`,
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

const ToggleSwitch = ({
  checked,
  onChange,
  disabled = false,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}) => {
  const handleToggle = () => {
    if (disabled) return;
    onChange(!checked);
  };

  return (
    <label
      className={`
      relative inline-block cursor-pointer w-14 h-8
      ${disabled ? "opacity-50 cursor-not-allowed" : ""}
    `}
    >
      <input
        type="checkbox"
        className="sr-only"
        checked={checked}
        onChange={handleToggle}
        disabled={disabled}
      />

      {/* Slider background */}
      <span
        className={`
        absolute inset-0 rounded-xl transition-colors duration-400
        ${checked ? "bg-green-500" : "bg-red-600"}
      `}
      />

      {/* Slider circle */}
      <span
        className={`
        absolute bg-white rounded-lg transition-transform duration-400
        h-6 w-6 left-1 bottom-1
        ${checked ? "translate-x-6" : "translate-x-0"}
      `}
      />
    </label>
  );
};

const CategoryPage = () => {
  const [categoryItems, setCategoryItems] = useState<CategoryItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingItem, setEditingItem] = useState<CategoryItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [statusFilter, setStatusFilter] = useState<"" | "Active" | "Inactive">(
    ""
  );

  // Modal form state
  const [formData, setFormData] = useState<Omit<CategoryItem, "ID">>({
    Name: "",
    Status: "Active",
    Description: "",
    Parent: "",
    Priority: 1,
    Image: "",
  });
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    loadCategoryItems();
  }, []);

  // Modal form effect
  useEffect(() => {
    if (editingItem) {
      setFormData({
        Name: editingItem.Name,
        Status: editingItem.Status,
        Description: editingItem.Description,
        Parent: editingItem.Parent,
        Priority: editingItem.Priority,
        Image: editingItem.Image || "",
      });
      setPreview(editingItem.Image || null);
    } else {
      setFormData({
        Name: "",
        Status: "Active",
        Description: "",
        Parent: "",
        Priority: 1,
        Image: "",
      });
      setPreview(null);
    }
  }, [editingItem, isModalOpen]);

  const loadCategoryItems = async () => {
    try {
      setLoading(true);
      const response = await MenuAPI.getCategoryItems();
      if (response.success) {
        setCategoryItems(response.data);
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

  const filteredItems = categoryItems.filter((item) => {
    const matchesSearch =
      item.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.Priority.toString().includes(searchTerm);
    const matchesStatus = statusFilter ? item.Status === statusFilter : true;
    return matchesStatus && matchesSearch;
  });

  const handleCreateItem = async (itemData: Omit<CategoryItem, "ID">) => {
    try {
      setActionLoading(true);
      const response = await MenuAPI.createCategoryItem(itemData);
      if (response.success) {
        setCategoryItems((prevItems) => [...prevItems, response.data]);
        setIsModalOpen(false);
        setSearchTerm("");
        setStatusFilter("");
        showToast(response.message || "Item created successfully", "success");
      }
    } catch (error) {
      console.error("Error creating item:", error);
      showToast("Failed to create menu item", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateItem = async (itemData: Omit<CategoryItem, "ID">) => {
    if (!editingItem) return;
    try {
      setActionLoading(true);
      const response = await MenuAPI.updateCategoryItem(
        editingItem.ID,
        itemData
      );
      if (response.success) {
        setCategoryItems(
          categoryItems.map((item) =>
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
      const response = await MenuAPI.bulkDeleteCategoryItems(selectedItems);
      if (response.success) {
        setCategoryItems((prev) => {
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
      !formData.Description.trim() ||
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

  const handleStatusChange = (isActive: boolean) => {
    setFormData({
      ...formData,
      Status: isActive ? "Active" : "Inactive",
    });
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const objectUrl = URL.createObjectURL(file);
      setFormData((prev) => ({ ...prev, Image: objectUrl }));
      setPreview(objectUrl);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file && file.type.startsWith("image/")) {
      const objectUrl = URL.createObjectURL(file);
      setFormData((prev) => ({ ...prev, Image: objectUrl }));
      setPreview(objectUrl);
    }
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, Image: "" }));
    setPreview(null);
  };

  const handleClickUpload = () => {
    fileInputRef.current?.click();
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const isAllSelected =
    selectedItems.length === filteredItems.length && filteredItems.length > 0;
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

      <h1 className="text-3xl font-semibold mb-4 pl-20">Categories</h1>

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
                        {statusFilter || "Status"}
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
                            onClick={() => setStatusFilter("")}
                          >
                            Status
                          </DropdownMenu.Item>
                          <DropdownMenu.Item
                            className="px-3 py-1 text-sm cursor-pointer hover:bg-green-100 text-green-700 rounded outline-none"
                            onClick={() => setStatusFilter("Active")}
                          >
                            Active
                          </DropdownMenu.Item>
                          <DropdownMenu.Item
                            className="px-3 py-1 text-sm cursor-pointer hover:bg-red-100 text-red-700 rounded outline-none"
                            onClick={() => setStatusFilter("Inactive")}
                          >
                            Inactive
                          </DropdownMenu.Item>
                        </DropdownMenu.Content>
                      </DropdownMenu.Portal>
                    </DropdownMenu.Root>
                    <span className="absolute left-0 top-[15%] h-[70%] w-[2.5px] bg-[#d9d9e1]"></span>
                  </div>
                </th>
                <th className="relative px-4 py-3 text-left">
                  Description
                  <span className="absolute left-0 top-[15%] h-[70%] w-[2.5px] bg-[#d9d9e1]"></span>
                </th>
                <th className="relative px-4 py-3 text-left">
                  Parent
                  <span className="absolute left-0 top-[15%] h-[70%] w-[2.5px] bg-[#d9d9e1]"></span>
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
                    {searchTerm || statusFilter
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
      ${item.Status === "Active" ? "text-green-600 border-green-600" : ""}
      ${item.Status === "Inactive" ? "text-red-600 border-red-600" : ""}
    `}
                      >
                        {item.Status}
                      </span>
                    </td>
                    <td
                      className="px-4 py-4 text-sm text-gray-600 max-w-xs truncate"
                      title={item.Description}
                    >
                      {item.Description}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                      {item.Parent}
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.Description}
                  onChange={(e) =>
                    setFormData({ ...formData, Description: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 h-32 resize-none"
                  required
                />
              </div>

              {/* Image Upload with Drag & Drop */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image
                </label>
                <div
                  className="relative border-2 border-dashed border-gray-300 rounded-lg p-4 h-32 bg-white flex flex-col justify-center items-center hover:bg-gray-50 transition cursor-pointer"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  onClick={handleClickUpload}
                >
                  {preview ? (
                    <>
                      <img
                        src={preview}
                        alt="Preview"
                        className="max-h-24 object-contain mb-2"
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveImage();
                        }}
                        className="absolute top-2 right-2 text-gray-500 text-2xl hover:text-gray-800"
                        title="Remove image"
                      >
                        ×
                      </button>
                    </>
                  ) : (
                    <>
                      <ImageIcon className="w-10 h-10 text-gray-400 mb-2" />
                      <p className="text-gray-500 text-sm text-center">
                        Click or drag & drop your image here
                      </p>
                    </>
                  )}

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    title="Upload Image"
                  />
                </div>
              </div>

              {/* Parent */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Parent
                </label>
                <input
                  type="text"
                  value={formData.Parent}
                  onChange={(e) =>
                    setFormData({ ...formData, Parent: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  min={1}
                  required
                />
              </div>

              {/* Status */}
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <ToggleSwitch
                  checked={formData.Status === "Active"}
                  onChange={handleStatusChange}
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
                  disabled={!formData.Name.trim() || !formData.Description.trim()}
                  className={`px-4 py-2 rounded-lg flex items-center justify-center gap-1 ${formData.Name.trim() && formData.Description.trim()
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
