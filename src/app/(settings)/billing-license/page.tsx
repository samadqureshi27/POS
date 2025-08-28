"use client";
import React, { useState, useEffect, useCallback } from "react";
import {
  Save,
  CheckCircle,
  AlertCircle,
  X,
  RefreshCw,
  Key,
  Calendar,
  CreditCard,
  Package,
  Star,
  Zap,
  Crown,
  Building,
  Monitor,
  Smartphone,
} from "lucide-react";

// Types
interface LicenseInfo {
  licensedTo: string;
  plan: "Basic" | "Standard" | "Pro" | "Ultimate" | "Trial";
  status: "Active" | "Inactive" | "Expired";
  licenseKey: string;
  expiryDate: string;
  totalPOS: number;
  totalKDS: number;
  totalBranches: number;
}

interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

// Mock API
class LicenseAPI {
  private static delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  private static mockLicenseInfo: LicenseInfo = {
    licensedTo: "Cafe Delight",
    plan: "Pro",
    status: "Active",
    licenseKey: "LIC-789XYZ-456ABC-123PRO",
    expiryDate: "2024-12-31T23:59:59",
    totalPOS: 5,
    totalKDS: 3,
    totalBranches: 2,
  };

  static async getLicenseInfo(): Promise<ApiResponse<LicenseInfo>> {
    await this.delay(800);
    return {
      success: true,
      data: { ...this.mockLicenseInfo },
      message: "License information loaded successfully",
    };
  }

  static async recheckLicense(): Promise<ApiResponse<LicenseInfo>> {
    await this.delay(1200);
    // Simulate potential changes on recheck
    const randomChange = Math.random() > 0.8;
    if (randomChange) {
      this.mockLicenseInfo.status =
        this.mockLicenseInfo.status === "Active" ? "Active" : "Active"; // Just for demo
    }

    return {
      success: true,
      data: { ...this.mockLicenseInfo },
      message: "License rechecked successfully! All details are up to date.",
    };
  }

  static async updateLicense(key: string): Promise<ApiResponse<LicenseInfo>> {
    await this.delay(1500);

    // Validate key format (simple mock validation)
    if (key.length < 10 || !key.includes("-")) {
      throw new Error("Invalid license key format. Please check your key and try again.");
    }

    // Simulate different plans based on key
    if (key.includes("TRIAL")) {
      this.mockLicenseInfo = {
        licensedTo: "New Business",
        plan: "Trial",
        status: "Active",
        licenseKey: key,
        expiryDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        totalPOS: 1,
        totalKDS: 1,
        totalBranches: 1,
      };
    } else if (key.includes("BASIC")) {
      this.mockLicenseInfo = {
        licensedTo: "Updated Business",
        plan: "Basic",
        status: "Active",
        licenseKey: key,
        expiryDate: "2025-06-30T23:59:59",
        totalPOS: 2,
        totalKDS: 1,
        totalBranches: 1,
      };
    } else if (key.includes("ULTIMATE")) {
      this.mockLicenseInfo = {
        licensedTo: "Enterprise Business",
        plan: "Ultimate",
        status: "Active",
        licenseKey: key,
        expiryDate: "2025-12-31T23:59:59",
        totalPOS: 20,
        totalKDS: 10,
        totalBranches: 10,
      };
    } else {
      // Default to Pro plan
      this.mockLicenseInfo = {
        licensedTo: "Premium Business",
        plan: "Pro",
        status: "Active",
        licenseKey: key,
        expiryDate: "2025-09-30T23:59:59",
        totalPOS: 5,
        totalKDS: 3,
        totalBranches: 3,
      };
    }

    return {
      success: true,
      data: { ...this.mockLicenseInfo },
      message: "License updated successfully! Your new plan is now active.",
    };
  }
}

interface ToastProps {
  message: string;
  type: "success" | "error";
  onClose: () => void;
  isVisible: boolean;
}

