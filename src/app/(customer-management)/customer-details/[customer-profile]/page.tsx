// app/customers-details/[customer-profile]/page.tsx
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Search, ArrowLeft, Star, ChevronDown } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

// Types (same as before)
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
  Card_Status: "Active" | "Inactive";
}

interface OrderItem {
  Customer_fk_ID: number;
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

// Mock API - same as before but with debugging
class CustomerAPI {
  private static delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  private static mockCustomers: CustomerItem[] = [
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
      Card_Status: "Active",
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
      Card_Status: "Active",
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
      Card_Status: "Active",
    },
    {
      Customer_ID: 12,
      Name: "Mariam Qureshi",
      Contact: "03001010101",
      Email: "mariam.qureshi@yahoo.com",
      Address: "112 F-6 Sector, Islamabad",
      Feedback_Rating: 5,
      Total_Orders: 25,
      Birthdate: "03/15/1990",
      Registration_Date: "2022-01-15",
      Profile_Creation_Date: "01/15/2022 10:30",
      Card_Status: "Inactive",
    },
  ];

  private static mockOrders: { [customerId: number]: OrderItem[] } = {
    1: [
      {
        Customer_fk_ID: 1,
        Order_ID: "ORD001",
        Order_Number: "12345",
        Type: "Dine in",
        Date: "2024-08-25",
        Total: 850,
        Status: "Completed",
      },
      {
        Customer_fk_ID: 1,
        Order_ID: "ORD002",
        Order_Number: "12346",
        Type: "Takeaway",
        Date: "2024-08-20",
        Total: 1200,
        Status: "Completed",
      },
    ],
    2: [
      {
        Customer_fk_ID: 2,
        Order_ID: "ORD007",
        Order_Number: "12351",
        Type: "Delivery",
        Date: "2024-08-22",
        Total: 650,
        Status: "Pending",
      },
    ],
    3: [
      {
        Customer_fk_ID: 3,
        Order_ID: "ORD008",
        Order_Number: "12352",
        Type: "Dine in",
        Date: "2024-08-18",
        Total: 1100,
        Status: "Completed",
      },
    ],
    12: [
      {
        Customer_fk_ID: 12,
        Order_ID: "ORD001",
        Order_Number: "12345",
        Type: "Dine in",
        Date: "2024-08-25",
        Total: 850,
        Status: "Completed",
      },
      {
        Customer_fk_ID: 12,
        Order_ID: "ORD002",
        Order_Number: "12346",
        Type: "Takeaway",
        Date: "2024-08-20",
        Total: 1200,
        Status: "Completed",
      },
      {
        Customer_fk_ID: 12,
        Order_ID: "ORD003",
        Order_Number: "12347",
        Type: "Delivery",
        Date: "2024-08-15",
        Total: 750,
        Status: "Completed",
      },
      {
        Customer_fk_ID: 12,
        Order_ID: "ORD004",
        Order_Number: "12348",
        Type: "Dine in",
        Date: "2024-08-10",
        Total: 950,
        Status: "Completed",
      },
      {
        Customer_fk_ID: 12,
        Order_ID: "ORD005",
        Order_Number: "12349",
        Type: "Takeaway",
        Date: "2024-08-05",
        Total: 650,
        Status: "Pending",
      },
      {
        Customer_fk_ID: 12,
        Order_ID: "ORD006",
        Order_Number: "12350",
        Type: "Delivery",
        Date: "2024-08-01",
        Total: 900,
        Status: "Cancelled",
      },
    ],
  };

  static async getCustomerById(id: number): Promise<ApiResponse<CustomerItem>> {
    await this.delay(500);
    console.log(`Looking for customer with ID: ${id}`); // Debug log
    const customer = this.mockCustomers.find((c) => c.Customer_ID === id);

    if (!customer) {
      console.log(`Customer with ID ${id} not found`); // Debug log
      return {
        success: false,
        data: {} as CustomerItem,
        message: "Customer not found",
      };
    }

    console.log(`Found customer:`, customer); // Debug log
    return {
      success: true,
      data: customer,
      message: "Customer details fetched successfully",
    };
  }

  static async getCustomerOrders(
    customerId: number
  ): Promise<ApiResponse<OrderItem[]>> {
    await this.delay(600);
    const orders = this.mockOrders[customerId] || [];
    console.log(`Orders for customer ${customerId}:`, orders); // Debug log
    return {
      success: true,
      data: orders,
      message: "Customer orders fetched successfully",
    };
  }
}

