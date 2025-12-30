"use client";

import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogBody, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ValidationError {
  row: number;
  column?: string;
  errors: string[];
}

interface ValidationErrorsDialogProps {
  open: boolean;
  onClose: () => void;
  errors: ValidationError[];
  totalRows: number;
  validRows: number;
  invalidRows: number;
}

export default function ValidationErrorsDialog({
  open,
  onClose,
  errors,
  totalRows,
  validRows,
  invalidRows,
}: ValidationErrorsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-red-700">
            <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            CSV Validation Errors
          </DialogTitle>
        </DialogHeader>

        <DialogBody className="flex-1 overflow-auto">
          {/* Summary */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <h4 className="font-bold text-red-900 mb-2">Validation Summary</h4>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <div className="text-gray-600">Total Rows</div>
                <div className="text-lg font-bold text-gray-900">{totalRows}</div>
              </div>
              <div>
                <div className="text-green-600">Valid Rows</div>
                <div className="text-lg font-bold text-green-700">{validRows}</div>
              </div>
              <div>
                <div className="text-red-600">Invalid Rows</div>
                <div className="text-lg font-bold text-red-700">{invalidRows}</div>
              </div>
            </div>
          </div>

          {/* Error List */}
          <div className="space-y-2">
            <h4 className="font-semibold text-gray-900 mb-3">
              Errors Found ({errors.length}):
            </h4>

            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {errors.map((error, index) => (
                <div
                  key={index}
                  className="bg-white border border-red-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-red-100 flex items-center justify-center">
                      <span className="text-xs font-bold text-red-600">
                        {error.row}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-gray-900 mb-1">
                        Row {error.row}
                        {error.column && (
                          <span className="text-gray-500 font-normal"> - Column: {error.column}</span>
                        )}
                      </div>
                      <ul className="space-y-1">
                        {error.errors.map((err, errIdx) => (
                          <li key={errIdx} className="text-sm text-red-700 flex items-start gap-2">
                            <X className="h-4 w-4 mt-0.5 flex-shrink-0" />
                            <span>{err}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Instructions */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2">How to Fix:</h4>
            <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
              <li>Download the CSV template to see the correct format</li>
              <li>Valid item types: <code className="bg-blue-100 px-1 rounded">stock</code>, <code className="bg-blue-100 px-1 rounded">nonstock</code>, <code className="bg-blue-100 px-1 rounded">service</code></li>
              <li>Required fields: name, type, baseUnit</li>
              <li>Fix the errors in your CSV file and try importing again</li>
            </ul>
          </div>
        </DialogBody>

        <DialogFooter>
          <Button onClick={onClose} variant="default" className="w-full sm:w-auto">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
