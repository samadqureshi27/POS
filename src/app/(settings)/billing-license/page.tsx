"use client";
import React from "react";

// Types
import { LicenseInfo, ApiResponse, ToastState } from '@/lib/types/billing';

// Hooks
import { useToast } from '@/lib/hooks';
import { Toaster } from "@/components/ui/sonner";
import { useLicense } from '@/lib/hooks/useLicense';

// Components
import { GlobalSkeleton } from '@/components/ui/global-skeleton';
import { PageHeader } from './_components/page-header'
import { LicenseInfoCard } from './_components/license-info-card';
import { ResourcesAllocationCard } from './_components/resource-allocation-card';
import { UpdateLicenseCard } from './_components/update-license-card';

const BillingLicensePage = () => {
  const { showToast } = useToast();

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
    return <GlobalSkeleton type="settings" showHeader={true} />;
  }

  if (!licenseInfo) return null;

  return (
    <div className="p-6 min-h-screen bg-background w-full">
      <Toaster position="top-right" />

      <div className="flex-1 justify-center items-center w-full ">
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