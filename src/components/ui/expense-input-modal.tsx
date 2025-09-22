"use client";
import React, { useState } from "react";
import { DollarSign, Calendar, Tag, FileText, Receipt, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface ExpenseInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (expense: ExpenseData) => void;
}

interface ExpenseData {
  category: string;
  amount: number;
  description: string;
  date: string;
  vendor?: string;
  paymentMethod: string;
}

const expenseCategories = [
  "Inventory - Coffee Beans",
  "Inventory - Milk & Dairy",
  "Inventory - Food Items",
  "Utilities",
  "Rent",
  "Labor",
  "Marketing",
  "Equipment",
  "Maintenance",
  "Other Operating"
];

const paymentMethods = [
  "Cash",
  "Credit Card",
  "Bank Transfer",
  "Check"
];

export const ExpenseInputModal: React.FC<ExpenseInputModalProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  const [formData, setFormData] = useState<ExpenseData>({
    category: "",
    amount: 0,
    description: "",
    date: new Date().toISOString().split('T')[0],
    vendor: "",
    paymentMethod: ""
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.category) newErrors.category = "Category is required";
    if (formData.amount <= 0) newErrors.amount = "Amount must be greater than 0";
    if (!formData.description) newErrors.description = "Description is required";
    if (!formData.date) newErrors.date = "Date is required";
    if (!formData.paymentMethod) newErrors.paymentMethod = "Payment method is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
      setFormData({
        category: "",
        amount: 0,
        description: "",
        date: new Date().toISOString().split('T')[0],
        vendor: "",
        paymentMethod: ""
      });
      onClose();
    }
  };

  const handleInputChange = (field: keyof ExpenseData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const isFormValid = formData.category && formData.amount > 0 && formData.description && formData.date && formData.paymentMethod;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-md max-h-[90vh] flex flex-col"
        showCloseButton={false}
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            <div className="p-2 rounded-lg bg-blue-100">
              <Receipt size={18} className="text-blue-600" />
            </div>
            Add New Expense
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto space-y-6 px-1">
          {/* Category */}
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Tag size={16} className="text-gray-500" />
              Category
            </Label>
            <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
              <SelectTrigger className={errors.category ? "border-red-500" : ""}>
                <SelectValue placeholder="Select expense category" />
              </SelectTrigger>
              <SelectContent>
                {expenseCategories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && <p className="text-red-500 text-xs">{errors.category}</p>}
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <DollarSign size={16} className="text-gray-500" />
              Amount (PKR)
            </Label>
            <Input
              type="number"
              step="0.01"
              min="0"
              value={formData.amount || ""}
              onChange={(e) => handleInputChange("amount", parseFloat(e.target.value) || 0)}
              placeholder="0.00"
              className={errors.amount ? "border-red-500" : ""}
            />
            {errors.amount && <p className="text-red-500 text-xs">{errors.amount}</p>}
          </div>

          {/* Date */}
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Calendar size={16} className="text-gray-500" />
              Date
            </Label>
            <Input
              type="date"
              value={formData.date}
              onChange={(e) => handleInputChange("date", e.target.value)}
              className={errors.date ? "border-red-500" : ""}
            />
            {errors.date && <p className="text-red-500 text-xs">{errors.date}</p>}
          </div>

          {/* Vendor (Optional) */}
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Building2 size={16} className="text-gray-500" />
              Vendor <span className="text-gray-400 text-xs">(Optional)</span>
            </Label>
            <Input
              type="text"
              value={formData.vendor}
              onChange={(e) => handleInputChange("vendor", e.target.value)}
              placeholder="Vendor or supplier name"
            />
          </div>

          {/* Payment Method */}
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <FileText size={16} className="text-gray-500" />
              Payment Method
            </Label>
            <Select value={formData.paymentMethod} onValueChange={(value) => handleInputChange("paymentMethod", value)}>
              <SelectTrigger className={errors.paymentMethod ? "border-red-500" : ""}>
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                {paymentMethods.map(method => (
                  <SelectItem key={method} value={method}>
                    {method}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.paymentMethod && <p className="text-red-500 text-xs">{errors.paymentMethod}</p>}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <FileText size={16} className="text-gray-500" />
              Description
            </Label>
            <Textarea
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Brief description of the expense..."
              rows={3}
              className={errors.description ? "border-red-500 resize-none" : "resize-none"}
            />
            {errors.description && <p className="text-red-500 text-xs">{errors.description}</p>}
          </div>
        </form>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={!isFormValid}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Add Expense
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};