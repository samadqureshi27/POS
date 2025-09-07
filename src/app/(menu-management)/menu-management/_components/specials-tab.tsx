import React from "react";
import ButtonPage from "@/components/layout/UI/button";

interface MenuItem {
  ID: number;
  Name: string;
  Price: number;
  Category: string;
  StockQty: string;
  Status: "Active" | "Inactive";
  status: ("Active" | "Inactive")[];
  Description?: string;
  MealType?: string;
  Priority?: number;
  MinimumQuantity?: number;
  ShowOnMenu?: "Active" | "Inactive";
  Featured?: "Active" | "Inactive";
  StaffPick?: "Active" | "Inactive";
  DisplayType?: string;
  Displaycat?: string;
  SpecialStartDate?: string;
  SpecialEndDate?: string;
  SpecialPrice?: number;
  OptionValue?: string[];
  OptionPrice?: number[];
  MealValue?: string[];
  MealPrice?: number[];
  PName?: string[];
  PPrice?: number[];
  OverRide?: ("Active" | "Inactive")[];
  ShowOnMain?: "Active" | "Inactive";
  SubTBE?: "Active" | "Inactive";
  Deal?: "Active" | "Inactive";
  Special?: "Active" | "Inactive";
}

interface SpecialsTabProps {
  formData: Omit<MenuItem, "ID">;
  setFormData: React.Dispatch<React.SetStateAction<Omit<MenuItem, "ID">>>;
  handleStatusChange: (field: keyof Omit<MenuItem, "ID">, isActive: boolean) => void;
}

const SpecialsTab: React.FC<SpecialsTabProps> = ({ formData, setFormData, handleStatusChange }) => {
  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">Special</label>
        <ButtonPage
          checked={formData.Special === "Active"}
          onChange={(checked) => handleStatusChange("Special", checked)}
        />
      </div>

      {/* Special Dates */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="relative">
          <label className="absolute -top-2 left-2 bg-white px-1 text-xs font-medium text-gray-700">
            Special Start Date
          </label>
          <input
            type="date"
            value={formData.SpecialStartDate}
            onChange={(e) =>
              setFormData({
                ...formData,
                SpecialStartDate: e.target.value,
              })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#d9d9e1]"
          />
        </div>

        <div className="relative">
          <label className="absolute -top-2 left-2 bg-white px-1 text-xs font-medium text-gray-700">
            Special End Date
          </label>
          <input
            type="date"
            value={formData.SpecialEndDate}
            onChange={(e) =>
              setFormData({
                ...formData,
                SpecialEndDate: e.target.value,
              })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#d9d9e1]"
          />
        </div>
      </div>

      {/* Special Price */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Special Price</label>
        <input
          type="text"
          value={formData.SpecialPrice || ""}
          onChange={(e) => {
            const value = e.target.value;
            // Only allow numbers and empty string
            if (value === "" || /^\d+$/.test(value)) {
              setFormData({
                ...formData,
                SpecialPrice: value === "" ? 0 : Number(value),
              });
            }
            // If invalid input, just ignore it (don't update state)
          }}
          className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#d9d9e1]"
          placeholder="499.00"
        />
      </div>
    </div>
  );
};

export default SpecialsTab;