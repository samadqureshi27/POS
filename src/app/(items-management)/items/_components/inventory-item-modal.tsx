"use client";

import React, { useState, useEffect } from "react";
import { Save, Loader2, Plus, Trash2, Building2, ChevronDown } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { InventoryService, UnitsService, type InventoryItem, type Unit } from "@/lib/services/inventory-service";
import { CategoriesService, type Category } from "@/lib/services/categories-service";
import { InventoryAPI, type Vendor, type Branch } from "@/lib/util/inventoryApi";

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
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [categoryInput, setCategoryInput] = useState("");
  const [showCategorySuggestions, setShowCategorySuggestions] = useState(false);
  const [addingCategory, setAddingCategory] = useState(false);

  const [formData, setFormData] = useState<Partial<InventoryItem>>({
    name: "",
    sku: "",
    type: "stock",
    baseUnit: "pc",
    purchaseUnit: "",
    conversion: undefined,
    trackStock: true,
    categoryId: "",
    reorderPoint: 0,
    barcode: "",
    taxCategory: "",
    isActive: true,
  });

  // Vendor modal state (NOT YET CONNECTED TO BACKEND API)
  const [isAddingVendor, setIsAddingVendor] = useState(false);
  const [newVendor, setNewVendor] = useState({
    Company_Name: "",
    Name: "",
    Contact: "",
    Address: "",
    Email: "",
  });
  const [selectedVendors, setSelectedVendors] = useState<number[]>([]);

  // Branch distribution state (NOT YET CONNECTED TO BACKEND API)
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
          conversion: editingItem.conversion,
          trackStock: editingItem.trackStock,
          categoryId: editingItem.categoryId,
          reorderPoint: editingItem.reorderPoint,
          barcode: editingItem.barcode,
          taxCategory: editingItem.taxCategory,
          isActive: editingItem.isActive ?? true,
        });
        // Find category name from ID for display
        const category = categories.find(c => (c._id || c.id) === editingItem.categoryId);
        setCategoryInput(category?.name || editingItem.categoryId || "");
        // Load vendors and branches from mock API (not yet in backend)
        setSelectedVendors([]);
        setBranchDistribution([]);
      } else {
        // Reset form for new item
        setFormData({
          name: "",
          sku: "",
          type: "stock",
          baseUnit: "pc",
          purchaseUnit: "",
          conversion: undefined,
          trackStock: true,
          categoryId: "",
          reorderPoint: 0,
          barcode: "",
          taxCategory: "",
          isActive: true,
        });
        setCategoryInput("");
        setSelectedVendors([]);
        setBranchDistribution([]);
      }
    }
  }, [isOpen, editingItem]);

  const loadData = async () => {
    // Load from REAL API
    const [unitsRes, categoriesRes] = await Promise.all([
      UnitsService.listUnits(),
      CategoriesService.listCategories({ limit: 1000 }),
    ]);

    console.log('Units Response:', unitsRes);
    console.log('Categories Response:', categoriesRes);

    if (unitsRes.success && unitsRes.data) {
      console.log('Setting units:', unitsRes.data);
      setUnits(unitsRes.data);
    } else {
      console.error('Failed to load units:', unitsRes.message);
    }

    if (categoriesRes.success && categoriesRes.data) setCategories(categoriesRes.data);

    // Load from MOCK API (not yet connected to backend)
    const [vendorsRes, branchesRes] = await Promise.all([
      InventoryAPI.getVendors(),
      InventoryAPI.getBranches(),
    ]);

    if (vendorsRes.success && vendorsRes.data) setVendors(vendorsRes.data);
    if (branchesRes.success && branchesRes.data) setBranches(branchesRes.data);
  };

  const handleSave = async () => {
    if (!formData.name || !formData.baseUnit) return;

    // For stock items, ensure purchaseUnit and conversion are set
    const submitData = { ...formData };
    if (submitData.type === "stock") {
      // If no purchaseUnit set, use baseUnit (no conversion needed)
      if (!submitData.purchaseUnit) {
        submitData.purchaseUnit = submitData.baseUnit;
      }
      // If purchaseUnit same as baseUnit, conversion should be 1
      if (submitData.purchaseUnit === submitData.baseUnit) {
        submitData.conversion = 1;
      }
      // If purchaseUnit differs but no conversion set, show error
      if (submitData.purchaseUnit !== submitData.baseUnit && !submitData.conversion) {
        alert("Conversion rate is required when purchase unit differs from base unit");
        setLoading(false);
        return;
      }
    }

    setLoading(true);
    await onSave(submitData);
    setLoading(false);
  };

  const handleFieldChange = (field: keyof InventoryItem, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCategoryInputChange = (value: string) => {
    setCategoryInput(value);
    // Don't set categoryId until user selects or creates a category
    setShowCategorySuggestions(value.length > 0);
  };

  const selectCategory = (category: Category) => {
    setCategoryInput(category.name);
    handleFieldChange("categoryId", category._id || category.id || "");
    setShowCategorySuggestions(false);
  };

  const handleAddCategory = async () => {
    if (!categoryInput.trim()) return;

    setAddingCategory(true);
    try {
      const response = await CategoriesService.createCategory({
        name: categoryInput,
        isActive: true,
      });

      if (response.success && response.data) {
        setCategories([...categories, response.data]);
        const newCategoryId = response.data._id || response.data.id || "";
        // Keep showing the category name in the input, but store the ID
        setCategoryInput(response.data.name);
        handleFieldChange("categoryId", newCategoryId);
        setShowCategorySuggestions(false);
      } else {
        alert(response.message || "Failed to create category");
      }
    } catch (error) {
      console.error("Error creating category:", error);
      alert("Failed to create category. Please try again.");
    }
    setAddingCategory(false);
  };

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(categoryInput.toLowerCase())
  );

  const toggleVendor = (vendorId: number) => {
    if (selectedVendors.includes(vendorId)) {
      setSelectedVendors(selectedVendors.filter(id => id !== vendorId));
    } else {
      setSelectedVendors([...selectedVendors, vendorId]);
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

  // Determine which tabs to show
  const isEditMode = !!editingItem;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl h-[85vh] overflow-hidden bg-white border border-gray-200 text-gray-900 p-0 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 bg-white flex-shrink-0">
          <DialogTitle className="text-2xl font-bold text-gray-900">
            {editingItem ? "Edit Item" : "Add New Item"}
          </DialogTitle>
          <p className="text-gray-600 text-sm mt-1">
            {editingItem ? "Update item details and manage vendors & distribution" : "Create a new inventory item with basic information"}
          </p>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto flex-1">
          <Tabs defaultValue="basic" className="w-full h-full">
            <TabsList className={`grid w-full ${isEditMode ? 'grid-cols-5' : 'grid-cols-2'} mb-2`}>
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="stock">Stock & Units</TabsTrigger>
              {isEditMode && (
                <>
                  <TabsTrigger value="vendors">Vendors</TabsTrigger>
                  <TabsTrigger value="branches">Branches</TabsTrigger>
                  <TabsTrigger value="advanced">Advanced</TabsTrigger>
                </>
              )}
            </TabsList>

            {/* Basic Info Tab */}
            <TabsContent value="basic" className="space-y-4">
              {/* Name */}
              <div>
                <Label className="text-gray-700 text-sm font-medium mb-2">
                  Item Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  value={formData.name}
                  onChange={(e) => handleFieldChange("name", e.target.value)}
                  placeholder="e.g., Chicken Breast"
                  className="bg-white border-gray-300 h-9 rounded-md"
                />
              </div>

              {/* SKU & Type */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-700 text-sm font-medium mb-2">SKU / Product Code</Label>
                  <Input
                    value={formData.sku}
                    readOnly
                    placeholder="Auto-generated by system"
                    className="bg-gray-50 border-gray-300 h-9 rounded-md cursor-not-allowed text-gray-600"
                  />
                  <p className="text-gray-500 text-xs mt-1">Auto-generated unique identifier</p>
                </div>

                <div>
                  <Label className="text-gray-700 text-sm font-medium mb-2">
                    Item Type <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => handleFieldChange("type", value)}
                  >
                    <SelectTrigger className="bg-white border-gray-300 h-9 rounded-md">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="stock">Stock (Inventory tracked)</SelectItem>
                      <SelectItem value="service">Service (No inventory)</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-gray-500 text-xs mt-1">Stock items track quantity</p>
                </div>
              </div>

              {/* Category with Autocomplete */}
              <div>
                <Label className="text-gray-700 text-sm font-medium mb-2">Category</Label>
                <div className="grid grid-cols-[1fr_auto_auto] gap-2 relative">
                  <div className="relative col-span-2">
                    <Input
                      value={categoryInput}
                      onChange={(e) => handleCategoryInputChange(e.target.value)}
                      onFocus={() => setShowCategorySuggestions(categoryInput.length > 0)}
                      onBlur={() => setTimeout(() => setShowCategorySuggestions(false), 200)}
                      placeholder="Type or select category"
                      className="bg-white border-gray-300 pr-10 h-9 rounded-md w-full"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCategorySuggestions(!showCategorySuggestions)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <ChevronDown className="h-4 w-4" />
                    </button>

                    {/* Category Suggestions Dropdown */}
                    {showCategorySuggestions && filteredCategories.length > 0 && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-48 overflow-y-auto">
                        {filteredCategories.map((cat) => (
                          <button
                            key={cat._id || cat.id}
                            type="button"
                            onClick={() => selectCategory(cat)}
                            className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm text-gray-700 capitalize"
                          >
                            {cat.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <Button
                    type="button"
                    onClick={handleAddCategory}
                    disabled={!categoryInput.trim() || addingCategory}
                    className="bg-gray-900 hover:bg-black text-white"
                  >
                    {addingCategory ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Plus className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <p className="text-gray-500 text-xs mt-1">
                  Type to search or add new category • Click + to save custom category
                </p>
              </div>

              {/* Active Status */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-gray-700 font-medium">Active Status</Label>
                    <p className="text-gray-500 text-xs mt-1">Enable this item for use in operations</p>
                  </div>
                  <Switch
                    checked={formData.isActive === true}
                    onCheckedChange={(checked) => handleFieldChange("isActive", checked)}
                  />
                </div>
              </div>
            </TabsContent>

            {/* Stock & Units Tab */}
            <TabsContent value="stock" className="space-y-4">

              {/* Base Unit */}
              <div>
                <Label className="text-gray-700 text-sm font-medium mb-2">
                  Base Unit of Measurement <span className="text-red-500">*</span>
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
                        <SelectItem key={unit._id || unit.id} value={unit.symbol}>
                          {unit.name} ({unit.symbol}) - {unit.type}
                        </SelectItem>
                      ))
                    ) : (
                      <div className="px-2 py-4 text-center text-sm text-gray-500">
                        No units available. Add units from Units button first.
                      </div>
                    )}
                  </SelectContent>
                </Select>
                <p className="text-gray-500 text-xs mt-1">
                  Standard unit for recipes, stock tracking, and reporting
                </p>
              </div>

              {/* Purchase Unit & Conversion */}
              {formData.trackStock && (
                <>
                  <div>
                    <Label className="text-gray-700 text-sm font-medium mb-2">Purchase Unit (Optional)</Label>
                    <Select
                      value={formData.purchaseUnit}
                      onValueChange={(value) => handleFieldChange("purchaseUnit", value)}
                    >
                      <SelectTrigger className="bg-white border-gray-300">
                        <SelectValue placeholder="Same as base unit" />
                      </SelectTrigger>
                      <SelectContent>
                        {units.map((unit) => (
                          <SelectItem key={unit._id || unit.id} value={unit.symbol}>
                            {unit.name} ({unit.symbol})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-gray-500 text-xs mt-1">
                      Unit used when ordering from suppliers (e.g., buy in kg, use in g)
                    </p>
                  </div>

                  {formData.purchaseUnit && formData.purchaseUnit !== formData.baseUnit && (
                    <div>
                      <Label className="text-gray-700 text-sm font-medium mb-2">
                        Conversion Factor <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        type="number"
                        step="any"
                        value={formData.conversion || ""}
                        onChange={(e) =>
                          handleFieldChange("conversion", parseFloat(e.target.value) || 0)
                        }
                        placeholder="e.g., 1000"
                        className="bg-white border-gray-300"
                      />
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-2">
                        <p className="text-blue-700 text-sm font-medium">
                          Conversion: 1 {formData.purchaseUnit} = {formData.conversion || "?"}{" "}
                          {formData.baseUnit}
                        </p>
                        <p className="text-blue-600 text-xs mt-1">
                          Example: If buying in kg but using in g, factor is 1000
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Threshold (Reorder Point) */}
                  <div>
                    <Label className="text-gray-700 text-sm font-medium mb-2">
                      Low Stock Threshold
                    </Label>
                    <Input
                      type="number"
                      value={formData.reorderPoint}
                      onChange={(e) => handleFieldChange("reorderPoint", parseInt(e.target.value) || 0)}
                      placeholder="0"
                      className="bg-white border-gray-300 h-9 rounded-md"
                    />
                    <p className="text-gray-500 text-xs mt-1">
                      Alert when stock falls below this level (in {formData.baseUnit})
                    </p>
                  </div>
                </>
              )}
              {/* Track Stock */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-gray-700 font-medium">Track Stock Levels</Label>
                    <p className="text-gray-500 text-xs mt-1">Monitor and manage inventory quantities</p>
                  </div>
                  <Switch
                    checked={formData.trackStock}
                    onCheckedChange={(checked) => handleFieldChange("trackStock", checked)}
                  />
                </div>
              </div>
            </TabsContent>

            {/* Vendors Tab (Edit Mode Only) */}
            {isEditMode && (
              <TabsContent value="vendors" className="space-y-4">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                  <p className="text-yellow-800 text-sm font-medium">
                    ⚠️ Note: Vendor management not yet connected to backend API (using mock data)
                  </p>
                  <p className="text-yellow-700 text-sm mt-1">
                    Manage suppliers for this item. You can select multiple vendors for better sourcing options.
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
                      <Label className="text-sm font-medium">Company Name *</Label>
                      <Input
                        value={newVendor.Company_Name}
                        onChange={(e) => setNewVendor({ ...newVendor, Company_Name: e.target.value })}
                        placeholder="Enter company name"
                        className="bg-white"
                      />
                    </div>

                    <div>
                      <Label className="text-sm font-medium">Contact Person *</Label>
                      <Input
                        value={newVendor.Name}
                        onChange={(e) => setNewVendor({ ...newVendor, Name: e.target.value })}
                        placeholder="Enter contact name"
                        className="bg-white"
                      />
                    </div>

                    <div>
                      <Label className="text-sm font-medium">Contact Number</Label>
                      <Input
                        value={newVendor.Contact}
                        onChange={(e) => setNewVendor({ ...newVendor, Contact: e.target.value })}
                        placeholder="Enter phone number"
                        className="bg-white"
                      />
                    </div>

                    <div>
                      <Label className="text-sm font-medium">Email</Label>
                      <Input
                        value={newVendor.Email}
                        onChange={(e) => setNewVendor({ ...newVendor, Email: e.target.value })}
                        placeholder="Enter email"
                        className="bg-white"
                      />
                    </div>

                    <div>
                      <Label className="text-sm font-medium">Address</Label>
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
                            selectedVendors.includes(vendor.ID)
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
                              selectedVendors.includes(vendor.ID)
                                ? "border-gray-900 bg-gray-900"
                                : "border-gray-300"
                            }`}>
                              {selectedVendors.includes(vendor.ID) && (
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
            )}

            {/* Branches Tab (Edit Mode Only) */}
            {isEditMode && (
              <TabsContent value="branches" className="space-y-4">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                  <p className="text-yellow-800 text-sm font-medium">
                    ⚠️ Note: Branch distribution not yet connected to backend API (using mock data)
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <Building2 className="h-5 w-5 text-yellow-700" />
                    <p className="text-yellow-700 text-sm">
                      Distribute inventory to specific branches. Specify quantity for each location.
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
            )}

            {/* Advanced Tab (Edit Mode Only) */}
            {isEditMode && (
              <TabsContent value="advanced" className="space-y-4">
                {/* Barcode */}
                <div>
                  <Label className="text-gray-700 text-sm font-medium mb-2">Barcode / UPC</Label>
                  <Input
                    value={formData.barcode}
                    onChange={(e) => handleFieldChange("barcode", e.target.value)}
                    placeholder="Scan or enter barcode"
                    className="bg-white border-gray-300"
                  />
                  <p className="text-gray-500 text-xs mt-1">
                    Use barcode scanner or enter manually
                  </p>
                </div>

                {/* Tax Category */}
                <div>
                  <Label className="text-gray-700 text-sm font-medium mb-2">Tax Category</Label>
                  <Input
                    value={formData.taxCategory}
                    onChange={(e) => handleFieldChange("taxCategory", e.target.value)}
                    placeholder="e.g., food, beverage, taxable, exempt"
                    className="bg-white border-gray-300"
                  />
                  <p className="text-gray-500 text-xs mt-1">
                    Used for tax calculations and reporting
                  </p>
                </div>
              </TabsContent>
            )}
          </Tabs>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-white flex justify-between items-center flex-shrink-0">
          <div className="text-sm text-gray-600">
            {!isEditMode && (
              <p>💡 Add basic info first. Vendors & distribution available after saving.</p>
            )}
          </div>
          <div className="flex gap-3">
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
                  {editingItem ? "Update Item" : "Create Item"}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
