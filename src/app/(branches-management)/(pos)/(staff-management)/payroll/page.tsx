"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  ChevronDown,
  Search,
  AlertCircle,
  CheckCircle,
  X,
  Info,
} from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

// Types
interface StaffItem {
  STAFF_ID: string;
  Name: string;
  Contact: string;
  Status: "Paid" | "Unpaid";
  Role: string;
  Salary: number;
  JoinDate: string;
}

interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

// Mock API - Only GET method for read-only display
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
      JoinDate: "2023-01-15",
    },
    {
      STAFF_ID: "2",
      Name: "Sarah Johnson",
      Contact: "+1-234-567-8902",
      Status: "Unpaid",
      Role: "Waiter",
      Salary: 2500,
      JoinDate: "2023-03-20",
    },
    {
      STAFF_ID: "3",
      Name: "Mike Chen",
      Contact: "+1-234-567-8903",
      Status: "Paid",
      Role: "Cashier",
      Salary: 3000,
      JoinDate: "2023-02-10",
    },
    {
      STAFF_ID: "4",
      Name: "Emily Davis",
      Contact: "+1-234-567-8904",
      Status: "Unpaid",
      Role: "Chef",
      Salary: 4000,
      JoinDate: "2023-04-05",
    },
    {
      STAFF_ID: "5",
      Name: "Robert Wilson",
      Contact: "+1-234-567-8905",
      Status: "Paid",
      Role: "Cleaner",
      Salary: 2000,
      JoinDate: "2023-05-12",
    },
    {
      STAFF_ID: "6",
      Name: "Lisa Anderson",
      Contact: "+1-234-567-8906",
      Status: "Unpaid",
      Role: "Waiter",
      Salary: 2500,
      JoinDate: "2023-06-18",
    },
    {
      STAFF_ID: "7",
      Name: "David Brown",
      Contact: "+1-234-567-8907",
      Status: "Paid",
      Role: "Security",
      Salary: 2800,
      JoinDate: "2023-07-25",
    },
    {
      STAFF_ID: "8",
      Name: "Maria Garcia",
      Contact: "+1-234-567-8908",
      Status: "Unpaid",
      Role: "Hostess",
      Salary: 2200,
      JoinDate: "2023-08-10",
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
}

// Custom DatePicker Component
const DatePicker = ({ selected, onChange, dateFormat, placeholderText, className }: {
  selected: Date | null;
  onChange: (date: Date | null) => void;
  dateFormat: string;
  placeholderText: string;
  className: string;
}) => {
  const formatDate = (date: Date): string => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const parseDate = (dateString: string): Date | null => {
    const parts = dateString.split('/');
    if (parts.length === 3) {
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const year = parseInt(parts[2], 10);
      if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
        return new Date(year, month, day);
      }
    }
    return null;
  };

  return (
    <input
      type="date"
      value={selected ? selected.toISOString().split('T')[0] : ''}
      onChange={(e) => {
        const value = e.target.value;
        if (value) {
          const date = new Date(value);
          onChange(date);
        } else {
          onChange(null);
        }
      }}
      className={className}
      placeholder={placeholderText}
    />
  );
};

// Toast Component
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

