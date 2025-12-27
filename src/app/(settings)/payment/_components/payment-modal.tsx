"use client";
import React from "react";
import { Loader2, Info } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogBody, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { CustomTooltip } from "@/components/ui/custom-tooltip";
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
      <DialogContent 
        size="lg"
        onInteractOutside={(e) => e.preventDefault()}
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-xl">
            {editingItem ? "Edit Payment Method" : "Add New Payment Method"}
          </DialogTitle>
        </DialogHeader>

        <DialogBody className="flex-1 overflow-y-auto min-h-0 p-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pl-8 pr-[34px]">
          {/* Payment Method Name */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-1.5">
              <Label htmlFor="paymentName" className="text-sm font-medium text-[#656565]">
                Payment Method Name <span className="text-red-500">*</span>
              </Label>
              <CustomTooltip label="Enter a descriptive name for this payment method" direction="right">
                <Info className="h-4 w-4 text-gray-400 cursor-pointer" />
              </CustomTooltip>
            </div>
            <Input
              id="paymentName"
              type="text"
              value={formData.Name}
              onChange={(e) => onFormDataChange({ Name: e.target.value })}
              placeholder="Enter payment method name"
              className="mt-1.5"
              required
            />
          </div>

          {/* Payment Type */}
          <div className="sm:col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-1.5">
              <Label htmlFor="paymentType" className="text-sm font-medium text-[#656565]">
                Payment Type
              </Label>
              <CustomTooltip label="Select the type of payment method (Cash, Card, or Online)" direction="right">
                <Info className="h-4 w-4 text-gray-400 cursor-pointer" />
              </CustomTooltip>
            </div>
            <Select value={formData.PaymentType} onValueChange={(value) => onFormDataChange({ PaymentType: value as "Cash" | "Card" | "Online" })}>
              <SelectTrigger className="mt-1.5">
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
            <div className="flex items-center gap-2 mb-1.5">
              <Label htmlFor="taxType" className="text-sm font-medium text-[#656565]">
                Tax Type <span className="text-red-500">*</span>
              </Label>
              <CustomTooltip label="Enter the tax type name (e.g., GST, VAT, Service Tax)" direction="right">
                <Info className="h-4 w-4 text-gray-400 cursor-pointer" />
              </CustomTooltip>
            </div>
            <Input
              id="taxType"
              type="text"
              value={formData.TaxType}
              onChange={(e) => onFormDataChange({ TaxType: e.target.value })}
              placeholder="e.g., GST, VAT, Service Tax"
              className="mt-1.5"
              required
            />
          </div>

          {/* Tax Percentage */}
          <div className="sm:col-span-2 md:col-span-2">
            <div className="flex items-center gap-2 mb-1.5">
              <Label htmlFor="taxPercentage" className="text-sm font-medium text-[#656565]">
                Tax Percentage (%)
              </Label>
              <CustomTooltip label="Enter the tax rate as a percentage between 0-100" direction="right">
                <Info className="h-4 w-4 text-gray-400 cursor-pointer" />
              </CustomTooltip>
            </div>
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
              className="mt-1.5"
              min="0"
              max="100"
            />
          </div>

          {/* Status - Replaced with Toggle */}
          <div className="md:col-span-2">
            <div className="flex items-center justify-between rounded-sm border border-[#d4d7dd] bg-[#f8f8fa] px-4 py-3">
              <div className="flex items-center gap-2">
                <Label className="text-sm font-medium text-[#1f2937]">
                  Status
                </Label>
                <CustomTooltip label="Enable or disable this payment method" direction="right">
                  <Info className="h-4 w-4 text-gray-400 cursor-pointer" />
                </CustomTooltip>
              </div>
              <Switch
                checked={formData.Status === "Active"}
                onCheckedChange={onStatusChange}
              />
            </div>
          </div>
          </div>
        </DialogBody>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={actionLoading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={onSubmit}
            disabled={!formData.Name.trim() || actionLoading}
          >
            {actionLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {editingItem ? "Updating..." : "Saving..."}
              </>
            ) : (
              <>
                {editingItem ? "Update Payment Method" : "Add Payment Method"}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;