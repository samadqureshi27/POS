// Types for category management
export interface CategoryItem {
  ID: number;
  Name: string;
  Status: "Active" | "Inactive";
  Description: string;
  Parent: string;
  Priority: number;
  Image?: string;
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

export interface CategoryFormData extends Omit<CategoryItem, "ID"> { }

export interface CategoryPageState {
  categoryItems: CategoryItem[];
  selectedItems: number[];
  loading: boolean;
  actionLoading: boolean;
  searchTerm: string;
  editingItem: CategoryItem | null;
  isModalOpen: boolean;
  toast: {
    message: string;
    type: "success" | "error";
  } | null;
  statusFilter: "" | "Active" | "Inactive";
  formData: CategoryFormData;
  preview: string | null;
}

export interface CategoryModalProps {
  isOpen: boolean;
  editingItem: CategoryItem | null;
  actionLoading: boolean;
  categories: CategoryItem[];
  onClose: () => void;
  onCreate: (data: CategoryFormData) => void;
  onUpdate: (data: CategoryFormData) => void;
}


export interface CategoryTableProps {
  filteredItems: CategoryItem[];
  selectedItems: number[];
  statusFilter: "" | "Active" | "Inactive";
  searchTerm: string;
  isAllSelected: boolean;
  onSelectAll: (checked: boolean) => void;
  onSelectItem: (itemId: number, checked: boolean) => void;
  onStatusFilterChange: (status: "" | "Active" | "Inactive") => void;
  onEdit: (item: CategoryItem) => void;
}