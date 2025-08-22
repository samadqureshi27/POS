"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Save,
  CheckCircle,
  AlertCircle,
  X,
  Globe,
  DollarSign,
  Printer,
  Shield,
  Bell,
  ChevronDown,
} from "lucide-react";

// Import your custom button component
import ButtonPage from "../../../components/layout/UI/button";

// Types
interface GeneralSettings {
  currency: string;
  currencyPosition: "before" | "after";
  decimalPlaces: number;
  taxRate: number;
  language: string;
  timezone: string;
  dateFormat: string;
  timeFormat: "12" | "24";
  autoPrintReceipts: boolean;
  receiptCopies: number;
  receiptFooter: string;
  requireManagerForRefunds: boolean;
  requireManagerForDiscounts: boolean;
  sessionTimeout: number;
  enableNotifications: boolean;
  enableSounds: boolean;
}

interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

interface ToastProps {
  message: string;
  type: "success" | "error";
  onClose: () => void;
  isVisible: boolean;
}

interface DropdownOption {
  value: string;
  label: string;
}

interface DropdownProps {
  value: string;
  options: DropdownOption[];
  onValueChange: (value: string) => void;
  placeholder: string;
}

interface ButtonPageProps {
  checked: boolean;
  onChange: (value: boolean) => void;
}

// Constants
const DEFAULT_SETTINGS: GeneralSettings = {
  currency: "USD",
  currencyPosition: "before",
  decimalPlaces: 2,
  taxRate: 8.5,
  language: "en",
  timezone: "America/New_York",
  dateFormat: "MM/DD/YYYY",
  timeFormat: "12",
  autoPrintReceipts: false,
  receiptCopies: 1,
  receiptFooter: "Thank you for your business!",
  requireManagerForRefunds: true,
  requireManagerForDiscounts: false,
  sessionTimeout: 60,
  enableNotifications: true,
  enableSounds: true,
};

const OPTIONS = {
  language: [
    { value: "en", label: "English" },
    { value: "es", label: "Spanish" },
    { value: "fr", label: "French" },
    { value: "de", label: "German" },
    { value: "zh", label: "Chinese" },
  ],
  currency: [
    { value: "USD", label: "US Dollar ($)" },
    { value: "EUR", label: "Euro (€)" },
    { value: "GBP", label: "British Pound (£)" },
    { value: "JPY", label: "Japanese Yen (¥)" },
    { value: "CAD", label: "Canadian Dollar (C$)" },
  ],
  timezone: [
    { value: "America/New_York", label: "Eastern Time" },
    { value: "America/Chicago", label: "Central Time" },
    { value: "America/Denver", label: "Mountain Time" },
    { value: "America/Los_Angeles", label: "Pacific Time" },
    { value: "Europe/London", label: "GMT" },
  ],
  dateFormat: [
    { value: "MM/DD/YYYY", label: "MM/DD/YYYY (12/31/2024)" },
    { value: "DD/MM/YYYY", label: "DD/MM/YYYY (31/12/2024)" },
    { value: "YYYY-MM-DD", label: "YYYY-MM-DD (2024-12-31)" },
  ],
};

// API class following the same pattern as MenuAPI
class SettingsAPI {
  private static delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  private static mockSettings: GeneralSettings = { ...DEFAULT_SETTINGS };

  // GET /api/settings/
  static async getSettings(): Promise<ApiResponse<GeneralSettings>> {
    await this.delay(800);
    return {
      success: true,
      data: { ...this.mockSettings },
      message: "Settings loaded successfully",
    };
  }

  // PUT /api/settings/
  static async updateSettings(settings: Partial<GeneralSettings>): Promise<ApiResponse<GeneralSettings>> {
    await this.delay(1000);
    this.mockSettings = { ...this.mockSettings, ...settings };
    return {
      success: true,
      data: { ...this.mockSettings },
      message: "Settings updated successfully",
    };
  }

