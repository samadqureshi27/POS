"use client";
import { ChevronDown } from "lucide-react";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import React, { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  Search,
  AlertCircle,
  CheckCircle,
  X,
  Edit,
  Info,
} from "lucide-react";

interface Staffitmes {
  ID: string;
  Name: string;
  Contact: string;
  Status: "Paid" | "Unpaid";
  Role: string;
  
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

const PayRollPage = () => {
  const [items, setItems] = useState<Staffitmes[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"" | "Paid" | "Unpaid">(
    ""
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<Staffitmes | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const [formData, setFormData] = useState<Staffitmes>({
    ID: "",
    Name: "",
    Contact: "",
    Status: "Unpaid",
    Role: "",
    
  });

  const options = ["Today", "Week", "Month", "Quarter", "Year", "Custom date"];
  const [active, setActive] = useState("Week");
  // initial dataset (and rows that say "Cell text")
  // Replace your current useEffect with this:

useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true);

      // Simulate calling an API endpoint (you can replace this URL with your backend later)
      const res = await fetch("https://dummyjson.com/users?limit=3");
      const data = await res.json();

      // Map API fields to your Staffitmes structure
      const staffData: Staffitmes[] = data.users.map((user: any, index: number) => ({
        ID: `#${String(index + 1).padStart(3, "0")}`,
        Name: user.firstName,
        Contact: user.phone,
        Status: index % 2 === 0 ? "Paid" : "Unpaid", // just random for demo
        Role: ["Waiter", "Cashier", "Cleaner"][index % 3], // assign roles for demo
      }));

      setItems(staffData);
    } catch (error) {
      console.error("Error fetching staff data:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, []);


  // Add this state along with statusFilter
  const [unitFilter, setUnitFilter] = useState("");

  // Update filteredItems to include unitFilter check
  const filteredItems = items.filter((item) => {
    const q = searchTerm.trim().toLowerCase();
    const matchesQuery =
      q === "" ||
      item.Name.toLowerCase().includes(q) ||
      item.ID.toLowerCase().includes(q) ||
      item.Role.toLowerCase().includes(q);
    const matchesStatus = statusFilter ? item.Status === statusFilter : true;
    const matchesUnit = unitFilter ? item.Role === unitFilter : true;
    return matchesQuery && matchesStatus && matchesUnit;
  });

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleDeleteSelected = () => {
    if (selectedItems.length === 0) return;
    setActionLoading(true);
    setTimeout(() => {
      const remaining = items.filter((it) => !selectedItems.includes(it.ID));
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
    setSelectedItems(checked ? filteredItems.map((i) => i.ID) : []);
  };

  const openAddModal = () => {
    if (selectedItems.length > 0) return; // keep original behaviour (disable add when selections exist)
    // generate next ID like "#006"
    const nextNumber =
      items
        .map((i) => {
          const m = i.ID.match(/\d+/);
          return m ? parseInt(m[0], 10) : NaN;
        })
        .filter((n) => !Number.isNaN(n))
        .reduce((a, b) => Math.max(a, b), 0) + 1;
    const nextId = `#${String(nextNumber).padStart(3, "0")}`;

    setEditItem(null);
    setFormData({
      ID: nextId,
      Name: "",
      Contact: "",
      Status: "Unpaid",
      Role: "",
      
    });
    setModalOpen(true);
  };

  const openEditModal = (item: Staffitmes) => {
    setEditItem(item);
    setFormData({ ...item });
    setModalOpen(true);
  };

  const handleSaveItem = () => {
    // minimal validation
    if (!formData.Name.trim()) {
      showToast("Please enter a Name.", "error");
      return;
    }

    setActionLoading(true);
    setTimeout(() => {
      if (editItem) {
        setItems((prev) =>
          prev.map((it) => (it.ID === editItem.ID ? { ...formData } : it))
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
          <p className="mt-4 text-gray-600">Loading Satff Management...</p>
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

      <h1 className="text-3xl font-semibold mb-4 pl-20">Staff Management</h1>

      <div className="flex gap-2 pl-20 mb-5">
        {options.map((option) => (
          <button
            key={option}
            onClick={() => setActive(option)}
            className={`px-4 py-2 rounded-md text-sm font-medium border transition-colors
            ${
              active === option
                ? "bg-[#2C2C2C] text-white border-[#2C2C2C]" // active gold
                : "bg-white text-gray-600 border-gray-300 hover:bg-gray-100"
            }
          `}
          >
            {option}
          </button>
        ))}
      </div>
      {/* Summary Cards */}
      <div className="flex gap-10 mb-6 pl-20">
        <div className="flex items-center justify-start flex-1  gap-2 max-w-[300px] min-h-[100px] rounded-md p-4 bg-white shadow-sm">
          <div>
            <p className="text-4xl  mb-1">23003</p>
            <p className="text-1xl text-gray-500">Gross Revenue</p>
          </div>
        </div>

        <div className="flex items-center justify-start flex-1 gap-2 max-w-[300px] min-h-[100px] rounded-md p-4 bg-white shadow-sm">
          <div>
            <p className="text-4xl  mb-1">5000</p>
            <p className="text-1xl text-gray-500 ">Avg. Order Value</p>
          </div>
        </div>
        <div className="flex items-center justify-start flex-1  gap-2 max-w-[300px] min-h-[100px] rounded-md p-4 bg-white shadow-sm">
          <div>
            <p className="text-4xl  mb-1">23003</p>
            <p className="text-1xl text-gray-500">Taxes</p>
          </div>
        </div>

        <div className="flex items-center justify-start flex-1 gap-2 max-w-[300px] min-h-[100px] rounded-md p-4 bg-white shadow-sm">
          <div>
            <p className="text-4xl  mb-1">5000</p>
            <p className="text-1xl text-gray-500 ">Customers</p>
          </div>
        </div>
      </div>
      {/* Action bar: add, delete, search */}
      <div className="mb-6 flex items-center justify-between gap-4 flex-wrap">
        {/* Search Bar */}
        <div className="relative flex-1 min-w-[200px] ml-20">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            size={16}
          />
          <input
            type="text"
            placeholder="Search Staff..."
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
                
                <th className="relative px-4 py-3 text-left">
                  ID
                  
                </th>
                <th className="relative px-4 py-3 text-left">
                  Name
                  <span className="absolute left-0 top-[15%] h-[70%] w-[2.5px] bg-[#d9d9e1]"></span>
                </th>
                <th className="relative px-4 py-3 text-left">
                  Contact
                  <span className="absolute left-0 top-[15%] h-[70%] w-[2.5px] bg-[#d9d9e1]"></span>
                </th>
                <th className="relative px-4 py-3 text-left">
                  <div className="flex items-center gap-2">
                    <DropdownMenu.Root>
                      <DropdownMenu.Trigger className="px-2 py-1 rounded text-sm bg-transparent border-none outline-none hover:bg-transparent flex items-center gap-2 focus:outline-none focus:ring-0">
                        {unitFilter || "Role"}
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
                            Role
                          </DropdownMenu.Item>

                          {Array.from(new Set(items.map((i) => i.Role))).map(
                            (Role) => (
                              <DropdownMenu.Item
                                key={Role}
                                className="px-3 py-1 text-sm cursor-pointer hover:bg-blue-100 text-black rounded outline-none"
                                onClick={() => setUnitFilter(Role)}
                              >
                                {Role}
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
                            onClick={() => setStatusFilter("Unpaid")}
                          >
                            Unpaid
                          </DropdownMenu.Item>

                          <DropdownMenu.Item
                            className="px-3 py-1 text-sm cursor-pointer hover:bg-green-100 text-green-700 rounded outline-none"
                            onClick={() => setStatusFilter("Paid")}
                          >
                            Paid
                          </DropdownMenu.Item>
                        </DropdownMenu.Content>
                      </DropdownMenu.Portal>
                    </DropdownMenu.Root>
                  </div>
                  <span className="absolute left-0 top-[15%] h-[70%] w-[2.5px] bg-[#d9d9e1]"></span>
                </th>
                

                

                <th className="relative px-4 py-3 text-left">
                  Details
                  <span className="absolute left-0 top-[15%] h-[70%] w-[2.5px] bg-[#d9d9e1]"></span>
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {filteredItems.map((item) => (
                <tr key={item.ID} className="bg-white hover:bg-gray-50">
                  

                  <td className="px-4 py-4 whitespace-nowrap">{item.ID}</td>
                  <td className="px-4 py-4 whitespace-nowrap">{item.Name}</td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    {item.Contact}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">{item.Role}</td>

                  <td className="px-4 py-4 whitespace-nowrap">
                    <span
                      className={`inline-block w-24 text-center px-2 py-[2px] rounded-md text-xs font-medium border
                  ${
                    item.Status === "Unpaid"
                      ? "text-red-600 border-red-600"
                      : ""
                  }
                  
                  ${
                    item.Status === "Paid"
                      ? "text-green-700 border-green-700"
                      : ""
                  }
                `}
                    >
                      {item.Status}
                    </span>
                  </td>
                  
                  
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditModal(item)}
                        className="text-black hover:text-gray-800 transition-colors"
                        title="Edit"
                      >
                        <Info size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      
      
    </div>
  );
};

export default PayRollPage;
