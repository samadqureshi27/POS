"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  ChevronDown,
  Plus,
  Trash2,
  Search,
  AlertCircle,
  CheckCircle,
  X,
  Edit,
  Save,
} from "lucide-react";
import Checkbox from "@mui/material/Checkbox";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import ButtonPage from "@/components/layout/UI/button";

// Types
interface MenuItem {
  POS_ID: string;
  POS_Name: string;
  Status: "Active" | "Inactive";
}

interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

// Mock API
class PosAPI {
  private static delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  private static mockData: MenuItem[] = [
    { POS_ID: "1", POS_Name: "Main Branch", Status: "Active" },
    { POS_ID: "2", POS_Name: "North Branch", Status: "Inactive" },
    { POS_ID: "3", POS_Name: "South Branch", Status: "Active" },
    { POS_ID: "4", POS_Name: "East Branch", Status: "Active" },
    { POS_ID: "5", POS_Name: "West Branch", Status: "Inactive" },
  ];

  static async getPosItems(): Promise<ApiResponse<MenuItem[]>> {
    await this.delay(800);
    return {
      success: true,
      data: [...this.mockData],
      message: "POS items fetched successfully",
    };
  }

  static async createPosItem(
    item: Omit<MenuItem, "POS_ID">
  ): Promise<ApiResponse<MenuItem>> {
    await this.delay(1000);
    const newId = (this.mockData.length + 1).toString();
    const newItem: MenuItem = { ...item, POS_ID: newId };
    this.mockData.push(newItem);
    return {
      success: true,
      data: newItem,
      message: "POS item created successfully",
    };
  }

  static async updatePosItem(
    id: string,
    item: Partial<MenuItem>
  ): Promise<ApiResponse<MenuItem>> {
    await this.delay(800);
    const index = this.mockData.findIndex((i) => i.POS_ID === id);
    if (index === -1) throw new Error("Item not found");
    this.mockData[index] = { ...this.mockData[index], ...item };
    return {
      success: true,
      data: this.mockData[index],
      message: "POS item updated successfully",
    };
  }

  static async deletePosItem(id: string): Promise<ApiResponse<null>> {
    await this.delay(600);
    this.mockData = this.mockData
      .filter((i) => i.POS_ID !== id)
      .map((item, idx) => ({ ...item, POS_ID: (idx + 1).toString() }));
    return {
      success: true,
      data: null,
      message: "POS item deleted successfully",
    };
  }

  static async bulkDeletePosItems(ids: string[]): Promise<ApiResponse<null>> {
    await this.delay(1000);
    this.mockData = this.mockData
      .filter((i) => !ids.includes(i.POS_ID))
      .map((item, idx) => ({ ...item, POS_ID: (idx + 1).toString() }));
    return {
      success: true,
      data: null,
      message: `${ids.length} POS items deleted successfully`,
    };
  }
}

