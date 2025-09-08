import React from 'react';
import Checkbox from "@mui/material/Checkbox";
import StatusFilterDropdown from './status-filter-dropdown';

interface IngredientsTableHeaderProps {
  isAllSelected: boolean;
  onSelectAll: (checked: boolean) => void;
  statusFilter: "" | "Active" | "Inactive";
  setStatusFilter: (status: "" | "Active" | "Inactive") => void;
}

const IngredientsTableHeader: React.FC<IngredientsTableHeaderProps> = ({
  isAllSelected,
  onSelectAll,
  statusFilter,
  setStatusFilter
}) => {
  return (
    <thead className="bg-white border-b text-gray-500 border-gray-200 py-50 sticky top-0 z-10">
      <tr>
        <th className="px-6 py-6 text-left w-[2.5px]">
          <Checkbox
            checked={isAllSelected}
            onChange={(e) => onSelectAll(e.target.checked)}
            disableRipple
            sx={{
              transform: "scale(1.5)", // size adjustment
              p: 0, // remove extra padding
            }}
            icon={
              // unchecked grey box
              <svg width="20" height="20" viewBox="0 0 24 24">
                <rect
                  x="3"
                  y="3"
                  width="18"
                  height="18"
                  rx="3"
                  ry="3"
                  fill="#e0e0e0" // grey inside
                  stroke="#d1d1d1" // border grey
                  strokeWidth="2"
                />
              </svg>
            }
            checkedIcon={
              // checked with tick
              <svg width="20" height="20" viewBox="0 0 24 24">
                <rect
                  x="3"
                  y="3"
                  width="18"
                  height="18"
                  rx="3"
                  ry="3"
                  fill="#e0e0e0" // grey inside
                  stroke="#2C2C2C" // dark border
                  strokeWidth="2"
                />
                <path
                  d="M9 12.5l2 2 4-4.5"
                  fill="none"
                  stroke="#2C2C2C"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            }
          />
        </th>
        <th className="relative px-4 py-3 text-left">
          ID
          <span className="absolute left-0 top-[15%] h-[70%] w-[2px] bg-gray-300"></span>
        </th>
        <th className="relative px-4 py-3 text-left">
          Name
          <span className="absolute left-0 top-[15%] h-[70%] w-[2px] bg-gray-300"></span>
        </th>

        <th className="relative px-4 py-3 text-left">
          <StatusFilterDropdown 
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
          />
          <span className="absolute left-0 top-[15%] h-[70%] w-[1.5px] bg-gray-300"></span>
        </th>

        <th className="relative px-4 py-3 text-left">
          Description
          <span className="absolute left-0 top-[15%] h-[70%] w-[1.5px] bg-gray-300"></span>
        </th>
        <th className="relative px-4 py-3 text-left">
          Unit
          <span className="absolute left-0 top-[15%] h-[70%] w-[1.5px] bg-gray-300"></span>
        </th>
        <th className="relative px-4 py-3 text-left">
          Priority
          <span className="absolute left-0 top-[15%] h-[70%] w-[1.5px] bg-gray-300"></span>
        </th>

        <th className="relative px-4 py-3 text-left">
          Actions
          <span className="absolute left-0 top-[15%] h-[70%] w-[1.5px] bg-gray-300"></span>
        </th>
      </tr>
    </thead>
  );
};

export default IngredientsTableHeader;