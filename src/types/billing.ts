// Types
export interface LicenseInfo {
    licensedTo: string;
    plan: "Basic" | "Standard" | "Pro" | "Ultimate" | "Trial";
    status: "Active" | "Inactive" | "Expired";
    licenseKey: string;
    expiryDate: string;
    totalPOS: number;
    totalKDS: number;
    totalBranches: number;
}

export interface ApiResponse<T> {
    data: T;
    message?: string;
    success: boolean;
}

export interface ToastState {
    message: string;
    type: "success" | "error";
    id: number;
}
