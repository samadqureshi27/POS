import React from 'react';
import { ChevronDown, X } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface StatusFilterDropdownProps {
  statusFilter: "" | "Active" | "Inactive";
  setStatusFilter: (status: "" | "Active" | "Inactive") => void;
}

const StatusFilterDropdown: React.FC<StatusFilterDropdownProps> = ({
  statusFilter,
  setStatusFilter
}) => {
  const hasValue = Boolean(statusFilter);
  const displayValue = statusFilter || "Status";

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "text-green-500";
      case "Inactive":
        return "text-destructive";
      default:
        return "";
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "h-8 border-dashed",
            hasValue && "border-solid"
          )}
        >
          <span className="truncate">{displayValue}</span>
          {hasValue ? (
            <X 
              className="ml-2 h-4 w-4" 
              onClick={(e) => {
                e.stopPropagation();
                setStatusFilter("");
              }}
            />
          ) : (
            <ChevronDown className="ml-2 h-4 w-4" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-[200px]"
        align="start"
      >
        <DropdownMenuItem
          onClick={() => setStatusFilter("")}
          className={cn(
            "cursor-pointer",
            !hasValue && "bg-accent"
          )}
        >
          Status
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className={cn(
            "cursor-pointer",
            statusFilter === "Active" && "bg-accent",
            "text-green-500"
          )}
          onClick={() => setStatusFilter("Active")}
        >
          Active
        </DropdownMenuItem>
        <DropdownMenuItem
          className={cn(
            "cursor-pointer",
            statusFilter === "Inactive" && "bg-accent",
            "text-destructive"
          )}
          onClick={() => setStatusFilter("Inactive")}
        >
          Inactive
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default StatusFilterDropdown;