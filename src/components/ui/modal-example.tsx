"use client";

import React, { useState } from "react";
import { Calendar, Plus, Upload } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogBody,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { CollapsibleSection } from "@/components/ui/collapsible-section";

interface ModalExampleProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export function ModalExample({ isOpen, onClose, onSubmit }: ModalExampleProps) {
  const [activeTab, setActiveTab] = useState("setup");
  const [isActive, setIsActive] = useState(true);

  const handleSubmit = () => {
    // Handle form submission
    onSubmit({});
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent size="2xl" className="max-h-[90vh]">
        {/* Header - NO border below, matches ModalUP.png */}
        <DialogHeader className="border-b-0">
          <DialogTitle>Create promotion</DialogTitle>
        </DialogHeader>

        {/* Tabs - positioned right after header, WITH border below */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="px-8 pb-6 pt-2 flex-shrink-0 border-b border-gray-200">
            <TabsList>
              <TabsTrigger value="setup">Setup</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>
          </div>

          {/* Scrollable Body */}
          <DialogBody className="space-y-6">
            <TabsContent value="setup" className="mt-0 space-y-6 h-full">
              {/* Name Field */}
              <div className="space-y-2">
                <Label>
                  Name <span className="text-red-500">*</span>
                </Label>
                <Input placeholder="Name" />
              </div>

              {/* Description Field */}
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea placeholder="Description" rows={3} />
              </div>

              {/* Collapsible: Custom fields */}
              <CollapsibleSection title="Custom fields">
                <div className="space-y-4">
                  <p className="text-sm text-gray-500">Add custom fields here...</p>
                </div>
              </CollapsibleSection>

              {/* Collapsible: Push notifications */}
              <CollapsibleSection title="Push notifications">
                <div className="space-y-4">
                  <p className="text-sm text-gray-500">Configure push notifications...</p>
                </div>
              </CollapsibleSection>

              {/* Settings Section */}
              <div className="pt-6 border-t border-gray-200">
                <h3 className="text-base font-normal text-gray-900 mb-6">Settings</h3>

                {/* Image Upload */}
                <div className="space-y-2 mb-6">
                  <Label>
                    Image <span className="text-red-500">*</span>
                  </Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-sm p-8 flex items-center justify-between">
                    <div className="flex items-center gap-3 text-gray-400">
                      <Upload className="h-6 w-6" />
                      <span className="text-sm">Upload image</span>
                    </div>
                    <Button variant="default" className="bg-black hover:bg-gray-800 text-white">
                      Select file
                    </Button>
                  </div>
                </div>

                {/* Date Fields */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="space-y-2">
                    <Label>Date from</Label>
                    <div className="relative">
                      <Input type="text" placeholder="" />
                      <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <span className="absolute right-8 top-1/2 -translate-y-1/2 text-red-500">*</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Date to</Label>
                    <div className="relative">
                      <Input type="text" placeholder="" />
                      <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <span className="absolute right-8 top-1/2 -translate-y-1/2 text-red-500">*</span>
                    </div>
                  </div>
                </div>

                {/* Limit Fields */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="space-y-2">
                    <Label>Limit per member</Label>
                    <Input placeholder="Limit per member" />
                  </div>
                  <div className="space-y-2">
                    <Label>Max global usages</Label>
                    <Input placeholder="Max global usages" />
                  </div>
                </div>

                {/* Templates */}
                <div className="space-y-2 mb-6">
                  <Label>Templates</Label>
                  <div className="flex items-center gap-2 p-3 border border-gray-300 rounded-sm bg-gray-50">
                    <span className="text-sm text-gray-600 flex-1">Nothing selected</span>
                    <button className="w-6 h-6 rounded-sm bg-gray-200 hover:bg-gray-300 flex items-center justify-center">
                      <Plus className="h-4 w-4 text-gray-600" />
                    </button>
                  </div>
                </div>

                {/* Active Toggle */}
                <div className="flex items-center justify-between px-4 py-4 bg-gray-50 rounded-sm shadow-sm">
                  <Label className="text-base font-normal text-gray-900">Active</Label>
                  <Switch checked={isActive} onCheckedChange={setIsActive} />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="preview" className="mt-0 h-full">
              <p className="text-gray-500">Preview content goes here...</p>
            </TabsContent>
          </DialogBody>
        </Tabs>

        {/* Footer - matches ModalDown.png */}
        <DialogFooter>
          <Button
            className="bg-black hover:bg-gray-800 text-white px-8 h-11"
            onClick={handleSubmit}
          >
            Submit
          </Button>
          <Button
            variant="outline"
            className="px-8 h-11 border-gray-300"
            onClick={onClose}
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
