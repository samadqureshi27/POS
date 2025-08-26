"use client";
import { ChevronDown } from "lucide-react";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import React, { useState, useEffect } from "react";
import ButtonPage from "@/components/layout/UI/button";
import {
  Plus,
  Trash2,
  Search,
  AlertCircle,
  CheckCircle,
  X,
  Edit,
  Save
} from "lucide-react";

interface PaymentMethod {
  ID: number;
  Name: string;
  PaymentType: "Cash" | "Card" | "Online";
  TaxType: string;
  TaxPercentage: number;
  Status: "Active" | "Inactive";
  CreatedDate: string;
  LastUsed: string;
}

interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

class PaymentAPI {
  private static delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  // Mock data for PaymentMethod
  private static mockData: PaymentMethod[] = [
    {
      ID: 1,
      Name: "Cash Payment",
      PaymentType: "Cash",
      TaxType: "GST",
      TaxPercentage: 16,
      Status: "Active",
      CreatedDate: "2024-01-15",
      LastUsed: "2024-08-20",
    },
    {
      ID: 2,
      Name: "Credit Card",
      PaymentType: "Card",
      TaxType: "GST",
      TaxPercentage: 16,
      Status: "Active",
      CreatedDate: "2024-01-15",
      LastUsed: "2024-08-21",
    },
    {
      ID: 3,
      Name: "Online Transfer",
      PaymentType: "Online",
      TaxType: "VAT",
      TaxPercentage: 5,
      Status: "Active",
      CreatedDate: "2024-02-01",
      LastUsed: "2024-08-19",
    },
    {
      ID: 4,
      Name: "Debit Card",
      PaymentType: "Card",
      TaxType: "GST",
      TaxPercentage: 16,
      Status: "Inactive",
      CreatedDate: "2024-03-10",
      LastUsed: "2024-07-15",
    },
    {
      ID: 5,
      Name: "Mobile Payment",
      PaymentType: "Online",
      TaxType: "Service Tax",
      TaxPercentage: 8,
      Status: "Active",
      CreatedDate: "2024-04-05",
      LastUsed: "2024-08-20",
    },
  ];

  // ✅ GET /api/payment-methods/
  static async getPaymentMethods(): Promise<ApiResponse<PaymentMethod[]>> {
    await this.delay(800);
    return {
      success: true,
      data: [...this.mockData],
      message: "Payment methods fetched successfully",
    };
  }

  // ✅ POST /api/payment-methods/
  static async createPaymentMethod(
    method: Omit<PaymentMethod, "ID">
  ): Promise<ApiResponse<PaymentMethod>> {
    await this.delay(1000);
    const newId = this.mockData.length > 0 ? Math.max(...this.mockData.map(i => i.ID)) + 1 : 1;
    const newMethod: PaymentMethod = {
      ...method,
      ID: newId,
    };
    this.mockData.push(newMethod);
    return {
      success: true,
      data: newMethod,
      message: "Payment method created successfully",
    };
  }

  // ✅ PUT /api/payment-methods/{id}/
  static async updatePaymentMethod(
    id: number,
    method: Partial<PaymentMethod>
  ): Promise<ApiResponse<PaymentMethod>> {
    await this.delay(800);
    const index = this.mockData.findIndex((i) => i.ID === id);
    if (index === -1) throw new Error("Payment method not found");

    this.mockData[index] = { ...this.mockData[index], ...method };
    return {
      success: true,
      data: this.mockData[index],
      message: "Payment method updated successfully",
    };
  }

  // ✅ DELETE /api/payment-methods/{id}/
  static async deletePaymentMethod(id: number): Promise<ApiResponse<null>> {
    await this.delay(600);
    const index = this.mockData.findIndex((i) => i.ID === id);
    if (index === -1) throw new Error("Payment method not found");

    this.mockData.splice(index, 1);

    // Reassign IDs sequentially
    this.mockData = this.mockData.map((item, idx) => ({
      ...item,
      ID: idx + 1,
    }));

    return {
      success: true,
      data: null,
      message: "Payment method deleted successfully",
    };
  }

