"use client";
import React from "react";

// Hooks
import { useToast } from '@/lib/hooks';
import { useSettings } from '@/lib/hooks/gsettings';

// Components
import { Toaster } from "@/components/ui/sonner";
import ActionButtons from '@/components/ui/setting-buttons';
import SettingsCards from './_components/cards';
import { GlobalSkeleton } from '@/components/ui/global-skeleton';
import { PageContainer } from "@/components/ui/page-container";
import { PageHeader } from "@/components/ui/page-header";


const GeneralSettingsPage = () => {
  const { showToast } = useToast();

  const {
    settings,
    loading,
    saving,
    resetting,
    hasChanges,
    handleSettingChange,
    handleSave,
    handleResetToDefaults,
  } = useSettings({
    onSuccess: (message) => showToast(message, "success"),
    onError: (message) => showToast(message, "error"),
  });

  if (loading || !settings) {
    return <GlobalSkeleton type="management" showActionBar={false} />;
  }

  return (
    <PageContainer hasSubmenu={true}>
      <Toaster position="top-right" />

      <PageHeader
        title="General Settings"
        subtitle="Configure system-wide settings for your restaurant"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 items-center mb-8">
        <div></div>
        <ActionButtons
          hasChanges={hasChanges}
          saving={saving}
          resetting={resetting}
          onSave={handleSave}
          onReset={handleResetToDefaults}
        />
      </div>

      <SettingsCards
        settings={settings}
        onSettingChange={handleSettingChange}
      />
    </PageContainer>
  );
};

export default GeneralSettingsPage;