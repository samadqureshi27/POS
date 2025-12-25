// components/MenuModal.tsx
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import DetailsForm from './detail-form';
import OptionValuesForm from './option-value-form';
import { MenuItemOptions, MenuModalProps } from '@/lib/types/menuItemOptions';

const MenuModal: React.FC<MenuModalProps> = ({
  isOpen,
  editingItem,
  formData,
  onFormDataChange,
  onSubmit,
  onClose,
  isFormValid,
}) => {
  const [activeTab, setActiveTab] = useState("details");

  useEffect(() => {
    if (isOpen) {
      setActiveTab("details");
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent size="3xl" fullHeight onInteractOutside={(e) => e.preventDefault()}>
        {/* Header */}
        <div className="p-5 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-gray-700" />
            <DialogTitle className="text-xl font-bold text-gray-900">
              {editingItem ? "Edit Add-on" : "Add Add-on"}
            </DialogTitle>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            {editingItem ? "Update add-on details and values" : "Create a new add-on"}
          </p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex flex-col min-h-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">
            {/* Tab List */}
            <div className="px-5 pt-3 pb-3 border-b border-gray-100 flex-shrink-0">
              <div className="flex flex-col gap-2">
                <div className="flex justify-center">
                  <TabsList className="grid w-full max-w-sm grid-cols-2 h-9">
                    <TabsTrigger value="details" className="text-sm">
                      Details
                    </TabsTrigger>
                    <TabsTrigger value="option-values" className="text-sm">
                      Option Values
                    </TabsTrigger>
                  </TabsList>
                </div>
                <p className="text-xs text-gray-600 text-center">
                  {activeTab === "details"
                    ? "Configure basic add-on information and settings"
                    : "Define individual values and pricing for this add-on"}
                </p>
              </div>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto p-5 min-h-0">
              <TabsContent value="details" className="mt-0">
                <DetailsForm
                  formData={formData}
                  onFormDataChange={onFormDataChange}
                />
              </TabsContent>
              <TabsContent value="option-values" className="mt-0">
                <OptionValuesForm
                  formData={formData}
                  onFormDataChange={onFormDataChange}
                />
              </TabsContent>
            </div>
          </Tabs>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-end items-center gap-2 flex-shrink-0">
          <Button
            onClick={onClose}
            variant="outline"
            size="sm"
            className="h-9"
          >
            Cancel
          </Button>
          <Button
            onClick={onSubmit}
            disabled={!isFormValid()}
            size="sm"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white h-9"
          >
            {editingItem ? "Update" : "Save & Close"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MenuModal;