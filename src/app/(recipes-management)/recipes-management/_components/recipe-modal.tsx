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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-lg lg:max-w-2xl h-[85vh] max-h-[700px] flex flex-col"
        showCloseButton={false}
      >
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl md:text-2xl">
            {editingItem ? "Edit Recipe" : "Add Recipe"}
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-3 flex-shrink-0">
            <TabsTrigger value="Recipe Info">Recipe Info</TabsTrigger>
            <TabsTrigger value="Ingredients">Ingredients</TabsTrigger>
            <TabsTrigger value="Recipe Option">Recipe Options</TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-y-auto mt-4">
            <TabsContent value="Recipe Info" className="mt-0">
              <RecipeInfoTab
                formData={formData}
                onFormDataChange={setFormData}
                onStatusChange={handleStatusChange}
              />
            </TabsContent>

            <TabsContent value="Recipe Option" className="mt-0">
              <RecipeIngredientsTab
                formData={formData}
                ingredients={availableRecipeOptions}
                onFormDataChange={setFormData}
                tabType="option"
              />
            </TabsContent>

            <TabsContent value="Ingredients" className="mt-0">
              <RecipeIngredientsTab
                formData={formData}
                ingredients={ingredients}
                onFormDataChange={setFormData}
                tabType="ingredient"
              />
            </TabsContent>
          </div>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 pb-2 justify-end border-t border-gray-200 flex-shrink-0 bg-white">
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
      </DialogContent>
    </Dialog>
  );
};

export default RecipeModal;