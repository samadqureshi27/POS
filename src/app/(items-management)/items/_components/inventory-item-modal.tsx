"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { Save, Loader2, Plus, Trash2, Building2, ChevronDown, Package, Info } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogBody, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { CustomTooltip } from "@/components/ui/custom-tooltip";
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
  const [addingCategory, setAddingCategory] = useState(false);
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);

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

        // Set category input for new category creation (if needed)
        setCategoryInput("");
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
        setShowNewCategoryInput(false);
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

  const handleCategorySelect = (categoryId: string) => {
    handleFieldChange("categoryId", categoryId);
    setCategoryInput(""); // Clear input when selecting existing category
    setShowNewCategoryInput(false); // Hide input when selecting existing category
  };

  const handleAddCategory = async () => {
    const categoryName = categoryInput.trim();
    if (!categoryName) {
      // Show input field if not already shown
      setShowNewCategoryInput(true);
      return;
    }

    setAddingCategory(true);
    try {
      const response = await CategoriesService.createCategory({
        name: categoryName,
        isActive: true,
      });

      if (response.success && response.data) {
        setCategories([...categories, response.data]);
        const newCategoryId = response.data._id || response.data.id || "";
        handleFieldChange("categoryId", newCategoryId);
        setCategoryInput(""); // Clear input after successful creation
        setShowNewCategoryInput(false); // Hide input after successful creation
        toast.success("Category created successfully");
      } else {
        toast.error(response.message || "Failed to create category");
      }
    } catch (error) {
      console.error("Error creating category:", error);
      toast.error("Failed to create category. Please try again.");
    }
    setAddingCategory(false);
  };

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
      <DialogContent 
        size="3xl" 
        fullHeight 
        onInteractOutside={(e) => e.preventDefault()} 
        onEscapeKeyDown={(e) => e.preventDefault()}
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-xl">
            {editingItem ? "Edit Inventory Item" : "Add New Inventory Item"}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="basic">
          <div className="px-8 pb-4 pt-2 flex-shrink-0">
            <TabsList className={`grid w-full ${isEditMode ? 'grid-cols-5' : 'grid-cols-2'}`}>
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
          </div>

          <DialogBody className="space-y-8">
            {/* Basic Info Tab */}
            <TabsContent value="basic" className="mt-0 space-y-8">
              {/* Name */}
              <div>
                <Label className="text-sm font-medium text-[#656565] mb-1.5">
                  Item Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  value={formData.name}
                  onChange={(e) => handleFieldChange("name", e.target.value)}
                  placeholder="e.g., Chicken Breast"
                  className="mt-1.5"
                />
              </div>

              {/* SKU & Type */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <Label className="text-sm font-medium text-[#656565]">SKU / Product Code</Label>
                    <CustomTooltip label="Auto-generated unique identifier" direction="right">
                      <Info className="h-4 w-4 text-gray-400 cursor-pointer" />
                    </CustomTooltip>
                  </div>
                  <Input
                    value={formData.sku}
                    readOnly
                    placeholder="Auto-generated by system"
                    className="mt-1.5 bg-gray-50 cursor-not-allowed text-gray-600"
                  />
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <Label className="text-sm font-medium text-[#656565]">
                      Item Type <span className="text-red-500">*</span>
                    </Label>
                    <CustomTooltip label="Stock items track quantity, Service items do not" direction="right">
                      <Info className="h-4 w-4 text-gray-400 cursor-pointer" />
                    </CustomTooltip>
                  </div>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => handleFieldChange("type", value)}
                  >
                    <SelectTrigger className="mt-1.5">
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
                <div className="flex items-center gap-2 mb-1.5">
                  <Label className="text-sm font-medium text-[#656565]">Category</Label>
                  <CustomTooltip label="Select a category or create a new one using the + button" direction="right">
                    <Info className="h-4 w-4 text-gray-400 cursor-pointer" />
                  </CustomTooltip>
                </div>
                <div className="grid grid-cols-[1fr_auto] gap-2 mt-1.5">
                  <Select
                    value={formData.categoryId || ""}
                    onValueChange={handleCategorySelect}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.length > 0 ? (
                        categories.map((cat) => (
                          <SelectItem key={cat._id || cat.id} value={cat._id || cat.id || ""}>
                            {cat.name}
                          </SelectItem>
                        ))
                      ) : (
                        <div className="px-2 py-4 text-center text-sm text-gray-500">
                          No categories available. Create one using the + button.
                        </div>
                      )}
                    </SelectContent>
                  </Select>

                  <Button
                    type="button"
                    onClick={handleAddCategory}
                    disabled={addingCategory}
                    variant="outline"
                    className="h-14 border-gray-300"
                    title="Add new category"
                  >
                    {addingCategory ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Plus className="h-5 w-5 stroke-[1.5]" />
                    )}
                  </Button>
                </div>
                {/* Input for creating new category - shown when + button is clicked */}
                {showNewCategoryInput && (
                  <Input
                    value={categoryInput}
                    onChange={(e) => setCategoryInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && categoryInput.trim()) {
                        handleAddCategory();
                      } else if (e.key === 'Escape') {
                        setShowNewCategoryInput(false);
                        setCategoryInput("");
                      }
                    }}
                    placeholder="Enter new category name and press Enter or click +"
                    className="mt-2"
                    autoFocus
                  />
                )}
              </div>

              {/* Active Status */}
              <div className="w-full">
                <div className="flex items-center justify-between rounded-sm border border-[#d4d7dd] bg-[#f8f8fa] px-4 py-3 w-full">
                  <span className="text-[#1f2937] text-sm font-medium">Active</span>
                  <Switch
                    checked={formData.isActive === true}
                    onCheckedChange={(checked) => handleFieldChange("isActive", checked)}
                  />
                </div>
              </div>
            </TabsContent>

            {/* Stock & Units Tab */}
            <TabsContent value="stock" className="mt-0 space-y-8">
              {/* Row 1: Quantity and Low Stock Threshold - Show for stock items */}
              {(formData.type === "stock" || formData.trackStock) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Quantity */}
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <Label className="text-sm font-medium text-[#656565]">
                        Quantity
                      </Label>
                      <CustomTooltip label="Current stock quantity in base unit" direction="right">
                        <Info className="h-4 w-4 text-gray-400 cursor-pointer" />
                      </CustomTooltip>
                    </div>
                    <Input
                      type="number"
                      value={formData.quantity === 0 ? "" : formData.quantity || ""}
                      onChange={(e) => {
                        const val = e.target.value;
                        handleFieldChange("quantity", val === '' ? 0 : parseFloat(val) || 0);
                      }}
                      onFocus={(e) => e.target.select()}
                      placeholder="0"
                      className="mt-1.5"
                    />
                  </div>

                  {/* Threshold (Reorder Point) */}
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <Label className="text-sm font-medium text-[#656565]">
                        Low Stock Threshold
                      </Label>
                      <CustomTooltip label={`Alert when stock falls below this level (in ${formData.baseUnit})`} direction="right">
                        <Info className="h-4 w-4 text-gray-400 cursor-pointer" />
                      </CustomTooltip>
                    </div>
                    <Input
                      type="number"
                      value={formData.reorderPoint === 0 ? "" : formData.reorderPoint || ""}
                      onChange={(e) => {
                        const val = e.target.value;
                        handleFieldChange("reorderPoint", val === '' ? 0 : parseInt(val) || 0);
                      }}
                      onFocus={(e) => e.target.select()}
                      placeholder="0"
                      className="mt-1.5"
                    />
                  </div>
                </div>
              )}

              {/* Row 2: Base Unit and Purchase Unit */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Base Unit - Always visible */}
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <Label className="text-sm font-medium text-[#656565]">
                      Base Unit of Measurement <span className="text-red-500">*</span>
                    </Label>
                    <CustomTooltip label="Standard unit for recipes, stock tracking, and reporting" direction="right">
                      <Info className="h-4 w-4 text-gray-400 cursor-pointer" />
                    </CustomTooltip>
                  </div>
                  <Select
                    value={formData.baseUnit}
                    onValueChange={(value) => handleFieldChange("baseUnit", value)}
                  >
                    <SelectTrigger className="mt-1.5">
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
                </div>

                {/* Purchase Unit - Show for stock items */}
                {(formData.type === "stock" || formData.trackStock) && (
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <Label className="text-sm font-medium text-[#656565]">Purchase Unit (Optional)</Label>
                      <CustomTooltip label="Unit used when ordering from suppliers (e.g., buy in kg, use in g)" direction="right">
                        <Info className="h-4 w-4 text-gray-400 cursor-pointer" />
                      </CustomTooltip>
                    </div>
                    <Select
                      value={formData.purchaseUnit}
                      onValueChange={(value) => handleFieldChange("purchaseUnit", value)}
                    >
                      <SelectTrigger className="mt-1.5">
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
                  </div>
                )}
              </div>

              {/* Conversion Factor - Show when purchase unit differs from base unit */}
              {(formData.type === "stock" || formData.trackStock) && formData.purchaseUnit && formData.purchaseUnit !== formData.baseUnit && (
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <Label className="text-sm font-medium text-[#656565]">
                      Conversion Factor <span className="text-red-500">*</span>
                    </Label>
                    <CustomTooltip label={`Conversion: 1 ${formData.purchaseUnit} = ${formData.conversion || "?"} ${formData.baseUnit}. Example: If buying in kg but using in g, factor is 1000`} direction="right">
                      <Info className="h-4 w-4 text-gray-400 cursor-pointer" />
                    </CustomTooltip>
                  </div>
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
                    className="mt-1.5"
                  />
                </div>
              )}
            </TabsContent>

            {/* Vendors Tab (Edit Mode Only) */}
            {isEditMode && (
              <TabsContent value="vendors" className="mt-0 space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-sm p-6 text-center">
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
                <div className="bg-blue-50 border border-blue-200 rounded-sm p-6 text-center">
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
                <div className="bg-blue-50 border border-blue-200 rounded-sm p-6 text-center">
                  <p className="text-blue-800 text-lg font-semibold mb-2">
                    🚀 Coming in Version 2
                  </p>
                  <p className="text-blue-700 text-sm">
                    Advanced features like Barcode/UPC scanning and Tax Category management will be available in the next version for enhanced inventory control and tax reporting.
                  </p>
                </div>
              </TabsContent>
            )}
          </DialogBody>
        </Tabs>

        <DialogFooter>
          <Button
            type="button"
            onClick={handleSave}
            disabled={!formData.name || !formData.baseUnit || loading}
            className="bg-black hover:bg-gray-800 text-white px-8 h-11"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                {editingItem ? "Update" : "Submit"}
              </>
            )}
          </Button>
          <Button
            onClick={onClose}
            variant="outline"
            className="px-8 h-11 border-gray-300"
            disabled={loading}
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
