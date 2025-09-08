import { useState, useEffect } from "react";
import { LicenseInfo } from '../../types/billing';
import { LicenseAPI } from '../utility/license-API';

interface UseLicenseProps {
    showToast: (message: string, type: "success" | "error") => void;
}

export const useLicense = ({ showToast }: UseLicenseProps) => {
    const [licenseInfo, setLicenseInfo] = useState<LicenseInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const [rechecking, setRechecking] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [licenseKeyInput, setLicenseKeyInput] = useState("");

    const loadLicenseInfo = async () => {
        try {
            setLoading(true);
            const response = await LicenseAPI.getLicenseInfo();
            if (!response.success) throw new Error(response.message);
            setLicenseInfo(response.data);
        } catch {
            showToast("Failed to load license information", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleRecheck = async () => {
        try {
            setRechecking(true);
            const response = await LicenseAPI.recheckLicense();
            if (response.success) {
                setLicenseInfo(response.data);
                showToast(
                    response.message || "License rechecked successfully! ✨",
                    "success"
                );
            }
        } catch {
            showToast("Failed to recheck license. Please try again.", "error");
        } finally {
            setRechecking(false);
        }
    };

    const handleUpdateLicense = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!licenseKeyInput.trim()) {
            showToast("Please enter a license key", "error");
            return;
        }

        try {
            setUpdating(true);
            const response = await LicenseAPI.updateLicense(licenseKeyInput);
            if (response.success) {
                setLicenseInfo(response.data);
                setLicenseKeyInput("");
                showToast(
                    response.message || "License updated successfully! 🎉",
                    "success"
                );
            }
        } catch (error: any) {
            showToast(
                error.message ||
                "Failed to update license. Please check your key and try again.",
                "error"
            );
        } finally {
            setUpdating(false);
        }
    };

    useEffect(() => {
        loadLicenseInfo();
    }, []);

    return {
        licenseInfo,
        loading,
        rechecking,
        updating,
        licenseKeyInput,
        setLicenseKeyInput,
        handleRecheck,
        handleUpdateLicense,
    };
};