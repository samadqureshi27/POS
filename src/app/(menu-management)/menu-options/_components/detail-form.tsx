// components/DetailsForm.tsx
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MenuItemOptions,DetailsFormProps } from '@/lib/types/menuItemOptions';



const DetailsForm: React.FC<DetailsFormProps> = ({ formData, onFormDataChange }) => {
  return (
    <div className="space-y-4 sm:space-y-6 md:space-y-8 pb-4">
      {/* Name */}
      <div>
        <Label className="text-sm font-medium">
          Name
        </Label>
        <Input
          type="text"
          value={formData.Name}
          onChange={(e) =>
            onFormDataChange({ ...formData, Name: e.target.value })
          }
          placeholder="Enter option name"
        />
      </div>

      {/* Display Type */}
      <div>
        <Label className="text-sm font-medium">
          Display Type
        </Label>
        <Select
          value={formData.DisplayType}
          onValueChange={(value) => onFormDataChange({ ...formData, DisplayType: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Display Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Radio">Radio</SelectItem>
            <SelectItem value="Select">Select</SelectItem>
            <SelectItem value="Checkbox">Checkbox</SelectItem>
          </SelectContent>
        </Select>
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
            // Only allow numbers and empty string
            if (value === '' || /^\d+$/.test(value)) {
              onFormDataChange({
                ...formData,
                Priority: value === '' ? 0 : Number(value)
              });
            }
            // If invalid input, just ignore it (don't update state)
          }}
          placeholder="1"
          min={1}
          required
        />
      </div>
    </div>
  );
};

export default DetailsForm;