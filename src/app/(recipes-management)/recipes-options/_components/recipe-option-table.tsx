import React, { useState, useEffect } from "react";
import { Edit2, UtensilsCrossed, Package, ChevronDown } from "lucide-react";
import { DataTable, DataTableColumn, DataTableAction } from "@/components/ui/data-table";
import { RecipeVariant, DisplayFilterType } from "@/lib/types/recipe-options";
import { RecipeService, Recipe } from "@/lib/services/recipe-service";

interface RecipeVariantTableProps {
  items: RecipeVariant[];
  selectedItems: string[];
  searchTerm: string;
  displayFilter: DisplayFilterType;
  onSelectAll: (checked: boolean) => void;
  onSelectItem: (itemId: string, checked: boolean) => void;
  onEditItem: (item: RecipeVariant) => void;
}

const RecipeVariantTable: React.FC<RecipeVariantTableProps> = ({
  items,
  selectedItems,
  searchTerm,
  displayFilter,
  onSelectAll,
  onSelectItem,
  onEditItem,
}) => {
  const [availableRecipes, setAvailableRecipes] = useState<Recipe[]>([]);

  // Load available recipes for name mapping
  useEffect(() => {
    const loadRecipes = async () => {
      try {
        const recipesResponse = await RecipeService.listRecipes();
        if (recipesResponse.success && recipesResponse.data) {
          setAvailableRecipes(recipesResponse.data);
        }
      } catch (error) {
        console.error("Error loading recipes:", error);
      }
    };

    loadRecipes();
  }, []);

  // Helper function to get recipe name by ID
  const getRecipeName = (recipeId: string) => {
    const recipe = availableRecipes.find(r => r._id === recipeId);
    return recipe?.name || "Unknown Recipe";
  };

  // Helper function to format variant type
  const formatVariantType = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  // Helper function to format cost adjustment
  const formatCostAdjustment = (cost: number) => {
    if (cost === 0) return "No change";
    return cost > 0 ? `+$${cost.toFixed(2)}` : `-$${Math.abs(cost).toFixed(2)}`;
  };

  // Helper function to format size multiplier
  const formatSizeMultiplier = (multiplier: number) => {
    if (multiplier === 1) return "Standard";
    return `${multiplier}x`;
  };

  // Helper function to get ingredient count
  const getIngredientCount = (ingredients: any[]) => {
    return ingredients?.length || 0;
  };

  const filteredItems = items.filter((item) => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getRecipeName(item.recipeId).toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.crustType && item.crustType.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesFilter = 
      displayFilter === "all" || 
      item.type === displayFilter;

    return matchesSearch && matchesFilter;
  });

  const isAllSelected =
    selectedItems.length === filteredItems.length && filteredItems.length > 0;

  const columns: DataTableColumn<RecipeVariant>[] = [
    {
      key: "id",
      title: "ID",
      dataIndex: "_id",
      width: "100px",
      render: (value) => value ? `#${value.slice(-6)}` : "N/A"
    },
    {
      key: "recipeName",
      title: "Base Recipe",
      dataIndex: "recipeId",
      width: "200px",
      render: (value) => (
        <div className="flex items-center gap-2">
          <UtensilsCrossed className="h-4 w-4 text-gray-500" />
          <span className="font-medium">{getRecipeName(value)}</span>
        </div>
      )
    },
    {
      key: "variantName",
      title: "Variant Name",
      dataIndex: "name",
      width: "200px",
      render: (value) => (
        <span className="font-medium text-gray-900">{value}</span>
      )
    },
    {
      key: "type",
      title: "Type",
      dataIndex: "type",
      width: "120px",
      render: (value) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          value === "size" ? "bg-blue-100 text-blue-800" :
          value === "flavor" ? "bg-green-100 text-green-800" :
          value === "crust" ? "bg-purple-100 text-purple-800" :
          "bg-gray-100 text-gray-800"
        }`}>
          {formatVariantType(value)}
        </span>
      )
    },
    {
      key: "sizeMultiplier",
      title: "Size",
      dataIndex: "sizeMultiplier",
      width: "100px",
      render: (value) => (
        <span className={`font-medium ${
          value === 1 ? "text-gray-600" : 
          value > 1 ? "text-green-600" : "text-orange-600"
        }`}>
          {formatSizeMultiplier(value || 1)}
        </span>
      )
    },
    {
      key: "costAdjustment",
      title: "Cost Adjustment",
      dataIndex: "baseCostAdjustment",
      width: "140px",
      render: (value) => (
        <span className={`font-medium ${
          value === 0 ? "text-gray-600" : 
          value > 0 ? "text-red-600" : "text-green-600"
        }`}>
          {formatCostAdjustment(value || 0)}
        </span>
      )
    },
    {
      key: "crustType",
      title: "Crust Type",
      dataIndex: "crustType",
      width: "140px",
      render: (value) => (
        <span className="text-gray-700">
          {value || "Standard"}
        </span>
      )
    },
    {
      key: "ingredients",
      title: "Ingredients",
      dataIndex: "ingredients",
      width: "120px",
      render: (value) => (
        <div className="flex items-center gap-1">
          <Package className="h-4 w-4 text-gray-500" />
          <span className="text-sm text-gray-600">
            {getIngredientCount(value)} items
          </span>
        </div>
      )
    },
    {
      key: "description",
      title: "Description",
      dataIndex: "description",
      width: "200px",
      render: (value) => (
        <span className="text-sm text-gray-600 truncate" title={value}>
          {value || "No description"}
        </span>
      )
    }
  ];

  const actions: DataTableAction<RecipeVariant>[] = [
    {
      key: "edit",
      label: "Edit Variant",
      icon: <Edit2 className="h-4 w-4" />,
      onClick: (item) => onEditItem(item)
    }
  ];

  const emptyMessage = searchTerm || displayFilter !== "all"
    ? "No recipe variants match your search criteria."
    : "No recipe variants found. Create your first variant to get started.";

  return (
    <DataTable
      data={filteredItems}
      columns={columns}
      actions={actions}
      selectable={true}
      selectedItems={selectedItems}
      onSelectAll={onSelectAll}
      onSelectItem={onSelectItem}
      getRowId={(item) => item._id || ""}
      maxHeight="600px"
      emptyMessage={emptyMessage}
      mobileResponsive={true}
      nameColumn="variantName"
    />
  );
};

export default RecipeVariantTable;