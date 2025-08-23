"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  ChevronDown,
  Search,
  AlertCircle,
  CheckCircle,
  X,
} from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

// Types
interface CustomerItem {
  Customer_ID: number;
  Name: string;
  Contact: string;
  Email: string;
  Address: string;
  Last_Ordered_Date: string;
  Total_Orders: number;
  Total_Spent: number;
  Status: "Active" | "Inactive";
  Registration_Date: string;
}

interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

// Mock API
class CustomerAPI {
  private static delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  private static mockData: CustomerItem[] = [
    {
      Customer_ID: 1,
      Name: "Ahmed Ali",
      Contact: "03001234567",
      Email: "ahmed.ali@gmail.com",
      Address: "123 Main Street, Lahore",
      Last_Ordered_Date: "2025-08-15",
      Total_Orders: 12,
      Total_Spent: 2500,
      Status: "Active",
      Registration_Date: "2024-01-15",
    },
    {
      Customer_ID: 2,
      Name: "Fatima Khan",
      Contact: "03009876543",
      Email: "fatima.khan@gmail.com",
      Address: "456 Park Avenue, Karachi",
      Last_Ordered_Date: "2025-08-10",
      Total_Orders: 8,
      Total_Spent: 1800,
      Status: "Active",
      Registration_Date: "2024-02-20",
    },
    {
      Customer_ID: 3,
      Name: "Muhammad Hassan",
      Contact: "03001111111",
      Email: "hassan@gmail.com",
      Address: "789 Garden Road, Islamabad",
      Last_Ordered_Date: "2025-07-28",
      Total_Orders: 15,
      Total_Spent: 3200,
      Status: "Active",
      Registration_Date: "2023-12-10",
    },
    {
      Customer_ID: 4,
      Name: "Ayesha Malik",
      Contact: "03002222222",
      Email: "ayesha.malik@gmail.com",
      Address: "321 Business District, Lahore",
      Last_Ordered_Date: "2025-06-15",
      Total_Orders: 3,
      Total_Spent: 450,
      Status: "Inactive",
      Registration_Date: "2024-05-08",
    },
    {
      Customer_ID: 5,
      Name: "Omar Farooq",
      Contact: "03003333333",
      Email: "omar.farooq@gmail.com",
      Address: "555 University Road, Lahore",
      Last_Ordered_Date: "2025-08-18",
      Total_Orders: 20,
      Total_Spent: 4500,
      Status: "Active",
      Registration_Date: "2023-11-22",
    },
    {
      Customer_ID: 6,
      Name: "Zara Sheikh",
      Contact: "03004444444",
      Email: "zara.sheikh@gmail.com",
      Address: "777 Mall Road, Rawalpindi",
      Last_Ordered_Date: "2025-05-20",
      Total_Orders: 5,
      Total_Spent: 890,
      Status: "Inactive",
      Registration_Date: "2024-03-12",
    },
  ];

  static async getCustomerItems(): Promise<ApiResponse<CustomerItem[]>> {
    await this.delay(800);
    return {
      success: true,
      data: [...this.mockData],
      message: "Customer items fetched successfully",
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

const CustomerManagementPage = () => {
  const [customerItems, setCustomerItems] = useState<CustomerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [statusFilter, setStatusFilter] = useState<"" | "Active" | "Inactive">(
    ""
  );

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
    loadCustomerItems();
  }, []);

  const showToast = (message: string, type: "success" | "error") =>
    setToast({ message, type });

  const loadCustomerItems = async () => {
    try {
      setLoading(true);
      const response = await CustomerAPI.getCustomerItems();
      if (!response.success) throw new Error(response.message);
      setCustomerItems(response.data);
    } catch {
      showToast("Failed to load customer items", "error");
    } finally {
      setLoading(false);
    }
  };

  // Memoized filtering
  const filteredItems = useMemo(() => {
    const s = searchTerm.toLowerCase();
    return customerItems.filter((item) => {
      const matchesSearch =
        item.Name.toLowerCase().includes(s) ||
        item.Contact.toLowerCase().includes(s) ||
        item.Email.toLowerCase().includes(s) ||
        item.Address.toLowerCase().includes(s) ||
        item.Customer_ID.toString().includes(s);
      const matchesStatus = statusFilter ? item.Status === statusFilter : true;
      return matchesSearch && matchesStatus;
    });
  }, [customerItems, searchTerm, statusFilter]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-b-2 border-yellow-600 rounded-full mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading Customer Management...</p>
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

      <h1 className="text-3xl font-semibold mb-4 pl-20">Customer Management</h1>

      {/* Summary Cards */}
      <div className="flex gap-4 mb-6 pl-20">
        <div className="flex items-center justify-start flex-1 gap-2 max-w-[300px] min-h-[100px] rounded-md p-4 bg-white shadow-sm">
          <div>
            <p className="text-6xl mb-1">{customerItems.length}</p>
            <p className="text-1xl text-gray-500">Total Customers</p>
          </div>
        </div>

        <div className="flex items-center justify-start flex-1 gap-2 max-w-[300px] min-h-[100px] rounded-md p-4 bg-white shadow-sm">
          <div>
            <p className="text-6xl mb-1">
              {customerItems.filter((item) => item.Status === "Active").length}
            </p>
            <p className="text-1xl text-gray-500">Active Customers</p>
          </div>
        </div>
      </div>

      <div className="mb-6 pl-20 flex items-center justify-between gap-4 flex-wrap">
        {/* Search Bar */}
        <div className="relative flex-1 min-w-[200px]">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={16}
          />
          <input
            type="text"
            placeholder="Search customers..."
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
                <th className="relative px-4 py-3 text-left">
                  Customer ID
                </th>
                <th className="relative px-4 py-3 text-left">
                  Name
                  <span className="absolute left-0 top-[15%] h-[70%] w-[2px] bg-[#d9d9e1]"></span>
                </th>
                <th className="relative px-4 py-3 text-left">
                  Contact
                  <span className="absolute left-0 top-[15%] h-[70%] w-[1.5px] bg-[#d9d9e1]"></span>
                </th>
                <th className="relative px-4 py-3 text-left">
                  Email
                  <span className="absolute left-0 top-[15%] h-[70%] w-[2px] bg-[#d9d9e1]"></span>
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
                    <span className="absolute left-0 top-[15%] h-[70%] w-[1.5px] bg-[#d9d9e1]"></span>
                  </div>
                </th>
                <th className="relative px-4 py-3 text-left">
                  Last Ordered Date
                  <span className="absolute left-0 top-[15%] h-[70%] w-[2px] bg-[#d9d9e1]"></span>
                </th>
                <th className="relative px-4 py-3 text-left">
                  Total Orders
                  <span className="absolute left-0 top-[15%] h-[70%] w-[1.5px] bg-[#d9d9e1]"></span>
                </th>
                <th className="relative px-4 py-3 text-left">
                  Total Spent
                  <span className="absolute left-0 top-[15%] h-[70%] w-[2px] bg-[#d9d9e1]"></span>
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
                    {searchTerm || statusFilter
                      ? "No customers match your search criteria."
                      : "No customers found."}
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr key={item.Customer_ID} className="bg-white hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                      {`#${String(item.Customer_ID).padStart(3, "0")}`}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                      {item.Name}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                      {item.Contact}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                      {item.Email}
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
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                      {item.Last_Ordered_Date}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                      {item.Total_Orders}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                      PKR {item.Total_Spent.toLocaleString()}
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

export default CustomerManagementPage;