const StaffManagementPage = () => {
  const [staffItems, setStaffItems] = useState<StaffItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Debounced search
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const [statusFilter, setStatusFilter] = useState<"" | "Paid" | "Unpaid">("");
  const [roleFilter, setRoleFilter] = useState<string>("");

  // Time period filter
  const timePeriodOptions = ["Today", "Week", "Month", "Quarter", "Year", "Custom date"];
  const [activeTimePeriod, setActiveTimePeriod] = useState("Week");
  const [customDate, setCustomDate] = useState<Date | null>(null);

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

  const showToast = (message: string, type: "success" | "error") =>
    setToast({ message, type });

  const loadStaffItems = async () => {
    try {
      setLoading(true);
      const response = await StaffAPI.getStaffItems();
      if (!response.success) throw new Error(response.message);
      setStaffItems(response.data);
    } catch {
      showToast("Failed to load staff members", "error");
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
        item.Contact.toLowerCase().includes(s) ||
        item.Role.toLowerCase().includes(s) ||
        item.STAFF_ID.toLowerCase().includes(s);
      const matchesStatus = statusFilter ? item.Status === statusFilter : true;
      const matchesRole = roleFilter ? item.Role === roleFilter : true;
      
      // Custom date filtering
      let matchesDate = true;
      if (activeTimePeriod === "Custom date" && customDate) {
        const itemDate = new Date(item.JoinDate);
        const selectedDate = new Date(customDate);
        matchesDate = itemDate.toDateString() === selectedDate.toDateString();
      }
      
      return matchesSearch && matchesStatus && matchesRole && matchesDate;
    });
  }, [staffItems, searchTerm, statusFilter, roleFilter, activeTimePeriod, customDate]);

  // Calculate summary data
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
          <p className="mt-4 text-gray-600">Loading Staff Management...</p>
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

      <h1 className="text-3xl font-semibold mt-14 mb-8 ">Staff Management</h1>

      {/* Time Period Filter */}
      <div className="flex gap-2  mb-5">
        {timePeriodOptions.map((option) => (
          <button
            key={option}
            onClick={() => setActiveTimePeriod(option)}
            className={`px-4 py-2 rounded-sm text-sm font-medium border transition-colors ${activeTimePeriod === option
                ? "bg-[#2C2C2C] text-white border-[#2C2C2C]"
                : "bg-white text-gray-600 border-gray-300 hover:bg-gray-100"
              }`}
          >
            {option}
          </button>
        ))}
         {/* Show calendar if "Custom date" is active */}
                {activeTimePeriod === "Custom date" && (
                  <DatePicker
                    selected={customDate}
                    onChange={(date: Date | null) => setCustomDate(date)}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="Select date"
                    className="ml-4 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#d9d9e1]"
                  />
                )}
      </div>

      {/* Summary Cards */}
      <div className="flex gap-13 mb-8">
        <div className="flex items-center justify-start flex-1 gap-2 max-w-[300px] min-h-[100px] rounded-sm p-4 bg-white shadow-sm">
          <div>
            <p className="text-4xl mb-1">{summaryData.totalStaff}</p>
            <p className="text-1xl text-gray-500">Total Staff</p>
          </div>
        </div>

        <div className="flex items-center justify-start flex-1 gap-2 max-w-[300px] min-h-[100px] rounded-sm p-4 bg-white shadow-sm">
          <div>
            <p className="text-4xl mb-1">{summaryData.paidStaff}</p>
            <p className="text-1xl text-gray-500">Paid Staff</p>
          </div>
        </div>

        <div className="flex items-center justify-start flex-1 gap-2 max-w-[300px] min-h-[100px] rounded-sm p-4 bg-white shadow-sm">
          <div>
            <p className="text-4xl mb-1">${summaryData.totalSalaries.toLocaleString()}</p>
            <p className="text-1xl text-gray-500">Total Payroll</p>
          </div>
        </div>

        <div className="flex items-center justify-start flex-1 gap-2 max-w-[300px] min-h-[100px] rounded-sm ml-1 p-4 bg-white shadow-sm">
          <div>
            <p className="text-4xl mb-1">${summaryData.unpaidSalaries.toLocaleString()}</p>
            <p className="text-1xl text-gray-500">Pending Payments</p>
          </div>
        </div>
      </div>

      {/* Search Bar */}
     <div className="mb-8 ">
        <div className="relative flex-1 min-w-[200px]">
                  <input
                    type="text"
                    placeholder="Search Staff..."
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
              <div className="max-h-[500px] rounded-sm overflow-y-auto">
                <table className="min-w-full divide-y divide-gray-200   table-fixed">
                  <thead className="bg-white border-b text-gray-500 border-gray-200  py-50 sticky top-0 z-10">
              <tr>
                <th className="relative px-6 py-6 text-left">
                  Staff ID
                </th>
                <th className="relative px-4 py-3 text-left">
                  Name
                  <span className="absolute left-0 top-[15%] h-[70%] w-[1.5px] bg-[#d9d9e1]"></span>
                </th>
                <th className="relative px-4 py-3 text-left">
                  Contact
                  <span className="absolute left-0 top-[15%] h-[70%] w-[1.5px] bg-[#d9d9e1]"></span>
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
                          className="min-w-[240px] rounded-md bg-white shadow-md border-none p-1 relative outline-none"
                          sideOffset={6}
                        >
                          <DropdownMenu.Arrow className="fill-white stroke-gray-200 w-5 h-3" />
                          <DropdownMenu.Item
                            className="px-3 py-1 text-sm cursor-pointer hover:bg-gray-100 rounded outline-none"
                            onClick={() => setRoleFilter("")}
                          >
                            Role
                          </DropdownMenu.Item>
                          {Array.from(new Set(staffItems.map((item) => item.Role))).map(
                            (role) => (
                              <DropdownMenu.Item
                                key={role}
                                className="px-3 py-1 text-sm cursor-pointer hover:bg-gray-100 text-black-700 rounded outline-none"
                                onClick={() => setRoleFilter(role)}
                              >
                                {role}
                              </DropdownMenu.Item>
                            )
                          )}
                        </DropdownMenu.Content>
                      </DropdownMenu.Portal>
                    </DropdownMenu.Root>
                  </div>
                  <span className="absolute left-0 top-[15%] h-[70%] w-[1.5px] bg-gray-300"></span>
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
                          className="min-w-[240px] rounded-md bg-white shadow-md border-none p-1 relative outline-none"
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
                            onClick={() => setStatusFilter("Paid")}
                          >
                            Paid
                          </DropdownMenu.Item>
                          <DropdownMenu.Item
                            className="px-3 py-1 text-sm cursor-pointer hover:bg-red-100 text-red-400 rounded outline-none"
                            onClick={() => setStatusFilter("Unpaid")}
                          >
                            Unpaid
                          </DropdownMenu.Item>
                        </DropdownMenu.Content>
                      </DropdownMenu.Portal>
                    </DropdownMenu.Root>
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
                  <span className="absolute left-0 top-[15%] w-[1.5px] bg-gray-300"></span>
                </th>
              </tr>
            </thead>

            <tbody className="divide-y text-gray-500  divide-gray-300">
              {filteredItems.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    {searchTerm || statusFilter || roleFilter || (activeTimePeriod === "Custom date" && customDate)
                      ? "No staff members match your search criteria."
                      : "No staff members found."}
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr key={item.STAFF_ID} className="bg-white hover:bg-gray-50">
                    <td className="px-6 py-8 whitespace-nowrap text-sm">
                      {`#${String(item.STAFF_ID).padStart(3, "0")}`}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                      {item.Name}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                      {item.Contact}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                      {item.Role}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span
                        className={`inline-block w-20 text-center px-2 py-[2px] rounded-md text-xs font-medium  ${item.Status === "Paid"
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
                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                      ${item.Salary.toLocaleString()}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                      {new Date(item.JoinDate).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button
                          className="text-gray-600 hover:text-gray-800 p-1 transition-colors"
                          title="View Details"
                        >
                          <Info size={16} />
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

    </div>
  );
};

export default StaffManagementPage;