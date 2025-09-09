import { useState, useEffect, useCallback } from "react";
import { NotificationSettings } from "../../types/notification";
import { NotificationsAPI } from "../util/notifications-api";

export const useNotificationSettings = (
    onToast: (message: string, type: "success" | "error") => void
) => {
    const [settings, setSettings] = useState<NotificationSettings | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [resetting, setResetting] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            setLoading(true);
            const response = await NotificationsAPI.getSettings();
            if (!response.success) throw new Error(response.message);
            setSettings(response.data);
        } catch {
            onToast("Failed to load notification settings", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleSettingChange = useCallback(
        (key: keyof NotificationSettings, value: any) => {
            if (!settings) return;
            setSettings((prev) => (prev ? { ...prev, [key]: value } : null));
            setHasChanges(true);
        },
        [settings]
    );

    const handleSave = async () => {
        if (!settings) return;
        try {
            setSaving(true);
            const response = await NotificationsAPI.updateSettings(settings);
            if (response.success) {
                setHasChanges(false);
                onToast(
                    response.message || "Notification settings updated successfully!",
                    "success"
                );
            }
        } catch {
            onToast("Failed to save notification settings", "error");
        } finally {
            setSaving(false);
        }
    };

    const handleReset = async () => {
        try {
            setResetting(true);
            const response = await NotificationsAPI.resetToDefaults();
            if (response.success) {
                setSettings(response.data);
                setHasChanges(false);
                onToast(
                    response.message || "Settings reset to defaults successfully!",
                    "success"
                );
            }
        } catch {
            onToast("Failed to reset settings", "error");
        } finally {
            setResetting(false);
        }
    };

    return {
        settings,
        loading,
        saving,
        resetting,
        hasChanges,
        handleSettingChange,
        handleSave,
        handleReset,
    };
};
