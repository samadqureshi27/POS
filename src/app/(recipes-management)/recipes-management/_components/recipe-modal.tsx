import React, { useState, useEffect } from "react";
import { X, Save } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import RecipeInfoTab from "./recipe-info-tab";
import RecipeIngredientsTab from "./recipe-ingredient";

interface RecipeOption {
  ID: number;
  Name: string;
  Status: "Active" | "Inactive";
  Description: string;
  OptionValue: string[];
  OptionPrice: number[];
  IngredientValue: string[];
  IngredientPrice: number[];
  Priority: number;
}

interface Ingredient {
  ID: number;
  Name: string;
  Unit: string;
}

interface RecipeModalProps {
  isOpen: boolean;
  editingItem: RecipeOption | null;
  ingredients: Ingredient[];
  availableRecipeOptions: any[];
  onClose: () => void;
  onSubmit: (data: Omit<RecipeOption, "ID">) => void;
  actionLoading: boolean;
  showToast: (message: string, type?: "success" | "error" | "warning" | "info") => void;
}

const RecipeModal: React.FC<RecipeModalProps> = ({
  isOpen,
  editingItem,
  ingredients,
  availableRecipeOptions,
  onClose,
  onSubmit,
  actionLoading,
  showToast,
}) => {
  const [activeTab, setActiveTab] = useState("Recipe Info");
  const [formData, setFormData] = useState<Omit<RecipeOption, "ID">>({
    Name: "",
    Status: "Inactive",
    Description: "",
    OptionValue: [],
    OptionPrice: [],
    IngredientValue: [],
    IngredientPrice: [],
    Priority: 1,
  });

  useEffect(() => {
    if (editingItem) {
      setFormData({
        Name: editingItem.Name,
        Status: editingItem.Status,
        Description: editingItem.Description,
        OptionValue: editingItem.OptionValue || [],
        OptionPrice: editingItem.OptionPrice || [],
        IngredientValue: editingItem.IngredientValue || [],
        IngredientPrice: editingItem.IngredientPrice || [],
        Priority: editingItem.Priority,
      });
    } else {
      setFormData({
        Name: "",
        Status: "Inactive",
        Description: "",
        OptionValue: [],
        OptionPrice: [],
        IngredientValue: [],
        IngredientPrice: [],
        Priority: 0,
      });
    }
  }, [editingItem, isOpen]);

  useEffect(() => {
    if (isOpen) {
      setActiveTab("Recipe Info");
    }
  }, [isOpen, editingItem]);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleStatusChange = (isActive: boolean) => {
    setFormData({
      ...formData,
      Status: isActive ? "Active" : "Inactive",
    });
  };

  const handleSubmit = () => {
    if (!formData.Name.trim()) {
      showToast("Please enter a recipe name", "error");
      return;
    }
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" style={{ display: isOpen ? 'flex' : 'none' }}>
      <div className="relative bg-white rounded-lg shadow-xl border w-[95vw] max-w-lg lg:max-w-2xl h-[90vh] max-h-[800px] flex flex-col overflow-hidden">
        {/* Header - Fixed and Centered */}
        <div className="px-6 py-4 border-b border-gray-200 bg-white flex-shrink-0">
          <div className="flex items-center justify-center relative">
            <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900">
              {editingItem ? "Edit Recipe" : "Add Recipe"}
            </h2>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="absolute right-0 text-gray-400 hover:text-gray-600"
              disabled={actionLoading}
            >
              <X size={20} />
            </Button>
          </div>
        </div>

        {/* Tabs Container - Flexible with proper overflow */}
        <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col h-full">
            {/* Tab List - Fixed and Centered */}
            <div className="px-6 pt-4 pb-0 flex justify-center flex-shrink-0">
              <TabsList className="grid grid-cols-3 w-full max-w-md">
                <TabsTrigger value="Recipe Info" className="text-xs sm:text-sm">Recipe Info</TabsTrigger>
                <TabsTrigger value="Ingredients" className="text-xs sm:text-sm">Ingredients</TabsTrigger>
                <TabsTrigger value="Recipe Option" className="text-xs sm:text-sm">Recipe Options</TabsTrigger>
              </TabsList>
            </div>

            {/* Tab Content - Scrollable */}
            <div className="flex-1 overflow-hidden">
              <TabsContent value="Recipe Info" className="h-full m-0 px-6">
                <div className="h-full overflow-y-auto">
                  <RecipeInfoTab
                    formData={formData}
                    onFormDataChange={setFormData}
                    onStatusChange={handleStatusChange}
                  />
                </div>
              </TabsContent>

              <TabsContent value="Recipe Option" className="h-full m-0 px-6">
                <div className="h-full overflow-y-auto">
                  <RecipeIngredientsTab
                    formData={formData}
                    ingredients={availableRecipeOptions}
                    onFormDataChange={setFormData}
                    tabType="option"
                  />
                </div>
              </TabsContent>

              <TabsContent value="Ingredients" className="h-full m-0 px-6">
                <div className="h-full overflow-y-auto">
                  <RecipeIngredientsTab
                    formData={formData}
                    ingredients={ingredients}
                    onFormDataChange={setFormData}
                    tabType="ingredient"
                  />
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>

        {/* Action Buttons - Fixed */}
        <div className="flex gap-3 px-6 py-4 justify-end border-t border-gray-200 flex-shrink-0 bg-white">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={actionLoading}
          >
            <X size={16} />
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={!formData.Name.trim() || actionLoading}
          >
            {actionLoading ? (
              <>
                <div className="animate-spin h-4 w-4 border-b-2 border-white rounded-full"></div>
                {editingItem ? "Updating..." : "Saving..."}
              </>
            ) : (
              <>
                <Save size={16} />
                {editingItem ? "Update Recipe" : "Save & Close"}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RecipeModal;