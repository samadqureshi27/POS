"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Save,
  Download,
  Database,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  X,
  Trash2,
  History,
  Settings,
  ChevronDown,
} from "lucide-react";

// Import your custom button component
import ButtonPage from "../../../components/layout/UI/button";

// Custom Dropdown Types
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

// Custom Dropdown Component
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
        className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#d9d9e1] bg-white text-left flex items-center justify-between"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        {selectedLabel}
        <ChevronDown size={16} className="text-gray-400" />
      </button>
      
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-sm shadow-lg max-h-60 overflow-y-auto">
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

// Types
interface BackupSettings {
  // Automated Backup Settings
  autoBackupEnabled: boolean;
  backupFrequency: "daily" | "weekly" | "monthly";
  backupTime: string;
  retentionPeriod: number; // in days
  backupLocation: "local" | "cloud" | "both";
  
  // Data Selection
  includeMenuData: boolean;
  includeOrderHistory: boolean;
  includeCustomerData: boolean;
  includeEmployeeData: boolean;
  includeSettings: boolean;
  includeFinancialData: boolean;
  
  // Cloud Storage
  cloudStorageEnabled: boolean;
  maxStorageSize: number; // in GB
  autoCleanup: boolean;
}

interface BackupHistoryItem {
  id: string;
  date: string;
  size: string;
  type: "auto" | "manual";
  status: "completed" | "failed" | "in-progress";
  includes: string[];
}

interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

// Mock API
class BackupAPI {
  private static delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  private static mockSettings: BackupSettings = {
    autoBackupEnabled: true,
    backupFrequency: "daily",
    backupTime: "02:00",
    retentionPeriod: 30,
    backupLocation: "both",
    includeMenuData: true,
    includeOrderHistory: true,
    includeCustomerData: true,
    includeEmployeeData: true,
    includeSettings: true,
    includeFinancialData: true,
    cloudStorageEnabled: true,
    maxStorageSize: 10,
    autoCleanup: true,
  };

  private static mockBackupHistory: BackupHistoryItem[] = [
    {
      id: "1",
      date: "2023-10-15 02:00",
      size: "2.4 GB",
      type: "auto",
      status: "completed",
      includes: ["Menu", "Orders", "Customers", "Settings"]
    },
    {
      id: "2",
      date: "2023-10-14 02:00",
      size: "2.3 GB",
      type: "auto",
      status: "completed",
      includes: ["Menu", "Orders", "Customers", "Settings"]
    },
    {
      id: "3",
      date: "2023-10-13 14:30",
      size: "1.8 GB",
      type: "manual",
      status: "completed",
      includes: ["Menu", "Settings"]
    },
  ];

  static async getSettings(): Promise<ApiResponse<BackupSettings>> {
    await this.delay(800);
    return {
      success: true,
      data: { ...this.mockSettings },
      message: "Backup settings loaded successfully",
    };
  }

  static async getBackupHistory(): Promise<ApiResponse<BackupHistoryItem[]>> {
    await this.delay(600);
    return {
      success: true,
      data: [...this.mockBackupHistory],
      message: "Backup history loaded successfully",
    };
  }

  static async updateSettings(
    settings: Partial<BackupSettings>
  ): Promise<ApiResponse<BackupSettings>> {
    await this.delay(1000);
    this.mockSettings = { ...this.mockSettings, ...settings };
    return {
      success: true,
      data: { ...this.mockSettings },
      message: "Backup settings updated successfully",
    };
  }

  static async createBackup(
    backupType: "full" | "partial",
    selectedData?: string[]
  ): Promise<ApiResponse<{id: string}>> {
    await this.delay(2000);
    
    // Determine what data to include based on selections
    const defaultIncludes = ["Menu", "Orders", "Customers", "Employees", "Settings", "Financial"];
    const includes = selectedData && selectedData.length > 0 ? selectedData : defaultIncludes;
    
    const newBackup: BackupHistoryItem = {
      id: Date.now().toString(),
      date: new Date().toLocaleString(),
      size: backupType === "full" ? "2.5 GB" : `${Math.random() * 2 + 0.5}`.substring(0, 3) + " GB",
      type: "manual",
      status: "completed",
      includes: includes
    };
    this.mockBackupHistory.unshift(newBackup);
    return {
      success: true,
      data: { id: newBackup.id },
      message: "Backup created successfully",
    };
  }

