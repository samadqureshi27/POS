import React from "react";
import { Save, Database } from "lucide-react";

interface BackupPageHeaderProps {
    handleCreateBackup: (type: "full" | "partial") => void;
    handleSave: () => void;
    creatingBackup: boolean;
    saving: boolean;
    hasChanges: boolean;
}

export const BackupPageHeader: React.FC<BackupPageHeaderProps> = ({
    handleCreateBackup,
    handleSave,
    creatingBackup,
    saving,
    hasChanges,
}) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 items-center mb-8">
            <h1 className="text-3xl mb-5 font-semibold w-full text-gray-900">
                Backup & Recovery
            </h1>
            <div className="flex justify-center items-center w-full md:justify-end">
                <div className="flex gap-3 w-full lg:w-[60%]">
                    <button
                        onClick={() => handleCreateBackup("full")}
                        disabled={creatingBackup}
                        className="flex w-[50%] items-center gap-2 px-6 py-2 border border-gray-300 rounded-sm hover:bg-gray-100 transition-colors disabled:opacity-50"
                    >
                        {creatingBackup ? (
                            <>
                                <div className="animate-spin h-4 w-4 border-b-2 border-gray-600 rounded-full"></div>
                                Creating...
                            </>
                        ) : (
                            <>
                                <Database size={16} />
                                Create Backup
                            </>
                        )}
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={!hasChanges || saving}
                        className={`flex w-[50%] items-center gap-2 px-6 py-2 rounded-sm transition-colors ${hasChanges && !saving
                                ? "bg-[#2C2C2C] text-white hover:bg-gray-700"
                                : "bg-gray-200 text-gray-400 cursor-not-allowed"
                            }`}
                    >
                        {saving ? (
                            <>
                                <div className="animate-spin h-4 w-4 border-b-2 border-white rounded-full"></div>
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save size={16} />
                                Save Settings
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};