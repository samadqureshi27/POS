"use client";

import React, { useState, useEffect } from "react";
import { Loader2, GripVertical, UtensilsCrossed, BookOpen, X, Search, Plus, Upload, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { RecipeService } from "@/lib/services/recipe-service";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { MenuItemOption, MenuItemPayload, extractId } from "@/lib/types/menu";
import { logError } from "@/lib/util/logger";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface MenuItemModalProps {
  isOpen: boolean;
  editingItem: MenuItemOption | null;
  onClose: () => void;
  onSubmit: (data: MenuItemPayload) => Promise<any>;
  actionLoading: boolean;
  categories: any[];
  recipes: any[];
}

export default function MenuItemModalNew({
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

  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedRecipe, setSelectedRecipe] = useState<string>("");
  const [recipeVariations, setRecipeVariations] = useState<any[]>([]);
  const [loadingVariations, setLoadingVariations] = useState(false);

  // Search states
  const [categorySearch, setCategorySearch] = useState("");
  const [recipeSearch, setRecipeSearch] = useState("");

  // Tags state
  const [currentTag, setCurrentTag] = useState("");

  // Drag state
  const [draggedCategory, setDraggedCategory] = useState<string | null>(null);
  const [draggedRecipe, setDraggedRecipe] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (editingItem && editingItem._raw) {
        const raw = editingItem._raw;
        const categoryId = extractId(raw.categoryId);
        const recipeId = extractId(raw.recipeId);

        setFormData({
          name: raw.name,
          slug: raw.slug || "",
          code: raw.code || "",
          description: raw.description || "",
          categoryId: categoryId,
          recipeId: recipeId,
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

        setSelectedCategory(categoryId);
        setSelectedRecipe(recipeId);

        if (recipeId) {
          fetchRecipeVariations(recipeId);
        }
      } else {
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
        setSelectedCategory("");
        setSelectedRecipe("");
        setRecipeVariations([]);
      }
    }
  }, [isOpen, editingItem]);

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
        component: "MenuItemModalNew",
        action: "fetchRecipeVariations",
        recipeId,
      });
      setLoadingVariations(false);
      setRecipeVariations([]);
    }
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setFormData(prev => ({ ...prev, categoryId }));
  };

  const handleRecipeSelect = async (recipeId: string) => {
    setSelectedRecipe(recipeId);
    setFormData(prev => ({ ...prev, recipeId }));

    if (recipeId && recipeId !== 'none') {
      try {
        setLoadingVariations(true);
        const recipeResponse = await RecipeService.getRecipe(recipeId, true);
        setLoadingVariations(false);

        if (recipeResponse.success && recipeResponse.data) {
          const { recipe, variants } = recipeResponse.data;

          setFormData(prev => {
            const updates: any = { ...prev, recipeId };

            if (recipe?.name && !prev.name) {
              updates.name = recipe.name;
            }

            if (recipe?.description && !prev.description) {
              updates.description = recipe.description;
            }

            if (recipe?.totalCost !== undefined) {
              updates.pricing = {
                ...prev.pricing,
                basePrice: recipe.totalCost || 0,
              };
            }

            return updates;
          });

          if (variants && Array.isArray(variants)) {
            setRecipeVariations(variants);
          } else {
            setRecipeVariations([]);
          }
        }
      } catch (error) {
        setLoadingVariations(false);
        setRecipeVariations([]);
      }
    } else {
      setRecipeVariations([]);
    }
  };

  const handleFieldChange = (field: keyof MenuItemPayload, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePricingChange = (field: keyof MenuItemPayload["pricing"], value: any) => {
    setFormData(prev => ({
      ...prev,
      pricing: {
        ...prev.pricing!,
        [field]: value,
      },
    }));
  };

  // Tag handlers
  const handleAddTag = () => {
    if (currentTag.trim() && !formData.tags?.includes(currentTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), currentTag.trim()],
      }));
      setCurrentTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove) || [],
    }));
  };

  // Drag handlers for categories
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

  // Drag handlers for recipes
  const handleRecipeDragStart = (recipeId: string) => {
    setDraggedRecipe(recipeId);
  };

  const handleRecipeDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleRecipeDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (draggedRecipe) {
      handleRecipeSelect(draggedRecipe);
      setDraggedRecipe(null);
    }
  };

  // Filtered lists
  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(categorySearch.toLowerCase())
  );

  const filteredRecipes = recipes.filter(recipe =>
    recipe.name.toLowerCase().includes(recipeSearch.toLowerCase())
  );

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
      const slug = formData.slug || formData.name?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
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
        component: "MenuItemModalNew",
        action: "handleSave",
        itemName: formData.name,
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-[95vw] h-[90vh] p-0 gap-0"
        onInteractOutside={(e) => e.preventDefault()}
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader className="px-8 py-6 border-b border-[#d5d5dd]">
          <DialogTitle className="text-xl">
            {editingItem ? "Edit Menu Item" : "Add Menu Item"}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-1 overflow-hidden">
          {/* Left Panel - Categories */}
          <div className="w-72 border-r border-[#d5d5dd] bg-gray-50/50 flex flex-col">
            <div className="px-4 py-3 border-b border-[#d5d5dd] bg-white">
              <h3 className="text-sm font-bold text-gray-700 flex items-center gap-2 mb-3">
                <UtensilsCrossed className="h-4 w-4" />
                Categories
              </h3>
              {/* Search Box */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  value={categorySearch}
                  onChange={(e) => setCategorySearch(e.target.value)}
                  placeholder="Search categories..."
                  className="pl-9 h-9 text-sm"
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-2">
              {filteredCategories.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-8">No categories found</p>
              )}
              {filteredCategories.map((category: any) => {
                const catId = String(category._id || category.id);
                const isSelected = selectedCategory === catId;

                return (
                  <div
                    key={catId}
                    draggable
                    onDragStart={() => handleCategoryDragStart(catId)}
                    onClick={() => handleCategorySelect(catId)}
                    className={cn(
                      "w-full text-left px-3 py-2.5 rounded-sm mb-1 transition-all duration-150 cursor-move",
                      "flex items-center gap-2 group",
                      isSelected
                        ? "bg-blue-50 border border-blue-200 text-blue-900 font-medium shadow-sm"
                        : "hover:bg-white border border-transparent hover:border-gray-200 text-gray-700 hover:shadow-sm"
                    )}
                  >
                    <GripVertical className={cn(
                      "h-4 w-4 flex-shrink-0 cursor-grab active:cursor-grabbing",
                      isSelected ? "text-blue-500" : "text-gray-400 group-hover:text-gray-600"
                    )} />
                    <span className="text-sm truncate flex-1">{category.name}</span>
                    {isSelected && (
                      <div className="ml-auto w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 animate-pulse" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Center Panel - Main Form */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-8 space-y-6">
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
                <Label htmlFor="description" className="text-sm font-medium text-[#656565] mb-1.5">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={formData.description || ""}
                  onChange={(e) => handleFieldChange("description", e.target.value)}
                  placeholder="Describe this menu item..."
                  rows={3}
                  className="mt-1.5"
                />
              </div>

              {/* Category Drop Zone */}
              <div
                onDragOver={handleCategoryDragOver}
                onDrop={handleCategoryDrop}
                className={cn(
                  "rounded-sm border-2 border-dashed p-4 transition-all duration-200",
                  selectedCategory
                    ? "bg-blue-50 border-blue-300"
                    : "bg-gray-50 border-gray-300 hover:border-blue-400 hover:bg-blue-50/50"
                )}
              >
                {selectedCategory ? (
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
                        Selected Category <span className="text-red-500">*</span>
                      </p>
                      <p className="text-sm font-medium text-blue-900">
                        {categories.find(c => String(c._id || c.id) === selectedCategory)?.name}
                      </p>
                    </div>
                    <button
                      onClick={() => handleCategorySelect("")}
                      className="text-blue-600 hover:text-blue-800 p-1 rounded-sm hover:bg-blue-100 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-2">
                    <UtensilsCrossed className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm font-medium text-gray-600">
                      Drag a category here or click from the list
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Category is required <span className="text-red-500">*</span>
                    </p>
                  </div>
                )}
              </div>

              {/* Recipe Drop Zone */}
              <div
                onDragOver={handleRecipeDragOver}
                onDrop={handleRecipeDrop}
                className={cn(
                  "rounded-sm border-2 border-dashed p-4 transition-all duration-200",
                  selectedRecipe && selectedRecipe !== 'none'
                    ? "bg-purple-50 border-purple-300"
                    : "bg-gray-50 border-gray-300 hover:border-purple-400 hover:bg-purple-50/50"
                )}
              >
                {selectedRecipe && selectedRecipe !== 'none' ? (
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-purple-600 uppercase tracking-wider mb-1">
                        Selected Recipe (Optional)
                      </p>
                      <p className="text-sm font-medium text-purple-900">
                        {recipes.find(r => String(r._id || r.id) === selectedRecipe)?.name}
                      </p>
                    </div>
                    <button
                      onClick={() => handleRecipeSelect("")}
                      className="text-purple-600 hover:text-purple-800 p-1 rounded-sm hover:bg-purple-100 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-2">
                    <BookOpen className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm font-medium text-gray-600">
                      Drag a recipe here or click from the list
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Recipe is optional
                    </p>
                  </div>
                )}
              </div>

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
                <Label htmlFor="currency" className="text-sm font-medium text-[#656565] mb-1.5">
                  Currency
                </Label>
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

              {/* Display Order */}
              <div>
                <Label htmlFor="displayOrder" className="text-sm font-medium text-[#656565] mb-1.5">
                  Display Order
                </Label>
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
                <Label htmlFor="tags" className="text-sm font-medium text-[#656565] mb-1.5">
                  Tags
                </Label>
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
                    placeholder="Add a tag and press Enter..."
                  />
                  <Button
                    type="button"
                    onClick={handleAddTag}
                    variant="outline"
                    className="h-14 px-4"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {formData.tags && formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {formData.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1.5 bg-blue-50 text-blue-700 text-sm rounded-sm flex items-center gap-2 border border-blue-200"
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

              {/* Image URL/Upload */}
              <div>
                <Label htmlFor="imageUrl" className="text-sm font-medium text-[#656565] mb-1.5">
                  Image
                </Label>
                <div className="mt-1.5">
                  <div className="flex gap-2 mb-3">
                    <Input
                      id="imageUrl"
                      value={formData.media?.[0]?.url || ""}
                      onChange={(e) => {
                        const url = e.target.value;
                        handleFieldChange("media", url ? [{ url, alt: formData.name || "", type: "image" }] : []);
                      }}
                      placeholder="Enter image URL or upload..."
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="h-14 px-4"
                      onClick={() => toast.info("File upload will be implemented soon")}
                    >
                      <Upload className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Image Preview */}
                  {formData.media?.[0]?.url && (
                    <div className="relative rounded-sm border border-[#d5d5dd] p-2 bg-gray-50">
                      <div className="flex items-center gap-3">
                        <div className="w-20 h-20 rounded-sm border border-[#d5d5dd] overflow-hidden bg-white flex items-center justify-center">
                          <img
                            src={formData.media[0].url}
                            alt="Preview"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                              (e.target as HTMLImageElement).parentElement!.innerHTML = '<ImageIcon class="h-8 w-8 text-gray-400" />';
                            }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-700 truncate">
                            {formData.name || "Menu Item Image"}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {formData.media[0].url}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleFieldChange("media", [])}
                          className="text-gray-400 hover:text-red-600 p-1 rounded-sm hover:bg-red-50 transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Recipes */}
          <div className="w-72 border-l border-[#d5d5dd] bg-gray-50/50 flex flex-col">
            <div className="px-4 py-3 border-b border-[#d5d5dd] bg-white">
              <h3 className="text-sm font-bold text-gray-700 flex items-center gap-2 mb-3">
                <BookOpen className="h-4 w-4" />
                Recipes
              </h3>
              {/* Search Box */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  value={recipeSearch}
                  onChange={(e) => setRecipeSearch(e.target.value)}
                  placeholder="Search recipes..."
                  className="pl-9 h-9 text-sm"
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-2">
              <div
                onClick={() => handleRecipeSelect("")}
                className={cn(
                  "w-full text-left px-3 py-2.5 rounded-sm mb-1 transition-all duration-150 cursor-pointer",
                  "flex items-center gap-2",
                  !selectedRecipe || selectedRecipe === 'none'
                    ? "bg-purple-50 border border-purple-200 text-purple-900 font-medium shadow-sm"
                    : "hover:bg-white border border-transparent hover:border-gray-200 text-gray-700 hover:shadow-sm"
                )}
              >
                <span className="text-sm flex-1">None (No Recipe)</span>
                {(!selectedRecipe || selectedRecipe === 'none') && (
                  <div className="ml-auto w-2 h-2 rounded-full bg-purple-500 flex-shrink-0 animate-pulse" />
                )}
              </div>

              {filteredRecipes.length === 0 && recipeSearch && (
                <p className="text-sm text-gray-500 text-center py-8">No recipes found</p>
              )}

              {filteredRecipes.map((recipe: any) => {
                const recipeId = String(recipe._id || recipe.id);
                const isSelected = selectedRecipe === recipeId;

                return (
                  <div
                    key={recipeId}
                    draggable
                    onDragStart={() => handleRecipeDragStart(recipeId)}
                    onClick={() => handleRecipeSelect(recipeId)}
                    className={cn(
                      "w-full text-left px-3 py-2.5 rounded-sm mb-1 transition-all duration-150 cursor-move",
                      "flex items-center gap-2 group",
                      isSelected
                        ? "bg-purple-50 border border-purple-200 text-purple-900 font-medium shadow-sm"
                        : "hover:bg-white border border-transparent hover:border-gray-200 text-gray-700 hover:shadow-sm"
                    )}
                  >
                    <GripVertical className={cn(
                      "h-4 w-4 flex-shrink-0 cursor-grab active:cursor-grabbing",
                      isSelected ? "text-purple-500" : "text-gray-400 group-hover:text-gray-600"
                    )} />
                    <span className="text-sm truncate flex-1">{recipe.name}</span>
                    {isSelected && (
                      <div className="ml-auto w-2 h-2 rounded-full bg-purple-500 flex-shrink-0 animate-pulse" />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Recipe Variations */}
            {selectedRecipe && selectedRecipe !== 'none' && (
              <div className="border-t border-[#d5d5dd] bg-white p-3 max-h-64 overflow-y-auto">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Variations
                  </p>
                  {loadingVariations && (
                    <Loader2 className="h-3 w-3 animate-spin text-purple-600" />
                  )}
                </div>

                {!loadingVariations && recipeVariations.length === 0 && (
                  <p className="text-xs text-gray-500 italic">No variations</p>
                )}

                {!loadingVariations && recipeVariations.length > 0 && (
                  <div className="space-y-1.5">
                    {recipeVariations.map((variation: any, index: number) => (
                      <div
                        key={variation._id || index}
                        className="text-xs p-2 bg-purple-50 rounded-sm border border-purple-100"
                      >
                        <p className="font-medium text-purple-900">{variation.name}</p>
                        <p className="text-purple-600 text-[10px]">{variation.type}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="px-8 py-4 border-t border-[#d5d5dd]">
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