  // ✅ DELETE /api/payment-methods/bulk-delete/
  static async bulkDeletePaymentMethod(
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
      message: `${ids.length} payment methods deleted successfully`,
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

const PaymentManagementPage = () => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"" | "Cash" | "Card" | "Online">("");
  const [taxTypeFilter, setTaxTypeFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [editingItem, setEditingItem] = useState<PaymentMethod | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);


  const [formData, setFormData] = useState<Omit<PaymentMethod, "ID">>({
    Name: "",
    PaymentType: "Cash",
    TaxType: "",
    TaxPercentage: 0,
    Status: "Active",
    CreatedDate: new Date().toISOString().split('T')[0],
    LastUsed: new Date().toISOString().split('T')[0],
  });

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // load payment methods on mount
  useEffect(() => {
    loadPaymentMethods();
  }, []);

  const loadPaymentMethods = async () => {
    try {
      setLoading(true);
      const response = await PaymentAPI.getPaymentMethods();
      if (response.success) {
        setPaymentMethods(response.data);
      } else {
        throw new Error(response.message || "Failed to fetch payment methods");
      }
    } catch (error) {
      console.error("Error fetching payment methods:", error);
      showToast("Failed to load payment methods", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (isActive: boolean) => {
    setFormData({
      ...formData,
      Status: isActive ? "Active" : "Inactive",
    });
  };
  // filter
  const filteredItems = paymentMethods.filter((item) => {
    const q = searchTerm.trim().toLowerCase();
    const matchesQuery =
      q === "" ||
      item.Name.toLowerCase().includes(q) ||
      item.ID.toString().includes(q) ||
      item.TaxType.toLowerCase().includes(q);
    const matchesStatus = statusFilter ? item.PaymentType === statusFilter : true;
    const matchesTaxType = taxTypeFilter ? item.TaxType === taxTypeFilter : true;
    return matchesQuery && matchesStatus && matchesTaxType;
  });

  // create
  const handleCreateItem = async (itemData: Omit<PaymentMethod, "ID">) => {
    try {
      setActionLoading(true);
      const response = await PaymentAPI.createPaymentMethod(itemData);
      if (response.success) {
        setPaymentMethods((prevItems) => [...prevItems, response.data]);
        setIsModalOpen(false);
        setSearchTerm("");
        showToast(response.message || "Payment method created successfully", "success");
      }
    } catch (error) {
      console.error("Error creating payment method:", error);
      showToast("Failed to create payment method", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateItem = async (itemData: Omit<PaymentMethod, "ID">) => {
    if (!editingItem) return;
    try {
      setActionLoading(true);
      const response = await PaymentAPI.updatePaymentMethod(
        editingItem.ID,
        itemData
      );
      if (response.success) {
        setPaymentMethods(
          paymentMethods.map((item) =>
            item.ID === editingItem.ID ? response.data : item
          )
        );
        setIsModalOpen(false);
        setEditingItem(null);
        showToast(response.message || "Payment method updated successfully", "success");
      }
    } catch (error) {
      showToast("Failed to update payment method", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedItems.length === 0) return;
    try {
      setActionLoading(true);
      const response = await PaymentAPI.bulkDeletePaymentMethod(selectedItems);
      if (response.success) {
        setPaymentMethods((prev) => {
          const remaining = prev.filter((i) => !selectedItems.includes(i.ID));
          return remaining.map((it, idx) => ({ ...it, ID: idx + 1 }));
        });
        setSelectedItems([]);
        showToast(response.message || "Payment methods deleted successfully", "success");
      }
    } catch (error) {
      showToast("Failed to delete payment methods", "error");
    } finally {
      setActionLoading(false);
    }
  };

  // modal form
  useEffect(() => {
    if (editingItem) {
      setFormData({
        Name: editingItem.Name,
        PaymentType: editingItem.PaymentType,
        TaxType: editingItem.TaxType,
        TaxPercentage: editingItem.TaxPercentage,
        Status: editingItem.Status,
        CreatedDate: editingItem.CreatedDate,
        LastUsed: editingItem.LastUsed,
      });
    } else {
      setFormData({
        Name: "",
        PaymentType: "Cash",
        TaxType: "",
        TaxPercentage: 0,
        Status: "Active",
        CreatedDate: new Date().toISOString().split('T')[0],
        LastUsed: new Date().toISOString().split('T')[0],
      });
    }
  }, [editingItem, isModalOpen]);

  const handleModalSubmit = () => {
    if (!formData.Name.trim() || !formData.TaxType.trim()) {
      showToast("Please fill in all required fields", "error");
      return;
    }
    if (editingItem) {
      handleUpdateItem(formData);
    } else {
      handleCreateItem(formData);
    }
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

  const handleSelectAll = (checked: boolean) => {
    setSelectedItems(checked ? filteredItems.map((item) => item.ID) : []);
  };

  const handleSelectItem = (id: number, checked: boolean) => {
    setSelectedItems(
      checked ? [...selectedItems, id] : selectedItems.filter((i) => i !== id)
    );
  };

  const isAllSelected = selectedItems.length === filteredItems.length && filteredItems.length > 0;
  const isSomeSelected = selectedItems.length > 0;

  // Add usage statistics
  const activeMethodsCount = paymentMethods.filter(m => m.Status === "Active").length;
  const mostUsedTaxType = paymentMethods.reduce((acc, method) => {
    acc[method.TaxType] = (acc[method.TaxType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topTaxType = Object.entries(mostUsedTaxType).sort(([, a], [, b]) => b - a)[0];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-b-2 border-yellow-600 rounded-full mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading Payment Methods...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="  bg-gray-50 min-h-screen ">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <h1 className="text-3xl font-semibold mb-8 mt-20">
        Payment Management
      </h1>

      {/* Top summary row */}
      <div className="flex gap-4 mb-8">
        <div className="flex items-center justify-start flex-1 gap-2 max-w-[300px] min-h-[100px] rounded-sm p-4 bg-white shadow-sm">
          <div>
            <p className="text-3xl font-semibold mb-1">
              {activeMethodsCount}
            </p>
            <p className="text-gray-500">
              Active Payment Methods
            </p>
          </div>
        </div>

        <div className="flex items-center justify-start flex-1 gap-2 max-w-[300px] min-h-[100px] rounded-sm p-4 bg-white shadow-sm">
          <div>
            <p className="text-3xl font-semibold mb-1">
              {topTaxType?.[0] || "N/A"}
            </p>
            <p className="text-gray-500">
              Most Used Tax Type ({topTaxType?.[1] || 0} methods)
            </p>
          </div>
        </div>
      </div>

      {/* Action bar: add, delete, search */}
      <div className="mb-8 flex items-center justify-between gap-4 flex-wrap">
        {/* Action Buttons */}
        <div className="flex gap-3 h-[40px]">
          <button
            onClick={() => setIsModalOpen(true)}
            disabled={selectedItems.length > 0}
            className={`flex items-center text-center gap-2 w-[100px] px-6.5 py-2 rounded-sm transition-colors ${selectedItems.length === 0
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
            className={`flex items-center gap-2 px-4 py-2 rounded-sm transition-colors ${isSomeSelected && !actionLoading
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
                  <input
                    type="text"
                    placeholder="Search Payment Methods..."
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

      {/* Table + filters */}
     <div className="bg-gray-50 rounded-sm border border-gray-300 max-w-[95vw]  shadow-sm ">
             <div className=" rounded-sm ">
               <table className="min-w-full divide-y max-w-[800px] divide-gray-200   table-fixed">
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
                  ID
                  <span className="absolute left-0 top-[15%] h-[70%] w-[1.5px] bg-gray-300"></span>
                </th>
                <th className="relative px-4 py-3 text-left">
                  Name
                  <span className="absolute left-0 top-[15%] h-[70%] w-[1.5px] bg-gray-300"></span>
                </th>
                <th className="relative px-4 py-3 text-left">
                  <div className="flex items-center gap-2">
                    <DropdownMenu.Root>
                      <DropdownMenu.Trigger className="px-2 py-1 rounded text-sm bg-transparent border-none outline-none hover:bg-transparent flex items-center gap-2 focus:outline-none focus:ring-0">
                        {statusFilter || "Payment Type"}
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
                            Payment Type
                          </DropdownMenu.Item>
                          <DropdownMenu.Item
                            className="px-3 py-1 text-sm cursor-pointer hover:bg-red-100 text-red-400 rounded outline-none"
                            onClick={() => setStatusFilter("Cash")}
                          >
                            Cash
                          </DropdownMenu.Item>
                          <DropdownMenu.Item
                            className="px-3 py-1 text-sm cursor-pointer hover:bg-blue-100 text-blue-400 rounded outline-none"
                            onClick={() => setStatusFilter("Card")}
                          >
                            Card
                          </DropdownMenu.Item>
                          <DropdownMenu.Item
                            className="px-3 py-1 text-sm cursor-pointer hover:bg-green-100 text-green-400 rounded outline-none"
                            onClick={() => setStatusFilter("Online")}
                          >
                            Online
                          </DropdownMenu.Item>
                        </DropdownMenu.Content>
                      </DropdownMenu.Portal>
                    </DropdownMenu.Root>
                  </div>
                  <span className="absolute left-0 top-[15%] h-[70%] w-[1.5px] bg-gray-300"></span>
                </th>

                <th className="relative px-4 py-3 text-left">
                  <div className="flex items-center gap-2">
                    <DropdownMenu.Root>
                      <DropdownMenu.Trigger className="px-2 py-1 rounded text-sm bg-transparent border-none outline-none hover:bg-transparent flex items-center gap-2 focus:outline-none focus:ring-0">
                        {taxTypeFilter || "Tax Type"}
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
                            onClick={() => setTaxTypeFilter("")}
                          >
                            Tax Type
                          </DropdownMenu.Item>

                          {Array.from(new Set(paymentMethods.map((i) => i.TaxType))).map(
                            (taxType) => (
                              <DropdownMenu.Item
                                key={taxType}
                                className="px-3 py-1 text-sm cursor-pointer hover:bg-blue-100 text-black rounded outline-none"
                                onClick={() => setTaxTypeFilter(taxType)}
                              >
                                {taxType}
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
                  Tax Percentage
                  <span className="absolute left-0 top-[15%] h-[70%] w-[1.5px] bg-gray-300"></span>
                </th>

                <th className="relative px-4 py-3 text-left">
                  Status
                  <span className="absolute left-0 top-[15%] h-[70%] w-[1.5px] bg-gray-300"></span>
                </th>

                <th className="relative px-4 py-3 text-left">
                  Actions
                  <span className="absolute left-0 top-[15%] h-[70%] w-[1.5px] bg-gray-300"></span>
                </th>
              </tr>
            </thead>

            <tbody className="divide-y text-gray-500  divide-gray-300">
              {filteredItems.map((item) => (
                <tr key={item.ID} className="bg-white hover:bg-gray-50">
                  <td className="px-6 py-8">
                                        <Checkbox
                                          checked={selectedItems.includes(item.ID)}
                                          onChange={(e) =>
                                            handleSelectItem(item.ID, e.target.checked)
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

                  <td className="px-4 py-4 whitespace-nowrap">{item.ID}</td>
                  <td className="px-4 py-4 whitespace-nowrap">{item.Name}</td>

                  <td className="px-4 py-4 whitespace-nowrap">
                    <span
                      className={`inline-block w-20 text-center px-2 py-[2px] rounded-md text-xs font-medium 
                  ${item.PaymentType === "Cash" ? "text-red-400 border-red-600" : ""}
                  ${item.PaymentType === "Card" ? "text-blue-400 border-blue-600" : ""}
                  ${item.PaymentType === "Online" ? "text-green-400 border-green-700" : ""}
                `}
                    >
                      {item.PaymentType}
                    </span>
                  </td>

                  <td className="px-4 py-4 whitespace-nowrap">{item.TaxType}</td>
                  <td className="px-4 py-4 whitespace-nowrap">{item.TaxPercentage}%</td>

                  <td className="px-4 py-4 whitespace-nowrap">
                    <span
                      className={`inline-block w-20 text-center px-2 py-[2px] rounded-md text-xs font-medium 
                  ${item.Status === "Active" ? "text-green-400 border-green-700" : "text-red-400 border-red-600"}
                `}
                    >
                      {item.Status}
                    </span>
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
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[71]">
          <div className="bg-white rounded-lg p-6 min-w-[35vw] max-w-2xl max-h-[70vh] min-h-[70vh] shadow-lg relative flex flex-col">

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">
                {editingItem ? "Edit Payment Method" : "Add New Payment Method"}
              </h2>
            </div>

            {/* Scrollable Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 overflow-y-auto pr-1">
              {/* Payment Method Name */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Method Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.Name}
                  onChange={(e) =>
                    setFormData({ ...formData, Name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d9d9e1] focus:border-transparent"
                  placeholder="Enter payment method name"
                  required
                />
              </div>

              {/* Payment Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Type
                </label>
                <DropdownMenu.Root>
                  <DropdownMenu.Trigger className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d9d9e1] focus:border-transparent flex items-center justify-between bg-white hover:bg-gray-50">
                    <span>{formData.PaymentType}</span>
                    <ChevronDown size={16} className="text-gray-500" />
                  </DropdownMenu.Trigger>

                  <DropdownMenu.Portal>
                    <DropdownMenu.Content
                      className="min-w-[200px] rounded-md bg-white shadow-md border border-gray-200 p-1 relative outline-none z-[72]"
                      sideOffset={4}
                    >
                      <DropdownMenu.Arrow className="fill-white stroke-gray-200 w-5 h-3" />

                      <DropdownMenu.Item
                        className="px-3 py-2 text-sm cursor-pointer hover:bg-red-100 text-red-700 rounded outline-none"
                        onClick={() => setFormData({ ...formData, PaymentType: "Cash" })}
                      >
                        Cash
                      </DropdownMenu.Item>

                      <DropdownMenu.Item
                        className="px-3 py-2 text-sm cursor-pointer hover:bg-blue-100 text-blue-700 rounded outline-none"
                        onClick={() => setFormData({ ...formData, PaymentType: "Card" })}
                      >
                        Card
                      </DropdownMenu.Item>

                      <DropdownMenu.Item
                        className="px-3 py-2 text-sm cursor-pointer hover:bg-green-100 text-green-700 rounded outline-none"
                        onClick={() => setFormData({ ...formData, PaymentType: "Online" })}
                      >
                        Online
                      </DropdownMenu.Item>
                    </DropdownMenu.Content>
                  </DropdownMenu.Portal>
                </DropdownMenu.Root>
              </div>

              {/* Tax Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tax Type <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.TaxType}
                  onChange={(e) =>
                    setFormData({ ...formData, TaxType: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d9d9e1] focus:border-transparent"
                  placeholder="e.g., GST, VAT, Service Tax"
                  required
                />
              </div>

              {/* Tax Percentage */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tax Percentage (%)
                </label>
                <input
                  type="number"
                  value={formData.TaxPercentage}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      TaxPercentage: Number(e.target.value) || 0,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d9d9e1] focus:border-transparent"
                  placeholder="0"
                  min="0"
                  max="100"
                  step="0.1"
                />
              </div>

              {/* Status - Replaced with Toggle */}
              <div className="md:col-span-2">
                <div className="flex items-center justify-items-start gap-45">
                  <label className="block text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <ButtonPage
                    checked={formData.Status === "Active"}
                    onChange={handleStatusChange}
                  />
                </div>
              </div>
            </div>

            {/* Fixed Action Buttons - Fixed alignment and separator */}
            <div className="flex gap-3 pt-6 justify-start border-t border-gray-200 mt-6">
              <button
                type="button"
                onClick={handleCloseModal}
                disabled={actionLoading}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <X size={16} />
                Cancel
              </button>
              <button
                type="button"
                onClick={handleModalSubmit}
                disabled={
                  !formData.Name.trim() ||
                  actionLoading
                }
                className={`px-6 py-2 rounded-lg transition-colors flex items-center gap-2 ${!formData.Name.trim() ||
                  actionLoading
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
                    {editingItem ? "Update Item" : "Add Item"}
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

export default PaymentManagementPage;