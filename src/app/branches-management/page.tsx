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
  Info,
} from "lucide-react";
import Checkbox from "@mui/material/Checkbox";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import ButtonPage from "@/components/layout/UI/button";
import { useRouter } from "next/navigation";
import ResponsiveEditButton from "@/components/layout/UI/ResponsiveEditButton"; ``

// Types
interface BranchItem {
  "Branch-ID": number;
  Branch_Name: string;
  Status: "Active" | "Inactive";
  "Contact-Info": string;
  Address: string;
  email: string;
  postalCode: string;
}

interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

// Mock API
class BranchAPI {
  private static delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  private static mockData: BranchItem[] = [
    {
      "Branch-ID": 1,
      Branch_Name: "Main Branch",
      Status: "Active",
      "Contact-Info": "03001234567",
      Address: "123 Main St.",
      email: "main@gmail.com",
      postalCode: "35346",
    },
    {
      "Branch-ID": 2,
      Branch_Name: "North Branch",
      Status: "Inactive",
      "Contact-Info": "03007654321",
      Address: "456 North Ave.",
      email: "north@gmail.com",
      postalCode: "2335346",
    },
    {
      "Branch-ID": 3,
      Branch_Name: "South Branch",
      Status: "Active",
      "Contact-Info": "03009876543",
      Address: "789 South Blvd.",
      email: "south@gmail.com",
      postalCode: "12345",
    },
  ];

  static async getBranchItems(): Promise<ApiResponse<BranchItem[]>> {
    await this.delay(800);
    return {
      success: true,
      data: [...this.mockData],
      message: "Branch items fetched successfully",
    };
  }

  static async createBranchItem(
    item: Omit<BranchItem, "Branch-ID">
  ): Promise<ApiResponse<BranchItem>> {
    await this.delay(1000);
    const newId = Math.max(...this.mockData.map((i) => i["Branch-ID"]), 0) + 1;
    const newItem: BranchItem = { ...item, "Branch-ID": newId };
    this.mockData.push(newItem);
    return {
      success: true,
      data: newItem,
      message: "Branch item created successfully",
    };
  }

  static async updateBranchItem(
    id: number,
    item: Partial<BranchItem>
  ): Promise<ApiResponse<BranchItem>> {
    await this.delay(800);
    const index = this.mockData.findIndex((i) => i["Branch-ID"] === id);
    if (index === -1) throw new Error("Item not found");
    this.mockData[index] = { ...this.mockData[index], ...item };
    return {
      success: true,
      data: this.mockData[index],
      message: "Branch item updated successfully",
    };
  }

  static async deleteBranchItem(id: number): Promise<ApiResponse<null>> {
    await this.delay(600);
    this.mockData = this.mockData
      .filter((i) => i["Branch-ID"] !== id)
      .map((item, idx) => ({ ...item, "Branch-ID": idx + 1 }));
    return {
      success: true,
      data: null,
      message: "Branch item deleted successfully",
    };
  }

  static async bulkDeleteBranchItems(
    ids: number[]
  ): Promise<ApiResponse<null>> {
    await this.delay(1000);
    this.mockData = this.mockData
      .filter((i) => !ids.includes(i["Branch-ID"]))
      .map((item, idx) => ({ ...item, "Branch-ID": idx + 1 }));
    return {
      success: true,
      data: null,
      message: `${ids.length} Branch items deleted successfully`,
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

const BranchListPage = () => {
  const [branchItems, setBranchItems] = useState<BranchItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingItem, setEditingItem] = useState<BranchItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [statusFilter, setStatusFilter] = useState<"" | "Active" | "Inactive">(
    ""
  );

  // Modal form state
  const [formData, setFormData] = useState<Omit<BranchItem, "Branch-ID">>({
    Branch_Name: "",
    Status: "Active",
    "Contact-Info": "",
    Address: "",
    email: "",
    postalCode: "",
  });

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    loadBranchItems();
  }, []);

  // Modal form sync
  useEffect(() => {
    if (editingItem) {
      setFormData({
        Branch_Name: editingItem.Branch_Name,
        Status: editingItem.Status,
        "Contact-Info": editingItem["Contact-Info"],
        Address: editingItem.Address,
        email: editingItem.email,
        postalCode: editingItem.postalCode,
      });
    } else {
      setFormData({
        Branch_Name: "",
        Status: "Active",
        "Contact-Info": "",
        Address: "",
        email: "",
        postalCode: "",
      });
    }
  }, [editingItem, isModalOpen]);

  const loadBranchItems = async () => {
    try {
      setLoading(true);
      const response = await BranchAPI.getBranchItems();
      if (!response.success) throw new Error(response.message);
      setBranchItems(response.data);
    } catch {
      showToast("Failed to load Branch items", "error");
    } finally {
      setLoading(false);
    }
  };

