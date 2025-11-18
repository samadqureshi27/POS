"use client";

import React, { useState, useEffect } from "react";
import { X, Plus, Trash2, ArrowRight, Loader2 } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { UnitsService, ConversionsService, type Unit, type Conversion } from "@/lib/services/inventory-service";

interface UnitsManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRefresh?: () => void;
}

export default function UnitsManagementModal({ isOpen, onClose, onRefresh }: UnitsManagementModalProps) {
  const [units, setUnits] = useState<Unit[]>([]);
  const [conversions, setConversions] = useState<Conversion[]>([]);
  const [loading, setLoading] = useState(false);

  // New Unit Form
  const [newUnit, setNewUnit] = useState({
    name: "",
    symbol: "",
    type: "count" as Unit["type"],
  });

  // New Conversion Form
  const [newConversion, setNewConversion] = useState({
    fromUnit: "",
    toUnit: "",
    factor: "",
  });

  // Confirmation Dialog states
  const [deleteUnitDialogOpen, setDeleteUnitDialogOpen] = useState(false);
  const [unitToDelete, setUnitToDelete] = useState<{ id: string; name: string } | null>(null);
  const [deleteConversionDialogOpen, setDeleteConversionDialogOpen] = useState(false);
  const [conversionToDelete, setConversionToDelete] = useState<{ id: string; fromUnit: string; toUnit: string } | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  const loadData = async () => {
    setLoading(true);
    const [unitsRes, conversionsRes] = await Promise.all([
      UnitsService.listUnits(),
      ConversionsService.listConversions(),
    ]);

    if (unitsRes.success && unitsRes.data) setUnits(unitsRes.data);
    if (conversionsRes.success && conversionsRes.data) setConversions(conversionsRes.data);
    setLoading(false);
  };

  const handleAddUnit = async () => {
    if (!newUnit.name || !newUnit.symbol) return;

    const response = await UnitsService.createUnit(newUnit);
    if (response.success) {
      setNewUnit({ name: "", symbol: "", type: "count" });
      loadData();
      if (onRefresh) onRefresh();
    }
  };

  const handleDeleteUnit = (id: string, name: string) => {
    setUnitToDelete({ id, name });
    setDeleteUnitDialogOpen(true);
  };

  const confirmDeleteUnit = async () => {
    if (!unitToDelete) return;

    const response = await UnitsService.deleteUnit(unitToDelete.id);
    if (response.success) {
      loadData();
      if (onRefresh) onRefresh();
    }
  };

  const handleAddConversion = async () => {
    if (!newConversion.fromUnit || !newConversion.toUnit || !newConversion.factor) return;

    const response = await ConversionsService.createConversion({
      fromUnit: newConversion.fromUnit,
      toUnit: newConversion.toUnit,
      factor: parseFloat(newConversion.factor),
    });

    if (response.success) {
      setNewConversion({ fromUnit: "", toUnit: "", factor: "" });
      loadData();
    }
  };

  const handleDeleteConversion = (id: string, fromUnit: string, toUnit: string) => {
    setConversionToDelete({ id, fromUnit, toUnit });
    setDeleteConversionDialogOpen(true);
  };

  const confirmDeleteConversion = async () => {
    if (!conversionToDelete) return;

    const response = await ConversionsService.deleteConversion(conversionToDelete.id);
    if (response.success) {
      loadData();
    }
  };

  const unitTypeColors: Record<string, string> = {
    weight: "bg-yellow-100 text-yellow-700",
    volume: "bg-blue-100 text-blue-700",
    count: "bg-green-100 text-green-700",
    custom: "bg-gray-100 text-gray-700",
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[85vh] overflow-hidden bg-white border border-gray-200 text-gray-900 p-0 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 bg-white flex-shrink-0">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Units & Conversions
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              Define measurement units and conversion factors for your inventory
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          <Tabs defaultValue="units" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="units">Units</TabsTrigger>
              <TabsTrigger value="conversions">Conversions</TabsTrigger>
            </TabsList>

            {/* Units Tab */}
            <TabsContent value="units" className="space-y-6">
              {/* Add New Unit Form */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Plus className="h-5 w-5 text-gray-600" />
                  Add New Unit
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <Label className="text-gray-700 text-sm mb-2">Name</Label>
                    <Input
                      value={newUnit.name}
                      onChange={(e) => setNewUnit({ ...newUnit, name: e.target.value })}
                      placeholder="e.g., Kilogram"
                      className="bg-white border-gray-300 h-9 rounded-md"
                    />
                  </div>

                  <div>
                    <Label className="text-gray-700 text-sm mb-2">Symbol</Label>
                    <Input
                      value={newUnit.symbol}
                      onChange={(e) => setNewUnit({ ...newUnit, symbol: e.target.value })}
                      placeholder="e.g., kg"
                      className="bg-white border-gray-300 h-9 rounded-md"
                    />
                  </div>

                  <div>
                    <Label className="text-gray-700 text-sm mb-2">Type</Label>
                    <Select
                      value={newUnit.type}
                      onValueChange={(value) => setNewUnit({ ...newUnit, type: value as any })}
                    >
                      <SelectTrigger className="bg-white border-gray-300">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="weight">Weight</SelectItem>
                        <SelectItem value="volume">Volume (Liquid)</SelectItem>
                        <SelectItem value="count">Count (Pieces)</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-end">
                    <Button
                      onClick={handleAddUnit}
                      className="w-full bg-gray-900 hover:bg-black text-white"
                      disabled={!newUnit.name || !newUnit.symbol}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Unit
                    </Button>
                  </div>
                </div>
              </div>

              {/* Units List */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900">Existing Units ({units.length})</h3>

                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                  </div>
                ) : units.length === 0 ? (
                  <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg border border-gray-200">
                    No units added yet. Start by adding your first unit above.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {units.map((unit) => (
                      <div
                        key={(unit.id as string) || unit.symbol}
                        className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className={`px-3 py-1 rounded-lg ${unitTypeColors[unit.type]} text-xs font-medium`}>
                            {unit.type}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => unit.id && handleDeleteUnit(unit.id as string, unit.name)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 -mr-2 -mt-2"
                            disabled={!unit.id}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600 text-sm">Name:</span>
                            <span className="text-gray-900 font-medium">{unit.name}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600 text-sm">Symbol:</span>
                            <span className="text-gray-900 font-bold text-lg h-9">{unit.symbol}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Conversions Tab */}
            <TabsContent value="conversions" className="space-y-6">
              {/* Add New Conversion Form */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Plus className="h-5 w-5 text-gray-600" />
                  Add New Conversion
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <Label className="text-gray-700 text-sm mb-2">From Unit</Label>
                    <Select
                      value={newConversion.fromUnit}
                      onValueChange={(value) => setNewConversion({ ...newConversion, fromUnit: value })}
                    >
                      <SelectTrigger className="bg-white border-gray-300 h-9 rounded-md">
                        <SelectValue placeholder="Select unit" />
                      </SelectTrigger>
                      <SelectContent>
                        {units.map((unit) => (
                          <SelectItem key={(unit.id as string) || unit.symbol} value={unit.symbol}>
                            {unit.name} ({unit.symbol})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-gray-700 text-sm mb-2">To Unit</Label>
                    <Select
                      value={newConversion.toUnit}
                      onValueChange={(value) => setNewConversion({ ...newConversion, toUnit: value })}
                    >
                      <SelectTrigger className="bg-white border-gray-300 h-9 rounded-md">
                        <SelectValue placeholder="Select unit" />
                      </SelectTrigger>
                      <SelectContent>
                        {units.map((unit) => (
                          <SelectItem key={(unit.id as string) || unit.symbol} value={unit.symbol}>
                            {unit.name} ({unit.symbol})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-gray-700 text-sm mb-2">Factor</Label>
                    <Input
                      type="number"
                      step="any"
                      value={newConversion.factor}
                      onChange={(e) => setNewConversion({ ...newConversion, factor: e.target.value })}
                      placeholder="e.g., 1000"
                      className="bg-white border-gray-300 h-9 rounded-md"
                    />
                  </div>

                  <div className="flex items-end">
                    <Button
                      onClick={handleAddConversion}
                      className="w-full bg-gray-900 hover:bg-black text-white h-9 rounded-md"
                      disabled={!newConversion.fromUnit || !newConversion.toUnit || !newConversion.factor}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add
                    </Button>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-blue-700 text-xs">
                    <strong>Example:</strong> To convert kg to g, set factor = 1000 (1 kg = 1000 g)
                  </p>
                </div>
              </div>

              {/* Conversions List */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900">Existing Conversions ({conversions.length})</h3>

                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                  </div>
                ) : conversions.length === 0 ? (
                  <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg border border-gray-200">
                    No conversions added yet. Start by adding your first conversion above.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {conversions.map((conversion) => (
                      <div
                        key={(conversion.id as string) || (conversion._id as string) || `${conversion.fromUnit}-${conversion.toUnit}-${conversion.factor}`}
                        className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 flex-1">
                            <div className="px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg">
                              <span className="text-blue-700 font-bold text-lg">{conversion.fromUnit}</span>
                            </div>

                            <div className="flex items-center gap-2 text-gray-600">
                              <ArrowRight className="h-5 w-5" />
                              <span className="font-mono text-sm">× {conversion.factor}</span>
                            </div>

                            <div className="px-4 py-2 bg-green-50 border border-green-200 rounded-lg">
                              <span className="text-green-700 font-bold text-lg">{conversion.toUnit}</span>
                            </div>

                            <div className="text-gray-600 text-sm">
                              1 {conversion.fromUnit} = {conversion.factor} {conversion.toUnit}
                            </div>
                          </div>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const cid = (conversion.id as string) || (conversion._id as string);
                              if (cid) handleDeleteConversion(cid, conversion.fromUnit, conversion.toUnit);
                            }}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-white flex justify-end flex-shrink-0">
          <Button
            onClick={onClose}
            className="bg-gray-900 hover:bg-black text-white"
          >
            Done
          </Button>
        </div>
      </DialogContent>

      {/* Delete Unit Confirmation Dialog */}
      <ConfirmDialog
        open={deleteUnitDialogOpen}
        onOpenChange={setDeleteUnitDialogOpen}
        title="Delete Unit"
        description={`Are you sure you want to delete the unit "${unitToDelete?.name}"? This action cannot be undone.`}
        onConfirm={confirmDeleteUnit}
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
      />

      {/* Delete Conversion Confirmation Dialog */}
      <ConfirmDialog
        open={deleteConversionDialogOpen}
        onOpenChange={setDeleteConversionDialogOpen}
        title="Delete Conversion"
        description={`Are you sure you want to delete the conversion from "${conversionToDelete?.fromUnit}" to "${conversionToDelete?.toUnit}"? This action cannot be undone.`}
        onConfirm={confirmDeleteConversion}
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
      />
    </Dialog>
  );
}
