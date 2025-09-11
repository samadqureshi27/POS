"use client";
import React from "react";

// Hooks
import { useToast } from '@/lib/hooks';
import { useModal } from '@/lib/hooks';
import { useBackup } from '@/lib/hooks/useBackup';

// Components
import { BackupModal } from './_components/backup-modal';
import { Toast } from '@/components/layout/ui/toast';
import LoadingSpinner from '@/components/layout/ui/Loader';
import { BackupPageHeader } from './_components/backup-page-header';
import { BackupSettingsCard } from './_components/backup-settings-card';
import { BackupHistoryCard } from './_components/backup-history-cards';

const BackupRecoveryPage = () => {
  // Custom hooks
  const { toast, toastVisible, showToast, hideToast } = useToast();
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
    return <LoadingSpinner message='Backup Page Loading' />;
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

      <BackupModal
        isOpen={modal.isOpen}
        onClose={closeModal}
        onConfirm={modal.onConfirm}
        title={modal.title}
        message={modal.message}
        isDestructive={modal.isDestructive}
        confirmText={modal.isDestructive ? "Delete" : "Restore"}
      />

      <div className="flex-1 justify-center items-center w-full px-6">
        <div className="mt-20">
          {/* Header */}
          <BackupPageHeader
            handleCreateBackup={handleCreateBackup}
            handleSave={handleSave}
            creatingBackup={creatingBackup}
            saving={saving}
            hasChanges={hasChanges}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Backup Settings */}
            <BackupSettingsCard
              settings={settings}
              handleSettingChange={handleSettingChange}
            />

            {/* Backup History */}
            <BackupHistoryCard
              backupHistory={backupHistory}
              restoring={restoring}
              deleting={deleting}
              onRestore={handleRestoreBackup}
              onDelete={handleDeleteBackup}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BackupRecoveryPage;