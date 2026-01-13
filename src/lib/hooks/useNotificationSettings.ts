import { useState, useEffect, useCallback } from "react";
import { NotificationSettings } from "@/lib/types/notification";
import { NotificationsAPI } from "../util/notifications-api";
import { Toast } from "@/lib/util/toast-helpers";

export const useNotificationSettings = () => {
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
            Toast.error("Failed to load notification settings");
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
                Toast.success(response.message || "Notification settings updated successfully!");
            }
        } catch {
            Toast.error("Failed to save notification settings");
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
                Toast.success(response.message || "Settings reset to defaults successfully!");
            }
        } catch {
            Toast.error("Failed to reset settings");
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
