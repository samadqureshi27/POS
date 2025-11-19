/**
 * Centralized Formatting Utilities
 *
 * All formatting functions in one place to eliminate scattered
 * .toLocaleString(), .toFixed(), padStart() calls across the codebase.
 *
 * Usage:
 *   import { formatCurrency, formatID, formatPrice } from '@/lib/util/formatters';
 */

import { format } from "date-fns";

// ============================================================================
// CURRENCY & NUMBER FORMATTING
// ============================================================================

/**
 * Format number as currency with locale-specific formatting
 * @example formatCurrency(1234.56) // "1,234.56" (en-US) or "1.234,56" (de-DE)
 */
export function formatCurrency(value: number, currency?: string): string {
  if (currency) {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: currency,
    }).format(value);
  }
  return value.toLocaleString();
}

/**
 * Format price with 2 decimal places
 * @example formatPrice(42.5) // "42.50"
 */
export function formatPrice(value: number): string {
  return value.toFixed(2);
}

/**
 * Format decimal number with specified precision
 * @example formatDecimal(12.567, 1) // "12.6"
 * @example formatDecimal(42.5) // "42.5" (default 1 decimal)
 */
export function formatDecimal(value: number, decimals: number = 1): string {
  return value.toFixed(decimals);
}

/**
 * Format number with thousands separator
 * @example formatNumber(1234567) // "1,234,567"
 */
export function formatNumber(value: number): string {
  return value.toLocaleString();
}

/**
 * Format large numbers with K/M/B suffix
 * @example formatCompactNumber(1500) // "1.5K"
 */
export function formatCompactNumber(value: number): string {
  if (value >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toFixed(1)}B`;
  }
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M`;
  }
  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(1)}K`;
  }
  return value.toString();
}

/**
 * Format chart tick values (thousands)
 * @example formatTickValue(5000) // "5K"
 */
export function formatTickValue(value: number): string {
  return `${(value / 1000).toFixed(0)}K`;
}

// ============================================================================
// ID FORMATTING
// ============================================================================

/**
 * Format ID with leading zeros (3 digits)
 * @example formatID(5) // "#005"
 */
export function formatID(id: string | number): string {
  return `#${String(id).padStart(3, "0")}`;
}

/**
 * Format staff ID with leading zeros
 * @example formatStaffId("12") // "#012"
 */
export function formatStaffId(id: string): string {
  return `#${String(id).padStart(3, "0")}`;
}

/**
 * Format branch ID with leading zeros
 * @example formatBranchId(7) // "#007"
 */
export function formatBranchId(id: number): string {
  return `#${String(id).padStart(3, "0")}`;
}

// ============================================================================
// DATE & TIME FORMATTING
// ============================================================================

/**
 * Format date for display (DD.MM.YYYY)
 * @example formatDisplayDate(new Date()) // "18.01.2025"
 */
export function formatDisplayDate(date: Date): string {
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
}

/**
 * Format date with time
 * @example formatDateTime(new Date()) // "18 Jan 2025, 14:30"
 */
export function formatDateTime(date: Date): string {
  return format(date, "dd MMM yyyy, HH:mm");
}

/**
 * Format time only
 * @example formatTime(new Date()) // "14:30"
 */
export function formatTime(date: Date): string {
  return format(date, "HH:mm");
}

/**
 * Get day abbreviation
 * @example getDayAbbreviation("Monday") // "Mon"
 */
export function getDayAbbreviation(day: string): string {
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
}

/**
 * Get period label for analytics
 */
export function getPeriodLabel(
  selectedPeriod: string,
  customDateRange?: any[]
): string {
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
}

// ============================================================================
// SPECIFIC FORMAT FUNCTIONS
// ============================================================================

/**
 * Format CNIC (Pakistani ID) with dashes
 * @example formatCNIC("1234567890123") // "12345-6789012-3"
 */
export function formatCNIC(value: string): string {
  const digits = value.replace(/\D/g, "");

  if (digits.length <= 5) {
    return digits;
  } else if (digits.length <= 12) {
    return `${digits.slice(0, 5)}-${digits.slice(5)}`;
  } else {
    return `${digits.slice(0, 5)}-${digits.slice(5, 12)}-${digits.slice(12, 13)}`;
  }
}

/**
 * Format phone number
 * @example formatPhone("1234567890") // "+1 (234) 567-890"
 */
export function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, "");

  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  if (digits.length === 11) {
    return `+${digits.slice(0, 1)} (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
  }
  return value;
}

/**
 * Format decimal as percentage
 * @example formatPercentage(0.125) // "12.5%"
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${(value * 100).toFixed(decimals)}%`;
}

/**
 * Format raw percentage value
 * @example formatPercentageValue(12.5) // "12.5%"
 */
export function formatPercentageValue(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Truncate text with ellipsis
 * @example truncateText("Long text here", 10) // "Long text..."
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
}

/**
 * Format file size
 * @example formatFileSize(1536) // "1.5 KB"
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}
