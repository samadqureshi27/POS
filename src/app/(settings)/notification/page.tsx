"use client";
import React from "react";
import { Toast } from '@/components/ui/toast';
import { useToast } from '@/lib/hooks/toast';
import { useNotificationSettings } from "@/lib/hooks/useNotificationSettings";
import { GlobalSkeleton } from '@/components/ui/global-skeleton';
import  { NotificationCard } from "./_components/notification-card";
import { QuietHoursSettings } from "./_components/quiet-hours-settings";
import { NOTIFICATION_SECTIONS } from "@/lib/util/notification-options";
import ActionButtons from '@/components/ui/setting-buttons';

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
    return <GlobalSkeleton type="settings" showHeader={true} />;
  }

  if (!settings) return null;

  return (
    <div className="min-h-screen bg-background w-full">
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
            <h1 className="text-3xl font-semibold mb-5 text-foreground">
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