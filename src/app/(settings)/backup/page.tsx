"use client";
import React from "react";

// Hooks
import { useToast } from '@/lib/hooks';
import { useModal } from '@/lib/hooks';
import { useBackup } from '@/lib/hooks/useBackup';

// Components
import { BackupModal } from './_components/backup-modal';
import { Toaster } from "@/components/ui/sonner";
import { GlobalSkeleton } from '@/components/ui/global-skeleton';
import { BackupPageHeader } from './_components/backup-page-header';
import { BackupSettingsCard } from './_components/backup-settings-card';
import { BackupHistoryCard } from './_components/backup-history-cards';
import { PageContainer } from "@/components/ui/page-container";

const BackupRecoveryPage = () => {
  // Custom hooks
  const { showToast } = useToast();
  const { modal, showModal, closeModal } = useModal();
  
  const {
    settings,
    backupHistory,
    loading,
    saving,
    creatingBackup,
    restoring,
    deleting,
    hasChanges,
    handleSettingChange,
    handleSave,
    handleCreateBackup,
    handleDeleteBackup,
    handleRestoreBackup,
  } = useBackup({ showToast, showModal });

  if (loading) {
    return <GlobalSkeleton type="management" showActionBar={false} />;
  }

  if (!settings) return null;

  return (
    <PageContainer hasSubmenu={true}>
      <Toaster position="top-right" />

      <BackupModal
        isOpen={modal.isOpen}
        onClose={closeModal}
        onConfirm={modal.onConfirm}
        title={modal.title}
        message={modal.message}
        isDestructive={modal.isDestructive}
        confirmText={modal.isDestructive ? "Delete" : "Restore"}
      />

      <BackupPageHeader
        handleCreateBackup={handleCreateBackup}
        handleSave={handleSave}
        creatingBackup={creatingBackup}
        saving={saving}
        hasChanges={hasChanges}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <BackupSettingsCard
          settings={settings}
          handleSettingChange={handleSettingChange}
        />

        <BackupHistoryCard
          backupHistory={backupHistory}
          restoring={restoring}
          deleting={deleting}
          onRestore={handleRestoreBackup}
          onDelete={handleDeleteBackup}
        />
      </div>
    </PageContainer>
  );
};

export default BackupRecoveryPage;