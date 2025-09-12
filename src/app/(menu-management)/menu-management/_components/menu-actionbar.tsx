import React from "react";
import { Plus, Trash2, Search } from "lucide-react";

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
    <div className="flex gap-3 h-[35px] w-full md:h-[40px] md:w-[250px]">
      <button
        onClick={onAddClick}
        disabled={selectedItems.length > 0}
        className={`flex w-[50%] items-center text-center gap-2 md:w-[40%] px-6.5 py-2 rounded-sm transition-colors ${
          selectedItems.length === 0
            ? "bg-[#2C2C2C] text-white hover:bg-gray-700"
            : "bg-gray-200 text-gray-400 cursor-not-allowed"
        }`}
      >
        <Plus size={16} />
        Add
      </button>

      <button
        onClick={onDeleteClick}
        disabled={selectedItems.length === 0 || actionLoading}
        className={`flex w-[50%] items-center gap-2 px-4 md:w-[60%] py-2 rounded-sm transition-colors ${
          selectedItems.length > 0 && !actionLoading
            ? "bg-[#2C2C2C] text-white hover:bg-gray-700"
            : "bg-gray-200 text-gray-400 cursor-not-allowed"
        }`}
      >
        <Trash2 size={16} />
        {actionLoading ? "Deleting..." : "Delete Selected"}
      </button>
    </div>

    <div className="relative flex-1 min-w-[200px]">
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full h-[35px] pr-10 pl-4 md:h-[40px] py-2 border bg-white border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#d9d9e1]"
      />
      <Search
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
        size={16}
      />
    </div>
  </div>
);

export default MenuActionBar;