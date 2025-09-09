import { useState, useEffect, useCallback } from "react";
import { BackupSettings, BackupHistoryItem } from "../../types/Backup";
import { BackupAPI } from "../util/BackupApi";

interface UseBackupProps {
    showToast: (message: string, type: "success" | "error") => void;
    showModal: (
        title: string,
        message: string,
        onConfirm: () => void,
        isDestructive?: boolean
    ) => void;
}

export const useBackup = ({ showToast, showModal }: UseBackupProps) => {
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
            showToast("Failed to load backup data", "error");
        } finally {
            setLoading(false);
        }
    }, [showToast]);

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
                showToast(
                    response.message || "Settings saved successfully! 🎉",
                    "success"
                );
            }
        } catch {
            showToast("Failed to save settings. Please try again.", "error");
        } finally {
            setSaving(false);
        }
    }, [settings, showToast]);

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
                    showToast("Please select at least one data type to backup", "error");
                    return;
                }

                const response = await BackupAPI.createBackup(type, selectedData);
                if (response.success) {
                    // Refresh the backup history
                    const historyResponse = await BackupAPI.getBackupHistory();
                    if (historyResponse.success) {
                        setBackupHistory(historyResponse.data);
                    }
                    showToast(
                        `Backup created successfully with ${selectedData.length} data type(s)! ✨`,
                        "success"
                    );
                } else {
                    showToast("Failed to create backup", "error");
                }
            } catch (error) {
                console.error("Backup creation error:", error);
                showToast("Failed to create backup", "error");
            } finally {
                setCreatingBackup(false);
            }
        },
        [settings, showToast]
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
                            showToast(
                                response.message || "Backup deleted successfully! 🗑️",
                                "success"
                            );
                        }
                    } catch {
                        showToast("Failed to delete backup", "error");
                    } finally {
                        setDeleting(null);
                    }
                },
                true
            );
        },
        [backupHistory, showModal, showToast]
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
                            showToast(
                                response.message || "Backup restored successfully! 🔄",
                                "success"
                            );
                        }
                    } catch {
                        showToast("Failed to restore backup", "error");
                    } finally {
                        setRestoring(null);
                    }
                }
            );
        },
        [backupHistory, showModal, showToast]
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
