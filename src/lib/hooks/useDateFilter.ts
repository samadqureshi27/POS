import { useState, useRef, useEffect } from 'react';
import { DateRange, DateFilterHook } from '@/types/payroll';

export const useDateFilter = (defaultPeriod: string = "Week"): DateFilterHook => {
    const periods = ["Today", "Week", "Month", "Quarter", "Year", "Custom"];
    const [activeTimePeriod, setActiveTimePeriod] = useState(defaultPeriod);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [customDateRange, setCustomDateRange] = useState<DateRange[]>([
        {
            startDate: new Date(),
            endDate: new Date(),
            key: "selection",
        },
    ]);

    const calendarRef = useRef<HTMLDivElement>(null);

    const formatDisplayDate = (date: Date): string => {
        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const year = date.getFullYear();
        return `${day}.${month}.${year}`;
    };

    // Helper function to get date ranges with proper boundary handling
    const getDateRange = (period: string): { start: Date; end: Date } | null => {
        const today = new Date();

        const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0, 0);
        const endOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999);

        switch (period) {
            case "Today":
                return { start: startOfToday, end: endOfToday };

            case "Week": {
                const startOfWeek = new Date(today);
                startOfWeek.setDate(today.getDate() - today.getDay());
                startOfWeek.setHours(0, 0, 0, 0);

                const endOfWeek = new Date(startOfWeek);
                endOfWeek.setDate(startOfWeek.getDate() + 6);
                endOfWeek.setHours(23, 59, 59, 999);

                return { start: startOfWeek, end: endOfWeek };
            }

            case "Month": {
                const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1, 0, 0, 0, 0);
                const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999);
                return { start: startOfMonth, end: endOfMonth };
            }

            case "Quarter": {
                const currentMonth = today.getMonth();
                const quarter = Math.floor(currentMonth / 3);
                const startOfQuarter = new Date(today.getFullYear(), quarter * 3, 1, 0, 0, 0, 0);
                const endOfQuarter = new Date(today.getFullYear(), quarter * 3 + 3, 0, 23, 59, 59, 999);
                return { start: startOfQuarter, end: endOfQuarter };
            }

            case "Year": {
                const startOfYear = new Date(today.getFullYear(), 0, 1, 0, 0, 0, 0);
                const endOfYear = new Date(today.getFullYear(), 11, 31, 23, 59, 59, 999);
                return { start: startOfYear, end: endOfYear };
            }

            case "Custom":
                if (customDateRange?.[0]?.startDate && customDateRange?.[0]?.endDate) {
                    const rangeStart = new Date(customDateRange[0].startDate);
                    rangeStart.setHours(0, 0, 0, 0);
                    const rangeEnd = new Date(customDateRange[0].endDate);
                    rangeEnd.setHours(23, 59, 59, 999);
                    return { start: rangeStart, end: rangeEnd };
                }
                return null;

            default:
                return null;
        }
    };

    // Handle click outside calendar
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
    }, []);

    return {
        activeTimePeriod,
        setActiveTimePeriod,
        showDatePicker,
        setShowDatePicker,
        customDateRange,
        setCustomDateRange,
        calendarRef,
        getDateRange,
        formatDisplayDate,
        periods,
    };
};