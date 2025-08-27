"use client";

import React, { useState, useEffect, useMemo } from "react";
import { ChevronDown, Search, AlertCircle, CheckCircle, X, Star, Download, Upload } from "lucide-react";
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
  Registration_Date: string;
  Profile_Creation_Date: string;
}

interface OrderItem {
  Order_ID: string;
  Order_Number: string;
  Type: "Dine in" | "Takeaway" | "Delivery";
  Date: string;
  Total: number;
  Status: "Completed" | "Pending" | "Cancelled";
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
      Feedback_Rating: 5,
      Total_Orders: 12,
      Birthdate: "09/13/1995",
      Registration_Date: "2024-01-15",
      Profile_Creation_Date: "01/15/2024 09:30",
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
    },
    {
      Customer_ID: 4,
      Name: "Ayesha Malik",
      Contact: "03002222222",
      Email: "ayesha.malik@gmail.com",
      Address: "321 Business District, Lahore",
      Feedback_Rating: 2,
      Total_Orders: 3,
      Birthdate: "03/17/2000",
      Registration_Date: "2024-05-08",
      Profile_Creation_Date: "05/08/2024 16:12",
    },
    {
      Customer_ID: 5,
      Name: "Omar Farooq",
      Contact: "03003333333",
      Email: "omar.farooq@gmail.com",
      Address: "555 University Road, Lahore",
      Feedback_Rating: 5,
      Total_Orders: 20,
      Birthdate: "09/13/2002",
      Registration_Date: "2023-11-22",
      Profile_Creation_Date: "11/22/2023 08:15",
    },
    {
      Customer_ID: 6,
      Name: "Zara Sheikh",
      Contact: "03004444444",
      Email: "zara.sheikh@gmail.com",
      Address: "777 Mall Road, Rawalpindi",
      Feedback_Rating: 1,
      Total_Orders: 5,
      Birthdate: "07/30/1985",
      Registration_Date: "2024-03-12",
      Profile_Creation_Date: "08/26/2025 13:34",
    },
    {
      Customer_ID: 7,
      Name: "Ali Raza",
      Contact: "03005555555",
      Email: "ali.raza@yahoo.com",
      Address: "101 Canal Bank, Faisalabad",
      Feedback_Rating: 4,
      Total_Orders: 9,
      Birthdate: "11/25/1990",
      Registration_Date: "2024-04-18",
      Profile_Creation_Date: "04/18/2024 10:22",
    },
    {
      Customer_ID: 8,
      Name: "Sana Tariq",
      Contact: "03006666666",
      Email: "sana.tariq@hotmail.com",
      Address: "88 Liberty Market, Lahore",
      Feedback_Rating: 5,
      Total_Orders: 14,
      Birthdate: "02/14/1996",
      Registration_Date: "2023-09-05",
      Profile_Creation_Date: "09/05/2023 15:18",
    },
    {
      Customer_ID: 9,
      Name: "Bilal Ahmed",
      Contact: "03007777777",
      Email: "bilal.ahmed@gmail.com",
      Address: "67 Model Town, Multan",
      Feedback_Rating: 3,
      Total_Orders: 6,
      Birthdate: "08/03/1987",
      Registration_Date: "2024-06-12",
      Profile_Creation_Date: "06/12/2024 12:45",
    },
    {
      Customer_ID: 10,
      Name: "Rabia Noor",
      Contact: "03008888888",
      Email: "rabia.noor@outlook.com",
      Address: "234 Satellite Town, Gujranwala",
      Feedback_Rating: 2,
      Total_Orders: 4,
      Birthdate: "06/18/1993",
      Registration_Date: "2024-07-20",
      Profile_Creation_Date: "07/20/2024 09:33",
    },
    {
      Customer_ID: 11,
      Name: "Hamza Shah",
      Contact: "03009999999",
      Email: "hamza.shah@gmail.com",
      Address: "445 DHA Phase 2, Karachi",
      Feedback_Rating: 4,
      Total_Orders: 11,
      Birthdate: "10/12/1994",
      Registration_Date: "2023-08-14",
      Profile_Creation_Date: "08/14/2023 16:28",
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
    },
    {
      Customer_ID: 13,
      Name: "Usman Malik",
      Contact: "03002020202",
      Email: "usman.malik@hotmail.com",
      Address: "67 Johar Town, Lahore",
      Feedback_Rating: 3,
      Total_Orders: 7,
      Birthdate: "01/22/1991",
      Registration_Date: "2024-03-25",
      Profile_Creation_Date: "03/25/2024 14:12",
    },
    {
      Customer_ID: 14,
      Name: "Khadija Riaz",
      Contact: "03003030303",
      Email: "khadija.riaz@gmail.com",
      Address: "299 Gulshan Colony, Sialkot",
      Feedback_Rating: 1,
      Total_Orders: 2,
      Birthdate: "12/01/1998",
      Registration_Date: "2024-08-05",
      Profile_Creation_Date: "08/05/2024 17:40",
    },
    {
      Customer_ID: 15,
      Name: "Faisal Javed",
      Contact: "03004040404",
      Email: "faisal.javed@outlook.com",
      Address: "156 Cavalry Ground, Lahore",
      Feedback_Rating: 4,
      Total_Orders: 13,
      Birthdate: "09/15/1986",
      Registration_Date: "2023-12-22",
      Profile_Creation_Date: "12/22/2023 08:25",
    }
  ];

  private static mockOrders: OrderItem[] = [
    {
      Order_ID: "ORD001",
      Order_Number: "12345",
      Type: "Dine in",
      Date: "2024-08-25",
      Total: 850,
      Status: "Completed",
    },
    {
      Order_ID: "ORD002",
      Order_Number: "12346",
      Type: "Takeaway",
      Date: "2024-08-20",
      Total: 1200,
      Status: "Completed",
    },
    {
      Order_ID: "ORD003",
      Order_Number: "12347",
      Type: "Delivery",
      Date: "2024-08-15",
      Total: 750,
      Status: "Completed",
    },
    {
      Order_ID: "ORD004",
      Order_Number: "12348",
      Type: "Dine in",
      Date: "2024-08-10",
      Total: 950,
      Status: "Completed",
    },
    {
      Order_ID: "ORD005",
      Order_Number: "12349",
      Type: "Takeaway",
      Date: "2024-08-05",
      Total: 650,
      Status: "Pending",
    },
    {
      Order_ID: "ORD006",
      Order_Number: "12350",
      Type: "Delivery",
      Date: "2024-08-01",
      Total: 900,
      Status: "Cancelled",
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

  static async getCustomerById(id: number): Promise<ApiResponse<CustomerItem>> {
    await this.delay(500);
    const customer = this.mockData.find(c => c.Customer_ID === id);
    if (!customer) {
      return {
        success: false,
        data: {} as CustomerItem,
        message: "Customer not found",
      };
    }
    return {
      success: true,
      data: customer,
      message: "Customer details fetched successfully",
    };
  }

  static async getCustomerOrders(customerId: number): Promise<ApiResponse<OrderItem[]>> {
    await this.delay(600);
    return {
      success: true,
      data: [...this.mockOrders],
      message: "Customer orders fetched successfully",
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

// Star Rating Component for table
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

// Large Star Rating Component for summary tile
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

// Navigation functions for different routing approaches
const NavigationHelpers = {
  // Option 1: Using Next.js router (most common)
  navigateWithNextRouter: (customerId: number) => {
    // Uncomment this if you're using Next.js
    // const router = useRouter();
    // router.push(`/customer/${customerId}`);
    console.log(`Navigate to /customer/${customerId} using Next.js router`);
    alert(`This would navigate to /customer/${customerId} using Next.js router`);
  },

  // Option 2: Using React Router
  navigateWithReactRouter: (customerId: number) => {
    // Uncomment this if you're using React Router
    // const navigate = useNavigate();
    // navigate(`/customer/${customerId}`);
    console.log(`Navigate to /customer/${customerId} using React Router`);
    alert(`This would navigate to /customer/${customerId} using React Router`);
  },

  // Option 3: Using window.location (vanilla approach)
  navigateWithWindowLocation: (customerId: number) => {
    window.location.href = `/customer/${customerId}`;
  },

  // Option 4: Opening in new tab/window
  openInNewTab: (customerId: number) => {
    window.open(`/customer/${customerId}`, '_blank');
  },

  // Option 5: Using History API
  navigateWithHistoryAPI: (customerId: number) => {
    window.history.pushState({}, '', `/customer/${customerId}`);
    // You would also need to trigger a page reload or component re-render
    window.location.reload();
  }
};

// Main Customer Management Page Component
const CustomerManagementPage = () => {
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

  // Handle customer row click - Updated to use different navigation methods
  const handleCustomerClick = (customerId: number) => {
    // Choose one of these navigation methods based on your routing setup:
    
    // Option 1: Next.js Router (recommended for Next.js apps)
    NavigationHelpers.navigateWithNextRouter(customerId);
    
    // Option 2: React Router (recommended for React Router apps)
    // NavigationHelpers.navigateWithReactRouter(customerId);
    
    // Option 3: Window location (works anywhere)
    // NavigationHelpers.navigateWithWindowLocation(customerId);
    
    // Option 4: Open in new tab
    // NavigationHelpers.openInNewTab(customerId);
    
    // Option 5: History API
    // NavigationHelpers.navigateWithHistoryAPI(customerId);
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

  // Export functionality
  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8,"
      + "Customer ID,Name,Contact,Email,Address,Feedback Rating,Total Orders,Birthdate,Registration Date,Profile Creation Date\n"
      + customerItems.map(item =>
        `${item.Customer_ID},"${item.Name}","${item.Contact}","${item.Email}","${item.Address}",${item.Feedback_Rating},${item.Total_Orders},"${item.Birthdate}","${item.Registration_Date}","${item.Profile_Creation_Date}"`
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
    <div className="p-6 bg-gray-50 min-h-screen">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 items-center mb-8 mt-20">
        <h1 className="text-3xl font-semibold">Loyal Customers</h1>

        {/* Import/Export Buttons - Right side on larger screens */}
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 max-w-[95vw]">
        <div className="flex items-center justify-start gap-2 min-h-[100px] border border-gray-300 rounded-sm p-4 bg-white shadow-sm">
          <div>
            <p className="text-6xl mb-1">{customerItems.length}</p>
            <p className="text-1xl text-gray-500">Total Customers</p>
          </div>
        </div>

        <div className="flex items-center justify-start gap-2 min-h-[100px] border border-gray-300 rounded-sm p-4 bg-white shadow-sm">
          <div>
            <p className="text-6xl mb-1">{customerItems.length}</p>
            <p className="text-1xl text-gray-500">Active Customers</p>
          </div>
        </div>

        <div className="flex items-center justify-start min-h-[100px] border border-gray-300 rounded-sm p-4 bg-white shadow-sm">
          <div>
            <div className="flex items-center justify-start mb-2">
              <LargeStarRating rating={Math.round(averageRating)} />
            </div>
            <p className="text-1xl text-gray-500">Avg. Feedback Rating</p>
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
      </div>

      <div className="mb-6 flex items-center justify-between gap-4 flex-wrap">
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

      {/* Table */}
      <div className="bg-gray-50 rounded-sm border border-gray-300 max-w-[95vw] shadow-sm overflow-x-auto">
        <div className="rounded-sm">
          <table className="min-w-full divide-y divide-gray-200 table-fixed">
            <thead className="bg-white border-b text-gray-500 border-gray-200 py-50 sticky top-0 z-10">
              <tr>
                <th className="relative px-6 py-6 text-left w-24">Customer ID</th>
                <th className="relative px-4 py-3 text-left w-40">
                  Name
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
                    <td className="px-6 py-8 whitespace-nowrap text-sm">
                      {`#${String(item.Customer_ID).padStart(3, "0")}`}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-3">
                        <ProfilePicture name={item.Name} />
                        <span className="font-medium">{item.Name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                      {item.Contact}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                      {item.Email}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <StarRating rating={item.Feedback_Rating} />
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                      {item.Total_Orders}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                      {item.Birthdate}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                      {item.Profile_Creation_Date}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Navigation Instructions */}
      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-sm">
        <h3 className="text-lg font-semibold mb-2">Navigation Setup Instructions:</h3>
        <div className="space-y-2 text-sm">
          <p><strong>Current:</strong> Using demo alerts. Choose one of the following methods:</p>
          
          <div className="ml-4 space-y-1">
            <p><strong>1. Next.js:</strong> Uncomment useRouter import and router.push() in NavigationHelpers.navigateWithNextRouter</p>
            <p><strong>2. React Router:</strong> Uncomment useNavigate import and navigate() in NavigationHelpers.navigateWithReactRouter</p>
            <p><strong>3. Window Location:</strong> Use NavigationHelpers.navigateWithWindowLocation (works anywhere)</p>
            <p><strong>4. New Tab:</strong> Use NavigationHelpers.openInNewTab to open profile in new tab</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerManagementPage;