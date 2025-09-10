import { useState, useEffect, useCallback, useMemo } from "react";

import { GeneralSettings } from "@/types";

import { SettingsAPI } from "../util/GsettingsAPI";

interface UseSettingsReturn {
  settings: GeneralSettings | null;
  loading: boolean;
  saving: boolean;
  resetting: boolean;
  hasChanges: boolean;
  handleSettingChange: (key: keyof GeneralSettings, value: any) => void;
  handleSave: () => Promise<void>;
  handleResetToDefaults: () => Promise<void>;
  loadSettings: () => Promise<void>;
}

interface UseSettingsProps {
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}

export const useSettings = ({
  onSuccess,
  onError,
}: UseSettingsProps): UseSettingsReturn => {
  const [settings, setSettings] = useState<GeneralSettings | null>(null);
  const [originalSettings, setOriginalSettings] = useState<GeneralSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);

  const hasChanges = useMemo(() => {
    if (!settings || !originalSettings) return false;
    return JSON.stringify(settings) !== JSON.stringify(originalSettings);
  }, [settings, originalSettings]);

  const loadSettings = useCallback(async () => {
    try {
      setLoading(true);
      const response = await SettingsAPI.getSettings(); // Direct call, no memoization
      if (!response.success) throw new Error(response.message);
      setSettings(response.data);
      setOriginalSettings(response.data);
    } catch (error) {
      console.error('Settings loading error:', error);
      onError("Failed to load settings");
    } finally {
      setLoading(false);
    }
  }, [onError]); // Removed api from dependencies

  // Load settings only once on mount
  useEffect(() => {
    loadSettings();
  }, []); // Empty dependency array - only run on mount

  const handleSettingChange = useCallback(
    (key: keyof GeneralSettings, value: any) => {
      if (!settings) return;
      setSettings((prev) => (prev ? { ...prev, [key]: value } : null));
    },
    [settings]
  );

  const handleSave = useCallback(async () => {
    if (!settings) return;
    try {
      setSaving(true);
      const response = await SettingsAPI.updateSettings(settings);
      if (response.success) {
        setOriginalSettings(settings);
        onSuccess(response.message || "Settings saved successfully! 🎉");
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.error('Settings save error:', error);
      onError("Failed to save settings. Please try again.");
    } finally {
      setSaving(false);
    }
  }, [settings, onSuccess, onError]);

  const handleResetToDefaults = useCallback(async () => {
    try {
      setResetting(true);
      const response = await SettingsAPI.resetToDefaults();
      if (response.success) {
        setSettings(response.data);
        setOriginalSettings(response.data);
        onSuccess(
          response.message || "Settings reset to defaults successfully! ✨"
        );
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.error('Settings reset error:', error);
      onError("Failed to reset settings. Please try again.");
    } finally {
      setResetting(false);
    }
  }, [onSuccess, onError]);

  return {
    settings,
    loading,
    saving,
    resetting,
    hasChanges,
    handleSettingChange,
    handleSave,
    handleResetToDefaults,
    loadSettings,
  };
};