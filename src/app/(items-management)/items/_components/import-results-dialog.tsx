"use client";

import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, XCircle, AlertCircle, Info, Download } from "lucide-react";

interface ImportError {
  row?: number;
  field?: string;
  message: string;
  value?: any;
}

interface ImportValidation {
  field: string;
  message: string;
  severity: 'error' | 'warning' | 'info';
}

interface ImportSummary {
  created?: number;
  updated?: number;
  skipped?: number;
  failed?: number;
  total?: number;
  totalRows?: number;
  processedRows?: number;
}

interface ImportResultsData {
  success: boolean;
  message?: string;
  summary?: ImportSummary;
  errors?: ImportError[];
  validations?: ImportValidation[];
  warnings?: string[];
  duplicates?: Array<{
    row: number;
    name: string;
    sku?: string;
    action: 'skipped' | 'updated';
  }>;
  failedRows?: Array<{
    row: number;
    data: any;
    errors: string[];
  }>;
}

interface ImportResultsDialogProps {
  open: boolean;
  onClose: () => void;
  results: ImportResultsData | null;
  onDownloadErrorReport?: () => void;
}

export default function ImportResultsDialog({
  open,
  onClose,
  results,
  onDownloadErrorReport
}: ImportResultsDialogProps) {
  if (!results) {
    return null;
  }

  // Debug: Log what results we're receiving

  const hasErrors = results.errors && results.errors.length > 0;
  const hasWarnings = results.warnings && results.warnings.length > 0;
  const hasValidations = results.validations && results.validations.length > 0;
  const hasDuplicates = results.duplicates && results.duplicates.length > 0;
  const hasFailedRows = results.failedRows && results.failedRows.length > 0;

  const getStatusIcon = () => {
    if (!results.success || hasErrors) {
      return <XCircle className="h-6 w-6 text-red-500" />;
    }
    if (hasWarnings) {
      return <AlertCircle className="h-6 w-6 text-yellow-500" />;
    }
    return <CheckCircle className="h-6 w-6 text-green-500" />;
  };

  const getStatusColor = () => {
    if (!results.success || hasErrors) return "text-red-600";
    if (hasWarnings) return "text-yellow-600";
    return "text-green-600";
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] flex flex-col" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getStatusIcon()}
            <span className={getStatusColor()}>
              Import Results
            </span>
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-6">
            {/* Summary Section */}
            {results.summary && (
              <div className="space-y-3">
                <h3 className="font-semibold text-lg">Summary</h3>
                
                {/* Row Information */}
                {results.summary.totalRows !== undefined && (
                  <div className="flex justify-center mb-4">
                    <div className="text-center p-3 bg-gray-50 rounded-sm">
                      <div className="text-2xl font-bold text-gray-600">
                        {results.summary.totalRows}
                      </div>
                      <div className="text-sm text-gray-700">Total Rows</div>
                    </div>
                  </div>
                )}

                {/* Action Results */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {results.summary.created !== undefined && (
                    <div className="text-center p-3 bg-green-50 rounded-sm">
                      <div className="text-2xl font-bold text-green-600">
                        {results.summary.created}
                      </div>
                      <div className="text-sm text-green-700">Created</div>
                    </div>
                  )}
                  {results.summary.updated !== undefined && (
                    <div className="text-center p-3 bg-blue-50 rounded-sm">
                      <div className="text-2xl font-bold text-blue-600">
                        {results.summary.updated}
                      </div>
                      <div className="text-sm text-blue-700">Updated</div>
                    </div>
                  )}
                  {results.summary.skipped !== undefined && (
                    <div className="text-center p-3 bg-yellow-50 rounded-sm">
                      <div className="text-2xl font-bold text-yellow-600">
                        {results.summary.skipped}
                      </div>
                      <div className="text-sm text-yellow-700">Skipped</div>
                    </div>
                  )}
                  {results.summary.failed !== undefined && (
                    <div className="text-center p-3 bg-red-50 rounded-sm">
                      <div className="text-2xl font-bold text-red-600">
                        {results.summary.failed}
                      </div>
                      <div className="text-sm text-red-700">Failed</div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* General Message */}
            {results.message && (
              <div className="space-y-3">
                <div className={`p-4 rounded-sm border ${
                  results.success 
                    ? 'bg-green-50 border-green-200 text-green-800' 
                    : 'bg-red-50 border-red-200 text-red-800'
                }`}>
                  <div className="flex items-start gap-2">
                    {results.success ? (
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
                    )}
                    <div className="font-medium">
                      {results.success 
                        ? 'Import completed successfully' 
                        : results.message
                      }
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Validation Issues */}
            {hasValidations && (
              <div className="space-y-3">
                <h3 className="font-semibold text-lg">Validation Issues</h3>
                <div className="space-y-2">
                  {results.validations!.map((validation, index) => (
                    <div
                      key={index}
                      className={`flex items-start gap-2 p-3 rounded-sm ${
                        validation.severity === 'error'
                          ? 'bg-red-50 border border-red-200'
                          : validation.severity === 'warning'
                          ? 'bg-yellow-50 border border-yellow-200'
                          : 'bg-blue-50 border border-blue-200'
                      }`}
                    >
                      {validation.severity === 'error' && <XCircle className="h-4 w-4 text-red-500 mt-0.5" />}
                      {validation.severity === 'warning' && <AlertCircle className="h-4 w-4 text-yellow-500 mt-0.5" />}
                      {validation.severity === 'info' && <Info className="h-4 w-4 text-blue-500 mt-0.5" />}
                      <div className="flex-1">
                        <div className="font-medium">{validation.field}</div>
                        <div className="text-sm opacity-80">{validation.message}</div>
                      </div>
                      <Badge variant={validation.severity === 'error' ? 'destructive' : 'secondary'}>
                        {validation.severity}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Errors */}
            {hasErrors && (
              <div className="space-y-3">
                <h3 className="font-semibold text-lg text-red-600">Errors</h3>
                <div className="space-y-2">
                  {results.errors!.map((error, index) => (
                    <div key={index} className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-sm">
                      <XCircle className="h-4 w-4 text-red-500 mt-0.5" />
                      <div className="flex-1">
                        {error.row && (
                          <div className="text-sm font-medium text-red-700">Row {error.row}</div>
                        )}
                        {error.field && (
                          <div className="text-sm font-medium text-red-700">Field: {error.field}</div>
                        )}
                        <div className="text-sm text-red-800">{error.message}</div>
                        {error.value && (
                          <div className="text-xs text-red-600 mt-1">Value: {JSON.stringify(error.value)}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Failed Rows */}
            {hasFailedRows && (
              <div className="space-y-3">
                <h3 className="font-semibold text-lg text-red-600">Import Errors</h3>
                <div className="space-y-3">
                  {results.failedRows!.map((failedRow, index) => (
                    <div key={index} className="p-4 bg-red-50 border border-red-200 rounded-sm">
                      <div className="font-medium text-red-700 mb-3">Row {failedRow.row}</div>
                      <div className="space-y-2">
                        {failedRow.errors.map((error, errorIndex) => (
                          <div key={errorIndex} className="flex items-start gap-2">
                            <XCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                            <div className="text-sm text-red-800">{error}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Duplicates */}
            {hasDuplicates && (
              <div className="space-y-3">
                <h3 className="font-semibold text-lg">Duplicate Items</h3>
                <div className="space-y-2">
                  {results.duplicates!.map((duplicate, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-sm">
                      <div>
                        <div className="font-medium">Row {duplicate.row}: {duplicate.name}</div>
                        {duplicate.sku && (
                          <div className="text-sm text-gray-600">SKU: {duplicate.sku}</div>
                        )}
                      </div>
                      <Badge variant={duplicate.action === 'updated' ? 'default' : 'secondary'}>
                        {duplicate.action}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Warnings */}
            {hasWarnings && (
              <div className="space-y-3">
                <h3 className="font-semibold text-lg text-yellow-600">Warnings</h3>
                <div className="space-y-2">
                  {results.warnings!.map((warning, index) => (
                    <div key={index} className="flex items-start gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-sm">
                      <AlertCircle className="h-4 w-4 text-yellow-500 mt-0.5" />
                      <div className="text-sm text-yellow-800">{warning}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}


          </div>
        </ScrollArea>

        <Separator />

        <DialogFooter className="flex justify-between">
          <div>
            {(hasErrors || hasFailedRows) && onDownloadErrorReport && (
              <Button variant="outline" onClick={onDownloadErrorReport}>
                <Download className="h-4 w-4 mr-2" />
                Download Error Report
              </Button>
            )}
          </div>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}