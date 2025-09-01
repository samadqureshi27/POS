"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { DateRange } from "react-date-range";
import { format } from "date-fns";

import "react-date-range/dist/styles.css"; // main css
import "react-date-range/dist/theme/default.css"; // theme css
import {
  ChevronDown,
  Search,
  AlertCircle,
  CheckCircle,
  X,
  Info,
  Calendar,
} from "lucide-react";
import ResponsiveDetailButton from "@/components/layout/UI/ResponsiveDetailButton";

// Types
interface StaffItem {
  STAFF_ID: string;
  Name: string;
  Contact: string;
  Status: "Paid" | "Unpaid";
  Role: string;
  Salary: number;
  JoinDate: string;
  Branch_ID_fk: string;
}

interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

// Mock API - Updated to filter by branch
class StaffAPI {
  private static delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  private static mockData: StaffItem[] = [
    {
      STAFF_ID: "1",
      Name: "John Smith",
      Contact: "+1-234-567-8901",
      Status: "Paid",
      Role: "Manager",
      Salary: 5000,
      JoinDate: "2025-08-28",
      Branch_ID_fk: "1",
    },
    {
      STAFF_ID: "2",
      Name: "Sarah Johnson",
      Contact: "+1-234-567-8902",
      Status: "Unpaid",
      Role: "Waiter",
      Salary: 2500,
      JoinDate: "2025-08-26",
      Branch_ID_fk: "1",
    },
    {
      STAFF_ID: "3",
      Name: "Mike Chen",
      Contact: "+1-234-567-8903",
      Status: "Paid",
      Role: "Cashier",
      Salary: 3000,
      JoinDate: "2025-08-15",
      Branch_ID_fk: "1",
    },
    {
      STAFF_ID: "4",
      Name: "Emily Davis",
      Contact: "+1-234-567-8904",
      Status: "Unpaid",
      Role: "Chef",
      Salary: 4000,
      JoinDate: "2025-08-05",
      Branch_ID_fk: "2",
    },
    {
      STAFF_ID: "5",
      Name: "Robert Wilson",
      Contact: "+1-234-567-8905",
      Status: "Paid",
      Role: "Cleaner",
      Salary: 2000,
      JoinDate: "2025-07-12",
      Branch_ID_fk: "2",
    },
    {
      STAFF_ID: "6",
      Name: "Lisa Anderson",
      Contact: "+1-234-567-8906",
      Status: "Unpaid",
      Role: "Waiter",
      Salary: 2500,
      JoinDate: "2025-06-18",
      Branch_ID_fk: "2",
    },
    {
      STAFF_ID: "7",
      Name: "David Brown",
      Contact: "+1-234-567-8907",
      Status: "Paid",
      Role: "Security",
      Salary: 2800,
      JoinDate: "2025-01-25",
      Branch_ID_fk: "3",
    },
    {
      STAFF_ID: "8",
      Name: "Maria Garcia",
      Contact: "+1-234-567-8908",
      Status: "Unpaid",
      Role: "Hostess",
      Salary: 2200,
      JoinDate: "2024-08-10",
      Branch_ID_fk: "3",
    },
  ];

  static async getStaffItemsByBranch(branchId: string): Promise<ApiResponse<StaffItem[]>> {
    await this.delay(800);

    // Filter staff items by branch ID
    const filteredData = this.mockData.filter(item => item.Branch_ID_fk === branchId);

    return {
      success: true,
      data: filteredData,
      message: `Staff items for branch ${branchId} fetched successfully`,
    };
  }
}

// Simple Dropdown Component (replacing Radix UI)
const Dropdown = ({ trigger, children, isOpen, onOpenChange }) => {
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
      });
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) &&
        triggerRef.current && !triggerRef.current.contains(event.target)) {
        onOpenChange(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onOpenChange]);

  return (
    <>
      <div ref={triggerRef} onClick={() => onOpenChange(!isOpen)}>
        {trigger}
      </div>
      {isOpen && (
        <div
          ref={dropdownRef}
          className="fixed z-50 min-w-[120px] rounded-sm bg-white shadow-lg border border-gray-200 p-1"
          style={{ top: position.top + 5, left: position.left }}
        >
          {children}
        </div>
      )}
    </>
  );
};

