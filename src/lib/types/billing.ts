// Types
import { ApiResponse, ToastState } from "./common";

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

export interface ToastState {
    message: string;
    type: "success" | "error";
    id: number;
}
