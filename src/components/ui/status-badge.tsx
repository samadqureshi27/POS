"use client";
// Status Badge Component following shadcn/ui patterns
import React from "react";
import { cn } from "@/lib/utils";

export interface StatusBadgeProps {
  status: string;
  variant?: "default" | "success" | "warning" | "destructive" | "secondary";
  className?: string;
}

const statusVariants = {
  default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
  success: "border-transparent bg-green-500 text-white hover:bg-green-500/80",
  warning: "border-transparent bg-yellow-500 text-white hover:bg-yellow-500/80",
  destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
  secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
};

const getStatusVariant = (status: string): StatusBadgeProps["variant"] => {
  const lowerStatus = status.toLowerCase();
  
  if (lowerStatus.includes("active") || lowerStatus.includes("enabled") || lowerStatus.includes("completed") || lowerStatus.includes("success")) {
    return "success";
  }
  if (lowerStatus.includes("inactive") || lowerStatus.includes("disabled") || lowerStatus.includes("cancelled") || lowerStatus.includes("failed")) {
    return "destructive";
  }
  if (lowerStatus.includes("pending") || lowerStatus.includes("processing") || lowerStatus.includes("warning")) {
    return "warning";
  }
  if (lowerStatus.includes("draft") || lowerStatus.includes("archived")) {
    return "secondary";
  }
  
  return "default";
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  variant,
  className
}) => {
  const badgeVariant = variant || getStatusVariant(status);
  
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        statusVariants[badgeVariant],
        className
      )}
    >
      {status}
    </span>
  );
};

export default StatusBadge;
