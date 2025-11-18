/**
 * Status Helper Utilities
 *
 * Centralized functions for status-related operations across the application.
 * Eliminates duplicate getStatus/getStatusColor/getStatusVariant functions.
 */

import type { BadgeProps } from "@/components/ui/badge";

/**
 * Status types used across the application
 */
export type OrderStatus = "Completed" | "Pending" | "Cancelled" | "Processing";
export type InventoryStatus = "critical" | "low" | "good" | "normal";
export type ActiveStatus = "Active" | "Inactive";
export type GeneralStatus = string;

/**
 * Get badge variant for order status
 * @param status - Order status
 * @returns Badge variant
 */
export function getOrderStatusVariant(status: OrderStatus): BadgeProps["variant"] {
  const variants: Record<OrderStatus, BadgeProps["variant"]> = {
    "Completed": "default",
    "Pending": "secondary",
    "Cancelled": "destructive",
    "Processing": "outline",
  };
  return variants[status] || "outline";
}

/**
 * Get color class for order status
 * @param status - Order status
 * @returns Tailwind color class
 */
export function getOrderStatusColor(status: OrderStatus): string {
  const colors: Record<OrderStatus, string> = {
    "Completed": "text-green-400",
    "Pending": "text-blue-400",
    "Cancelled": "text-red-400",
    "Processing": "text-yellow-400",
  };
  return colors[status] || "text-gray-400";
}

/**
 * Get color for inventory status
 * @param status - Inventory status
 * @returns Hex color code
 */
export function getInventoryStatusColor(status: InventoryStatus): string {
  const colors: Record<InventoryStatus, string> = {
    "critical": "#ef4444",
    "low": "#f59e0b",
    "good": "#10b981",
    "normal": "#6b7280",
  };
  return colors[status] || "#6b7280";
}

/**
 * Get icon component for inventory status
 * @param status - Inventory status
 * @returns React element with appropriate icon and color
 * @example
 * import { AlertTriangle, CheckCircle, Clock } from "lucide-react";
 * const icon = getInventoryStatusIcon("critical");
 */
export function getInventoryStatusIcon(status: InventoryStatus) {
  // Import icons dynamically to avoid circular dependencies
  // Consumers should import the required icons from lucide-react
  const iconMap = {
    "critical": { name: "AlertTriangle", className: "text-red-500" },
    "low": { name: "Clock", className: "text-amber-500" },
    "good": { name: "CheckCircle", className: "text-green-500" },
    "normal": { name: "CheckCircle", className: "text-gray-500" },
  };
  return iconMap[status] || { name: "CheckCircle", className: "text-gray-500" };
}

/**
 * Get color class for active/inactive status
 * @param status - Active/Inactive status
 * @returns Tailwind color class
 */
export function getActiveStatusColor(status: ActiveStatus): string {
  return status === "Active" ? "text-green-500" : "text-destructive";
}

/**
 * Get badge props for active/inactive status
 * @param status - Active/Inactive status
 * @returns Object with className and variant
 */
export function getActiveStatusBadge(status: ActiveStatus) {
  return status === "Active"
    ? { variant: "default" as const, className: "bg-green-100 text-green-700" }
    : { variant: "destructive" as const, className: "bg-red-100 text-red-700" };
}

/**
 * Get type badge color for order/delivery type
 * @param type - Order type (Dine in, Takeaway, Delivery)
 * @returns Tailwind color class
 */
export function getOrderTypeColor(type: string): string {
  const colors: Record<string, string> = {
    "Dine in": "text-yellow-400",
    "Takeaway": "text-green-400",
    "Delivery": "text-blue-400",
  };
  return colors[type] || "text-gray-400";
}

/**
 * Get badge variant for order type
 * @param type - Order type
 * @returns Badge variant
 */
export function getOrderTypeVariant(type: string): BadgeProps["variant"] {
  const variants: Record<string, BadgeProps["variant"]> = {
    "Dine in": "secondary",
    "Takeaway": "default",
    "Delivery": "outline",
  };
  return variants[type] || "outline";
}

/**
 * Get background color class for status badges
 * @param status - Generic status string
 * @returns Tailwind background class
 */
export function getStatusBgClass(status: string): string {
  const normalized = status.toLowerCase();

  if (normalized.includes("active") || normalized.includes("complete")) {
    return "bg-green-100 text-green-700";
  }

  if (normalized.includes("pending") || normalized.includes("processing") || normalized.includes("progress")) {
    return "bg-blue-100 text-blue-700";
  }

  if (normalized.includes("inactive") || normalized.includes("cancel") || normalized.includes("fail")) {
    return "bg-red-100 text-red-700";
  }

  if (normalized.includes("warning") || normalized.includes("low")) {
    return "bg-yellow-100 text-yellow-700";
  }

  return "bg-gray-100 text-gray-700";
}

/**
 * Check if status is positive/successful
 * @param status - Any status string
 * @returns Boolean indicating success status
 */
export function isSuccessStatus(status: string): boolean {
  const normalized = status.toLowerCase();
  return normalized.includes("complete") ||
         normalized.includes("success") ||
         normalized.includes("active") ||
         normalized.includes("good");
}

/**
 * Check if status is negative/failed
 * @param status - Any status string
 * @returns Boolean indicating failure status
 */
export function isFailureStatus(status: string): boolean {
  const normalized = status.toLowerCase();
  return normalized.includes("cancel") ||
         normalized.includes("failed") ||
         normalized.includes("inactive") ||
         normalized.includes("critical") ||
         normalized.includes("error");
}
