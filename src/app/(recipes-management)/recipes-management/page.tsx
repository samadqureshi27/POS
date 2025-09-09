"use client";

import React, { useState, useEffect } from "react";
import ActionBar from "@/components/layout/UI/ActionBar";
import RecipeTable from "./_components/recipe-table";
import RecipeModal from "./_components/recipe-modal";
import {Toast} from "@/components/layout/UI/Toast";

import MenuAPI, { RecipeOption, Ingredient } from "@/lib/util/RecipeAPI";

const RecipesManagementPage = () => {
  const [RecipeOptions, setRecipeOptions] = useState<RecipeOption[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<"" | "Active" | "Inactive">("");
  const [actionLoading, setActionLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingItem, setEditingItem] = useState<RecipeOption | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    loadRecipeOptions();
    loadIngredients();
  }, []);

  const loadIngredients = async () => {
    try {
      const response = await MenuAPI.getIngredients();
      if (response.success) {
        setIngredients(response.data);
      }
    } catch (error) {
      console.error("Error fetching ingredients:", error);
    }
  };

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

  const filteredItems = RecipeOptions.filter((item) => {
    const matchesSearch = item.Name.toLowerCase().includes(
      searchTerm.toLowerCase()
    );
    const matchesStatus = statusFilter === "" || item.Status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateItem = async (itemData: Omit<RecipeOption, "ID">) => {
    try {
      setActionLoading(true);
      const response = await MenuAPI.createRecipeOption(itemData);
      if (response.success) {
        setRecipeOptions((prevItems) => [...prevItems, response.data]);
        setIsModalOpen(false);
        setSearchTerm("");
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
    setSelectedItems(checked ? filteredItems.map((item) => item.ID) : []);
  };

  const handleSelectItem = (itemId: number, checked: boolean) => {
    setSelectedItems(
      checked
        ? [...selectedItems, itemId]
        : selectedItems.filter((id) => id !== itemId)
    );
  };

  const handleModalSubmit = (data: Omit<RecipeOption, "ID">) => {
    if (editingItem) {
      handleUpdateItem(data);
    } else {
      handleCreateItem(data);
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
    <div className="bg-gray-50 min-w-full h-full overflow-y-auto thin-scroll">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <h1 className="text-3xl font-semibold mt-14 mb-8">Recipes</h1>

      {/* Action bar: add, delete, search */}
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

      {/* Recipe Table */}
      <RecipeTable
        items={filteredItems}
        selectedItems={selectedItems}
        statusFilter={statusFilter}
        onSelectAll={handleSelectAll}
        onSelectItem={handleSelectItem}
        onStatusFilterChange={setStatusFilter}
        onEditItem={handleEditItem}
      />

      {/* Recipe Modal */}
      <RecipeModal
        isOpen={isModalOpen}
        editingItem={editingItem}
        ingredients={ingredients}
        onClose={handleCloseModal}
        onSubmit={handleModalSubmit}
        actionLoading={actionLoading}
        showToast={showToast}
      />
    </div>
  );
};

export default RecipesManagementPage;