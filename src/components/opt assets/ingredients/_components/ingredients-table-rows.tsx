import React from 'react';
import Checkbox from "@mui/material/Checkbox";
import ResponsiveEditButton from "@/components/ui/responsive-edit-button";

interface InventoryItem {
  ID: string;
  Name: string;
  Status: "Active" | "Inactive";
  Description: string;
  Unit: string;
  Threshold: number;
  Priority: number;
}

interface IngredientsTableRowProps {
  item: InventoryItem;
  isSelected: boolean;
  onSelectItem: (id: string, checked: boolean) => void;
  onEditItem: (item: InventoryItem) => void;
}

const IngredientsTableRow: React.FC<IngredientsTableRowProps> = ({
  item,
  isSelected,
  onSelectItem,
  onEditItem
}) => {
  return (
    <tr className="bg-white hover:bg-gray-50">
      <td className="px-6 py-8 card-checkbox-cell">
        <Checkbox
          checked={isSelected}
          onChange={(e) => onSelectItem(item.ID, e.target.checked)}
          disableRipple
          sx={{
            p: 0, // remove extra padding
            transform: "scale(1.5)", // optional size tweak
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
      </td>

      <td className="px-4 py-4 whitespace-nowrap" data-label="ID">
        {item.ID}
      </td>
      <td className="px-4 py-4 whitespace-nowrap card-name-cell" data-label="Name">
        {item.Name}
      </td>

      <td className="px-4 py-4 whitespace-nowrap" data-label="Status">
        <span
          className={`inline-block w-24 text-right py-[2px] rounded-sm text-xs font-medium 
            ${item.Status === "Inactive" ? "text-red-400" : ""}
            ${item.Status === "Active" ? "text-green-400" : ""}
          `}
        >
          {item.Status}
        </span>
      </td>

      <td className="px-4 py-4 whitespace-nowrap" data-label="Description">
        {item.Description}
      </td>
      <td className="px-4 py-4 whitespace-nowrap" data-label="Unit">
        {item.Unit}
      </td>
      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600" data-label="Threshold">
        {item.Threshold}
      </td>
      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600" data-label="Priority">
        {item.Priority}
      </td>

      <td 
        className="px-4 py-4 whitespace-nowrap card-actions-cell" 
        data-label="Actions" 
        onClick={(e) => e.stopPropagation()}
      >
        <ResponsiveEditButton
          onClick={(e) => {
            e.stopPropagation();
            onEditItem(item);
          }}
        />
      </td>
    </tr>
  );
};

export default IngredientsTableRow;