// Profile Picture Component
const ProfilePicture = ({
  name,
  size = "large",
}: {
  name: string;
  size?: "small" | "large";
}) => {
  const getInitials = (fullName: string) => {
    const names = fullName.split(" ");
    if (names.length >= 2) {
      return names[0][0] + names[1][0];
    }
    return names[0][0] + (names[0][1] || "");
  };

  const sizeClasses =
    size === "large" ? "w-12 h-12 text-lg" : "w-10 h-10 text-base font-light";

  return (
    <div
      className={`${sizeClasses} bg-[#2c2c2c] rounded-full flex items-center justify-center text-white`}
    >
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
            star <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
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
            star <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
          }
        />
      ))}
    </div>
  );
};

const CustomerProfilePage = () => {
  const params = useParams();
  const router = useRouter();

  const [customer, setCustomer] = useState<CustomerItem | null>(null);
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // FIXED: Access the parameter using the folder name 'customer-profile'
  const customerId = React.useMemo(() => {
    const param = params["customer-profile"];
    console.log("Raw param:", param, "Type:", typeof param); // Debug log

    if (!param) {
      console.log("No customer-profile param found");
      return null;
    }

    const id = parseInt(param as string);
    console.log("Parsed customer ID:", id); // Debug log
    return isNaN(id) ? null : id;
  }, [params]);

  useEffect(() => {
    console.log("Effect triggered, customerId:", customerId); // Debug log

    if (customerId !== null) {
      loadCustomerData(customerId);
    } else {
      setError("Invalid customer ID");
      setLoading(false);
    }
  }, [customerId]);

  const loadCustomerData = async (id: number) => {
    try {
      console.log(`Loading data for customer ID: ${id}`); // Debug log
      setLoading(true);
      setError(null);

      const [customerResponse, ordersResponse] = await Promise.all([
        CustomerAPI.getCustomerById(id),
        CustomerAPI.getCustomerOrders(id),
      ]);

      console.log("Customer response:", customerResponse); // Debug log
      console.log("Orders response:", ordersResponse); // Debug log

      if (customerResponse.success) {
        setCustomer(customerResponse.data);
      } else {
        setError(customerResponse.message || "Customer not found");
      }

      if (ordersResponse.success) {
        setOrders(ordersResponse.data);
      }
    } catch (error) {
      console.error("Failed to load customer data", error);
      setError("Failed to load customer data");
    } finally {
      setLoading(false);
    }
  };

  const handleBackClick = () => {
    router.push("/customer-details");
  };

  // Calculate metrics
  const totalSpent = useMemo(() => {
    return orders.reduce((sum, order) => sum + order.Total, 0);
  }, [orders]);

  const averageOrderValue = useMemo(() => {
    return orders.length > 0 ? Math.round(totalSpent / orders.length) : 0;
  }, [totalSpent, orders.length]);

  // Filter orders
  const filteredOrders = useMemo(() => {
    let filtered = orders;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (order) =>
          order.Order_ID.toLowerCase().includes(term) ||
          order.Order_Number.toLowerCase().includes(term) ||
          order.Type.toLowerCase().includes(term)
      );
    }

    if (typeFilter) {
      filtered = filtered.filter((order) => order.Type === typeFilter);
    }

    if (statusFilter) {
      filtered = filtered.filter((order) => order.Status === statusFilter);
    }

    return filtered;
  }, [orders, searchTerm, typeFilter, statusFilter]);

  // Debug render
  console.log("Render state:", { customerId, loading, error, customer }); // Debug log

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-b-2 border-yellow-600 rounded-full mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading Customer Profile...</p>
          <p className="text-sm text-gray-400 mt-2">
            Customer ID: {customerId}
          </p>
        </div>
      </div>
    );
  }

  if (error || !customer) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600 text-lg mb-4">
            {error || "Customer not found"}
          </p>
          <p className="text-sm text-gray-400 mb-4">
            Customer ID: {customerId}
          </p>
          <button
            onClick={handleBackClick}
            className="px-4 py-2 bg-[#2C2C2C] text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            Back to Customers
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className=" bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8 mt-2">
        <button
          onClick={handleBackClick}
          className="p-2 hover:bg-gray-100 rounded-sm"
        >
          <ArrowLeft size={20} className="text-gray-600" />
        </button>
        <h1 className="text-3xl font-semibold">Customer Profile</h1>
        
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-1  lg:grid-cols-7 gap-6 mb-8 ">
        {/* Left Column - Customer Profile Card and Customer Feedback */}
        <div className="lg:col-span-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 lg:h-[450px]">
            {/* Left side - Customer Profile Card and Customer Feedback */}
            <div className="flex flex-col gap-4 h-full">
              {/* Customer Profile Card */}
              <div className="bg-white rounded-sm border border-gray-300 p-6 shadow-sm h-[294px]">
                <div className="flex items-center gap-4 mb-6">
                  <ProfilePicture name={customer.Name} size="large" />
                  <div>
                    <h3 className="text-xl font-semibold">{customer.Name}</h3>
                    <p className="text-gray-500 text-sm">{customer.Email}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <StarRating rating={customer.Feedback_Rating} />
                    </div>
                  </div>
                </div>

                <div className="space-y-4 text-base">
                  <div className="flex justify-between">
                    <span className="text-gray-500">ID:</span>
                    <span>
                      #{String(customer.Customer_ID).padStart(3, "0")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Contact:</span>
                    <span>{customer.Contact}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Address:</span>
                    <span className="text-right">{customer.Address}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Since:</span>
                    <span>{customer.Registration_Date}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Card Status:</span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium
      ${
        customer.Card_Status === "Active" ? " text-green-400" : " text-red-400"
      }`}
                    >
                      {customer.Card_Status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Customer Feedback Card */}
              <div className="bg-white rounded-sm border border-gray-300 p-6 shadow-sm flex items-center justify-start h-[140px]">
                <div className="text-start">
                  <div className="mb-3">
                    <LargeStarRating rating={customer.Feedback_Rating} />
                  </div>
                  <p className="text-base text-gray-500">Customer Feedback</p>
                </div>
              </div>
            </div>

            {/* Right side - Metrics */}
            <div className="flex  flex-col gap-4 h-full">
              {/* Total Orders */}
              <div className="bg-white rounded-sm border border-gray-300 p-6 shadow-sm flex items-center justify-start h-[140px]">
                <div className="text-start">
                  <p className="text-5xl font-bold mb-2">
                    {customer.Total_Orders}
                  </p>
                  <p className="text-base text-gray-500">Total Orders</p>
                </div>
              </div>

              {/* Total Spent */}
              <div className="bg-white rounded-sm border border-gray-300 p-6 shadow-sm flex items-center justify-start h-[140px]">
                <div className="text-start">
                  <p className="text-5xl font-bold mb-2">
                    {totalSpent.toLocaleString()}
                  </p>
                  <p className="text-base text-gray-500">Total Spent (PKR)</p>
                </div>
              </div>

              {/* Average Order Value */}
              <div className="bg-white rounded-sm border border-gray-300 p-6 shadow-sm flex items-center justify-start h-[140px]">
                <div className="text-start">
                  <p className="text-5xl font-bold mb-2">{averageOrderValue}</p>
                  <p className="text-base text-gray-500">
                    Avg Order Value (PKR)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Chart */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-sm border border-gray-300 p-6 shadow-sm h-[448px]">
            <h3 className="text-xl font-semibold mb-6">Order Spent</h3>
            <div className="h-[378px] bg-white rounded-sm p-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={orders}
                  margin={{ top: 20, right: 20, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="Date" />
                  <YAxis />
                  <Tooltip
                    formatter={(value: number) => value.toLocaleString()}
                  />
                  <Bar dataKey="Total" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Order History Section */}
      <div className="space-y-6">
        {/* Order History Title */}
        <div className="bg-white rounded-sm border border-gray-300 p-6 mb-8 shadow-sm">
          <h3 className="text-2xl font-semibold">Order History</h3>
        </div>

        {/* Search Bar */}
        <div className="mb-8 flex items-center justify-between gap-4 flex-wrap">
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

        {/* Orders Table */}
        <div className="bg-gray-50 rounded-sm border border-gray-300 max-w-[100vw] shadow-sm overflow-x-auto responsive-customer-table">
          <div className="rounded-sm table-container">
            <table className="min-w-full divide-y divide-gray-200 table-fixed">
              <thead className="bg-white border-b text-gray-500 border-gray-200 py-50 sticky top-0 z-10">
                <tr>
                  <th className="relative px-6 py-6 text-left w-24">
                    Order ID
                  </th>
                  <th className="relative px-4 py-3 text-left w-40">
                    Order Number
                    <span className="absolute left-0 top-[15%] h-[70%] w-[1.5px] bg-gray-300"></span>
                  </th>
                  <th className="relative px-4 py-3 text-left w-36">
                    <div className="flex items-center gap-2">
                      <DropdownMenu.Root>
                        <DropdownMenu.Trigger className="px-2 py-1 rounded text-sm bg-transparent border-none outline-none hover:bg-transparent flex items-center gap-2 focus:outline-none focus:ring-0">
                          {typeFilter || "Type"}
                          <ChevronDown
                            size={14}
                            className="text-gray-500 ml-auto"
                          />
                        </DropdownMenu.Trigger>
                        <DropdownMenu.Portal>
                          <DropdownMenu.Content
                            className="min-w-[240px] rounded-md bg-white shadow-md border-none p-1 relative outline-none"
                            sideOffset={6}
                          >
                            <DropdownMenu.Arrow className="fill-white stroke-gray-200 w-5 h-3" />
                            <DropdownMenu.Item
                              className="px-3 py-1 text-sm cursor-pointer hover:bg-gray-100 rounded outline-none"
                              onClick={() => setTypeFilter("")}
                            >
                              Type
                            </DropdownMenu.Item>
                            {Array.from(
                              new Set(orders.map((order) => order.Type))
                            ).map((type) => (
                              <DropdownMenu.Item
                                key={type}
                                className="px-3 py-1 text-sm cursor-pointer hover:bg-blue-100 text-black rounded outline-none"
                                onClick={() => setTypeFilter(type)}
                              >
                                {type}
                              </DropdownMenu.Item>
                            ))}
                          </DropdownMenu.Content>
                        </DropdownMenu.Portal>
                      </DropdownMenu.Root>
                    </div>
                    <span className="absolute left-0 top-[15%] h-[70%] w-[1.5px] bg-gray-300"></span>
                  </th>
                  <th className="relative px-4 py-3 text-left w-32">
                    Date
                    <span className="absolute left-0 top-[15%] h-[70%] w-[1.5px] bg-gray-300"></span>
                  </th>
                  <th className="relative px-4 py-3 text-left w-36">
                    Total
                    <span className="absolute left-0 top-[15%] h-[70%] w-[1.5px] bg-gray-300"></span>
                  </th>
                  <th className="relative px-4 py-3 text-left w-32">
                    <div className="flex items-center gap-2">
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
                            {Array.from(
                              new Set(orders.map((order) => order.Status))
                            ).map((status) => (
                              <DropdownMenu.Item
                                key={status}
                                className={`px-3 py-1 text-sm cursor-pointer rounded outline-none ${
                                  status === "Completed"
                                    ? "hover:bg-green-100 text-green-400"
                                    : status === "Pending"
                                    ? "hover:bg-blue-100 text-blue-400"
                                    : "hover:bg-red-100 text-red-400"
                                }`}
                                onClick={() => setStatusFilter(status)}
                              >
                                {status}
                              </DropdownMenu.Item>
                            ))}
                          </DropdownMenu.Content>
                        </DropdownMenu.Portal>
                      </DropdownMenu.Root>
                    </div>
                    <span className="absolute left-0 top-[15%] h-[70%] w-[1.5px] bg-gray-300"></span>
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y text-gray-500 divide-gray-300">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-8 text-center text-gray-500"
                    >
                      {searchTerm || typeFilter || statusFilter
                        ? "No orders match your search criteria."
                        : "No orders found."}
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr
                      key={order.Order_ID}
                      className="bg-white hover:bg-gray-50"
                    >
                      <td className="px-6 py-8 whitespace-nowrap text-sm" data-label="ID">
                        {order.Order_ID}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm" data-label="Order Number">
                        {order.Order_Number}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap"data-label="Type" >
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            order.Type === "Dine in"
                              ? " text-yellow-400"
                              : order.Type === "Takeaway"
                              ? " text-green-400"
                              : " text-blue-400"
                          }`}
                        >
                          {order.Type}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm" data-label="Date">
                        {new Date(order.Date).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm" data-label="Total">
                        PKR {order.Total.toLocaleString()}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap" data-label="Status">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            order.Status === "Completed"
                              ? " text-green-400"
                              : order.Status === "Pending"
                              ? " text-blue-400"
                              : " text-red-400"
                          }`}
                        >
                          {order.Status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerProfilePage;
