// components/ui/period-selector.tsx
import React, { useRef, useEffect, useState } from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";
import { formatDisplayDate } from '@/lib/util/formatters';

interface PeriodSelectorProps {
  selectedPeriod: string;
  onPeriodChange: (period: string) => void;
  showDatePicker: boolean;
  setShowDatePicker: (show: boolean) => void;
  customDateRange: any[];
  setCustomDateRange: (range: any[]) => void;
}

export const PeriodSelector: React.FC<PeriodSelectorProps> = ({
  selectedPeriod,
  onPeriodChange,
  showDatePicker,
  setShowDatePicker,
  customDateRange,
  setCustomDateRange
}) => {
  const periods = ["Today", "Week", "Month", "Quarter", "Year", "Custom"];
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({
    from: customDateRange?.[0]?.startDate,
    to: customDateRange?.[0]?.endDate,
  });

  // Update local state when customDateRange changes
  useEffect(() => {
    setDateRange({
      from: customDateRange?.[0]?.startDate,
      to: customDateRange?.[0]?.endDate,
    });
  }, [customDateRange]);

  return (
    <div className="mb-6 relative">
      {/* Period Buttons using shadcn ToggleGroup */}
      <div className="flex mb-6 sm:mb-8 relative max-w-[88vw]">
        <div className="flex overflow-x-auto pb-2 gap-2 w-full hide-scrollbar">
          {periods.slice(0, -1).map((period) => (
            <button
              key={period}
              onClick={() => {
                onPeriodChange(period);
                setShowDatePicker(false);
              }}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-sm transition-colors border flex-shrink-0 whitespace-nowrap",
                selectedPeriod === period
                  ? "bg-[#2C2C2C] text-white border-[#2C2C2C]"
                  : "bg-white text-gray-600 border-gray-300 hover:bg-gray-100"
              )}
            >
              {period}
            </button>
          ))}

          {/* Custom date range with shadcn Popover */}
          <Popover open={showDatePicker} onOpenChange={setShowDatePicker}>
            <PopoverTrigger asChild>
              <button
                onClick={() => {
                  onPeriodChange("Custom");
                  setShowDatePicker(!showDatePicker);
                }}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-sm transition-colors border flex-shrink-0 whitespace-nowrap",
                  selectedPeriod === "Custom"
                    ? "bg-[#2C2C2C] text-white border-[#2C2C2C]"
                    : "bg-white text-gray-600 border-gray-300 hover:bg-gray-100"
                )}
              >
                <CalendarIcon size={16} />
                <span>
                  {selectedPeriod === "Custom" &&
                    customDateRange?.[0]?.startDate &&
                    customDateRange?.[0]?.endDate
                    ? `${formatDisplayDate(customDateRange[0].startDate)} - ${formatDisplayDate(customDateRange[0].endDate)}`
                    : "Custom"}
                </span>
              </button>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto p-0"
              align="center"
              side="bottom"
            >
              <Calendar
                mode="range"
                defaultMonth={dateRange?.from}
                selected={dateRange as any}
                onSelect={(range: any) => {
                  if (range) {
                    setDateRange(range);
                    if (range.from && range.to) {
                      // Update the original format for compatibility
                      const newCustomDateRange = [{
                        startDate: range.from,
                        endDate: range.to,
                        key: "selection",
                      }];
                      setCustomDateRange(newCustomDateRange);
                      setShowDatePicker(false);

                      // Trigger data loading with the new date range
                      onPeriodChange("Custom");
                    }
                  }
                }}
                numberOfMonths={1}
                className="rounded-md border"
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <style jsx global>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};