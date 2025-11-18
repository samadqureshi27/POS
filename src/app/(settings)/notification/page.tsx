"use client";
import React from "react";
import { Toaster } from "@/components/ui/sonner";
import { useToast } from '@/lib/hooks';
import { useNotificationSettings } from "@/lib/hooks/useNotificationSettings";
import { GlobalSkeleton } from '@/components/ui/global-skeleton';
import { PageContainer } from '@/components/ui/page-container';
import { PageHeader } from '@/components/ui/page-header';
import  { NotificationCard } from "./_components/notification-card";
import { QuietHoursSettings } from "./_components/quiet-hours-settings";
import { NOTIFICATION_SECTIONS } from "@/lib/util/notification-options";
import ActionButtons from '@/components/ui/setting-buttons';

const NotificationSettingsPage = () => {
  const { showToast } = useToast();
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
    return <GlobalSkeleton type="management" showActionBar={false} />;
  }

  if (!settings) return null;

  return (
    <PageContainer hasSubmenu={true}>
      <Toaster position="top-right" />

      <PageHeader
        title="Notification Settings"
        actions={
          <ActionButtons
            hasChanges={hasChanges}
            saving={saving}
            resetting={resetting}
            onSave={handleSave}
            onReset={handleReset}
          />
        }
      />

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
    </PageContainer>
  );
};

export default NotificationSettingsPage;