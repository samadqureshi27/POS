// pages/RestaurantProfilePage.tsx
"use client";
import React from "react";
import LoadingSpinner from '@/components/layout/UI/Loader';
import ActionButtons from '@/components/layout/UI/Setting-buttons';
import { Toast } from '@/components/layout/UI/Toast';
import { useToast } from '../../../lib/hooks/toast';
import { useRestaurantProfile } from '../../../lib/hooks/useRestaurantProfile';
import { BasicInfoCard } from './_components/BasicInfoCard';
import { ContactInfoCard } from './_components/ContactInfoCard';
import { LogoHoursCard } from './_components/LogoHoursCard';

const RestaurantProfilePage = () => {
  const {
    formData,
    previewUrl,
    loading,
    saving,
    hasChanges,
    handleInputChange,
    handleDropdownChange,
    handleLogoChange,
    removeLogo,
    handleSave,
    resetForm,
  } = useRestaurantProfile();

  const { toast, toastVisible, hideToast } = useToast();

  if (loading) {
    return <LoadingSpinner message="Loading Restaurant Profile..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 w-full">
      {toast && toastVisible && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
        />
      )}

      <div className="flex-1 justify-center items-center w-full px-6">
        <div className="mt-20">
          {/* Header */}
          <div className="grid grid-cols-1 md:grid-cols-2 items-center mb-8">
            <h1 className="text-3xl font-semibold mb-5 text-gray-900">
              Restaurant Profile
            </h1>
            <ActionButtons
              hasChanges={hasChanges}
              saving={saving}
              resetting={false}
              onSave={handleSave}
              onReset={resetForm}
            />
          </div>

          {/* Three cards in a row with equal height */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <BasicInfoCard
              formData={formData}
              onInputChange={handleInputChange}
              onDropdownChange={handleDropdownChange}
            />

            <ContactInfoCard
              formData={formData}
              onInputChange={handleInputChange}
            />

            <LogoHoursCard
              formData={formData}
              previewUrl={previewUrl}
              onInputChange={handleInputChange}
              onLogoChange={handleLogoChange}
              onRemoveLogo={removeLogo}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantProfilePage;