"use client";

import React, { useState, useEffect } from "react";
import { Loader2, Plus, X } from "lucide-react";
import { RecipeService } from "@/lib/services/recipe-service";
import { RecipeVariantService } from "@/lib/services/recipe-variant-service";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MenuItemOption, MenuItemPayload, extractId } from "@/lib/types/menu";

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
      currency: "SAR",
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
            currency: raw.pricing?.currency || "SAR",
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
            currency: editingItem.Currency || "SAR",
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
            currency: "SAR",
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
      console.error("Error fetching recipe variations:", error);
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
                currency: prev.pricing?.currency || "SAR",
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
        console.error("Error fetching recipe details:", error);
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
      alert("Please fill in all required fields (Name, Category)");
      return;
    }

    if (!formData.pricing?.basePrice || formData.pricing.basePrice <= 0) {
      alert("Please enter a valid price");
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
        alert("Category is required");
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
          currency: formData.pricing?.currency || "SAR",
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
      console.error("Error saving menu item:", error);
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
      <DialogContent size="4xl" fullHeight>
        {/* Header */}
        <div className="p-5 border-b border-gray-200 flex-shrink-0">
          <DialogTitle className="text-xl font-bold text-gray-900">
            {editingItem ? "Edit Menu Item" : "Add Menu Item"}
          </DialogTitle>
          <p className="text-sm text-gray-600 mt-1">
            {editingItem ? "Update menu item details and pricing" : "Create a new menu item"}
          </p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex flex-col min-h-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">
            {/* Tab List */}
            <div className="px-5 pt-3 pb-3 border-b border-gray-100 flex-shrink-0">
              <div className="flex flex-col gap-2">
                <div className="flex justify-center">
                  <TabsList className="grid w-full max-w-sm grid-cols-3 h-9">
                    <TabsTrigger value="basic" className="text-sm">Basic Info</TabsTrigger>
                    <TabsTrigger value="pricing" className="text-sm">Pricing</TabsTrigger>
                    <TabsTrigger value="details" className="text-sm">Details</TabsTrigger>
                  </TabsList>
                </div>
                <p className="text-xs text-gray-600 text-center">
                  {activeTab === "basic"
                    ? "Configure basic item information and category"
                    : activeTab === "pricing"
                    ? "Set pricing and currency details"
                    : "Additional settings and metadata"}
                </p>
              </div>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto p-5 min-h-0">
              <TabsContent value="basic" className="mt-0 space-y-6">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Item Name *</Label>
              <Input
                id="name"
                value={formData.name || ""}
                onChange={(e) => handleFieldChange("name", e.target.value)}
                placeholder="e.g., Fajita Pizza"
              />
            </div>

            {/* Slug (Auto-generated preview) */}
            <div className="space-y-2">
              <Label htmlFor="slug">Slug (Auto-generated)</Label>
              <Input
                id="slug"
                value={formData.name ? formData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') : "Will be generated from name"}
                disabled
                className="bg-gray-50 text-gray-500 cursor-not-allowed"
              />
              <p className="text-xs text-gray-500">This slug will be auto-generated from the item name</p>
            </div>

            {/* Code (Future functionality) */}
            <div className="space-y-2">
              <Label htmlFor="code">Code (Future functionality)</Label>
              <Input
                id="code"
                value={formData.code || "Coming soon"}
                disabled
                className="bg-gray-50 text-gray-500 cursor-not-allowed"
              />
              <p className="text-xs text-gray-500">This feature will be available in a future update</p>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description || ""}
                onChange={(e) => handleFieldChange("description", e.target.value)}
                placeholder="Describe this menu item..."
                rows={3}
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="categoryId">Category *</Label>
              <Select
                key={`category-${formData.categoryId || 'empty'}-${isOpen}`}
                value={formData.categoryId || ""}
                onValueChange={(value) => handleFieldChange("categoryId", value)}
              >
                <SelectTrigger>
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
              {/* Debug info - remove before production */}
              <p className="text-xs text-gray-500">
                Selected: {String(formData.categoryId || 'None')} | Available: {categories.length}
              </p>
            </div>

            {/* Recipe (Optional) */}
            <div className="space-y-2">
              <Label htmlFor="recipeId">Recipe (Optional)</Label>
              <Select
                key={`recipe-${formData.recipeId || 'none'}-${isOpen}`}
                value={formData.recipeId || "none"}
                onValueChange={(value) => handleFieldChange("recipeId", value === "none" ? "" : value)}
              >
                <SelectTrigger>
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
              {/* Debug info - remove before production */}
              <p className="text-xs text-gray-500">
                Selected: {String(formData.recipeId || 'None')} | Available: {recipes.length}
              </p>
            </div>

            {/* Recipe Variations Display */}
            {formData.recipeId && (
              <div className="space-y-3 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-semibold text-gray-900">Recipe Variations</Label>
                  {loadingVariations && (
                    <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                  )}
                </div>

                {!loadingVariations && recipeVariations.length === 0 && (
                  <div className="text-sm text-gray-500 italic bg-gray-50 p-4 rounded-lg text-center">
                    No variations found for this recipe
                  </div>
                )}

                {!loadingVariations && recipeVariations.length > 0 && (
                  <div className="grid grid-cols-1 gap-2">
                    {recipeVariations.map((variation: any, index: number) => (
                      <div
                        key={variation._id || index}
                        className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200 hover:border-blue-300 transition-colors"
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
                              +${variation.baseCostAdjustment.toFixed(2)}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <p className="text-xs text-gray-500 mt-2">
                  These variations are associated with the selected recipe and can affect pricing
                </p>
              </div>
            )}
              </TabsContent>

              <TabsContent value="pricing" className="mt-0 space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Pricing Information</h3>

            {/* Base Price */}
            <div className="space-y-2">
              <Label htmlFor="basePrice">Base Price *</Label>
              <Input
                id="basePrice"
                type="number"
                step="0.01"
                value={formData.pricing?.basePrice || 0}
                onChange={(e) => handlePricingChange("basePrice", parseFloat(e.target.value) || 0)}
                placeholder="0.00"
              />
            </div>

            {/* Currency */}
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Select
                value={formData.pricing?.currency || "SAR"}
                onValueChange={(value) => handlePricingChange("currency", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SAR">SAR</SelectItem>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                  <SelectItem value="GBP">GBP</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Price Includes Tax */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <Label htmlFor="priceIncludesTax" className="text-base font-medium">
                  Price Includes Tax
                </Label>
                <p className="text-sm text-gray-500">
                  Tax is already included in the price
                </p>
              </div>
              <Switch
                id="priceIncludesTax"
                checked={formData.pricing?.priceIncludesTax || false}
                onCheckedChange={(checked) => handlePricingChange("priceIncludesTax", checked)}
              />
            </div>
              </TabsContent>

              <TabsContent value="details" className="mt-0 space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Additional Details</h3>

            {/* Display Order */}
            <div className="space-y-2">
              <Label htmlFor="displayOrder">Display Order</Label>
              <Input
                id="displayOrder"
                type="number"
                value={formData.displayOrder || 0}
                onChange={(e) => handleFieldChange("displayOrder", parseInt(e.target.value) || 0)}
                placeholder="0"
              />
              <p className="text-xs text-gray-500">Lower numbers appear first</p>
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <div className="flex gap-2">
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
                <Button type="button" onClick={handleAddTag} variant="outline">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {formData.tags && formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-md flex items-center gap-2"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="hover:text-blue-900"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Image URL */}
            <div className="space-y-2">
              <Label htmlFor="imageUrl">Image URL</Label>
              <Input
                id="imageUrl"
                value={formData.media?.[0]?.url || ""}
                onChange={(e) => {
                  const url = e.target.value;
                  handleFieldChange("media", url ? [{ url, alt: formData.name || "", type: "image" }] : []);
                }}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            {/* Active Status */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <Label htmlFor="isActive" className="text-base font-medium">
                  Active Item
                </Label>
                <p className="text-sm text-gray-500">
                  Item will be visible on the menu
                </p>
              </div>
              <Switch
                id="isActive"
                checked={formData.isActive !== false}
                onCheckedChange={(checked) => handleFieldChange("isActive", checked)}
              />
            </div>
              </TabsContent>
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
            disabled={actionLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={actionLoading}
            size="sm"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white h-9"
          >
            {actionLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {editingItem ? "Update" : "Save & Close"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
