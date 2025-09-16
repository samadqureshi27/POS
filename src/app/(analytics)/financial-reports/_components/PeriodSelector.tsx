// components/filters/PeriodSelector.tsx
import React, { useRef, useEffect, useState } from 'react';
import { Calendar } from 'lucide-react';
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css"; // main css
import "react-date-range/dist/theme/default.css"; // theme css

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
  const calendarRef = useRef<HTMLDivElement>(null);

  const formatDisplayDate = (date: Date) => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  // Close calendar when clicking outside
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

  return (
    <div className="mb-6 relative">
      {/* Period Buttons */}
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

              {/* Calendar dropdown attached to Custom button */}
              {period === "Custom" &&
                selectedPeriod === "Custom" &&
                showDatePicker && (
                  <div
                    ref={calendarRef}
                    className="fixed z-50 mt-2 w-64 h-64 md:w-80 md:h-80 bg-white shadow-lg border border-gray-200 rounded-sm"
                    style={{
                      top: '120px', // Adjust based on your header height
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: 'min(320px, calc(100vw - 32px))', // Responsive width
                      height: 'min(320px, calc(100vh - 200px))', // Responsive height
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
                          setCustomDateRange([ranges.selection]);

                          if (ranges.selection.startDate && ranges.selection.endDate) {
                            setShowDatePicker(false);
                          }
                        }
                      }}
                      moveRangeOnFirstSelection={false}
                      className="rounded-lg calendar-mobile-responsive"
                    />
                  </div>
                )}
            </div>
          ))}
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

        .calendar-mobile-responsive {
          width: 100% !important;
        }

        .calendar-mobile-responsive .rdrCalendarWrapper {
          font-size: 12px;
        }

        .calendar-mobile-responsive .rdrDateRangeWrapper {
          width: 100% !important;
        }

        .calendar-mobile-responsive .rdrMonth {
          width: 100% !important;
        }

        .calendar-mobile-responsive .rdrWeekDays {
          padding: 0 !important;
        }

        .calendar-mobile-responsive .rdrDays {
          padding: 0 !important;
        }

        .calendar-mobile-responsive .rdrDay {
          height: 2rem !important;
          line-height: 2rem !important;
        }

        .calendar-mobile-responsive .rdrDayNumber span {
          font-size: 11px !important;
        }

        .calendar-mobile-responsive .rdrMonthName {
          font-size: 14px !important;
        }

        .calendar-mobile-responsive .rdrWeekDay {
          font-size: 10px !important;
          height: 1.5rem !important;
          line-height: 1.5rem !important;
        }

        @media (max-width: 768px) {
          .calendar-mobile-responsive .rdrMonth {
            padding: 0 5px !important;
          }
          
          .calendar-mobile-responsive .rdrDay {
            height: 1.8rem !important;
            line-height: 1.8rem !important;
          }
          
          .calendar-mobile-responsive .rdrDayNumber span {
            font-size: 10px !important;
          }
        }
      `}</style>
    </div>
  );
};