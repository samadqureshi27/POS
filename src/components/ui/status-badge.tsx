"use client";
// Status Badge Component using shadcn/ui Badge
import React from "react";
import { Badge, BadgeProps } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface StatusBadgeProps extends Omit<BadgeProps, 'variant'> {
  status: string;
  variant?: "default" | "secondary" | "destructive" | "outline";
}

const getStatusVariant = (status: string): StatusBadgeProps["variant"] => {
  if (!status) return "default";
  const lowerStatus = status.toLowerCase();

  if (lowerStatus.includes("active") || lowerStatus.includes("enabled") || lowerStatus.includes("completed") || lowerStatus.includes("success")) {
    return "default";
  }
  if (lowerStatus.includes("inactive") || lowerStatus.includes("disabled") || lowerStatus.includes("cancelled") || lowerStatus.includes("failed")) {
    return "destructive";
  }
  if (lowerStatus.includes("pending") || lowerStatus.includes("processing") || lowerStatus.includes("warning")) {
    return "outline";
  }
  if (lowerStatus.includes("draft") || lowerStatus.includes("archived")) {
    return "secondary";
  }

  return "default";
};

const getStatusColorClass = (status: string) => {
  if (!status) return "";
  const lowerStatus = status.toLowerCase();

  if (lowerStatus.includes("active") || lowerStatus.includes("enabled") || lowerStatus.includes("completed") || lowerStatus.includes("success")) {
    return "bg-green-100 text-green-800 hover:bg-green-200";
  }
  if (lowerStatus.includes("pending") || lowerStatus.includes("processing") || lowerStatus.includes("warning")) {
    return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
  }

  return "";
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  variant,
  className,
  ...props
}) => {
  const badgeVariant = variant || getStatusVariant(status);
  const colorClass = getStatusColorClass(status);

  return (
    <Badge
      variant={badgeVariant}
      className={cn(colorClass, className)}
      {...props}
    >
      {status}
    </Badge>
  );
};

export default StatusBadge;
