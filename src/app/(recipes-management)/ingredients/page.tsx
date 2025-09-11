"use client";
import React, { useState, useEffect } from "react";
import ActionBar from "@/components/layout/ui/action-bar";
import {Toast} from "@/components/layout/ui/toast";
import LoadingSpinner from "@/components/layout/ui/Loader";
import IngredientsTable from "./_components/ingredients-table";
import IngredientsModal from "./_components/ingredients-modal";

interface InventoryItem {
  ID: string;
  Name: string;
  Status: "Active" | "Inactive";
  Description: string;
  Unit: string;
  Priority: number;
}

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
          Unit: "Kilograms (Kg's)",
          Priority: 1,
        },
        {
          ID: "#002",
          Name: "Oat Bread",
          Status: "Active",
          Description: "Bread ",
          Unit: "Kilograms (Kg's)",
          Priority: 2,
        },
        {
          ID: "#003",
          Name: "French Bread",
          Status: "Inactive",
          Description: "Bread ",
          Unit: "Kilograms (Kg's)",
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

  if (loading) {
    return <LoadingSpinner />;
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

      <h1 className="text-3xl font-semibold mt-14 mb-8">Ingredients</h1>

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
      <IngredientsTable
        filteredItems={filteredItems}
        selectedItems={selectedItems}
        isAllSelected={isAllSelected}
        onSelectAll={handleSelectAll}
        onSelectItem={handleSelectItem}
        onEditItem={openEditModal}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />

      {/* Modal for Add/Edit */}
      <IngredientsModal
        isOpen={modalOpen}
        editItem={editItem}
        formData={formData}
        setFormData={setFormData}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveItem}
        actionLoading={actionLoading}
      />
    </div>
  );
};

export default IngredientsManagementPage;