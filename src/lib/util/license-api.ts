import { LicenseInfo, ApiResponse } from "@/lib/types/billing";

// Mock API
export class LicenseAPI {
    private static delay = (ms: number) =>
        new Promise((resolve) => setTimeout(resolve, ms));

    private static mockLicenseInfo: LicenseInfo = {
        licensedTo: "Cafe Delight",
        plan: "Pro",
        status: "Active",
        licenseKey: "LIC-789XYZ-456ABC-123PRO",
        expiryDate: "2024-12-31T23:59:59",
        totalPOS: 5,
        totalKDS: 3,
        totalBranches: 2,
    };

    static async getLicenseInfo(): Promise<ApiResponse<LicenseInfo>> {
        await this.delay(800);
        return {
            success: true,
            data: { ...this.mockLicenseInfo },
            message: "License information loaded successfully",
        };
    }

    static async recheckLicense(): Promise<ApiResponse<LicenseInfo>> {
        await this.delay(1200);
        // Simulate potential changes on recheck
        const randomChange = Math.random() > 0.8;
        if (randomChange) {
            this.mockLicenseInfo.status =
                this.mockLicenseInfo.status === "Active" ? "Active" : "Active"; // Just for demo
        }

        return {
            success: true,
            data: { ...this.mockLicenseInfo },
            message: "License rechecked successfully! All details are up to date.",
        };
    }

    static async updateLicense(key: string): Promise<ApiResponse<LicenseInfo>> {
        await this.delay(1500);

        // Validate key format (simple mock validation)
        if (key.length < 10 || !key.includes("-")) {
            throw new Error(
                "Invalid license key format. Please check your key and try again."
            );
        }

        // Simulate different plans based on key
        if (key.includes("TRIAL")) {
            this.mockLicenseInfo = {
                licensedTo: "New Business",
                plan: "Trial",
                status: "Active",
                licenseKey: key,
                expiryDate: new Date(
                    Date.now() + 14 * 24 * 60 * 60 * 1000
                ).toISOString(),
                totalPOS: 1,
                totalKDS: 1,
                totalBranches: 1,
            };
        } else if (key.includes("BASIC")) {
            this.mockLicenseInfo = {
                licensedTo: "Updated Business",
                plan: "Basic",
                status: "Active",
                licenseKey: key,
                expiryDate: "2025-06-30T23:59:59",
                totalPOS: 2,
                totalKDS: 1,
                totalBranches: 1,
            };
        } else if (key.includes("ULTIMATE")) {
            this.mockLicenseInfo = {
                licensedTo: "Enterprise Business",
                plan: "Ultimate",
                status: "Active",
                licenseKey: key,
                expiryDate: "2025-12-31T23:59:59",
                totalPOS: 20,
                totalKDS: 10,
                totalBranches: 10,
            };
        } else {
            // Default to Pro plan
            this.mockLicenseInfo = {
                licensedTo: "Premium Business",
                plan: "Pro",
                status: "Active",
                licenseKey: key,
                expiryDate: "2025-09-30T23:59:59",
                totalPOS: 5,
                totalKDS: 3,
                totalBranches: 3,
            };
        }

        return {
            success: true,
            data: { ...this.mockLicenseInfo },
            message: "License updated successfully! Your new plan is now active.",
        };
    }
}