  // Memoized filtering
  const filteredItems = useMemo(() => {
    const s = searchTerm.toLowerCase();
    return branchItems.filter((item) => {
      const matchesSearch = item.Branch_Name.toLowerCase().includes(s);
      const matchesStatus = statusFilter ? item.Status === statusFilter : true;
      return matchesSearch && matchesStatus;
    });
  }, [branchItems, searchTerm, statusFilter]);

  const handleCreateItem = async (itemData: Omit<BranchItem, "Branch-ID">) => {
    try {
      setActionLoading(true);
      const response = await BranchAPI.createBranchItem(itemData);
      if (response.success) {
        setBranchItems((prev) => [...prev, response.data]);
        setIsModalOpen(false);
        showToast(response.message || "Branch created successfully", "success");
      }
    } catch {
      showToast("Failed to create Branch", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateItem = async (itemData: Omit<BranchItem, "Branch-ID">) => {
    if (!editingItem) return;
    try {
      setActionLoading(true);
      const response = await BranchAPI.updateBranchItem(
        editingItem["Branch-ID"],
        itemData
      );
      if (response.success) {
        setBranchItems((prev) =>
          prev.map((it) =>
            it["Branch-ID"] === editingItem["Branch-ID"] ? response.data : it
          )
        );
        setIsModalOpen(false);
        setEditingItem(null);
        showToast(response.message || "Branch updated successfully", "success");
      }
    } catch {
      showToast("Failed to update Branch", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedItems.length === 0) return;
    try {
      setActionLoading(true);
      const response = await BranchAPI.bulkDeleteBranchItems(selectedItems);
      if (response.success) {
        // Refresh from API (IDs already re-assigned there)
        const updated = await BranchAPI.getBranchItems();
        setBranchItems(updated.data);
        setSelectedItems([]);
        showToast(response.message || "Branch deleted successfully", "success");
      }
    } catch {
      showToast("Failed to delete Branch", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleSelectAll = useCallback(
    (checked: boolean) => {
      setSelectedItems(checked ? filteredItems.map((i) => i["Branch-ID"]) : []);
    },
    [filteredItems]
  );

  const handleSelectItem = useCallback((branchId: number, checked: boolean) => {
    setSelectedItems((prev) =>
      checked ? [...prev, branchId] : prev.filter((id) => id !== branchId)
    );
  }, []);

  const handleModalSubmit = () => {
    if (
      !formData.Branch_Name.trim() ||
      !formData["Contact-Info"].trim() ||
      !formData.Address.trim()
    ) {
      showToast("Please fill all required fields", "error");
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

  const router = useRouter();
  const handleCustomerClick = (branchId: number) => {
    console.log('Navigating to branch:', branchId);
    router.push(`/branch/${branchId}/pos`);
  };

  const isAllSelected =
    selectedItems.length === filteredItems.length && filteredItems.length > 0;
  const isSomeSelected = selectedItems.length > 0;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-b-2 border-yellow-600 rounded-full mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading Branch Management...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen mt-6 w-full px-4">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="mb-8 mt-2">
        <h1 className="text-3xl font-semibold">Branch Management</h1>
      </div>

      {/* Summary Cards - Same layout as POS page */}
      <div className="grid grid-cols-1 max-w-[100vw]  lg:grid-cols-2   gap-4 mb-8 lg:max-w-[50vw]">
        <div className="flex items-center justify-start flex-1 gap-2 max-w-[100%] min-h-[100px] rounded-sm p-4 bg-white shadow-sm">
          <div>
            <p className="text-5xl mb-1">{branchItems.length}</p>
            <p className="text-1xl text-gray-500">Total Branches</p>
          </div>
        </div>

        <div className="flex items-center justify-start flex-1 gap-2 max-w-[100%] min-h-[100px] rounded-sm p-4 bg-white shadow-sm">
          <div>
            <p className="text-5xl mb-1">
              {branchItems.filter((item) => item.Status === "Active").length}
            </p>
            <p className="text-1xl text-gray-500">Active Branches</p>
          </div>
        </div>

      </div>

      <div className="mb-8 flex items-center justify-between gap-4 flex-wrap">
        {/* Action Buttons */}
        <div className="flex gap-3 h-[35px] w-full md:h-[40px] md:w-[250px]">
          <button
            onClick={() => setIsModalOpen(true)}
            disabled={selectedItems.length > 0}
            className={`flex w-[50%] items-center text-center gap-2 md:w-[40%] px-6.5 py-2 rounded-sm transition-colors ${selectedItems.length === 0
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
            className={`flex w-[50%] items-center gap-2 px-4 md:w-[60%] py-2 rounded-sm transition-colors ${isSomeSelected && !actionLoading
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
            placeholder="Search Payment Methods..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-[35px] pr-10 pl-4 md:h-[40px] py-2 border bg-white border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#d9d9e1]"
          />
          <Search
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={16}
          />
        </div>
      </div>

      {/* Responsive Table with Global CSS Classes */}
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
                  Branch ID
                  <span className="absolute left-0 top-[15%] h-[70%] w-[1.5px] bg-gray-300"></span>
                </th>
                <th className="relative px-4 py-3 text-left">
                  Branch Name
                  <span className="absolute left-0 top-[15%] h-[70%] w-[1.5px] bg-gray-300"></span>
                </th>
                <th className="relative px-4 py-3 text-left">
                  <div className="flex items-center gap-2">
                    <DropdownMenu.Root modal={false}>
                      <DropdownMenu.Trigger className="px-2 py-1 rounded text-sm bg-transparent border-none outline-none hover:bg-transparent flex items-center gap-2 focus:outline-none focus:ring-0">
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
                  Contact Info
                  <span className="absolute left-0 top-[15%] h-[70%] w-[1.5px] bg-gray-300"></span>
                </th>
                <th className="relative px-4 py-3 text-left">
                  Address
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
                    colSpan={8}
                    className="px-6 py-8"
                  >
                    {searchTerm || statusFilter
                      ? "No branches match your search criteria."
                      : "No branches found."}
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr
                    key={item["Branch-ID"]}
                    className="bg-white hover:bg-gray-50 cursor-pointer transition-colors "
                    onClick={() => handleCustomerClick(item["Branch-ID"])}
                  >
                    <td className="px-6 py-8 whitespace-nowrap text-sm card-checkbox-cell " onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={selectedItems.includes(item["Branch-ID"])}
                        onChange={(e) =>
                          handleSelectItem(item["Branch-ID"], e.target.checked)
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
                    <td className="px-4 py-4 whitespace-nowrap" data-label="Branch ID">
                      {`#${String(item["Branch-ID"]).padStart(3, "0")}`}
                    </td>

                    <td className="px-4 py-4 whitespace-nowrap text-sm card-name-cell" data-label="Branch Name">
                      <span className="font-medium">{item.Branch_Name}</span>
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
                    <td className="px-4 py-4 whitespace-nowrap text-sm" data-label="Contact Info">
                      {item["Contact-Info"]}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm" data-label="Address">
                      <div className="truncate max-w-[150px]" title={item.Address}>
                        {item.Address}
                      </div>
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
            {/* Header */}
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
                {editingItem ? "Edit Branch" : "Add New Branch"}
              </h2>
            </div>

            {/* Scrollable Content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 flex-1 overflow-y-auto pr-1 p-2">
              {/* Branch Name */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Branch Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.Branch_Name}
                  onChange={(e) =>
                    setFormData({ ...formData, Branch_Name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#d9d9e1] focus:border-transparent"
                  placeholder="Enter branch name"
                  required
                />
              </div>

              {/* Contact Info */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Info <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData["Contact-Info"]}
                  onChange={(e) =>
                    setFormData({ ...formData, "Contact-Info": e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#d9d9e1] focus:border-transparent"
                  placeholder="Enter phone number"
                  required
                />
              </div>

              {/* Email */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                  <span className="text-xs text-gray-500 ml-1">(Optional)</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#d9d9e1] focus:border-transparent"
                  placeholder="Enter email address"
                />
              </div>

              {/* Address */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.Address}
                  onChange={(e) =>
                    setFormData({ ...formData, Address: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#d9d9e1] focus:border-transparent h-32 resize-none"
                  placeholder="Enter branch address"
                  required
                />
              </div>

              {/* Postal Code */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Postal Code
                  <span className="text-xs text-gray-500 ml-1">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={formData.postalCode}
                  onChange={(e) =>
                    setFormData({ ...formData, postalCode: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#d9d9e1] focus:border-transparent"
                  placeholder="Enter postal code"
                />
              </div>

              {/* Status Toggle */}
              <div className="sm:col-span-2 flex items-center justify-between">
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
                  !formData.Branch_Name.trim() ||
                  !formData["Contact-Info"].trim() ||
                  !formData.Address.trim() ||
                  actionLoading
                }
                className={`w-full sm:w-auto px-6 py-2 rounded-sm transition-colors flex items-center justify-center gap-2 ${!formData.Branch_Name.trim() ||
                  !formData["Contact-Info"].trim() ||
                  !formData.Address.trim() ||
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
                    {editingItem ? "Update Branch" : "Add Branch"}
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

export default BranchListPage;