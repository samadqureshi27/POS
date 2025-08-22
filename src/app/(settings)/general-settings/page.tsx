"use client";

import React, { useState, useEffect } from "react";
import {
  Save,
  Globe,
  DollarSign,
  Clock,
  Settings,
  CheckCircle,
  AlertCircle,
  X,
  Monitor,
  Bell,
  Shield,
  FileText,
  Printer,
  ChevronDown,
} from "lucide-react";
import ButtonPage from "../../../components/layout/UI/button";

// Types
interface GeneralSettings {
  // Language & Localization
  language: string;
  timezone: string;
  dateFormat: string;
  timeFormat: "12" | "24";
  
  // Currency & Financial
  currency: string;
  currencyPosition: "before" | "after";
  decimalPlaces: number;
  thousandSeparator: "," | "." | " ";
  decimalSeparator: "." | ",";
  
  // System Preferences
  theme: "light" | "dark" | "auto";
  companyName: string;
  companyAddress: string;
  companyPhone: string;
  companyEmail: string;
  taxRate: number;
  
  // POS Specific
  receiptFooter: string;
  autoLogoutTime: number;
  lowStockAlert: number;
  enableNotifications: boolean;
  enableSounds: boolean;
  defaultPaymentMethod: string;
  
  // Security
  requirePasswordForRefunds: boolean;
  requirePasswordForDiscounts: boolean;
  sessionTimeout: number;
  
  // Printing
  receiptPrinter: string;
  autoPrintReceipts: boolean;
  receiptCopies: number;
}

interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

// Mock API
class SettingsAPI {
  private static delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  private static mockSettings: GeneralSettings = {
    language: "en",
    timezone: "America/New_York",
    dateFormat: "MM/DD/YYYY",
    timeFormat: "12",
    currency: "USD",
    currencyPosition: "before",
    decimalPlaces: 2,
    thousandSeparator: ",",
    decimalSeparator: ".",
    theme: "light",
    companyName: "My POS Store",
    companyAddress: "123 Main St, City, State 12345",
    companyPhone: "+1 (555) 123-4567",
    companyEmail: "contact@myposstore.com",
    taxRate: 8.5,
    receiptFooter: "Thank you for your business!",
    autoLogoutTime: 30,
    lowStockAlert: 10,
    enableNotifications: true,
    enableSounds: true,
    defaultPaymentMethod: "cash",
    requirePasswordForRefunds: true,
    requirePasswordForDiscounts: false,
    sessionTimeout: 60,
    receiptPrinter: "default",
    autoPrintReceipts: false,
    receiptCopies: 1,
  };

  static async getSettings(): Promise<ApiResponse<GeneralSettings>> {
    await this.delay(800);
    return {
      success: true,
      data: { ...this.mockSettings },
      message: "Settings fetched successfully",
    };
  }

  static async updateSettings(
    settings: Partial<GeneralSettings>
  ): Promise<ApiResponse<GeneralSettings>> {
    await this.delay(1000);
    this.mockSettings = { ...this.mockSettings, ...settings };
    return {
      success: true,
      data: { ...this.mockSettings },
      message: "Settings updated successfully",
    };
  }

  static async resetToDefaults(): Promise<ApiResponse<GeneralSettings>> {
    await this.delay(800);
    const defaultSettings: GeneralSettings = {
      language: "en",
      timezone: "America/New_York",
      dateFormat: "MM/DD/YYYY",
      timeFormat: "12",
      currency: "USD",
      currencyPosition: "before",
      decimalPlaces: 2,
      thousandSeparator: ",",
      decimalSeparator: ".",
      theme: "light",
      companyName: "My POS Store",
      companyAddress: "123 Main St, City, State 12345",
      companyPhone: "+1 (555) 123-4567",
      companyEmail: "contact@myposstore.com",
      taxRate: 8.5,
      receiptFooter: "Thank you for your business!",
      autoLogoutTime: 30,
      lowStockAlert: 10,
      enableNotifications: true,
      enableSounds: true,
      defaultPaymentMethod: "cash",
      requirePasswordForRefunds: true,
      requirePasswordForDiscounts: false,
      sessionTimeout: 60,
      receiptPrinter: "default",
      autoPrintReceipts: false,
      receiptCopies: 1,
    };
    this.mockSettings = { ...defaultSettings };
    return {
      success: true,
      data: { ...this.mockSettings },
      message: "Settings reset to defaults successfully",
    };
  }
}

