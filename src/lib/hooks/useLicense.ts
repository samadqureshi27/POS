import { useState, useEffect } from "react";
import { LicenseInfo } from '@/lib/types/billing';
import { LicenseAPI } from '../util/license-api';
import { Toast } from "@/lib/util/toast-helpers";

export const useLicense = () => {
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
            Toast.error("Failed to load license information");
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
                Toast.success(response.message || "License rechecked successfully! ✨");
            }
        } catch {
            Toast.error("Failed to recheck license. Please try again.");
        } finally {
            setRechecking(false);
        }
    };

    const handleUpdateLicense = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!licenseKeyInput.trim()) {
            Toast.error("Please enter a license key");
            return;
        }

        try {
            setUpdating(true);
            const response = await LicenseAPI.updateLicense(licenseKeyInput);
            if (response.success) {
                setLicenseInfo(response.data);
                setLicenseKeyInput("");
                Toast.success(response.message || "License updated successfully! 🎉");
            }
        } catch (error: any) {
            Toast.error(error.message || "Failed to update license. Please check your key and try again.");
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