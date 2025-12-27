"use client";

import React, { useState, useEffect } from "react";
import { Loader2, Plus, X, Info } from "lucide-react";
import { toast } from "sonner";
import { RecipeService } from "@/lib/services/recipe-service";
import { Dialog, DialogContent, DialogHeader, DialogBody, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { CustomTooltip } from "@/components/ui/custom-tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatPrice } from "@/lib/util/formatters";
import { MenuItemOption, MenuItemPayload, extractId } from "@/lib/types/menu";
import { logError } from "@/lib/util/logger";

interface MenuItemModalProps {
  isOpen: boolean;
  editingItem: MenuItemOption | null;
  onClose: () => void;
  onSubmit: (data: MenuItemPayload) => Promise<any>;
  actionLoading: boolean;
  categories: any[];
  recipes: any[];
}

export default function MenuItemModal({
  isOpen,
  onClose,
  editingItem,
  onSubmit,
  actionLoading,
  categories,
  recipes,
}: MenuItemModalProps) {
  const [formData, setFormData] = useState<Partial<MenuItemPayload>>({
    name: "",
    slug: "",
    code: "",
    description: "",
    categoryId: "",
    recipeId: "",
    pricing: {
      basePrice: 0,
      priceIncludesTax: false,
      currency: "PKR",
    },
    isActive: true,
    displayOrder: 0,
    tags: [],
    media: [],
    branchIds: [],
    metadata: {},
  });

  const [currentTag, setCurrentTag] = useState("");
  const [recipeVariations, setRecipeVariations] = useState<any[]>([]);
  const [loadingVariations, setLoadingVariations] = useState(false);

  useEffect(() => {
    if (isOpen) {
      let recipeIdToFetch = "";

      if (editingItem && editingItem._raw) {
        // Use raw data for editing
        const raw = editingItem._raw;
        // Extract string ID from potentially populated field
        recipeIdToFetch = extractId(raw.recipeId);

        setFormData({
          name: raw.name,
          slug: raw.slug || "",
          code: raw.code || "",
          description: raw.description || "",
          categoryId: extractId(raw.categoryId),
          recipeId: extractId(raw.recipeId),
          pricing: {
            basePrice: raw.pricing?.basePrice || 0,
            priceIncludesTax: raw.pricing?.priceIncludesTax || false,
            currency: raw.pricing?.currency || "PKR",
          },
          isActive: raw.isActive !== false,
          displayOrder: raw.displayOrder || 0,
          tags: raw.tags || [],
          media: raw.media || [],
          branchIds: raw.branchIds || [],
          metadata: raw.metadata || {},
        });
      } else if (editingItem) {
        // Fallback if no raw data
        // Extract string ID from potentially populated field
        recipeIdToFetch = extractId(editingItem.RecipeId as any);

        setFormData({
          name: editingItem.Name,
          slug: editingItem.Slug || "",
          code: editingItem.Code || "",
          description: editingItem.Description || "",
          categoryId: extractId(editingItem.CategoryId as any),
          recipeId: extractId(editingItem.RecipeId as any),
          pricing: {
            basePrice: editingItem.BasePrice || 0,
            priceIncludesTax: editingItem.PriceIncludesTax || false,
            currency: editingItem.Currency || "PKR",
          },
          isActive: editingItem.Status === "Active",
          displayOrder: editingItem.DisplayOrder || 0,
          tags: editingItem.Tags || [],
          media: editingItem.ImageUrl ? [{ url: editingItem.ImageUrl, alt: editingItem.Name, type: "image" }] : [],
          branchIds: [],
          metadata: {},
        });
      } else {
        // New menu item
        setFormData({
          name: "",
          slug: "",
          code: "",
          description: "",
          categoryId: "",
          recipeId: "",
          pricing: {
            basePrice: 0,
            priceIncludesTax: false,
            currency: "PKR",
          },
          isActive: true,
          displayOrder: 0,
          tags: [],
          media: [],
          branchIds: [],
          metadata: {},
        });
      }

      // Fetch recipe variations if editing item with recipe
      if (recipeIdToFetch) {
        fetchRecipeVariations(recipeIdToFetch);
      } else {
        setRecipeVariations([]);
      }
    }
  }, [isOpen, editingItem]);

  // Helper function to fetch recipe variations
  const fetchRecipeVariations = async (recipeId: string) => {
    if (!recipeId || recipeId === 'none') {
      setRecipeVariations([]);
      return;
    }

    try {
      setLoadingVariations(true);
      const recipeResponse = await RecipeService.getRecipe(recipeId, true);
      setLoadingVariations(false);

      if (recipeResponse.success && recipeResponse.data) {
        const { variants } = recipeResponse.data;
        if (variants && Array.isArray(variants)) {
          setRecipeVariations(variants);
        } else {
          setRecipeVariations([]);
        }
      } else {
        setRecipeVariations([]);
      }
    } catch (error) {
      logError("Error fetching recipe variations", error, {
        component: "MenuItemModal",
        action: "fetchRecipeVariations",
        recipeId,
      });
      setLoadingVariations(false);
      setRecipeVariations([]);
    }
  };

  const handleFieldChange = async (field: keyof MenuItemPayload, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // When recipe is selected, fetch recipe details with variants (single API call)
    if (field === "recipeId" && value) {
      try {
        setLoadingVariations(true);

        // Fetch recipe with variants from /t/recipes/:id/with-variants
        const recipeResponse = await RecipeService.getRecipe(value, true);
        setLoadingVariations(false);

        if (recipeResponse.success && recipeResponse.data) {
          const { recipe, variants } = recipeResponse.data;

          // Auto-populate fields from recipe
          setFormData((prev) => {
            const updates: any = {
              ...prev,
              recipeId: value,
            };

            // Auto-fill name if empty (use recipe name)
            if (recipe?.name && !prev.name) {
              updates.name = recipe.name;
            }

            // Auto-fill description if empty
            if (recipe?.description && !prev.description) {
              updates.description = recipe.description;
            }

            // Auto-fill base price from recipe's totalCost (even if 0)
            if (recipe?.totalCost !== undefined) {
              updates.pricing = {
                ...prev.pricing,
                basePrice: recipe.totalCost || 0,
                priceIncludesTax: prev.pricing?.priceIncludesTax || false,
                currency: prev.pricing?.currency || "PKR",
              };
            }

            return updates;
          });

          // Set recipe variations
          if (variants && Array.isArray(variants)) {
            setRecipeVariations(variants);
          } else {
            setRecipeVariations([]);
          }
        } else {
          setRecipeVariations([]);
        }
      } catch (error) {
        logError("Error fetching recipe details", error, {
          component: "MenuItemModal",
          action: "handleFieldChange:recipeId",
          recipeId: value,
        });
        setLoadingVariations(false);
        setRecipeVariations([]);
      }
    } else if (field === "recipeId" && !value) {
      // Clear variations if recipe is deselected
      setRecipeVariations([]);
    }
  };

  const handlePricingChange = (field: keyof MenuItemPayload["pricing"], value: any) => {
    setFormData((prev) => ({
      ...prev,
      pricing: {
        ...prev.pricing!,
        [field]: value,
      },
    }));
  };

  const handleAddTag = () => {
    if (currentTag.trim() && !formData.tags?.includes(currentTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...(prev.tags || []), currentTag.trim()],
      }));
      setCurrentTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove) || [],
    }));
  };

  const handleSave = async () => {
    if (!formData.name || !formData.categoryId) {
      toast.error("Please fill in all required fields (Name, Category)");
      return;
    }

    if (!formData.pricing?.basePrice || formData.pricing.basePrice <= 0) {
      toast.error("Please enter a valid price");
      return;
    }

    try {
      // Generate slug from name if not provided
      const slug = formData.slug || formData.name?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

      // Ensure categoryId and recipeId are strings (or undefined for recipeId)
      const categoryId = String(formData.categoryId || "").trim();
      const recipeId = formData.recipeId && String(formData.recipeId).trim() !== ""
        ? String(formData.recipeId).trim()
        : undefined;

      if (!categoryId) {
        toast.error("Category is required");
        return;
      }

      const payload: MenuItemPayload = {
        name: formData.name!,
        slug: slug!,
        code: formData.code || "",
        description: formData.description,
        categoryId: categoryId,
        recipeId: recipeId,
        pricing: {
          basePrice: formData.pricing!.basePrice!,
          priceIncludesTax: formData.pricing?.priceIncludesTax || false,
          currency: formData.pricing?.currency || "PKR",
        },
        isActive: formData.isActive !== false,
        displayOrder: formData.displayOrder || 0,
        tags: formData.tags || [],
        media: formData.media || [],
        branchIds: formData.branchIds || [],
        metadata: formData.metadata || {},
      };


      await onSubmit(payload);
      onClose();
    } catch (error) {
      logError("Error saving menu item", error, {
        component: "MenuItemModal",
        action: "handleSave",
        itemName: formData.name,
      });
    }
  };

  const [activeTab, setActiveTab] = useState("basic");

  useEffect(() => {
    if (isOpen) {
      setActiveTab("basic");
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        size="4xl" 
        fullHeight 
        onInteractOutside={(e) => e.preventDefault()}
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-xl">
            {editingItem ? "Edit Menu Item" : "Add Menu Item"}
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="px-8 pb-6 pt-2 flex-shrink-0">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="pricing">Pricing</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
            </TabsList>
          </div>

          <DialogBody className="space-y-8">
              <TabsContent value="basic" className="mt-0 space-y-8">
            {/* Name */}
            <div>
              <Label htmlFor="name" className="text-sm font-medium text-[#656565] mb-1.5">
                Item Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                value={formData.name || ""}
                onChange={(e) => handleFieldChange("name", e.target.value)}
                placeholder="e.g., Fajita Pizza"
                className="mt-1.5"
              />
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description" className="text-sm font-medium text-[#656565] mb-1.5">Description</Label>
              <Textarea
                id="description"
                value={formData.description || ""}
                onChange={(e) => handleFieldChange("description", e.target.value)}
                placeholder="Describe this menu item..."
                rows={3}
                className="mt-1.5"
              />
            </div>

            {/* Category and Recipe in one row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Category */}
              <div>
                <Label htmlFor="categoryId" className="text-sm font-medium text-[#656565] mb-1.5">
                  Category <span className="text-red-500">*</span>
                </Label>
                <Select
                  key={`category-${formData.categoryId || 'empty'}-${isOpen}`}
                  value={formData.categoryId || ""}
                  onValueChange={(value) => handleFieldChange("categoryId", value)}
                >
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat: any) => {
                      const catValue = String(cat._id || cat.id);
                      return (
                        <SelectItem key={catValue} value={catValue}>
                          {cat.name}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              {/* Recipe (Optional) */}
              <div>
                <Label htmlFor="recipeId" className="text-sm font-medium text-[#656565] mb-1.5">Recipe (Optional)</Label>
                <Select
                  key={`recipe-${formData.recipeId || 'none'}-${isOpen}`}
                  value={formData.recipeId || "none"}
                  onValueChange={(value) => handleFieldChange("recipeId", value === "none" ? "" : value)}
                >
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Select a recipe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {recipes.map((recipe: any) => {
                      const recipeValue = String(recipe._id || recipe.id);
                      return (
                        <SelectItem key={recipeValue} value={recipeValue}>
                          {recipe.name}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Slug and Code in one row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Slug (Auto-generated preview) */}
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <Label htmlFor="slug" className="text-sm font-medium text-[#656565]">Slug (Auto-generated)</Label>
                  <CustomTooltip label="This slug will be auto-generated from the item name" direction="right">
                    <Info className="h-4 w-4 text-gray-400 cursor-pointer" />
                  </CustomTooltip>
                </div>
                <Input
                  id="slug"
                  value={formData.name ? formData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') : "Will be generated from name"}
                  disabled
                  className="mt-1.5 bg-gray-50 text-gray-500 cursor-not-allowed"
                />
              </div>

              {/* Code (Future functionality) */}
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <Label htmlFor="code" className="text-sm font-medium text-[#656565]">Code (Future functionality)</Label>
                  <CustomTooltip label="This feature will be available in a future update" direction="right">
                    <Info className="h-4 w-4 text-gray-400 cursor-pointer" />
                  </CustomTooltip>
                </div>
                <Input
                  id="code"
                  value={formData.code || "Coming soon"}
                  disabled
                  className="mt-1.5 bg-gray-50 text-gray-500 cursor-not-allowed"
                />
              </div>
            </div>

            {/* Recipe Variations Display */}
            {formData.recipeId && (
              <div className="space-y-3 pt-4 border-t border-[#d5d5dd]">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium text-[#656565]">Recipe Variations</Label>
                  {loadingVariations && (
                    <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                  )}
                </div>

                {!loadingVariations && recipeVariations.length === 0 && (
                  <div className="text-sm text-gray-500 italic bg-gray-50 p-4 rounded-sm text-center">
                    No variations found for this recipe
                  </div>
                )}

                {!loadingVariations && recipeVariations.length > 0 && (
                  <div className="grid grid-cols-1 gap-2">
                    {recipeVariations.map((variation: any, index: number) => (
                      <div
                        key={variation._id || index}
                        className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-sm border border-blue-200 hover:border-blue-300 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full ${
                            variation.type === 'size' ? 'bg-blue-500' :
                            variation.type === 'flavor' ? 'bg-purple-500' :
                            variation.type === 'crust' ? 'bg-orange-500' :
                            'bg-green-500'
                          }`} />
                          <div>
                            <div className="font-medium text-gray-900">{variation.name}</div>
                            {variation.description && (
                              <div className="text-xs text-gray-600">{variation.description}</div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                            variation.type === 'size' ? 'bg-blue-100 text-blue-700' :
                            variation.type === 'flavor' ? 'bg-purple-100 text-purple-700' :
                            variation.type === 'crust' ? 'bg-orange-100 text-orange-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            {variation.type}
                          </span>
                          {variation.baseCostAdjustment && (
                            <span className="text-sm font-semibold text-gray-700">
                              +${formatPrice(variation.baseCostAdjustment)}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
              </TabsContent>

              <TabsContent value="pricing" className="mt-0 space-y-8">
            {/* Base Price */}
            <div>
              <Label htmlFor="basePrice" className="text-sm font-medium text-[#656565] mb-1.5">
                Base Price <span className="text-red-500">*</span>
              </Label>
              <Input
                id="basePrice"
                type="number"
                step="0.01"
                value={formData.pricing?.basePrice === 0 ? "" : formData.pricing?.basePrice || ""}
                onChange={(e) => {
                  const val = e.target.value;
                  handlePricingChange("basePrice", val === '' ? 0 : parseFloat(val) || 0);
                }}
                onFocus={(e) => e.target.select()}
                placeholder="0.00"
                className="mt-1.5"
              />
            </div>

            {/* Currency */}
            <div>
              <Label htmlFor="currency" className="text-sm font-medium text-[#656565] mb-1.5">Currency</Label>
              <Select
                value={formData.pricing?.currency || "PKR"}
                onValueChange={(value) => handlePricingChange("currency", value)}
              >
                <SelectTrigger className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PKR">PKR (Pakistani Rupee)</SelectItem>
                  <SelectItem value="SAR">SAR (Saudi Riyal)</SelectItem>
                  <SelectItem value="USD">USD (US Dollar)</SelectItem>
                  <SelectItem value="EUR">EUR (Euro)</SelectItem>
                  <SelectItem value="GBP">GBP (British Pound)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Price Includes Tax */}
            <div className="w-full">
              <div className="flex items-center justify-between rounded-sm border border-[#d4d7dd] bg-[#f8f8fa] px-4 py-3 w-full">
                <span className="text-[#1f2937] text-sm font-medium">Price Includes Tax</span>
                <Switch
                  id="priceIncludesTax"
                  checked={formData.pricing?.priceIncludesTax || false}
                  onCheckedChange={(checked) => handlePricingChange("priceIncludesTax", checked)}
                />
              </div>
            </div>
              </TabsContent>

              <TabsContent value="details" className="mt-0 space-y-8">
            {/* Display Order */}
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <Label htmlFor="displayOrder" className="text-sm font-medium text-[#656565]">Display Order</Label>
                <CustomTooltip label="Lower numbers appear first in the menu" direction="right">
                  <Info className="h-4 w-4 text-gray-400 cursor-pointer" />
                </CustomTooltip>
              </div>
              <Input
                id="displayOrder"
                type="number"
                value={formData.displayOrder === 0 ? "" : formData.displayOrder || ""}
                onChange={(e) => {
                  const val = e.target.value;
                  handleFieldChange("displayOrder", val === '' ? 0 : parseInt(val) || 0);
                }}
                onFocus={(e) => e.target.select()}
                placeholder="0"
                className="mt-1.5"
              />
            </div>

            {/* Tags */}
            <div>
              <Label htmlFor="tags" className="text-sm font-medium text-[#656565] mb-1.5">Tags</Label>
              <div className="flex gap-2 mt-1.5">
                <Input
                  id="tags"
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                  placeholder="Add a tag..."
                />
                <Button type="button" onClick={handleAddTag} variant="outline" className="h-14">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {formData.tags && formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-sm flex items-center gap-2"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="hover:text-blue-900 cursor-pointer"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Image URL */}
            <div>
              <Label htmlFor="imageUrl" className="text-sm font-medium text-[#656565] mb-1.5">Image URL</Label>
              <Input
                id="imageUrl"
                value={formData.media?.[0]?.url || ""}
                onChange={(e) => {
                  const url = e.target.value;
                  handleFieldChange("media", url ? [{ url, alt: formData.name || "", type: "image" }] : []);
                }}
                placeholder="https://example.com/image.jpg"
                className="mt-1.5"
              />
            </div>

            {/* Active Status */}
            <div className="w-full">
              <div className="flex items-center justify-between rounded-sm border border-[#d4d7dd] bg-[#f8f8fa] px-4 py-3 w-full">
                <span className="text-[#1f2937] text-sm font-medium">Active</span>
                <Switch
                  id="isActive"
                  checked={formData.isActive !== false}
                  onCheckedChange={(checked) => handleFieldChange("isActive", checked)}
                />
              </div>
            </div>
              </TabsContent>
          </DialogBody>
        </Tabs>

        <DialogFooter>
          <Button
            onClick={handleSave}
            disabled={actionLoading}
            className="bg-black hover:bg-gray-800 text-white px-8 h-11"
          >
            {actionLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {editingItem ? "Update" : "Submit"}
          </Button>
          <Button
            onClick={onClose}
            variant="outline"
            className="px-8 h-11 border-gray-300"
            disabled={actionLoading}
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
