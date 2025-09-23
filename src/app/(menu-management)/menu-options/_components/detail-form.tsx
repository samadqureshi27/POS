// components/DetailsForm.tsx
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MenuItemOptions, DetailsFormProps } from '@/lib/types/menuItemOptions';

const DetailsForm: React.FC<DetailsFormProps> = ({ formData, onFormDataChange }) => {
  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Fixed Header Section - Non-scrollable */}
      <div className="flex-shrink-0 space-y-4 p-6 bg-white">
        <div>
          <h3 className="text-sm font-semibold text-gray-800">
            Option Details
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            Configure the basic settings for this menu item option
          </p>
        </div>
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 min-h-0 overflow-y-auto px-6 pb-6">
        <div className="space-y-6">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="optionName" className="text-sm font-medium text-gray-700">
              Option Name <span className="text-red-500">*</span>
            </Label>
            <p className="text-xs text-gray-500">
              Name of the option that will appear in the POS system
            </p>
            <Input
              id="optionName"
              type="text"
              value={formData.Name}
              onChange={(e) =>
                onFormDataChange({ ...formData, Name: e.target.value })
              }
              placeholder="Enter option name (e.g., Size, Toppings)"
              className="transition-all duration-200 focus:ring-2 focus:ring-blue-500/20 w-full min-w-0"
            />
          </div>

          {/* Display Type and Priority Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Display Type */}
            <div className="space-y-2 min-w-0">
              <Label htmlFor="displayType" className="text-sm font-medium text-gray-700">
                Display Type <span className="text-red-500">*</span>
              </Label>
              <p className="text-xs text-gray-500">
                How options will be displayed to customers
              </p>
              <Select
                value={formData.DisplayType}
                onValueChange={(value) => onFormDataChange({ ...formData, DisplayType: value as "Radio" | "Select" | "Checkbox" })}
              >
                <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-blue-500/20 w-full min-w-0">
                  <SelectValue placeholder="Select display type" />
                </SelectTrigger>
                <SelectContent className="z-[100]">
                  <SelectItem value="Radio">Radio - Select only one option</SelectItem>
                  <SelectItem value="Select">Select - Select one or none</SelectItem>
                  <SelectItem value="Checkbox">Checkbox - Select one or more</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Priority */}
            <div className="space-y-2 min-w-0">
              <Label htmlFor="priority" className="text-sm font-medium text-gray-700">
                Priority
              </Label>
              <p className="text-xs text-gray-500">
                Display order in the POS (lower numbers appear first)
              </p>
              <Input
                id="priority"
                type="number"
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
                className="transition-all duration-200 focus:ring-2 focus:ring-blue-500/20 w-full min-w-0"
              />
            </div>
          </div>

          {/* Information Card */}
          <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <div className="min-w-0 flex-1">
                <h4 className="text-sm font-medium text-blue-800 mb-1">Next Step</h4>
                <p className="text-xs text-blue-700 leading-relaxed">
                  After saving the option details, switch to the "Option Values" tab to add the specific choices customers can select from.
                </p>
              </div>
            </div>
          </div>

          {/* Additional spacing for better scroll experience */}
          <div className="h-4"></div>
        </div>
      </div>
    </div>
  );
};

export default DetailsForm;