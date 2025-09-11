import React from "react";
import ButtonPage from "@/components/layout/ui/button";
import { RecipeOption } from "@/lib/util/recipe-api";

interface RecipeInfoTabProps {
  formData: Omit<RecipeOption, "ID">;
  onFormDataChange: (data: Omit<RecipeOption, "ID">) => void;
  onStatusChange: (isActive: boolean) => void;
}

const RecipeInfoTab: React.FC<RecipeInfoTabProps> = ({
  formData,
  onFormDataChange,
  onStatusChange,
}) => {
  const handleInputChange = (field: keyof Omit<RecipeOption, "ID">, value: any) => {
    onFormDataChange({
      ...formData,
      [field]: value,
    });
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Recipe Name
        </label>
        <input
          type="text"
          value={formData.Name}
          onChange={(e) => handleInputChange("Name", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#d9d9e1]"
          placeholder="Enter recipe name"
          required
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
            if (value === "" || /^\d+$/.test(value)) {
              handleInputChange("Priority", value === "" ? 0 : Number(value));
            }
          }}
          className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#d9d9e1]"
          placeholder="1"
          min={1}
          required
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <input
          type="text"
          value={formData.Description}
          onChange={(e) => handleInputChange("Description", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#d9d9e1]"
          placeholder="Enter description"
        />
      </div>

      {/* Status */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
        <label className="block text-sm font-medium text-gray-700">
          Status
        </label>
        <ButtonPage
          checked={formData.Status === "Active"}
          onChange={onStatusChange}
        />
      </div>
    </div>
  );
};

export default RecipeInfoTab;