"use client";

import React from "react";
import { ChevronDown } from "lucide-react";
import Checkbox from "@mui/material/Checkbox";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import {
  Plus,
  Trash2,
  Search,
  AlertCircle,
  CheckCircle,
  X,
  Grip,
  Edit,
  Filter,
  Save,
  ImageIcon,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";

interface RecipeOption {
  ID: number;
  Name: string;
  Status: "Active" | "Inactive";
  Description: string;
OptionValue: string[];
  OptionPrice: number[];
  Priority: number;
}

interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

class MenuAPI {
  private static delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  public static mockData: RecipeOption[] = [
    {
      ID: 1,
      Name: "Cheese",
      Status: "Active",
      Description: "Bread",
      OptionValue: ["Mozzarella", "Cheddar", "Parmesan"],
      OptionPrice: [0, 0.5, 1],
      

      Priority: 1,
    },
    {
      ID: 2,
      Name: "Pepperoni",
      Status: "Active",
      Description: "Bread ",
      OptionValue: ["Mozzarella", "Cheddar", "Parmesan"],
      OptionPrice: [0, 0.5, 1],

      Priority: 2,
    },
    {
      ID: 3,
      Name: "Mushrooms",
      Status: "Inactive",
      Description: "Bread ",
OptionValue: ["Mozzarella", "Cheddar", "Parmesan"],
      OptionPrice: [0, 0.5, 1],
      Priority: 3,
    },
    {
      ID: 4,
      Name: "Olives",
      Status: "Inactive",
      Description: "Bread ",
      OptionValue: ["Mozzarella", "Cheddar", "Parmesan"],
      OptionPrice: [0, 0.5, 1],

      Priority: 3,
    },
    {
      ID: 5,
      Name: "Onions",
      Status: "Inactive",
      Description: "Bread ",
      OptionValue: ["Mozzarella", "Cheddar", "Parmesan"],
      OptionPrice: [0, 0.5, 1],

      Priority: 4,
    },
    {
      ID: 6,
      Name: "Green Peppers",
      Status: "Inactive",
      Description: "Bread ",
      OptionValue: ["Mozzarella", "Cheddar", "Parmesan"],
      OptionPrice: [0, 0.5, 1],

      Priority: 3,
    },
    {
      ID: 7,
      Name: "Bacon",
      Status: "Inactive",
      Description: "Bread ",
      OptionValue: ["Mozzarella", "Cheddar", "Parmesan"],
      OptionPrice: [0, 0.5, 1],

      Priority: 3,
    },
    {
      ID: 8,
      Name: "Pineapple",
      Status: "Inactive",
      Description: "Bread ",
      OptionValue: ["Mozzarella", "Cheddar", "Parmesan"],
      OptionPrice: [0, 0.5, 1],

      Priority: 3,
    },
    {
      ID: 9,
      Name: "Tomato",
      Status: "Inactive",
      Description: "Bread ",
      OptionValue: ["Mozzarella", "Cheddar", "Parmesan"],
      OptionPrice: [0, 0.5, 1],

      Priority: 4,
    },
    {
      ID: 10,
      Name: "Spinach",
      Status: "Inactive",
      Description: "Bread ",
      OptionValue: ["Mozzarella", "Cheddar", "Parmesan"],
      OptionPrice: [0, 0.5, 1],

      Priority: 4,
    },
  ];

  // ✅ GET /api/menu-items/
  static async getRecipeOption(): Promise<ApiResponse<RecipeOption[]>> {
    await this.delay(800);
    return {
      success: true,
      data: [...this.mockData],
      message: "Menu items fetched successfully",
    };
  }

  // ✅ POST /api/menu-items/
  static async createRecipeOption(
    item: Omit<RecipeOption, "ID">
  ): Promise<ApiResponse<RecipeOption>> {
    await this.delay(1000);
    const newId =
      this.mockData.length > 0
        ? Math.max(...this.mockData.map((i) => i.ID)) + 1
        : 1;
    const newItem: RecipeOption = {
      ...item,
      ID: newId,
    };
    this.mockData.push(newItem);
    return {
      success: true,
      data: newItem,
      message: "Menu item created successfully",
    };
  }

  // ✅ PUT /api/menu-items/{id}/
  static async updateRecipeOption(
    id: number,
    item: Partial<RecipeOption>
  ): Promise<ApiResponse<RecipeOption>> {
    await this.delay(800);
    const index = this.mockData.findIndex((i) => i.ID === id);
    if (index === -1) throw new Error("Item not found");

    this.mockData[index] = { ...this.mockData[index], ...item };
    return {
      success: true,
      data: this.mockData[index],
      message: "Menu item updated successfully",
    };
  }

  // ✅ DELETE /api/menu-items/{id}/
  static async deleteRecipeOption(id: number): Promise<ApiResponse<null>> {
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
  static async bulkDeleteRecipeOption(
    ids: number[]
  ): Promise<ApiResponse<null>> {
    await this.delay(1000);
    this.mockData = this.mockData.filter((item) => !ids.includes(item.ID));

    // Reassign IDs sequentially
    this.mockData = this.mockData.map((item, idx) => ({
      ...item,
      ID: idx + 1,
      OptionValue: item.OptionValue ?? [],
      OptionPrice: item.OptionPrice ?? [],
    }));

    return {
      success: true,
      data: null,
      message: `${ids.length} menu items deleted successfully`,
    };
  }
}
const ingredientOptions = ["Tomato", "Cheese", "Onion", "Lettuce"];

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
    className={`fixed top-4 right-4 px-4 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2 ${
      type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"
    }`}
  >
    {type === "success" ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
    <span>{message}</span>
    <button onClick={onClose} className="ml-2">
      <X size={16} />
    </button>
  </div>
);

const recipesManagementPage = () => {
  const [RecipeOptions, setRecipeOptions] = useState<RecipeOption[]>([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<"" | "Active" | "Inactive">(
    ""
  );

  const [actionLoading, setActionLoading] = useState(false);
  const [selectedName, setSelectedName] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [editingItem, setEditingItem] = useState<RecipeOption | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(
    editingItem ? "Recipe Info" : "Recipe Info"
  );
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [DisplayFilter, setDisplayFilter] = useState<
    "" | "Active" | "Inactive"
  >("");

  // Modal form state
  const [formData, setFormData] = useState<Omit<RecipeOption, "ID">>({
    Name: "",

    Status: "Inactive",
    Description: "",
   OptionValue: [""],
  OptionPrice: [0],
    Priority: 1,
  });
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    loadRecipeOptions();
  }, []);


  // Modal form effect
  useEffect(() => {
    if (editingItem) {
      setFormData({
        Name: editingItem.Name,
        Status: editingItem.Status,
        Description: editingItem.Description,
        OptionValue: editingItem.OptionValue,
        OptionPrice: editingItem.OptionPrice,

        Priority: editingItem.Priority,
      });
    } else {
      setFormData({
        Name: "",
        Status: "Inactive",
        Description: "",
        OptionValue: [],
        OptionPrice: [],

        Priority: 1,
      });
      setPreview(null);
    }
  }, [editingItem, isModalOpen]);

  useEffect(() => {
    if (isModalOpen) {
      setActiveTab(editingItem ? "Recipe Info" : "Recipe Info");
    }
  }, [isModalOpen, editingItem]);

  const loadRecipeOptions = async () => {
    try {
      setLoading(true);
      const response = await MenuAPI.getRecipeOption();
      if (response.success) {
        setRecipeOptions(response.data);
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

  const filteredItems = RecipeOptions.filter((item) => {
    const matchesSearch = item.Name.toLowerCase().includes(
      searchTerm.toLowerCase()
    );
    return matchesSearch;
  });

  const handleCreateItem = async (itemData: Omit<RecipeOption, "ID">) => {
    try {
      setActionLoading(true);
      const response = await MenuAPI.createRecipeOption(itemData);
      if (response.success) {
        setRecipeOptions((prevItems) => [...prevItems, response.data]);
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

  const handleUpdateItem = async (itemData: Omit<RecipeOption, "ID">) => {
    if (!editingItem) return;
    try {
      setActionLoading(true);
      const response = await MenuAPI.updateRecipeOption(
        editingItem.ID,
        itemData
      );
      if (response.success) {
        setRecipeOptions(
          RecipeOptions.map((item) =>
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
      const response = await MenuAPI.bulkDeleteRecipeOption(selectedItems);
      if (response.success) {
        setRecipeOptions((prev) => {
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
    if (!formData.Name.trim()) {
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

  const isAllSelected =
    selectedItems.length === filteredItems.length && filteredItems.length > 0;
  const isSomeSelected = selectedItems.length > 0;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-b-2 border-yellow-600 rounded-full mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading Recipe Management...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 mx-6 bg-gray-50 min-h-screen overflow-y-auto">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <h1 className="text-3xl font-semibold mb-4 pl-20">Recipes</h1>

      {/* Action bar: add, delete, search */}
      <div className="mb-6 flex items-center justify-between gap-4 flex-wrap">
        {/* Action Buttons */}
        <div className="flex gap-3 pl-20">
          <button
            onClick={() => setIsModalOpen(true)}
            disabled={selectedItems.length > 0}
            className={`flex items-center text-center gap-2 w-[100px] px-4 py-2 rounded-lg transition-colors ${
              selectedItems.length === 0
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
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              isSomeSelected && !actionLoading
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
            placeholder="Search Ingredients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d9d9e1]"
          />
        </div>
      </div>

      {/* Table + filters */}
      <div className="bg-gray-50 rounded-lg ml-20 shadow-sm overflow-x-auto">
        <div className="max-h-[500px] overflow-y-auto">
          <table className="min-w-full divide-y divide-gray-200 table-fixed">
            <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 ">
              <tr>
                <th className="px-4 py-3 text-left">
                  <Checkbox
                    checked={isAllSelected}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    sx={{
                      color: "#2C2C2C",
                      "&.Mui-checked": { color: "#2C2C2C" },
                    }}
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
                  <div className="flex items-center gap-2">
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
                          className="min-w-[240px] rounded-md bg-white shadow-md border-none p-1 relative outline-none"
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
                            className="px-3 py-1 text-sm cursor-pointer hover:bg-red-100 text-red-700 rounded outline-none"
                            onClick={() => setStatusFilter("Inactive")}
                          >
                            Inactive
                          </DropdownMenu.Item>
                          <DropdownMenu.Item
                            className="px-3 py-1 text-sm cursor-pointer hover:bg-green
                            -100 text-green-700 rounded outline-none"
                            onClick={() => setStatusFilter("Active")}
                          >
                            Active
                          </DropdownMenu.Item>
                        </DropdownMenu.Content>
                      </DropdownMenu.Portal>
                    </DropdownMenu.Root>
                  </div>
                  <span className="absolute left-0 top-[15%] h-[70%] w-[2.5px] bg-[#d9d9e1]"></span>
                </th>

                <th className="relative px-4 py-3 text-left">
                  Description
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
              {filteredItems.map((item) => (
                <tr key={item.ID} className="bg-white hover:bg-gray-50">
                  <td className="px-4 py-4">
                    <Checkbox
                      checked={selectedItems.includes(item.ID)}
                      onChange={(e) =>
                        handleSelectItem(item.ID, e.target.checked)
                      }
                      sx={{
                        color: "#d9d9e1",
                        "&.Mui-checked": { color: "#d9d9e1" },
                      }}
                    />
                  </td>

                  <td className="px-4 py-4 whitespace-nowrap">{item.ID}</td>
                  <td className="px-4 py-4 whitespace-nowrap">{item.Name}</td>

                  <td className="px-4 py-4 whitespace-nowrap">
                    <span
                      className={`inline-block w-24 text-center px-2 py-[2px] rounded-md text-xs font-medium border
                  ${
                    item.Status === "Inactive"
                      ? "text-red-600 border-red-600"
                      : ""
                  }
                 
                  ${
                    item.Status === "Active"
                      ? "text-green-700 border-green-700"
                      : ""
                  }
                `}
                    >
                      {item.Status}
                    </span>
                  </td>

                  <td className="px-4 py-4 whitespace-nowrap">
                    {item.Description}
                  </td>

                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                    {item.Priority}
                  </td>

                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setEditingItem(item);
                          setIsModalOpen(true);
                        }}
                        className="text-black hover:text-gray-800 transition-colors"
                        title="Edit"
                      >
                        <Edit size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg min-w-[35vw]  max-w-2xl min-h-[60vh] max-h-[95vh] overflow-y-auto shadow-lg relative">
            {/* Navbar inside modal */}
            <h1 className="text-2xl pl-5 pt-2 font-medium">
              {editingItem ? "Edit Option Menu" : "Add  Option Menu"}
            </h1>
            <div className="flex w-[350px] items-center justify-center  border-b border-gray-200  mx-auto">
              {["Recipe Info", "Ingredients", "Recipe Option"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                    activeTab === tab
                      ? "border-b-2 border-black text-black"
                      : "text-gray-500 hover:text-black hover:bg-gray-50"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Modal Content */}
            <div className="p-6 ">
              {activeTab === "Recipe Info" && (
                <div className="space-y-8">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Recipe Name
                    </label>
                    <div className="flex items-center gap-2 ">
                      <DropdownMenu.Root>
                        <DropdownMenu.Trigger
  className="w-full flex items-center justify-between px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d9d9e1]"
>
  <span className="text-sm">
    {"Pizza"}
    {selectedName || ""}
  </span>
  <ChevronDown size={16} className="text-gray-500" />
</DropdownMenu.Trigger>


                        <DropdownMenu.Portal>
                          <DropdownMenu.Content
                            className="min-w-[240px] rounded-md bg-white shadow-md border border-gray-200 p-1 relative outline-none"
                            sideOffset={6}
                          >
                            <DropdownMenu.Arrow className="fill-white stroke-gray-200 w-5 h-3" />

                            <DropdownMenu.Item
                              className="px-3 py-1 text-sm cursor-pointer hover:bg-gray-100 rounded outline-none"
                              onClick={() => setSelectedName("")}
                            >
                              None
                            </DropdownMenu.Item>

                            {Array.from(
                              new Set(MenuAPI.mockData.map((i) => i.Name))
                            ).map((name) => (
                              <DropdownMenu.Item
                                key={name}
                                className="px-3 py-1 text-sm cursor-pointer hover:bg-blue-100 text-black rounded outline-none"
                                onClick={() => setSelectedName(name)}
                              >
                                {name}
                              </DropdownMenu.Item>
                            ))}
                          </DropdownMenu.Content>
                        </DropdownMenu.Portal>
                      </DropdownMenu.Root>
                    </div>
                  </div>
                  {/* Priority */}{" "}
                  <div>
                    {" "}
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {" "}
                      Priority{" "}
                    </label>{" "}
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
                    />{" "}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>

                    <input
                      type="text"
                      value={formData.Description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          Description: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
              )}
{activeTab === "Ingredients" && (
  <div className="">
    {/* Add Ingredient Button */}
    <div className="">
      <select
        value=""
        onChange={(e) => {
          const selected = e.target.value;
          if (!selected) return;

          // Prevent duplicates
          if (!formData.OptionValue.includes(selected)) {
            setFormData({
              ...formData,
              OptionValue: [...formData.OptionValue, selected],
              OptionPrice: [...formData.OptionPrice, 0],
            });
          }
        }}
        className="px-4 py-2 mb-2 bg-black text-white rounded-lg hover:bg-gray-700 transition-colors cursor-pointer"
      >
        <option value="">+ Add Ingredient</option>
        {ingredientOptions.map((item, i) => (
          <option key={i} value={item} className="bg-white text-black">
            {item}
          </option>
        ))}
      </select>
    </div>

    {/* Fixed Header */}
    <div className="border border-gray-200 rounded-t-lg bg-gray-50">
      <table className="w-full">
        <thead>
          <tr>
            <th className="w-12 p-3 text-center text-sm font-medium text-gray-700"></th>
            <th className="w-80 p-3 text-left text-sm font-medium text-gray-700">
              Ingredient
            </th>
            <th className="p-3 text-center text-sm font-medium text-gray-700">
              Option Price
            </th>
            <th className="w-12 p-3 text-center text-sm font-medium text-gray-700"></th>
          </tr>
        </thead>
      </table>
    </div>

    {/* Scrollable Body */}
    <div className="border-l border-r border-b border-gray-200 rounded-b-lg max-h-60 overflow-y-auto bg-white">
      <DragDropContext
        onDragEnd={(result: DropResult) => {
          const { source, destination } = result;
          if (!destination || source.index === destination.index) return;

          const newOptionValue = Array.from(formData.OptionValue);
          const [movedValue] = newOptionValue.splice(source.index, 1);
          newOptionValue.splice(destination.index, 0, movedValue);

          const newOptionPrice = Array.from(formData.OptionPrice);
          const [movedPrice] = newOptionPrice.splice(source.index, 1);
          newOptionPrice.splice(destination.index, 0, movedPrice);

          setFormData({
            ...formData,
            OptionValue: newOptionValue,
            OptionPrice: newOptionPrice,
          });
        }}
      >
        <Droppable droppableId="ingredients">
          {(provided) => (
            <table className="w-full border-collapse">
              <tbody ref={provided.innerRef} {...provided.droppableProps}>
                {formData.OptionValue.map((opt, idx) => (
                  <Draggable
                    key={idx}
                    draggableId={`ingredient-${idx}`}
                    index={idx}
                  >
                    {(provided, snapshot) => (
                      <tr
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`hover:bg-gray-50 ${
                          snapshot.isDragging ? "bg-gray-100 shadow-lg" : ""
                        } border-b border-gray-200`}
                      >
                        {/* Drag Handle */}
                        <td
                          className="p-3 text-center cursor-grab w-12"
                          {...provided.dragHandleProps}
                        >
                          <Grip size={18} className="text-gray-500 mx-auto" />
                        </td>

                        {/* Ingredient Name (readonly) */}
                        <td className="min-w-[300px] p-3">
                          <input
                            type="text"
                            value={opt}
                            readOnly
                            className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#d9d9e1] bg-gray-100"
                            placeholder="Ingredient name"
                          />
                        </td>

                        {/* Option Price */}
                        <td className="p-3 text-center">
                          <input
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            value={formData.OptionPrice[idx]}
                            onChange={(e) => {
                              const updated = [...formData.OptionPrice];
                              updated[idx] =
                                Number(e.target.value.replace(/\D/g, "")) || 0;
                              setFormData({
                                ...formData,
                                OptionPrice: updated,
                              });
                            }}
                            className="w-20 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#d9d9e1] text-center mx-auto"
                            placeholder="0"
                          />
                        </td>

                        {/* Delete Button */}
                        <td className="p-3 text-center w-12">
                          <button
                            type="button"
                            onClick={() => {
                              const updatedValues =
                                formData.OptionValue.filter((_, i) => i !== idx);
                              const updatedPrices =
                                formData.OptionPrice.filter((_, i) => i !== idx);
                              setFormData({
                                ...formData,
                                OptionValue: updatedValues,
                                OptionPrice: updatedPrices,
                              });
                            }}
                            className="text-black border-2 px-2 py-1 rounded hover:text-gray-700"
                          >
                            <X size={20} />
                          </button>
                        </td>
                      </tr>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </tbody>
            </table>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  </div>
)}



            </div>
            {activeTab === "Recipe Option" && <div>Notes content</div>}

            {/* Action buttons */}
            <div className=" fixed bottom-41 right-145 flex justify-end gap-3 p-4 border-t w-[31.5vw] border-gray-200">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleModalSubmit}
                className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-700"
              >
                {editingItem ? "Update" : "Save & Close"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default recipesManagementPage;
