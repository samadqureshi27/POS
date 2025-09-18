import React from "react";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RecipeOption } from "@/lib/util/recipeApi";

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
        <Label className="text-sm font-medium">
          Recipe Name
        </Label>
        <Input
          type="text"
          value={formData.Name}
          onChange={(e) => handleInputChange("Name", e.target.value)}
          placeholder="Enter recipe name"
          required
        />
      </div>

      {/* Priority */}
      <div>
        <Label className="text-sm font-medium">
          Priority
        </Label>
        <Input
          type="text"
          value={formData.Priority || ""}
          onChange={(e) => {
            const value = e.target.value;
            if (value === "" || /^\d+$/.test(value)) {
              handleInputChange("Priority", value === "" ? 0 : Number(value));
            }
          }}
          placeholder="1"
          min={1}
          required
        />
      </div>

      {/* Description */}
      <div>
        <Label className="text-sm font-medium">
          Description
        </Label>
        <Input
          type="text"
          value={formData.Description}
          onChange={(e) => handleInputChange("Description", e.target.value)}
          placeholder="Enter description"
        />
      </div>

      {/* Status */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
        <Label className="text-sm font-medium">
          Status
        </Label>
        <Switch
          checked={formData.Status === "Active"}
          onCheckedChange={onStatusChange}
        />
      </div>
    </div>
  );
};

export default RecipeInfoTab;