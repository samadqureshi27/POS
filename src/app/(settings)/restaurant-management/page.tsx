"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Save,
  Store,
  Mail,
  Phone,
  MapPin,
  Image,
  CheckCircle,
  AlertCircle,
  X,
  ChevronDown,
  Globe,
  Clock,
  Upload,
  Camera,
  Trash2,
  Building,
  Users,
  Award,
} from "lucide-react";

// Types
interface RestaurantData {
  name: string;
  type: string;
  contact: string;
  email: string;
  address: string;
  description: string;
  website: string;
  openingTime: string;
  closingTime: string;
  logo: File | null;
}

interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

// Mock API
class RestaurantAPI {
  private static delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  private static mockData: Omit<RestaurantData, "logo"> = {
    name: "",
    type: "",
    contact: "",
    email: "",
    address: "",
    description: "",
    website: "",
    openingTime: "",
    closingTime: "",
  };

  static async getProfile(): Promise<ApiResponse<Omit<RestaurantData, "logo">>> {
    await this.delay(800);
    const data = this.mockData;
    return {
      success: true,
      data,
      message: "Profile loaded successfully",
    };
  }

  static async updateProfile(
    data: Omit<RestaurantData, "logo">
  ): Promise<ApiResponse<Omit<RestaurantData, "logo">>> {
    await this.delay(1000);
    this.mockData = { ...this.mockData, ...data };
    return {
      success: true,
      data,
      message: "Restaurant profile updated successfully",
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

// Enhanced Dropdown Component
const RestaurantDropdown = ({
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
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d9d9e1] focus:border-transparent bg-white text-left flex items-center justify-between transition-all duration-200"
      >
        <span className={value ? "text-gray-900" : "text-gray-500"}>
          {options.find((opt) => opt.value === value)?.label || placeholder}
        </span>
        <ChevronDown 
          size={16} 
          className={`text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} 
        />
      </button>

      {isOpen && (
        <div className="absolute z-20 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-xl max-h-60 overflow-y-auto backdrop-blur-sm">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              className="w-full px-4 py-3 text-left hover:bg-gray-100 focus:outline-none focus:bg-gray-100 transition-colors duration-150 first:rounded-t-lg last:rounded-b-lg"
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

// SIMPLIFIED Input Component with custom focus
const SimpleInput = ({
  label,
  required = false,
  ...props
}: {
  label: string;
  required?: boolean;
} & React.InputHTMLAttributes<HTMLInputElement>) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
    <input
      {...props}
      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d9d9e1] focus:border-transparent transition-all duration-200"
    />
  </div>
);

// SIMPLIFIED Textarea Component with custom focus
const SimpleTextarea = ({
  label,
  required = false,
  ...props
}: {
  label: string;
  required?: boolean;
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
    <textarea
      {...props}
      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d9d9e1] focus:border-transparent transition-all duration-200  resize-none"
    />
  </div>
);

const RestaurantProfilePage = () => {
  const [formData, setFormData] = useState<RestaurantData>({
    name: "",
    type: "",
    contact: "",
    email: "",
    address: "",
    description: "",
    website: "",
    openingTime: "",
    closingTime: "",
    logo: null,
  });
  
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  
  // Advanced toast state management (matching backup page)
  const [toast, setToast] = useState<{ message: string; type: "success" | "error"; id: number } | null>(null);
  const [toastVisible, setToastVisible] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement | null>(null);

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
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const response = await RestaurantAPI.getProfile();
      if (!response.success) throw new Error(response.message);
      setFormData(prev => ({ ...prev, ...response.data }));
    } catch {
      showToast("Failed to load restaurant profile", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setHasChanges(true);
  };

  const handleDropdownChange = (key: keyof RestaurantData, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file && file.type.startsWith("image/")) {
      if (file.size > 5 * 1024 * 1024) {
        showToast("File size must be less than 5MB", "error");
        return;
      }
      setFormData(prev => ({ ...prev, logo: file }));
      setPreviewUrl(URL.createObjectURL(file));
      setHasChanges(true);
      showToast("Logo uploaded successfully!", "success");
    }
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      if (file.size > 5 * 1024 * 1024) {
        showToast("File size must be less than 5MB", "error");
        return;
      }
      setFormData(prev => ({ ...prev, logo: file }));
      setPreviewUrl(URL.createObjectURL(file));
      setHasChanges(true);
      showToast("Logo uploaded successfully!", "success");
    }
  };

  const handleClickUpload = () => {
    fileInputRef.current?.click();
  };

  const removeLogo = () => {
    setFormData(prev => ({ ...prev, logo: null }));
    setPreviewUrl(null);
    setHasChanges(true);
    showToast("Logo removed successfully", "success");
  };

  const handleSave = async () => {
    // Validation
    const requiredFields = ['name', 'type', 'contact', 'email', 'address'];
    const missingFields = requiredFields.filter(field => !formData[field as keyof RestaurantData]);
    
    if (missingFields.length > 0) {
      showToast("Please fill in all required fields", "error");
      return;
    }

    if (!formData.email.includes('@')) {
      showToast("Please enter a valid email address", "error");
      return;
    }

    try {
      setSaving(true);
      const { logo, ...dataToSave } = formData;
      const response = await RestaurantAPI.updateProfile(dataToSave);
      if (response.success) {
        setHasChanges(false);
        showToast(response.message || "Restaurant profile updated successfully! ✨", "success");
      }
    } catch {
      showToast("Failed to save restaurant profile", "error");
    } finally {
      setSaving(false);
    }
  };

  const restaurantTypeOptions = [
    { value: "Dine In", label: "🍽️ Dine In" },
    { value: "Take Away", label: "🥡 Take Away" },
    { value: "Delivery Only", label: "🚚 Delivery Only" },
    
    { value: "All", label: "🍽️🥡🚚 All (Dine In , Take Away & Delivery)" },
  ];

  const getOperatingStatus = () => {
    if (!formData.openingTime || !formData.closingTime) return null;
    
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    const openTime = parseInt(formData.openingTime.split(':')[0]) * 60 + parseInt(formData.openingTime.split(':')[1]);
    const closeTime = parseInt(formData.closingTime.split(':')[0]) * 60 + parseInt(formData.closingTime.split(':')[1]);
    
    const isOpen = currentTime >= openTime && currentTime <= closeTime;
    
    return {
      isOpen,
      status: isOpen ? "Open Now" : "Closed",
      color: isOpen ? "text-green-600 bg-green-100" : "text-red-600 bg-red-100"
    };
  };

  const operatingStatus = getOperatingStatus();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-b-2 border-yellow-600 rounded-full mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading Restaurant Profile...</p>
        </div>
      </div>
    );
  }

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

      <div className=" mt-20">
        {/* Header - Consistent with Billing & License page */}
        <div className="flex items-center justify-between mb-12">
          <h1 className="text-3xl font-semibold text-gray-900">Restaurant Profile</h1>
          <div className="flex gap-3">
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
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>

        {/* Three cards in a row with equal height */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Basic Information Card */}
          <div className="bg-white rounded-sm p-8 shadow-sm border border-gray-200 min-h-[600px] flex flex-col">
            <div className="flex items-center gap-2 mb-8">
              <Store className="text-black" size={24} />
              <h2 className="text-xl font-semibold">Basic Information</h2>
            </div>

            <div className="space-y-6 flex-grow">
              <SimpleInput
                label="Restaurant Name"
                required
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter restaurant name"
              />

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Restaurant Type <span className="text-red-500">*</span>
                </label>
                <RestaurantDropdown
                  value={formData.type}
                  options={restaurantTypeOptions}
                  onValueChange={(value) => handleDropdownChange("type", value)}
                  placeholder="Select restaurant type"
                />
              </div>

              <SimpleTextarea
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Brief description of your restaurant"
                rows={3}
              />

              <SimpleInput
                label="Website"
                type="url"
                name="website"
                value={formData.website}
                onChange={handleInputChange}
                placeholder="Enter your website URL"
              />
            </div>
          </div>

          {/* Contact Information Card */}
          <div className="bg-white rounded-sm p-8 shadow-sm border border-gray-200 min-h-[600px] flex flex-col">
            <div className="flex items-center gap-2 mb-8">
              <Phone className="text-black" size={24} />
              <h2 className="text-xl font-semibold">Contact Information</h2>
            </div>

            <div className="space-y-6 flex-grow">
              <SimpleInput
                label="Contact Number"
                required
                type="tel"
                name="contact"
                value={formData.contact}
                onChange={handleInputChange}
                placeholder="Enter contact number"
              />

              <SimpleInput
                label="Email Address"
                required
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter email address"
              />

              <SimpleTextarea
                label="Address"
                required
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Enter your address"
                rows={3}
              />
            </div>
          </div>

          {/* Logo & Hours Card */}
          <div className="bg-white rounded-sm p-8 shadow-sm border border-gray-200 min-h-[600px] flex flex-col">
            <div className="flex items-center gap-2 mb-8">
              <Image className="text-black" size={24} />
              <h2 className="text-xl font-semibold">Logo & Hours</h2>
            </div>

            <div className="space-y-6 flex-grow">
              {/* Logo Upload Section */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Restaurant Logo
                </label>
                <div
                  className={`relative border-2 border-dashed rounded-sm p-6 bg-gray-50 flex flex-col justify-center items-center hover:bg-gray-100 transition-all duration-300 cursor-pointer ${
                    dragActive ? "border-gray-500 bg-blue-50" : "border-gray-300"
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={handleClickUpload}
                >
                  {previewUrl ? (
                    <div className="relative group">
                      <img
                        src={previewUrl}
                        alt="Restaurant Logo"
                        className="max-h-32 max-w-full object-contain mb-4 rounded-sm shadow-md"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-50 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleClickUpload();
                          }}
                          className="bg-white text-gray-900 rounded-sm p-2 hover:bg-gray-100 transition-colors"
                          title="Change logo"
                        >
                          <Camera size={16} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeLogo();
                          }}
                          className="bg-red-500 text-white rounded-sm p-2 hover:bg-red-600 transition-colors"
                          title="Remove logo"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <p className="text-sm text-gray-600 text-center mt-2">Click to change logo</p>
                    </div>
                  ) : (
                    <>
                      <div className="p-3 bg-white rounded-full shadow-sm mb-4">
                        <Upload className="w-6 h-6 text-gray-400" />
                      </div>
                      <p className="text-gray-700 text-center text-sm font-medium mb-2">
                        Drag and drop your logo here
                      </p>
                      <p className="text-xs text-gray-500 mb-4">
                        or click to browse files
                      </p>
                      <div className="px-4 py-2 bg-[#2C2C2C] text-white hover:bg-gray-700 text-xs font-medium rounded-sm transition-colors">
                        Upload Logo
                      </div>
                    </>
                  )}

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                    className="hidden"
                  />
                </div>
                <p className="text-xs text-gray-500 text-center">
                  Supported formats: JPG, PNG, GIF (Max 5MB)
                </p>
              </div>

              {/* Operating Hours Section */}
              <div className="pt-4">
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="text-black" size={20} />
                  <h3 className="font-medium text-gray-900">Operating Hours</h3>
                  {operatingStatus && (
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${operatingStatus.color} ml-auto`}>
                      {operatingStatus.status}
                    </span>
                  )}
                </div>

                <div className="space-y-4">
                  <SimpleInput
                    label="Opening Time"
                    type="time"
                    name="openingTime"
                    value={formData.openingTime}
                    onChange={handleInputChange}
                  />

                  <SimpleInput
                    label="Closing Time"
                    type="time"
                    name="closingTime"
                    value={formData.closingTime}
                    onChange={handleInputChange}
                  />

                  {formData.openingTime && formData.closingTime && (
                    <div className="bg-gray-50 rounded-sm p-3 border">
                      <p className="text-xs font-medium text-gray-700 mb-1">Daily Hours</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {formData.openingTime} - {formData.closingTime}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantProfilePage;