"use client";
import React, { useState, useEffect, useCallback } from "react";
import {
  Save,
  CheckCircle,
  AlertCircle,
  X,
  Bell,
  ShoppingCart,
  Utensils,
  CreditCard,
  Users,
  Package,
  Settings,
  Calendar,
  MessageSquare,
} from "lucide-react";

// Import your custom button component
import ButtonPage from "../../../components/layout/UI/button";

// Types
interface NotificationSettings {
  // Order Management
  newOrderAlerts: boolean;
  orderSound: boolean;
  orderPushNotifications: boolean;
  orderModificationAlerts: boolean;
  
  // Table & Reservations
  newReservationAlerts: boolean;
  tableReadyNotifications: boolean;
  reservationReminders: boolean;
  
  // Kitchen Notifications
  kitchenOrderAlerts: boolean;
  priorityOrderAlerts: boolean;
  inventoryLowAlerts: boolean;
  
  // Payment Notifications
  paymentAlerts: boolean;
  refundAlerts: boolean;
  highValueTransactionAlerts: boolean;
  
  // Customer Service
  customerFeedbackAlerts: boolean;
  specialRequestAlerts: boolean;
  
  // Notification Preferences
  emailNotifications: boolean;
  quietHoursEnabled: boolean;
  quietHoursStart: string;
  quietHoursEnd: string;
}

interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

// Mock API
class NotificationsAPI {
  private static delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  private static mockSettings: NotificationSettings = {
    newOrderAlerts: true,
    orderSound: true,
    orderPushNotifications: true,
    orderModificationAlerts: true,
    newReservationAlerts: true,
    tableReadyNotifications: true,
    reservationReminders: true,
    kitchenOrderAlerts: true,
    priorityOrderAlerts: true,
    inventoryLowAlerts: true,
    paymentAlerts: true,
    refundAlerts: true,
    highValueTransactionAlerts: true,
    customerFeedbackAlerts: true,
    specialRequestAlerts: true,
    emailNotifications: true,
    quietHoursEnabled: false,
    quietHoursStart: "22:00",
    quietHoursEnd: "07:00",
  };

  static async getSettings(): Promise<ApiResponse<NotificationSettings>> {
    await this.delay(800);
    return {
      success: true,
      data: { ...this.mockSettings },
      message: "Notification settings loaded successfully",
    };
  }

  static async updateSettings(
    settings: Partial<NotificationSettings>
  ): Promise<ApiResponse<NotificationSettings>> {
    await this.delay(1000);
    this.mockSettings = { ...this.mockSettings, ...settings };
    return {
      success: true,
      data: { ...this.mockSettings },
      message: "Notification settings updated successfully",
    };
  }
}

interface ToastProps {
  message: string;
  type: "success" | "error";
  onClose: () => void;
  isVisible: boolean;
}

// Enhanced Toast Component with advanced animations (matching backup page)
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

