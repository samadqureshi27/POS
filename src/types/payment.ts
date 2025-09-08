export interface PaymentMethod {
    ID: number;
    Name: string;
    PaymentType: "Cash" | "Card" | "Online";
    TaxType: string;
    TaxPercentage: number;
    Status: "Active" | "Inactive";
    CreatedDate: string;
    LastUsed: string;
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

export interface StatCardProps {
    title: string;
    value: string | number;
    subtitle?: string;
}

export interface ModalFormData extends Omit<PaymentMethod, "ID"> { }

export interface PaymentTableProps {
    paymentMethods: PaymentMethod[];
    filteredItems: PaymentMethod[];
    selectedItems: number[];
    statusFilter: "" | "Cash" | "Card" | "Online";
    taxTypeFilter: string;
    onStatusFilterChange: (filter: "" | "Cash" | "Card" | "Online") => void;
    onTaxTypeFilterChange: (filter: string) => void;
    onSelectAll: (checked: boolean) => void;
    onSelectItem: (id: number, checked: boolean) => void;
    onEditItem: (item: PaymentMethod) => void;
    isAllSelected: boolean;
}