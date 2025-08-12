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
  Status: "Active" | "Inactive";
  Role: string;
  Salary: string;
  Shift_Start_Time: string;
  Shift_End_Time: string;
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

const EmployeeRecordsPage = () => {
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
    Status: "Inactive",
    Role: "",
    Salary: "",
    Shift_Start_Time: "",
    Shift_End_Time: "",
  });

  // initial dataset (and rows that say "Cell text")
  useEffect(() => {
    setTimeout(() => {
      setItems([
        {
          ID: "#001",
          Name: "efe",
          Contact: "03001231234",
          Status: "Inactive",
          Role: "Waiter",
          Salary: "30000",
          Shift_Start_Time: "9:00",
          Shift_End_Time: "6:00",
        },
        {
          ID: "#002",
          Name: "andd",
          Contact: "03001234567",
          Status: "Inactive",
          Role: "Cashier",
          Salary: "50000",
          Shift_Start_Time: "9:00",
          Shift_End_Time: "6:00",
        },
        {
          ID: "#003",
          Name: "ghie",
          Contact: "03001231238",
          Status: "Active",
          Role: "Cleaner",
          Salary: "15000",
          Shift_Start_Time: "9:00",
          Shift_End_Time: "6:00",
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
      Status: "Inactive",
      Role: "",
      Salary: "",
      Shift_Start_Time: "",
      Shift_End_Time: "",
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

      {/* Action bar: add, delete, search */}
      <div className="mb-6 flex items-center justify-between gap-4 flex-wrap">
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
                            onClick={() => setStatusFilter("Inactive")}
                          >
                            Inactive
                          </DropdownMenu.Item>

                          <DropdownMenu.Item
                            className="px-3 py-1 text-sm cursor-pointer hover:bg-green-100 text-green-700 rounded outline-none"
                            onClick={() => setStatusFilter("Active")}
                          >
                            Active
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
                  Salary
                  <span className="absolute left-0 top-[15%] h-[70%] w-[2.5px] bg-[#d9d9e1]"></span>
                </th>
                <th className="relative px-4 py-3 text-left">
                  Shift Start Time
                  <span className="absolute left-0 top-[15%] h-[70%] w-[2.5px] bg-[#d9d9e1]"></span>
                </th>
                <th className="relative px-4 py-3 text-left">
                  Shift End Time
                  <span className="absolute left-0 top-[15%] h-[70%] w-[2.5px] bg-[#d9d9e1]"></span>
                </th>

                <th className="relative px-4 py-3 text-left">
                  Actions
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
                  <td className="px-4 py-4 whitespace-nowrap">{item.Role}</td>
                  <td className="px-4 py-4 whitespace-nowrap">{item.Salary}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                    {item.Shift_Start_Time}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                    {item.Shift_End_Time}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditModal(item)}
                        className="text-black hover:text-gray-800 transition-colors"
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
                  value={formData.ID}
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
                      Status: e.target.value as Staffitmes["Status"],
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded"
                >
                  <option value="Active">Active</option>

                  <option value="Inactive">Inactive</option>
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
                <label className="block text-sm text-gray-600 mb-1">Role</label>
                <input
                  type="text"
                  value={formData.Role}
                  onChange={(e) =>
                    setFormData({ ...formData, Role: e.target.value })
                  }
                  placeholder="Unit (e.g. Kg, Bottles)"
                  className="w-full px-4 py-2 border border-gray-300 rounded"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Contact
                </label>
                <input
                  type="text"
                  value={formData.Contact}
                  onChange={(e) =>
                    setFormData({ ...formData, Contact: e.target.value })
                  }
                  placeholder="Contact"
                  className="w-full px-4 py-2 border border-gray-300 rounded"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Salary
                </label>
                <input
                  type="text"
                  value={formData.Salary}
                  onChange={(e) =>
                    setFormData({ ...formData, Salary: e.target.value })
                  }
                  placeholder="Salary"
                  className="w-full px-4 py-2 border border-gray-300 rounded"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Shift Start Time
                </label>
                <input
                  type="text"
                  value={formData.Shift_Start_Time}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      Shift_Start_Time: e.target.value,
                    })
                  }
                  placeholder="Shift Start Time"
                  className="w-full px-4 py-2 border border-gray-300 rounded"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Shift End Time
                </label>
                <input
                  type="text"
                  value={formData.Shift_End_Time}
                  onChange={(e) =>
                    setFormData({ ...formData, Shift_End_Time: e.target.value })
                  }
                  placeholder="Shift End Time"
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

export default EmployeeRecordsPage;