const NotificationSettingsPage = () => {
  const [settings, setSettings] = useState<NotificationSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  
  // Advanced toast state management (matching backup page)
  const [toast, setToast] = useState<{ message: string; type: "success" | "error"; id: number } | null>(null);
  const [toastVisible, setToastVisible] = useState(false);

  // Advanced toast management with animations (matching backup page)
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
      showToast("Failed to load notification settings", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSettingChange = (key: keyof NotificationSettings, value: any) => {
    if (!settings) return;
    setSettings(prev => prev ? { ...prev, [key]: value } : null);
    setHasChanges(true);
  };

  const handleSave = async () => {
    if (!settings) return;
    try {
      setSaving(true);
      const response = await NotificationsAPI.updateSettings(settings);
      if (response.success) {
        setHasChanges(false);
        showToast(response.message || "Notification settings updated successfully!", "success");
      }
    } catch {
      showToast("Failed to save notification settings", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-b-2 border-yellow-600 rounded-full mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading Notification Settings...</p>
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
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-semibold text-gray-900">Notification Settings</h1>
          <div className="flex gap-3">
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Order Management Notifications */}
          <div className="bg-white rounded-md p-6 shadow-sm border border-gray-200">
            <div className="flex items-center gap-2 mb-6">
              <ShoppingCart className="text-black" size={20} />
              <h2 className="text-lg font-semibold">Order Management</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    New Order Alerts
                  </label>
                </div>
                <ButtonPage
                  checked={settings.newOrderAlerts}
                  onChange={(isActive) => handleSettingChange("newOrderAlerts", isActive)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Order Sounds
                  </label>
                </div>
                <ButtonPage
                  checked={settings.orderSound}
                  onChange={(isActive) => handleSettingChange("orderSound", isActive)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Push Notifications
                  </label>
                </div>
                <ButtonPage
                  checked={settings.orderPushNotifications}
                  onChange={(isActive) => handleSettingChange("orderPushNotifications", isActive)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Modification Alerts
                  </label>
                </div>
                <ButtonPage
                  checked={settings.orderModificationAlerts}
                  onChange={(isActive) => handleSettingChange("orderModificationAlerts", isActive)}
                />
              </div>
            </div>
          </div>

          {/* Table & Reservation Notifications */}
          <div className="bg-white rounded-md p-6 shadow-sm border border-gray-200">
            <div className="flex items-center gap-2 mb-6">
              <Calendar className="text-black" size={20} />
              <h2 className="text-lg font-semibold">Table & Reservations</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    New Reservations
                  </label>
                </div>
                <ButtonPage
                  checked={settings.newReservationAlerts}
                  onChange={(isActive) => handleSettingChange("newReservationAlerts", isActive)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Table Ready
                  </label>
                </div>
                <ButtonPage
                  checked={settings.tableReadyNotifications}
                  onChange={(isActive) => handleSettingChange("tableReadyNotifications", isActive)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Reservation Reminders
                  </label>
                </div>
                <ButtonPage
                  checked={settings.reservationReminders}
                  onChange={(isActive) => handleSettingChange("reservationReminders", isActive)}
                />
              </div>
            </div>
          </div>

          {/* Kitchen & Inventory Notifications */}
          <div className="bg-white rounded-md p-6 shadow-sm border border-gray-200">
            <div className="flex items-center gap-2 mb-6">
              <Utensils className="text-black" size={20} />
              <h2 className="text-lg font-semibold">Kitchen & Inventory</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Kitchen Orders
                  </label>
                </div>
                <ButtonPage
                  checked={settings.kitchenOrderAlerts}
                  onChange={(isActive) => handleSettingChange("kitchenOrderAlerts", isActive)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Priority Orders
                  </label>
                </div>
                <ButtonPage
                  checked={settings.priorityOrderAlerts}
                  onChange={(isActive) => handleSettingChange("priorityOrderAlerts", isActive)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Low Inventory
                  </label>
                </div>
                <ButtonPage
                  checked={settings.inventoryLowAlerts}
                  onChange={(isActive) => handleSettingChange("inventoryLowAlerts", isActive)}
                />
              </div>
            </div>
          </div>

          {/* Payment Notifications */}
          <div className="bg-white rounded-md p-6 shadow-sm border border-gray-200">
            <div className="flex items-center gap-2 mb-6">
              <CreditCard className="text-black" size={20} />
              <h2 className="text-lg font-semibold">Payment Alerts</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Payment Alerts
                  </label>
                </div>
                <ButtonPage
                  checked={settings.paymentAlerts}
                  onChange={(isActive) => handleSettingChange("paymentAlerts", isActive)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Refund Alerts
                  </label>
                </div>
                <ButtonPage
                  checked={settings.refundAlerts}
                  onChange={(isActive) => handleSettingChange("refundAlerts", isActive)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    High-Value Transactions
                  </label>
                </div>
                <ButtonPage
                  checked={settings.highValueTransactionAlerts}
                  onChange={(isActive) => handleSettingChange("highValueTransactionAlerts", isActive)}
                />
              </div>
            </div>
          </div>

          {/* Customer Service Notifications */}
          <div className="bg-white rounded-md p-6 shadow-sm border border-gray-200">
            <div className="flex items-center gap-2 mb-6">
              <MessageSquare className="text-black" size={20} />
              <h2 className="text-lg font-semibold">Customer Service</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Feedback Alerts
                  </label>
                </div>
                <ButtonPage
                  checked={settings.customerFeedbackAlerts}
                  onChange={(isActive) => handleSettingChange("customerFeedbackAlerts", isActive)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Special Requests
                  </label>
                </div>
                <ButtonPage
                  checked={settings.specialRequestAlerts}
                  onChange={(isActive) => handleSettingChange("specialRequestAlerts", isActive)}
                />
              </div>
            </div>
          </div>

          {/* Notification Preferences */}
          <div className="bg-white rounded-md p-6 shadow-sm border border-gray-200">
            <div className="flex items-center gap-2 mb-6">
              <Settings className="text-black" size={20} />
              <h2 className="text-lg font-semibold">Preferences</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email Notifications
                  </label>
                </div>
                <ButtonPage
                  checked={settings.emailNotifications}
                  onChange={(isActive) => handleSettingChange("emailNotifications", isActive)}
                />
              </div>

              

              <div className="pt-3 border-t border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Quiet Hours
                    </label>
                  </div>
                  <ButtonPage
                    checked={settings.quietHoursEnabled}
                    onChange={(isActive) => handleSettingChange("quietHoursEnabled", isActive)}
                  />
                </div>
                
                {settings.quietHoursEnabled && (
                  <div className="grid grid-cols-2 gap-3 mt-3">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">
                        Start
                      </label>
                      <input
                        type="time"
                        value={settings.quietHoursStart}
                        onChange={(e) => handleSettingChange("quietHoursStart", e.target.value)}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">
                        End
                      </label>
                      <input
                        type="time"
                        value={settings.quietHoursEnd}
                        onChange={(e) => handleSettingChange("quietHoursEnd", e.target.value)}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationSettingsPage;