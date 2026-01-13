import { useState, useEffect, useCallback } from "react";
import { BackupSettings, BackupHistoryItem } from "@/lib/types/backup";
import { BackupAPI } from "../util/backup-api";
import { logError } from "@/lib/util/logger";
import { Toast } from "@/lib/util/toast-helpers";

interface UseBackupProps {
    showModal: (
        title: string,
        message: string,
        onConfirm: () => void,
        isDestructive?: boolean
    ) => void;
}

export const useBackup = ({ showModal }: UseBackupProps) => {
    const [settings, setSettings] = useState<BackupSettings | null>(null);
    const [backupHistory, setBackupHistory] = useState<BackupHistoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [creatingBackup, setCreatingBackup] = useState(false);
    const [restoring, setRestoring] = useState<string | null>(null);
    const [deleting, setDeleting] = useState<string | null>(null);
    const [hasChanges, setHasChanges] = useState(false);

    const loadData = useCallback(async () => {
        try {
            setLoading(true);
            const [settingsResponse, historyResponse] = await Promise.all([
                BackupAPI.getSettings(),
                BackupAPI.getBackupHistory(),
            ]);

            if (!settingsResponse.success) throw new Error(settingsResponse.message);
            if (!historyResponse.success) throw new Error(historyResponse.message);

            setSettings(settingsResponse.data);
            setBackupHistory(historyResponse.data);
        } catch {
            Toast.error("Failed to load backup data");
        } finally {
            setLoading(false);
        }
    }, []);

    const handleSettingChange = useCallback(
        (key: keyof BackupSettings, value: any) => {
            if (!settings) return;
            setSettings((prev) => (prev ? { ...prev, [key]: value } : null));
            setHasChanges(true);
        },
        [settings]
    );

    const handleSave = useCallback(async () => {
        if (!settings) return;
        try {
            setSaving(true);
            const response = await BackupAPI.updateSettings(settings);
            if (response.success) {
                setHasChanges(false);
                Toast.success(response.message || "Settings saved successfully! 🎉");
            }
        } catch {
            Toast.error("Failed to save settings. Please try again.");
        } finally {
            setSaving(false);
        }
    }, [settings]);

    const handleCreateBackup = useCallback(
        async (type: "full" | "partial" = "full") => {
            if (!settings) return;

            setCreatingBackup(true);

            try {
                // Get selected data types based on checkbox settings
                const selectedData: string[] = [];
                if (settings.includeMenuData) selectedData.push("Menu");
                if (settings.includeOrderHistory) selectedData.push("Orders");
                if (settings.includeCustomerData) selectedData.push("Customers");
                if (settings.includeEmployeeData) selectedData.push("Employees");
                if (settings.includeSettings) selectedData.push("Settings");
                if (settings.includeFinancialData) selectedData.push("Financial");

                // Check if at least one data type is selected
                if (selectedData.length === 0) {
                    Toast.error("Please select at least one data type to backup");
                    return;
                }

                const response = await BackupAPI.createBackup(type, selectedData);
                if (response.success) {
                    // Refresh the backup history
                    const historyResponse = await BackupAPI.getBackupHistory();
                    if (historyResponse.success) {
                        setBackupHistory(historyResponse.data);
                    }
                    Toast.success(`Backup created successfully with ${selectedData.length} data type(s)! ✨`);
                } else {
                    Toast.error("Failed to create backup");
                }
            } catch (error) {
                logError("Backup creation error", error, {
                    component: "useBackup",
                    action: "handleCreateBackup",
                    backupType: type,
                });
                Toast.error("Failed to create backup");
            } finally {
                setCreatingBackup(false);
            }
        },
        [settings]
    );

    const handleDeleteBackup = useCallback(
        (backupId: string) => {
            const backup = backupHistory.find((b) => b.id === backupId);
            if (!backup) return;

            showModal(
                "Delete Backup",
                `Are you sure you want to delete the backup from ${backup.date}? This action cannot be undone.`,
                async () => {
                    try {
                        setDeleting(backupId);
                        const response = await BackupAPI.deleteBackup(backupId);
                        if (response.success) {
                            // Refresh the backup history
                            const historyResponse = await BackupAPI.getBackupHistory();
                            if (historyResponse.success) {
                                setBackupHistory(historyResponse.data);
                            }
                            Toast.success(response.message || "Backup deleted successfully! 🗑️");
                        }
                    } catch {
                        Toast.error("Failed to delete backup");
                    } finally {
                        setDeleting(null);
                    }
                },
                true
            );
        },
        [backupHistory, showModal]
    );

    const handleRestoreBackup = useCallback(
        (backupId: string) => {
            const backup = backupHistory.find((b) => b.id === backupId);
            if (!backup) return;

            showModal(
                "Restore Backup",
                `Are you sure you want to restore the backup from ${backup.date}? This will overwrite your current data.`,
                async () => {
                    try {
                        setRestoring(backupId);
                        const response = await BackupAPI.restoreBackup(backupId);
                        if (response.success) {
                            Toast.success(response.message || "Backup restored successfully! 🔄");
                        }
                    } catch {
                        Toast.error("Failed to restore backup");
                    } finally {
                        setRestoring(null);
                    }
                }
            );
        },
        [backupHistory, showModal]
    );

    useEffect(() => {
        loadData();
    }, [loadData]);

    return {
        settings,
        backupHistory,
        loading,
        saving,
        creatingBackup,
        restoring,
        deleting,
        hasChanges,
        handleSettingChange,
        handleSave,
        handleCreateBackup,
        handleDeleteBackup,
        handleRestoreBackup,
    };
};
