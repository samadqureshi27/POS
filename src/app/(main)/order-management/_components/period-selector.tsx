// _components/Filters/PeriodSelector.tsx
import React, { useRef, useEffect } from 'react';
import { Calendar } from "lucide-react";
import { DateRange } from "react-date-range";
import { format } from "date-fns";

import { DateRangeType } from '@/types';


import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

interface PeriodSelectorProps {
  selectedPeriod: string;
  onPeriodChange: (period: string) => void;
  showDatePicker: boolean;
  setShowDatePicker: (show: boolean) => void;
  customDateRange: DateRangeType[];
  setCustomDateRange: (range: DateRangeType[]) => void;
}

const PeriodSelector: React.FC<PeriodSelectorProps> = ({
  selectedPeriod,
  onPeriodChange,
  showDatePicker,
  setShowDatePicker,
  customDateRange,
  setCustomDateRange,
}) => {
  const periods = ["Today", "Week", "Month", "Quarter", "Year", "Custom"];
  const calendarRef = useRef<HTMLDivElement>(null);

  const formatDisplayDate = (date: Date) => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  // Close date picker when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(event.target as Node)
      ) {
        setShowDatePicker(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setShowDatePicker]);

  const getPeriodLabel = () => {
    const today = new Date();

    switch (selectedPeriod) {
      case "Today":
        return `Today, ${format(today, "dd MMMM yyyy")}`;
      case "Week": {
        const start = new Date(today);
        start.setDate(today.getDate() - today.getDay());
        const end = new Date(start);
        end.setDate(start.getDate() + 6);
        return `This week, ${format(start, "dd MMM")} - ${format(end, "dd MMM yyyy")}`;
      }
      case "Month": {
        const start = new Date(today.getFullYear(), today.getMonth(), 1);
        const end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        return `This month, ${format(start, "dd MMM")} - ${format(end, "dd MMM yyyy")}`;
      }
      case "Quarter": {
        const currentMonth = today.getMonth();
        const quarter = Math.floor(currentMonth / 3);
        const start = new Date(today.getFullYear(), quarter * 3, 1);
        const end = new Date(today.getFullYear(), quarter * 3 + 3, 0);
        return `This quarter (Q${quarter + 1}), ${format(start, "dd MMM")} - ${format(end, "dd MMM yyyy")}`;
      }
      case "Year": {
        const start = new Date(today.getFullYear(), 0, 1);
        const end = new Date(today.getFullYear(), 11, 31);
        return `This year, ${format(start, "dd MMM yyyy")} - ${format(end, "dd MMM yyyy")}`;
      }
      case "Custom": {
        if (
          customDateRange &&
          customDateRange.length > 0 &&
          customDateRange[0].startDate &&
          customDateRange[0].endDate
        ) {
          return `${format(customDateRange[0].startDate, "dd MMM yyyy")} - ${format(customDateRange[0].endDate, "dd MMM yyyy")}`;
        }
        return "Custom range";
      }
      default:
        return "";
    }
  };

  return (
    <div className="flex mb-6 sm:mb-8 relative max-w-[88vw]">
      <div className="flex overflow-x-auto pb-2 gap-2 w-full hide-scrollbar">
        {periods.map((period) => (
          <div key={period} className="relative flex-shrink-0">
            <button
              onClick={() => {
                if (period === "Custom") {
                  onPeriodChange("Custom");
                  setShowDatePicker(!showDatePicker);
                } else {
                  onPeriodChange(period);
                  setShowDatePicker(false);
                }
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-sm transition-colors border ${
                selectedPeriod === period
                  ? "bg-[#2C2C2C] text-white border-[#2C2C2C]"
                  : "bg-white text-gray-600 border-gray-300 hover:bg-gray-100"
              }`}
            >
              {period === "Custom" && <Calendar size={16} />}
              <span className="whitespace-nowrap">
                {period === "Custom" &&
                customDateRange?.[0]?.startDate &&
                customDateRange?.[0]?.endDate
                  ? `${formatDisplayDate(customDateRange[0].startDate)} - ${formatDisplayDate(customDateRange[0].endDate)}`
                  : period}
              </span>
            </button>

            {/* Calendar dropdown */}
            {period === "Custom" &&
              selectedPeriod === "Custom" &&
              showDatePicker && (
                <div
                  ref={calendarRef}
                  className="fixed z-50 mt-2 w-64 h-64 md:w-80 md:h-80 bg-white shadow-lg border border-gray-200 rounded-sm"
                  style={{
                    top: '120px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 'min(320px, calc(100vw - 32px))',
                    height: 'min(320px, calc(100vh - 200px))',
                  }}
                >
                  <DateRange
                    ranges={customDateRange?.length ? customDateRange : [{
                      startDate: new Date(),
                      endDate: new Date(),
                      key: "selection",
                    }]}
                    onChange={(ranges) => {
                      if (ranges.selection) {
                        setCustomDateRange([ranges.selection as DateRangeType]);
                        if (ranges.selection.startDate && ranges.selection.endDate) {
                          setShowDatePicker(false);
                        }
                      }
                    }}
                    moveRangeOnFirstSelection={false}
                    className="rounded-sm calendar-mobile-responsive"
                  />
                </div>
              )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PeriodSelector;