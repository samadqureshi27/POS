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
import ButtonPage from "../../../../../components/layout/UI/button";

// Types
interface StaffItem {
  Staff_ID: number;
  Name: string;
  Contact: string;
  Status: "Active" | "Inactive";
  Role: string;
  Salary: string;
  Shift_Start_Time: string;
  Shift_End_Time: string;
}

interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

// Mock API
class StaffAPI {
  private static delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  private static mockData: StaffItem[] = [
    {
      Staff_ID: 1,
      Name: "efe",
      Contact: "03001231234",
      Status: "Inactive",
      Role: "Waiter",
      Salary: "30000",
      Shift_Start_Time: "9:00",
      Shift_End_Time: "6:00",
    },
    {
      Staff_ID: 2,
      Name: "andd",
      Contact: "03001234567",
      Status: "Inactive",
      Role: "Cashier",
      Salary: "50000",
      Shift_Start_Time: "9:00",
      Shift_End_Time: "6:00",
    },
    {
      Staff_ID: 3,
      Name: "ghie",
      Contact: "03001231238",
      Status: "Active",
      Role: "Cleaner",
      Salary: "15000",
      Shift_Start_Time: "9:00",
      Shift_End_Time: "6:00",
    },
  ];

  static async getStaffItems(): Promise<ApiResponse<StaffItem[]>> {
    await this.delay(800);
    return {
      success: true,
      data: [...this.mockData],
      message: "Staff items fetched successfully",
    };
  }

  static async createStaffItem(
    item: Omit<StaffItem, "Staff_ID">
  ): Promise<ApiResponse<StaffItem>> {
    await this.delay(1000);
    const newId = (this.mockData.length + 1).toString();
    const newItem: StaffItem = { ...item, Staff_ID: this.mockData.length + 1 };
    this.mockData.push(newItem);
    return {
      success: true,
      data: newItem,
      message: "Staff item created successfully",
    };
  }

  static async updateStaffItem(
    id: number,
    item: Partial<StaffItem>
  ): Promise<ApiResponse<StaffItem>> {
    await this.delay(800);
    const index = this.mockData.findIndex((i) => i.Staff_ID === id);
    if (index === -1) throw new Error("Item not found");
    this.mockData[index] = { ...this.mockData[index], ...item };
    return {
      success: true,
      data: this.mockData[index],
      message: "Staff item updated successfully",
    };
  }

  static async deleteStaffItem(id: number): Promise<ApiResponse<null>> {
    await this.delay(600);
    this.mockData = this.mockData
      .filter((i) => i.Staff_ID !== id)
      .map((item, idx) => ({ ...item, Staff_ID: idx + 1 }));
    return { success: true, data: null, message: "Staff item deleted successfully" };
  }