// Enhanced Toast Component with animation (same as backup page)
const Toast = React.memo<ToastProps>(({ message, type, onClose, isVisible }) => (
  <div
    className={`fixed top-24 right-6 px-6 py-4 rounded-xl shadow-2xl z-[9999] flex items-center gap-3 min-w-[300px] max-w-[500px] transition-all duration-500 ease-in-out transform ${isVisible
        ? 'translate-x-0 opacity-100 scale-100'
        : 'translate-x-full opacity-0 scale-95'
      } ${type === "success"
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

// Plan Icon Component
const PlanIcon = ({ plan }: { plan: string }) => {
  switch (plan) {
    case "Basic":
      return <Package className="text-blue-500" size={20} />;
    case "Standard":
      return <Star className="text-green-500" size={20} />;
    case "Pro":
      return <Zap className="text-purple-500" size={20} />;
    case "Ultimate":
      return <Crown className="text-yellow-500" size={20} />;
    case "Trial":
      return <CreditCard className="text-gray-500" size={20} />;
    default:
      return <Package className="text-blue-500" size={20} />;
  }
};

// Status Badge Component
const StatusBadge = ({ status }: { status: string }) => {
  const statusColors = {
    Active: "bg-green-100 text-green-800",
    Inactive: "bg-gray-100 text-gray-800",
    Expired: "bg-red-100 text-red-800",
  };

  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status as keyof typeof statusColors] || statusColors.Inactive
        }`}
    >
      {status}
    </span>
  );
};

