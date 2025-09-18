"use client";
import React from "react";
import { X, Save } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { PaymentMethod, ModalFormData } from "@/lib/types/payment";

interface PaymentModalProps {
  isOpen: boolean;
  editingItem: PaymentMethod | null;
  formData: ModalFormData;
  actionLoading: boolean;
  onClose: () => void;
  onSubmit: () => void;
  onFormDataChange: (updates: Partial<ModalFormData>) => void;
  onStatusChange: (isActive: boolean) => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  editingItem,
  formData,
  actionLoading,
  onClose,
  onSubmit,
  onFormDataChange,
  onStatusChange,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="min-w-[35vw] max-w-2xl max-h-[70vh] min-h-[70vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl font-semibold">
            {editingItem ? "Edit Payment Method" : "Add New Payment Method"}
          </DialogTitle>
        </DialogHeader>

        {/* Scrollable Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 flex-1 overflow-y-auto pr-1 pl-1">
          {/* Payment Method Name */}
          <div className="md:col-span-2">
            <Label htmlFor="paymentName" className="text-sm font-medium">
              Payment Method Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="paymentName"
              type="text"
              value={formData.Name}
              onChange={(e) => onFormDataChange({ Name: e.target.value })}
              placeholder="Enter payment method name"
              required
            />
          </div>

          {/* Payment Type */}
          <div className="sm:col-span-1 md:col-span-1">
            <Label htmlFor="paymentType" className="text-sm font-medium">
              Payment Type
            </Label>
            <Select value={formData.PaymentType} onValueChange={(value) => onFormDataChange({ PaymentType: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select Payment Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Cash">Cash</SelectItem>
                <SelectItem value="Card">Card</SelectItem>
                <SelectItem value="Online">Online</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tax Type */}
          <div className="sm:col-span-1 md:col-span-1">
            <Label htmlFor="taxType" className="text-sm font-medium">
              Tax Type <span className="text-destructive">*</span>
            </Label>
            <Input
              id="taxType"
              type="text"
              value={formData.TaxType}
              onChange={(e) => onFormDataChange({ TaxType: e.target.value })}
              placeholder="e.g., GST, VAT, Service Tax"
              required
            />
          </div>

          {/* Tax Percentage */}
          <div className="sm:col-span-2 md:col-span-2">
            <Label htmlFor="taxPercentage" className="text-sm font-medium">
              Tax Percentage (%)
              <span className="text-xs text-muted-foreground ml-1">
                (Enter rate between 0-100)
              </span>
            </Label>
            <Input
              id="taxPercentage"
              type="text"
              value={formData.TaxPercentage || ''}
              onChange={(e) => {
                const value = e.target.value;
                // Allow numbers with decimal points
                if (value === '' || /^\d*\.?\d*$/.test(value)) {
                  const numValue = value === '' ? 0 : parseFloat(value);
                  if (value === '' || (numValue >= 0 && numValue <= 100)) {
                    onFormDataChange({
                      TaxPercentage: value === '' ? 0 : numValue
                    });
                  }
                }
                // If invalid input, just ignore it (don't update state)
              }}
              placeholder="0"
              min="0"
              max="100"
            />
          </div>

          {/* Status - Replaced with Toggle */}
          <div className="md:col-span-2">
            <div className="flex items-center justify-between gap-4">
              <Label className="text-sm font-medium">
                Status
              </Label>
              <Switch
                checked={formData.Status === "Active"}
                onCheckedChange={onStatusChange}
              />
            </div>
          </div>
        </div>

        {/* Fixed Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 sm:pt-6 justify-end border-t border-gray-200 mt-auto">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={actionLoading}
            className="w-full sm:w-auto"
          >
            <X size={16} />
            Cancel
          </Button>
          <Button
            type="button"
            onClick={onSubmit}
            disabled={!formData.Name.trim() || actionLoading}
            className="w-full sm:w-auto"
          >
            {actionLoading ? (
              <>
                <div className="animate-spin h-4 w-4 border-b-2 border-white rounded-full"></div>
                {editingItem ? "Updating..." : "Saving..."}
              </>
            ) : (
              <>
                <Save size={16} />
                {editingItem ? "Update Item" : "Add Item"}
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;