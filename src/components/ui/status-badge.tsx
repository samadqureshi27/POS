"use client";
// Status Badge Component using shadcn/ui Badge
import React from "react";
import { Badge, badgeVariants } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { VariantProps } from "class-variance-authority";

export interface StatusBadgeProps extends React.ComponentProps<"span">, VariantProps<typeof badgeVariants> {
  status: string;
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

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  variant,
  className,
  ...props
}) => {
  const badgeVariant = variant || getStatusVariant(status);

  return (
    <Badge
      variant={badgeVariant}
      className={className}
      {...props}
    >
      {status}
    </Badge>
  );
};

export default StatusBadge;
