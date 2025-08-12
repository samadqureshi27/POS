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

interface InventoryItem {
  ID: string;
  Name: string;
  Unit: string;
  
  InitialStock: string;
  Purchased:string ;
  Used: string;
  Variance: string;
  Wasteage: string;
  ClosingStock: string;
  Total_Value: string;
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

const reportsPage = () => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<InventoryItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const [formData, setFormData] = useState<InventoryItem>({
    ID: "",
    Name: "",
    Unit: "",
   
  InitialStock: "",
  Purchased:"" ,
  Used: "",
  Variance: "",
  Wasteage: "",
  ClosingStock: "",
  Total_Value: "",
  });

  // initial dataset (and rows that say "Cell text")
  useEffect(() => {
    setTimeout(() => {
      setItems([
        {
          ID: "#001",
          Name: "Ketchup",
          Unit: "Kilograms (Kg’s)",
          
          InitialStock: "12 ",
          Purchased: "50",
          Used: "25",
          Variance: "5",
          Wasteage: "5",
          ClosingStock: "5",
          Total_Value: "5",
        },
        {
          ID: "#002",
          Name: "Ketchup",
          Unit: "Kilograms (Kg’s)",
          
          InitialStock: "12 ",
          Purchased: "30",
          Used: "20",
          Variance: "5 ",
          Wasteage: "5 ",
          ClosingStock: "5 ",
          Total_Value: "5 ",
        },
        {
          ID: "#003",
          Name: "Ketchup",
          Unit: "Kilograms (Kg’s)",
          
          InitialStock: "12 ",
          Purchased: "20",
          Used: "3",
          Variance: "5 ",
          Wasteage: "5 ",
          ClosingStock: "5 ",
          Total_Value: "5 ",
        },
       
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
      item.ID.toLowerCase().includes(q) ||
      item.Unit.toLowerCase().includes(q);
    
    const matchesUnit = unitFilter ? item.Unit === unitFilter : true;
    return matchesQuery  && matchesUnit;
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
      ID: "",
    Name: "",
    Unit: "",
   
  InitialStock: "",
  Purchased:"" ,
  Used: "",
  Variance: "",
  Wasteage: "",
  ClosingStock: "",
  Total_Value: "",
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
          <p className="mt-4 text-gray-600">Loading Inventory Report...</p>
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

      <h1 className="text-3xl font-semibold mb-4 pl-20">
        Inventory Report
      </h1>

      {/* Top summary row like the screenshot */}
      <div className="flex gap-4 mb-6 pl-20">
        <div className="flex items-center justify-start flex-1 gap-2 max-w-[300px] min-h-[100px] rounded-md p-4 bg-white shadow-sm">
          <div>
            <p className="text-3xl font-semibold mb-1">
              {mostUsedItem?.Name || "N/A"}
            </p>
            <p className="text-gray-500">
              Most Used ({mostUsedItem?.usageCount || 0} times)
            </p>
          </div>
        </div>

        <div className="flex items-center justify-start flex-1 gap-2 max-w-[300px] min-h-[100px] rounded-md p-4 bg-white shadow-sm">
          <div>
            <p className="text-3xl font-semibold mb-1">
              {leastUsedItem?.Name || "N/A"}
            </p>
            <p className="text-gray-500">
              Least Used ({leastUsedItem?.usageCount || 0} times)
            </p>
          </div>
        </div>
      </div>

      {/* Action bar search */}
      <div className="mb-6 pl-20 flex items-center justify-between gap-4 flex-wrap">
        
        

        {/* Search Bar */}
        <div className="relative flex-1 min-w-[200px]">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={16}
          />
          <input
            type="text"
            placeholder="Search inventory..."
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
                  <div className="flex items-center gap-2">
                    <DropdownMenu.Root>
                      <DropdownMenu.Trigger className="px-2 py-1 rounded text-sm bg-transparent border-none outline-none hover:bg-transparent flex items-center gap-2 focus:outline-none focus:ring-0">
                        {unitFilter || "Unit"}
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
                            Unit
                          </DropdownMenu.Item>

                          {Array.from(new Set(items.map((i) => i.Unit))).map(
                            (unit) => (
                              <DropdownMenu.Item
                                key={unit}
                                className="px-3 py-1 text-sm cursor-pointer hover:bg-blue-100 text-black rounded outline-none"
                                onClick={() => setUnitFilter(unit)}
                              >
                                {unit}
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
                  Initial Stock
                  <span className="absolute left-0 top-[15%] h-[70%] w-[2.5px] bg-[#d9d9e1]"></span>
                </th>
                <th className="relative px-4 py-3 text-left">
                  Purchased
                  <span className="absolute left-0 top-[15%] h-[70%] w-[2.5px] bg-[#d9d9e1]"></span>
                </th>
                <th className="relative px-4 py-3 text-left">
                   Used
                  <span className="absolute left-0 top-[15%] h-[70%] w-[2.5px] bg-[#d9d9e1]"></span>
                </th>
                <th className="relative px-4 py-3 text-left">
                  Variance
                  <span className="absolute left-0 top-[15%] h-[70%] w-[2.5px] bg-[#d9d9e1]"></span>
                </th>

                 <th className="relative px-4 py-3 text-left">
                  Wasteage
                  <span className="absolute left-0 top-[15%] h-[70%] w-[2.5px] bg-[#d9d9e1]"></span>
                </th>
                 <th className="relative px-4 py-3 text-left">
                  Closing Stock
                  <span className="absolute left-0 top-[15%] h-[70%] w-[2.5px] bg-[#d9d9e1]"></span>
                </th>
                 <th className="relative px-4 py-3 text-left">
                  Total Value
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
                  <td className="px-4 py-4 whitespace-nowrap">{item.Unit}</td>

                  

                  <td className="px-4 py-4 whitespace-nowrap">
                    {item.InitialStock}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                    {item.Purchased}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                    {item.Used}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    {item.Variance}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                    {item.Wasteage}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                    {item.ClosingStock}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                    {item.Total_Value}
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




export default reportsPage;