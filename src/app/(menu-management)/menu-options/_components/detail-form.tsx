// components/DetailsForm.tsx
import React from 'react';
import { ChevronDown } from 'lucide-react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { MenuItemOptions } from '@/types/interfaces';

interface DetailsFormProps {
  formData: Omit<MenuItemOptions, "ID">;
  onFormDataChange: (data: Omit<MenuItemOptions, "ID">) => void;
}

const DetailsForm: React.FC<DetailsFormProps> = ({ formData, onFormDataChange }) => {
  return (
    <div className="space-y-4 sm:space-y-6 md:space-y-8 pb-4">
      {/* Name */}
      <div>
        <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1 sm:mb-2">
          Name
        </label>
        <input
          type="text"
          value={formData.Name}
          onChange={(e) =>
            onFormDataChange({ ...formData, Name: e.target.value })
          }
          className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#d9d9e1]"
          placeholder="Enter option name"
        />
      </div>

      {/* Display Type */}
      <div>
        <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1 sm:mb-2">
          Display Type
        </label>
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-sm flex items-center justify-between bg-white outline-none hover:bg-gray-50 focus:ring-2 focus:ring-[#d9d9e1]">
              <span>
                {formData.DisplayType || "Select Display Type"}
              </span>
              <ChevronDown size={14} className="text-gray-500" />
            </button>
          </DropdownMenu.Trigger>

          <DropdownMenu.Portal>
            <DropdownMenu.Content
              className="min-w-[220px] sm:min-w-[280px] rounded-sm bg-white shadow-md border border-gray-200 p-1 outline-none z-[72]"
              sideOffset={6}
            >
              <DropdownMenu.Arrow className="fill-white stroke-gray-200 w-5 h-3" />
              <DropdownMenu.Item
                className="px-3 py-2 text-sm sm:text-base cursor-pointer hover:bg-gray-100 rounded outline-none"
                onClick={() =>
                  onFormDataChange({ ...formData, DisplayType: "Radio" })
                }
              >
                Radio
              </DropdownMenu.Item>
              <DropdownMenu.Item
                className="px-3 py-2 text-sm sm:text-base cursor-pointer hover:bg-gray-100 rounded outline-none"
                onClick={() =>
                  onFormDataChange({
                    ...formData,
                    DisplayType: "Select",
                  })
                }
              >
                Select
              </DropdownMenu.Item>
              <DropdownMenu.Item
                className="px-3 py-2 text-sm sm:text-base cursor-pointer hover:bg-gray-100 rounded outline-none"
                onClick={() =>
                  onFormDataChange({
                    ...formData,
                    DisplayType: "Checkbox",
                  })
                }
              >
                Checkbox
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>

      {/* Priority */}
      <div>
        <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1 sm:mb-2">
          Priority
        </label>
        <input
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
          className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#d9d9e1]"
          placeholder="1"
          min={1}
          required
        />
      </div>
    </div>
  );
};

export default DetailsForm;