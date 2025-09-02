"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useParams } from "next/navigation";
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
import ResponsiveEditButton from "@/components/layout/UI/ResponsiveEditButton";
import ActionBar from "@/components/layout/UI/ActionBar";
// Types
interface MenuItem {
  Branch_ID_fk: string;
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
    { Branch_ID_fk: "1", POS_ID: "1", POS_Name: "POS 1", Status: "Active" },
    { Branch_ID_fk: "1", POS_ID: "2", POS_Name: "POS 2", Status: "Inactive" },
    { Branch_ID_fk: "1", POS_ID: "3", POS_Name: "POS 3", Status: "Active" },
    { Branch_ID_fk: "2", POS_ID: "4", POS_Name: "POS 1", Status: "Active" },
    { Branch_ID_fk: "2", POS_ID: "5", POS_Name: "POS 2", Status: "Inactive" },
    { Branch_ID_fk: "3", POS_ID: "6", POS_Name: "POS 1", Status: "Active" },
  ];

  static async getPosItemsByBranch(branchId: string): Promise<ApiResponse<MenuItem[]>> {
    await this.delay(800);

    // Filter POS items by branch ID
    const filteredData = this.mockData.filter(item => item.Branch_ID_fk === branchId);

    return {
      success: true,
      data: filteredData,
      message: `POS items for branch ${branchId} fetched successfully`,
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
    const itemToDelete = this.mockData.find(i => i.POS_ID === id);
    if (!itemToDelete) throw new Error("Item not found");

    this.mockData = this.mockData.filter((i) => i.POS_ID !== id);
    return {
      success: true,
      data: null,
      message: "POS item deleted successfully",
    };
  }

  static async bulkDeletePosItems(ids: string[]): Promise<ApiResponse<null>> {
    await this.delay(1000);
    this.mockData = this.mockData.filter((i) => !ids.includes(i.POS_ID));
    return {
      success: true,
      data: null,
      message: `${ids.length} POS items deleted successfully`,
    };
  }
}

