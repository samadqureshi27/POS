import React from 'react';
import { ChevronDown } from 'lucide-react';
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

interface StatusFilterDropdownProps {
  statusFilter: "" | "Active" | "Inactive";
  setStatusFilter: (status: "" | "Active" | "Inactive") => void;
}

const StatusFilterDropdown: React.FC<StatusFilterDropdownProps> = ({
  statusFilter,
  setStatusFilter
}) => {
  return (
    <div className="flex flex-col gap-1">
      <DropdownMenu.Root modal={false}>
        <DropdownMenu.Trigger className="px-2 py-1 rounded text-sm bg-transparent border-none outline-none hover:bg-transparent flex items-center gap-2 focus:outline-none focus:ring-0 cursor-pointer">
          {statusFilter || "Status"}
          <ChevronDown size={14} className="text-gray-500 ml-auto" />
        </DropdownMenu.Trigger>

        <DropdownMenu.Portal>
          <DropdownMenu.Content
            className="min-w-[240px] rounded-sm bg-white shadow-md border-none p-1 relative outline-none"
            sideOffset={6}
          >
            <DropdownMenu.Arrow className="fill-white stroke-gray-200 w-5 h-3" />

            <DropdownMenu.Item
              className="px-3 py-1 text-sm cursor-pointer hover:bg-gray-100 rounded outline-none"
              onClick={() => setStatusFilter("")}
            >
              Status
            </DropdownMenu.Item>
            <DropdownMenu.Item
              className="px-3 py-1 text-sm cursor-pointer hover:bg-red-100 text-red-400 rounded outline-none"
              onClick={() => setStatusFilter("Inactive")}
            >
              Inactive
            </DropdownMenu.Item>
            <DropdownMenu.Item
              className="px-3 py-1 text-sm cursor-pointer hover:bg-green-100 text-green-400 rounded outline-none"
              onClick={() => setStatusFilter("Active")}
            >
              Active
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </div>
  );
};

export default StatusFilterDropdown;