const BillingLicensePage = () => {
  const [licenseInfo, setLicenseInfo] = useState<LicenseInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [rechecking, setRechecking] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [licenseKeyInput, setLicenseKeyInput] = useState("");

  // Enhanced toast state management (same as backup page)
  const [toast, setToast] = useState<{ message: string; type: "success" | "error"; id: number } | null>(null);
  const [toastVisible, setToastVisible] = useState(false);

  useEffect(() => {
    loadLicenseInfo();
  }, []);

  // Enhanced toast management with animations (same as backup page)
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

  const loadLicenseInfo = async () => {
    try {
      setLoading(true);
      const response = await LicenseAPI.getLicenseInfo();
      if (!response.success) throw new Error(response.message);
      setLicenseInfo(response.data);
    } catch {
      showToast("Failed to load license information", "error");
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
        showToast(response.message || "License rechecked successfully! ✨", "success");
      }
    } catch {
      showToast("Failed to recheck license. Please try again.", "error");
    } finally {
      setRechecking(false);
    }
  };

  const handleUpdateLicense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!licenseKeyInput.trim()) {
      showToast("Please enter a license key", "error");
      return;
    }

    try {
      setUpdating(true);
      const response = await LicenseAPI.updateLicense(licenseKeyInput);
      if (response.success) {
        setLicenseInfo(response.data);
        setLicenseKeyInput("");
        showToast(response.message || "License updated successfully! 🎉", "success");
      }
    } catch (error: any) {
      showToast(error.message || "Failed to update license. Please check your key and try again.", "error");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-b-2 border-yellow-600 rounded-full mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading License Information...</p>
        </div>
      </div>
    );
  }

  if (!licenseInfo) return null;

  return (
    <div className="min-h-screen bg-gray-50 w-full ">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
          isVisible={toastVisible}
        />
      )}

      <div className="flex-1 justify-center  items-center w-full px-6">
        {/* Container with proper centering and full width utilization */}
        <div className=" mt-20">
          {/* Header - Better spacing and centering */}
          <div className="flex items-center justify-between mb-12">
            <h1 className="text-3xl font-semibold text-gray-900">Billing & License</h1>
            <div className="flex gap-3">
              <button
                onClick={handleRecheck}
                disabled={rechecking}
                className="flex items-center gap-2 px-6 py-2 bg-[#2C2C2C] text-white rounded-sm hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {rechecking ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-b-2 border-white rounded-full"></div>
                    Rechecking...
                  </>
                ) : (
                  <>
                    <RefreshCw size={16} />
                    Recheck License
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Three cards in a row with better spacing and wider layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* License Information Card - Enhanced */}
            <div className="bg-white rounded-sm p-8 shadow-sm border border-gray-200 min-h-[500px]">
              <div className="flex items-center gap-2 mb-8">
                <Key className="text-black" size={24} />
                <h2 className="text-xl font-semibold">License Information</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2">
                    Licensed To
                  </label>
                  <p className="text-base font-medium text-gray-900">{licenseInfo.licensedTo}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2">
                    Plan
                  </label>
                  <div className="flex items-center gap-3">
                    <PlanIcon plan={licenseInfo.plan} />
                    <span className="text-base font-medium text-gray-900">{licenseInfo.plan}</span>
                    {licenseInfo.plan === "Trial" && (
                      <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                        {Math.ceil((new Date(licenseInfo.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days left
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2">
                    License Status
                  </label>
                  <StatusBadge status={licenseInfo.status} />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2">
                    License Key
                  </label>
                  <div className="bg-gray-50 p-3 rounded border">
                    <code className="text-sm font-mono text-gray-800 break-all">
                      {licenseInfo.licenseKey}
                    </code>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2">
                    License Expiry Date
                  </label>
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-gray-400" />
                    <span className="text-sm font-medium text-gray-900">
                      {new Date(licenseInfo.expiryDate).toLocaleDateString()} at{" "}
                      {new Date(licenseInfo.expiryDate).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Resources Allocation Card - Enhanced */}
            <div className="bg-white rounded-sm p-8 shadow-sm border border-gray-200 min-h-[500px]">
              <div className="flex items-center gap-2 mb-8">
                <Building className="text-black" size={24} />
                <h2 className="text-xl font-semibold">Resources Allocation</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2">
                    Total Number of POS
                  </label>
                  <div className="flex items-center gap-3">
                    <Monitor size={20} className="text-gray-400" />
                    <span className="text-base font-medium text-gray-900">{licenseInfo.totalPOS}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2">
                    Total Number of KDS
                  </label>
                  <div className="flex items-center gap-3">
                    <Smartphone size={20} className="text-gray-400" />
                    <span className="text-base font-medium text-gray-900">{licenseInfo.totalKDS}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2">
                    Total Number of Branches
                  </label>
                  <div className="flex items-center gap-3">
                    <Building size={20} className="text-gray-400" />
                    <span className="text-base font-medium text-gray-900">{licenseInfo.totalBranches}</span>
                  </div>
                </div>
              </div>

              <div className="mt-12 pt-6 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-500 mb-3">About Recheck</h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  You can refresh the License Details by clicking on the "Recheck" button.
                  License is usually checked timely, but if you want to fetch the latest information,
                  click on "Recheck".
                </p>
              </div>
            </div>

            {/* Update License Card - Enhanced */}
            <div className="bg-white rounded-sm p-8 shadow-sm border border-gray-200 min-h-[500px]">
              <div className="flex items-center gap-2 mb-8">
                <CreditCard className="text-black" size={24} />
                <h2 className="text-xl font-semibold">Update License</h2>
              </div>

              <p className="text-sm text-gray-600 mb-8">
                To update and activate the license, enter the license key here.
              </p>

              <form onSubmit={handleUpdateLicense} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    License Key
                  </label>
                  <input
                    type="text"
                    value={licenseKeyInput}
                    onChange={(e) => setLicenseKeyInput(e.target.value)}
                    placeholder="Enter your license key (e.g., LIC-XXXX-XXXX-XXXX)"
                    className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#d9d9e1] focus:border-transparent"
                    disabled={updating}
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Enter your new license key to update your plan
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={updating || !licenseKeyInput.trim()}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#2C2C2C] text-white rounded-sm hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {updating ? (
                    <>
                      <div className="animate-spin h-4 w-4 border-b-2 border-white rounded-full"></div>
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save size={16} />
                      Update License
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillingLicensePage;