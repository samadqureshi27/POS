"use client";

import React from "react";
import { ChevronDown } from "lucide-react";
import Checkbox from "@mui/material/Checkbox";
import ButtonPage from "../../../components/layout/UI/button";
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
import ResponsiveEditButton from "@/components/layout/UI/ResponsiveEditButton";
import ActionBar from "@/components/layout/UI/ActionBar";
interface RecipeOption {
  ID: number;
  Name: string;
  Status: "Active" | "Inactive";
  Description: string;
  OptionValue: string[];
  OptionPrice: number[];
  IngredientValue: string[];
  IngredientPrice: number[];
  Priority: number;
}

interface Ingredient {
  ID: number;
  Name: string;
  Unit: string;
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
      IngredientValue: ["Mozzarella", "Cheddar", "Parmesan"],
      IngredientPrice: [0, 0.5, 1],
      Priority: 1,
    },
    {
      ID: 2,
      Name: "Pepperoni",
      Status: "Active",
      Description: "Bread ",
      OptionValue: ["Mozzarella", "Cheddar", "Parmesan"],
      OptionPrice: [0, 0.5, 1],
      IngredientValue: ["Mozzarella", "Cheddar", "Parmesan"],
      IngredientPrice: [0, 0.5, 1],
      Priority: 2,
    },
    {
      ID: 3,
      Name: "Mushrooms",
      Status: "Inactive",
      Description: "Bread ",
      OptionValue: ["Mozzarella", "Cheddar", "Parmesan"],
      OptionPrice: [0, 0.5, 1],
      IngredientValue: ["Mozzarella", "Cheddar", "Parmesan"],
      IngredientPrice: [0, 0.5, 1],
      Priority: 3,
    },
    {
      ID: 4,
      Name: "Olives",
      Status: "Inactive",
      Description: "Bread ",
      OptionValue: ["Mozzarella", "Cheddar", "Parmesan"],
      OptionPrice: [0, 0.5, 1],
      IngredientValue: ["Mozzarella", "Cheddar", "Parmesan"],
      IngredientPrice: [0, 0.5, 1],
      Priority: 3,
    },
    {
      ID: 5,
      Name: "Onions",
      Status: "Inactive",
      Description: "Bread ",
      OptionValue: ["Mozzarella", "Cheddar", "Parmesan"],
      OptionPrice: [0, 0.5, 1],
      IngredientValue: ["Mozzarella", "Cheddar", "Parmesan"],
      IngredientPrice: [0, 0.5, 1],
      Priority: 4,
    },
    {
      ID: 6,
      Name: "Green Peppers",
      Status: "Inactive",
      Description: "Bread ",
      OptionValue: ["Mozzarella", "Cheddar", "Parmesan"],
      OptionPrice: [0, 0.5, 1],
      IngredientValue: ["Mozzarella", "Cheddar", "Parmesan"],
      IngredientPrice: [0, 0.5, 1],
      Priority: 3,
    },
    {
      ID: 7,
      Name: "Bacon",
      Status: "Inactive",
      Description: "Bread ",
      OptionValue: ["Mozzarella", "Cheddar", "Parmesan"],
      OptionPrice: [0, 0.5, 1],
      IngredientValue: ["Mozzarella", "Cheddar", "Parmesan"],
      IngredientPrice: [0, 0.5, 1],
      Priority: 3,
    },
    {
      ID: 8,
      Name: "Pineapple",
      Status: "Inactive",
      Description: "Bread ",
      OptionValue: ["Mozzarella", "Cheddar", "Parmesan"],
      OptionPrice: [0, 0.5, 1],
      IngredientValue: ["Mozzarella", "Cheddar", "Parmesan"],
      IngredientPrice: [0, 0.5, 1],
      Priority: 3,
    },
    {
      ID: 9,
      Name: "Tomato",
      Status: "Inactive",
      Description: "Bread ",
      OptionValue: ["Mozzarella", "Cheddar", "Parmesan"],
      OptionPrice: [0, 0.5, 1],
      IngredientValue: ["Mozzarella", "Cheddar", "Parmesan"],
      IngredientPrice: [0, 0.5, 1],
      Priority: 4,
    },
    {
      ID: 10,
      Name: "Spinach",
      Status: "Inactive",
      Description: "Bread ",
      OptionValue: ["Mozzarella", "Cheddar", "Parmesan"],
      OptionPrice: [0, 0.5, 1],
      IngredientValue: ["Mozzarella", "Cheddar", "Parmesan"],
      IngredientPrice: [0, 0.5, 1],
      Priority: 4,
    },
  ];

  // Mock ingredients data with units
  public static mockIngredients: Ingredient[] = [
    { ID: 1, Name: "Tomato", Unit: "kg" },
    { ID: 2, Name: "Cheese", Unit: "g" },
    { ID: 3, Name: "Onion", Unit: "pieces" },
    { ID: 4, Name: "Lettuce", Unit: "g" },
    { ID: 5, Name: "Chicken", Unit: "kg" },
    { ID: 6, Name: "Beef", Unit: "kg" },
    { ID: 7, Name: "Flour", Unit: "g" },
    { ID: 8, Name: "Sugar", Unit: "g" },
    { ID: 9, Name: "Salt", Unit: "g" },
    { ID: 10, Name: "Pepper", Unit: "g" },
  ];

  static async getRecipeOption(): Promise<ApiResponse<RecipeOption[]>> {
    await this.delay(800);
    return {
      success: true,
      data: [...this.mockData],
      message: "Menu items fetched successfully",
    };
  }

  static async getIngredients(): Promise<ApiResponse<Ingredient[]>> {
    await this.delay(600);
    return {
      success: true,
      data: [...this.mockIngredients],
      message: "Ingredients fetched successfully",
    };
  }

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

  static async deleteRecipeOption(id: number): Promise<ApiResponse<null>> {
    await this.delay(600);
    const index = this.mockData.findIndex((i) => i.ID === id);
    if (index === -1) throw new Error("Item not found");

    this.mockData.splice(index, 1);
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

  static async bulkDeleteRecipeOption(
    ids: number[]
  ): Promise<ApiResponse<null>> {
    await this.delay(1000);
    this.mockData = this.mockData.filter((item) => !ids.includes(item.ID));
    this.mockData = this.mockData.map((item, idx) => ({
      ...item,
      ID: idx + 1,
      OptionValue: item.OptionValue ?? [],
      OptionPrice: item.OptionPrice ?? [],
      IngredientValue: item.IngredientValue ?? [],
      IngredientPrice: item.IngredientPrice ?? [],
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
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    setTimeout(() => setIsVisible(true), 10);
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    // Wait for exit animation to complete before calling onClose
    setTimeout(() => {
      onClose();
    }, 300);
  };

  return (
    <div
      className={`fixed top-4 right-4 px-4 py-3 rounded-sm shadow-lg z-50 flex items-center gap-2 transition-all duration-300 ease-out transform ${
        type === "success" ? "bg-green-400 text-white" : "bg-red-400 text-white"
      } ${
        isVisible && !isClosing
          ? "translate-x-0 opacity-100"
          : isClosing
          ? "translate-x-full opacity-0"
          : "translate-x-full opacity-0"
      }`}
    >
      {type === "success" ? (
        <CheckCircle size={16} />
      ) : (
        <AlertCircle size={16} />
      )}
      <span>{message}</span>
      <button
        onClick={handleClose}
        className="ml-2 hover:bg-black/10 rounded p-1 transition-colors duration-200"
      >
        <X size={16} />
      </button>
    </div>
  );
};

const RecipesManagementPage = () => {
  const [RecipeOptions, setRecipeOptions] = useState<RecipeOption[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<"" | "Active" | "Inactive">(
    ""
  );
  const [actionLoading, setActionLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingItem, setEditingItem] = useState<RecipeOption | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Recipe Info");
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  // Modal form state
  const [formData, setFormData] = useState<Omit<RecipeOption, "ID">>({
    Name: "",
    Status: "Inactive",
    Description: "",
    OptionValue: [],
    OptionPrice: [],
    IngredientValue: [],
    IngredientPrice: [],
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
    loadIngredients();
  }, []);

  // Prevent background scrolling when modal is open
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

  const loadIngredients = async () => {
    try {
      const response = await MenuAPI.getIngredients();
      if (response.success) {
        setIngredients(response.data);
      }
    } catch (error) {
      console.error("Error fetching ingredients:", error);
    }
  };

  // Modal form effect
  useEffect(() => {
    if (editingItem) {
      setFormData({
        Name: editingItem.Name,
        Status: editingItem.Status,
        Description: editingItem.Description,
        OptionValue: editingItem.OptionValue || [],
        OptionPrice: editingItem.OptionPrice || [],
        IngredientValue: editingItem.IngredientValue || [],
        IngredientPrice: editingItem.IngredientPrice || [],
        Priority: editingItem.Priority,
      });
    } else {
      setFormData({
        Name: "",
        Status: "Inactive",
        Description: "",
        OptionValue: [],
        OptionPrice: [],
        IngredientValue: [],
        IngredientPrice: [],
        Priority: 0,
      });
      setPreview(null);
    }
  }, [editingItem, isModalOpen]);

  useEffect(() => {
    if (isModalOpen) {
      setActiveTab("Recipe Info");
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
    const matchesStatus = statusFilter === "" || item.Status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateItem = async (itemData: Omit<RecipeOption, "ID">) => {
    try {
      setActionLoading(true);
      const response = await MenuAPI.createRecipeOption(itemData);
      if (response.success) {
        setRecipeOptions((prevItems) => [...prevItems, response.data]);
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

  // Fixed modal form handlers
  const handleModalSubmit = () => {
    // Validate required fields
    if (!formData.Name.trim()) {
      showToast("Please enter a recipe name", "error");
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
    <div className="bg-gray-50 min-w-full h-full overflow-y-auto thin-scroll">
      

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <h1 className="text-3xl font-semibold mt-14 mb-8">Recipes</h1>

      {/* Action bar: add, delete, search */}
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

      {/* Table + filters */}
      <div className="bg-gray-50 rounded-sm border border-gray-300 max-w-[100vw] shadow-sm responsive-customer-table">
        <div className="rounded-sm table-container">
          <table className="min-w-full divide-y divide-gray-200 table-fixed">
            <thead className="bg-white border-b text-gray-500 border-gray-200 py-50 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-6 text-left  w-[2.5px] ">
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
                  <span className="absolute left-0 top-[15%] h-[70%] w-[2px] bg-gray-300"></span>
                </th>
                <th className="relative px-4 py-3 text-left">
                  Name
                  <span className="absolute left-0 top-[15%] h-[70%] w-[1.5px] bg-gray-300"></span>
                </th>
                <th className="relative px-4 py-3 text-left">
                  <div className="flex flex-col gap-1">
                    <DropdownMenu.Root modal={false}>
                      <DropdownMenu.Trigger className="px-2 py-1 rounded text-sm bg-transparent border-none outline-none hover:bg-transparent flex items-center gap-2 focus:outline-none focus:ring-0 cursor-pointer">
                        {statusFilter || "Status"}
                        <ChevronDown
                          size={14}
                          className="text-gray-500 ml-auto"
                        />
                      </DropdownMenu.Trigger>
                      <DropdownMenu.Portal>
                        <DropdownMenu.Content
                          className="min-w-[240px] rounded-sm bg-white shadow-md border-none p-1 relative outline-none"
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
                            className="px-3 py-1 text-sm cursor-pointer hover:bg-red-100 text-red-400 rounded outline-none"
                            onClick={() => setStatusFilter("Inactive")}
                          >
                            Inactive
                          </DropdownMenu.Item>
                          <DropdownMenu.Item
                            className="px-3 py-1 text-sm cursor-pointer hover:bg-green-100 text-green-400 rounded outline-none"
                            onClick={() => setStatusFilter("Active")}
                          >
                            Active
                          </DropdownMenu.Item>
                        </DropdownMenu.Content>
                      </DropdownMenu.Portal>
                    </DropdownMenu.Root>
                  </div>
                  <span className="absolute left-0 top-[15%] h-[70%] w-[1.5px] bg-gray-300"></span>
                </th>
                <th className="relative px-4 py-3 text-left">
                  Description
                  <span className="absolute left-0 top-[15%] h-[70%] w-[1.5px] bg-gray-300"></span>
                </th>
                <th className="relative px-4 py-3 text-left">
                  Priority
                  <span className="absolute left-0 top-[15%] h-[70%] w-[1.5px] bg-gray-300"></span>
                </th>
                <th className="relative px-4 py-3 text-left">
                  Actions
                  <span className="absolute left-0 top-[15%] h-[70%] w-[1.5px] bg-gray-300"></span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y text-gray-500 divide-gray-300">
              {filteredItems.map((item) => (
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
                  <td className="px-4 py-4 whitespace-nowrap" data-label="ID">
                    {item.ID}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap card-name-cell" data-label="Name">
                    {item.Name}
                  </td>
                  <td
                    className="px-4 py-4 whitespace-nowrap"
                    data-label="Status"
                  >
                    <span
                      className={`inline-block w-24 text-right  py-[2px] rounded-sm text-xs font-medium  ${
                        item.Status === "Inactive"
                          ? "text-red-400 "
                          : "text-green-400 "
                      }`}
                    >
                      {item.Status}
                    </span>
                  </td>
                  <td
                    className="px-4 py-4 whitespace-nowrap"
                    data-label="Description"
                  >
                    {item.Description}
                  </td>
                  <td
                    className="px-4 py-4 whitespace-nowrap text-sm text-gray-600"
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
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0  bg-black/30 backdrop-blur-sm flex items-center justify-center z-71">
          <div className="bg-white rounded-sm min-w-[35vw] max-w-2xl md:min-h-[70vh] max-h-[70vh] overflow-hidden shadow-lg relative flex flex-col">
            {/* Navbar inside modal */}
            <h1 className="text-2xl pl-5 pt-2 font-medium">
              {editingItem ? "Edit Recipe" : "Add Recipe"}
            </h1>
            <div className="flex md:w-[350px] items-center justify-center border-b border-gray-200 mx-auto">
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
            <div className="p-3 sm:p-6 flex-1 overflow-hidden">
              {activeTab === "Recipe Info" && (
                <div className="space-y-6 sm:space-y-8">
                  {/* Name - Fixed to use proper input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Recipe Name
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
                      placeholder="Enter recipe name"
                      required
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

                  {/* Description */}
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#d9d9e1]"
                      placeholder="Enter description"
                    />
                  </div>

                  {/* Status */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
                    <label className="block text-sm font-medium text-gray-700">
                      Status
                    </label>
                    <ButtonPage
                      checked={formData.Status === "Active"}
                      onChange={handleStatusChange}
                    />
                  </div>
                </div>
              )}

              {activeTab === "Recipe Option" && (
                <div className="space-y-4 h-full flex flex-col">
                  {/* Add Ingredient Button */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <DropdownMenu.Root>
                      <DropdownMenu.Trigger className="w-full flex items-center justify-between px-4 py-2 mb-2 text-black rounded-sm hover:bg-gray-300 transition-colors cursor-pointer border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#d9d9e1]">
                        <span className="text-sm">Add New Recipe Options</span>
                        <ChevronDown
                          size={16}
                          className="text-gray-500 flex-shrink-0"
                        />
                      </DropdownMenu.Trigger>

                      <DropdownMenu.Portal>
                        <DropdownMenu.Content
                          className="w-full min-w-[280px] max-w-[90vw] sm:min-w-[510px] rounded-sm bg-white shadow-sm border border-gray-200 p-1 outline-none overflow-visible z-[99999]"
                          sideOffset={6}
                          avoidCollisions={true}
                          collisionPadding={20}
                        >
                          <DropdownMenu.Arrow className="fill-white stroke-gray-200 w-5 h-3" />
                          <div className="max-h-60 overflow-y-auto">
                            {ingredients.map((ingredient) => (
                              <DropdownMenu.Item
                                key={ingredient.ID}
                                className="px-3 py-2 text-sm cursor-pointer hover:bg-blue-100 text-black rounded outline-none select-none"
                                onSelect={() => {
                                  if (
                                    !formData.OptionValue.includes(
                                      ingredient.Name
                                    )
                                  ) {
                                    setFormData({
                                      ...formData,
                                      OptionValue: [
                                        ...formData.OptionValue,
                                        ingredient.Name,
                                      ],
                                      OptionPrice: [...formData.OptionPrice, 0],
                                    });
                                  }
                                }}
                              >
                                {ingredient.Name}
                              </DropdownMenu.Item>
                            ))}
                          </div>
                        </DropdownMenu.Content>
                      </DropdownMenu.Portal>
                    </DropdownMenu.Root>
                  </div>

                  {/* Mobile Card Layout */}
                  <div className="block sm:hidden overflow-y-auto max-h-[300px]">
                    <div className="space-y-3 pb-4">
                      {formData.OptionValue.map((opt, idx) => (
                        <div
                          key={idx}
                          className="bg-white border border-gray-200 rounded-sm p-4 shadow-sm"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <Grip size={16} className="text-gray-400" />
                              <span className="font-medium text-gray-700">
                                Option {idx + 1}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                const updatedValues =
                                  formData.OptionValue.filter(
                                    (_, i) => i !== idx
                                  );
                                const updatedPrices =
                                  formData.OptionPrice.filter(
                                    (_, i) => i !== idx
                                  );
                                setFormData({
                                  ...formData,
                                  OptionValue: updatedValues,
                                  OptionPrice: updatedPrices,
                                });
                              }}
                              className="text-red-500 hover:text-red-700 p-1"
                            >
                              <X size={18} />
                            </button>
                          </div>

                          <div className="space-y-3">
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">
                                Name
                              </label>
                              <input
                                type="text"
                                value={opt}
                                readOnly
                                className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#d9d9e1] bg-gray-100 text-sm"
                                placeholder="Ingredient name"
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">
                                Price
                              </label>
                              <input
                                type="text"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                value={formData.OptionPrice[idx]}
                                onChange={(e) => {
                                  const updated = [...formData.OptionPrice];
                                  updated[idx] =
                                    Number(e.target.value.replace(/\D/g, "")) ||
                                    0;
                                  setFormData({
                                    ...formData,
                                    OptionPrice: updated,
                                  });
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#d9d9e1] text-sm"
                                placeholder="0"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Desktop Table Layout */}
                  <div className="hidden sm:flex sm:flex-col flex-1 min-h-0">
                    {/* Fixed Header */}
                    <div className="border border-gray-200 rounded-t-sm bg-gray-50 flex-shrink-0">
                      <table className="w-full">
                        <thead>
                          <tr>
                            <th className="w-12 p-3 text-center text-sm font-medium text-gray-700"></th>
                            <th className="p-3 text-left text-sm font-medium text-gray-700">
                              Name
                            </th>
                            <th className="w-24 p-3 text-left text-sm font-medium text-gray-700">
                              Price
                            </th>
                            <th className="w-12 p-3 text-center text-sm font-medium text-gray-700"></th>
                          </tr>
                        </thead>
                      </table>
                    </div>

                    {/* Scrollable Body */}
                    <div
                      className="border-l border-r border-b border-gray-200 rounded-b-sm overflow-y-auto bg-white max-h-[250px] min-h-[250px]"
                      style={{
                        scrollbarWidth: "thin",
                        scrollbarColor: "#cbd5e1 #f1f5f9",
                      }}
                    >
                      <DragDropContext
                        onDragEnd={(result) => {
                          const { source, destination } = result;
                          if (
                            !destination ||
                            source.index === destination.index
                          )
                            return;

                          const newOptionValue = Array.from(
                            formData.OptionValue
                          );
                          const [movedValue] = newOptionValue.splice(
                            source.index,
                            1
                          );
                          newOptionValue.splice(
                            destination.index,
                            0,
                            movedValue
                          );

                          const newOptionPrice = Array.from(
                            formData.OptionPrice
                          );
                          const [movedPrice] = newOptionPrice.splice(
                            source.index,
                            1
                          );
                          newOptionPrice.splice(
                            destination.index,
                            0,
                            movedPrice
                          );

                          setFormData({
                            ...formData,
                            OptionValue: newOptionValue,
                            OptionPrice: newOptionPrice,
                          });
                        }}
                      >
                        <Droppable droppableId="recipe-options">
                          {(provided) => (
                            <table className="w-full border-collapse">
                              <tbody
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                              >
                                {formData.OptionValue.map((opt, idx) => (
                                  <Draggable
                                    key={idx}
                                    draggableId={`recipe-option-${idx}`}
                                    index={idx}
                                  >
                                    {(provided, snapshot) => (
                                      <tr
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        className={`hover:bg-gray-50 ${
                                          snapshot.isDragging
                                            ? "bg-gray-100 shadow-sm"
                                            : ""
                                        } border-b border-gray-200`}
                                      >
                                        {/* Drag Handle */}
                                        <td
                                          className="p-3 text-center cursor-grab w-12"
                                          {...provided.dragHandleProps}
                                        >
                                          <Grip
                                            size={18}
                                            className="text-gray-500 mx-auto"
                                          />
                                        </td>

                                        {/* Ingredient Name (readonly) */}
                                        <td className="p-3">
                                          <input
                                            type="text"
                                            value={opt}
                                            readOnly
                                            className="w-full px-2 py-1 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#d9d9e1] bg-gray-100"
                                            placeholder="Ingredient name"
                                          />
                                        </td>

                                        {/* Option Price */}
                                        <td className="p-3 text-center w-24">
                                          <input
                                            type="text"
                                            inputMode="numeric"
                                            pattern="[0-9]*"
                                            value={formData.OptionPrice[idx]}
                                            onChange={(e) => {
                                              const updated = [
                                                ...formData.OptionPrice,
                                              ];
                                              updated[idx] =
                                                Number(
                                                  e.target.value.replace(
                                                    /\D/g,
                                                    ""
                                                  )
                                                ) || 0;
                                              setFormData({
                                                ...formData,
                                                OptionPrice: updated,
                                              });
                                            }}
                                            className="w-full px-2 py-1 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#d9d9e1] text-center"
                                            placeholder="0"
                                          />
                                        </td>

                                        {/* Delete Button */}
                                        <td className="p-3 text-center w-12">
                                          <button
                                            type="button"
                                            onClick={() => {
                                              const updatedValues =
                                                formData.OptionValue.filter(
                                                  (_, i) => i !== idx
                                                );
                                              const updatedPrices =
                                                formData.OptionPrice.filter(
                                                  (_, i) => i !== idx
                                                );
                                              setFormData({
                                                ...formData,
                                                OptionValue: updatedValues,
                                                OptionPrice: updatedPrices,
                                              });
                                            }}
                                            className="text-black border-2 px-2 py-1 rounded-sm hover:text-gray-700"
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
                </div>
              )}

              {activeTab === "Ingredients" && (
                <div className="space-y-4 h-full flex flex-col">
                  {/* Add Ingredient Button */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <DropdownMenu.Root>
                      <DropdownMenu.Trigger className="w-full flex items-center justify-between px-4 py-2 mb-2 text-black rounded-sm hover:bg-gray-300 transition-colors cursor-pointer border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#d9d9e1]">
                        <span className="text-sm">Add New Ingredients</span>
                        <ChevronDown
                          size={16}
                          className="text-gray-500 flex-shrink-0"
                        />
                      </DropdownMenu.Trigger>

                      <DropdownMenu.Portal>
                        <DropdownMenu.Content
                          className="w-full min-w-[280px] max-w-[90vw] sm:min-w-[510px] rounded-sm bg-white shadow-sm border border-gray-200 p-1 outline-none overflow-visible z-[99999]"
                          sideOffset={6}
                          avoidCollisions={true}
                          collisionPadding={20}
                        >
                          <DropdownMenu.Arrow className="fill-white stroke-gray-200 w-5 h-3" />
                          <div className="max-h-60 overflow-y-auto">
                            {ingredients.map((ingredient) => (
                              <DropdownMenu.Item
                                key={ingredient.ID}
                                className="px-3 py-2 text-sm cursor-pointer hover:bg-blue-100 text-black rounded-sm outline-none select-none"
                                onSelect={() => {
                                  if (
                                    !formData.IngredientValue.includes(
                                      ingredient.Name
                                    )
                                  ) {
                                    setFormData({
                                      ...formData,
                                      IngredientValue: [
                                        ...formData.IngredientValue,
                                        ingredient.Name,
                                      ],
                                      IngredientPrice: [
                                        ...formData.IngredientPrice,
                                        0,
                                      ],
                                    });
                                  }
                                }}
                              >
                                {ingredient.Name}
                              </DropdownMenu.Item>
                            ))}
                          </div>
                        </DropdownMenu.Content>
                      </DropdownMenu.Portal>
                    </DropdownMenu.Root>
                  </div>

                  {/* Mobile Card Layout */}
                  <div className="block sm:hidden overflow-y-auto max-h-[300px]">
                    <div className="space-y-3 pb-4">
                      {formData.IngredientValue.map((opt, idx) => (
                        <div
                          key={idx}
                          className="bg-white border border-gray-200 rounded-sm p-4 shadow-sm"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <Grip size={16} className="text-gray-400" />
                              <span className="font-medium text-gray-700">
                                Ingredient {idx + 1}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                const updatedValues =
                                  formData.IngredientValue.filter(
                                    (_, i) => i !== idx
                                  );
                                const updatedPrices =
                                  formData.IngredientPrice.filter(
                                    (_, i) => i !== idx
                                  );
                                setFormData({
                                  ...formData,
                                  IngredientValue: updatedValues,
                                  IngredientPrice: updatedPrices,
                                });
                              }}
                              className="text-red-500 hover:text-red-700 p-1"
                            >
                              <X size={18} />
                            </button>
                          </div>

                          <div className="space-y-3">
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">
                                Name
                              </label>
                              <input
                                type="text"
                                value={opt}
                                readOnly
                                className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#d9d9e1] bg-gray-100 text-sm"
                                placeholder="Ingredient name"
                              />
                            </div>

                            <div>
                              <label className="block text-xs  font-medium text-gray-600 mb-1">
                                Amount
                              </label>
                              <input
                                type="text"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                value={formData.IngredientPrice[idx]}
                                onChange={(e) => {
                                  const updated = [...formData.IngredientPrice];
                                  updated[idx] =
                                    Number(e.target.value.replace(/\D/g, "")) ||
                                    0;
                                  setFormData({
                                    ...formData,
                                    IngredientPrice: updated,
                                  });
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#d9d9e1] text-sm"
                                placeholder="0"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Desktop Table Layout */}
                  <div className="hidden sm:flex sm:flex-col flex-1 min-h-0">
                    {/* Fixed Header */}
                    <div className="border border-gray-200 rounded-t-sm bg-gray-50 flex-shrink-0">
                      <table className="w-full">
                        <thead>
                          <tr>
                            <th className="w-12 p-3 text-center text-sm font-medium text-gray-700"></th>
                            <th className="p-3 text-left text-sm font-medium text-gray-700">
                              Name
                            </th>
                            <th className="w-24 p-3 text-center text-sm font-medium text-gray-700">
                              Amount
                            </th>
                            <th className="w-12 p-3 text-left text-sm font-medium text-gray-700"></th>
                          </tr>
                        </thead>
                      </table>
                    </div>

                    {/* Scrollable Body */}
                    <div
                      className="border-l border-r border-b border-gray-200 rounded-b-sm overflow-y-auto bg-white max-h-[250px] min-h-[250px]"
                      style={{
                        scrollbarWidth: "thin",
                        scrollbarColor: "#cbd5e1 #f1f5f9",
                      }}
                    >
                      <DragDropContext
                        onDragEnd={(result) => {
                          const { source, destination } = result;
                          if (
                            !destination ||
                            source.index === destination.index
                          )
                            return;

                          const newOptionValue = Array.from(
                            formData.IngredientValue
                          );
                          const [movedValue] = newOptionValue.splice(
                            source.index,
                            1
                          );
                          newOptionValue.splice(
                            destination.index,
                            0,
                            movedValue
                          );

                          const newOptionPrice = Array.from(
                            formData.IngredientPrice
                          );
                          const [movedPrice] = newOptionPrice.splice(
                            source.index,
                            1
                          );
                          newOptionPrice.splice(
                            destination.index,
                            0,
                            movedPrice
                          );

                          setFormData({
                            ...formData,
                            IngredientValue: newOptionValue,
                            IngredientPrice: newOptionPrice,
                          });
                        }}
                      >
                        <Droppable droppableId="ingredients">
                          {(provided) => (
                            <table className="w-full border-collapse">
                              <tbody
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                              >
                                {formData.IngredientValue.map((opt, idx) => (
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
                                          snapshot.isDragging
                                            ? "bg-gray-100 shadow-sm"
                                            : ""
                                        } border-b border-gray-200`}
                                      >
                                        {/* Drag Handle */}
                                        <td
                                          className="p-3 text-center cursor-grab w-12"
                                          {...provided.dragHandleProps}
                                        >
                                          <Grip
                                            size={18}
                                            className="text-gray-500 mx-auto"
                                          />
                                        </td>

                                        {/* Ingredient Name (readonly) */}
                                        <td className="p-3">
                                          <input
                                            type="text"
                                            value={opt}
                                            readOnly
                                            className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#d9d9e1] bg-gray-100"
                                            placeholder="Ingredient name"
                                          />
                                        </td>

                                        {/* Option Price */}
                                        <td className="p-3 text-center w-24">
                                          <input
                                            type="text"
                                            inputMode="numeric"
                                            pattern="[0-9]*"
                                            value={
                                              formData.IngredientPrice[idx]
                                            }
                                            onChange={(e) => {
                                              const updated = [
                                                ...formData.IngredientPrice,
                                              ];
                                              updated[idx] =
                                                Number(
                                                  e.target.value.replace(
                                                    /\D/g,
                                                    ""
                                                  )
                                                ) || 0;
                                              setFormData({
                                                ...formData,
                                                IngredientPrice: updated,
                                              });
                                            }}
                                            className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#d9d9e1] text-center"
                                            placeholder="0"
                                          />
                                        </td>

                                        {/* Delete Button */}
                                        <td className="p-3 text-center w-12">
                                          <button
                                            type="button"
                                            onClick={() => {
                                              const updatedValues =
                                                formData.IngredientValue.filter(
                                                  (_, i) => i !== idx
                                                );
                                              const updatedPrices =
                                                formData.IngredientPrice.filter(
                                                  (_, i) => i !== idx
                                                );
                                              setFormData({
                                                ...formData,
                                                IngredientValue: updatedValues,
                                                IngredientPrice: updatedPrices,
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
                </div>
              )}
            </div>

            {/* Fixed Action Buttons - Fixed alignment and separator */}
            <div className="flex flex-col p-2 md:flex-row gap-3 pt-6 justify-end md:pr-6 border-t border-gray-200 mt-6">
              <button
                type="button"
                onClick={handleCloseModal}
                disabled={actionLoading}
                className="px-6 py-2 border border-gray-300 rounded-sm hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed order-2 md:order-1"
              >
                <X size={16} />
                Cancel
              </button>
              <button
                type="button"
                onClick={handleModalSubmit}
                disabled={!formData.Name.trim() || actionLoading}
                className={`px-6 py-2 rounded-sm transition-colors flex items-center justify-center gap-2 order-1 md:order-2 ${
                  !formData.Name.trim() || actionLoading
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
                    {editingItem ? "Update Item" : "Add Item"}
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

export default RecipesManagementPage;
