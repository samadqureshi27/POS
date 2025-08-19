"use client";
import { ChevronDown } from "lucide-react";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import React, { useState, useEffect } from "react";
import { RadialBarChart, RadialBar, Legend, Tooltip } from "recharts";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import {
  Plus,
  Trash2,
  Search,
  AlertCircle,
  CheckCircle,
  X,
  Edit,
} from "lucide-react";

interface InventoryItem {
  Order: string;
  Name: string;
  number_item: string;
  Status: "Active" | "Inactive";
  Type: string;
  Payment: string;
  Total: string;
  Time_Date: string;
}

const data = [
  { name: "Dine In", value: 200, fill: "#959AA3" },
  { name: "TakeAway", value: 122, fill: "#CCAB4D" },
  { name: "Delivery", value: 214, fill: "#000000" },
];
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

const OrderManagementPage = () => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"" | "Active" | "Inactive">(
    ""
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<InventoryItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const [formData, setFormData] = useState<InventoryItem>({
    Order: "",
    Name: "",
    number_item: "",
    Status: "Inactive",
    Type: "",
    Payment: "",
    Total: "",
    Time_Date: "",
  });

  // initial dataset (and rows that say "Cell text")
  useEffect(() => {
    setTimeout(() => {
      setItems([
        {
          Order: "#001",
          Name: "segg",
          number_item: "34",
          Status: "Active",
          Type: "Dine-In",
          Payment: "20",
          Total: "32",
          Time_Date: "2-2-2025",
        },
        {
          Order: "#002",
          Name: "segg",
          number_item: "34",
          Status: "Active",
          Type: "Dine-In",
          Payment: "20",
          Total: "32",
          Time_Date: "2-2-2025",
        },
        {
          Order: "#003",
          Name: "segg",
          number_item: "34",
          Status: "Active",
          Type: "Dine-In",
          Payment: "Online",
          Total: "32",
          Time_Date: "2-2-2025",
        },
        {
          Order: "#004",
          Name: "segg",
          number_item: "34",
          Status: "Active",
          Type: "Dine-In",
          Payment: "Online",
          Total: "32",
          Time_Date: "2-2-2025",
        },
        {
          Order: "#005",
          Name: "segg",
          number_item: "34",
          Status: "Active",
          Type: "Dine-In",
          Payment: "Online",
          Total: "32",
          Time_Date: "2-2-2025",
        },
      ]);
      setLoading(false);
    }, 800);
  }, []);

  const options = ["Today", "Week", "Month", "Quarter", "Year", "Custom date"];
  const [active, setActive] = useState("Week");

  // For custom date
  const [customDate, setCustomDate] = useState<Date | null>(null);
  // Add this state along with statusFilter
  const [unitFilter, setUnitFilter] = useState("");

  // Update filteredItems to include unitFilter check
  const filteredItems = items.filter((item) => {
    const q = searchTerm.trim().toLowerCase();

    const matchesQuery =
      q === "" ||
      item.Order.toLowerCase().includes(q) ||
      item.Type.toLowerCase().includes(q);

    const matchesStatus = statusFilter ? item.Status === statusFilter : true;
    const matchesUnit = unitFilter ? item.Type === unitFilter : true;

    const matchesDate = customDate
      ? new Date(item.Time_Date).toDateString() === customDate.toDateString()
      : true;

    return matchesQuery && matchesStatus && matchesUnit && matchesDate;
  });

  const itemsWithUsage = items.map((item) => ({
    ...item,
    usageCount: Math.floor(Math.random() * 100), // random number 0–99
  }));

  // Find most used item
  const mostUsedItem = itemsWithUsage.reduce(
    (max, item) => (item.usageCount > max.usageCount ? item : max),
    itemsWithUsage[0] || { usageCount: 0 }
  );

  // Find least used item
  const leastUsedItem = itemsWithUsage.reduce(
    (min, item) => (item.usageCount < min.usageCount ? item : min),
    itemsWithUsage[0] || { usageCount: 0 }
  );

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleDeleteSelected = () => {
    if (selectedItems.length === 0) return;
    setActionLoading(true);
    setTimeout(() => {
      // Remove selected items
      let remaining = items.filter((it) => !selectedItems.includes(it.Order));

      // Reassign IDs sequentially starting from 1
      remaining = remaining.map((item, index) => ({
        ...item,
        Order: `#${String(index + 1).padStart(3, "0")}`,
      }));

      setItems(remaining);
      setSelectedItems([]);
      setActionLoading(false);
      showToast("Selected items deleted successfully.", "success");
    }, 600);
  };

  const handleSelectItem = (id: string, checked: boolean) => {
    setSelectedItems(
      checked ? [...selectedItems, id] : selectedItems.filter((i) => i !== id)
    );
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectedItems(checked ? filteredItems.map((i) => i.Order) : []);
  };

  const openAddModal = () => {
    if (selectedItems.length > 0) return; // keep original behaviour (disable add when selections exist)
    // generate next ID like "#006"
    const nextNumber =
      items
        .map((i) => {
          const m = i.Order.match(/\d+/);
          return m ? parseInt(m[0], 10) : NaN;
        })
        .filter((n) => !Number.isNaN(n))
        .reduce((a, b) => Math.max(a, b), 0) + 1;
    const nextId = `#${String(nextNumber).padStart(3, "0")}`;

    setEditItem(null);
    setFormData({
      Order: nextId,
      Name: "",
      number_item: "",
      Status: "Inactive",
      Type: "",
      Payment: "",
      Total: "",
      Time_Date: "",
    });
    setModalOpen(true);
  };

  const openEditModal = (item: InventoryItem) => {
    setEditItem(item);
    setFormData({ ...item });
    setModalOpen(true);
  };

  const handleSaveItem = () => {
    // minimal validation
    if (!formData.Order.trim()) {
      showToast("Please enter a Order.", "error");
      return;
    }

    setActionLoading(true);
    setTimeout(() => {
      if (editItem) {
        setItems((prev) =>
          prev.map((it) => (it.Order === editItem.Order ? { ...formData } : it))
        );
        showToast("Item updated successfully.", "success");
      } else {
        setItems((prev) => [...prev, { ...formData }]);
        showToast("Item added successfully.", "success");
      }
      setModalOpen(false);
      setEditItem(null);
      setSelectedItems([]);
      setActionLoading(false);
    }, 700);
  };

  const isAllSelected =
    selectedItems.length === filteredItems.length && filteredItems.length > 0;
  const isSomeSelected = selectedItems.length > 0;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-b-2 border-yellow-600 rounded-full mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading Order Management...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 mx-6 bg-gray-50 min-h-screen overflow-y-auto">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <h1 className="text-3xl font-semibold mb-4 pl-20">Order Management</h1>

      <div className="flex gap-2 pl-20 mb-8 items-center">
        {options.map((option) => (
          <button
            key={option}
            onClick={() => setActive(option)}
            className={`px-4 py-2 rounded-md text-sm font-medium border transition-colors
            ${
              active === option
                ? "bg-[#2C2C2C] text-white border-[#2C2C2C]"
                : "bg-white text-gray-600 border-gray-300 hover:bg-gray-100"
            }
          `}
          >
            {option}
          </button>
        ))}

        {/* Show calendar if "Custom date" is active */}
        {active === "Custom date" && (
          <DatePicker
            selected={customDate}
            onChange={(date) => setCustomDate(date)}
            dateFormat="dd/MM/yyyy"
            placeholderText="Select date"
            className="ml-4 px-4 py-2 border border-gray-300  rounded-md focus:outline-none focus:ring-2 focus:ring-[#d9d9e1]"
          />
        )}
      </div>
      <div className="flex gap-6">
        {/* Table 1 */}
        <div className="bg-gray-50 ml-20 rounded-lg  overflow-x-auto w-1/3">
          <div className="max-h-[300px] overflow-y-auto">
            <div className="flex items-center justify-center flex-1  gap-2 max-w-[450px] max-h-[50px] rounded-md mb-2 p-4 bg-white shadow-sm">
              <div>
                <p className="text-2xl  mb-1">Most Ordered</p>
              </div>
            </div>

            <table className="min-w-full divide-y divide-gray-200 table-fixed text-sm">
              <thead className="bg-white border-b border-gray-200 sticky top-0 ">
                <tr>
                  <th className="px-2 py-2 text-left">Rank</th>
                  <th className="px-2 py-2 text-left">Name</th>
                  <th className="px-2 py-2 text-left">Total Number</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredItems.map((item) => (
                  <tr key={item.Order} className="bg-white hover:bg-gray-50">
                    <td className="px-2 py-2">{item.Order}</td>
                    <td className="px-2 py-2">{item.Name}</td>
                    <td className="px-2 py-2">{item.number_item}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Table 2 */}
        <div className="bg-gray-50 rounded-lg  overflow-x-auto w-1/3">
          <div className="max-h-[300px] overflow-y-auto">
            <div className="flex items-center justify-center flex-1  gap-2 max-w-[450px] max-h-[50px] rounded-md mb-2 p-4 bg-white shadow-sm">
              <div>
                <p className="text-2xl  mb-1">Least Ordered</p>
              </div>
            </div>
            <table className="min-w-full divide-y divide-gray-200 table-fixed text-sm">
              <thead className="bg-white border-b border-gray-200 sticky top-0 ">
                <tr>
                  <th className="px-2 py-2 text-left">Rank</th>
                  <th className="px-2 py-2 text-left">Name</th>
                  <th className="px-2 py-2 text-left">Total Number</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredItems.map((item) => (
                  <tr key={item.Order} className="bg-white hover:bg-gray-50">
                    <td className="px-2 py-2">{item.Order}</td>
                    <td className="px-2 py-2">{item.Name}</td>
                    <td className="px-2 py-2">{item.number_item}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="w-1/3 flex items-center justify-center overflow-hidden">
        
          <div className="max-h-[300px] ">
            <div className="flex items-center justify-center">
            <p className="text-2xl   mb-1">Most Type of Orders</p>
            </div>
            <div className="flex items-center justify-center">
              <RadialBarChart
                width={370}
                height={250}
                cx="40%"
                cy="50%"
                innerRadius="50%"
                outerRadius="80%"
                barSize={20}
                data={data}
              >
                <RadialBar minAngle={15} clockWise dataKey="value" />
                <Legend
                  iconSize={10}
                  layout="vertical"
                  verticalAlign="middle"
                  align="right"
                />
                <Tooltip
                  formatter={(value, name, props) => [
                    `${value} Orders`,
                    props.payload.name,
                  ]}
                />
              </RadialBarChart>
            </div>
          </div>
        </div>
      </div>

      {/* Action bar: add, delete, search */}
      <div className="mb-6 mt-8 flex items-center justify-between gap-4 flex-wrap">
        {/* Action Buttons */}
        <div className="flex gap-3 pl-20">
          <button
            onClick={openAddModal}
            disabled={selectedItems.length > 0}
            className={`flex items-center text-center gap-2 w-[100px] px-4 py-2 rounded-lg transition-colors ${
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
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
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
            placeholder="Search Orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d9d9e1]"
          />
        </div>
      </div>

      {/* Table + filters */}
      <div className="bg-gray-50 rounded-lg ml-20 shadow-sm overflow-x-auto">
        <div className="max-h-[500px] overflow-y-auto">
          <table className="min-w-full divide-y divide-gray-200 table-fixed">
            <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
              <tr>
                <th className="px-4 py-3 text-left">
                  <Checkbox
                    checked={isAllSelected}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    sx={{
                      color: "#2C2C2C",
                      "&.Mui-checked": { color: "#2C2C2C" },
                    }}
                  />
                </th>
                <th className="relative px-4 py-3 text-left">
                  Order#
                  <span className="absolute left-0 top-[15%] h-[70%] w-[2.5px] bg-[#d9d9e1]"></span>
                </th>
                <th className="relative px-4 py-3 text-left">
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
                          <DropdownMenu.Item
                            className="px-3 py-1 text-sm cursor-pointer hover:bg-red-100 text-red-700 rounded outline-none"
                            onClick={() => setStatusFilter("Active")}
                          >
                            Active
                          </DropdownMenu.Item>

                          <DropdownMenu.Item
                            className="px-3 py-1 text-sm cursor-pointer hover:bg-green-100 text-green-700 rounded outline-none"
                            onClick={() => setStatusFilter("Inactive")}
                          >
                            Inactive
                          </DropdownMenu.Item>
                        </DropdownMenu.Content>
                      </DropdownMenu.Portal>
                    </DropdownMenu.Root>
                  </div>
                  <span className="absolute left-0 top-[15%] h-[70%] w-[2.5px] bg-[#d9d9e1]"></span>
                </th>

                <th className="relative px-4 py-3 text-left">
                  <div className="flex items-center gap-2">
                    <DropdownMenu.Root>
                      <DropdownMenu.Trigger className="px-2 py-1 rounded text-sm bg-transparent border-none outline-none hover:bg-transparent flex items-center gap-2 focus:outline-none focus:ring-0">
                        {unitFilter || "type"}
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
                            onClick={() => setUnitFilter("")}
                          >
                            type
                          </DropdownMenu.Item>

                          {Array.from(new Set(items.map((i) => i.Type))).map(
                            (Type) => (
                              <DropdownMenu.Item
                                key={Type}
                                className="px-3 py-1 text-sm cursor-pointer hover:bg-blue-100 text-black rounded outline-none"
                                onClick={() => setUnitFilter(Type)}
                              >
                                {Type}
                              </DropdownMenu.Item>
                            )
                          )}
                        </DropdownMenu.Content>
                      </DropdownMenu.Portal>
                    </DropdownMenu.Root>
                  </div>
                  <span className="absolute left-0 top-[15%] h-[70%] w-[2.5px] bg-[#d9d9e1]"></span>
                </th>

                <th className="relative px-4 py-3 text-left">
                  Payment
                  <span className="absolute left-0 top-[15%] h-[70%] w-[2.5px] bg-[#d9d9e1]"></span>
                </th>
                <th className="relative px-4 py-3 text-left">
                  Total
                  <span className="absolute left-0 top-[15%] h-[70%] w-[2.5px] bg-[#d9d9e1]"></span>
                </th>
                <th className="relative px-4 py-3 text-left">
                  Time-Date
                  <span className="absolute left-0 top-[15%] h-[70%] w-[2.5px] bg-[#d9d9e1]"></span>
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {filteredItems.map((item) => (
                <tr key={item.Order} className="bg-white hover:bg-gray-50">
                  <td className="px-4 py-4">
                    <Checkbox
                      checked={selectedItems.includes(item.Order)}
                      onChange={(e) =>
                        handleSelectItem(item.Order, e.target.checked)
                      }
                      sx={{
                        color: "#d9d9e1",
                        "&.Mui-checked": { color: "#d9d9e1" },
                      }}
                    />
                  </td>

                  <td className="px-4 py-4 whitespace-nowrap">{item.Order}</td>

                  <td className="px-4 py-4 whitespace-nowrap">
                    <span
                      className={`inline-block w-24 text-center px-2 py-[2px] rounded-md text-xs font-medium border
                  ${
                    item.Status === "Inactive"
                      ? "text-red-600 border-red-600"
                      : ""
                  }
                 
                  ${
                    item.Status === "Active"
                      ? "text-green-700 border-green-700"
                      : ""
                  }
                `}
                    >
                      {item.Status}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">{item.Type}</td>

                  <td className="px-4 py-4 whitespace-nowrap">
                    {item.Payment}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                    {item.Total}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                    {item.Time_Date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Add/Edit */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-[700px]">
            <h2 className="text-xl font-semibold mb-4">
              {editItem ? "Edit Item" : "New Item"}
            </h2>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">ID</label>
                <input
                  type="text"
                  value={formData.Order}
                  readOnly
                  className="w-full px-4 py-2 border border-gray-300 rounded bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Status
                </label>
                <select
                  value={formData.Status}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      Status: e.target.value as InventoryItem["Status"],
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded"
                >
                  <option value="Low">Active</option>
                  <option value="Medium">Inactive</option>
                </select>
              </div>

              <div className="col-span-2">
                <label className="block text-sm text-gray-600 mb-1">Name</label>
                <input
                  type="text"
                  value={formData.Name}
                  onChange={(e) =>
                    setFormData({ ...formData, Name: e.target.value })
                  }
                  placeholder="Item name"
                  className="w-full px-4 py-2 border border-gray-300 rounded"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">TYPE</label>
                <input
                  type="text"
                  value={formData.Type}
                  onChange={(e) =>
                    setFormData({ ...formData, Type: e.target.value })
                  }
                  placeholder="Type"
                  className="w-full px-4 py-2 border border-gray-300 rounded"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Payment
                </label>
                <input
                  type="text"
                  value={formData.Payment}
                  onChange={(e) =>
                    setFormData({ ...formData, Payment: e.target.value })
                  }
                  placeholder="Payment"
                  className="w-full px-4 py-2 border border-gray-300 rounded"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveItem}
                className="px-4 py-2 bg-yellow-600 text-white rounded"
              >
                {actionLoading ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManagementPage;
