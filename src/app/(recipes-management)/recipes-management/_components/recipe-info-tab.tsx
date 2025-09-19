import React from "react";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RecipeOption } from "@/lib/types/recipes";

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
    <div className="pr-1 py-4 space-y-6">
      {/* Header Section 
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-800 mb-2">
          Recipe Information
        </h3>
        <p className="text-xs text-gray-500 mb-4">
          Configure the basic details and settings for this recipe
        </p>
      </div> */}

      {/* Recipe Details Section */}
      <div className="space-y-6">
        {/* Recipe Name and Status Row */}
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <Label htmlFor="recipeName" className="text-sm font-medium text-gray-700">
              Recipe Name <span className="text-red-500">*</span>
            </Label>
            <p className="text-xs text-gray-500 mb-2">
              Name that will appear in the system and menus
            </p>
            <Input
              id="recipeName"
              type="text"
              value={formData.Name}
              onChange={(e) => handleInputChange("Name", e.target.value)}
              placeholder="Enter recipe name (e.g., Special Sauce, Custom Marinade)"
              required
              className="transition-all duration-200 focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          {/* Status Toggle */}
          <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50/50 border border-gray-200">
            <div>
              <Label className="text-sm font-medium text-gray-700">
                Active Status
              </Label>
              <p className="text-xs text-gray-500">Enable this recipe</p>
            </div>
            <Switch
              checked={formData.Status === "Active"}
              onCheckedChange={onStatusChange}
            />
          </div>
        </div>

        {/* Priority */}
        <div>
          <Label htmlFor="priority" className="text-sm font-medium text-gray-700">
            Priority
          </Label>
          <p className="text-xs text-gray-500 mb-2">
            Display order in recipe lists (lower numbers appear first)
          </p>
          <Input
            id="priority"
            type="number"
            value={formData.Priority || ""}
            onChange={(e) => {
              const value = e.target.value;
              if (value === "" || /^\d+$/.test(value)) {
                handleInputChange("Priority", value === "" ? 0 : Number(value));
              }
            }}
            placeholder="1"
            min={1}
            className="w-full sm:w-32 transition-all duration-200 focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        {/* Description */}
        <div>
          <Label htmlFor="description" className="text-sm font-medium text-gray-700">
            Description
          </Label>
          <p className="text-xs text-gray-500 mb-2">
            Brief description of the recipe (optional)
          </p>
          <Textarea
            id="description"
            value={formData.Description}
            onChange={(e) => handleInputChange("Description", e.target.value)}
            placeholder="Brief description of this recipe..."
            className="min-h-[80px] resize-none transition-all duration-200 focus:ring-2 focus:ring-blue-500/20"
            rows={3}
            style={{
              height: 'auto',
              minHeight: '80px',
              maxHeight: '120px'
            }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = 'auto';
              target.style.height = Math.min(target.scrollHeight, 120) + 'px';
            }}
          />
        </div>

        {/* Information Card */}
        <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
            <div>
              <h4 className="text-sm font-medium text-blue-800 mb-1">Next Steps</h4>
              <p className="text-xs text-blue-700">
                After configuring the recipe details, use the "Ingredients" tab to add the required ingredients and the "Recipe Options" tab to set up any customization options.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeInfoTab;