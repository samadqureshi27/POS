// components/MenuModal.tsx
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogBody, DialogFooter, DialogTitle } from "@/components/ui/dialog";
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
      <DialogContent 
        size="3xl" 
        fullHeight 
        onInteractOutside={(e) => e.preventDefault()}
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-xl">
            {editingItem ? "Edit Add-on" : "Add Add-on"}
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="px-8 pb-6 pt-2 flex-shrink-0">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="option-values">Option Values</TabsTrigger>
            </TabsList>
          </div>

          <DialogBody className="space-y-8">
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
          </DialogBody>
        </Tabs>

        <DialogFooter>
          <Button
            onClick={onSubmit}
            disabled={!isFormValid()}
            className="bg-black hover:bg-gray-800 text-white px-8 h-11"
          >
            {editingItem ? "Update" : "Submit"}
          </Button>
          <Button
            onClick={onClose}
            variant="outline"
            className="px-8 h-11 border-gray-300"
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MenuModal;