// pages/RestaurantProfilePage.tsx
"use client";
import React from "react";
import ActionButtons from '@/components/ui/setting-buttons';
import { Toast } from '@/components/ui/toast';
import { useToast } from '@/lib/hooks/toast';
import { GlobalSkeleton } from '@/components/ui/global-skeleton';
import { Toaster } from '@/components/ui/sonner';
import { PageContainer } from '@/components/ui/page-container';
import { PageHeader } from '@/components/ui/page-header';
import { useRestaurantProfile } from '@/lib/hooks/useRestaurantProfile';
import { BasicInfoCard } from './_components/basic-info-card';
import { ContactInfoCard } from './_components/contact-info-card';
import { LogoHoursCard } from './_components/logo-hours-card';

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
    return <GlobalSkeleton type="management" showActionBar={false} />;
  }

  return (
    <PageContainer hasSubmenu={true}>
      <Toaster position="top-right" />

      <PageHeader
        title="Restaurant Profile"
        actions={
          <ActionButtons
            hasChanges={hasChanges}
            saving={saving}
            resetting={false}
            onSave={handleSave}
            onReset={resetForm}
          />
        }
      />

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
    </PageContainer>
  );
};

export default RestaurantProfilePage;