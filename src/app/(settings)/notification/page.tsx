"use client";
import React from "react";
import { Toast } from '@/components/layout/UI/Toast';
import { useToast } from '@/lib/hooks/Toast';
import { useNotificationSettings } from "@/lib/hooks/useNoticationSettings";
import LoadingSpinner from '@/components/layout/UI/Loader';
import  { NotificationCard } from "./_components/NotificationCard";
import { QuietHoursSettings } from "./_components/QuietHoursSettings";
import { NOTIFICATION_SECTIONS } from "@/lib/util/notificationOptions";
import ActionButtons from '@/components/layout/UI/Setting-buttons';

const NotificationSettingsPage = () => {
  const { toast, toastVisible, showToast, hideToast } = useToast();
  const {
    settings,
    loading,
    saving,
    resetting,
    hasChanges,
    handleSettingChange,
    handleSave,
    handleReset
  } = useNotificationSettings(showToast);

  if (loading) {
    return <LoadingSpinner message="Loading Notification page"/>;
  }

  if (!settings) return null;

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
        <div className="mt-20">
          {/* Header */}
          <div className="grid grid-cols-1 md:grid-cols-2 items-center mb-8">
            <h1 className="text-3xl font-semibold mb-5 text-gray-900">
              Notification Settings
            </h1>
            <ActionButtons
              hasChanges={hasChanges}
              saving={saving}
              resetting={resetting}
              onSave={handleSave}
              onReset={handleReset}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {NOTIFICATION_SECTIONS.map((section) => (
              <NotificationCard
                key={section.title}
                title={section.title}
                icon={section.icon}
                options={section.options}
                settings={settings}
                onSettingChange={handleSettingChange}
              >
                {section.hasQuietHours && (
                  <QuietHoursSettings
                    settings={settings}
                    onSettingChange={handleSettingChange}
                  />
                )}
              </NotificationCard>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationSettingsPage;