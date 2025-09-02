"use client";

import React from "react";
import { ChevronDown } from "lucide-react";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import ButtonPage from "@/components/layout/UI/button";
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
import { Button } from "@mui/material";
import ResponsiveEditButton from "@/components/layout/UI/ResponsiveEditButton";
import ActionBar from "@/components/layout/UI/ActionBar";

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
    className={`fixed top-35 right-4 px-4 py-3 rounded-sm shadow-lg z-50 flex items-center gap-2 ${type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"
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
  const [categoryItems, setCategoryItems] = useState<CategoryItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingItem, setEditingItem] = useState<CategoryItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
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
        Priority: 0,
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
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    // Cleanup function to restore scrolling when component unmounts
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isModalOpen]);

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
    <div className=" bg-gray-50 min-w-full h-full overflow-y-auto ">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <h1 className="text-3xl font-semibold  mt-14 mb-8">Categories</h1>

      {/* Action bar */}
      <ActionBar
        onAdd={() => setIsModalOpen(true)}
        addDisabled={selectedItems.length > 0}
        onDelete={handleDeleteSelected}
        deleteDisabled={selectedItems.length === 0}
        isDeleting={actionLoading}
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search"
      />

      {/* Table */}
      <div className="bg-white rounded-sm  shadow-sm border border-gray-300 max-w-[100vw] responsive-customer-table">
        <div className=" rounded-sm table-container">
          <table className="min-w-full divide-y max-w-[800px] border-b rounded-sm  border-gray-200 divide-gray-200 table-fixed">
            <thead className="bg-white border-b text-gray-500 rounded-sm border-gray-200 py-50 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-6 text-left w-[2.5px]">
                  <Checkbox
                    checked={isAllSelected}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    disableRipple
                    sx={{
                      transform: "scale(1.5)", // size adjustment
                      p: 0, // remove extra padding
                    }}
                    icon={
                      // unchecked grey box
                      <svg width="20" height="20" viewBox="0 0 24 24">
                        <rect
                          x="3"
                          y="3"
                          width="18"
                          height="18"
                          rx="3"
                          ry="3"
                          fill="#e0e0e0" // grey inside
                          stroke="#d1d1d1" // border grey
                          strokeWidth="2"
                        />
                      </svg>
                    }
                    checkedIcon={
                      // checked with tick
                      <svg width="20" height="20" viewBox="0 0 24 24">
                        <rect
                          x="3"
                          y="3"
                          width="18"
                          height="18"
                          rx="3"
                          ry="3"
                          fill="#e0e0e0" // grey inside
                          stroke="#2C2C2C" // dark border
                          strokeWidth="2"
                        />
                        <path
                          d="M9 12.5l2 2 4-4.5"
                          fill="none"
                          stroke="#2C2C2C"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    }
                  />
                </th>
                <th className="relative px-4 py-3 text-left">
                  ID
                  <span className="absolute left-0 top-[15%] h-[70%] w-[1.5px] bg-gray-300"></span>
                </th>
                <th className="relative px-4 py-3 text-left">
                  Name
                  <span className="absolute left-0 top-[15%] h-[70%] w-[2px] bg-gray-300"></span>
                </th>
                <th className="relative px-4 py-3 text-left">
                  <div className="flex flex-col gap-1 ">
                    <DropdownMenu.Root modal={false}>
                      <DropdownMenu.Trigger className="px-2 py-1 rounded text-sm bg-transparent border-none outline-none hover:bg-transparent flex items-center gap-2 focus:outline-none focus:ring-0  cursor-pointer">
                        {statusFilter || "Status"}
                        <ChevronDown
                          size={14}
                          className="text-gray-500 ml-auto"
                        />
                      </DropdownMenu.Trigger>

                      <DropdownMenu.Portal>
                        <DropdownMenu.Content
                          className="min-w-[320px] rounded-sm bg-white shadow-md border-none p-1 relative outline-none"
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
                            className="px-3 py-1 text-sm cursor-pointer hover:bg-green-100 text-green-400 rounded outline-none"
                            onClick={() => setStatusFilter("Active")}
                          >
                            Active
                          </DropdownMenu.Item>
                          <DropdownMenu.Item
                            className="px-3 py-1 text-sm cursor-pointer hover:bg-red-100 text-red-400 rounded outline-none"
                            onClick={() => setStatusFilter("Inactive")}
                          >
                            Inactive
                          </DropdownMenu.Item>
                        </DropdownMenu.Content>
                      </DropdownMenu.Portal>
                    </DropdownMenu.Root>
                    <span className="absolute left-0 top-[15%] h-[70%] w-[2px] bg-gray-300"></span>
                  </div>
                </th>
                <th className="relative px-4 py-3 text-left hidden md:table-cell">
                  Description
                  <span className="absolute left-0 top-[15%] h-[70%] w-[1.5px] bg-gray-300"></span>
                </th>
                <th className="relative px-4 py-3 text-left">
                  Parent
                  <span className="absolute left-0 top-[15%] h-[70%] w-[1.5px] bg-gray-300"></span>
                </th>
                <th className="relative px-4 py-3 text-left">
                  Priority
                  <span className="absolute left-0 top-[15%] h-[70%] w-[1.5px] bg-gray-300"></span>
                </th>
                <th className="relative px-4 py-3 text-left">
                  Actions
                  <span className="absolute left-0 top-[15%] h-[70%] w-[2px] bg-gray-300"></span>
                </th>
              </tr>
            </thead>

            <tbody className="divide-y text-gray-500 divide-gray-100">
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
                    <td className="px-6 py-8 card-checkbox-cell">
                      <Checkbox
                        checked={selectedItems.includes(item.ID)}
                        onChange={(e) =>
                          handleSelectItem(item.ID, e.target.checked)
                        }
                        disableRipple
                        sx={{
                          p: 0, // remove extra padding
                          transform: "scale(1.5)", // optional size tweak
                        }}
                        icon={
                          // unchecked grey box
                          <svg width="20" height="20" viewBox="0 0 24 24">
                            <rect
                              x="3"
                              y="3"
                              width="18"
                              height="18"
                              rx="3"
                              ry="3"
                              fill="#e0e0e0" // grey inside
                              stroke="#d1d1d1" // border grey
                              strokeWidth="2"
                            />
                          </svg>
                        }
                        checkedIcon={
                          // checked with tick
                          <svg width="20" height="20" viewBox="0 0 24 24">
                            <rect
                              x="3"
                              y="3"
                              width="18"
                              height="18"
                              rx="3"
                              ry="3"
                              fill="#e0e0e0" // grey inside
                              stroke="#2C2C2C" // dark border
                              strokeWidth="2"
                            />
                            <path
                              d="M9 12.5l2 2 4-4.5"
                              fill="none"
                              stroke="#2C2C2C"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        }
                      />
                    </td>
                    <td
                      className="px-4 py-4 whitespace-nowrap text-sm"
                      data-label="ID"
                    >
                      {item.ID}
                    </td>
                    <td
                      className="px-4 py-4 whitespace-nowrap text-sm font-medium card-name-cell"
                      data-label="Name"
                    >
                      {item.Name}
                    </td>
                    <td
                      className="px-4 py-4 whitespace-nowrap"
                      data-label="Status"
                    >
                      <span
                        className={`inline-block w-20 text-right  py-[2px] rounded-sm text-xs font-medium 
      ${item.Status === "Active" ? "text-green-400 " : ""}
      ${item.Status === "Inactive" ? "text-red-400 " : ""}
    `}
                      >
                        {item.Status}
                      </span>
                    </td>
                    <td
                      className="px-4 py-4 text-sm text-gray-600 max-w-xs truncate !hidden min-[1100px]:!table-cell"
                      title={item.Description}
                      data-label="Description"
                    >
                      {item.Description}
                    </td>
                    <td
                      className="px-4 py-4 whitespace-nowrap text-sm"
                      data-label="Parent"
                    >
                      {item.Parent}
                    </td>
                    <td
                      className="px-4 py-4 whitespace-nowrap text-sm"
                      data-label="Priority"
                    >
                      {item.Priority}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap card-actions-cell" data-label="Actions" onClick={(e) => e.stopPropagation()}>
                      <ResponsiveEditButton
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingItem(item);
                          setIsModalOpen(true);
                        }}
                      />
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
        <div className="fixed inset-0  bg-black/30 backdrop-blur-sm flex items-center justify-center z-71">
          <div className="bg-white rounded-sm p-6 min-w-[35vw] max-w-2xl max-h-[70vh] min-h-[70vh] shadow-lg relative flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">
                {editingItem ? "Edit Category" : "Add New Category"}
              </h2>
            </div>

            {/* Scrollable Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 overflow-y-auto pr-1 py-2">
              {/* Name */}
              <div className="md:col-span-2 mt-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.Name}
                  onChange={(e) =>
                    setFormData({ ...formData, Name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#d9d9e1]"
                  placeholder="Enter category name"
                  required
                />
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.Description}
                  onChange={(e) =>
                    setFormData({ ...formData, Description: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#d9d9e1] h-32 resize-none"
                  placeholder="Enter description"
                  required
                />
              </div>

              {/* Image Upload with Drag & Drop */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image
                </label>
                <div
                  className="relative border-2 border-dashed border-gray-300 rounded-sm p-4 h-32 bg-white flex flex-col justify-center items-center hover:bg-gray-50 transition cursor-pointer"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#d9d9e1]"
                  placeholder="Parent category"
                />
              </div>

              {/* Priority */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <input
                  type="text"
                  value={formData.Priority || ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    // Only allow numbers and empty string
                    if (value === '' || /^\d+$/.test(value)) {
                      setFormData({
                        ...formData,
                        Priority: value === '' ? 0 : Number(value)
                      });
                    }
                    // If invalid input, just ignore it (don't update state)
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#d9d9e1]"
                  placeholder="1"
                  min={1}
                  required
                />
              </div>

              {/* Status */}
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <ButtonPage
                  checked={formData.Status === "Active"}
                  onChange={handleStatusChange}
                />
              </div>
            </div>

            {/* Fixed Action Buttons */}
            <div className="flex gap-3 pt-6 justify-end border-t border-gray-200 mt-auto">
              <button
                type="button"
                onClick={handleCloseModal}
                disabled={actionLoading}
                className="px-6 py-2 border border-gray-300 rounded-sm hover:bg-gray-50 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <X size={16} />
                Cancel
              </button>
              <button
                type="button"
                onClick={handleModalSubmit}
                disabled={
                  !formData.Name.trim() ||
                  !formData.Description.trim() ||
                  actionLoading
                }
                className={`px-6 py-2 rounded-sm transition-colors flex items-center gap-2 ${!formData.Name.trim() ||
                  !formData.Description.trim() ||
                  actionLoading
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-[#2C2C2C] text-white hover:bg-gray-700"
                  }`}
              >
                {actionLoading ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-b-2 border-white rounded-full"></div>
                    {editingItem ? "Updating..." : "Saving..."}
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    {editingItem ? "Update" : "Save & Close"}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