// Toast Component
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
    setTimeout(() => setIsVisible(true), 10);
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  return (
    <div
      className={`fixed top-4 right-4 px-4 py-3 rounded-sm shadow-lg z-50 flex items-center gap-2 transition-all duration-300 ease-out transform ${type === "success" ? "bg-green-400 text-white" : "bg-red-400 text-white"
        } ${isVisible && !isClosing
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
  const params = useParams();
  const branchId = params?.branchId as string;

  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
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
    Branch_ID_fk: branchId || "",
  });

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    if (branchId) {
      loadPosItems();
    }
  }, [branchId]);

  // Modal form sync
  useEffect(() => {
    if (editingItem) {
      setFormData({
        POS_Name: editingItem.POS_Name,
        Status: editingItem.Status,
        Branch_ID_fk: editingItem.Branch_ID_fk,
      });
    } else {
      setFormData({
        POS_Name: "",
        Status: "Active",
        Branch_ID_fk: branchId || ""
      });
    }
  }, [editingItem, isModalOpen, branchId]);

  const loadPosItems = async () => {
    if (!branchId) {
      showToast("Branch ID not found", "error");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await PosAPI.getPosItemsByBranch(branchId);
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
      const response = await PosAPI.createPosItem({
        ...itemData,
        Branch_ID_fk: branchId,
      });
      if (response.success) {
        await loadPosItems();
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
        await loadPosItems();
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
    if (!formData.POS_Name.trim()) {
      showToast("Please enter a POS name", "error");
      return;
    }
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

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isModalOpen]);

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

  if (!branchId) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600">Branch ID not found in URL parameters</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen mt-17">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="mb-8 mt-2">
        <h1 className="text-3xl font-semibold">
          POS Systems - Branch #{branchId}
        </h1>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 max-w-[100vw]  lg:grid-cols-2   gap-4 mb-8 lg:max-w-[50vw]">
        <div className="flex items-center justify-start flex-1 gap-2 max-w-[100%] min-h-[100px] rounded-sm p-4 bg-white shadow-sm">
          <div>
            <p className="text-5xl mb-1">{menuItems.length}</p>
            <p className="text-1xl text-gray-500">Total POS</p>
          </div>
        </div>

        <div className="flex items-center justify-start flex-1 gap-2 max-w-[100%] min-h-[100px] rounded-sm p-4 bg-white shadow-sm">
          <div>
            <p className="text-5xl mb-1">
              {menuItems.filter((item) => item.Status === "Active").length}
            </p>
            <p className="text-1xl text-gray-500">Active POS</p>
          </div>
        </div>
      </div>

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

      {/* Responsive Table with Global CSS Classes */}
      <div className="bg-gray-50 rounded-sm border border-gray-300 max-w-[100vw]  shadow-sm responsive-customer-table ">
        <div className="rounded-sm table-container">
          <table className="min-w-full divide-y max-w-[800px] divide-gray-200   table-fixed">
            <thead className="bg-white border-b text-gray-500 border-gray-200  py-50 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-6 text-left w-[2.5px]">
                  <Checkbox
                    checked={isAllSelected}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    disableRipple
                    sx={{
                      transform: "scale(1.5)",
                      p: 0,
                    }}
                    icon={
                      <svg width="20" height="20" viewBox="0 0 24 24">
                        <rect
                          x="3"
                          y="3"
                          width="18"
                          height="18"
                          rx="3"
                          ry="3"
                          fill="#e0e0e0"
                          stroke="#d1d1d1"
                          strokeWidth="2"
                        />
                      </svg>
                    }
                    checkedIcon={
                      <svg width="20" height="20" viewBox="0 0 24 24">
                        <rect
                          x="3"
                          y="3"
                          width="18"
                          height="18"
                          rx="3"
                          ry="3"
                          fill="#e0e0e0"
                          stroke="#2C2C2C"
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

                      <DropdownMenu.Content
                        className="min-w-[120px] rounded-sm bg-white shadow-md border-none p-1 relative outline-none"
                        sideOffset={6}
                        onCloseAutoFocus={(e) => e.preventDefault()}
                        style={{ zIndex: 1000 }}
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
                    </DropdownMenu.Root>
                  </div>
                  <span className="absolute left-0 top-[15%] h-[70%] w-[1.5px] bg-gray-300"></span>
                </th>
                <th className="relative px-4 py-3 text-left">
                  Actions
                  <span className="absolute left-0 top-[15%] h-[70%] w-[1.5px] bg-gray-300"></span>
                </th>
              </tr>
            </thead>

            <tbody className="divide-y text-gray-500 divide-gray-300">
              {filteredItems.length === 0 ? (
                <tr className="bg-white hover:bg-gray-50">
                  <td
                    colSpan={5}
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    {searchTerm || statusFilter
                      ? `No POS match your search criteria for Branch #${branchId}.`
                      : `No POS found for Branch #${branchId}.`}
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr
                    key={item.POS_ID}
                    className="bg-white hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <td className="px-6 py-8 whitespace-nowrap text-sm card-checkbox-cell" >
                      <Checkbox
                        checked={selectedItems.includes(item.POS_ID)}
                        onChange={(e) =>
                          handleSelectItem(item.POS_ID, e.target.checked)
                        }
                        disableRipple
                        sx={{
                          p: 0,
                          transform: "scale(1.5)",
                        }}
                        icon={
                          <svg width="20" height="20" viewBox="0 0 24 24">
                            <rect
                              x="3"
                              y="3"
                              width="18"
                              height="18"
                              rx="3"
                              ry="3"
                              fill="#e0e0e0"
                              stroke="#d1d1d1"
                              strokeWidth="2"
                            />
                          </svg>
                        }
                        checkedIcon={
                          <svg width="20" height="20" viewBox="0 0 24 24">
                            <rect
                              x="3"
                              y="3"
                              width="18"
                              height="18"
                              rx="3"
                              ry="3"
                              fill="#e0e0e0"
                              stroke="#2C2C2C"
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
                    <td className="px-4 py-4 whitespace-nowrap text-sm" data-label="POS ID">
                      {`#${String(item.POS_ID).padStart(3, "0")}`}
                    </td>

                    <td className="px-4 py-4 whitespace-nowrap text-sm card-name-cell" data-label="POS Name">
                      <span className="font-medium">{item.POS_Name}</span>

                    </td>

                    <td className="px-4 py-4 whitespace-nowrap" data-label="Status">
                      <span
                        className={`inline-block w-20  text-right  py-[2px] rounded-md text-xs font-medium 
                          ${item.Status === "Active" ? "text-green-400 " : ""}
                          ${item.Status === "Inactive" ? "text-red-400 " : ""}`}
                      >
                        {item.Status}
                      </span>
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

      {/* Modal for Add/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-71 px-4">
          <div className="bg-white rounded-sm p-4 sm:p-6 min-w-[35vw] max-w-2xl max-h-[70vh] min-h-[70vh] shadow-lg relative flex flex-col">
            {/* Header */} <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
                {editingItem ? "Edit POS" : `Add New POS - Branch #${branchId}`}
              </h2>
            </div>

            {/* Scrollable Content */}
            <div className=" flex-1 overflow-y-auto pr-1  pl-1">
              {/* POS Name */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  POS Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.POS_Name}
                  onChange={(e) =>
                    setFormData({ ...formData, POS_Name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#d9d9e1] focus:border-transparent"
                  placeholder="Enter POS name"
                  required
                />
              </div>

              {/* Status Toggle */}
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
            <div className="flex flex-col sm:flex-row gap-3 pt-4 sm:pt-6 justify-end border-t border-gray-200 mt-auto">
              <button
                type="button"
                onClick={handleCloseModal}
                disabled={actionLoading}
                className="w-full sm:w-auto px-6 py-2 border border-gray-300 rounded-sm hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <X size={16} />
                Cancel
              </button>
              <button
                type="button"
                onClick={handleModalSubmit}
                disabled={
                  !formData.POS_Name.trim() ||
                  actionLoading
                }
                className={`w-full sm:w-auto px-6 py-2 rounded-sm transition-colors flex items-center justify-center gap-2 ${!formData.POS_Name.trim() ||
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
                    {editingItem ? "Update POS" : "Add POS"}
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