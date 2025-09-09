"use client";
import React from "react";

// Hooks
import { useToast } from '../../../lib/hooks/Toast';
import { useSettings } from '../../../lib/hooks/Gsettings';

// Components
import { Toast } from '@/components/layout/UI/Toast';
import ActionButtons from '@/components/layout/UI/Setting-buttons';
import SettingsCards from './_components/cards';
import LoadingSpinner from '@/components/layout/UI/Loader';
// Loading Spinner Component


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
    return <LoadingSpinner message="Loading General settings..." />;
  }

  return (
    <div className="min-h-screen w-full bg-gray-50">
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
            <h1 className="text-3xl font-semibold mb-5 text-gray-900">
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