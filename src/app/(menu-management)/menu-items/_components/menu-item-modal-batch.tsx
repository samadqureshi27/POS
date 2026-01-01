"use client";

import React, { useState, useEffect } from "react";
import { Loader2, Plus, X, Search, UtensilsCrossed, BookOpen, ChefHat, Package, Info, ChevronDown, ChevronUp } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogBody, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { CustomTooltip } from "@/components/ui/custom-tooltip";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { MenuCategoryService } from "@/lib/services/menu-category-service";
import { MenuItemService, TenantMenuItem } from "@/lib/services/menu-item-service";
import { RecipeService } from "@/lib/services/recipe-service";
import { MenuVariationsService } from "@/lib/services/menu-variations-service";
import { logError } from "@/lib/util/logger";

// Interfaces
interface MenuItemFormData {
  id: string; // Temporary ID for tracking
  name: string;
  description: string;
  recipeId?: string;
  recipeName?: string;
  pricing: {
    basePrice: number;
    priceIncludesTax: boolean;
    currency: string;
  };
  isActive: boolean;
  displayOrder: number;
  tags: string[];
  media: Array<{ url: string; alt?: string; type: string }>;
  selectedVariations: string[];
  recipeVariations: any[];
  isCollapsed: boolean;
}

interface CategoryFormData {
  name: string;
  description: string;
  parentId: string | null;
  displayOrder: number;
  isActive: boolean;
}

interface MenuItemModalBatchProps {
  isOpen: boolean;
  onClose: () => void;
  categories: any[];
  recipes: any[];
  onSuccess: () => void;
}

