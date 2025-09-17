"use client";
import React from "react";
import { Plus, Trash2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

import {MenuActionBarProps} from "@/lib/types/menum";


const MenuActionBar: React.FC<MenuActionBarProps> = ({
  selectedItems,
  onAddClick,
  onDeleteClick,
  searchTerm,
  onSearchChange,
  actionLoading
}) => (
  <div className="mb-8 flex items-center justify-between gap-4 flex-wrap">
    <div className="flex gap-3 w-full md:w-[250px]">
      <Button
        onClick={onAddClick}
        disabled={selectedItems.length > 0}
        variant={selectedItems.length === 0 ? "default" : "secondary"}
        size="default"
        className="flex w-[50%] items-center text-center gap-2 md:w-[40%] h-[35px] md:h-[40px]"
      >
        <Plus size={16} />
        Add
      </Button>

      <Button
        onClick={onDeleteClick}
        disabled={selectedItems.length === 0 || actionLoading}
        variant={selectedItems.length > 0 && !actionLoading ? "default" : "secondary"}
        size="default"
        className="flex w-[50%] items-center gap-2 md:w-[60%] h-[35px] md:h-[40px]"
      >
        <Trash2 size={16} />
        {actionLoading ? "Deleting..." : "Delete Selected"}
      </Button>
    </div>

    <div className="relative flex-1 min-w-[200px]">
      <Input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full h-[35px] pr-10 md:h-[40px]"
      />
      <Search
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
        size={16}
      />
    </div>
  </div>
);

export default MenuActionBar;