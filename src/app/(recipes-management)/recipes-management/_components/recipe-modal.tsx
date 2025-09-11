import React, { useState, useEffect } from "react";
import { X, Save } from "lucide-react";
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
  onClose: () => void;
  onSubmit: (data: Omit<RecipeOption, "ID">) => void;
  actionLoading: boolean;
  showToast: (message: string, type: "success" | "error") => void;
}

const RecipeModal: React.FC<RecipeModalProps> = ({
  isOpen,
  editingItem,
  ingredients,
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-71">
      <div className="bg-white rounded-sm min-w-[35vw] max-w-2xl md:min-h-[70vh] max-h-[70vh] overflow-hidden shadow-lg relative flex flex-col">
        {/* Header */}
        <h1 className="text-2xl pl-5 pt-2 font-medium">
          {editingItem ? "Edit Recipe" : "Add Recipe"}
        </h1>

        {/* Tab Navigation */}
        <div className="flex md:w-[350px] items-center justify-center border-b border-gray-200 mx-auto">
          {["Recipe Info", "Ingredients", "Recipe Option"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === tab
                  ? "border-b-2 border-black text-black"
                  : "text-gray-500 hover:text-black hover:bg-gray-50"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Modal Content */}
        <div className="p-3 sm:p-6 flex-1 overflow-hidden">
          {activeTab === "Recipe Info" && (
            <RecipeInfoTab
              formData={formData}
              onFormDataChange={setFormData}
              onStatusChange={handleStatusChange}
            />
          )}

          {activeTab === "Recipe Option" && (
            <RecipeIngredientsTab
              formData={formData}
              ingredients={ingredients}
              onFormDataChange={setFormData}
              tabType="option"
            />
          )}

          {activeTab === "Ingredients" && (
            <RecipeIngredientsTab
              formData={formData}
              ingredients={ingredients}
              onFormDataChange={setFormData}
              tabType="ingredient"
            />
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col p-2 md:flex-row gap-3 pt-6 justify-end md:pr-6 border-t border-gray-200 mt-6">
          <button
            type="button"
            onClick={onClose}
            disabled={actionLoading}
            className="px-6 py-2 border border-gray-300 rounded-sm hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed order-2 md:order-1"
          >
            <X size={16} />
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!formData.Name.trim() || actionLoading}
            className={`px-6 py-2 rounded-sm transition-colors flex items-center justify-center gap-2 order-1 md:order-2 ${
              !formData.Name.trim() || actionLoading
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-[#2C2C2C] text-white hover:bg-gray-700"
            }`}
          >
            {actionLoading ? (
              <>
                <div className="animate-spin h-4 w-4 border-b-2 border-white rounded-full"></div>
                {editingItem ? "Updating..." : "Saving..."}
              </>
            ) : (
              <>
                <Save size={16} />
                {editingItem ? "Update Item" : "Add Item"}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecipeModal;