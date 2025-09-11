"use client";

import React, { useState, useEffect } from "react";
import ActionBar from "@/components/layout/ui/action-bar";
import { MenuAPI, RecipeOption } from "@/lib/util/recipe-option-api";
import {Toast} from "@/components/layout/ui/toast";
import LoadingSpinner from "@/components/layout/ui/Loader";
import RecipeModal from "./_components/recipe-option-modal";
import RecipeTable from "./_components/recipe-option-table";

const CategoryPage = () => {
  const [RecipeOptions, setRecipeOptions] = useState<RecipeOption[]>([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingItem, setEditingItem] = useState<RecipeOption | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [DisplayFilter, setDisplayFilter] = useState<
    "" | "Radio" | "Select" | "Checkbox"
  >("");

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    loadRecipeOptions();
  }, []);

  const loadRecipeOptions = async () => {
    try {
      setLoading(true);
      const response = await MenuAPI.getRecipeOption();
      if (response.success) {
        setRecipeOptions(response.data);
      } else {
        throw new Error(response.message || "Failed to fetch category items");
      }
    } catch (error) {
      console.error("Error fetching category items:", error);
      showToast("Failed to load category items", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateItem = async (itemData: Omit<RecipeOption, "ID">) => {
    try {
      setActionLoading(true);
      const response = await MenuAPI.createRecipeOption(itemData);
      if (response.success) {
        setRecipeOptions((prevItems) => [...prevItems, response.data]);
        setIsModalOpen(false);
        setSearchTerm("");
        setDisplayFilter("");
        showToast(response.message || "Item created successfully", "success");
      }
    } catch (error) {
      console.error("Error creating item:", error);
      showToast("Failed to create menu item", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateItem = async (itemData: Omit<RecipeOption, "ID">) => {
    if (!editingItem) return;
    try {
      setActionLoading(true);
      const response = await MenuAPI.updateRecipeOption(
        editingItem.ID,
        itemData
      );
      if (response.success) {
        setRecipeOptions(
          RecipeOptions.map((item) =>
            item.ID === editingItem.ID ? response.data : item
          )
        );
        setIsModalOpen(false);
        setEditingItem(null);
        showToast(response.message || "Item updated successfully", "success");
      }
    } catch (error) {
      showToast("Failed to update menu item", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedItems.length === 0) return;
    try {
      setActionLoading(true);
      const response = await MenuAPI.bulkDeleteRecipeOption(selectedItems);
      if (response.success) {
        setRecipeOptions((prev) => {
          const remaining = prev.filter((i) => !selectedItems.includes(i.ID));
          return remaining.map((it, idx) => ({ ...it, ID: idx + 1 }));
        });
        setSelectedItems([]);
        showToast(response.message || "Items deleted successfully", "success");
      }
    } catch (error) {
      showToast("Failed to delete menu items", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleSelectAll = (checked: boolean) => {
    const filteredItems = RecipeOptions.filter((item) =>
      item.Name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setSelectedItems(checked ? filteredItems.map((item) => item.ID) : []);
  };

  const handleSelectItem = (itemId: number, checked: boolean) => {
    setSelectedItems(
      checked
        ? [...selectedItems, itemId]
        : selectedItems.filter((id) => id !== itemId)
    );
  };

  const handleModalSubmit = (formData: Omit<RecipeOption, "ID">) => {
    if (editingItem) {
      handleUpdateItem(formData);
    } else {
      handleCreateItem(formData);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleEditItem = (item: RecipeOption) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

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

      <h1 className="text-3xl font-semibold mt-14 mb-8">Recipe Options</h1>

      {/* Action bar */}
      <ActionBar
        onAdd={() => setIsModalOpen(true)}
        addDisabled={selectedItems.length > 0}
        onDelete={handleDeleteSelected}
        deleteDisabled={selectedItems.length === 0}
        isDeleting={actionLoading}
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search"
      />

      {/* Table */}
      <RecipeTable
        items={RecipeOptions}
        selectedItems={selectedItems}
        searchTerm={searchTerm}
        displayFilter={DisplayFilter}
        onSelectAll={handleSelectAll}
        onSelectItem={handleSelectItem}
        onEditItem={handleEditItem}
      />

      {/* Modal */}
      <RecipeModal
        isOpen={isModalOpen}
        editingItem={editingItem}
        onClose={handleCloseModal}
        onSubmit={handleModalSubmit}
        actionLoading={actionLoading}
      />
    </div>
  );
};

export default CategoryPage;