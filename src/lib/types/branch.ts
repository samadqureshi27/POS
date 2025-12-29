// types/branch.ts
import { ApiResponse, ToastState } from "./common";

export interface BranchItem {
  "Branch-ID": number; // Local sequential ID for UI
  Branch_Name: string;
  Status: "Active" | "Inactive";
  "Contact-Info": string;
  Address: string;
  email: string;
  postalCode: string;
  // Backend identifier for navigation/API calls
  backendId?: string;
}

export interface ToastProps extends ToastState {
  onClose: () => void;
}

export interface BranchModalFormData extends Omit<BranchItem, "Branch-ID" | "backendId"> {}

export interface BranchTableProps {
  branchItems: BranchItem[];
  filteredItems: BranchItem[];
  selectedItems: number[];
  statusFilter: "" | "Active" | "Inactive";
  onStatusFilterChange: (filter: "" | "Active" | "Inactive") => void;
  onSelectAll: (checked: boolean) => void;
  onSelectItem: (id: number, checked: boolean) => void;
  onEditItem: (item: BranchItem) => void;
  onItemClick: (branchId: number) => void;
  isAllSelected: boolean;
}

export interface BranchModalProps {
  isOpen: boolean;
  editingItem: BranchItem | null;
  formData: BranchModalFormData;
  actionLoading: boolean;
  onClose: () => void;
  onSubmit: () => void;
  onFormDataChange: (data: Partial<BranchModalFormData>) => void;
  onStatusChange: (isActive: boolean) => void;
}