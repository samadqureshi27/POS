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
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">Special</Label>
        <Switch
          checked={formData.Special === "Active"}
          onCheckedChange={(checked) => handleStatusChange("Special", checked)}
        />
      </div>

      {/* Special Dates */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <Label className="text-sm font-medium">
            Special Start Date
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !formData.SpecialStartDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.SpecialStartDate ? (
                  format(new Date(formData.SpecialStartDate), "PPP")
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
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
        </div>

        <div>
          <Label className="text-sm font-medium">
            Special End Date
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !formData.SpecialEndDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.SpecialEndDate ? (
                  format(new Date(formData.SpecialEndDate), "PPP")
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
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
        </div>
      </div>

      {/* Special Price */}
      <div>
        <Label className="text-sm font-medium">Special Price</Label>
        <Input
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
          placeholder="499.00"
        />
      </div>
    </div>
  );
};

export default SpecialsTab;