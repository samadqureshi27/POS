"use client";
import React from "react";

// Types
import { LicenseInfo, ApiResponse, ToastState } from '@/lib/types/billing';

// Hooks
import { useToast } from '@/lib/hooks';
import { Toast } from '@/components/layout/ui/Toast';
import { useLicense } from '@/lib/hooks/useLicense';

// Components
import LoadingSpinner from '@/components/layout/ui/Loader';
import { PageHeader } from './_components/PageHeader'
import { LicenseInfoCard } from './_components/LicenseinfoCard'
import { ResourcesAllocationCard } from './_components/ResourceAllocationCard'
import { UpdateLicenseCard } from './_components/UpdateLicenseCard';

const BillingLicensePage = () => {
  const { toast, toastVisible, showToast, hideToast } = useToast();
  
  const {
    licenseInfo,
    loading,
    rechecking,
    updating,
    licenseKeyInput,
    setLicenseKeyInput,
    handleRecheck,
    handleUpdateLicense,
  } = useLicense({ showToast });

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!licenseInfo) return null;

  return (
    <div className="min-h-screen bg-gray-50 w-full">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
        />
      )}

      <div className="flex-1 justify-center items-center w-full px-6">
        {/* Container with proper centering and full width utilization */}
        <div className="mt-20">
          {/* Header - Better spacing and centering */}
          <PageHeader handleRecheck={handleRecheck} rechecking={rechecking} />

          {/* Three cards in a row with better spacing and wider layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* License Information Card */}
            <LicenseInfoCard licenseInfo={licenseInfo} />

            {/* Resources Allocation Card */}
            <ResourcesAllocationCard licenseInfo={licenseInfo} />

            {/* Update License Card */}
            <UpdateLicenseCard
              licenseKeyInput={licenseKeyInput}
              setLicenseKeyInput={setLicenseKeyInput}
              handleUpdateLicense={handleUpdateLicense}
              updating={updating}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillingLicensePage;