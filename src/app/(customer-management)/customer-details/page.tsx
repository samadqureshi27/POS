// app/customers-details/page.tsx
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { ChevronDown, Search, AlertCircle, CheckCircle, X, Star, Download, Upload, Trophy } from "lucide-react";
import { useRouter } from 'next/navigation'; // Next.js 13+ App Router
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

// Types
interface CustomerItem {
  Customer_ID: number;
  Name: string;
  Contact: string;
  Email: string;
  Address: string;
  Feedback_Rating: number;
  Total_Orders: number;
  Birthdate: string;
  Device :"Google Pay" | "Apple Pay"
  Registration_Date: string;
  Profile_Creation_Date: string;
}
interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

// Mock API (same as before)
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
      Feedback_Rating: 5,
      Total_Orders: 12,
      Birthdate: "09/13/1995",
      Registration_Date: "2024-01-15",
      Profile_Creation_Date: "01/15/2024 09:30",
      Device:"Apple Pay"
    },
    {
      Customer_ID: 2,
      Name: "Fatima Khan",
      Contact: "03009876543",
      Email: "fatima.khan@gmail.com",
      Address: "456 Park Avenue, Karachi",
      Feedback_Rating: 4,
      Total_Orders: 8,
      Birthdate: "05/22/1988",
      Registration_Date: "2024-02-20",
      Profile_Creation_Date: "02/20/2024 14:45",
      Device:"Apple Pay"
    },
    {
      Customer_ID: 3,
      Name: "Muhammad Hassan",
      Contact: "03001111111",
      Email: "hassan@gmail.com",
      Address: "789 Garden Road, Islamabad",
      Feedback_Rating: 3,
      Total_Orders: 15,
      Birthdate: "12/08/1992",
      Registration_Date: "2023-12-10",
      Profile_Creation_Date: "12/10/2023 11:20",
      Device:"Apple Pay"
    },
    {
      Customer_ID: 12,
      Name: "Mariam Qureshi",
      Contact: "03001010101",
      Email: "mariam.qureshi@yahoo.com",
      Address: "112 F-6 Sector, Islamabad",
      Feedback_Rating: 5,
      Total_Orders: 18,
      Birthdate: "04/07/1989",
      Registration_Date: "2023-10-30",
      Profile_Creation_Date: "10/30/2023 11:55",
      Device: "Google Pay"
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

// Profile Picture Component
const ProfilePicture = ({ name, size = "small" }: { name: string; size?: "small" | "large" }) => {
  const getInitials = (fullName: string) => {
    const names = fullName.split(' ');
    if (names.length >= 2) {
      return names[0][0] + names[1][0];
    }
    return names[0][0] + (names[0][1] || '');
  };

  const sizeClasses = size === "large" ? "w-12 h-12 text-lg" : "w-10 h-10 text-base font-light";

  return (
    <div className={`${sizeClasses} bg-[#2c2c2c] rounded-full flex items-center justify-center text-white`}>
      {getInitials(name).toUpperCase()}
    </div>
  );
};

// Star Rating Component
const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={14}
          className={
            star <= rating
              ? "text-yellow-400 fill-yellow-400"
              : "text-gray-300"
          }
        />
      ))}
    </div>
  );
};

// Large Star Rating Component
const LargeStarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex items-center justify-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={32}
          className={
            star <= rating
              ? "text-yellow-400 fill-yellow-400"
              : "text-gray-300"
          }
        />
      ))}
    </div>
  );
};

// Main Customer Management Page Component
const CustomerManagementPage = () => {
  const router = useRouter(); // Next.js App Router hook

  const [customerItems, setCustomerItems] = useState<CustomerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

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

  // FIXED: Handle customer row click - Navigate to dynamic route
  const handleCustomerClick = (customerId: number) => {
    console.log('Navigating to customer ID:', customerId); // Debug log
    router.push(`/customer-details/${customerId}`);
  };

  // Memoized filtering
  const filteredItems = useMemo(() => {
    const s = searchTerm.toLowerCase();
    return customerItems.filter((item) => {
      const matchesSearch =
      item.Device.toLowerCase().includes(s) ||
        item.Name.toLowerCase().includes(s) ||
        item.Contact.toLowerCase().includes(s) ||
        item.Email.toLowerCase().includes(s) ||
        item.Address.toLowerCase().includes(s) ||
        item.Birthdate.toLowerCase().includes(s) ||
        item.Customer_ID.toString().includes(s);
      return matchesSearch;
    });
  }, [customerItems, searchTerm]);

  // Calculate average rating
  const averageRating = useMemo(() => {
    if (customerItems.length === 0) return 0;
    const total = customerItems.reduce((sum, item) => sum + item.Feedback_Rating, 0);
    return total / customerItems.length;
  }, [customerItems]);

  // Find best customer (highest rating, then highest orders as tiebreaker)
  const bestCustomer = useMemo(() => {
    if (customerItems.length === 0) return null;

    return customerItems.reduce((best, current) => {
      if (current.Feedback_Rating > best.Feedback_Rating) {
        return current;
      }
      if (current.Feedback_Rating === best.Feedback_Rating && current.Total_Orders > best.Total_Orders) {
        return current;
      }
      return best;
    });
  }, [customerItems]);

  // Export functionality
  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8,"
      + "Customer ID,Name,Contact,Email,Address,Feedback Rating,Total Orders,Birthdate,Registration Date,Profile Creation Date\n"
      + customerItems.map(item =>
        `${item.Customer_ID},"${item.Name}","${item.Contact}","${item.Email}","${item.Address}",${item.Feedback_Rating},${item.Total_Orders},${item.Device},"${item.Birthdate}","${item.Registration_Date}","${item.Profile_Creation_Date}"`
      ).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "customers_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast("Data exported successfully", "success");
  };

  // Import functionality
  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const lines = content.split('\n');
        const headers = lines[0].split(',');

        if (headers.length < 5) {
          showToast("Invalid file format", "error");
          return;
        }

        showToast("Data imported successfully", "success");
        event.target.value = '';
      } catch (error) {
        showToast("Error importing file", "error");
      }
    };
    reader.readAsText(file);
  };

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
    <div className="bg-gray-50 min-h-screen">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 items-center max-w-[100vw] mb-8 mt-2">
        <h1 className="text-3xl font-semibold">Loyal Customers</h1>

        {/* Import/Export Buttons */}
        <div className="flex gap-4 justify-start md:justify-end mt-4 md:mt-0">
          <label className="flex items-center gap-2 px-4 py-2 bg-[#2C2C2C] text-white rounded-md cursor-pointer hover:bg-gray-700 transition-colors">
            <Upload size={16} />
            Import
            <input
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleImport}
              className="hidden"
            />
          </label>

          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-[#2C2C2C] text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            <Download size={16} />
            Export
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1   md:grid-cols-2 lg:grid-cols-4  gap-4 mb-8 max-w-[100vw]">
        <div className="flex items-center justify-start gap-2 min-h-[100px] border border-gray-300 rounded-sm p-4 bg-white shadow-sm">
          <div>
            <p className="text-6xl mb-1">{customerItems.length}</p>
            <p className="text-1xl text-gray-500">Total Customers</p>
          </div>
        </div>

        <div className="flex items-center justify-start gap-2 min-h-[100px] border border-gray-300 rounded-sm p-4 bg-white shadow-sm">
          <div>
            <p className="text-6xl mb-1">
              {customerItems.reduce((total, item) => total + item.Total_Orders, 0)}
            </p>
            <p className="text-1xl text-gray-500">Total Orders</p>
          </div>
        </div>

        <div className="flex items-center justify-start gap-2 min-h-[100px] border border-gray-300 rounded-sm p-4 bg-white shadow-sm">
          <div className="w-full">
            {bestCustomer ? (
              <div className="flex items-center gap-3 mb-2">
                <ProfilePicture name={bestCustomer.Name} size="large" />
                <div className="flex-1">
                  <p className="text-lg font-semibold text-gray-800 truncate" title={bestCustomer.Name}>
                    {bestCustomer.Name}
                  </p>
                  <div className="flex items-center gap-2">
                    <StarRating rating={bestCustomer.Feedback_Rating} />
                    <span className="text-sm text-gray-500">({bestCustomer.Total_Orders} orders)</span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-2xl mb-1">-</p>
            )}
            <p className="text-1xl text-gray-500">Best Customer</p>
          </div>
        </div>

        <div className="flex items-center justify-start min-h-[100px] border border-gray-300 rounded-sm p-4 bg-white shadow-sm">
          <div>
            <div className="flex items-center justify-start mb-2">
              <LargeStarRating rating={Math.round(averageRating)} />
              
            </div>
            <p className="text-1xl text-gray-500">Avg. Feedback Rating <span className="text-xl  text-gray-500">({averageRating})</span></p>
            
          </div>
        </div>
      </div>

      <div className="mb-6 flex items-center justify-between gap-4 flex-wrap">
        {/* Search Bar */}
        <div className="relative flex-1 min-w-[150px] max-w-[100vw]">
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
      <div className="bg-gray-50 md:bg-gray-50 rounded-sm border border-gray-300 max-w-[100vw] shadow-sm overflow-x-auto responsive-customer-table">
        <div className="table-container">
          <table className="min-w-full divide-y divide-gray-200 table-fixed">
            <thead className="bg-white border-b text-gray-500 border-gray-200 py-50 sticky top-0 z-10">
              <tr>
                
                <th className="relative px-4 py-3 py-6 text-left w-40">
                  Name
                  
                </th>
                <th className="relative px-4 py-3 text-left w-36">
                  Contact
                  <span className="absolute left-0 top-[15%] h-[70%] w-[1.5px] bg-gray-300"></span>
                </th>
                <th className="relative px-4 py-3 text-left w-52">
                  Email
                  <span className="absolute left-0 top-[15%] h-[70%] w-[1.5px] bg-gray-300"></span>
                </th>
                <th className="relative px-4 py-3 text-left w-36">
                  Feedback Rating
                  <span className="absolute left-0 top-[15%] h-[70%] w-[1.5px] bg-gray-300"></span>
                </th>
                <th className="relative px-4 py-3 text-left w-28">
                  Total Orders
                  <span className="absolute left-0 top-[15%] h-[70%] w-[1.5px] bg-gray-300"></span>
                </th>
                <th className="relative px-4 py-3 text-left w-28">
                  Birthdate
                  <span className="absolute left-0 top-[15%] h-[70%] w-[1.5px] bg-gray-300"></span>
                </th>
                <th className="relative px-4 py-3 text-left w-44">
                  Profile Created
                  <span className="absolute left-0 top-[15%] h-[70%] w-[1.5px] bg-gray-300"></span>
                </th>
                <th className="relative px-4 py-3 text-left w-44">
                  Device
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
                      ? "No customers match your search criteria."
                      : "No customers found."}
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr
                    key={item.Customer_ID}
                    onClick={() => handleCustomerClick(item.Customer_ID)}
                    className="bg-white hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    
                    
                    <td className="px-4 py-8 whitespace-nowrap text-sm card-name-cell" data-label="Name">
                      <div className="name-content flex items-center gap-2">
                        <ProfilePicture name={item.Name} />
                        <span className="font-medium">{item.Name}</span>
                      </div>
                    </td>

                    <td className="px-4 py-4 whitespace-nowrap text-sm" data-label="Contact">
                      {item.Contact}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm" data-label="Email">
                      {item.Email}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap card-rating-cell" data-label="Feedback Rating">
                      <div className="rating-content">
                        <StarRating rating={item.Feedback_Rating} />
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm" data-label="Total Orders">
                      {item.Total_Orders}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm" data-label="Birthdate">
                      {item.Birthdate}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm" data-label="Profile Created">
                      {item.Profile_Creation_Date}
                    </td>
                    <td className="px-4 text-black py-4 whitespace-nowrap text-sm" data-label="Device">
                      {item.Device}
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