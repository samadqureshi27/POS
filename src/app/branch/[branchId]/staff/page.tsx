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
interface StaffItem {
  Staff_ID: string; // Changed to string to match POS page pattern
  Name: string;
  Contact: string;
  Address: string;
  CNIC: string;
  Status: "Active" | "Inactive";
  Role: string;
  Salary: string;
  Shift_Start_Time: string;
  Shift_End_Time: string;
  Branch_ID_fk: string; // Changed to match POS page naming convention
  Access_Code?: string;
}

interface BranchInfo {
  "Branch-ID": number;
  Branch_Name: string;
  Status: "Active" | "Inactive";
  "Contact-Info": string;
  Address: string;
}

interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

// Mock API with Branch Integration
class StaffAPI {
  private static delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  private static mockData: StaffItem[] = [
    {
      Staff_ID: "1",
      Name: "Ali Raza",
      Contact: "03001231234",
      Address: "123 Main Street, Lahore",
      CNIC: "35202-1234567-8",
      Status: "Inactive",
      Role: "Waiter",
      Salary: "30000",
      Shift_Start_Time: "9:00",
      Shift_End_Time: "6:00",
      Branch_ID_fk: "1",
    },
    {
      Staff_ID: "2",
      Name: "Faraz Aslam",
      Contact: "03001234567",
      Address: "456 Park Avenue, Karachi",
      CNIC: "42101-9876543-2",
      Status: "Inactive",
      Role: "Cashier",
      Salary: "50000",
      Shift_Start_Time: "9:00",
      Shift_End_Time: "6:00",
      Branch_ID_fk: "1",
      Access_Code: "1234",
    },
    {
      Staff_ID: "3",
      Name: "Faris Shafi",
      Contact: "03001231238",
      Address: "789 Garden Road, Islamabad",
      CNIC: "61101-5555555-1",
      Status: "Active",
      Role: "Cleaner",
      Salary: "15000",
      Shift_Start_Time: "9:00",
      Shift_End_Time: "6:00",
      Branch_ID_fk: "2",
    },
    {
      Staff_ID: "4",
      Name: "Ahmed Khan",
      Contact: "03009876543",
      Address: "321 Business District, Lahore",
      CNIC: "35202-9876543-1",
      Status: "Active",
      Role: "Manager",
      Salary: "80000",
      Shift_Start_Time: "8:00",
      Shift_End_Time: "8:00",
      Branch_ID_fk: "1",
      Access_Code: "5678",
    },
    {
      Staff_ID: "5",
      Name: "Sara Ali",
      Contact: "03007777777",
      Address: "555 North Street, Karachi",
      CNIC: "42101-7777777-7",
      Status: "Active",
      Role: "Waiter",
      Salary: "25000",
      Shift_Start_Time: "10:00",
      Shift_End_Time: "7:00",
      Branch_ID_fk: "2",
    },
    {
      Staff_ID: "6",
      Name: "Usman Sheikh",
      Contact: "03008888888",
      Address: "666 South Avenue, Islamabad",
      CNIC: "61101-8888888-8",
      Status: "Active",
      Role: "Chef",
      Salary: "45000",
      Shift_Start_Time: "11:00",
      Shift_End_Time: "9:00",
      Branch_ID_fk: "3",
    },
  ];

  // Get staff items filtered by branch ID
  static async getStaffItemsByBranch(branchId: string): Promise<ApiResponse<StaffItem[]>> {
    await this.delay(800);
    const branchStaff = this.mockData.filter(staff => staff.Branch_ID_fk === branchId);
    return {
      success: true,
      data: branchStaff,
      message: `Staff items for branch ${branchId} fetched successfully`,
    };
  }

  // Get branch info by ID
  static async getBranchInfo(branchId: string): Promise<ApiResponse<BranchInfo>> {
    await this.delay(500);
    const filteredData = this.mockData.filter(item => item.Branch_ID_fk === branchId);

    return {
      success: true,
      data: filteredData,
      message: "Branch info fetched successfully",
    };
  }

  static async createStaffItem(
    item: Omit<StaffItem, "Staff_ID">
  ): Promise<ApiResponse<StaffItem>> {
    await this.delay(1000);
    const newId = (this.mockData.length + 1).toString();
    const newItem: StaffItem = { ...item, Staff_ID: newId };
    this.mockData.push(newItem);
    return {
      success: true,
      data: newItem,
      message: "Staff item created successfully",
    };
  }

