// utils.ts - Utility functions

import { format } from "date-fns";

export const formatDisplayDate = (date: Date): string => {
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
};

export const getPeriodLabel = (
  selectedPeriod: string, 
  customDateRange?: any[]
): string => {
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
      return `This quarter (Q${quarter + 1}), ${format(start, "dd MMM")} - ${format(
        end,
        "dd MMM yyyy"
      )}`;
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
        return `${format(customDateRange[0].startDate, "dd MMM yyyy")} - ${format(
          customDateRange[0].endDate,
          "dd MMM yyyy"
        )}`;
      }
      return "Custom range";
    }
    default:
      return "";
  }
};

export const formatCurrency = (value: number): string => {
  return value.toLocaleString();
};

export const formatTickValue = (value: number): string => {
  return `${(value / 1000).toFixed(0)}K`;
};

export const getDayAbbreviation = (day: string): string => {
  const dayMap: { [key: string]: string } = {
    Monday: "Mon",
    Tuesday: "Tue",
    Wednesday: "Wed",
    Thursday: "Thu",
    Friday: "Fri",
    Saturday: "Sat",
    Sunday: "Sun",
  };
  return dayMap[day] || day;
};