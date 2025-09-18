// components/ImportExportControls.tsx
"use client";

import React from 'react';
import { Download, Upload } from 'lucide-react';
import { Button } from './button';
import { cn } from '@/lib/utils';

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
        <div className={cn("flex gap-4 justify-start md:justify-end mt-4 md:mt-0", className)}>
            {showImport && onImport && (
                <Button
                    asChild
                    variant={disabled ? "secondary" : "default"}
                    disabled={disabled}
                    className="flex items-center gap-2"
                >
                    <label className="cursor-pointer">
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
                </Button>
            )}

            {showExport && (
                <Button
                    onClick={onExport}
                    disabled={disabled}
                    variant={disabled ? "secondary" : "default"}
                    className="flex items-center gap-2"
                >
                    <Download size={16} />
                    {exportLabel}
                </Button>
            )}
        </div>
    );
};

export default ImportExportControls;