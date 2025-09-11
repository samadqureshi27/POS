import React from 'react';
import { Plus, Trash2, Search } from 'lucide-react';

interface ActionBarProps {
  // Add button props
  onAdd?: () => void;
  addLabel?: string;
  addIcon?: React.ReactNode;
  addDisabled?: boolean;
  
  // Delete button props
  onDelete?: () => void;
  deleteLabel?: string;
  deleteIcon?: React.ReactNode;
  deleteDisabled?: boolean;
  isDeleting?: boolean;
  deletingLabel?: string;
  
  // Search props
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  showSearch?: boolean;
  
  // Layout and styling
  className?: string;
  
  // Custom actions (replaces default buttons)
  customActions?: React.ReactNode;
  
  // Advanced customization
  actionButtonsClassName?: string;
  searchClassName?: string;
  addButtonClassName?: string;
  deleteButtonClassName?: string;
}

const ActionBar: React.FC<ActionBarProps> = ({
  // Add button defaults
  onAdd,
  addLabel = "Add",
  addIcon = <Plus size={16} />,
  addDisabled = false,
  
  // Delete button defaults
  onDelete,
  deleteLabel = "Delete Selected",
  deleteIcon = <Trash2 size={16} />,
  deleteDisabled = false,
  isDeleting = false,
  deletingLabel = "Deleting...",
  
  // Search defaults
  searchValue = "",
  onSearchChange,
  searchPlaceholder = "Search...",
  showSearch = true,
  
  // Layout defaults
  className = "",
  
  // Custom actions
  customActions,
  
  // Advanced styling
  actionButtonsClassName = "",
  searchClassName = "",
  addButtonClassName = "",
  deleteButtonClassName = "",
}) => {
  // Determine if we should show action buttons section
  const showActionButtons = customActions || onAdd || onDelete;

  // Button style helpers - preserving your original design
  const getAddButtonStyle = (disabled: boolean, customClass?: string) => {
    const baseStyle = "flex w-[50%] items-center text-center gap-2 md:w-[40%] px-6.5 py-2 rounded-sm transition-colors";
    const statusStyle = disabled
      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
      : "bg-[#2C2C2C] text-white hover:bg-gray-700";
    
    return `${baseStyle} ${statusStyle} ${customClass || ''}`;
  };

  const getDeleteButtonStyle = (disabled: boolean, loading?: boolean, customClass?: string) => {
    const baseStyle = "flex w-[50%] items-center gap-2 px-4 md:w-[60%] py-2 rounded-sm transition-colors";
    const statusStyle = (disabled || loading)
      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
      : "bg-[#2C2C2C] text-white hover:bg-gray-700";
    
    return `${baseStyle} ${statusStyle} ${customClass || ''}`;
  };

  return (
    <div className={`mb-8 flex items-center justify-between gap-4 flex-wrap ${className}`}>
      {/* Action Buttons Section */}
      {showActionButtons && (
        <div className={`flex gap-3 h-[35px] w-full md:h-[40px] ${!showSearch ? 'md:w-full' : 'md:w-[250px]'} ${actionButtonsClassName}`}>
          {customActions ? (
            // Custom actions override default buttons
            <div className="flex gap-3 w-full h-full">
              {customActions}
            </div>
          ) : (
            // Default Add/Delete buttons
            <>
              {onAdd && (
                <button
                  onClick={onAdd}
                  disabled={addDisabled}
                  className={getAddButtonStyle(addDisabled, addButtonClassName)}
                >
                  {addIcon}
                  {addLabel}
                </button>
              )}
              
              {onDelete && (
                <button
                  onClick={onDelete}
                  disabled={deleteDisabled || isDeleting}
                  className={getDeleteButtonStyle(deleteDisabled || isDeleting, isDeleting, deleteButtonClassName)}
                >
                  {deleteIcon}
                  {isDeleting ? deletingLabel : deleteLabel}
                </button>
              )}
            </>
          )}
        </div>
      )}

      {/* Search Bar */}
      {showSearch && onSearchChange && (
        <div className={`relative flex-1 min-w-[200px] ${searchClassName}`}>
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full h-[35px] pr-10 pl-4 md:h-[40px] py-2 border bg-white border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#d9d9e1]"
          />
          <Search
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={16}
          />
        </div>
      )}
    </div>
  );
};

export default ActionBar;