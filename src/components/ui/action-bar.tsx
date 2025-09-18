import React from 'react';
import { Plus, Trash2, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

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

  // Button style helpers - using shadcn Button component
  const getAddButtonVariant = (disabled: boolean) => {
    return disabled ? "secondary" : "default";
  };

  const getDeleteButtonVariant = (disabled: boolean, loading?: boolean) => {
    return (disabled || loading) ? "secondary" : "destructive";
  };

  return (
    <div className={`mb-8 flex items-center justify-between flex-wrap ${className}`}>
      {/* Action Buttons Section */}
      {showActionButtons && (
        <div className={`flex w-full ${!showSearch ? 'md:w-full' : 'md:w-[250px]'} ${actionButtonsClassName}`}>
          {customActions ? (
            // Custom actions override default buttons
            <div className="flex w-full h-[35px] md:h-[40px]">
              {customActions}
            </div>
          ) : (
            // Default Add/Delete buttons
            <>
              {onAdd && (
                <Button
                  onClick={onAdd}
                  disabled={addDisabled}
                  variant={getAddButtonVariant(addDisabled)}
                  size="default"
                  className={`flex w-[50%] items-center text-center md:w-[40%] h-[35px] md:h-[40px] ${addButtonClassName}`}
                >
                  {addIcon}
                  {addLabel}
                </Button>
              )}

              {onDelete && (
                <Button
                  onClick={onDelete}
                  disabled={deleteDisabled || isDeleting}
                  variant={getDeleteButtonVariant(deleteDisabled || isDeleting, isDeleting)}
                  size="default"
                  className={`flex w-[50%] items-center gap-2 md:w-[60%] h-[35px] md:h-[40px] ${deleteButtonClassName}`}
                >
                  {deleteIcon}
                  {isDeleting ? deletingLabel : deleteLabel}
                </Button>
              )}
            </>
          )}
        </div>
      )}

      {/* Search Bar */}
      {showSearch && onSearchChange && (
        <div className={`relative flex-1 min-w-[200px] ${searchClassName}`}>
          <Input
            type="text"
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full h-[35px] pr-10 md:h-[40px]"
          />
          <Search
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
            size={16}
          />
        </div>
      )}
    </div>
  );
};

export default ActionBar;