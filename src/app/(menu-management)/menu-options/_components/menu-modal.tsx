// components/MenuModal.tsx
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import DetailsForm from './detail-form';
import OptionValuesForm from './option-value-form';
import { MenuItemOptions,MenuModalProps } from '@/lib/types/menuItemOptions';

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
        className="max-w-lg lg:max-w-2xl h-[70vh] flex flex-col"
        showCloseButton={false}
        onWheel={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl md:text-2xl">
            {editingItem ? "Edit Option" : "Add Option"}
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="option-values">Option Values</TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-y-auto mt-4">
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

        <DialogFooter className="flex-shrink-0">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={onSubmit}
            disabled={!isFormValid()}
          >
            {editingItem ? "Update" : "Save & Close"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MenuModal;