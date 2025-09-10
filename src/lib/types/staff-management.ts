// Staff Management Types
export interface StaffItem {
    Staff_ID: string;
    Name: string;
    Contact: string;
    Address: string;
    CNIC: string;
    Status: "Active" | "Inactive";
    Role: string;
    Salary: string;
    Shift_Start_Time: string;
    Shift_End_Time: string;
    Branch_ID_fk: string;
    Access_Code?: string;
}

export interface BranchInfo {
    "Branch-ID": number;
    Branch_Name: string;
    Status: "Active" | "Inactive";
    "Contact-Info": string;
    Address: string;
}

export interface ApiResponse<T> {
    data: T;
    message?: string;
    success: boolean;
}

export interface Toast {
    message: string;
    type: "success" | "error";
}

export interface StaffFormData extends Omit<StaffItem, "Staff_ID"> { }

export interface StatCardProps {
    title: string;
    value: string | number;
    subtitle?: string;
}
export interface StaffModalProps {
    isOpen: boolean;
    isEditing: boolean;
    formData: StaffFormData;
    setFormData: (data: StaffFormData | ((prev: StaffFormData) => StaffFormData)) => void;
    onSubmit: () => void;
    onClose: () => void;
    onStatusChange: (isActive: boolean) => void;
    actionLoading: boolean;
    isFormValid: () => boolean;
    showToast: (message: string, type: "success" | "error") => void;
}