  static async deleteBackup(backupId: string): Promise<ApiResponse<boolean>> {
    await this.delay(1500);
    // Remove from history
    this.mockBackupHistory = this.mockBackupHistory.filter(backup => backup.id !== backupId);
    return {
      success: true,
      data: true,
      message: "Backup deleted successfully",
    };
  }

  static async restoreBackup(backupId: string): Promise<ApiResponse<boolean>> {
    await this.delay(3000);
    return {
      success: true,
      data: true,
      message: "Backup restored successfully",
    };
  }
}

interface ToastProps {
  message: string;
  type: "success" | "error";
  onClose: () => void;
  isVisible: boolean;
}

// Enhanced Toast Component with animation
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

// Custom Modal Component
const Modal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isDestructive = false,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 200);
  };

  const handleConfirm = () => {
    setIsVisible(false);
    setTimeout(() => {
      onConfirm();
      onClose();
    }, 200);
  };

  if (!isOpen) return null;

  return (
    <div 
      className={`fixed inset-0 z-[9998] flex items-center justify-center transition-all duration-200 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/30 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div 
        className={`relative bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 transform transition-all duration-200 ${
          isVisible ? 'scale-100' : 'scale-95'
        }`}
      >
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
              isDestructive ? 'bg-red-100' : 'bg-blue-100'
            }`}>
              {isDestructive ? (
                <AlertCircle className="w-6 h-6 text-red-600" />
              ) : (
                <Database className="w-6 h-6 text-blue-600" />
              )}
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {title}
              </h3>
              <p className="text-gray-600">
                {message}
              </p>
            </div>
          </div>
          
          <div className="flex gap-3 mt-6 justify-end">
            <button
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              {cancelText}
            </button>
            <button
              onClick={handleConfirm}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                isDestructive
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const BackupRecoveryPage = () => {
  const [settings, setSettings] = useState<BackupSettings | null>(null);
  const [backupHistory, setBackupHistory] = useState<BackupHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [creatingBackup, setCreatingBackup] = useState(false);
  const [restoring, setRestoring] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  
  // Fixed toast state management
  const [toast, setToast] = useState<{ message: string; type: "success" | "error"; id: number } | null>(null);
  const [toastVisible, setToastVisible] = useState(false);
  
  const [modal, setModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    confirmText?: string;
    isDestructive?: boolean;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  // Dropdown options
  const frequencyOptions = [
    { value: "daily", label: "Daily" },
    { value: "weekly", label: "Weekly" },
    { value: "monthly", label: "Monthly" }
  ];

  
  useEffect(() => {
    loadData();
  }, []);

  // Fixed toast management with animations
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

  const showModal = (title: string, message: string, onConfirm: () => void, isDestructive = false) => {
    setModal({
      isOpen: true,
      title,
      message,
      onConfirm,
      isDestructive,
    });
  };

  const closeModal = () => {
    setModal(prev => ({ ...prev, isOpen: false }));
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const [settingsResponse, historyResponse] = await Promise.all([
        BackupAPI.getSettings(),
        BackupAPI.getBackupHistory()
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
  };

  const handleSettingChange = (key: keyof BackupSettings, value: any) => {
    if (!settings) return;
    setSettings(prev => prev ? { ...prev, [key]: value } : null);
    setHasChanges(true);
  };

  const handleSave = async () => {
    if (!settings) return;
    try {
      setSaving(true);
      const response = await BackupAPI.updateSettings(settings);
      if (response.success) {
        setHasChanges(false);
        showToast(response.message || "Settings saved successfully! 🎉", "success");
      }
    } catch {
      showToast("Failed to save settings. Please try again.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleCreateBackup = async (type: "full" | "partial" = "full") => {
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
        showToast(`Backup created successfully with ${selectedData.length} data type(s)! ✨`, "success");
      } else {
        showToast("Failed to create backup", "error");
      }
    } catch (error) {
      console.error("Backup creation error:", error);
      showToast("Failed to create backup", "error");
    } finally {
      setCreatingBackup(false);
    }
  };

  const handleDeleteBackup = (backupId: string) => {
    const backup = backupHistory.find(b => b.id === backupId);
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
            showToast(response.message || "Backup deleted successfully! 🗑️", "success");
          }
        } catch {
          showToast("Failed to delete backup", "error");
        } finally {
          setDeleting(null);
        }
      },
      true
    );
  };

  const handleRestoreBackup = (backupId: string) => {
    const backup = backupHistory.find(b => b.id === backupId);
    if (!backup) return;

    showModal(
      "Restore Backup",
      `Are you sure you want to restore the backup from ${backup.date}? This will overwrite your current data.`,
      async () => {
        try {
          setRestoring(backupId);
          const response = await BackupAPI.restoreBackup(backupId);
          if (response.success) {
            showToast(response.message || "Backup restored successfully! 🔄", "success");
          }
        } catch {
          showToast("Failed to restore backup", "error");
        } finally {
          setRestoring(null);
        }
      }
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "text-gray-600 bg-gray-100";
      case "failed": return "text-red-600 bg-red-100";
      case "in-progress": return "text-blue-600 bg-blue-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-b-2 border-yellow-600 rounded-full mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading Backup Settings...</p>
        </div>
      </div>
    );
  }

  if (!settings) return null;

  return (
    <div className="min-h-screen bg-gray-50 w-[92.5vw]">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
          isVisible={toastVisible}
        />
      )}

      <Modal
        isOpen={modal.isOpen}
        onClose={closeModal}
        onConfirm={modal.onConfirm}
        title={modal.title}
        message={modal.message}
        isDestructive={modal.isDestructive}
        confirmText={modal.isDestructive ? "Delete" : "Restore"}
      />

      <div className="mt-20">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-semibold text-gray-900">Backup & Recovery</h1>
          <div className="flex gap-3">
            <button
              onClick={() => handleCreateBackup("full")}
              disabled={creatingBackup}
              className="flex items-center gap-2 px-6 py-2 border border-gray-300 rounded-sm hover:bg-gray-100 transition-colors disabled:opacity-50"
            >
              {creatingBackup ? (
                <>
                  <div className="animate-spin h-4 w-4 border-b-2 border-gray-600 rounded-full"></div>
                  Creating...
                </>
              ) : (
                <>
                  <Database size={16} />
                  Create Backup
                </>
              )}
            </button>
            <button
              onClick={handleSave}
              disabled={!hasChanges || saving}
              className={`flex items-center gap-2 px-6 py-2 rounded-sm transition-colors ${
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
                  Save Settings
                </>
              )}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Backup Settings */}
          <div className="bg-white rounded-sm p-6 shadow-sm border border-gray-200">
            <div className="flex items-center gap-2 mb-6">
              <Settings className="text-black" size={20} />
              <h2 className="text-lg font-semibold">Backup Settings</h2>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Automatic Backups
                  </label>
                  <p className="text-xs text-gray-500">Enable scheduled backups</p>
                </div>
                <ButtonPage
                  checked={settings.autoBackupEnabled}
                  onChange={(isActive) => handleSettingChange("autoBackupEnabled", isActive)}
                />
              </div>

              {settings.autoBackupEnabled && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Backup Frequency
                    </label>
                    <SettingsDropdown
                      value={settings.backupFrequency}
                      options={frequencyOptions}
                      onValueChange={(value) => handleSettingChange("backupFrequency", value)}
                      
                      placeholder="Select frequency"
                      
                      
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Backup Time
                    </label>
                    <input
                      type="time"
                      value={settings.backupTime}
                      onChange={(e) => handleSettingChange("backupTime", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#d9d9e1]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Retention Period (days)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="365"
                      value={settings.retentionPeriod}
                      onChange={(e) => handleSettingChange("retentionPeriod", parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#d9d9e1]"
                    />
                  </div>
                </>
              )}

              

              <div className="pt-4 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Data to Include</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.includeMenuData}
                      onChange={(e) => handleSettingChange("includeMenuData", e.target.checked)}
                      className="mr-2 text-black"
                    />
                    <label className="text-sm">Menu Data</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.includeOrderHistory}
                      onChange={(e) => handleSettingChange("includeOrderHistory", e.target.checked)}
                      className="mr-2 text-black"
                    />
                    <label className="text-sm">Order History</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.includeCustomerData}
                      onChange={(e) => handleSettingChange("includeCustomerData", e.target.checked)}
                      className="mr-2 text-black"
                    />
                    <label className="text-sm">Customer Data</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.includeEmployeeData}
                      onChange={(e) => handleSettingChange("includeEmployeeData", e.target.checked)}
                      className="mr-2 text-black"
                    />
                    <label className="text-sm">Employee Data</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.includeSettings}
                      onChange={(e) => handleSettingChange("includeSettings", e.target.checked)}
                      className="mr-2 text-black"
                    />
                    <label className="text-sm">System Settings</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.includeFinancialData}
                      onChange={(e) => handleSettingChange("includeFinancialData", e.target.checked)}
                      className="mr-2 text-black"
                    />
                    <label className="text-sm">Financial Data</label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Backup History */}
          <div className="bg-white rounded-sm p-6 shadow-sm border border-gray-200">
            <div className="flex items-center gap-2 mb-6">
              <History className="text-black" size={20} />
              <h2 className="text-lg font-semibold">Backup History</h2>
            </div>
            
            <div className="space-y-4">
              {backupHistory.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Database size={32} className="mx-auto mb-2 opacity-50" />
                  <p>No backups found</p>
                </div>
              ) : (
                backupHistory.map((backup) => (
                  <div key={backup.id} className="border border-gray-200 rounded-sm p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium">{backup.date}</p>
                        <p className="text-sm text-gray-500">{backup.size} • {backup.type}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(backup.status)}`}>
                        {backup.status}
                      </span>
                    </div>
                    
                    <div className="mb-3">
                      <p className="text-xs text-gray-500 mb-1">Includes:</p>
                      <div className="flex flex-wrap gap-1">
                        {backup.includes.map((item, index) => (
                          <span key={index} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleRestoreBackup(backup.id)}
                        disabled={restoring === backup.id}
                        className="flex items-center gap-1 px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors disabled:opacity-50"
                      >
                        {restoring === backup.id ? (
                          <>
                            <div className="animate-spin h-3 w-3 border-b-2 border-blue-700 rounded-full"></div>
                            Restoring...
                          </>
                        ) : (
                          <>
                            <RefreshCw size={14} />
                            Restore
                          </>
                        )}
                      </button>
                      <button className="flex items-center gap-1 px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors">
                        <Download size={14} />
                        Download
                      </button>
                      <button 
                        onClick={() => handleDeleteBackup(backup.id)}
                        disabled={deleting === backup.id}
                        className={`flex items-center gap-1 px-2 py-1 text-xs rounded transition-colors ml-auto ${
                          deleting === backup.id 
                            ? "bg-gray-200 text-gray-400 cursor-not-allowed" 
                            : "bg-[#2C2C2C] text-white hover:bg-gray-700"
                        }`}
                      >
                        {deleting === backup.id ? (
                          <>
                            <div className="animate-spin h-3 w-3 border-b-2 border-gray-400 rounded-full"></div>
                            Deleting...
                          </>
                        ) : (
                          <>
                            <Trash2 size={12} />
                            Delete
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Storage Information */}
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default BackupRecoveryPage;