export default function MenuItemModalBatch({
  isOpen,
  onClose,
  categories,
  recipes,
  onSuccess,
}: MenuItemModalBatchProps) {
  // Category states
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [selectedCategoryName, setSelectedCategoryName] = useState<string>("");
  const [categoryFormData, setCategoryFormData] = useState<CategoryFormData>({
    name: "",
    description: "",
    parentId: null,
    displayOrder: 0,
    isActive: true,
  });
  const [creatingCategory, setCreatingCategory] = useState(false);
  const [showQuickCreate, setShowQuickCreate] = useState(false);

  // Menu items states
  const [menuItems, setMenuItems] = useState<MenuItemFormData[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [activeMenuItemId, setActiveMenuItemId] = useState<string>("");

  // Search states
  const [categorySearch, setCategorySearch] = useState("");
  const [recipeSearch, setRecipeSearch] = useState("");

  // Drag states
  const [draggedCategory, setDraggedCategory] = useState<string | null>(null);
  const [draggedRecipe, setDraggedRecipe] = useState<string | null>(null);

  // Refs for auto-focus
  const categoryDropZoneRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      // Reset everything when modal opens
      setSelectedCategoryId("");
      setSelectedCategoryName("");
      setCategoryFormData({
        name: "",
        description: "",
        parentId: null,
        displayOrder: 0,
        isActive: true,
      });
      const initialItem = createEmptyMenuItem();
      setMenuItems([initialItem]);
      setActiveMenuItemId(initialItem.id);
      setCategorySearch("");
      setRecipeSearch("");
    }
  }, [isOpen]);

  const createEmptyMenuItem = (): MenuItemFormData => ({
    id: `temp-${Date.now()}-${Math.random()}`,
    name: "",
    description: "",
    recipeId: undefined,
    recipeName: undefined,
    pricing: {
      basePrice: 0,
      priceIncludesTax: false,
      currency: "PKR",
    },
    isActive: true,
    displayOrder: 0,
    tags: [],
    media: [],
    selectedVariations: [],
    recipeVariations: [],
    isCollapsed: false,
  });

  // Category handlers
  const handleCategorySelect = (categoryId: string) => {
    const category = categories.find(c => String(c._id || c.id) === categoryId);
    setSelectedCategoryId(categoryId);
    setSelectedCategoryName(category?.name || "");
  };

  const handleCategoryDragStart = (categoryId: string) => {
    setDraggedCategory(categoryId);
  };

  const handleCategoryDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleCategoryDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (draggedCategory) {
      handleCategorySelect(draggedCategory);
      setDraggedCategory(null);
    }
  };

  const handleQuickCreateCategory = async () => {
    if (!categoryFormData.name) {
      toast.error("Category name is required");
      return;
    }

    setCreatingCategory(true);
    try {
      const payload = {
        name: categoryFormData.name,
        description: categoryFormData.description,
        parentId: categoryFormData.parentId || null,
        isActive: categoryFormData.isActive,
        displayOrder: categoryFormData.displayOrder,
        metadata: {},
      };

      const response = await MenuCategoryService.createCategory(payload);

      if (response.success && response.data) {
        toast.success(`Category "${categoryFormData.name}" created successfully`);

        // Auto-select the newly created category
        const newCategoryId = String(response.data._id || response.data.id);
        setSelectedCategoryId(newCategoryId);
        setSelectedCategoryName(categoryFormData.name);

        // Reset category form
        setCategoryFormData({
          name: "",
          description: "",
          parentId: null,
          displayOrder: 0,
          isActive: true,
        });

        // Trigger parent to refresh categories
        onSuccess();
      } else {
        toast.error(response.message || "Failed to create category");
      }
    } catch (error) {
      logError("Error creating category", error, {
        component: "MenuItemModalBatch",
        action: "handleQuickCreateCategory",
      });
      toast.error("Failed to create category");
    } finally {
      setCreatingCategory(false);
    }
  };

  // Menu item handlers
  const handleAddMenuItem = () => {
    const newItem = createEmptyMenuItem();
    setMenuItems([...menuItems, newItem]);
    setActiveMenuItemId(newItem.id);
  };

  const handleRemoveMenuItem = (id: string) => {
    if (menuItems.length === 1) {
      toast.error("At least one menu item is required");
      return;
    }
    setMenuItems(menuItems.filter(item => item.id !== id));
  };

  const handleUpdateMenuItem = (id: string, field: keyof MenuItemFormData, value: any) => {
    setMenuItems(menuItems.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const handleToggleCollapse = (id: string) => {
    setMenuItems(menuItems.map(item =>
      item.id === id ? { ...item, isCollapsed: !item.isCollapsed } : item
    ));
  };

  // Recipe drag handlers
  const handleRecipeDragStart = (recipeId: string) => {
    setDraggedRecipe(recipeId);
  };

  const handleRecipeDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleRecipeDrop = async (e: React.DragEvent, menuItemId: string) => {
    e.preventDefault();
    if (!draggedRecipe) return;

    const recipe = recipes.find(r => String(r._id || r.id) === draggedRecipe);
    if (!recipe) return;

    const recipeId = String(recipe._id || recipe.id);
    const recipeName = recipe.name || "";

    // Get current menu item
    const menuItem = menuItems.find(item => item.id === menuItemId);
    if (!menuItem) return;

    // Prepare all updates in one go
    const updates: Partial<MenuItemFormData> = {
      recipeId: recipeId,
      recipeName: recipeName,
    };

    // Auto-fill name if empty
    if (!menuItem.name) {
      updates.name = recipeName;
    }

    // Auto-fill price if empty
    if (recipe.totalCost && menuItem.pricing.basePrice === 0) {
      updates.pricing = {
        ...menuItem.pricing,
        basePrice: recipe.totalCost,
      };
    }

    // Update menu item with all changes at once
    setMenuItems(menuItems.map(item =>
      item.id === menuItemId ? { ...item, ...updates } : item
    ));

    // Fetch recipe variations
    try {
      const recipeResponse = await RecipeService.getRecipe(recipeId, true);
      if (recipeResponse.success && recipeResponse.data) {
        const { variants } = recipeResponse.data;
        if (variants && Array.isArray(variants)) {
          // Update variations separately after fetch
          setMenuItems(prevItems => prevItems.map(item =>
            item.id === menuItemId
              ? { ...item, recipeVariations: variants }
              : item
          ));
        }
      }
    } catch (error) {
      logError("Error fetching recipe variations", error, {
        component: "MenuItemModalBatch",
        action: "handleRecipeDrop",
        recipeId,
      });
    }

    setDraggedRecipe(null);
    toast.success(`Recipe "${recipeName}" added to menu item`);
  };

  const handleVariationToggle = (menuItemId: string, variationId: string) => {
    const menuItem = menuItems.find(item => item.id === menuItemId);
    if (!menuItem) return;

    const selectedVariations = menuItem.selectedVariations.includes(variationId)
      ? menuItem.selectedVariations.filter(id => id !== variationId)
      : [...menuItem.selectedVariations, variationId];

    handleUpdateMenuItem(menuItemId, "selectedVariations", selectedVariations);
  };

  // Tag handlers
  const handleAddTag = (menuItemId: string, tag: string) => {
    const menuItem = menuItems.find(item => item.id === menuItemId);
    if (!menuItem) return;

    if (tag.trim() && !menuItem.tags.includes(tag.trim())) {
      handleUpdateMenuItem(menuItemId, "tags", [...menuItem.tags, tag.trim()]);
    }
  };

  const handleRemoveTag = (menuItemId: string, tagToRemove: string) => {
    const menuItem = menuItems.find(item => item.id === menuItemId);
    if (!menuItem) return;

    handleUpdateMenuItem(menuItemId, "tags", menuItem.tags.filter(tag => tag !== tagToRemove));
  };

  // Submit handler
  const handleSubmit = async () => {
    if (!selectedCategoryId) {
      toast.error("Please select a category first");
      return;
    }

    // Validate all menu items
    const invalidItems = menuItems.filter(item => !item.name || item.pricing.basePrice <= 0);
    if (invalidItems.length > 0) {
      toast.error(`${invalidItems.length} menu item(s) have missing or invalid data`);
      return;
    }

    setSubmitting(true);
    try {
      let successCount = 0;
      let failCount = 0;

      for (const menuItem of menuItems) {
        try {
          const payload: Partial<TenantMenuItem> = {
            name: menuItem.name,
            description: menuItem.description,
            categoryId: selectedCategoryId,
            recipeId: menuItem.recipeId,
            pricing: menuItem.pricing,
            isActive: menuItem.isActive,
            displayOrder: menuItem.displayOrder,
            tags: menuItem.tags,
            media: menuItem.media,
            branchIds: [],
            metadata: {},
          };

          const response = await MenuItemService.createItem(payload);

          if (response.success && response.data) {
            successCount++;

            // Create variations if any selected
            if (menuItem.selectedVariations.length > 0 && response.data._id) {
              await createMenuVariations(response.data._id, menuItem);
            }
          } else {
            failCount++;
            logError("Failed to create menu item", new Error(response.message), {
              component: "MenuItemModalBatch",
              action: "handleSubmit",
              itemName: menuItem.name,
            });
          }
        } catch (error) {
          failCount++;
          logError("Error creating menu item", error, {
            component: "MenuItemModalBatch",
            action: "handleSubmit",
            itemName: menuItem.name,
          });
        }
      }

      if (successCount > 0) {
        toast.success(`${successCount} menu item(s) created successfully`);

        // Reset form state before closing
        setMenuItems([]);
        setSelectedCategoryId("");
        setSelectedCategoryName("");
        setActiveMenuItemId("");

        // Call parent callbacks
        onSuccess();
        onClose();
      }

      if (failCount > 0) {
        toast.error(`${failCount} menu item(s) failed to create`);
      }
    } catch (error) {
      logError("Error submitting menu items", error, {
        component: "MenuItemModalBatch",
        action: "handleSubmit",
      });
      toast.error("Failed to create menu items");
    } finally {
      setSubmitting(false);
    }
  };

  const createMenuVariations = async (menuItemId: string, menuItem: MenuItemFormData) => {
    try {
      let successCount = 0;
      let failCount = 0;

      for (let i = 0; i < menuItem.selectedVariations.length; i++) {
        const variationId = menuItem.selectedVariations[i];
        const recipeVariation = menuItem.recipeVariations.find(v => (v._id || String(v)) === variationId);

        if (!recipeVariation) continue;

        const variationPayload = {
          menuItemId: menuItemId,
          recipeVariantId: variationId,
          name: recipeVariation.name,
          type: recipeVariation.type || "size",
          priceDelta: recipeVariation.baseCostAdjustment || 0,
          sizeMultiplier: recipeVariation.sizeMultiplier || 1,
          isDefault: i === 0,
          isActive: recipeVariation.isActive !== false,
          displayOrder: i,
        };

        try {
          const response = await MenuVariationsService.createVariation(variationPayload);
          if (response.success) {
            successCount++;
          } else {
            failCount++;
          }
        } catch (error) {
          failCount++;
        }
      }
    } catch (error) {
      logError("Error creating menu variations", error, {
        component: "MenuItemModalBatch",
        action: "createMenuVariations",
        menuItemId,
      });
    }
  };

  // Filtered lists
  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(categorySearch.toLowerCase())
  );

  const filteredRecipes = recipes.filter(recipe =>
    recipe.name.toLowerCase().includes(recipeSearch.toLowerCase())
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        size="5xl"
        onInteractOutside={(e) => e.preventDefault()}
        onOpenAutoFocus={(e) => e.preventDefault()}
        className="max-h-[90vh]"
      >
        <DialogHeader>
          <DialogTitle className="text-xl">Batch Create Menu Items</DialogTitle>
        </DialogHeader>

        <DialogBody className="px-0" style={{ height: 'calc(90vh - 200px)', maxHeight: 'calc(90vh - 200px)' }}>
          <div className="flex gap-0 h-full overflow-hidden">
            {/* Left Panel - Categories */}
            <div className="w-80 flex flex-col border-r border-[#d5d5dd] shrink-0 h-full bg-gradient-to-b from-gray-50 to-white">
              {/* Scrollable Content Wrapper */}
              <div className="flex-1 overflow-y-auto scrollbar-invisible min-h-0">
                {/* Header with Title */}
                <div className="px-4 py-4 border-b border-[#d5d5dd] bg-white shrink-0 sticky top-0 z-10">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-8 w-8 rounded-lg bg-blue-500 flex items-center justify-center">
                      <UtensilsCrossed className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-gray-900">Categories</h3>
                      <p className="text-xs text-gray-500">Select or create</p>
                    </div>
                  </div>

                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      value={categorySearch}
                      onChange={(e) => setCategorySearch(e.target.value)}
                      placeholder="Search categories..."
                      className="pl-9 h-10 text-sm border-[#d5d5dd] bg-gray-50"
                    />
                  </div>
                </div>

                {/* Currently Selected Category Badge */}
                {selectedCategoryId && (
                  <div className="px-4 py-3 border-b border-blue-200 bg-blue-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse shrink-0"></div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">Currently Selected</p>
                          <p className="text-sm font-bold text-blue-900 truncate">{selectedCategoryName}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedCategoryId("");
                          setSelectedCategoryName("");
                        }}
                        className="shrink-0 h-6 w-6 rounded-sm flex items-center justify-center hover:bg-blue-100 text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Categories List */}
                <div className="px-3 py-3 space-y-2">
                  <div className="flex items-center justify-between mb-2 px-1">
                    <Label className="text-[10px] font-black text-gray-500 uppercase tracking-wider">
                      Available ({filteredCategories.length})
                    </Label>
                    <CustomTooltip label="Drag to middle panel or click to select" direction="bottom">
                      <Info className="h-3.5 w-3.5 text-gray-400 cursor-pointer" />
                    </CustomTooltip>
                  </div>

                  {filteredCategories.length === 0 ? (
                    <div className="text-center py-12">
                      <UtensilsCrossed className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-sm font-medium text-gray-500">No categories found</p>
                      <p className="text-xs text-gray-400 mt-1">Try a different search or create one below</p>
                    </div>
                  ) : (
                    filteredCategories.map((category) => {
                      const catId = String(category._id || category.id);
                      const isSelected = selectedCategoryId === catId;

                      return (
                        <div
                          key={catId}
                          draggable
                          onDragStart={() => handleCategoryDragStart(catId)}
                          onClick={() => handleCategorySelect(catId)}
                          className={cn(
                            "group relative bg-white border-2 rounded-lg p-3 cursor-grab active:cursor-grabbing transition-all duration-200 hover:shadow-md",
                            isSelected
                              ? "border-blue-400 bg-blue-50 shadow-md scale-[1.02]"
                              : "border-gray-200 hover:border-blue-300"
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              "h-10 w-10 rounded-lg flex items-center justify-center shrink-0 transition-colors",
                              isSelected
                                ? "bg-blue-500 text-white"
                                : "bg-gray-100 text-gray-600 group-hover:bg-blue-100 group-hover:text-blue-600"
                            )}>
                              <UtensilsCrossed className="h-5 w-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className={cn(
                                "text-sm font-bold truncate transition-colors",
                                isSelected ? "text-blue-900" : "text-gray-900"
                              )}>
                                {category.name}
                              </div>
                              {category.description && (
                                <div className="text-xs text-gray-500 truncate mt-0.5">
                                  {category.description}
                                </div>
                              )}
                            </div>
                          </div>
                          {isSelected && (
                            <div className="absolute top-2 right-2">
                              <div className="h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center">
                                <svg className="h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Quick Create - Sticky at Bottom */}
              <div className="border-t-2 border-[#d5d5dd] shrink-0 bg-white">
                <button
                  onClick={() => setShowQuickCreate(!showQuickCreate)}
                  className={cn(
                    "w-full px-4 py-3 flex items-center justify-between transition-all duration-200",
                    showQuickCreate
                      ? "bg-blue-50 text-blue-700 hover:bg-blue-100"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <Plus className={cn(
                      "h-4 w-4 transition-transform",
                      showQuickCreate && "rotate-45"
                    )} />
                    <span className="text-sm font-bold">Quick Create Category</span>
                  </div>
                  <ChevronDown className={cn(
                    "h-4 w-4 transition-transform",
                    showQuickCreate && "rotate-180"
                  )} />
                </button>

                {/* Quick Create Form (Collapsible) */}
                {showQuickCreate && (
                  <>
                    <div className="border-t border-[#d5d5dd] bg-gradient-to-b from-blue-50/50 to-white max-h-80 overflow-y-auto scrollbar-invisible">
                      <div className="p-4 space-y-3">
                        <div>
                          <Label className="text-xs font-medium text-gray-700 mb-1.5 block">
                            Category Name <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            value={categoryFormData.name}
                            onChange={(e) => setCategoryFormData({ ...categoryFormData, name: e.target.value })}
                            placeholder="e.g., Appetizers, Main Course..."
                            className="h-9 text-sm border-[#d5d5dd]"
                          />
                        </div>

                        <div>
                          <Label className="text-xs font-medium text-gray-700 mb-1.5 block">Description</Label>
                          <Textarea
                            value={categoryFormData.description}
                            onChange={(e) => setCategoryFormData({ ...categoryFormData, description: e.target.value })}
                            placeholder="Brief description (optional)"
                            className="min-h-[60px] text-sm border-[#d5d5dd] resize-none"
                            rows={2}
                          />
                        </div>

                        <div>
                          <Label className="text-xs font-medium text-gray-700 mb-1.5 block">Parent Category</Label>
                          <Select
                            value={categoryFormData.parentId || "none"}
                            onValueChange={(value) => setCategoryFormData({ ...categoryFormData, parentId: value === "none" ? null : value })}
                          >
                            <SelectTrigger className="h-9 text-sm">
                              <SelectValue placeholder="None (Top Level)" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">None (Top Level)</SelectItem>
                              {categories.map((cat) => (
                                <SelectItem key={cat._id || cat.id} value={String(cat._id || cat.id)}>
                                  {cat.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="flex items-center justify-between rounded-lg border border-[#d5d5dd] bg-white px-3 py-2.5">
                          <span className="text-xs font-medium text-gray-700">Active Status</span>
                          <Switch
                            checked={categoryFormData.isActive}
                            onCheckedChange={(checked) => setCategoryFormData({ ...categoryFormData, isActive: checked })}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Static Action Buttons */}
                    <div className="border-t border-[#d5d5dd] bg-white p-3 space-y-2">
                      <Button
                        onClick={handleQuickCreateCategory}
                        disabled={creatingCategory || !categoryFormData.name}
                        className="w-full h-10 text-sm bg-blue-600 hover:bg-blue-700 font-semibold"
                      >
                        {creatingCategory ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Creating Category...
                          </>
                        ) : (
                          <>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Category
                          </>
                        )}
                      </Button>
                      <Button
                        onClick={() => {
                          setShowQuickCreate(false);
                          setCategoryFormData({
                            name: "",
                            description: "",
                            parentId: null,
                            displayOrder: 0,
                            isActive: true,
                          });
                        }}
                        variant="outline"
                        className="w-full h-9 text-sm"
                        disabled={creatingCategory}
                      >
                        Cancel
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Middle Panel - Menu Items */}
            <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
              {/* Sticky Category Header */}
              <div
                ref={categoryDropZoneRef}
                onDragOver={handleCategoryDragOver}
                onDrop={handleCategoryDrop}
                className={cn(
                  "shrink-0 mx-4 mt-4 mb-3 rounded-sm border-2 border-dashed p-4 transition-all duration-200",
                  selectedCategoryId
                    ? "bg-blue-50 border-blue-300"
                    : "bg-gray-50 border-gray-300 hover:border-blue-400 hover:bg-blue-50/50"
                )}
              >
                {selectedCategoryId ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <UtensilsCrossed className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                          Selected Category
                        </p>
                        <p className="text-sm font-bold text-blue-900">{selectedCategoryName}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedCategoryId("");
                        setSelectedCategoryName("");
                      }}
                      className="text-blue-600 hover:text-blue-800 p-1 rounded-sm hover:bg-blue-100 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-2">
                    <UtensilsCrossed className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm font-medium text-gray-600">
                      Select or drag a category here
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Category is required *</p>
                  </div>
                )}
              </div>

              {/* Menu Items List */}
              <div className="flex-1 overflow-y-auto px-4 pb-4 min-h-0">
                <div className="space-y-4">
                {menuItems.map((menuItem, index) => (
                  <MenuItemCard
                    key={menuItem.id}
                    menuItem={menuItem}
                    index={index}
                    isActive={activeMenuItemId === menuItem.id}
                    onSetActive={() => setActiveMenuItemId(menuItem.id)}
                    onUpdate={handleUpdateMenuItem}
                    onRemove={handleRemoveMenuItem}
                    onToggleCollapse={handleToggleCollapse}
                    onRecipeDrop={handleRecipeDrop}
                    onRecipeDragOver={handleRecipeDragOver}
                    onVariationToggle={handleVariationToggle}
                    onAddTag={handleAddTag}
                    onRemoveTag={handleRemoveTag}
                  />
                ))}

                {/* Add Another Menu Item Button */}
                <Button
                  onClick={handleAddMenuItem}
                  variant="outline"
                  className="w-full h-12 border-2 border-dashed border-gray-300 hover:border-blue-400 hover:bg-blue-50/50 text-gray-600 hover:text-blue-600"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Another Menu Item
                </Button>
                </div>
              </div>
            </div>

            {/* Right Panel - Recipes */}
            <div className="w-72 flex flex-col border-l border-[#d5d5dd] shrink-0 h-full overflow-hidden">
              <div className="px-4 py-3 border-b border-[#d5d5dd] bg-white shrink-0">
                <div className="flex items-center gap-2 mb-2">
                  <ChefHat className="h-4 w-4 text-[#656565]" />
                  <Label className="text-xs font-bold text-[#656565] uppercase tracking-wider">
                    Recipes
                  </Label>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    value={recipeSearch}
                    onChange={(e) => setRecipeSearch(e.target.value)}
                    placeholder="Search recipes..."
                    className="pl-9 h-9 text-sm border-[#d5d5dd]"
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto px-2 py-2 space-y-1.5 scrollbar-invisible bg-gray-50/50">
                {filteredRecipes.length === 0 ? (
                  <div className="text-center py-8">
                    <ChefHat className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-400">No recipes found</p>
                  </div>
                ) : (
                  filteredRecipes.map((recipe) => {
                    const recipeId = String(recipe._id || recipe.id);

                    return (
                      <div
                        key={recipeId}
                        draggable
                        onDragStart={() => handleRecipeDragStart(recipeId)}
                        className="group relative bg-white border border-[#d5d5dd] rounded-sm p-2.5 cursor-grab active:cursor-grabbing transition-all duration-200 hover:border-purple-400 hover:shadow-sm"
                      >
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-sm flex items-center justify-center bg-purple-50/50 border border-purple-100/50 text-purple-600 shrink-0">
                            <ChefHat className="h-4 w-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-bold text-gray-900 truncate">{recipe.name}</div>
                            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">
                              {recipe.type || "Recipe"}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Recipe Variations - Show for Active Menu Item */}
              {(() => {
                const activeItem = menuItems.find(item => item.id === activeMenuItemId);
                return activeItem && activeItem.recipeId && activeItem.recipeVariations.length > 0 && (
                  <div className="border-t border-[#d5d5dd] bg-white p-3 max-h-64 overflow-y-auto shrink-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-bold text-gray-600 uppercase tracking-wider">
                          Variations
                        </p>
                        {activeItem.selectedVariations.length > 0 && (
                          <span className="text-[9px] font-black bg-purple-500 text-white px-1.5 py-0.5 rounded-full">
                            {activeItem.selectedVariations.length} SELECTED
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      {activeItem.recipeVariations.map((variation: any, index: number) => {
                        const variationId = variation._id || String(index);
                        const isSelected = activeItem.selectedVariations.includes(variationId);

                        return (
                          <div
                            key={variationId}
                            onClick={() => handleVariationToggle(activeItem.id, variationId)}
                            className={cn(
                              "text-xs p-2 rounded-sm border cursor-pointer transition-all",
                              isSelected
                                ? "bg-purple-100 border-purple-300"
                                : "bg-purple-50 border-purple-100 hover:bg-purple-100"
                            )}
                          >
                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => {}} // Handled by parent div onClick
                                className="rounded border-purple-300 text-purple-600 focus:ring-purple-500"
                              />
                              <div className="flex-1">
                                <p className="font-medium text-purple-900">{variation.name}</p>
                                <p className="text-purple-600 text-[10px]">
                                  {variation.type} {variation.sizeMultiplier && `• ${variation.sizeMultiplier}x`}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </DialogBody>

        <DialogFooter>
          <Button
            onClick={handleSubmit}
            disabled={submitting || !selectedCategoryId}
            className="bg-black hover:bg-gray-800 text-white px-8 h-11"
          >
            {submitting ? (
              <>
                <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                Creating {menuItems.length} Item(s)...
              </>
            ) : (
              `Create ${menuItems.length} Menu Item(s)`
            )}
          </Button>
          <Button
            onClick={onClose}
            variant="outline"
            className="px-8 h-11 border-gray-300"
            disabled={submitting}
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Menu Item Card Component
interface MenuItemCardProps {
  menuItem: MenuItemFormData;
  index: number;
  isActive: boolean;
  onSetActive: () => void;
  onUpdate: (id: string, field: keyof MenuItemFormData, value: any) => void;
  onRemove: (id: string) => void;
  onToggleCollapse: (id: string) => void;
  onRecipeDrop: (e: React.DragEvent, menuItemId: string) => void;
  onRecipeDragOver: (e: React.DragEvent) => void;
  onVariationToggle: (menuItemId: string, variationId: string) => void;
  onAddTag: (menuItemId: string, tag: string) => void;
  onRemoveTag: (menuItemId: string, tag: string) => void;
}

function MenuItemCard({
  menuItem,
  index,
  isActive,
  onSetActive,
  onUpdate,
  onRemove,
  onToggleCollapse,
  onRecipeDrop,
  onRecipeDragOver,
  onVariationToggle,
  onAddTag,
  onRemoveTag,
}: MenuItemCardProps) {
  const [currentTag, setCurrentTag] = useState("");

  const handleAddTagClick = () => {
    if (currentTag.trim()) {
      onAddTag(menuItem.id, currentTag);
      setCurrentTag("");
    }
  };

  return (
    <div
      onClick={onSetActive}
      className={cn(
        "bg-white border-2 rounded-sm overflow-hidden transition-all duration-200 cursor-pointer",
        isActive
          ? "border-blue-400 shadow-md ring-2 ring-blue-200"
          : "border-[#d5d5dd] hover:border-blue-300"
      )}
    >
      {/* Card Header */}
      <div className={cn(
        "border-b border-[#d5d5dd] px-4 py-2 flex items-center justify-between",
        isActive ? "bg-blue-50" : "bg-gray-50"
      )}>
        <div className="flex items-center gap-2">
          <span className="text-xs font-black bg-gray-900 text-white px-2 py-1 rounded-sm">
            ITEM {index + 1}
          </span>
          {menuItem.name && (
            <span className="text-sm font-medium text-gray-700 truncate max-w-[200px]">
              {menuItem.name}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onToggleCollapse(menuItem.id)}
            className="h-6 w-6 rounded-sm flex items-center justify-center hover:bg-gray-200 text-gray-600 transition-colors"
          >
            {menuItem.isCollapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
          </button>
          <button
            onClick={() => onRemove(menuItem.id)}
            className="h-6 w-6 rounded-sm flex items-center justify-center hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Card Body */}
      {!menuItem.isCollapsed && (
        <div className="p-4 space-y-4">
          {/* Recipe Drop Zone */}
          <div
            onDragOver={onRecipeDragOver}
            onDrop={(e) => onRecipeDrop(e, menuItem.id)}
            className={cn(
              "rounded-sm border-2 border-dashed p-3 transition-all duration-200",
              menuItem.recipeId
                ? "bg-purple-50 border-purple-300"
                : "bg-gray-50 border-gray-300 hover:border-purple-400 hover:bg-purple-50/50"
            )}
          >
            {menuItem.recipeId ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ChefHat className="h-4 w-4 text-purple-600" />
                  <div>
                    <p className="text-xs font-bold text-purple-600 uppercase">Recipe</p>
                    <p className="text-sm font-medium text-purple-900">{menuItem.recipeName}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    onUpdate(menuItem.id, "recipeId", undefined);
                    onUpdate(menuItem.id, "recipeName", undefined);
                    onUpdate(menuItem.id, "recipeVariations", []);
                    onUpdate(menuItem.id, "selectedVariations", []);
                  }}
                  className="text-purple-600 hover:text-purple-800 p-1 rounded-sm hover:bg-purple-100 transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ) : (
              <div className="text-center py-1">
                <p className="text-xs font-medium text-gray-600">Drag recipe here (optional)</p>
              </div>
            )}
          </div>

          {/* Name */}
          <div>
            <Label className="text-xs font-medium text-gray-600 mb-1">
              Item Name <span className="text-red-500">*</span>
            </Label>
            <Input
              value={menuItem.name}
              onChange={(e) => onUpdate(menuItem.id, "name", e.target.value)}
              placeholder="e.g., Margherita Pizza"
              className="h-9 text-sm border-[#d5d5dd]"
            />
          </div>

          {/* Description */}
          <div>
            <Label className="text-xs font-medium text-gray-600 mb-1">Description</Label>
            <Textarea
              value={menuItem.description}
              onChange={(e) => onUpdate(menuItem.id, "description", e.target.value)}
              placeholder="Brief description..."
              className="min-h-[60px] text-sm border-[#d5d5dd] resize-none"
              rows={2}
            />
          </div>

          {/* Price and Currency */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs font-medium text-gray-600 mb-1">
                Base Price <span className="text-red-500">*</span>
              </Label>
              <Input
                type="number"
                step="0.01"
                value={menuItem.pricing.basePrice === 0 ? "" : menuItem.pricing.basePrice}
                onChange={(e) => {
                  const val = e.target.value;
                  onUpdate(menuItem.id, "pricing", {
                    ...menuItem.pricing,
                    basePrice: val === '' ? 0 : parseFloat(val) || 0,
                  });
                }}
                onFocus={(e) => e.target.select()}
                placeholder="0.00"
                className="h-9 text-sm border-[#d5d5dd]"
              />
            </div>
            <div>
              <Label className="text-xs font-medium text-gray-600 mb-1">Currency</Label>
              <Select
                value={menuItem.pricing.currency}
                onValueChange={(value) =>
                  onUpdate(menuItem.id, "pricing", {
                    ...menuItem.pricing,
                    currency: value,
                  })
                }
              >
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PKR">PKR</SelectItem>
                  <SelectItem value="SAR">SAR</SelectItem>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Tags */}
          <div>
            <Label className="text-xs font-medium text-gray-600 mb-1">Tags</Label>
            <div className="flex gap-2">
              <Input
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddTagClick();
                  }
                }}
                placeholder="Add tag..."
                className="h-9 text-sm border-[#d5d5dd]"
              />
              <Button
                type="button"
                onClick={handleAddTagClick}
                variant="outline"
                className="h-9 px-3"
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
            {menuItem.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {menuItem.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-sm flex items-center gap-1.5 border border-blue-200"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => onRemoveTag(menuItem.id, tag)}
                      className="hover:text-blue-900"
                    >
                      <X className="h-2.5 w-2.5" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Active Status */}
          <div className="flex items-center justify-between rounded-sm border border-[#d5d5dd] bg-gray-50 px-3 py-2">
            <span className="text-xs font-medium text-gray-700">Active</span>
            <Switch
              checked={menuItem.isActive}
              onCheckedChange={(checked) => onUpdate(menuItem.id, "isActive", checked)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
