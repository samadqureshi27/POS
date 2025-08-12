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
} from "lucide-react";

interface Staffitmes {
  ID: string;
  Name: string;
  Contact: string;
  
  Email: string;
  Last_Ordered_Date: string;
  Total_Orders: string;
  Total_Spent: string;
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

const  CustomerManagementPage = () => {
  const [items, setItems] = useState<Staffitmes[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"" | "Active" | "Inactive">(
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
    
    Email: "",
    Last_Ordered_Date: "",
    Total_Orders: "",
    Total_Spent: "",
  });

  // initial dataset (and rows that say "Cell text")
  useEffect(() => {
    setTimeout(() => {
      setItems([
        {
          ID: "#001",
          Name: "efe",
          Contact: "03001231234",
           Email: "adb@gamil.com",
    Last_Ordered_Date: "7-4-25",
    Total_Orders: "5",
    Total_Spent: "700",
        },
        {
          ID: "#002",
          Name: "andd",
          Contact: "03001234567",
          Email: "ad1b@gamil.com",
    Last_Ordered_Date: "7-4-25",
    Total_Orders: "6",
    Total_Spent: "300",
        },
        {
          ID: "#003",
          Name: "ghie",
          Contact: "03001231238",
           Email: "ad2b@gamil.com",
    Last_Ordered_Date: "7-4-25",
    Total_Orders: "9",
    Total_Spent: "1200",}
      ]);
      setLoading(false);
    }, 800);
  }, []);

  // Add this state along with statusFilter
  const [unitFilter, setUnitFilter] = useState("");

  // Update filteredItems to include unitFilter check
  const filteredItems = items.filter((item) => {
    const q = searchTerm.trim().toLowerCase();
    const matchesQuery =
      q === "" ||
      item.Name.toLowerCase().includes(q) ||
      item.ID.toLowerCase().includes(q) ;
    
    return matchesQuery ;
  });

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

 const handleDeleteSelected = () => {
  if (selectedItems.length === 0) return;
  setActionLoading(true);
  setTimeout(() => {
    // Remove selected items
    let remaining = items.filter((it) => !selectedItems.includes(it.ID));

    // Reassign IDs sequentially starting from 1
    remaining = remaining.map((item, index) => ({
      ...item,
      ID: `#${String(index + 1).padStart(3, "0")}`,
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
    
    Email: "",
    Last_Ordered_Date: "",
    Total_Orders: "",
    Total_Spent: "",
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
          <p className="mt-4 text-gray-600">Loading Customer Management...</p>
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

      <h1 className="text-3xl font-semibold mb-4 pl-20">Customer Details</h1>

      {/* Action bar: add, delete, search */}
      <div className="mb-6 flex items-center justify-between gap-4 flex-wrap">
        

        {/* Search Bar */}
        <div className="relative flex-1 min-w-[200px] ml-20">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
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
                  ID
                  <span className="absolute left-0 top-[15%] h-[70%] w-[2.5px] bg-[#d9d9e1]"></span>
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
                  Email
                  <span className="absolute left-0 top-[15%] h-[70%] w-[2.5px] bg-[#d9d9e1]"></span>
                </th>

                <th className="relative px-4 py-3 text-left">
                  Last Ordered Date
                  <span className="absolute left-0 top-[15%] h-[70%] w-[2.5px] bg-[#d9d9e1]"></span>
                </th>
                <th className="relative px-4 py-3 text-left">
                  Total Orders
                  <span className="absolute left-0 top-[15%] h-[70%] w-[2.5px] bg-[#d9d9e1]"></span>
                </th>
                <th className="relative px-4 py-3 text-left">
                  Total Spent
                  <span className="absolute left-0 top-[15%] h-[70%] w-[2.5px] bg-[#d9d9e1]"></span>
                </th>

                
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {filteredItems.map((item) => (
                <tr key={item.ID} className="bg-white hover:bg-gray-50">
                  <td className="px-4 py-4">
                    <Checkbox
                      checked={selectedItems.includes(item.ID)}
                      onChange={(e) =>
                        handleSelectItem(item.ID, e.target.checked)
                      }
                      sx={{
                        color: "#d9d9e1",
                        "&.Mui-checked": { color: "#d9d9e1" },
                      }}
                    />
                  </td>

                  <td className="px-4 py-4 whitespace-nowrap">{item.ID}</td>
                  <td className="px-4 py-4 whitespace-nowrap">{item.Name}</td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    {item.Contact}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">{item.Email}</td>
                  <td className="px-4 py-4 whitespace-nowrap">{item.Last_Ordered_Date}</td>
                  <td className="px-4 py-4 whitespace-nowrap">{item.Total_Orders}</td>
                  <td className="px-4 py-4 whitespace-nowrap">{item.Total_Spent}</td>

                  
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      
    </div>
  );
};




export default CustomerManagementPage;