// Toast Component
const Toast = ({
  message,
  type,
  onClose,
}) => (
  <div
    className={`fixed top-4 right-4 px-4 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2 ${type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}
  >
    {type === "success" ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
    <span>{message}</span>
    <button onClick={onClose} className="ml-2">
      <X size={16} />
    </button>
  </div>
);

const StaffManagementPage = () => {
  // For demo purposes, let's set a default branch ID since we can't access real routing
  const [branchId, setBranchId] = useState("1"); // Default to branch 1 for demo

  // In a real Next.js app, you would use:
  // const params = useParams();
  // const branchId = params?.branchId;

  const [staffItems, setStaffItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Debounced search
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [toast, setToast] = useState(null);

  const [statusFilter, setStatusFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  // Time period filter  
  const periods = ["Today", "Week", "Month", "Quarter", "Year", "Custom"];
  const [activeTimePeriod, setActiveTimePeriod] = useState("Week");
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Dropdown states
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const [customDateRange, setCustomDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const calendarRef = useRef(null);

  const formatDisplayDate = (date) => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => setSearchTerm(searchInput), 300);
    return () => clearTimeout(handler);
  }, [searchInput]);

  // Handle click outside calendar
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(event.target)
      ) {
        setShowDatePicker(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Auto-close toast
  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  // Load staff items when branchId is available
  useEffect(() => {
    if (branchId) {
      loadStaffItems();
    }
  }, [branchId]);

  const showToast = (message, type) =>
    setToast({ message, type });

  const loadStaffItems = async () => {
    if (!branchId) {
      showToast("Branch ID not found", "error");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await StaffAPI.getStaffItemsByBranch(branchId);
      if (!response.success) throw new Error(response.message);
      setStaffItems(response.data);
    } catch (error) {
      showToast("Failed to load staff members", "error");
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get date ranges with proper boundary handling
  const getDateRange = (period) => {
    const today = new Date();

    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0, 0);
    const endOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999);

    switch (period) {
      case "Today":
        return { start: startOfToday, end: endOfToday };

      case "Week": {
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());
        startOfWeek.setHours(0, 0, 0, 0);

        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59, 999);

        return { start: startOfWeek, end: endOfWeek };
      }

      case "Month": {
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1, 0, 0, 0, 0);
        const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999);
        return { start: startOfMonth, end: endOfMonth };
      }

      case "Quarter": {
        const currentMonth = today.getMonth();
        const quarter = Math.floor(currentMonth / 3);
        const startOfQuarter = new Date(today.getFullYear(), quarter * 3, 1, 0, 0, 0, 0);
        const endOfQuarter = new Date(today.getFullYear(), quarter * 3 + 3, 0, 23, 59, 59, 999);
        return { start: startOfQuarter, end: endOfQuarter };
      }

      case "Year": {
        const startOfYear = new Date(today.getFullYear(), 0, 1, 0, 0, 0, 0);
        const endOfYear = new Date(today.getFullYear(), 11, 31, 23, 59, 59, 999);
        return { start: startOfYear, end: endOfYear };
      }

      case "Custom":
        if (customDateRange?.[0]?.startDate && customDateRange?.[0]?.endDate) {
          const rangeStart = new Date(customDateRange[0].startDate);
          rangeStart.setHours(0, 0, 0, 0);
          const rangeEnd = new Date(customDateRange[0].endDate);
          rangeEnd.setHours(23, 59, 59, 999);
          return { start: rangeStart, end: rangeEnd };
        }
        return null;

      default:
        return null;
    }
  };

  // Memoized filtering
  const filteredItems = useMemo(() => {
    const s = searchTerm.toLowerCase();
    return staffItems.filter((item) => {
      const matchesSearch =
        item.Name.toLowerCase().includes(s) ||
        item.Contact.toLowerCase().includes(s) ||
        item.Role.toLowerCase().includes(s) ||
        item.STAFF_ID.toLowerCase().includes(s);
      const matchesStatus = statusFilter ? item.Status === statusFilter : true;
      const matchesRole = roleFilter ? item.Role === roleFilter : true;

      // Date filtering based on time period
      let matchesDate = true;
      const dateRange = getDateRange(activeTimePeriod);

      if (dateRange) {
        const itemDate = new Date(item.JoinDate);
        matchesDate = itemDate >= dateRange.start && itemDate <= dateRange.end;
      }

      return matchesSearch && matchesStatus && matchesRole && matchesDate;
    });
  }, [staffItems, searchTerm, statusFilter, roleFilter, activeTimePeriod, customDateRange]);

  // Calculate summary data - using filtered staff items for branch-specific data
  const summaryData = useMemo(() => {
    const totalStaff = staffItems.length;
    const paidStaff = staffItems.filter(item => item.Status === "Paid").length;
    const unpaidStaff = staffItems.filter(item => item.Status === "Unpaid").length;
    const totalSalaries = staffItems.reduce((sum, item) => sum + item.Salary, 0);
    const paidSalaries = staffItems
      .filter(item => item.Status === "Paid")
      .reduce((sum, item) => sum + item.Salary, 0);
    const unpaidSalaries = staffItems
      .filter(item => item.Status === "Unpaid")
      .reduce((sum, item) => sum + item.Salary, 0);

    return {
      totalStaff,
      paidStaff,
      unpaidStaff,
      totalSalaries,
      paidSalaries,
      unpaidSalaries,
    };
  }, [staffItems]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-b-2 border-yellow-600 rounded-full mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading Payroll...</p>
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

    <div className="bg-gray-50 min-h-screen mt-17 w-full px-2">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="mb-8 mt-2">
        <h1 className="text-3xl font-semibold">Payroll - Branch #{branchId}</h1>
      </div>


      <div className="flex mb-6 sm:mb-8 relative max-w-[88vw]">
        <div className="flex overflow-x-auto pb-2 gap-2 w-full hide-scrollbar">
          {periods.map((period) => (
            <div key={period} className="relative flex-shrink-0">
              <button
                onClick={() => {
                  if (period === "Custom") {
                    setActiveTimePeriod("Custom");
                    setShowDatePicker((prev) => !prev);
                  } else {
                    setActiveTimePeriod(period);
                    setShowDatePicker(false);
                  }
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-sm transition-colors border ${activeTimePeriod === period
                  ? "bg-[#2C2C2C] text-white border-[#2C2C2C]"
                  : "bg-white text-gray-600 border-gray-300 hover:bg-gray-100"
                  }`}
              >
                {period === "Custom" && <Calendar size={16} />}
                <span className="whitespace-nowrap">
                  {period === "Custom" &&
                    customDateRange?.[0]?.startDate &&
                    customDateRange?.[0]?.endDate
                    ? `${formatDisplayDate(customDateRange[0].startDate)} - ${formatDisplayDate(customDateRange[0].endDate)}`
                    : period}
                </span>
              </button>

              {/* Calendar dropdown attached to Custom button */}
              {period === "Custom" &&
                activeTimePeriod === "Custom" &&
                showDatePicker && (
                  <div
                    ref={calendarRef}
                    className="fixed z-50 mt-2 w-64 h-64 md:w-80 md:h-80 bg-white shadow-lg border border-gray-200 rounded-sm"
                    style={{
                      top: '120px', // Adjust based on your header height
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: 'min(320px, calc(100vw - 32px))', // Responsive width
                      height: 'min(320px, calc(100vh - 200px))', // Responsive height
                    }}
                  >
                    <DateRange
                      ranges={customDateRange?.length ? customDateRange : [{
                        startDate: new Date(),
                        endDate: new Date(),
                        key: "selection",
                      }]}
                      onChange={(ranges) => {
                        if (ranges.selection) {
                          setCustomDateRange([ranges.selection]);

                          if (ranges.selection.startDate && ranges.selection.endDate) {
                            setShowDatePicker(false);
                          }
                        }
                      }}
                      moveRangeOnFirstSelection={false}
                      className="rounded-lg calendar-mobile-responsive"
                    />
                  </div>
                )}
            </div>
          ))}
        </div>
      </div>


      {/* Summary Cards - Same layout as other pages */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4  gap-4 mb-8 max-w-[100vw]">
        <div className="flex items-center justify-start gap-2 min-h-[100px] border border-gray-300 rounded-sm p-4 bg-white shadow-sm">
          <div>
            <p className="text-5xl mb-1">{summaryData.totalStaff}</p>
            <p className="text-1xl text-gray-500">Total Staff</p>
          </div>
        </div>

        <div className="flex items-center justify-start gap-2 min-h-[100px] border border-gray-300 rounded-sm p-4 bg-white shadow-sm">
          <div>
            <p className="text-5xl mb-1">{summaryData.paidStaff}</p>
            <p className="text-1xl text-gray-500">Paid Staff</p>
          </div>
        </div>

        <div className="flex items-center justify-start gap-2 min-h-[100px] border border-gray-300 rounded-sm p-4 bg-white shadow-sm">
          <div>
            <p className="text-5xl mb-1">${summaryData.totalSalaries.toLocaleString()}</p>
            <p className="text-1xl text-gray-500">Total Payroll</p>
          </div>
        </div>

        <div className="flex items-center justify-start gap-2 min-h-[100px] border border-gray-300 rounded-sm p-4 bg-white shadow-sm">
          <div>
            <p className="text-5xl mb-1">${summaryData.unpaidSalaries.toLocaleString()}</p>
            <p className="text-1xl text-gray-500">Pending Payments</p>
          </div>
        </div>
      </div>

      <div className="mb-6 flex items-center justify-between gap-4 flex-wrap">
        {/* Search Bar */}
        <div className="relative flex-1 min-w-[150px] max-w-[100vw]">
          <input
            type="text"
            placeholder="Search..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full pr-10 pl-4 h-[40px] py-2 border bg-white border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#d9d9e1]"
          />
          <Search
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={16}
          />
        </div>
      </div>

      {/* Responsive Table with Global CSS Classes */}
      <div className="bg-gray-50 rounded-sm border border-gray-300 max-w-[100vw]  shadow-sm responsive-customer-table ">
        <div className="rounded-sm table-container">
          <table className="min-w-full divide-y max-w-[800px] divide-gray-200   table-fixed">
            <thead className="bg-white border-b text-gray-500 border-gray-200  py-50 sticky top-0 z-10">
              <tr>
                <td className="card-checkbox-cell relative px-4 py-3 text-left">
                  Staff ID
                </td>
                <td className="card-name-cell relative px-4 py-3 text-left">
                  Name
                  <span className="absolute left-0 top-[15%] h-[70%] w-[1.5px] bg-[#d9d9e1]"></span>
                </td>
                <th className="relative px-4 py-3 text-left">
                  Contact
                  <span className="absolute left-0 top-[15%] h-[70%] w-[1.5px] bg-[#d9d9e1]"></span>
                </th>
                <th className="relative px-4 py-3 text-left">
                  <div className="flex flex-col gap-1">
                    <Dropdown
                      isOpen={roleDropdownOpen}
                      onOpenChange={setRoleDropdownOpen}
                      trigger={
                        <button className="px-2 py-1 rounded  bg-transparent border-none outline-none hover:bg-transparent flex items-center gap-2 focus:outline-none focus:ring-0 cursor-pointer">
                          {roleFilter || "Role"}
                          <ChevronDown size={14} className="text-gray-500 ml-auto" />
                        </button>
                      }
                    >
                      <button
                        className="w-full px-3 py-1  cursor-pointer hover:bg-gray-100 rounded outline-none text-left"
                        onClick={() => {
                          setRoleFilter("");
                          setRoleDropdownOpen(false);
                        }}
                      >
                        Role
                      </button>
                      {Array.from(new Set(staffItems.map((item) => item.Role))).map(
                        (role) => (
                          <button
                            key={role}
                            className="w-full px-3 py-1  cursor-pointer hover:bg-gray-100 text-black-700 rounded outline-none text-left"
                            onClick={() => {
                              setRoleFilter(role);
                              setRoleDropdownOpen(false);
                            }}
                          >
                            {role}
                          </button>
                        )
                      )}
                    </Dropdown>
                  </div>
                  <span className="absolute left-0 top-[15%] h-[70%] w-[1.5px] bg-gray-300"></span>
                </th>
                <th className="relative px-4 py-3 text-left">
                  <div className="flex flex-col gap-1">
                    <Dropdown
                      isOpen={statusDropdownOpen}
                      onOpenChange={setStatusDropdownOpen}
                      trigger={
                        <button className="px-2 py-1 rounded  bg-transparent border-none outline-none hover:bg-transparent flex items-center gap-2 focus:outline-none focus:ring-0 cursor-pointer">
                          {statusFilter || "Status"}
                          <ChevronDown size={14} className="text-gray-500 ml-auto" />
                        </button>
                      }
                    >
                      <button
                        className="w-full px-3 py-1  cursor-pointer hover:bg-gray-100 rounded outline-none text-left"
                        onClick={() => {
                          setStatusFilter("");
                          setStatusDropdownOpen(false);
                        }}
                      >
                        Status
                      </button>
                      <button
                        className="w-full px-3 py-1  cursor-pointer hover:bg-green-100 text-green-400 rounded outline-none text-left"
                        onClick={() => {
                          setStatusFilter("Paid");
                          setStatusDropdownOpen(false);
                        }}
                      >
                        Paid
                      </button>
                      <button
                        className="w-full px-3 py-1  cursor-pointer hover:bg-red-100 text-red-400 rounded outline-none text-left"
                        onClick={() => {
                          setStatusFilter("Unpaid");
                          setStatusDropdownOpen(false);
                        }}
                      >
                        Unpaid
                      </button>
                    </Dropdown>
                  </div>
                  <span className="absolute left-0 top-[15%] h-[70%] w-[1.5px] bg-gray-300"></span>
                </th>
                <th className="relative px-4 py-3 text-left">
                  Salary
                  <span className="absolute left-0 top-[15%] h-[70%] w-[1.5px] bg-gray-300"></span>
                </th>
                <th className="relative px-4 py-3 text-left">
                  Join Date
                  <span className="absolute left-0 top-[15%] h-[70%] w-[1.5px] bg-gray-300"></span>
                </th>
               <th className="relative px-4 py-3 text-left">
                  Details
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
                    {searchTerm || statusFilter || roleFilter ||
                      (activeTimePeriod === "Custom" && customDateRange?.[0]?.startDate && customDateRange?.[0]?.endDate) ||
                      (activeTimePeriod !== "Week" && activeTimePeriod !== "Custom")
                      ? `No staff members match your search criteria for Branch #${branchId}.`
                      : `No staff members found for Branch #${branchId}.`}
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr key={item.STAFF_ID} className="bg-white hover:bg-gray-50 cursor-pointer transition-colors">
                    <td className="px-6 py-8 whitespace-nowrap " data-label="Staff ID">
                      {`#${String(item.STAFF_ID).padStart(3, "0")}`}
                    </td>
                    <td className="card-name-cell px-4 py-4 whitespace-nowrap  " data-label="Name">
                      <span>{item.Name}</span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap " data-label="Contact">
                      {item.Contact}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap " data-label="Role">
                      {item.Role}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap " data-label="Status">
                      <span
                        className={`inline-block w-20  lg:text-center text-right  py-[2px] rounded-md text-xs font-medium  ${item.Status === "Paid"
                          ? "text-green-400 border-green-600"
                          : ""
                          } ${item.Status === "Unpaid"
                            ? "text-red-400 border-red-600"
                            : ""
                          }`}
                      >
                        {item.Status}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap " data-label="Salary">
                      {item.Salary.toLocaleString()}Rs
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap " data-label="Join Date">
                      {new Date(item.JoinDate).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap card-actions-cell" data-label="Actions" onClick={(e) => e.stopPropagation()}>
                      <ResponsiveDetailButton
                        onClick={(e) => {
                          e.stopPropagation();
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
    </div>
  );
};

export default StaffManagementPage;