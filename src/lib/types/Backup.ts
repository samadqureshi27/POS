// Types for Backup & Recovery
export interface BackupSettings {
    // Automated Backup Settings
    autoBackupEnabled: boolean;
    backupFrequency: "daily" | "weekly" | "monthly";
    backupTime: string;
    retentionPeriod: number; // in days
    backupLocation: "local" | "cloud" | "both";

    // Data Selection
    includeMenuData: boolean;
    includeOrderHistory: boolean;
    includeCustomerData: boolean;
    includeEmployeeData: boolean;
    includeSettings: boolean;
    includeFinancialData: boolean;

    // Cloud Storage
    cloudStorageEnabled: boolean;
    maxStorageSize: number; // in GB
    autoCleanup: boolean;
}

export interface BackupHistoryItem {
    id: string;
    date: string;
    size: string;
    type: "auto" | "manual";
    status: "completed" | "failed" | "in-progress";
    includes: string[];
}

export interface ApiResponse<T> {
    data: T;
    message?: string;
    success: boolean;
}

export interface DropdownOption {
    value: string;
    label: string;
}

export interface ToastState {
    message: string;
    type: "success" | "error";
    id: number;
}

export interface ModalState {
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    confirmText?: string;
    isDestructive?: boolean;
}
