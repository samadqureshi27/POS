"use client";

import React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {SpecialsTabProps} from "@/lib/types/menum";

const SpecialsTab: React.FC<SpecialsTabProps> = ({ formData, setFormData, handleStatusChange }) => {
  return (
    <div className="flex-1 overflow-y-auto pr-1 py-4 space-y-6 pl-1">
      {/* Header Section */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-800 mb-2">
          Special Offers
        </h3>
        <p className="text-xs text-gray-500 mb-4">
          Configure special pricing and promotional periods for this menu item
        </p>

        {/* Special Toggle */}
        <div className="flex items-center gap-3 p-4 rounded-lg bg-gray-50/50 border border-gray-200">
          <div className="flex-1">
            <Label className="text-sm font-medium text-gray-700">
              Enable Special Offer
            </Label>
            <p className="text-xs text-gray-500 mt-0.5">
              Activate special pricing for this item
            </p>
          </div>
          <Switch
            checked={formData.Special === "Active"}
            onCheckedChange={(checked) => handleStatusChange("Special", checked)}
          />
        </div>
      </div>

      {/* Special Configuration - Only show when special is enabled */}
      {formData.Special === "Active" && (
        <div className="space-y-6">
          <h4 className="text-sm font-medium text-gray-700 pb-2 border-b border-gray-100">
            Special Configuration
          </h4>

          {/* Special Price */}
          <div>
            <Label htmlFor="specialPrice" className="text-sm font-medium text-gray-700">
              Special Price <span className="text-destructive">*</span>
            </Label>
            <Input
              id="specialPrice"
              type="number"
              step="0.01"
              min="0"
              value={formData.SpecialPrice || ""}
              onChange={(e) => {
                const value = e.target.value;
                setFormData({
                  ...formData,
                  SpecialPrice: value === "" ? 0 : Number(value),
                });
              }}
              placeholder="0.00"
              className="mt-1 transition-all duration-200 focus:ring-2 focus:ring-blue-500/20"
            />
            <p className="text-xs text-gray-500 mt-1">
              Promotional price for this item during the special period
            </p>
          </div>

          {/* Special Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-700">
                Start Date
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal mt-1 transition-all duration-200 focus:ring-2 focus:ring-blue-500/20",
                      !formData.SpecialStartDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.SpecialStartDate ? (
                      format(new Date(formData.SpecialStartDate), "PPP")
                    ) : (
                      <span>Select start date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 z-[100]">
                  <Calendar
                    mode="single"
                    selected={formData.SpecialStartDate ? new Date(formData.SpecialStartDate) : undefined}
                    onSelect={(date) =>
                      setFormData({
                        ...formData,
                        SpecialStartDate: date ? format(date, "yyyy-MM-dd") : "",
                      })
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <p className="text-xs text-gray-500 mt-1">When the special offer begins</p>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700">
                End Date
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal mt-1 transition-all duration-200 focus:ring-2 focus:ring-blue-500/20",
                      !formData.SpecialEndDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.SpecialEndDate ? (
                      format(new Date(formData.SpecialEndDate), "PPP")
                    ) : (
                      <span>Select end date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 z-[100]">
                  <Calendar
                    mode="single"
                    selected={formData.SpecialEndDate ? new Date(formData.SpecialEndDate) : undefined}
                    onSelect={(date) =>
                      setFormData({
                        ...formData,
                        SpecialEndDate: date ? format(date, "yyyy-MM-dd") : "",
                      })
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <p className="text-xs text-gray-500 mt-1">When the special offer ends</p>
            </div>
          </div>

          {/* Special Preview */}
          {formData.SpecialPrice && formData.SpecialStartDate && formData.SpecialEndDate && (
            <div className="p-4 rounded-lg bg-green-50 border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <h5 className="text-sm font-medium text-green-800">Special Offer Preview</h5>
              </div>
              <div className="text-sm text-green-700">
                <strong>${formData.SpecialPrice}</strong> special price from{" "}
                <strong>{format(new Date(formData.SpecialStartDate), "MMM dd, yyyy")}</strong> to{" "}
                <strong>{format(new Date(formData.SpecialEndDate), "MMM dd, yyyy")}</strong>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Disabled State */}
      {formData.Special !== "Active" && (
        <div className="text-center py-8 bg-gray-50/50 rounded-lg border-2 border-dashed border-gray-200">
          <div className="text-gray-400 mb-2">
            <svg className="w-10 h-10 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h4 className="text-sm font-medium text-gray-600 mb-1">Special offers disabled</h4>
          <p className="text-xs text-gray-500">
            Enable the special offer toggle above to configure promotional pricing
          </p>
        </div>
      )}
    </div>
  );
};

export default SpecialsTab;