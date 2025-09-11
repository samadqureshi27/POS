// _components/hooks/useOrderFilters.ts
import { useState, useEffect } from 'react';
import { OrderAPI } from '@/lib/util/OrderAPI';

import { OrderItem, DateRangeType } from '@/lib/types';


export const useOrderFilters = (items: OrderItem[]) => {
  const [filteredItems, setFilteredItems] = useState<OrderItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"" | "Active" | "Inactive">("");
  const [unitFilter, setUnitFilter] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState("Week");
  const [customDate, setCustomDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [customDateRange, setCustomDateRange] = useState<DateRangeType[]>([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const isDateInPeriod = (dateStr: string, period: string): boolean => {
    const [day, month, year] = dateStr.split("-").map(Number);
    const orderDate = new Date(year, month - 1, day);
    const today = new Date();

    switch (period) {
      case "Today":
        return orderDate.toDateString() === today.toDateString();
      case "Week": {
        const start = new Date(today);
        start.setDate(today.getDate() - today.getDay());
        const end = new Date(start);
        end.setDate(start.getDate() + 6);
        return orderDate >= start && orderDate <= end;
      }
      case "Month": {
        return (
          orderDate.getMonth() === today.getMonth() &&
          orderDate.getFullYear() === today.getFullYear()
        );
      }
      case "Quarter": {
        const currentQuarter = Math.floor(today.getMonth() / 3);
        const orderQuarter = Math.floor(orderDate.getMonth() / 3);
        return (
          orderQuarter === currentQuarter &&
          orderDate.getFullYear() === today.getFullYear()
        );
      }
      case "Year": {
        return orderDate.getFullYear() === today.getFullYear();
      }
      case "Custom": {
        if (customDateRange?.[0]?.startDate && customDateRange?.[0]?.endDate) {
          return (
            orderDate >= customDateRange[0].startDate &&
            orderDate <= customDateRange[0].endDate
          );
        }
        return true;
      }
      default:
        return true;
    }
  };

  const formatDate = (date: Date): string => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const applyFilters = async () => {
    try {
      const filters = {
        search: searchTerm,
        status: statusFilter || undefined,
        type: unitFilter || undefined,
        customDate: customDate ? formatDate(customDate) : undefined,
      };

      const response = await OrderAPI.getFilteredOrders(filters);
      if (response.success) {
        // Apply period filtering on top of API filters
        const periodFilteredData = response.data.filter((item) =>
          isDateInPeriod(item.Time_Date, selectedPeriod)
        );

        setFilteredItems(periodFilteredData);
      }
    } catch (error) {
      console.error("Error applying filters:", error);
      setFilteredItems(items); // Fallback to original data
    }
  };

  // Apply filters whenever filter criteria change
  useEffect(() => {
    applyFilters();
  }, [
    searchTerm,
    statusFilter,
    unitFilter,
    customDate,
    selectedPeriod,
    customDateRange,
    items,
  ]);

  const handlePeriodChange = (period: string) => {
    setSelectedPeriod(period);
    setShowDatePicker(false);
  };

  return {
    filteredItems,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    unitFilter,
    setUnitFilter,
    selectedPeriod,
    handlePeriodChange,
    customDate,
    setCustomDate,
    showDatePicker,
    setShowDatePicker,
    customDateRange,
    setCustomDateRange,
  };
};