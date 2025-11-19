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
import { PageContainer } from '@/components/ui/page-container';
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
    return <GlobalSkeleton type="management" showActionBar={false} />;
  }

  if (!licenseInfo) return null;

  return (
    <PageContainer hasSubmenu={true}>
      <Toaster position="top-right" />

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
    </PageContainer>
  );
};

export default BillingLicensePage;