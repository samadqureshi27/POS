"use client";
import React from "react";

// Hooks
import { useToast } from '@/lib/hooks';
import { useSettings } from '@/lib/hooks/gsettings';

// Components
import { Toast } from '@/components/ui/toast';
import ActionButtons from '@/components/ui/setting-buttons';
import SettingsCards from './_components/cards';
import { SimplePageSkeleton } from '@/app/(main)/dashboard/_components/SimplePageSkeleton';


const GeneralSettingsPage = () => {
  const { toast, toastVisible, showToast, hideToast } = useToast();

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

  // Single loading check - no early return with null
  if (loading || !settings) {
    return <SimplePageSkeleton showHeader={true} contentRows={6} />;
  }

  return (
    <div className="min-h-screen w-full bg-background">
      {/* Toast positioned absolutely */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
        />
      )}

      <div className="flex-1 justify-center items-center w-full px-6">
        <div className="mt-20">
          <div className="grid grid-cols-1 md:grid-cols-2 items-center mb-8">
            <h1 className="text-3xl font-semibold mb-5 text-foreground">
              General Settings
            </h1>

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
        </div>
      </div>
    </div>
  );
};

export default GeneralSettingsPage;