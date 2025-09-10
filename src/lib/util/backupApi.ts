import {
    BackupSettings,
    BackupHistoryItem,
    ApiResponse,
} from "@/types/Backup";

// Mock API
export class BackupAPI {
    private static delay = (ms: number) =>
        new Promise((resolve) => setTimeout(resolve, ms));

    private static mockSettings: BackupSettings = {
        autoBackupEnabled: true,
        backupFrequency: "daily",
        backupTime: "02:00",
        retentionPeriod: 30,
        backupLocation: "both",
        includeMenuData: true,
        includeOrderHistory: true,
        includeCustomerData: true,
        includeEmployeeData: true,
        includeSettings: true,
        includeFinancialData: true,
        cloudStorageEnabled: true,
        maxStorageSize: 10,
        autoCleanup: true,
    };

    private static mockBackupHistory: BackupHistoryItem[] = [
        {
            id: "1",
            date: "2023-10-15 02:00",
            size: "2.4 GB",
            type: "auto",
            status: "completed",
            includes: ["Menu", "Orders", "Customers", "Settings"],
        },
        {
            id: "2",
            date: "2023-10-14 02:00",
            size: "2.3 GB",
            type: "auto",
            status: "completed",
            includes: ["Menu", "Orders", "Customers", "Settings"],
        },
        {
            id: "3",
            date: "2023-10-13 14:30",
            size: "1.8 GB",
            type: "manual",
            status: "completed",
            includes: ["Menu", "Settings"],
        },
    ];

    static async getSettings(): Promise<ApiResponse<BackupSettings>> {
        await this.delay(800);
        return {
            success: true,
            data: { ...this.mockSettings },
            message: "Backup settings loaded successfully",
        };
    }

    static async getBackupHistory(): Promise<ApiResponse<BackupHistoryItem[]>> {
        await this.delay(600);
        return {
            success: true,
            data: [...this.mockBackupHistory],
            message: "Backup history loaded successfully",
        };
    }

    static async updateSettings(
        settings: Partial<BackupSettings>
    ): Promise<ApiResponse<BackupSettings>> {
        await this.delay(1000);
        this.mockSettings = { ...this.mockSettings, ...settings };
        return {
            success: true,
            data: { ...this.mockSettings },
            message: "Backup settings updated successfully",
        };
    }

    static async createBackup(
        backupType: "full" | "partial",
        selectedData?: string[]
    ): Promise<ApiResponse<{ id: string }>> {
        await this.delay(2000);

        // Determine what data to include based on selections
        const defaultIncludes = [
            "Menu",
            "Orders",
            "Customers",
            "Employees",
            "Settings",
            "Financial",
        ];
        const includes =
            selectedData && selectedData.length > 0 ? selectedData : defaultIncludes;

        const newBackup: BackupHistoryItem = {
            id: Date.now().toString(),
            date: new Date().toLocaleString(),
            size:
                backupType === "full"
                    ? "2.5 GB"
                    : `${Math.random() * 2 + 0.5}`.substring(0, 3) + " GB",
            type: "manual",
            status: "completed",
            includes: includes,
        };
        this.mockBackupHistory.unshift(newBackup);
        return {
            success: true,
            data: { id: newBackup.id },
            message: "Backup created successfully",
        };
    }

    static async deleteBackup(backupId: string): Promise<ApiResponse<boolean>> {
        await this.delay(1500);
        // Remove from history
        this.mockBackupHistory = this.mockBackupHistory.filter(
            (backup) => backup.id !== backupId
        );
        return {
            success: true,
            data: true,
            message: "Backup deleted successfully",
        };
    }

    static async restoreBackup(backupId: string): Promise<ApiResponse<boolean>> {
        await this.delay(3000);
        return {
            success: true,
            data: true,
            message: "Backup restored successfully",
        };
    }
}