  static async bulkDeleteStaffItems(ids: number[]): Promise<ApiResponse<null>> {
    await this.delay(1000);
    this.mockData = this.mockData
      .filter((i) => !ids.includes(i.Staff_ID))
      .map((item, idx) => ({ ...item, Staff_ID: idx + 1 }));
    return {
      success: true,
      data: null,
      message: `${ids.length} Staff items deleted successfully`,
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

const EmployeeRecordsPage = () => {
  const [staffItems, setStaffItems] = useState<StaffItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Debounced search
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [editingItem, setEditingItem] = useState<StaffItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [statusFilter, setStatusFilter] = useState<"" | "Active" | "Inactive">(
    ""
  );
  const [roleFilter, setRoleFilter] = useState("");

  // Modal form state
  const [formData, setFormData] = useState<Omit<StaffItem, "Staff_ID">>({
    Name: "",
    Contact: "",
    Status: "Active",
    Role: "",
    Salary: "",
    Shift_Start_Time: "",
    Shift_End_Time: "",
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
    loadStaffItems();
  }, []);

  // Modal form sync
  useEffect(() => {
    if (editingItem) {
      setFormData({
        Name: editingItem.Name,
        Contact: editingItem.Contact,
        Status: editingItem.Status,
        Role: editingItem.Role,
        Salary: editingItem.Salary,
        Shift_Start_Time: editingItem.Shift_Start_Time,
        Shift_End_Time: editingItem.Shift_End_Time,
      });
    } else {
      setFormData({
        Name: "",
        Contact: "",
        Status: "Active",
        Role: "",
        Salary: "",
        Shift_Start_Time: "",
        Shift_End_Time: "",
      });
    }
  }, [editingItem, isModalOpen]);

  const showToast = (message: string, type: "success" | "error") =>
    setToast({ message, type });

  const loadStaffItems = async () => {
    try {
      setLoading(true);
      const response = await StaffAPI.getStaffItems();
      if (!response.success) throw new Error(response.message);
      setStaffItems(response.data);
    } catch {
      showToast("Failed to load staff items", "error");
    } finally {
      setLoading(false);
    }
  };

  // Memoized filtering
  const filteredItems = useMemo(() => {
    const s = searchTerm.toLowerCase();
    return staffItems.filter((item) => {
      const matchesSearch =
        item.Name.toLowerCase().includes(s) ||
        item.Role.toLowerCase().includes(s) ||
        item.Contact.toLowerCase().includes(s);
      const matchesStatus = statusFilter ? item.Status === statusFilter : true;
      const matchesRole = roleFilter ? item.Role === roleFilter : true;
      return matchesSearch && matchesStatus && matchesRole;
    });
  }, [staffItems, searchTerm, statusFilter, roleFilter]);

  const handleCreateItem = async (itemData: Omit<StaffItem, "Staff_ID">) => {
    try {
      setActionLoading(true);
      const response = await StaffAPI.createStaffItem(itemData);
      if (response.success) {
        setStaffItems((prev) => [...prev, response.data]);
        setIsModalOpen(false);
        showToast(response.message || "Staff created successfully", "success");
      }
    } catch {
      showToast("Failed to create staff", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateItem = async (itemData: Omit<StaffItem, "Staff_ID">) => {
    if (!editingItem) return;
    try {
      setActionLoading(true);
      const response = await StaffAPI.updateStaffItem(editingItem.Staff_ID, itemData);
      if (response.success) {
        setStaffItems((prev) =>
          prev.map((it) => (it.Staff_ID === editingItem.Staff_ID ? response.data : it))
        );
        setIsModalOpen(false);
        setEditingItem(null);
        showToast(response.message || "Staff updated successfully", "success");
      }
    } catch {
      showToast("Failed to update staff", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedItems.length === 0) return;
    try {
      setActionLoading(true);
      const response = await StaffAPI.bulkDeleteStaffItems(selectedItems);
      if (response.success) {
        // Refresh from API (IDs already re-assigned there)
        const updated = await StaffAPI.getStaffItems();
        setStaffItems(updated.data);
        setSelectedItems([]);
        showToast(response.message || "Staff deleted successfully", "success");
      }
    } catch {
      showToast("Failed to delete staff", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleSelectAll = useCallback(
    (checked: boolean) => {
      setSelectedItems(checked ? filteredItems.map((i) => i.Staff_ID) : []);
    },
    [filteredItems]
  );

  const handleSelectItem = useCallback((staffId: number, checked: boolean) => {
    setSelectedItems((prev) =>
      checked ? [...prev, staffId] : prev.filter((id) => id !== staffId)
    );
  }, []);

  const handleModalSubmit = () => {
    if (!formData.Name.trim()) return;
    if (editingItem) {
      handleUpdateItem(formData);
    } else {
      handleCreateItem(formData);
    }
  };

  const handleStatusChange = (isActive: boolean) => {
    setFormData((prev) => ({ ...prev, Status: isActive ? "Active" : "Inactive" }));
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
          <p className="mt-4 text-gray-600">Loading Staff Management...</p>
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

      <h1 className="text-3xl font-semibold mb-4 pl-20">Staff Management</h1>

      {/* Summary Cards */}
      <div className="flex gap-4 mb-6 pl-20">
        <div className="flex items-center justify-start flex-1 gap-2 max-w-[300px] min-h-[100px] rounded-md p-4 bg-white shadow-sm">
          <div>
            <p className="text-6xl mb-1">{staffItems.length}</p>
            <p className="text-1xl text-gray-500">Total Staff</p>
          </div>
        </div>

        <div className="flex items-center justify-start flex-1 gap-2 max-w-[300px] min-h-[100px] rounded-md p-4 bg-white shadow-sm">
          <div>
            <p className="text-6xl mb-1">
              {staffItems.filter((item) => item.Status === "Active").length}
            </p>
            <p className="text-1xl text-gray-500">Active Staff</p>
          </div>
        </div>
      </div>

      {/* Action bar */}
      <div className="mb-6 flex items-center justify-between gap-4 flex-wrap">
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
            placeholder="Search Staff..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d9d9e1]"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg ml-20 shadow-sm overflow-hidden">
        <div className="max-h-[500px] overflow-y-auto">
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
                  Staff ID
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
                  <div className="flex flex-col gap-1">
                    <DropdownMenu.Root>
                      <DropdownMenu.Trigger className="px-2 py-1 rounded text-sm bg-transparent border-none outline-none hover:bg-transparent flex items-center gap-2 focus:outline-none focus:ring-0">
                        {statusFilter || "Status"}
                        <ChevronDown size={14} className="text-gray-500 ml-auto" />
                      </DropdownMenu.Trigger>

                      <DropdownMenu.Portal>
                        <DropdownMenu.Content
                          className="min-w=[320px] rounded-md bg-white shadow-md border-none p-1 relative outline-none ml-28"
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
                  <div className="flex flex-col gap-1">
                    <DropdownMenu.Root>
                      <DropdownMenu.Trigger className="px-2 py-1 rounded text-sm bg-transparent border-none outline-none hover:bg-transparent flex items-center gap-2 focus:outline-none focus:ring-0">
                        {roleFilter || "Role"}
                        <ChevronDown size={14} className="text-gray-500 ml-auto" />
                      </DropdownMenu.Trigger>

                      <DropdownMenu.Portal>
                        <DropdownMenu.Content
                          className="min-w=[320px] rounded-md bg-white shadow-md border-none p-1 relative outline-none ml-24"
                          sideOffset={6}
                        >
                          <DropdownMenu.Arrow className="fill-white stroke-gray-200 w-5 h-3" />
                          <DropdownMenu.Item
                            className="px-3 py-1 text-sm cursor-pointer hover:bg-gray-100 rounded outline-none"
                            onClick={() => setRoleFilter("")}
                          >
                            Role
                          </DropdownMenu.Item>
                          {Array.from(new Set(staffItems.map((i) => i.Role))).map(
                            (role) => (
                              <DropdownMenu.Item
                                key={role}
                                className="px-3 py-1 text-sm cursor-pointer hover:bg-blue-100 text-black rounded outline-none"
                                onClick={() => setRoleFilter(role)}
                              >
                                {role}
                              </DropdownMenu.Item>
                            )
                          )}
                        </DropdownMenu.Content>
                      </DropdownMenu.Portal>
                    </DropdownMenu.Root>
                    <span className="absolute left-0 top-[15%] h-[70%] w-[2.5px] bg-[#d9d9e1]"></span>
                  </div>
                </th>
                <th className="relative px-4 py-3 text-left">
                  Salary
                  <span className="absolute left-0 top-[15%] h-[70%] w-[2.5px] bg-[#d9d9e1]"></span>
                </th>
                <th className="relative px-4 py-3 text-left">
                  Shift Start Time
                  <span className="absolute left-0 top-[15%] h-[70%] w-[2.5px] bg-[#d9d9e1]"></span>
                </th>
                <th className="relative px-4 py-3 text-left">
                  Shift End Time
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
                    colSpan={10}
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    {searchTerm || statusFilter || roleFilter
                      ? "No staff match your search criteria."
                      : "No staff found."}
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr key={item.Staff_ID} className="bg-white hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <Checkbox
                        checked={selectedItems.includes(item.Staff_ID)}
                        onChange={(e) =>
                          handleSelectItem(item.Staff_ID, e.target.checked)
                        }
                      />
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                      {`#${String(item.Staff_ID).padStart(3, "0")}`}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                      {item.Name}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                      {item.Contact}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span
                        className={`inline-block w-20 text-center px-2 py-[2px] rounded-md text-xs font-medium border
                          ${item.Status === "Active" ? "text-green-600 border-green-600" : ""}
                          ${item.Status === "Inactive" ? "text-red-600 border-red-600" : ""}`}
                      >
                        {item.Status}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                      {item.Role}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                      {item.Salary}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                      {item.Shift_Start_Time}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                      {item.Shift_End_Time}
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

      {/* Model */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-71">
          <div className="bg-[#ffff] rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto shadow-lg relative">
            <h2 className="text-xl font-semibold mb-4">
              {editingItem ? "Edit Staff" : "Add New Staff"}
            </h2>

            <div className="space-y-3">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Staff Name
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
                />
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <input
                  type="text"
                  value={formData.Role}
                  onChange={(e) =>
                    setFormData({ ...formData, Role: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d9d9e1]"
                />
              </div>

              {/* Salary */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Salary
                </label>
                <input
                  type="text"
                  value={formData.Salary}
                  onChange={(e) =>
                    setFormData({ ...formData, Salary: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d9d9e1]"
                />
              </div>

              {/* Shift Start Time */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Shift Start Time
                </label>
                <input
                  type="text"
                  value={formData.Shift_Start_Time}
                  onChange={(e) =>
                    setFormData({ ...formData, Shift_Start_Time: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d9d9e1]"
                />
              </div>

              {/* Shift End Time */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Shift End Time
                </label>
                <input
                  type="text"
                  value={formData.Shift_End_Time}
                  onChange={(e) =>
                    setFormData({ ...formData, Shift_End_Time: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d9d9e1]"
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
                  disabled={!formData.Name.trim()}
                  className={`px-4 py-2 rounded-lg flex items-center justify-center gap-1 ${formData.Name.trim()
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

export default EmployeeRecordsPage;