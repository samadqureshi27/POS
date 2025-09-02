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
  Save,
  Edit,
} from "lucide-react";
import ResponsiveEditButton from "@/components/layout/UI/ResponsiveEditButton";
import ActionBar from "@/components/layout/UI/ActionBar";
interface InventoryItem {
  ID: string;
  Name: string;

  Status: "Active" | "Inactive";
  Description: string;
  Unit: string;
  Priority: number;
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
    className={`fixed top-4 right-4 px-4 py-3 rounded-sm shadow-lg z-50 flex items-center gap-2 ${type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"
      }`}
  >
    {type === "success" ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
    <span>{message}</span>
    <button onClick={onClose} className="ml-2">
      <X size={16} />
    </button>
  </div>
);

const IngredientsManagementPage = () => {
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
    ID: "",
    Name: "",
    Status: "Inactive",
    Description: "",
    Unit: "",
    Priority: 0,
  });

  // initial dataset (and rows that say "Cell text")
  useEffect(() => {
    setTimeout(() => {
      setItems([
        {
          ID: "#001",
          Name: "Bread",

          Status: "Active",
          Description: "Bread",
          Unit: "Kilograms (Kg’s)",

          Priority: 1,
        },
        {
          ID: "#002",
          Name: "Oat Bread",

          Status: "Active",
          Description: "Bread ",
          Unit: "Kilograms (Kg’s)",

          Priority: 2,
        },
        {
          ID: "#003",
          Name: "French Bread",

          Status: "Inactive",
          Description: "Bread ",
          Unit: "Kilograms (Kg’s)",

          Priority: 3,
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
    const matchesStatus = statusFilter ? item.Status === statusFilter : true;
    const matchesUnit = unitFilter ? item.Unit === unitFilter : true;
    return matchesQuery && matchesStatus && matchesUnit;
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
  const handleStatusChange = (isActive: boolean) => {
    setFormData({
      ...formData,
      Status: isActive ? "Active" : "Inactive",
    });
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
      Status: "Inactive",
      Description: "",
      Unit: "",
      Priority: 0,
    });
    setModalOpen(true);
  };
  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (modalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup function to restore scrolling when component unmounts
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [modalOpen]);

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
          <p className="mt-4 text-gray-600">Loading Recipe Management...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-w-full h-full overflow-y-auto">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <h1 className="text-3xl font-semibold mt-14 mb-8 ">Ingredients</h1>

      {/* Action bar: add, delete, search */}
      <ActionBar
        onAdd={() => openAddModal()}
        addDisabled={selectedItems.length > 0}
        onDelete={handleDeleteSelected}
        deleteDisabled={selectedItems.length === 0}
        isDeleting={actionLoading}
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search"
      />

      {/* Table + filters */}
      <div className="bg-gray-50 rounded-sm border border-gray-300 max-w-[95vw]  shadow-sm responsive-customer-table ">
        <div className=" rounded-sm table-container">
          <table className="min-w-full divide-y max-h-[800px] divide-gray-200   table-fixed">
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
                  <span className="absolute left-0 top-[15%] h-[70%] w-[2px] bg-gray-300"></span>
                </th>
                <th className="relative px-4 py-3 text-left">
                  Name
                  <span className="absolute left-0 top-[15%] h-[70%] w-[2px] bg-gray-300"></span>
                </th>

                <th className="relative px-4 py-3 text-left">
                  <div className="flex  flex-col gap-1">
                    <DropdownMenu.Root modal={false}>
                      <DropdownMenu.Trigger className="px-2 py-1 rounded text-sm bg-transparent border-none outline-none hover:bg-transparent flex items-center gap-2 focus:outline-none focus:ring-0 cursor-pointer">
                        {statusFilter || "Status"}
                        <ChevronDown
                          size={14}
                          className="text-gray-500 ml-auto"
                        />
                      </DropdownMenu.Trigger>

                      <DropdownMenu.Portal>
                        <DropdownMenu.Content
                          className="min-w-[240px] rounded-sm bg-white shadow-md border-none p-1 relative outline-none"
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
                            className="px-3 py-1 text-sm cursor-pointer hover:bg-red-100 text-red-400 rounded outline-none"
                            onClick={() => setStatusFilter("Inactive")}
                          >
                            Inactive
                          </DropdownMenu.Item>
                          <DropdownMenu.Item
                            className="px-3 py-1 text-sm cursor-pointer hover:bg-green
                            -100 text-green-400 rounded outline-none"
                            onClick={() => setStatusFilter("Active")}
                          >
                            Active
                          </DropdownMenu.Item>
                        </DropdownMenu.Content>
                      </DropdownMenu.Portal>
                    </DropdownMenu.Root>
                  </div>
                  <span className="absolute left-0 top-[15%] h-[70%] w-[1.5px] bg-gray-300"></span>
                </th>

                <th className="relative px-4 py-3 text-left">
                  Description
                  <span className="absolute left-0 top-[15%] h-[70%] w-[1.5px] bg-gray-300"></span>
                </th>
                <th className="relative px-4 py-3 text-left">
                  Unit
                  <span className="absolute left-0 top-[15%] h-[70%] w-[1.5px] bg-gray-300"></span>
                </th>
                <th className="relative px-4 py-3 text-left">
                  Priority
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
                  <td className="px-6 py-8 card-checkbox-cell" >
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

                  <td className="px-4 py-4 whitespace-nowrap" data-label="ID">{item.ID}</td>
                  <td className="px-4 py-4 whitespace-nowrap card-name-cell" data-label="Name">{item.Name}</td>

                  <td className="px-4 py-4 whitespace-nowrap" data-label="Status">
                    <span
                      className={`inline-block w-24 text-right  py-[2px] rounded-sm text-xs font-medium 
                  ${item.Status === "Inactive"
                          ? "text-red-400 "
                          : ""
                        }
                 
                  ${item.Status === "Active"
                          ? "text-green-400 "
                          : ""
                        }
                `}
                    >
                      {item.Status}
                    </span>
                  </td>

                  <td className="px-4 py-4 whitespace-nowrap" data-label="Description">
                    {item.Description}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap" data-label="Unit">{item.Unit}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600" data-label="Priority">
                    {item.Priority}
                  </td>

                  <td className="px-4 py-4 whitespace-nowrap card-actions-cell" data-label="Actions" onClick={(e) => e.stopPropagation()}>
                    <ResponsiveEditButton
                      onClick={(e) => {
                        e.stopPropagation();
                        openEditModal(item);
                      }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Add/Edit */}
      {modalOpen && (
        <div className="fixed inset-0  bg-black/30 backdrop-blur-sm flex items-center justify-center z-71">
          <div className="bg-white rounded-sm p-6 min-w-[35vw] max-w-2xl max-h-[70vh] min-h-[70vh] shadow-lg relative flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">
                {editItem ? "Edit Ingredients" : "Add New Ingredients"}
              </h2>
            </div>

            {/* Scrollable Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 overflow-y-auto pr-1">
              {/* Name */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.Name}
                  onChange={(e) =>
                    setFormData({ ...formData, Name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#d9d9e1]"
                  placeholder="Enter item name"
                  required
                />
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.Description}
                  onChange={(e) =>
                    setFormData({ ...formData, Description: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#d9d9e1]"
                  placeholder="Enter description"
                  required
                />
              </div>

              {/* Unit */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Unit
                </label>
                <input
                  type="text"
                  value={formData.Unit}
                  onChange={(e) =>
                    setFormData({ ...formData, Unit: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#d9d9e1]"
                  placeholder="Unit (e.g. Kg, Bottles)"
                />
              </div>

              {/* Priority */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <input
                   type="text"
                      value={formData.Priority || ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        // Only allow numbers and empty string
                        if (value === '' || /^\d+$/.test(value)) {
                          setFormData({
                            ...formData,
                            Priority: value === '' ? 0 : Number(value)
                          });
                        }
                        // If invalid input, just ignore it (don't update state)
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#d9d9e1]"
                      placeholder="1"
                      min={1}
                      required
                />
              </div>

              {/* Status */}
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <div className="flex items-center gap-3">
                  <ButtonPage
                    checked={formData.Status === "Active"}
                    onChange={handleStatusChange}
                  />
                </div>
              </div>
            </div>

            {/* Fixed Action Buttons */}
            <div className="flex flex-col p-2 md:flex-row gap-3 pt-6 justify-end md:pr-6 border-t border-gray-200 mt-6">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                disabled={actionLoading}
                className="px-6 py-2 border border-gray-300 rounded-sm hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed order-2 md:order-1"
              >
                <X size={16} />
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveItem}
                disabled={!formData.Name.trim() || actionLoading}
                className={`px-6 py-2 rounded-sm transition-colors flex items-center justify-center gap-2 order-1 md:order-2 ${!formData.Name.trim() || actionLoading
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-[#2C2C2C] text-white hover:bg-gray-700"
                  }`}
              >
                {actionLoading ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-b-2 border-white rounded-full"></div>
                    {editItem ? "Updating..." : "Saving..."}
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    {editItem ? "Update Item" : "Add Item"}
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

      export default IngredientsManagementPage;
