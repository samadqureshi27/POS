// components/ImportExportControls.tsx
"use client";

import React from 'react';
import { Download, Upload } from 'lucide-react';

export interface ImportExportControlsProps {
    onExport: () => void;
    onImport?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    className?: string;
    exportLabel?: string;
    importLabel?: string;
    acceptedFileTypes?: string;
    showImport?: boolean;
    showExport?: boolean;
    exportFileName?: string;
    disabled?: boolean;
}

const ImportExportControls: React.FC<ImportExportControlsProps> = ({
    onExport,
    onImport,
    className = "",
    exportLabel = "Export",
    importLabel = "Import",
    acceptedFileTypes = ".csv,.xlsx,.xls",
    showImport = true,
    showExport = true,
    disabled = false
}) => {
    return (
        <div className={`flex gap-4 justify-start md:justify-end mt-4 md:mt-0 ${className}`}>
            {showImport && onImport && (
                <label
                    className={`flex items-center gap-2 px-4 py-2 rounded-sm cursor-pointer transition-colors ${disabled
                            ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                            : 'bg-[#2C2C2C] text-white hover:bg-gray-700'
                        }`}
                >
                    <Upload size={16} />
                    {importLabel}
                    <input
                        type="file"
                        accept={acceptedFileTypes}
                        onChange={onImport}
                        className="hidden"
                        disabled={disabled}
                    />
                </label>
            )}

            {showExport && (
                <button
                    onClick={onExport}
                    disabled={disabled}
                    className={`flex items-center gap-2 px-4 py-2 rounded-sm transition-colors ${disabled
                            ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                            : 'bg-[#2C2C2C] text-white hover:bg-gray-700'
                        }`}
                >
                    <Download size={16} />
                    {exportLabel}
                </button>
            )}
        </div>
    );
};

export default ImportExportControls;