  // POST /api/settings/reset/
  static async resetToDefaults(): Promise<ApiResponse<GeneralSettings>> {
    await this.delay(800);
    this.mockSettings = { ...DEFAULT_SETTINGS };
    return {
      success: true,
      data: { ...this.mockSettings },
      message: "Settings reset to defaults successfully",
    };
  }
}

// Enhanced Toast Component with animations
const Toast = React.memo<ToastProps>(({ message, type, onClose, isVisible }) => (
  <div
    className={`fixed top-24 right-6 px-6 py-4 rounded-xl shadow-2xl z-[9999] flex items-center gap-3 min-w-[300px] max-w-[500px] transition-all duration-500 ease-in-out transform ${
      isVisible 
        ? 'translate-x-0 opacity-100 scale-100' 
        : 'translate-x-full opacity-0 scale-95'
    } ${
      type === "success" 
        ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-green-200" 
        : "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-red-200"
    }`}
    style={{
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.2)'
    }}
  >
    <div className={`flex-shrink-0 p-1 rounded-full ${type === "success" ? "bg-green-400/20" : "bg-red-400/20"}`}>
      {type === "success" ? (
        <CheckCircle size={20} className="text-white" />
      ) : (
        <AlertCircle size={20} className="text-white" />
      )}
    </div>
    
    <div className="flex-1">
      <p className="font-medium text-sm">{message}</p>
    </div>
    
    <button 
      onClick={onClose} 
      className="flex-shrink-0 p-1 rounded-full hover:bg-white/20 transition-colors duration-200" 
      aria-label="Close"
    >
      <X size={16} className="text-white" />
    </button>
  </div>
));