// Toast Component
const Toast = ({
  message,
  type,
  onClose,
}: {
  message: string;
  type: "success" | "error";
  onClose: () => void;
}) => (
  <div
    className={`fixed top-4 right-4 px-4 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2 ${
      type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"
    }`}
  >
    {type === "success" ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
    <span>{message}</span>
    <button onClick={onClose} className="ml-2">
      <X size={16} />
    </button>
  </div>
);

// Toggle Switch Component (kept for backward compatibility if needed elsewhere)
const ToggleSwitch = ({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
}) => (
  <button
    type="button"
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
      checked ? "bg-blue-600" : "bg-gray-200"
    }`}
    onClick={() => onChange(!checked)}
  >
    <span
      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
        checked ? "translate-x-6" : "translate-x-1"
      }`}
    />
  </button>
);

// Dropdown Component
const SettingsDropdown = ({
  value,
  options,
  onValueChange,
  placeholder,
}: {
  value: string;
  options: { value: string; label: string }[];
  onValueChange: (value: string) => void;
  placeholder: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d9d9e1] bg-white text-left flex items-center justify-between"
      >
        {options.find((opt) => opt.value === value)?.label || placeholder}
        <ChevronDown size={16} className="text-gray-400" />
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              className="w-full px-3 py-2 text-left hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
              onClick={() => {
                onValueChange(option.value);
                setIsOpen(false);
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const GeneralSettingsPage = () => {
  const [settings, setSettings] = useState<GeneralSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  // Auto-close toast
  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  useEffect(() => {
    loadSettings();
  }, []);

  const showToast = (message: string, type: "success" | "error") =>
    setToast({ message, type });

  const loadSettings = async () => {
    try {
      setLoading(true);
      const response = await SettingsAPI.getSettings();
      if (!response.success) throw new Error(response.message);
      setSettings(response.data);
    } catch {
      showToast("Failed to load settings", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSettingChange = (key: keyof GeneralSettings, value: any) => {
    if (!settings) return;
    setSettings(prev => prev ? { ...prev, [key]: value } : null);
    setHasChanges(true);
  };

  const handleSave = async () => {
    if (!settings) return;
    try {
      setSaving(true);
      const response = await SettingsAPI.updateSettings(settings);
      if (response.success) {
        setHasChanges(false);
        showToast(response.message || "Settings saved successfully", "success");
      }
    } catch {
      showToast("Failed to save settings", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleResetToDefaults = async () => {
    try {
      setResetting(true);
      const response = await SettingsAPI.resetToDefaults();
      if (response.success) {
        setSettings(response.data);
        setHasChanges(false);
        setShowResetModal(false);
        showToast(response.message || "Settings reset to defaults", "success");
      }
    } catch {
      showToast("Failed to reset settings", "error");
    } finally {
      setResetting(false);
    }
  };

  const languageOptions = [
    { value: "en", label: "English" },
    { value: "es", label: "Spanish" },
    { value: "fr", label: "French" },
    { value: "de", label: "German" },
    { value: "zh", label: "Chinese" },
    { value: "ja", label: "Japanese" },
    { value: "ar", label: "Arabic" },
  ];

  const currencyOptions = [
    { value: "USD", label: "US Dollar ($)" },
    { value: "EUR", label: "Euro (€)" },
    { value: "GBP", label: "British Pound (£)" },
    { value: "JPY", label: "Japanese Yen (¥)" },
    { value: "CAD", label: "Canadian Dollar (C$)" },
    { value: "AUD", label: "Australian Dollar (A$)" },
  ];

  const timezoneOptions = [
    { value: "America/New_York", label: "Eastern Time" },
    { value: "America/Chicago", label: "Central Time" },
    { value: "America/Denver", label: "Mountain Time" },
    { value: "America/Los_Angeles", label: "Pacific Time" },
    { value: "Europe/London", label: "GMT" },
    { value: "Europe/Paris", label: "Central European Time" },
    { value: "Asia/Tokyo", label: "Japan Standard Time" },
  ];

  const dateFormatOptions = [
    { value: "MM/DD/YYYY", label: "MM/DD/YYYY (12/31/2024)" },
    { value: "DD/MM/YYYY", label: "DD/MM/YYYY (31/12/2024)" },
    { value: "YYYY-MM-DD", label: "YYYY-MM-DD (2024-12-31)" },
    { value: "DD MMM YYYY", label: "DD MMM YYYY (31 Dec 2024)" },
  ];

  const paymentMethodOptions = [
    { value: "cash", label: "Cash" },
    { value: "card", label: "Credit/Debit Card" },
    { value: "digital", label: "Digital Wallet" },
    { value: "check", label: "Check" },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-b-2 border-yellow-600 rounded-full mx-auto"></div>
        </div>
      </div>
    );
  }

  if (!settings) return null;

  return (
    <div className="mx-6 p-6 bg-gray-50 min-h-screen">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6 pl-20">
        <h1 className="text-3xl font-semibold">General Settings</h1>
        <div className="flex gap-3">
          <button
            onClick={() => setShowResetModal(true)}
            disabled={resetting}
            className="flex items-center gap-2 px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {resetting ? (
              <>
                <div className="animate-spin h-4 w-4 border-b-2 border-gray-600 rounded-full"></div>
                Resetting...
              </>
            ) : (
              <>
                Reset to Defaults
              </>
            )}
          </button>
          <button
            onClick={handleSave}
            disabled={!hasChanges || saving}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg transition-colors ${
              hasChanges && !saving
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

      <div className="ml-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Language & Localization */}
        <div className="bg-white rounded-lg p-6 shadow-sm h-fit">
          <div className="flex items-center gap-2 mb-4">
            <Globe className="text-gray-600" size={20} />
            <h2 className="text-lg font-semibold">Language & Localization</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Language
              </label>
              <SettingsDropdown
                value={settings.language}
                options={languageOptions}
                onValueChange={(value) => handleSettingChange("language", value)}
                placeholder="Select Language"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Timezone
              </label>
              <SettingsDropdown
                value={settings.timezone}
                options={timezoneOptions}
                onValueChange={(value) => handleSettingChange("timezone", value)}
                placeholder="Select Timezone"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date Format
              </label>
              <SettingsDropdown
                value={settings.dateFormat}
                options={dateFormatOptions}
                onValueChange={(value) => handleSettingChange("dateFormat", value)}
                placeholder="Select Date Format"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time Format
              </label>
              <div className="flex flex-col gap-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="12"
                    checked={settings.timeFormat === "12"}
                    onChange={(e) => handleSettingChange("timeFormat", e.target.value)}
                    className="mr-2"
                  />
                  12-hour (3:30 PM)
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="24"
                    checked={settings.timeFormat === "24"}
                    onChange={(e) => handleSettingChange("timeFormat", e.target.value)}
                    className="mr-2"
                  />
                  24-hour (15:30)
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Currency & Financial */}
        <div className="bg-white rounded-lg p-6 shadow-sm h-fit">
          <div className="flex items-center gap-2 mb-4">
            <DollarSign className="text-gray-600" size={20} />
            <h2 className="text-lg font-semibold">Currency & Financial</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Currency
              </label>
              <SettingsDropdown
                value={settings.currency}
                options={currencyOptions}
                onValueChange={(value) => handleSettingChange("currency", value)}
                placeholder="Select Currency"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Currency Position
              </label>
              <div className="flex flex-col gap-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="before"
                    checked={settings.currencyPosition === "before"}
                    onChange={(e) => handleSettingChange("currencyPosition", e.target.value)}
                    className="mr-2"
                  />
                  Before ($100)
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="after"
                    checked={settings.currencyPosition === "after"}
                    onChange={(e) => handleSettingChange("currencyPosition", e.target.value)}
                    className="mr-2"
                  />
                  After (100$)
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Decimal Places
              </label>
              <input
                type="number"
                min="0"
                max="4"
                value={settings.decimalPlaces}
                onChange={(e) => handleSettingChange("decimalPlaces", parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d9d9e1]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tax Rate (%)
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="100"
                value={settings.taxRate}
                onChange={(e) => handleSettingChange("taxRate", parseFloat(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d9d9e1]"
              />
            </div>
          </div>
        </div>

        {/* Company Information */}
        <div className="bg-white rounded-lg p-6 shadow-sm h-fit">
          <div className="flex items-center gap-2 mb-4">
            <Settings className="text-gray-600" size={20} />
            <h2 className="text-lg font-semibold">Company Information</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Name
              </label>
              <input
                type="text"
                value={settings.companyName}
                onChange={(e) => handleSettingChange("companyName", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d9d9e1]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address
              </label>
              <textarea
                value={settings.companyAddress}
                onChange={(e) => handleSettingChange("companyAddress", e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d9d9e1]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone
              </label>
              <input
                type="tel"
                value={settings.companyPhone}
                onChange={(e) => handleSettingChange("companyPhone", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d9d9e1]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={settings.companyEmail}
                onChange={(e) => handleSettingChange("companyEmail", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d9d9e1]"
              />
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-white rounded-lg p-6 shadow-sm h-fit">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="text-gray-600" size={20} />
            <h2 className="text-lg font-semibold">Security</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Require Password for Refunds
                </label>
                <p className="text-xs text-gray-500">Manager password required</p>
              </div>
              <ButtonPage
                checked={settings.requirePasswordForRefunds}
                onChange={(isActive) => handleSettingChange("requirePasswordForRefunds", isActive)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Require Password for Discounts
                </label>
                <p className="text-xs text-gray-500">Manager password required</p>
              </div>
              <ButtonPage
                checked={settings.requirePasswordForDiscounts}
                onChange={(isActive) => handleSettingChange("requirePasswordForDiscounts", isActive)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Session Timeout (minutes)
              </label>
              <input
                type="number"
                min="10"
                max="240"
                value={settings.sessionTimeout}
                onChange={(e) => handleSettingChange("sessionTimeout", parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d9d9e1]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Auto Logout Time (minutes)
              </label>
              <input
                type="number"
                min="5"
                max="120"
                value={settings.autoLogoutTime}
                onChange={(e) => handleSettingChange("autoLogoutTime", parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d9d9e1]"
              />
            </div>
          </div>
        </div>

        {/* System Preferences */}
        <div className="bg-white rounded-lg p-6 shadow-sm h-fit">
          <div className="flex items-center gap-2 mb-4">
            <Monitor className="text-gray-600" size={20} />
            <h2 className="text-lg font-semibold">System Preferences</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Default Payment Method
              </label>
              <SettingsDropdown
                value={settings.defaultPaymentMethod}
                options={paymentMethodOptions}
                onValueChange={(value) => handleSettingChange("defaultPaymentMethod", value)}
                placeholder="Select Payment Method"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Low Stock Alert Threshold
              </label>
              <input
                type="number"
                min="0"
                value={settings.lowStockAlert}
                onChange={(e) => handleSettingChange("lowStockAlert", parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d9d9e1]"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Enable Notifications
                </label>
                <p className="text-xs text-gray-500">Show system notifications</p>
              </div>
              <ButtonPage
                checked={settings.enableNotifications}
                onChange={(isActive) => handleSettingChange("enableNotifications", isActive)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Enable Sound Effects
                </label>
                <p className="text-xs text-gray-500">Play sounds for alerts</p>
              </div>
              <ButtonPage
                checked={settings.enableSounds}
                onChange={(isActive) => handleSettingChange("enableSounds", isActive)}
              />
            </div>
          </div>
        </div>

        {/* Receipt & Printing */}
        <div className="bg-white rounded-lg p-6 shadow-sm h-fit">
          <div className="flex items-center gap-2 mb-4">
            <Printer className="text-gray-600" size={20} />
            <h2 className="text-lg font-semibold">Receipt & Printing</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Receipt Footer Message
              </label>
              <textarea
                value={settings.receiptFooter}
                onChange={(e) => handleSettingChange("receiptFooter", e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d9d9e1]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Receipt Copies
              </label>
              <input
                type="number"
                min="1"
                max="5"
                value={settings.receiptCopies}
                onChange={(e) => handleSettingChange("receiptCopies", parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d9d9e1]"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Auto Print Receipts
                </label>
                <p className="text-xs text-gray-500">Print after each transaction</p>
              </div>
              <ButtonPage
                checked={settings.autoPrintReceipts}
                onChange={(isActive) => handleSettingChange("autoPrintReceipts", isActive)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="text-red-500" size={24} />
              <h3 className="text-lg font-semibold">Reset to Defaults</h3>
            </div>
            
            <p className="text-gray-600 mb-6">
              Are you sure you want to reset all settings to their default values? This action cannot be undone.
            </p>
            
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowResetModal(false)}
                disabled={resetting}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleResetToDefaults}
                disabled={resetting}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {resetting ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-b-2 border-white rounded-full"></div>
                    Resetting...
                  </>
                ) : (
                  "Reset to Defaults"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GeneralSettingsPage;