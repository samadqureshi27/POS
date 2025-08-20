"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
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
  Save,
} from "lucide-react";

interface VendorItem {
  ID: number;
  Company_Name: string;
  Name: string;
  Contact: string;
  Address: string;
  Email: string;
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
    },
    {
      ID: 2,
      Company_Name: "Water Inc",
      Name: "Ahmad Ali",
      Contact: "03001231234",
      Address: "#777, Block G1, Johartown",
      Email: "csd@gmail.com",
    },
    {
      ID: 3,
      Company_Name: "Salt Inc",
      Name: "Hassan Ahmed",
      Contact: "03007897891",
      Address: "#777, Block G1, Johartown",
      Email: "yul@gmail.com",
    },
    {
      ID: 4,
      Company_Name: "Food Supplies Co",
      Name: "Muhammad Khan",
      Contact: "03009876543",
      Address: "#123, Block A2, DHA Phase 1",
      Email: "mkhan@foodsupplies.com",
    },
    {
      ID: 5,
      Company_Name: "Fresh Mart",
      Name: "Ali Hassan",
      Contact: "03005432109",
      Address: "#456, Gulberg III",
      Email: "ali@freshmart.com",
    },
  ];

  // GET /api/vendors/
  static async getVendorItems(): Promise<ApiResponse<VendorItem[]>> {
    await this.delay(800);
    return {
      success: true,
      data: [...this.mockData],
      message: "Vendor items fetched successfully",
    };
  }

  // POST /api/vendors/
  static async createVendorItem(
    item: Omit<VendorItem, "ID">
  ): Promise<ApiResponse<VendorItem>> {
    await this.delay(1000);
    const newId = this.mockData.length + 1;
    const newItem: VendorItem = {
      ...item,
      ID: newId,
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
  static async deleteVendorItem(id: number): Promise<ApiResponse<null>> {
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
      message: "Vendor item deleted successfully",
    };
  }

  // DELETE /api/vendors/bulk-delete/
  static async bulkDeleteVendorItems(
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

const VendorsPage = () => {
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

  // Modal form state
  const [formData, setFormData] = useState<Omit<VendorItem, "ID">>({
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
  }, []);

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
      const response = await VendorAPI.getVendorItems();
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
      // Use item ID as seed for consistent random numbers
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

  const handleCreateItem = async (itemData: Omit<VendorItem, "ID">) => {
    try {
      setActionLoading(true);
      const response = await VendorAPI.createVendorItem(itemData);
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

  const handleUpdateItem = async (itemData: Omit<VendorItem, "ID">) => {
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
      const response = await VendorAPI.bulkDeleteVendorItems(selectedItems);
      if (response.success) {
        setVendorItems((prev) => {
          const remaining = prev.filter((i) => !selectedItems.includes(i.ID));
          return remaining.map((it, idx) => ({ ...it, ID: idx + 1 }));
        });
        setSelectedItems([]);
        showToast(response.message || "Vendors deleted successfully", "success");
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
    <div className="p-6 mx-6 bg-gray-50 min-h-screen overflow-y-auto">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <h1 className="text-3xl font-semibold mb-4 pl-20">
        Vendors & Suppliers
      </h1>

      {/* Top summary row */}
      <div className="flex gap-4 mb-6 pl-20">
        <div className="flex items-center justify-start flex-1 gap-2 max-w-[300px] min-h-[100px] rounded-md p-4 bg-white shadow-sm">
          <div>
            <p className="text-3xl font-semibold mb-1">
              {mostOrderedVendor?.Company_Name || "N/A"}
            </p>
            <p className="text-gray-500">
              Most Ordered ({mostOrderedVendor?.usageCount || 0} times)
            </p>
          </div>
        </div>

        <div className="flex items-center justify-start flex-1 gap-2 max-w-[300px] min-h-[100px] rounded-md p-4 bg-white shadow-sm">
          <div>
            <p className="text-3xl font-semibold mb-1">
              {leastOrderedVendor?.Company_Name || "N/A"}
            </p>
            <p className="text-gray-500">
              Least Ordered ({leastOrderedVendor?.usageCount || 0} times)
            </p>
          </div>
        </div>
      </div>

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
            placeholder="Search vendors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d9d9e1]"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg ml-20 shadow-sm overflow-hidden">
        <div className="max-h-[500px] overflow-y-auto">
          <table className="min-w-full divide-y divide-gray-200 table-fixed">
            <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
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
                  Company Name
                  <span className="absolute left-0 top-[15%] h-[70%] w-[2.5px] bg-[#d9d9e1]"></span>
                </th>
                <th className="relative px-4 py-3 text-left">
                  Name
                  <span className="absolute left-0 top-[15%] h-[70%] w-[2.5px] bg-[#d9d9e1]"></span>
                </th>

                <th className="relative px-4 py-3 text-left">
                  Contact
                  <span className="absolute left-0 top-[15%] h-[70%] w-[2.5px] bg-[#d9d9e1]"></span>
                </th>
                <th className="relative px-4 py-3 text-left">
                  Address
                  <span className="absolute left-0 top-[15%] h-[70%] w-[2.5px] bg-[#d9d9e1]"></span>
                </th>
                <th className="relative px-4 py-3 text-left">
                  Email
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
                    colSpan={9}
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    {searchTerm
                      ? "No vendors match your search criteria."
                      : "No vendors found."}
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
                      {item.Company_Name}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                      {item.Name}
                    </td>

                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                      {item.Contact}
                    </td>
                    <td
                      className="px-4 py-4 text-sm text-gray-600 max-w-xs truncate"
                      title={item.Address}
                    >
                      {item.Address}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                      {item.Email}
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

      {/* Modal for Add/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-71">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto shadow-lg relative">
            <h2 className="text-xl font-semibold mb-4">
              {editingItem ? "Edit Vendor" : "Add New Vendor"}
            </h2>
            <div className="space-y-3">
              {/* Company Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Name
                </label>
                <input
                  type="text"
                  value={formData.Company_Name}
                  onChange={(e) =>
                    setFormData({ ...formData, Company_Name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d9d9e1]"
                  required
                />
              </div>

              {/* Contact Person Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Person Name
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

              {/* Contact */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact
                </label>
                <input
                  type="text"
                  value={formData.Contact}
                  onChange={(e) =>
                    setFormData({ ...formData, Contact: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d9d9e1]"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.Email}
                  onChange={(e) =>
                    setFormData({ ...formData, Email: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d9d9e1]"
                  required
                />
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <textarea
                  placeholder="Enter address here..."
                  value={formData.Address}
                  onChange={(e) =>
                    setFormData({ ...formData, Address: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d9d9e1] h-20 resize-none"
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
                  disabled={!formData.Name.trim() || !formData.Company_Name.trim()}
                  className={`px-4 py-2 rounded-lg flex items-center justify-center gap-1 ${formData.Name.trim() && formData.Company_Name.trim()
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
export default VendorsPage;