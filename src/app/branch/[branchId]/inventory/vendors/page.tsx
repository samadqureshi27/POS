"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { ChevronDown } from "lucide-react";
import Checkbox from "@mui/material/Checkbox";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useParams } from "next/navigation";
import {
  Plus,
  Trash2,
  Search,
  AlertCircle,
  CheckCircle,
  X,
  Edit,
  Save,
} from "lucide-react";

interface VendorItem {
  ID: number;
  Company_Name: string;
  Name: string;
  Contact: string;
  Address: string;
  Email: string;
  Branch_ID: number; // Added branch association
}

interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

class VendorAPI {
  private static delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  private static mockData: VendorItem[] = [
    {
      ID: 1,
      Company_Name: "Al-1",
      Name: "Abdul Rahman",
      Contact: "03001234567",
      Address: "#777, Block G1, Johartown",
      Email: "abd@gmail.com",
      Branch_ID: 1,
    },
    {
      ID: 2,
      Company_Name: "Water Inc",
      Name: "Ahmad Ali",
      Contact: "03001231234",
      Address: "#777, Block G1, Johartown",
      Email: "csd@gmail.com",
      Branch_ID: 1,
    },
    {
      ID: 3,
      Company_Name: "Salt Inc",
      Name: "Hassan Ahmed",
      Contact: "03007897891",
      Address: "#777, Block G1, Johartown",
      Email: "yul@gmail.com",
      Branch_ID: 2,
    },
    {
      ID: 4,
      Company_Name: "Food Supplies Co",
      Name: "Muhammad Khan",
      Contact: "03009876543",
      Address: "#123, Block A2, DHA Phase 1",
      Email: "mkhan@foodsupplies.com",
      Branch_ID: 2,
    },
    {
      ID: 5,
      Company_Name: "Fresh Mart",
      Name: "Ali Hassan",
      Contact: "03005432109",
      Address: "#456, Gulberg III",
      Email: "ali@freshmart.com",
      Branch_ID: 3,
    },
    {
      ID: 6,
      Company_Name: "Tech Solutions",
      Name: "Usman Ali",
      Contact: "03001122334",
      Address: "#89, Model Town",
      Email: "usman@techsol.com",
      Branch_ID: 1,
    },
  ];

  // GET /api/vendors/branch/{branchId}
  static async getVendorItemsByBranch(branchId: number): Promise<ApiResponse<VendorItem[]>> {
    await this.delay(800);
    const filteredData = this.mockData.filter(vendor => vendor.Branch_ID === branchId);
    return {
      success: true,
      data: filteredData,
      message: `Vendor items for branch ${branchId} fetched successfully`,
    };
  }

  // POST /api/vendors/branch/{branchId}
  static async createVendorItem(
    item: Omit<VendorItem, "ID">,
    branchId: number
  ): Promise<ApiResponse<VendorItem>> {
    await this.delay(1000);
    const newId = Math.max(...this.mockData.map(i => i.ID), 0) + 1;
    const newItem: VendorItem = {
      ...item,
      ID: newId,
      Branch_ID: branchId,
    };
    this.mockData.push(newItem);
    return {
      success: true,
      data: newItem,
      message: "Vendor item created successfully",
    };
  }

  // PUT /api/vendors/{id}/
  static async updateVendorItem(
    id: number,
    item: Partial<VendorItem>
  ): Promise<ApiResponse<VendorItem>> {
    await this.delay(800);
    const index = this.mockData.findIndex((i) => i.ID === id);
    if (index === -1) throw new Error("Item not found");

    this.mockData[index] = { ...this.mockData[index], ...item };
    return {
      success: true,
      data: this.mockData[index],
      message: "Vendor item updated successfully",
    };
  }

  // DELETE /api/vendors/{id}/
  static async deleteVendorItem(id: number, branchId: number): Promise<ApiResponse<null>> {
    await this.delay(600);
    const index = this.mockData.findIndex((i) => i.ID === id);
    if (index === -1) throw new Error("Item not found");

    this.mockData.splice(index, 1);

    // Reassign IDs sequentially for the specific branch
    const branchVendors = this.mockData.filter(item => item.Branch_ID === branchId);
    branchVendors.forEach((item, idx) => {
      const originalIndex = this.mockData.findIndex(vendor => vendor.ID === item.ID);
      this.mockData[originalIndex].ID = idx + 1;
    });

    return {
      success: true,
      data: null,
      message: "Vendor item deleted successfully",
    };
  }

  // DELETE /api/vendors/branch/{branchId}/bulk-delete/
  static async bulkDeleteVendorItems(
    ids: number[],
    branchId: number
  ): Promise<ApiResponse<null>> {
    await this.delay(1000);
    this.mockData = this.mockData.filter((item) => !ids.includes(item.ID));

    // Reassign IDs sequentially for the specific branch
    const branchVendors = this.mockData.filter(item => item.Branch_ID === branchId);
    branchVendors.forEach((item, idx) => {
      const originalIndex = this.mockData.findIndex(vendor => vendor.ID === item.ID);
      this.mockData[originalIndex].ID = idx + 1;
    });

    return {
      success: true,
      data: null,
      message: `${ids.length} Vendor items deleted successfully`,
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
      className={`fixed top-4 right-4 px-4 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2 transition-all duration-300 ease-out transform ${type === "success" ? "bg-green-400 text-white" : "bg-red-400 text-white"
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

const VendorsPage = () => {
  const params = useParams();
  const branchId = parseInt(params?.branchId as string) || 1;

  const [vendorItems, setVendorItems] = useState<VendorItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [editingItem, setEditingItem] = useState<VendorItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  // Modal form state (removed Branch_ID from form as it's determined by route)
  const [formData, setFormData] = useState<Omit<VendorItem, "ID" | "Branch_ID">>({
    Company_Name: "",
    Name: "",
    Contact: "",
    Address: "",
    Email: "",
  });

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    loadVendorItems();
  }, [branchId]);

  // Modal form effect
  useEffect(() => {
    if (editingItem) {
      setFormData({
        Company_Name: editingItem.Company_Name,
        Name: editingItem.Name,
        Contact: editingItem.Contact,
        Address: editingItem.Address,
        Email: editingItem.Email,
      });
    } else {
      setFormData({
        Company_Name: "",
        Name: "",
        Contact: "",
        Address: "",
        Email: "",
      });
    }
  }, [editingItem, isModalOpen]);

  const loadVendorItems = async () => {
    try {
      setLoading(true);
      const response = await VendorAPI.getVendorItemsByBranch(branchId);
      if (response.success) {
        setVendorItems(response.data);
      } else {
        throw new Error(response.message || "Failed to fetch vendor items");
      }
    } catch (error) {
      console.error("Error fetching vendor items:", error);
      showToast("Failed to load vendor items", "error");
    } finally {
      setLoading(false);
    }
  };

  // Memoized filtered items for better performance
  const filteredItems = useMemo(() => {
    return vendorItems.filter((item) => {
      const q = searchTerm.trim().toLowerCase();
      const matchesQuery =
        q === "" ||
        item.Name.toLowerCase().includes(q) ||
        item.ID.toString().includes(q) ||
        item.Company_Name.toLowerCase().includes(q) ||
        item.Email.toLowerCase().includes(q) ||
        item.Contact.includes(q);
      return matchesQuery;
    });
  }, [vendorItems, searchTerm]);

  // Generate consistent usage data using item ID as seed
  const itemsWithUsage = useMemo(() => {
    return vendorItems.map((item) => {
      const seed = item.ID;
      const usageCount = Math.floor((seed * 17 + 23) % 100);
      return {
        ...item,
        usageCount,
      };
    });
  }, [vendorItems]);

  // Find most ordered vendor
  const mostOrderedVendor = useMemo(() => {
    if (itemsWithUsage.length === 0) return null;
    return itemsWithUsage.reduce((max, item) =>
      item.usageCount > max.usageCount ? item : max
    );
  }, [itemsWithUsage]);

  // Find least ordered vendor
  const leastOrderedVendor = useMemo(() => {
    if (itemsWithUsage.length === 0) return null;
    return itemsWithUsage.reduce((min, item) =>
      item.usageCount < min.usageCount ? item : min
    );
  }, [itemsWithUsage]);

  const handleCreateItem = async (itemData: Omit<VendorItem, "ID" | "Branch_ID">) => {
    try {
      setActionLoading(true);
      const response = await VendorAPI.createVendorItem(itemData, branchId);
      if (response.success) {
        setVendorItems((prevItems) => [...prevItems, response.data]);
        setIsModalOpen(false);
        showToast(response.message || "Vendor created successfully", "success");
      }
    } catch (error) {
      console.error("Error creating vendor:", error);
      showToast("Failed to create vendor", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateItem = async (itemData: Omit<VendorItem, "ID" | "Branch_ID">) => {
    if (!editingItem) return;
    try {
      setActionLoading(true);
      const response = await VendorAPI.updateVendorItem(
        editingItem.ID,
        itemData
      );
      if (response.success) {
        setVendorItems(
          vendorItems.map((item) =>
            item.ID === editingItem.ID ? response.data : item
          )
        );
        setIsModalOpen(false);
        setEditingItem(null);
        showToast(response.message || "Vendor updated successfully", "success");
      }
    } catch (error) {
      showToast("Failed to update vendor", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedItems.length === 0) return;
    try {
      setActionLoading(true);
      const response = await VendorAPI.bulkDeleteVendorItems(selectedItems, branchId);
      if (response.success) {
        setVendorItems((prev) => {
          const remaining = prev.filter((i) => !selectedItems.includes(i.ID));
          return remaining.map((it, idx) => ({ ...it, ID: idx + 1 }));
        });
        setSelectedItems([]);
        showToast(
          response.message || "Vendors deleted successfully",
          "success"
        );
      }
    } catch (error) {
      showToast("Failed to delete vendors", "error");
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
      !formData.Company_Name.trim() ||
      !formData.Email.trim() ||
      !formData.Contact.trim()
    ) {
      showToast("Please fill in all required fields", "error");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.Email)) {
      showToast("Please enter a valid email address", "error");
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
          <p className="mt-4 text-gray-600">Loading Vendors & Suppliers...</p>
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
           Vendors & Suppliers - Branch #{branchId} 
        </h1>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 max-w-[95vw]">
        <div className="flex items-center justify-start gap-2 min-h-[100px] border border-gray-300 rounded-sm p-4 bg-white shadow-sm">
          <div>
            <p className="text-6xl mb-1">{vendorItems.length}</p>
            <p className="text-1xl text-gray-500">Total Vendors</p>
          </div>
        </div>

        <div className="flex items-center justify-start gap-2 min-h-[100px] border border-gray-300 rounded-sm p-4 bg-white shadow-sm">
          <div>
            <p className="text-6xl mb-1">
              {itemsWithUsage.reduce((total, item) => total + item.usageCount, 0)}
            </p>
            <p className="text-1xl text-gray-500">Total Orders</p>
          </div>
        </div>





      </div>

      <div className="mb-6 flex items-center justify-between gap-4 flex-wrap">


        {/* Action Buttons */}
        <div className="flex gap-3 h-[40px]">
          <button
            onClick={() => setIsModalOpen(true)}
            disabled={selectedItems.length > 0}
            className={`flex items-center text-center gap-2 px-4 py-2 rounded-sm transition-colors ${selectedItems.length === 0
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
            className={`flex items-center gap-2 px-4 py-2 rounded-sm transition-colors ${isSomeSelected && !actionLoading
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

      {/* Responsive Table with Global CSS Classes */}
      <div className="bg-gray-50 md:bg-gray-50 rounded-sm border border-gray-300 max-w-[95vw] shadow-sm overflow-x-auto responsive-customer-table">
        <div className="table-container">
          <table className="min-w-full divide-y divide-gray-200 table-fixed">
            <thead className="bg-white border-b text-gray-500 border-gray-200 py-50 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-6 text-left w-24">
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
                <th className="relative px-4 py-3 text-left w-24">
                  ID
                  <span className="absolute left-0 top-[15%] h-[70%] w-[1.5px] bg-gray-300"></span>
                </th>
                <th className="relative px-4 py-3 text-left w-40">
                  Company Name
                  <span className="absolute left-0 top-[15%] h-[70%] w-[1.5px] bg-gray-300"></span>
                </th>
                <th className="relative px-4 py-3 text-left w-36">
                  Contact Person
                  <span className="absolute left-0 top-[15%] h-[70%] w-[1.5px] bg-gray-300"></span>
                </th>
                <th className="relative px-4 py-3 text-left w-36">
                  Contact
                  <span className="absolute left-0 top-[15%] h-[70%] w-[1.5px] bg-gray-300"></span>
                </th>
                <th className="relative px-4 py-3 text-left w-52">
                  Email
                  <span className="absolute left-0 top-[15%] h-[70%] w-[1.5px] bg-gray-300"></span>
                </th>
                <th className="relative px-4 py-3 text-left w-44">
                  Address
                  <span className="absolute left-0 top-[15%] h-[70%] w-[1.5px] bg-gray-300"></span>
                </th>
                <th className="relative px-4 py-3 text-left w-28">
                  Actions
                  <span className="absolute left-0 top-[15%] h-[70%] w-[1.5px] bg-gray-300"></span>
                </th>
              </tr>
            </thead>

            <tbody className="divide-y text-gray-500 divide-gray-300">
              {filteredItems.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    {searchTerm
                      ? `No vendors match your search criteria for Branch #${branchId}.`
                      : `No vendors found for Branch #${branchId}.`}
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr
                    key={item.ID}
                    className="bg-white hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <td className="px-6 py-8 whitespace-nowrap text-sm card-customer-id" data-label="Select">
                      <Checkbox
                        checked={selectedItems.includes(item.ID)}
                        onChange={(e) =>
                          handleSelectItem(item.ID, e.target.checked)
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
                    <td className="px-4 py-4 whitespace-nowrap text-sm" data-label="Vendor ID">
                      {item.ID}
                    </td>

                    <td className="px-4 py-4 whitespace-nowrap text-sm card-name-cell" data-label="Company Name">
                      <div className="name-content">
                        <span className="font-medium">{item.Company_Name}</span>
                      </div>
                    </td>

                    <td className="px-4 py-4 whitespace-nowrap text-sm" data-label="Contact Person">
                      {item.Name}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm" data-label="Contact">
                      {item.Contact}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm" data-label="Email">
                      {item.Email}
                    </td>
                    <td
                      className="px-4 py-4 whitespace-nowrap text-sm "
                      data-label="Address"
                    >
                      {item.Address}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap" data-label="Actions">
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

      {/* Modal for Add/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0  bg-black/30 backdrop-blur-sm flex items-center justify-center z-71">
          <div className="bg-white rounded-lg p-6 min-w-[35vw] max-w-2xl max-h-[70vh] min-h-[70vh] shadow-lg relative flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">
                {editingItem ? "Edit Vendor" : `Add New Vendor - Branch #${branchId}`}
              </h2>
            </div>

            {/* Scrollable Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 overflow-y-auto pr-1">
              {/* Company Name */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.Company_Name}
                  onChange={(e) =>
                    setFormData({ ...formData, Company_Name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d9d9e1] focus:border-transparent"
                  placeholder="Enter company name"
                  required
                />
              </div>

              {/* Contact Person Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Person Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.Name}
                  onChange={(e) =>
                    setFormData({ ...formData, Name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d9d9e1] focus:border-transparent"
                  placeholder="Enter contact person name"
                  required
                />
              </div>

              {/* Contact Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Number
                  <span className="text-xs text-gray-500 ml-1">
                    (Phone/Mobile)
                  </span>
                </label>
                <input
                  type="text"
                  value={formData.Contact}
                  onChange={(e) =>
                    setFormData({ ...formData, Contact: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d9d9e1] focus:border-transparent"
                  placeholder="Enter contact number"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                  <span className="text-xs text-gray-500 ml-1">
                    (Business email)
                  </span>
                </label>
                <input
                  type="email"
                  value={formData.Email}
                  onChange={(e) =>
                    setFormData({ ...formData, Email: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d9d9e1] focus:border-transparent"
                  placeholder="Enter email address"
                />
              </div>

              {/* Address */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Address
                  <span className="text-xs text-gray-500 ml-1">
                    (Complete address)
                  </span>
                </label>
                <textarea
                  value={formData.Address}
                  onChange={(e) =>
                    setFormData({ ...formData, Address: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d9d9e1] focus:border-transparent h-24 resize-none"
                  placeholder="Enter complete business address..."
                  rows="3"
                />
              </div>
            </div>

            {/* Fixed Action Buttons */}
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
                disabled={
                  !formData.Name.trim() ||
                  !formData.Company_Name.trim() ||
                  actionLoading
                }
                className={`px-6 py-2 rounded-lg transition-colors flex items-center gap-2 ${!formData.Name.trim() ||
                  !formData.Company_Name.trim() ||
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
                    {editingItem ? "Update Vendor" : "Add Vendor"}
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

export default VendorsPage;