  static async updateStaffItem(
    id: string,
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

  static async deleteStaffItem(id: string): Promise<ApiResponse<null>> {
    await this.delay(600);
    const initialLength = this.mockData.length;
    this.mockData = this.mockData.filter((i) => i.Staff_ID !== id);

    if (this.mockData.length === initialLength) {
      throw new Error("Staff item not found");
    }

    return {
      success: true,
      data: null,
      message: "Staff item deleted successfully",
    };
  }

  static async bulkDeleteStaffItems(ids: string[]): Promise<ApiResponse<null>> {
    await this.delay(1000);
    this.mockData = this.mockData.filter((i) => !ids.includes(i.Staff_ID));
    return {
      success: true,
      data: null,
      message: `${ids.length} Staff items deleted successfully`,
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

const EmployeeRecordsPage = () => {
  const params = useParams();
  const branchId = params?.branchId as string;

  const [staffItems, setStaffItems] = useState<StaffItem[]>([]);
  const [branchInfo, setBranchInfo] = useState<BranchInfo | null>(null);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [editingItem, setEditingItem] = useState<StaffItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [statusFilter, setStatusFilter] = useState<"" | "Active" | "Inactive">("");
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
    Branch_ID_fk: branchId || "",
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
    if (branchId) {
      loadBranchData();
    }
  }, [branchId]);

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
        Branch_ID_fk: editingItem.Branch_ID_fk,
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
        Branch_ID_fk: branchId || "",
        Access_Code: "",
      });
    }
  }, [editingItem, isModalOpen, branchId]);

  // Clear access code when role is not Cashier or Manager
  useEffect(() => {
    if (formData.Role !== "Cashier" && formData.Role !== "Manager") {
      setFormData((prev) => ({ ...prev, Access_Code: "" }));
    }
  }, [formData.Role]);

  const showToast = (message: string, type: "success" | "error") =>
    setToast({ message, type });

  const loadBranchData = async () => {
    if (!branchId) {
      showToast("Branch ID not found", "error");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      // Load both branch info and staff data
      const [branchResponse, staffResponse] = await Promise.all([
        StaffAPI.getBranchInfo(branchId),
        StaffAPI.getStaffItemsByBranch(branchId)
      ]);

      if (!branchResponse.success) {
        throw new Error(branchResponse.message || "Branch not found");
      }

      if (!staffResponse.success) {
        throw new Error(staffResponse.message || "Failed to load staff");
      }

      setBranchInfo(branchResponse.data);
      setStaffItems(staffResponse.data);
    } catch (error) {
      showToast(error.message || "Failed to load branch data", "error");
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
      const cleanData = {
        ...itemData,
        Branch_ID_fk: branchId // Ensure branch ID is set
      };
      if (cleanData.Role !== "Cashier" && cleanData.Role !== "Manager") {
        delete cleanData.Access_Code;
      }

      const response = await StaffAPI.createStaffItem(cleanData);
      if (response.success) {
        // Reload staff data for this branch
        await loadBranchData();
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
      const cleanData = { ...itemData };
      if (cleanData.Role !== "Cashier" && cleanData.Role !== "Manager") {
        delete cleanData.Access_Code;
      }

      const response = await StaffAPI.updateStaffItem(editingItem.Staff_ID, cleanData);
      if (response.success) {
        // Reload staff data for this branch
        await loadBranchData();
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
        // Reload staff data for this branch
        await loadBranchData();
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

  const handleSelectItem = useCallback((staffId: string, checked: boolean) => {
    setSelectedItems((prev) =>
      checked ? [...prev, staffId] : prev.filter((id) => id !== staffId)
    );
  }, []);

  const handleModalSubmit = () => {
    if (!formData.Name.trim() || !formData.CNIC.trim()) return;

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
    const digits = value.replace(/\D/g, "");

    if (digits.length <= 5) {
      return digits;
    } else if (digits.length <= 12) {
      return `${digits.slice(0, 5)}-${digits.slice(5)}`;
    } else {
      return `${digits.slice(0, 5)}-${digits.slice(5, 12)}-${digits.slice(12, 13)}`;
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
    <div className="bg-gray-50 min-h-screen w-full mt-17">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="mb-8 mt-2">
        <h1 className="text-3xl font-semibold">
          Staff Management - Branch #{branchId}
        </h1>
      </div>

      {/* Summary Cards - Same layout as Branch page */}
      <div className="grid grid-cols-1 max-w-[100vw]  lg:grid-cols-2   gap-4 mb-8 lg:max-w-[50vw]">
        <div className="flex items-center justify-start flex-1 gap-2 max-w-[100%] min-h-[100px] rounded-sm p-4 bg-white shadow-sm">
          <div>
            <p className="text-5xl mb-1">{staffItems.length}</p>
            <p className="text-1xl text-gray-500">Total Staff</p>
          </div>
        </div>

        <div className="flex items-center justify-start flex-1 gap-2 max-w-[100%] min-h-[100px] rounded-sm p-4 bg-white shadow-sm">
          <div>
            <p className="text-5xl mb-1">
              {staffItems.filter((item) => item.Status === "Active").length}
            </p>
            <p className="text-1xl text-gray-500">Active Staff</p>
          </div>
        </div>


      </div>

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
                <th className="relative px-4 py-3 text-left ">
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
                    <DropdownMenu.Root modal={false}>
                      <DropdownMenu.Trigger className="px-2 py-1 rounded  bg-transparent border-none outline-none hover:bg-transparent flex items-center gap-2 focus:outline-none focus:ring-0 cursor-pointer">
                        {statusFilter || "Status"}
                        <ChevronDown
                          size={14}
                          className="text-gray-500 ml-auto"
                        />
                      </DropdownMenu.Trigger>

                      <DropdownMenu.Content
                        className="min-w-[120px] rounded-sm bg-white shadow-md border-none p-1 relative outline-none"
                        sideOffset={6}
                        onOpenAutoFocus={(e) => e.preventDefault()}
                        onCloseAutoFocus={(e) => e.preventDefault()}
                        style={{ zIndex: 1000 }}
                      >
                        <DropdownMenu.Arrow className="fill-white stroke-gray-200 w-5 h-3" />
                        <DropdownMenu.Item
                          className="px-3 py-1  cursor-pointer hover:bg-gray-100 rounded outline-none"
                          onClick={() => setStatusFilter("")}
                        >
                          Status
                        </DropdownMenu.Item>
                        <DropdownMenu.Item
                          className="px-3 py-1  cursor-pointer hover:bg-green-100 text-green-400 rounded outline-none"
                          onClick={() => setStatusFilter("Active")}
                        >
                          Active
                        </DropdownMenu.Item>
                        <DropdownMenu.Item
                          className="px-3 py-1  cursor-pointer hover:bg-red-100 text-red-400 rounded outline-none"
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
                  <div className="flex flex-col gap-1">
                    <DropdownMenu.Root modal={false}>
                      <DropdownMenu.Trigger className="px-2 py-1 rounded  bg-transparent border-none outline-none hover:bg-transparent flex items-center gap-2 focus:outline-none focus:ring-0 cursor-pointer">
                        {roleFilter || "Role"}
                        <ChevronDown
                          size={14}
                          className="text-gray-500 ml-auto"
                        />
                      </DropdownMenu.Trigger>

                      <DropdownMenu.Content
                        className="min-w-[120px] rounded-sm bg-white shadow-md border-none p-1 relative outline-none"
                        sideOffset={6}
                        onOpenAutoFocus={(e) => e.preventDefault()}
                        onCloseAutoFocus={(e) => e.preventDefault()}
                        style={{ zIndex: 1000 }}
                      >
                        <DropdownMenu.Arrow className="fill-white stroke-gray-200 w-5 h-3" />
                        <DropdownMenu.Item
                          className="px-3 py-1  cursor-pointer hover:bg-gray-100 rounded outline-none"
                          onClick={() => setRoleFilter("")}
                        >
                          Role
                        </DropdownMenu.Item>
                        {Array.from(
                          new Set(staffItems.map((i) => i.Role))
                        ).map((role) => (
                          <DropdownMenu.Item
                            key={role}
                            className="px-3 py-1  cursor-pointer hover:bg-blue-100 text-black rounded outline-none"
                            onClick={() => setRoleFilter(role)}
                          >
                            {role}
                          </DropdownMenu.Item>
                        ))}
                      </DropdownMenu.Content>
                    </DropdownMenu.Root>
                  </div>
                  <span className="absolute left-0 top-[15%] h-[70%] w-[1.5px] bg-gray-300"></span>
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

            <tbody className="divide-y text-gray-500 divide-gray-300">
              {filteredItems.length === 0 ? (
                <tr>
                  <td
                    colSpan={13}
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    {searchTerm || statusFilter || roleFilter
                      ? "No staff match your search criteria."
                      : `No staff found for ${branchInfo?.Branch_Name || 'this branch'}.`}
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr
                    key={item.Staff_ID}
                    className="bg-white hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <td className="px-6 py-8 whitespace-nowrap card-checkbox-cell">
                      <Checkbox
                        checked={selectedItems.includes(item.Staff_ID)}
                        onChange={(e) =>
                          handleSelectItem(item.Staff_ID, e.target.checked)
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
                    <td className="px-4 py-4 whitespace-nowrap " data-label="Staff ID">
                      {`#${String(item.Staff_ID).padStart(3, "0")}`}
                    </td>

                    <td className="px-4 py-4 whitespace-nowrap card-name-cell" data-label="Name">
                      <span className="font-medium">{item.Name}</span>

                    </td>

                    <td className="px-4 py-4 whitespace-nowrap " data-label="Contact">
                      {item.Contact}
                    </td>
                    <td className="px-4 py-4  " data-label="Address" title={item.Address}>
                      {item.Address}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap " data-label="CNIC">
                      {item.CNIC}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap" data-label="Status">
                      <span
                        className={`inline-block w-20 text-right lg:text-center py-[2px] rounded-sm text-xs font-medium 
                    ${item.Status === "Active" ? "text-green-400 border-green-600" : ""}
                    ${item.Status === "Inactive" ? "text-red-400 border-red-600" : ""}`}
                      >
                        {item.Status}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap " data-label="Role">
                      {item.Role}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap " data-label="Salary">
                      {item.Salary}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap  text-gray-600" data-label="Shift Start Time">
                      {item.Shift_Start_Time}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap  text-gray-600" data-label="Shift End Time">
                      {item.Shift_End_Time}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap " data-label="Access Code">
                      {(item.Role === "Cashier" || item.Role === "Manager") &&
                        item.Access_Code ? (
                        <span
                          className={`px-2 py-1 rounded text-xs font-mono ${item.Role === "Cashier"
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
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-71 px-4"
          onClick={handleCloseModal}>
          <div className="bg-white rounded-sm p-4 sm:p-6 min-w-[35vw] max-w-2xl max-h-[70vh] min-h-[70vh] shadow-lg relative flex flex-col"
            onClick={(e) => e.stopPropagation()}>

            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-semibold text-gray-800">
                {editingItem ? "Edit Staff Member" : "Add New Staff Member"}
              </h2>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-2">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleModalSubmit();
                }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div className="md:col-span-2">
                    <label className="block  font-medium text-gray-700 mb-2">
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
                    <label className="block  font-medium text-gray-700 mb-2">
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
                    <label className="block  font-medium text-gray-700 mb-2">
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
                    <label className="block  font-medium text-gray-700 mb-2">
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
                    <label className="block  font-medium text-gray-700 mb-2">
                      Role
                    </label>

                    <DropdownMenu.Root modal={false}>
                      <DropdownMenu.Trigger className="px-3 py-2 rounded-lg  border border-gray-300 bg-white flex items-center gap-2 w-full focus:outline-none focus:ring-2 focus:ring-[#d9d9e1] focus:border-transparent transition-colors hover:border-gray-400">
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
                          className="min-w-[200px] rounded-sm bg-white shadow-lg border border-gray-200 p-1 relative outline-none z-[100] max-h-60 overflow-y-auto"
                          sideOffset={6}
                        >
                          <DropdownMenu.Arrow className="fill-white stroke-gray-200 w-5 h-3" />

                          <DropdownMenu.Item
                            className="px-3 py-2  cursor-pointer hover:bg-gray-100 rounded outline-none text-gray-500"
                            onClick={() =>
                              setFormData({ ...formData, Role: "" })
                            }
                          >
                            Select Role
                          </DropdownMenu.Item>

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
                              className="px-3 py-2  cursor-pointer hover:bg-gray-100 hover:text-gray-700 rounded outline-none"
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
                    <label className="block  font-medium text-gray-700 mb-2">
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
                    <label className="block  font-medium text-gray-700 mb-2">
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
                    <label className="block  font-medium text-gray-700 mb-2">
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
                    formData.Role === "Manager"||
                    formData.Role === "Waiter") && (
                      <div>
                        <label className="block  font-medium text-gray-700 mb-2">
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
                    <label className="block  font-medium text-gray-700">
                      Status
                    </label>
                    <div className="flex items-center gap-3">
                      <span
                        className={` font-medium ${formData.Status === "Active"
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
            <div className="flex flex-col sm:flex-row gap-3 pt-4 sm:pt-6 justify-end border-t border-gray-200 mt-auto">
              <button
                type="button"
                onClick={handleCloseModal}
                disabled={actionLoading}
                className="w-full sm:w-auto px-6 py-2 border border-gray-300 rounded-sm hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
                className={`w-full sm:w-auto px-6 py-2 rounded-sm transition-colors flex items-center justify-center gap-2 ${!formData.Name.trim() ||
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