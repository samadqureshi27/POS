// types/interfaces.ts
export interface MenuItemOptions {
  ID: number;
  Name: string;
  DisplayType: "Radio" | "Select" | "Checkbox";
  Priority: number;
  OptionValue: string[];
  OptionPrice: number[];
  backendId?: string; // Actual backend ID
  selection?: "single" | "multiple"; // Backend selection type
  min?: number; // Backend min selections
  max?: number; // Backend max selections
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface ToastProps {
  message: string;
  type: "success" | "error";
  onClose: () => void;
}
export interface MenuTableProps {
  filteredItems: MenuItemOptions[];
  selectedItems: number[];
  searchTerm: string;
  DisplayFilter: "" | "Radio" | "Select" | "Checkbox";
  isAllSelected: boolean;
  onSelectAll: (checked: boolean) => void;
  onSelectItem: (itemId: number, checked: boolean) => void;
  onEditItem: (item: MenuItemOptions) => void;
  onDisplayFilterChange: (filter: "" | "Radio" | "Select" | "Checkbox") => void;
}



export interface DetailsFormProps {
  formData: Omit<MenuItemOptions, "ID">;
  onFormDataChange: (data: Omit<MenuItemOptions, "ID">) => void;
}


export interface OptionValuesFormProps {
  formData: Omit<MenuItemOptions, "ID">;
  onFormDataChange: (data: Omit<MenuItemOptions, "ID">) => void;
}

export interface MenuModalProps {
  isOpen: boolean;
  editingItem: MenuItemOptions | null;
  formData: Omit<MenuItemOptions, "ID">;
  onFormDataChange: (data: Omit<MenuItemOptions, "ID">) => void;
  onSubmit: () => void;
  onClose: () => void;
  isFormValid: () => boolean;
}