// Toast
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
      className={`fixed top-4 right-4 px-4 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2 transition-all duration-300 ease-out transform ${
        type === "success" ? "bg-green-400 text-white" : "bg-red-400 text-white"
      } ${
        isVisible && !isClosing
          ? "translate-x-0 opacity-100"
          : isClosing
          ? "translate-x-full opacity-0"
          : "translate-x-full opacity-0"
      }`}
    >
      {type === "success" ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
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

const PosListPage = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Debounced search
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [statusFilter, setStatusFilter] = useState<"" | "Active" | "Inactive">(
    ""
  );

  // Modal form state
  const [formData, setFormData] = useState<Omit<MenuItem, "POS_ID">>({
    POS_Name: "",
    Status: "Active",
  });

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => setSearchTerm(searchInput), 300);
    return () => clearTimeout(handler);
  }, [searchInput]);

  // Auto-close toast
  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  useEffect(() => {
    loadPosItems();
  }, []);

  // Modal form sync
  useEffect(() => {
    if (editingItem) {
      setFormData({
        POS_Name: editingItem.POS_Name,
        Status: editingItem.Status,
      });
    } else {
      setFormData({ POS_Name: "", Status: "Active" });
    }
  }, [editingItem, isModalOpen]);

  const showToast = (message: string, type: "success" | "error") =>
    setToast({ message, type });

  const loadPosItems = async () => {
    try {
      setLoading(true);
      const response = await PosAPI.getPosItems();
      if (!response.success) throw new Error(response.message);
      setMenuItems(response.data);
    } catch {
      showToast("Failed to load POS items", "error");
    } finally {
      setLoading(false);
    }
  };

  // Memoized filtering
  const filteredItems = useMemo(() => {
    const s = searchTerm.toLowerCase();
    return menuItems.filter((item) => {
      const matchesSearch = item.POS_Name.toLowerCase().includes(s);
      const matchesStatus = statusFilter ? item.Status === statusFilter : true;
      return matchesSearch && matchesStatus;
    });
  }, [menuItems, searchTerm, statusFilter]);

  const handleCreateItem = async (itemData: Omit<MenuItem, "POS_ID">) => {
    try {
      setActionLoading(true);
      const response = await PosAPI.createPosItem(itemData);
      if (response.success) {
        setMenuItems((prev) => [...prev, response.data]);
        setIsModalOpen(false);
        showToast(response.message || "POS created successfully", "success");
      }
    } catch {
      showToast("Failed to create POS", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateItem = async (itemData: Omit<MenuItem, "POS_ID">) => {
    if (!editingItem) return;
    try {
      setActionLoading(true);
      const response = await PosAPI.updatePosItem(editingItem.POS_ID, itemData);
      if (response.success) {
        setMenuItems((prev) =>
          prev.map((it) =>
            it.POS_ID === editingItem.POS_ID ? response.data : it
          )
        );
        setIsModalOpen(false);
        setEditingItem(null);
        showToast(response.message || "POS updated successfully", "success");
      }
    } catch {
      showToast("Failed to update POS", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedItems.length === 0) return;
    try {
      setActionLoading(true);
      const response = await PosAPI.bulkDeletePosItems(selectedItems);
      if (response.success) {
        // Refresh from API (IDs already re-assigned there)
        const updated = await PosAPI.getPosItems();
        setMenuItems(updated.data);
        setSelectedItems([]);
        showToast(response.message || "POS deleted successfully", "success");
      }
    } catch {
      showToast("Failed to delete POS", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleSelectAll = useCallback(
    (checked: boolean) => {
      setSelectedItems(checked ? filteredItems.map((i) => i.POS_ID) : []);
    },
    [filteredItems]
  );

  const handleSelectItem = useCallback((posId: string, checked: boolean) => {
    setSelectedItems((prev) =>
      checked ? [...prev, posId] : prev.filter((id) => id !== posId)
    );
  }, []);

  const handleModalSubmit = () => {
    if (!formData.POS_Name.trim()) return;
    if (editingItem) {
      handleUpdateItem(formData);
    } else {
      handleCreateItem(formData);
    }
  };

  const handleStatusChange = (isActive: boolean) => {
    setFormData((prev) => ({
      ...prev,
      Status: isActive ? "Active" : "Inactive",
    }));
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
          <p className="mt-4 text-gray-600">Loading POS List...</p>
        </div>
      </div>
    );
  }

  return (
    <div className=" p-6 bg-gray-50 min-h-screen">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <h1 className="text-3xl font-semibold mt-20 mb-8 ">POS List</h1>

      {/* Summary Cards */}
      <div className="flex gap-4 mb-8">
        <div className="flex items-center justify-start flex-1 gap-2 max-w-[300px] border border-gray-300 min-h-[100px] rounded-sm p-4 bg-white shadow-sm">
          <div>
            <p className="text-6xl mb-1">{menuItems.length}</p>
            <p className="text-1xl text-gray-500">Total POS</p>
          </div>
        </div>

        <div className="flex items-center justify-start flex-1 gap-2 max-w-[300px] border border-gray-300 min-h-[100px] rounded-sm p-4 bg-white shadow-sm">
          <div>
            <p className="text-6xl ">
              {menuItems.filter((item) => item.Status === "Active").length}
            </p>
            <p className="text-1xl text-gray-500">Active POS</p>
          </div>
        </div>
      </div>

      {/* Action bar */}
      <div className="mb-8 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex gap-3 h-[40px]">
          <button
            onClick={() => setIsModalOpen(true)}
            disabled={selectedItems.length > 0}
            className={`flex items-center text-center gap-2 w-[100px] px-6.5 py-2 rounded-sm transition-colors ${
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
            className={`flex items-center gap-2 px-4 py-2 rounded-sm transition-colors ${
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
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pr-10 pl-4 h-[40px] py-2 border bg-white border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#d9d9e1]"
          />
          <Search
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={16}
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-gray-50 rounded-sm border border-gray-300 max-w-[95vw]  shadow-sm ">
        <div className="max-h-[58vh] rounded-sm overflow-y-auto">
          <table className="min-w-full divide-y divide-gray-200   table-fixed">
            <thead className="bg-white border-b text-gray-500 border-gray-200  py-50 sticky top-0 z-10">
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
                  POS ID
                  <span className="absolute left-0 top-[15%] h-[70%] w-[1.5px] bg-gray-300"></span>
                </th>
                <th className="relative px-4 py-3 text-left">
                  POS Name
                  <span className="absolute left-0 top-[15%] h-[70%] w-[2px] bg-gray-300"></span>
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
                          className="min-w=[320px] rounded-md bg-white shadow-md border-none p-1 relative outline-none ml-80"
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
                    <span className="absolute left-0 top-[15%] h-[70%] w-[1.5px] bg-gray-300"></span>
                  </div>
                </th>
                <th className="relative px-4 py-3 text-left">
                  Actions
                  <span className="absolute left-0 top-[15%] h-[70%] w-[1.5px] bg-gray-300"></span>
                </th>
              </tr>
            </thead>

            <tbody className="divide-y text-gray-500  divide-gray-300">
              {filteredItems.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    {searchTerm || statusFilter
                      ? "No POS match your search criteria."
                      : "No POS found."}
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr key={item.POS_ID} className="bg-white hover:bg-gray-50">
                    <td className="px-6 py-8">
                      <Checkbox
                        checked={selectedItems.includes(item.POS_ID)}
                        onChange={(e) =>
                          handleSelectItem(item.POS_ID, e.target.checked)
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
                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                      {`#${String(item.POS_ID).padStart(3, "0")}`}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                      {item.POS_Name}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span
                        className={`inline-block w-20 text-center px-2 py-[2px] rounded-md text-xs font-medium 
                          ${item.Status === "Active" ? "text-green-400 " : ""}
                          ${item.Status === "Inactive" ? "text-red-400 " : ""}`}
                      >
                        {item.Status}
                      </span>
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
        <div className="fixed inset-0  bg-black/30 backdrop-blur-sm flex items-center justify-center z-71">
          <div className="bg-white rounded-lg p-6 min-w-[35vw] max-w-2xl max-h-[70vh] min-h-[70vh] overflow-y-auto shadow-lg relative flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">
                {editingItem ? "Edit POS" : "Add New POS"}
              </h2>
            </div>

            {/* Content */}
            <div className="space-y-3 flex-1 overflow-y-auto">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  POS Name
                </label>
                <input
                  type="text"
                  value={formData.POS_Name}
                  onChange={(e) =>
                    setFormData({ ...formData, POS_Name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d9d9e1]"
                  required
                />
              </div>

              {/* Status */}
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <ButtonPage
                  checked={formData.Status === "Active"}
                  onChange={handleStatusChange}
                />
              </div>
            </div>

            {/* Action Buttons pinned bottom-right */}
            <div className="flex gap-3 pt-6 justify-end border-t border-gray-200 mt-auto">
              <button
                type="button"
                onClick={handleCloseModal}
                disabled={actionLoading}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <X size={16} />
                Cancel
              </button>
              <button
                type="button"
                onClick={handleModalSubmit}
                disabled={!formData.POS_Name.trim() || actionLoading}
                className={`px-6 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                  !formData.POS_Name.trim() || actionLoading
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
                    {editingItem ? "Update Staff" : "Add Staff"}
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

export default PosListPage;