const SettingsDropdown = React.memo<DropdownProps>(({ value, options, onValueChange, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = useCallback(() => setIsOpen(prev => !prev), []);
  const handleSelect = useCallback((optionValue: string) => {
    onValueChange(optionValue);
    setIsOpen(false);
  }, [onValueChange]);

  const selectedLabel = useMemo(
    () => options.find(opt => opt.value === value)?.label || placeholder,
    [options, value, placeholder]
  );

  // Close dropdown on outside click
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.dropdown-container')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isOpen]);

  return (
    <div className="relative dropdown-container">
      <button
        type="button"
        onClick={handleToggle}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d9d9e1] bg-white text-left flex items-center justify-between"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        {selectedLabel}
        <ChevronDown size={16} className="text-gray-400" />
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              className="w-full px-3 py-2 text-left hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
              onClick={() => handleSelect(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
});

// Main Component
const GeneralSettingsPage = () => {
  const [settings, setSettings] = useState<GeneralSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error"; id: number } | null>(null);
  const [toastVisible, setToastVisible] = useState(false);

  const api = useMemo(() => SettingsAPI, []);

  // Enhanced toast management with animations
  const showToast = useCallback((message: string, type: "success" | "error") => {
    const id = Date.now();
    setToast({ message, type, id });
    setToastVisible(true);

    // Auto hide after 4 seconds
    setTimeout(() => {
      setToastVisible(false);
    }, 4000);

    // Remove from DOM after animation completes
    setTimeout(() => {
      setToast(null);
    }, 4500);
  }, []);

  const hideToast = useCallback(() => {
    setToastVisible(false);
    setTimeout(() => {
      setToast(null);
    }, 500);
  }, []);

  const loadSettings = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.getSettings();
      if (!response.success) throw new Error(response.message);
      setSettings(response.data);
    } catch {
      showToast("Failed to load settings", "error");
    } finally {
      setLoading(false);
    }
  }, [api, showToast]);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const handleSettingChange = useCallback((key: keyof GeneralSettings, value: any) => {
    if (!settings) return;
    setSettings(prev => prev ? { ...prev, [key]: value } : null);
    setHasChanges(true);
  }, [settings]);

  const handleSave = useCallback(async () => {
    if (!settings) return;
    try {
      setSaving(true);
      const response = await api.updateSettings(settings);
      if (response.success) {
        setHasChanges(false);
        showToast(response.message || "Settings saved successfully! 🎉", "success");
      }
    } catch {
      showToast("Failed to save settings. Please try again.", "error");
    } finally {
      setSaving(false);
    }
  }, [settings, api, showToast]);

  const handleResetToDefaults = useCallback(async () => {
    try {
      setResetting(true);
      const response = await api.resetToDefaults();
      if (response.success) {
        setSettings(response.data);
        setHasChanges(false);
        showToast(response.message || "Settings reset to defaults successfully! ✨", "success");
      }
    } catch {
      showToast("Failed to reset settings. Please try again.", "error");
    } finally {
      setResetting(false);
    }
  }, [api, showToast]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-b-2 border-yellow-600 rounded-full mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading Settings...</p>
        </div>
      </div>
    );
  }

  if (!settings) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
          isVisible={toastVisible}
        />
      )}

      <div className="ml-10 max-w-[1500px] mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between mb-12">
          <h1 className="text-3xl font-semibold text-gray-900">General Settings</h1>
          <div className="flex gap-3">
            <button
              onClick={handleResetToDefaults}
              disabled={resetting}
              className="flex items-center gap-2 px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {resetting ? (
                <>
                  <div className="animate-spin h-4 w-4 border-b-2 border-gray-600 rounded-full"></div>
                  Resetting...
                </>
              ) : (
                "Reset to Defaults"
              )}
            </button>
            <button
              onClick={handleSave}
              disabled={!hasChanges || saving}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg transition-colors ${hasChanges && !saving
                  ? "bg-[#2C2C2C] text-white hover:bg-gray-700"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
            >
              {saving ? (
                <>
                  <div className="animate-spin h-4 w-4 border-b-2 border-white rounded-full"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save size={16} />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Currency & Pricing Card */}
          <div className="bg-white rounded-md p-8 shadow-sm border border-gray-200 min-h-[500px]">
            <div className="flex items-center gap-2 mb-8">
              <DollarSign className="text-black" size={24} />
              <h2 className="text-xl font-semibold">Currency & Pricing</h2>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-2">Currency</label>
                <SettingsDropdown
                  value={settings.currency}
                  options={OPTIONS.currency}
                  onValueChange={(value) => handleSettingChange("currency", value)}
                  placeholder="Select Currency"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-2">Currency Position</label>
                <div className="flex flex-col gap-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="before"
                      checked={settings.currencyPosition === "before"}
                      onChange={(e) => handleSettingChange("currencyPosition", e.target.value)}
                      className="mr-2 text-blue-600"
                    />
                    Before amount ($100.00)
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="after"
                      checked={settings.currencyPosition === "after"}
                      onChange={(e) => handleSettingChange("currencyPosition", e.target.value)}
                      className="mr-2 text-blue-600"
                    />
                    After amount (100.00$)
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-2">Decimal Places</label>
                <input
                  type="number"
                  min="0"
                  max="4"
                  value={settings.decimalPlaces}
                  onChange={(e) => handleSettingChange("decimalPlaces", parseInt(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d9d9e1] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-2">Default Tax Rate (%)</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  value={settings.taxRate}
                  onChange={(e) => handleSettingChange("taxRate", parseFloat(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d9d9e1] focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Regional Settings Card */}
          <div className="bg-white rounded-md p-8 shadow-sm border border-gray-200 min-h-[500px]">
            <div className="flex items-center gap-2 mb-8">
              <Globe className="text-black" size={24} />
              <h2 className="text-xl font-semibold">Regional Settings</h2>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-2">Language</label>
                <SettingsDropdown
                  value={settings.language}
                  options={OPTIONS.language}
                  onValueChange={(value) => handleSettingChange("language", value)}
                  placeholder="Select Language"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-2">Timezone</label>
                <SettingsDropdown
                  value={settings.timezone}
                  options={OPTIONS.timezone}
                  onValueChange={(value) => handleSettingChange("timezone", value)}
                  placeholder="Select Timezone"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-2">Date Format</label>
                <SettingsDropdown
                  value={settings.dateFormat}
                  options={OPTIONS.dateFormat}
                  onValueChange={(value) => handleSettingChange("dateFormat", value)}
                  placeholder="Select Date Format"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-2">Time Format</label>
                <div className="flex flex-col gap-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="12"
                      checked={settings.timeFormat === "12"}
                      onChange={(e) => handleSettingChange("timeFormat", e.target.value)}
                      className="mr-2 text-blue-600"
                    />
                    12-hour (3:30 PM)
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="24"
                      checked={settings.timeFormat === "24"}
                      onChange={(e) => handleSettingChange("timeFormat", e.target.value)}
                      className="mr-2 text-blue-600"
                    />
                    24-hour (15:30)
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Receipt Settings Card */}
          <div className="bg-white rounded-md p-8 shadow-sm border border-gray-200 min-h-[500px]">
            <div className="flex items-center gap-2 mb-8">
              <Printer className="text-black" size={24} />
              <h2 className="text-xl font-semibold">Receipt Settings</h2>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-sm font-medium text-gray-500">Auto Print Receipts</label>
                  <p className="text-xs text-gray-500">Print receipt after each sale</p>
                </div>
                <ButtonPage
                  checked={settings.autoPrintReceipts}
                  onChange={(isActive) => handleSettingChange("autoPrintReceipts", isActive)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-2">Receipt Copies</label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={settings.receiptCopies}
                  onChange={(e) => handleSettingChange("receiptCopies", parseInt(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d9d9e1] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-2">Receipt Footer Message</label>
                <textarea
                  value={settings.receiptFooter}
                  onChange={(e) => handleSettingChange("receiptFooter", e.target.value)}
                  rows={3}
                  placeholder="Thank you message..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d9d9e1] focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Security & Access Card */}
          <div className="bg-white rounded-md p-8 shadow-sm border border-gray-200 min-h-[500px]">
            <div className="flex items-center gap-2 mb-8">
              <Shield className="text-black" size={24} />
              <h2 className="text-xl font-semibold">Security & Access</h2>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-sm font-medium text-gray-500">Manager Approval for Refunds</label>
                  <p className="text-xs text-gray-500">Require manager password for refunds</p>
                </div>
                <ButtonPage
                  checked={settings.requireManagerForRefunds}
                  onChange={(isActive) => handleSettingChange("requireManagerForRefunds", isActive)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-sm font-medium text-gray-500">Manager Approval for Discounts</label>
                  <p className="text-xs text-gray-500">Require manager password for discounts</p>
                </div>
                <ButtonPage
                  checked={settings.requireManagerForDiscounts}
                  onChange={(isActive) => handleSettingChange("requireManagerForDiscounts", isActive)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-2">Session Timeout (minutes)</label>
                <input
                  type="number"
                  min="5"
                  max="240"
                  value={settings.sessionTimeout}
                  onChange={(e) => handleSettingChange("sessionTimeout", parseInt(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d9d9e1] focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">Auto logout after inactivity</p>
              </div>
            </div>
          </div>

          {/* Notifications & Alerts Card */}
          <div className="bg-white rounded-md p-8 shadow-sm border border-gray-200 min-h-[500px]">
            <div className="flex items-center gap-2 mb-8">
              <Bell className="text-black" size={24} />
              <h2 className="text-xl font-semibold">Notifications & Alerts</h2>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-sm font-medium text-gray-500">Enable Notifications</label>
                  <p className="text-xs text-gray-500">Show system alerts and updates</p>
                </div>
                <ButtonPage
                  checked={settings.enableNotifications}
                  onChange={(isActive) => handleSettingChange("enableNotifications", isActive)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-sm font-medium text-gray-500">Enable Sound Effects</label>
                  <p className="text-xs text-gray-500">Play sounds for transactions and alerts</p>
                </div>
                <ButtonPage
                  checked={settings.enableSounds}
                  onChange={(isActive) => handleSettingChange("enableSounds", isActive)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneralSettingsPage;