"use client";

import React, { useState, useEffect } from "react";
import { Save, Loader2, Plus, Trash2, Building2 } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { InventoryAPI, type InventoryItem, type Unit, type Vendor, type Branch, mockCategories } from "@/lib/util/inventoryApi";

interface InventoryItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingItem: InventoryItem | null;
  onSave: (data: Partial<InventoryItem>) => Promise<void>;
}

export default function InventoryItemModal({
  isOpen,
  onClose,
  editingItem,
  onSave,
}: InventoryItemModalProps) {
  const [units, setUnits] = useState<Unit[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<InventoryItem>>({
    name: "",
    sku: "",
    type: "stock",
    baseUnit: "pc",
    purchaseUnit: "",
    conversionFactor: undefined,
    trackStock: true,
    category: "",
    reorderPoint: 0,
    barcode: "",
    taxCategory: "",
    Status: "Active",
    vendors: [],
    branches: [],
  });

  // Vendor modal state
  const [isAddingVendor, setIsAddingVendor] = useState(false);
  const [newVendor, setNewVendor] = useState({
    Company_Name: "",
    Name: "",
    Contact: "",
    Address: "",
    Email: "",
  });

  // Branch distribution state
  const [branchDistribution, setBranchDistribution] = useState<{ branchId: number; quantity: number }[]>([]);

  useEffect(() => {
    if (isOpen) {
      loadData();

      if (editingItem) {
        setFormData({
          name: editingItem.name,
          sku: editingItem.sku,
          type: editingItem.type,
          baseUnit: editingItem.baseUnit,
          purchaseUnit: editingItem.purchaseUnit,
          conversionFactor: editingItem.conversionFactor,
          trackStock: editingItem.trackStock,
          category: editingItem.category,
          reorderPoint: editingItem.reorderPoint,
          barcode: editingItem.barcode,
          taxCategory: editingItem.taxCategory,
          Status: editingItem.Status,
          vendors: editingItem.vendors || [],
          branches: editingItem.branches || [],
        });
        setBranchDistribution(editingItem.branches || []);
      } else {
        // Reset form for new item
        setFormData({
          name: "",
          sku: "",
          type: "stock",
          baseUnit: "pc",
          purchaseUnit: "",
          conversionFactor: undefined,
          trackStock: true,
          category: "",
          reorderPoint: 0,
          barcode: "",
          taxCategory: "",
          Status: "Active",
          vendors: [],
          branches: [],
        });
        setBranchDistribution([]);
      }
    }
  }, [isOpen, editingItem]);

  const loadData = async () => {
    const [unitsRes, vendorsRes, branchesRes] = await Promise.all([
      InventoryAPI.getUnits(),
      InventoryAPI.getVendors(),
      InventoryAPI.getBranches(),
    ]);

    if (unitsRes.success && unitsRes.data) setUnits(unitsRes.data);
    if (vendorsRes.success && vendorsRes.data) setVendors(vendorsRes.data);
    if (branchesRes.success && branchesRes.data) setBranches(branchesRes.data);
  };

  const handleSave = async () => {
    if (!formData.name || !formData.baseUnit) return;

    setLoading(true);
    await onSave({
      ...formData,
      branches: branchDistribution,
    });
    setLoading(false);
  };

  const handleFieldChange = (field: keyof InventoryItem, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleVendor = (vendorId: number) => {
    const currentVendors = formData.vendors || [];
    if (currentVendors.includes(vendorId)) {
      handleFieldChange("vendors", currentVendors.filter(id => id !== vendorId));
    } else {
      handleFieldChange("vendors", [...currentVendors, vendorId]);
    }
  };

  const handleAddNewVendor = async () => {
    if (!newVendor.Company_Name || !newVendor.Name) return;

    const response = await InventoryAPI.createVendor(newVendor);
    if (response.success) {
      setVendors([...vendors, response.data]);
      toggleVendor(response.data.ID);
      setNewVendor({ Company_Name: "", Name: "", Contact: "", Address: "", Email: "" });
      setIsAddingVendor(false);
    }
  };

  const addBranchDistribution = () => {
    if (branches.length === 0) return;
    const firstAvailableBranch = branches.find(
      b => !branchDistribution.some(bd => bd.branchId === b.ID)
    );
    if (firstAvailableBranch) {
      setBranchDistribution([...branchDistribution, { branchId: firstAvailableBranch.ID, quantity: 0 }]);
    }
  };

  const updateBranchQuantity = (branchId: number, quantity: number) => {
    setBranchDistribution(branchDistribution.map(bd =>
      bd.branchId === branchId ? { ...bd, quantity } : bd
    ));
  };

  const removeBranchDistribution = (branchId: number) => {
    setBranchDistribution(branchDistribution.filter(bd => bd.branchId !== branchId));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl h-[85vh] overflow-hidden bg-white border border-gray-200 text-gray-900 p-0 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 bg-white flex-shrink-0">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {editingItem ? "Edit Item" : "Add New Item"}
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              {editingItem ? "Update item details" : "Add a new item to your inventory"}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          <Tabs defaultValue="basic" className="w-full h-full">
            <TabsList className="grid w-full grid-cols-5 mb-6">
              <TabsTrigger value="basic">Basic</TabsTrigger>
              <TabsTrigger value="stock">Stock</TabsTrigger>
              <TabsTrigger value="vendors">Vendors</TabsTrigger>
              <TabsTrigger value="branches">Branches</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
            </TabsList>

            {/* Basic Info Tab */}
            <TabsContent value="basic" className="space-y-4">
              {/* Name */}
              <div>
                <Label className="text-gray-700 text-sm mb-2">
                  Item Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  value={formData.name}
                  onChange={(e) => handleFieldChange("name", e.target.value)}
                  placeholder="e.g., Chicken Breast"
                  className="bg-white border-gray-300 h-11"
                />
              </div>

              {/* SKU & Type */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-700 text-sm mb-2">SKU</Label>
                  <Input
                    value={formData.sku}
                    onChange={(e) => handleFieldChange("sku", e.target.value)}
                    placeholder="e.g., CHICK-BRST"
                    className="bg-white border-gray-300"
                  />
                </div>

                <div>
                  <Label className="text-gray-700 text-sm mb-2">
                    Type <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => handleFieldChange("type", value)}
                  >
                    <SelectTrigger className="bg-white border-gray-300">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="stock">Stock (Inventory tracked)</SelectItem>
                      <SelectItem value="service">Service (No inventory)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Category */}
              <div>
                <Label className="text-gray-700 text-sm mb-2">Category</Label>
                <div className="grid grid-cols-2 gap-4">
                  <Select
                    value={formData.category}
                    onValueChange={(value) => handleFieldChange("category", value)}
                  >
                    <SelectTrigger className="bg-white border-gray-300">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockCategories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    value={formData.category}
                    onChange={(e) => handleFieldChange("category", e.target.value)}
                    placeholder="Or type custom category"
                    className="bg-white border-gray-300"
                  />
                </div>
                <p className="text-gray-500 text-xs mt-1">
                  Select from dropdown or enter custom category
                </p>
              </div>

              {/* Active Status */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-gray-700 font-medium">Active Status</Label>
                    <p className="text-gray-500 text-xs mt-1">Enable this item for use</p>
                  </div>
                  <Switch
                    checked={formData.Status === "Active"}
                    onCheckedChange={(checked) => handleFieldChange("Status", checked ? "Active" : "Inactive")}
                  />
                </div>
              </div>
            </TabsContent>

            {/* Stock & Units Tab */}
            <TabsContent value="stock" className="space-y-4">
              {/* Track Stock */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-gray-700 font-medium">Track Stock</Label>
                    <p className="text-gray-500 text-xs mt-1">Monitor inventory levels for this item</p>
                  </div>
                  <Switch
                    checked={formData.trackStock}
                    onCheckedChange={(checked) => handleFieldChange("trackStock", checked)}
                  />
                </div>
              </div>

              {/* Base Unit */}
              <div>
                <Label className="text-gray-700 text-sm mb-2">
                  Base Unit <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.baseUnit}
                  onValueChange={(value) => handleFieldChange("baseUnit", value)}
                >
                  <SelectTrigger className="bg-white border-gray-300">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {units.length > 0 ? (
                      units.map((unit) => (
                        <SelectItem key={unit.ID} value={unit.symbol}>
                          {unit.name} ({unit.symbol})
                        </SelectItem>
                      ))
                    ) : (
                      <div className="px-2 py-4 text-center text-sm text-gray-500">
                        No units available. Add units first.
                      </div>
                    )}
                  </SelectContent>
                </Select>
                <p className="text-gray-500 text-xs mt-1">
                  Unit used in recipes and stock tracking
                </p>
              </div>

              {/* Purchase Unit & Conversion */}
              {formData.trackStock && (
                <>
                  <div>
                    <Label className="text-gray-700 text-sm mb-2">Purchase Unit (Optional)</Label>
                    <Select
                      value={formData.purchaseUnit}
                      onValueChange={(value) => handleFieldChange("purchaseUnit", value)}
                    >
                      <SelectTrigger className="bg-white border-gray-300">
                        <SelectValue placeholder="Select unit" />
                      </SelectTrigger>
                      <SelectContent>
                        {units.map((unit) => (
                          <SelectItem key={unit.ID} value={unit.symbol}>
                            {unit.name} ({unit.symbol})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-gray-500 text-xs mt-1">
                      Unit used when purchasing this item
                    </p>
                  </div>

                  {formData.purchaseUnit && formData.purchaseUnit !== formData.baseUnit && (
                    <div>
                      <Label className="text-gray-700 text-sm mb-2">
                        Conversion Factor (Purchase to Base)
                      </Label>
                      <Input
                        type="number"
                        step="any"
                        value={formData.conversionFactor || ""}
                        onChange={(e) =>
                          handleFieldChange("conversionFactor", parseFloat(e.target.value) || 0)
                        }
                        placeholder="e.g., 1000"
                        className="bg-white border-gray-300"
                      />
                      <p className="text-blue-600 text-xs mt-1">
                        1 {formData.purchaseUnit} = {formData.conversionFactor || "?"}{" "}
                        {formData.baseUnit}
                      </p>
                    </div>
                  )}

                  {/* Reorder Point */}
                  <div>
                    <Label className="text-gray-700 text-sm mb-2">Reorder Point</Label>
                    <Input
                      type="number"
                      value={formData.reorderPoint}
                      onChange={(e) => handleFieldChange("reorderPoint", parseInt(e.target.value) || 0)}
                      placeholder="0"
                      className="bg-white border-gray-300"
                    />
                    <p className="text-gray-500 text-xs mt-1">
                      Alert when stock falls below this level (in {formData.baseUnit})
                    </p>
                  </div>
                </>
              )}
            </TabsContent>

            {/* Vendors Tab */}
            <TabsContent value="vendors" className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <p className="text-blue-700 text-sm">
                  Select vendors/suppliers for this item. You can select multiple vendors.
                </p>
              </div>

              {/* Add New Vendor Section */}
              {isAddingVendor ? (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">Add New Vendor</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsAddingVendor(false)}
                      className="text-gray-600"
                    >
                      Cancel
                    </Button>
                  </div>

                  <div>
                    <Label className="text-sm">Company Name *</Label>
                    <Input
                      value={newVendor.Company_Name}
                      onChange={(e) => setNewVendor({ ...newVendor, Company_Name: e.target.value })}
                      placeholder="Enter company name"
                      className="bg-white"
                    />
                  </div>

                  <div>
                    <Label className="text-sm">Contact Person *</Label>
                    <Input
                      value={newVendor.Name}
                      onChange={(e) => setNewVendor({ ...newVendor, Name: e.target.value })}
                      placeholder="Enter contact name"
                      className="bg-white"
                    />
                  </div>

                  <div>
                    <Label className="text-sm">Contact Number</Label>
                    <Input
                      value={newVendor.Contact}
                      onChange={(e) => setNewVendor({ ...newVendor, Contact: e.target.value })}
                      placeholder="Enter phone number"
                      className="bg-white"
                    />
                  </div>

                  <div>
                    <Label className="text-sm">Email</Label>
                    <Input
                      value={newVendor.Email}
                      onChange={(e) => setNewVendor({ ...newVendor, Email: e.target.value })}
                      placeholder="Enter email"
                      className="bg-white"
                    />
                  </div>

                  <div>
                    <Label className="text-sm">Address</Label>
                    <Textarea
                      value={newVendor.Address}
                      onChange={(e) => setNewVendor({ ...newVendor, Address: e.target.value })}
                      placeholder="Enter business address"
                      className="bg-white h-20 resize-none"
                    />
                  </div>

                  <Button
                    onClick={handleAddNewVendor}
                    disabled={!newVendor.Company_Name || !newVendor.Name}
                    className="w-full bg-gray-900 hover:bg-black text-white"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Vendor
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={() => setIsAddingVendor(true)}
                  variant="outline"
                  className="w-full border-gray-300"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Vendor
                </Button>
              )}

              {/* Existing Vendors List */}
              <div className="space-y-2">
                <Label className="text-gray-700 font-medium">Select Vendors</Label>
                {vendors.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border border-gray-200">
                    No vendors available. Add a new vendor above.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-2">
                    {vendors.map((vendor) => (
                      <div
                        key={vendor.ID}
                        onClick={() => toggleVendor(vendor.ID)}
                        className={`p-4 border rounded-lg cursor-pointer transition-all ${
                          formData.vendors?.includes(vendor.ID)
                            ? "border-gray-900 bg-gray-50"
                            : "border-gray-200 bg-white hover:border-gray-300"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-semibold text-gray-900">{vendor.Company_Name}</div>
                            <div className="text-sm text-gray-600">{vendor.Name}</div>
                            <div className="text-xs text-gray-500">{vendor.Contact}</div>
                          </div>
                          <div className={`h-5 w-5 rounded border-2 flex items-center justify-center ${
                            formData.vendors?.includes(vendor.ID)
                              ? "border-gray-900 bg-gray-900"
                              : "border-gray-300"
                          }`}>
                            {formData.vendors?.includes(vendor.ID) && (
                              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Branches Tab */}
            <TabsContent value="branches" className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-blue-700" />
                  <p className="text-blue-700 text-sm">
                    Distribute inventory to specific branches. Specify quantity for each branch.
                  </p>
                </div>
              </div>

              <Button
                onClick={addBranchDistribution}
                variant="outline"
                className="w-full border-gray-300"
                disabled={branchDistribution.length >= branches.length}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Branch Distribution
              </Button>

              {/* Branch Distribution List */}
              <div className="space-y-3">
                {branchDistribution.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border border-gray-200">
                    No branch distribution set. Add branches above to distribute inventory.
                  </div>
                ) : (
                  branchDistribution.map((dist) => {
                    const branch = branches.find(b => b.ID === dist.branchId);
                    if (!branch) return null;

                    return (
                      <div key={dist.branchId} className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center gap-4">
                          <div className="flex-1">
                            <div className="font-semibold text-gray-900">{branch.name}</div>
                            <div className="text-sm text-gray-600">{branch.location}</div>
                          </div>

                          <div className="w-32">
                            <Label className="text-xs text-gray-600">Quantity</Label>
                            <Input
                              type="number"
                              value={dist.quantity}
                              onChange={(e) => updateBranchQuantity(dist.branchId, parseInt(e.target.value) || 0)}
                              placeholder="0"
                              className="bg-white border-gray-300 h-9"
                            />
                          </div>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeBranchDistribution(dist.branchId)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {branchDistribution.length > 0 && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-900">Total Distribution:</span>
                    <span className="text-2xl font-bold text-gray-900">
                      {branchDistribution.reduce((sum, dist) => sum + dist.quantity, 0)} {formData.baseUnit}
                    </span>
                  </div>
                </div>
              )}
            </TabsContent>

            {/* Advanced Tab */}
            <TabsContent value="advanced" className="space-y-4">
              {/* Barcode */}
              <div>
                <Label className="text-gray-700 text-sm mb-2">Barcode</Label>
                <Input
                  value={formData.barcode}
                  onChange={(e) => handleFieldChange("barcode", e.target.value)}
                  placeholder="Scan or enter barcode"
                  className="bg-white border-gray-300"
                />
              </div>

              {/* Tax Category */}
              <div>
                <Label className="text-gray-700 text-sm mb-2">Tax Category</Label>
                <Input
                  value={formData.taxCategory}
                  onChange={(e) => handleFieldChange("taxCategory", e.target.value)}
                  placeholder="e.g., food, beverage, taxable"
                  className="bg-white border-gray-300"
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-white flex justify-end gap-3 flex-shrink-0">
          <Button
            onClick={onClose}
            variant="outline"
            className="border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!formData.name || !formData.baseUnit || loading}
            className="bg-gray-900 hover:bg-black text-white"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                {editingItem ? "Update Item" : "Save Item"}
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
