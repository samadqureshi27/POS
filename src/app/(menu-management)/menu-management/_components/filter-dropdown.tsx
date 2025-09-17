import React from "react";
import { ChevronDown, X } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {FilterOption,FilterDropdownProps } from "@/lib/types/menum"; 

const FilterDropdown: React.FC<FilterDropdownProps> = ({ 
  label, 
  value, 
  onChange, 
  options
}) => {
  const hasValue = Boolean(value);
  const selectedOption = options.find(option => option.value === value);
  const displayValue = selectedOption?.label || label;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "h-8 px-2 lg:px-3"
          )}
        >
          <span className="truncate">{displayValue}</span>
          {hasValue ? (
            <X 
              className="ml-2 h-4 w-4" 
              onClick={(e) => {
                e.stopPropagation();
                onChange("");
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
          onClick={() => onChange("")}
          className={cn(
            "cursor-pointer",
            !hasValue && "bg-accent"
          )}
        >
          {label}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {options.map((option) => (
          <DropdownMenuItem
            key={option.value}
            className={cn(
              "cursor-pointer",
              value === option.value && "bg-accent",
              option.className || ""
            )}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default FilterDropdown;