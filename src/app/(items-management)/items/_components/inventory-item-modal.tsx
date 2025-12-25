"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { Save, Loader2, Plus, Trash2, Building2, ChevronDown, Package } from "lucide-react";
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
    // trackStock: Let backend set default based on item type (stock items default to true)
    categoryId: "",
    quantity: 0,
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
        // Extract category ID if it's a populated object
        const categoryIdValue = typeof editingItem.categoryId === 'object' && editingItem.categoryId?._id
          ? editingItem.categoryId._id
          : editingItem.categoryId;

        setFormData({
          name: editingItem.name,
          sku: editingItem.sku,
          type: editingItem.type,
          baseUnit: editingItem.baseUnit,
          purchaseUnit: editingItem.purchaseUnit,
          conversion: editingItem.conversion,
          trackStock: editingItem.trackStock,
          categoryId: typeof categoryIdValue === 'string' ? categoryIdValue : '',
          quantity: editingItem.quantity,
          reorderPoint: editingItem.reorderPoint,
          barcode: editingItem.barcode,
          taxCategory: editingItem.taxCategory,
          isActive: editingItem.isActive ?? true,
        });

        // Set category name for display
        const categoryName = typeof editingItem.categoryId === 'object' && editingItem.categoryId?.name
          ? editingItem.categoryId.name
          : categories.find(c => (c._id || c.id) === categoryIdValue)?.name || '';
        setCategoryInput(categoryName);
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
          // trackStock: Let backend set default based on item type
          categoryId: "",
          quantity: 0,
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
    // Load units from static service
    const [unitsRes, categoriesRes] = await Promise.all([
      UnitsService.listUnits(),
      CategoriesService.listCategories({ limit: 1000 }),
    ]);


    if (unitsRes.success && unitsRes.data) {
      setUnits(unitsRes.data);
    } else {
      console.error('Failed to load units:', unitsRes.message);
    }

    if (categoriesRes.success && categoriesRes.data) setCategories(categoriesRes.data);

    // Load from MOCK API (not yet connected to backend)
    const [vendorsRes, branchesRes] = await Promise.all([
      InventoryAPI.getVendors(),      InventoryAPI.getBranches(),
    ]);

    if (vendorsRes.success && vendorsRes.data) setVendors(vendorsRes.data);
    if (branchesRes.success && branchesRes.data) setBranches(branchesRes.data);
    if (categoriesRes.success && categoriesRes.data) setCategories(categoriesRes.data);
  };

  const handleSave = async (e?: React.MouseEvent) => {
    // Prevent any default behavior
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (!formData.name || !formData.baseUnit) return;

    // For stock items, ensure purchaseUnit and conversion are set
    const submitData = { ...formData };

    // Don't send trackStock for new items - let backend set default
    // Only send if explicitly set and different from default
    if (!editingItem && submitData.trackStock === undefined) {
      delete submitData.trackStock;
    }

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
        toast.error("Conversion rate is required when purchase unit differs from base unit");
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
        toast.error(response.message || "Failed to create category");
      }
    } catch (error) {
      console.error("Error creating category:", error);
      toast.error("Failed to create category. Please try again.");
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
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent size="3xl" fullHeight onInteractOutside={(e) => e.preventDefault()} onEscapeKeyDown={(e) => e.preventDefault()}>
        {/* Header */}
        <div className="p-5 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5 text-gray-700" />
            <DialogTitle className="text-xl font-bold text-gray-900">
              {editingItem ? "Edit Inventory Item" : "Add New Inventory Item"}
            </DialogTitle>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            {editingItem ? "Update item details and manage vendors & distribution" : "Create a new inventory item with basic information"}
          </p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex flex-col min-h-0">
          <Tabs defaultValue="basic" className="flex-1 flex flex-col min-h-0">
            {/* Tab List */}
            <div className="px-5 pt-3 pb-3 border-b border-gray-100 flex-shrink-0">
              <div className="flex flex-col gap-2">
                <div className="flex justify-center">
                  <TabsList className={`grid w-full max-w-2xl ${isEditMode ? 'grid-cols-5' : 'grid-cols-2'} h-9`}>
                    <TabsTrigger value="basic" className="text-sm">Basic Info</TabsTrigger>
                    <TabsTrigger value="stock" className="text-sm">Stock & Units</TabsTrigger>
                    {isEditMode && (
                      <>
                        <TabsTrigger value="vendors" className="text-sm">Vendors</TabsTrigger>
                        <TabsTrigger value="branches" className="text-sm">Branches</TabsTrigger>
                        <TabsTrigger value="advanced" className="text-sm">Advanced</TabsTrigger>
                      </>
                    )}
                  </TabsList>
                </div>
                <p className="text-xs text-gray-600 text-center">
                  {!isEditMode && "💡 Add basic info first. Vendors & distribution available after saving."}
                </p>
              </div>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto p-5 min-h-0">

            {/* Basic Info Tab */}
            <TabsContent value="basic" className="mt-0 space-y-4">
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
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-[100] max-h-48 overflow-y-auto">
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
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow duration-200">
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
            <TabsContent value="stock" className="mt-0 space-y-4">

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
                        <SelectItem key={unit._id || unit.id || unit.symbol} value={unit.symbol}>
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

              {/* Purchase Unit & Conversion - Show for stock items by default */}
              {(formData.type === "stock" || formData.trackStock) && (
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
                          <SelectItem key={unit._id || unit.id || unit.symbol} value={unit.symbol}>
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
                        value={formData.conversion === 0 ? "" : formData.conversion || ""}
                        onChange={(e) => {
                          const val = e.target.value;
                          handleFieldChange("conversion", val === '' ? 0 : parseFloat(val) || 0);
                        }}
                        onFocus={(e) => e.target.select()}
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
                      value={formData.reorderPoint === 0 ? "" : formData.reorderPoint || ""}
                      onChange={(e) => {
                        const val = e.target.value;
                        handleFieldChange("reorderPoint", val === '' ? 0 : parseInt(val) || 0);
                      }}
                      onFocus={(e) => e.target.select()}
                      placeholder="0"
                      className="bg-white border-gray-300 h-9 rounded-md"
                    />
                    <p className="text-gray-500 text-xs mt-1">
                      Alert when stock falls below this level (in {formData.baseUnit})
                    </p>
                  </div>
                </>
              )}
            </TabsContent>

            {/* Vendors Tab (Edit Mode Only) */}
            {isEditMode && (
              <TabsContent value="vendors" className="mt-0 space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
                  <p className="text-blue-800 text-lg font-semibold mb-2">
                    🚀 Coming in Version 2
                  </p>
                  <p className="text-blue-700 text-sm">
                    Vendor management feature will be available in the next version. You'll be able to manage suppliers for this item and select multiple vendors for better sourcing options.
                  </p>
                </div>
              </TabsContent>
            )}

            {/* Branches Tab (Edit Mode Only) */}
            {isEditMode && (
              <TabsContent value="branches" className="mt-0 space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Building2 className="h-6 w-6 text-blue-700" />
                    <p className="text-blue-800 text-lg font-semibold">
                      🚀 Coming in Version 2
                    </p>
                  </div>
                  <p className="text-blue-700 text-sm">
                    Branch distribution feature will be available in the next version. You'll be able to distribute inventory to specific branches and specify quantity for each location.
                  </p>
                </div>
              </TabsContent>
            )}

            {/* Advanced Tab (Edit Mode Only) */}
            {isEditMode && (
              <TabsContent value="advanced" className="mt-0 space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
                  <p className="text-blue-800 text-lg font-semibold mb-2">
                    🚀 Coming in Version 2
                  </p>
                  <p className="text-blue-700 text-sm">
                    Advanced features like Barcode/UPC scanning and Tax Category management will be available in the next version for enhanced inventory control and tax reporting.
                  </p>
                </div>
              </TabsContent>
            )}
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
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            disabled={!formData.name || !formData.baseUnit || loading}
            size="sm"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white h-9"
          >
            {loading ? (
              <>
                <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                {editingItem ? "Update Item" : "Save & Close"}
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
