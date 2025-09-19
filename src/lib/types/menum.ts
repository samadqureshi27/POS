export interface DetailsTabProps {
    formData: Omit<MenuItem, "ID">;
    updateFormData: (updates: Partial<Omit<MenuItem, "ID">>) => void;
    handleFormFieldChange: (field: keyof Omit<MenuItem, "ID">, value: any) => void;
    handleStatusChange: (field: keyof Omit<MenuItem, "ID">, isActive: boolean) => void;
}

export interface FilterOption {
    value: string;
    label: string;
    className?: string;
}

export interface FilterDropdownProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    options: FilterOption[];
}

export interface ImageUploadProps {
    preview: string | null;
    setPreview: (preview: string | null) => void;
    fileInputRef: React.RefObject<HTMLInputElement>;
}

export interface MealTabProps {
    formData: any;
    setFormData: (data: any) => void;
    handleStatusChange: (field: string, isActive: boolean) => void;
    menuItems: MenuItem[];
}

export interface MenuActionBarProps {
    selectedItems: number[];
    onAddClick: () => void;
    onDeleteClick: () => void;
    searchTerm: string;
    onSearchChange: (value: string) => void;
    actionLoading: boolean;
}
export interface ApiResponse<T> {
    data: T;
    message?: string;
    success: boolean;
}


export interface MenuItemTabProps {
    formData: Omit<MenuItem, "ID">;
    updateFormData: (updates: Partial<Omit<MenuItem, "ID">>) => void;
    handleFormFieldChange: (field: keyof Omit<MenuItem, "ID">, value: any) => void;
    handleStatusChange: (field: keyof Omit<MenuItem, "ID">, isActive: boolean) => void;
    preview: string | null;
    setPreview: (preview: string | null) => void;
    fileInputRef: React.RefObject<HTMLInputElement>;
    categories: any[];
}
export interface MenuItem {
    ID: number;
    Name: string;
    Price: number;
    Category: string;
    StockQty: string;
    Status: "Active" | "Inactive";
}

export interface MenuTableProps {
    filteredItems: MenuItem[];
    selectedItems: number[];
    isAllSelected: boolean;
    onSelectAll: (checked: boolean) => void;
    onSelectItem: (itemId: number, checked: boolean) => void;
    onEditItem: (item: MenuItem) => void;
    categoryFilter: string;
    setCategoryFilter: (value: string) => void;
    statusFilter: string;
    setStatusFilter: (value: string) => void;
    categories: string[];
}
export interface MenuModalProps {
    isOpen: boolean;
    editingItem: MenuItem | null;
    activeTab: string;
    setActiveTab: (tab: string) => void;
    formData: Omit<MenuItem, "ID">;
    menuOptions: any[];
    menuItems: MenuItem[];
    categories: any[];
    onClose: () => void;
    onSubmit: () => void;
    actionLoading: boolean;
    isFormValid: () => boolean;
    preview: string | null;
    setPreview: (preview: string | null) => void;
    fileInputRef: React.RefObject<HTMLInputElement>;
    updateFormData: (updates: Partial<Omit<MenuItem, "ID">>) => void;
    handleFormFieldChange: (field: keyof Omit<MenuItem, "ID">, value: any) => void;
    handleStatusChange: (field: keyof Omit<MenuItem, "ID">, isActive: boolean) => void;
}
export interface OptionsTabProps {
    formData: Omit<MenuItem, "ID">;
    updateFormData: (updates: Partial<Omit<MenuItem, "ID">>) => void;
    handleFormFieldChange: (field: keyof Omit<MenuItem, "ID">, value: any) => void;
    menuOptions: any[];
}
export interface PriceTabProps {
    formData: any;
    setFormData: (data: any) => void;
}
export interface SpecialsTabProps {
    formData: any;
    setFormData: (data: any) => void;
    handleStatusChange: (field: string, isActive: boolean) => void;
}
export interface TabNavigationProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
    formData: {
        Displaycat?: string;
    };
}
export interface MenuItem {
    ID: number;
    Name: string;
    Price: number;
    Category: string;
    StockQty: string;
    Status: "Active" | "Inactive";
    Description?: string;
    MealType?: string;
    Priority?: number;
    MinimumQuantity?: number;
    ShowOnMenu?: "Active" | "Inactive";
    Featured?: "Active" | "Inactive";
    StaffPick?: "Active" | "Inactive";
    DisplayType?: string;
    Displaycat?: string;
    Unit?: string;
    SpecialStartDate?: string;
    SpecialEndDate?: string;
    SpecialPrice?: number;
    OptionValue?: string[];
    OptionPrice?: number[];
    MealValue?: string[];
    MealPrice?: number[];
    PName?: string[];
    PPrice?: number[];
    OverRide?: ("Active" | "Inactive")[];
    ShowOnMain?: "Active" | "Inactive";
    SubTBE?: "Active" | "Inactive";
    Deal?: "Active" | "Inactive";
    Special?: "Active" | "Inactive";
}
