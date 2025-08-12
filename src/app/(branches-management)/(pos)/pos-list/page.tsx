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
  Info,
  Edit,
} from "lucide-react";

interface MenuItem {
  "POS-ID": number;
  POS_Name: string;
  Status: "Active" | "Inactive";
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

const PosListPage = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"" | "Active" | "Inactive">(
    ""
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<MenuItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const [formData, setFormData] = useState({
    POS_Name: "",
    Status: "Active" as "Active" | "Inactive",
  });

  useEffect(() => {
    setTimeout(() => {
      setMenuItems([
        {
          "POS-ID": 1,
          POS_Name: "Main Branch",
          Status: "Active",
        },
        {
          "POS-ID": 2,
          POS_Name: "North Branch",
          Status: "Inactive",
        },
      ]);
      setLoading(false);
    }, 800);
  }, []);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const filteredItems = menuItems.filter((item) => {
    const matchesName = item.POS_Name.toLowerCase().includes(
      searchTerm.toLowerCase()
    );
    const matchesStatus = statusFilter ? item.Status === statusFilter : true;
    return matchesName && matchesStatus;
  });

  const handleDeleteSelected = () => {
    if (selectedItems.length === 0) return;
    setActionLoading(true);
    setTimeout(() => {
      const remaining = menuItems.filter(
        (item) => !selectedItems.includes(item["POS-ID"])
      );
      setMenuItems(remaining);
      setSelectedItems([]);
      setActionLoading(false);
      showToast("Selected POS deleted successfully.", "success");
    }, 600);
  };

  const handleSelectItem = (POSId: number, checked: boolean) => {
    setSelectedItems(
      checked
        ? [...selectedItems, POSId]
        : selectedItems.filter((id) => id !== POSId)
    );
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectedItems(
      checked ? filteredItems.map((item) => item["POS-ID"]) : []
    );
  };

  const handleSaveBranch = () => {
    if (!formData.POS_Name) {
      showToast("Please fill in all required fields.", "error");
      return;
    }

    setActionLoading(true);
    setTimeout(() => {
      if (editItem) {
        setMenuItems((prev) =>
          prev.map((item) =>
            item["POS-ID"] === editItem["POS-ID"]
              ? { ...editItem, ...formData }
              : item
          )
        );
        showToast("POS updated successfully.", "success");
      } else {
        const newItem: MenuItem = {
          "POS-ID": Math.max(0, ...menuItems.map((i) => i["POS-ID"])) + 1,
          ...formData,
        };
        setMenuItems((prev) => [...prev, newItem]);
        showToast("POS added successfully.", "success");
      }

      setModalOpen(false);
      setEditItem(null);
      setFormData({
        POS_Name: "",
        Status: "Active",
      });
      setActionLoading(false);
    }, 1000);
  };

  const isAllSelected =
    selectedItems.length === filteredItems.length && filteredItems.length > 0;
  const isSomeSelected = selectedItems.length > 0;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-b-2 border-yellow-600 rounded-full mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading POS...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 mx-6 bg-gray-50 min-h-screen">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <h1 className="text-3xl font-semibold mb-4 pl-20">POS List</h1>

      {/* Summary Cards */}
      <div className="flex gap-4 mb-6 pl-20">
        <div className="flex items-center justify-start flex-1  gap-2 max-w-[300px] min-h-[100px] rounded-md p-4 bg-white shadow-sm">
          <div>
            <p className="text-6xl  mb-1">{menuItems.length}</p>
            <p className="text-1xl text-gray-500">Total POS</p>
          </div>
        </div>

        <div className="flex items-center justify-start flex-1 gap-2 max-w-[300px] min-h-[100px] rounded-md p-4 bg-white shadow-sm">
          <div>
            <p className="text-6xl  mb-1">
              {menuItems.filter((item) => item.Status === "Active").length}
            </p>
            <p className="text-1xl text-gray-500 ">Active POS</p>
          </div>
        </div>
      </div>

      {/* Branch Management */}
      <div className="mb-6 flex items-center justify-between gap-4 flex-wrap">
        {/* Action Buttons */}
        <div className="flex gap-3  pl-20">
          <button
            onClick={() => {
              if (selectedItems.length > 0) return;
              setEditItem(null);
              setFormData({
                POS_Name: "",
                Status: "Active",
              });
              setModalOpen(true);
            }}
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
            placeholder="Search POS..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d9d9e1]"
          />
        </div>
      </div>

      {/* Branch Table */}
      <div className="bg-gray-50 rounded-lg ml-20 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 border-b border-gray-200">
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
                  POS Name
                  <span className="absolute left-0 top-[15%] h-[70%] w-[2.5px] bg-[#d9d9e1]"></span>
                </th>

                {/* Status Column with Filter */}
                <th className="relative px-4 py-3 text-left">
                  <div className="flex flex-col gap-1">
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
                          className="min-w-[320px] rounded-md bg-white shadow-md border-none p-1 relative outline-none"
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
                            className="px-3 py-1 text-sm cursor-pointer hover:bg-green-100 text-green-700 rounded outline-none"
                            onClick={() => setStatusFilter("Active")}
                          >
                            Active
                          </DropdownMenu.Item>
                          <DropdownMenu.Item
                            className="px-3 py-1 text-sm cursor-pointer hover:bg-red-100 text-red-700 rounded outline-none"
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
                  Actions
                  <span className="absolute left-0 top-[15%] h-[70%] w-[2.5px] bg-[#d9d9e1]"></span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredItems.map((item) => (
                <tr key={item["POS-ID"]} className="bg-white hover:bg-gray-50">
                  <td className="px-4 py-4">
                    <Checkbox
                      checked={selectedItems.includes(item["POS-ID"])}
                      onChange={(e) =>
                        handleSelectItem(item["POS-ID"], e.target.checked)
                      }
                      sx={{
                        color: "#d9d9e1",
                        "&.Mui-checked": { color: "#d9d9e1" },
                      }}
                    />
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    {item.POS_Name}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span
                      className={`inline-block w-20 text-center px-2 py-[2px] rounded-md text-xs font-medium border
      ${item.Status === "Active" ? "text-green-600 border-green-600" : ""}
      ${item.Status === "Inactive" ? "text-red-600 border-red-600" : ""}
    `}
                    >
                      {item.Status}
                    </span>
                  </td>

                  <td className="px-4 py-4 whitespace-nowrap">
                    <button
                      onClick={() => {
                        setEditItem(item);
                        setFormData({
                          POS_Name: item.POS_Name,
                          Status: item.Status,
                        });
                        setModalOpen(true);
                      }}
                      className="text-black hover:text-gray-800 transition-colors"
                    >
                      <Edit size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-[700px]">
            <h2 className="text-xl font-semibold mb-4">
              {editItem ? "Edit Branch" : "New Branch"}
            </h2>
            <div className="mb-4 space-y-2">
              <input
                type="text"
                value={formData.POS_Name}
                onChange={(e) =>
                  setFormData({ ...formData, POS_Name: e.target.value })
                }
                placeholder="Branch Name"
                className="w-full px-4 py-2 border border-gray-300 rounded"
              />
              <select
                value={formData.Status}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    Status: e.target.value as "Active" | "Inactive",
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveBranch}
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

export default PosListPage;

