"use client";

import React from "react";
import { DateRange } from "react-date-range";
import { Calendar } from "lucide-react";
import { DateFilterProps } from "@/lib/types/payroll";

import "react-date-range/dist/styles.css"; // main css
import "react-date-range/dist/theme/default.css"; // theme css

export const DateFilter: React.FC<DateFilterProps> = ({ dateFilter }) => {
    const {
        periods,
        activeTimePeriod,
        setActiveTimePeriod,
        showDatePicker,
        setShowDatePicker,
        customDateRange,
        setCustomDateRange,
        calendarRef,
        formatDisplayDate,
    } = dateFilter;

    return (
        <div className="flex mb-6 sm:mb-8 relative max-w-[88vw]">
            <div className="flex overflow-x-auto pb-2 gap-2 w-full hide-scrollbar">
                {periods.map((period) => (
                    <div key={period} className="relative flex-shrink-0">
                        <button
                            onClick={() => {
                                if (period === "Custom") {
                                    setActiveTimePeriod("Custom");
                                    setShowDatePicker((prev) => !prev);
                                } else {
                                    setActiveTimePeriod(period);
                                    setShowDatePicker(false);
                                }
                            }}
                            className={`flex items-center gap-2 px-4 py-2 rounded-sm transition-colors border ${activeTimePeriod === period
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
                            activeTimePeriod === "Custom" &&
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
                                        onChange={(ranges: any) => {
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
    );
};