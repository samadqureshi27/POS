// hooks/useImportExport.ts
import { useState } from 'react';
import { exportToCSV, exportToJSON, ExportConfig, EXPORT_CONFIGS } from '../util/ExportUtils';

export interface ImportExportOptions {
    onImportSuccess?: (data: any[]) => void;
    onImportError?: (error: string) => void;
    onExportSuccess?: () => void;
    onExportError?: (error: string) => void;
    validateImportData?: (data: any[]) => { isValid: boolean; error?: string };
}

export const useImportExport = <T extends Record<string, any>>(options?: ImportExportOptions) => {
    const [importing, setImporting] = useState(false);
    const [exporting, setExporting] = useState(false);

    const handleExportCSV = async (data: T[], config: ExportConfig) => {
        try {
            setExporting(true);
            exportToCSV(data, config);
            options?.onExportSuccess?.();
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Export failed';
            options?.onExportError?.(errorMessage);
        } finally {
            setExporting(false);
        }
    };

    // Export with predefined config
    const handleExportWithConfig = async (data: T[], configType: keyof typeof EXPORT_CONFIGS, ...params: any[]) => {
        try {
            setExporting(true);
            const configValue = EXPORT_CONFIGS[configType];
            let config: ExportConfig;

            // Handle function-based configs (like inventory)
            if (typeof configValue === 'function') {
                config = configValue(...params);
            } else {
                config = configValue;
            }

            exportToCSV(data, config);
            options?.onExportSuccess?.();
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Export failed';
            options?.onExportError?.(errorMessage);
        } finally {
            setExporting(false);
        }
    };

    const handleExportJSON = async (data: T[], filename: string) => {
        try {
            setExporting(true);
            exportToJSON(data, filename);
            options?.onExportSuccess?.();
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Export failed';
            options?.onExportError?.(errorMessage);
        } finally {
            setExporting(false);
        }
    };

    const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setImporting(true);

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const content = e.target?.result as string;

                if (file.type === 'application/json' || file.name.endsWith('.json')) {
                    // Handle JSON import
                    const data = JSON.parse(content);
                    processImportedData(data, event);
                } else {
                    // Handle CSV import
                    const lines = content.split('\n').filter(line => line.trim());
                    if (lines.length < 2) {
                        options?.onImportError?.('File appears to be empty or invalid');
                        return;
                    }

                    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
                    const data = lines.slice(1).map(line => {
                        const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
                        const row: Record<string, any> = {};
                        headers.forEach((header, index) => {
                            row[header] = values[index] || '';
                        });
                        return row;
                    });

                    processImportedData(data, event);
                }
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Import failed';
                options?.onImportError?.(errorMessage);
            } finally {
                setImporting(false);
            }
        };

        reader.onerror = () => {
            options?.onImportError?.('Failed to read file');
            setImporting(false);
        };

        reader.readAsText(file);
    };

    const processImportedData = (data: any[], event: React.ChangeEvent<HTMLInputElement>) => {
        // Validate data if validator is provided
        if (options?.validateImportData) {
            const validation = options.validateImportData(data);
            if (!validation.isValid) {
                options?.onImportError?.(validation.error || 'Invalid data format');
                event.target.value = '';
                return;
            }
        }

        options?.onImportSuccess?.(data);
        event.target.value = '';
    };

    return {
        handleExportCSV,
        handleExportWithConfig,
        handleExportJSON,
        handleImport,
        importing,
        exporting,
        isLoading: importing || exporting
    };
};