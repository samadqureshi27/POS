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
interface StaffItem {
  Staff_ID: number;
  Name: string;
  Contact: string;
  Address: string;
  CNIC: string;
  Status: "Active" | "Inactive";
  Role: string;
  Salary: string;
  Shift_Start_Time: string;
  Shift_End_Time: string;
  Access_Code?: string; // Optional 4-digit code for cashiers and managers
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
      Address: "123 Main Street, Lahore",
      CNIC: "35202-1234567-8",
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
      Address: "456 Park Avenue, Karachi",
      CNIC: "42101-9876543-2",
      Status: "Inactive",
      Role: "Cashier",
      Salary: "50000",
      Shift_Start_Time: "9:00",
      Shift_End_Time: "6:00",
      Access_Code: "1234",
    },
    {
      Staff_ID: 3,
      Name: "ghie",
      Contact: "03001231238",
      Address: "789 Garden Road, Islamabad",
      CNIC: "61101-5555555-1",
      Status: "Active",
      Role: "Cleaner",
      Salary: "15000",
      Shift_Start_Time: "9:00",
      Shift_End_Time: "6:00",
    },
    {
      Staff_ID: 4,
      Name: "Ahmed Khan",
      Contact: "03009876543",
      Address: "321 Business District, Lahore",
      CNIC: "35202-9876543-1",
      Status: "Active",
      Role: "Manager",
      Salary: "80000",
      Shift_Start_Time: "8:00",
      Shift_End_Time: "8:00",
      Access_Code: "5678",
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
    return {
      success: true,
      data: null,
      message: "Staff item deleted successfully",
    };
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
    Address: "",
    CNIC: "",
    Status: "Active",
    Role: "",
    Salary: "",
    Shift_Start_Time: "",
    Shift_End_Time: "",
    Access_Code: "",
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
        Address: editingItem.Address,
        CNIC: editingItem.CNIC,
        Status: editingItem.Status,
        Role: editingItem.Role,
        Salary: editingItem.Salary,
        Shift_Start_Time: editingItem.Shift_Start_Time,
        Shift_End_Time: editingItem.Shift_End_Time,
        Access_Code: editingItem.Access_Code || "",
      });
    } else {
      setFormData({
        Name: "",
        Contact: "",
        Address: "",
        CNIC: "",
        Status: "Active",
        Role: "",
        Salary: "",
        Shift_Start_Time: "",
        Shift_End_Time: "",
        Access_Code: "",
      });
    }
  }, [editingItem, isModalOpen]);

  // Clear access code when role is not Cashier or Manager
  useEffect(() => {
    if (formData.Role !== "Cashier" && formData.Role !== "Manager") {
      setFormData((prev) => ({ ...prev, Access_Code: "" }));
    }
  }, [formData.Role]);

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
        item.Contact.toLowerCase().includes(s) ||
        item.Address.toLowerCase().includes(s) ||
        item.CNIC.toLowerCase().includes(s);
      const matchesStatus = statusFilter ? item.Status === statusFilter : true;
      const matchesRole = roleFilter ? item.Role === roleFilter : true;
      return matchesSearch && matchesStatus && matchesRole;
    });
  }, [staffItems, searchTerm, statusFilter, roleFilter]);

  const handleCreateItem = async (itemData: Omit<StaffItem, "Staff_ID">) => {
    try {
      setActionLoading(true);
      // Remove Access_Code if role is not Cashier or Manager
      const cleanData = { ...itemData };
      if (cleanData.Role !== "Cashier" && cleanData.Role !== "Manager") {
        delete cleanData.Access_Code;
      }

      const response = await StaffAPI.createStaffItem(cleanData);
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
      // Remove Access_Code if role is not Cashier or Manager
      const cleanData = { ...itemData };
      if (cleanData.Role !== "Cashier" && cleanData.Role !== "Manager") {
        delete cleanData.Access_Code;
      }

      const response = await StaffAPI.updateStaffItem(
        editingItem.Staff_ID,
        cleanData
      );
      if (response.success) {
        setStaffItems((prev) =>
          prev.map((it) =>
            it.Staff_ID === editingItem.Staff_ID ? response.data : it
          )
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
    if (!formData.Name.trim() || !formData.CNIC.trim()) return;

    // Validate access code if role is Cashier or Manager
    if (
      (formData.Role === "Cashier" || formData.Role === "Manager") &&
      (!formData.Access_Code || formData.Access_Code.length !== 4)
    ) {
      showToast(
        `${formData.Role} role requires a 4-digit access code`,
        "error"
      );
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

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  // CNIC formatting function
  const formatCNIC = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, "");

    // Apply CNIC format: 35202-1234567-8
    if (digits.length <= 5) {
      return digits;
    } else if (digits.length <= 12) {
      return `${digits.slice(0, 5)}-${digits.slice(5)}`;
    } else {
      return `${digits.slice(0, 5)}-${digits.slice(5, 12)}-${digits.slice(
        12,
        13
      )}`;
    }
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
    <div className=" bg-gray-50 min-h-screen">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <h1 className="text-3xl font-semibold mb-8 mt-20">Staff Management</h1>

      {/* Summary Cards */}
      <div className="flex gap-4 mb-8">
        <div className="flex items-center justify-start flex-1 gap-2 max-w-[300px] min-h-[100px] border border-gray-300 rounded-sm p-4 bg-white shadow-sm">
          <div>
            <p className="text-6xl mb-1">{staffItems.length}</p>
            <p className="text-1xl text-gray-500">Total Staff</p>
          </div>
        </div>

        <div className="flex items-center justify-start flex-1 gap-2 max-w-[300px] min-h-[100px] border border-gray-300 rounded-sm p-4 bg-white shadow-sm">
          <div>
            <p className="text-6xl mb-1">
              {staffItems.filter((item) => item.Status === "Active").length}
            </p>
            <p className="text-1xl text-gray-500">Active Staff</p>
          </div>
        </div>
      </div>

      {/* Action bar */}
      <div className="mb-8 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex gap-3 h-[40px] ">
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
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={16}
          />
          <input
            type="text"
            placeholder="Search..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full pl-10 pr-4 py-2 h-[40px] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d9d9e1]"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-gray-50 rounded-sm border border-gray-300 max-w-[95vw]  shadow-sm ">
        <div className=" rounded-sm ">
          <table className="min-w-full max-w-[800px] divide-y divide-gray-200   table-fixed">
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
                  Staff ID
                  <span className="absolute left-0 top-[15%] h-[70%] w-[1.5px] bg-gray-300"></span>
                </th>
                <th className="relative px-4 py-3 text-left">
                  Name
                  <span className="absolute left-0 top-[15%] h-[70%] w-[1.5px] bg-gray-300"></span>
                </th>
                <th className="relative px-4 py-3 text-left">
                  Contact
                  <span className="absolute left-0 top-[15%] h-[70%] w-[1.5px] bg-gray-300"></span>
                </th>
                <th className="relative px-4 py-3 text-left">
                  Address
                  <span className="absolute left-0 top-[15%] h-[70%] w-[1.5px] bg-gray-300"></span>
                </th>
                <th className="relative px-4 py-3 text-left">
                  CNIC
                  <span className="absolute left-0 top-[15%] h-[70%] w-[1.5px] bg-gray-300"></span>
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
                          className="min-w=[320px] rounded-md bg-white shadow-md border-none p-1 relative outline-none "
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
                  <div className="flex flex-col gap-1">
                    <DropdownMenu.Root>
                      <DropdownMenu.Trigger className="px-2 py-1 rounded text-sm bg-transparent border-none outline-none hover:bg-transparent flex items-center gap-2 focus:outline-none focus:ring-0">
                        {roleFilter || "Role"}
                        <ChevronDown
                          size={14}
                          className="text-gray-500 ml-auto"
                        />
                      </DropdownMenu.Trigger>

                      <DropdownMenu.Portal>
                        <DropdownMenu.Content
                          className="min-w=[320px] rounded-md bg-white shadow-md border-none p-1 relative outline-none"
                          sideOffset={6}
                        >
                          <DropdownMenu.Arrow className="fill-white stroke-gray-200 w-5 h-3" />
                          <DropdownMenu.Item
                            className="px-3 py-1 text-sm cursor-pointer hover:bg-gray-100 rounded outline-none"
                            onClick={() => setRoleFilter("")}
                          >
                            Role
                          </DropdownMenu.Item>
                          {Array.from(
                            new Set(staffItems.map((i) => i.Role))
                          ).map((role) => (
                            <DropdownMenu.Item
                              key={role}
                              className="px-3 py-1 text-sm cursor-pointer hover:bg-blue-100 text-black rounded outline-none"
                              onClick={() => setRoleFilter(role)}
                            >
                              {role}
                            </DropdownMenu.Item>
                          ))}
                        </DropdownMenu.Content>
                      </DropdownMenu.Portal>
                    </DropdownMenu.Root>
                    <span className="absolute left-0 top-[15%] h-[70%] w-[1.5px] bg-gray-300"></span>
                  </div>
                </th>
                <th className="relative px-4 py-3 text-left">
                  Salary
                  <span className="absolute left-0 top-[15%] h-[70%] w-[1.5px] bg-gray-300"></span>
                </th>
                <th className="relative px-4 py-3 text-left">
                  Shift Start Time
                  <span className="absolute left-0 top-[15%] h-[70%] w-[1.5px] bg-gray-300"></span>
                </th>
                <th className="relative px-4 py-3 text-left">
                  Shift End Time
                  <span className="absolute left-0 top-[15%] h-[70%] w-[1.5px] bg-gray-300"></span>
                </th>
                <th className="relative px-4 py-3 text-left">
                  Access Code
                  <span className="absolute left-0 top-[15%] h-[70%] w-[1.5px] bg-gray-300"></span>
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
                    colSpan={13}
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
                    <td className="px-6 py-8">
                      <Checkbox
                        checked={selectedItems.includes(item.Staff_ID)}
                        onChange={(e) =>
                          handleSelectItem(item.Staff_ID, e.target.checked)
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
                      {`#${String(item.Staff_ID).padStart(3, "0")}`}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                      {item.Name}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                      {item.Contact}
                    </td>
                    <td
                      className="px-4 py-4 text-sm max-w-[200px] truncate"
                      title={item.Address}
                    >
                      {item.Address}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                      {item.CNIC}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span
                        className={`inline-block w-20 text-center px-2 py-[2px] rounded-md text-xs font-medium 
                          ${
                            item.Status === "Active"
                              ? "text-green-400 border-green-600"
                              : ""
                          }
                          ${
                            item.Status === "Inactive"
                              ? "text-red-400 border-red-600"
                              : ""
                          }`}
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
                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                      {(item.Role === "Cashier" || item.Role === "Manager") &&
                      item.Access_Code ? (
                        <span
                          className={`px-2 py-1 rounded text-xs font-mono ${
                            item.Role === "Cashier"
                              ? "bg-blue-100 text-blue-400"
                              : "bg-purple-100 text-purple-400"
                          }`}
                        >
                          {item.Access_Code}
                        </span>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
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
        <div
          className="fixed inset-0  bg-black/30 backdrop-blur-sm flex items-center justify-center z-71 p-4"
          onClick={handleCloseModal}
        >
          <div
            className="bg-white rounded-lg min-w-[35vw] max-w-2xl max-h-[70vh] min-h-[70vh] shadow-xl relative flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-semibold text-gray-800">
                {editingItem ? "Edit Staff Member" : "Add New Staff Member"}
              </h2>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleModalSubmit();
                }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Staff Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.Name}
                      onChange={(e) =>
                        setFormData({ ...formData, Name: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d9d9e1] focus:border-transparent transition-colors"
                      placeholder="Enter staff name"
                      required
                      autoFocus
                    />
                  </div>

                  {/* Contact */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Number
                    </label>
                    <input
                      type="tel"
                      value={formData.Contact}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^\d+\-\s]/g, "");
                        setFormData({ ...formData, Contact: value });
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d9d9e1] focus:border-transparent transition-colors"
                      placeholder="03001234567"
                    />
                  </div>

                  {/* CNIC */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CNIC <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.CNIC}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          CNIC: formatCNIC(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d9d9e1] focus:border-transparent transition-colors"
                      placeholder="35202-1234567-8"
                      maxLength={15}
                      required
                    />
                  </div>

                  {/* Address */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address
                    </label>
                    <textarea
                      value={formData.Address}
                      onChange={(e) =>
                        setFormData({ ...formData, Address: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d9d9e1] focus:border-transparent resize-none transition-colors"
                      placeholder="Enter complete address"
                      rows={3}
                    />
                  </div>

                  {/* Role Dropdown */}
                  <div className="flex flex-col gap-1 relative">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Role
                    </label>

                    <DropdownMenu.Root>
                      <DropdownMenu.Trigger className="px-3 py-2 rounded-lg text-sm border border-gray-300 bg-white flex items-center gap-2 w-full focus:outline-none focus:ring-2 focus:ring-[#d9d9e1] focus:border-transparent transition-colors hover:border-gray-400">
                        <span
                          className={
                            formData.Role ? "text-gray-900" : "text-gray-500"
                          }
                        >
                          {formData.Role || "Select Role"}
                        </span>
                        <ChevronDown
                          size={16}
                          className="text-gray-500 ml-auto"
                        />
                      </DropdownMenu.Trigger>

                      <DropdownMenu.Portal>
                        <DropdownMenu.Content
                          className="min-w-[200px] rounded-md bg-white shadow-lg border border-gray-200 p-1 relative outline-none z-[100] max-h-60 overflow-y-auto"
                          sideOffset={6}
                        >
                          <DropdownMenu.Arrow className="fill-white stroke-gray-200 w-5 h-3" />

                          {/* Default Option */}
                          <DropdownMenu.Item
                            className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 rounded outline-none text-gray-500"
                            onClick={() =>
                              setFormData({ ...formData, Role: "" })
                            }
                          >
                            Select Role
                          </DropdownMenu.Item>

                          {/* Role Options */}
                          {[
                            "Manager",
                            "Cashier",
                            "Waiter",
                            "Cleaner",
                            "Chef",
                            "Security",
                          ].map((role) => (
                            <DropdownMenu.Item
                              key={role}
                              className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 hover:text-gray-700 rounded outline-none"
                              onClick={() =>
                                setFormData({ ...formData, Role: role })
                              }
                            >
                              {role}
                            </DropdownMenu.Item>
                          ))}
                        </DropdownMenu.Content>
                      </DropdownMenu.Portal>
                    </DropdownMenu.Root>
                  </div>

                  {/* Salary */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Salary (PKR)
                    </label>
                    <input
                      type="number"
                      value={formData.Salary}
                      onChange={(e) =>
                        setFormData({ ...formData, Salary: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d9d9e1] focus:border-transparent transition-colors"
                      placeholder="30000"
                      min="0"
                      step="1000"
                    />
                  </div>

                  {/* Shift Times */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Shift Start Time
                    </label>
                    <input
                      type="time"
                      value={formData.Shift_Start_Time}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          Shift_Start_Time: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d9d9e1] focus:border-transparent transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Shift End Time
                    </label>
                    <input
                      type="time"
                      value={formData.Shift_End_Time}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          Shift_End_Time: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d9d9e1] focus:border-transparent transition-colors"
                    />
                  </div>

                  {/* Access Code - Only for Cashier and Manager */}
                  {(formData.Role === "Cashier" ||
                    formData.Role === "Manager") && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Access Code <span className="text-red-500">*</span>
                        <span className="text-xs text-gray-500 ml-1">
                          (4 digits)
                        </span>
                      </label>
                      <input
                        type="password"
                        value={formData.Access_Code}
                        onChange={(e) => {
                          const value = e.target.value
                            .replace(/\D/g, "")
                            .slice(0, 4);
                          setFormData({ ...formData, Access_Code: value });
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d9d9e1] focus:border-transparent font-mono tracking-widest transition-colors"
                        placeholder="••••"
                        maxLength={4}
                        required
                      />
                      {formData.Access_Code &&
                        formData.Access_Code.length < 4 && (
                          <p className="text-red-500 text-xs mt-1">
                            Access code must be exactly 4 digits
                          </p>
                        )}
                    </div>
                  )}

                  {/* Status Toggle */}
                  <div className="flex items-center justify-between py-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Status
                    </label>
                    <div className="flex items-center gap-3">
                      <span
                        className={`text-sm font-medium ${
                          formData.Status === "Active"
                            ? "text-green-600"
                            : "text-red-500"
                        }`}
                      >
                        {formData.Status}
                      </span>
                      <ButtonPage
                        checked={formData.Status === "Active"}
                        onChange={handleStatusChange}
                      />
                    </div>
                  </div>
                </div>
              </form>
            </div>

            {/* Fixed Action Buttons */}
            <div className="flex gap-3 p-6 justify-end border-t border-gray-200">
              <button
                type="button"
                onClick={handleCloseModal}
                disabled={actionLoading}
                className="px-6 py-2 border border-gray-300 bg-white rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="submit"
                onClick={handleModalSubmit}
                disabled={
                  !formData.Name.trim() ||
                  !formData.CNIC.trim() ||
                  actionLoading ||
                  ((formData.Role === "Cashier" ||
                    formData.Role === "Manager") &&
                    (!formData.Access_Code ||
                      formData.Access_Code.length !== 4))
                }
                className={`px-6 py-2 rounded-lg transition-colors flex items-center gap-2 font-medium ${
                  !formData.Name.trim() ||
                  !formData.CNIC.trim() ||
                  actionLoading ||
                  ((formData.Role === "Cashier" ||
                    formData.Role === "Manager") &&
                    (!formData.Access_Code ||
                      formData.Access_Code.length !== 4))
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

export default EmployeeRecordsPage;
