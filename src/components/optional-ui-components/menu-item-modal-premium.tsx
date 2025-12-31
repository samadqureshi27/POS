"use client";

import React, { useState, useEffect } from "react";
import {
  Loader2, GripVertical, UtensilsCrossed, BookOpen, X, Search, Plus, Upload,
  Image as ImageIcon, Tag, DollarSign, Hash, Eye, EyeOff, Check, ChevronDown,
  Sparkles, AlertCircle, Info
} from "lucide-react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface MenuItemModalProps {
  isOpen: boolean;
  editingItem: MenuItemOption | null;
  onClose: () => void;
  onSubmit: (data: MenuItemPayload) => Promise<any>;
  actionLoading: boolean;
  categories: any[];
  recipes: any[];
}

export default function MenuItemModalPremium({
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
  const [categorySearch, setCategorySearch] = useState("");
  const [recipeSearch, setRecipeSearch] = useState("");
  const [currentTag, setCurrentTag] = useState("");
  const [draggedCategory, setDraggedCategory] = useState<string | null>(null);
  const [draggedRecipe, setDraggedRecipe] = useState<string | null>(null);
  const [isDraggingOverCategory, setIsDraggingOverCategory] = useState(false);
  const [isDraggingOverRecipe, setIsDraggingOverRecipe] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

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
      setCategorySearch("");
      setRecipeSearch("");
      setShowAdvanced(false);
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
        component: "MenuItemModalPremium",
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
              toast.success("Name auto-filled from recipe");
            }

            if (recipe?.description && !prev.description) {
              updates.description = recipe.description;
            }

            if (recipe?.totalCost !== undefined) {
              updates.pricing = {
                ...prev.pricing,
                basePrice: recipe.totalCost || 0,
              };
              if (recipe.totalCost > 0) {
                toast.success(`Price auto-filled: ${recipe.totalCost}`);
              }
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

  const handleAddTag = () => {
    if (currentTag.trim() && !formData.tags?.includes(currentTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), currentTag.trim()],
      }));
      setCurrentTag("");
      toast.success(`Tag "${currentTag.trim()}" added`);
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove) || [],
    }));
  };

  const handleCategoryDragStart = (categoryId: string) => {
    setDraggedCategory(categoryId);
  };

  const handleCategoryDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOverCategory(true);
  };

  const handleCategoryDragLeave = () => {
    setIsDraggingOverCategory(false);
  };

  const handleCategoryDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOverCategory(false);
    if (draggedCategory) {
      handleCategorySelect(draggedCategory);
      setDraggedCategory(null);
      toast.success("Category added!");
    }
  };

  const handleRecipeDragStart = (recipeId: string) => {
    setDraggedRecipe(recipeId);
  };

  const handleRecipeDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOverRecipe(true);
  };

  const handleRecipeDragLeave = () => {
    setIsDraggingOverRecipe(false);
  };

  const handleRecipeDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOverRecipe(false);
    if (draggedRecipe) {
      handleRecipeSelect(draggedRecipe);
      setDraggedRecipe(null);
      toast.success("Recipe added!");
    }
  };

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
        component: "MenuItemModalPremium",
        action: "handleSave",
        itemName: formData.name,
      });
    }
  };

  const getCompletionPercentage = () => {
    let total = 0;
    let filled = 0;

    // Required fields
    if (formData.name) filled++; total++;
    if (selectedCategory) filled++; total++;
    if (formData.pricing?.basePrice && formData.pricing.basePrice > 0) filled++; total++;

    // Optional but recommended
    if (formData.description) filled++; total++;
    if (selectedRecipe) filled++; total++;
    if (formData.media?.[0]?.url) filled++; total++;
    if (formData.tags && formData.tags.length > 0) filled++; total++;

    return Math.round((filled / total) * 100);
  };

  const completionPercentage = getCompletionPercentage();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-[96vw] h-[92vh] p-0 gap-0 overflow-hidden bg-white"
        onInteractOutside={(e) => e.preventDefault()}
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        {/* Header with Progress */}
        <DialogHeader className="px-8 py-6 border-b border-[#d5d5dd] bg-white sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-sm bg-black flex items-center justify-center">
                <UtensilsCrossed className="h-5 w-5 text-white" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold text-gray-900">
                  {editingItem ? "Edit Menu Item" : "Add Menu Item"}
                </DialogTitle>
                <p className="text-sm text-[#656565]">
                  {editingItem ? "Update menu item details" : "Create a new menu item"}
                </p>
              </div>
            </div>

            {/* Progress Indicator */}
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-xs font-bold text-[#656565] uppercase tracking-wider">Progress</p>
                <p className="text-lg font-bold text-gray-900">{completionPercentage}%</p>
              </div>
            </div>
          </div>
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
                      <div className="ml-auto w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Center Panel - Main Form */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <div className="max-w-3xl mx-auto p-8 space-y-6">
              {/* Category Drop Zone */}
              <div
                onDragOver={handleCategoryDragOver}
                onDragLeave={handleCategoryDragLeave}
                onDrop={handleCategoryDrop}
                className={cn(
                  "relative rounded-xl border-3 border-dashed p-6 transition-all duration-300 overflow-hidden",
                  selectedCategory
                    ? "bg-gradient-to-br from-blue-50 to-blue-100/50 border-blue-400"
                    : isDraggingOverCategory
                    ? "bg-gradient-to-br from-blue-100 to-blue-200/50 border-blue-500 shadow-lg scale-[1.02]"
                    : "bg-gradient-to-br from-gray-50 to-gray-100/50 border-gray-300 hover:border-blue-300 hover:shadow-md"
                )}
              >
                <div className={cn(
                  "absolute inset-0 bg-gradient-to-br from-blue-400/10 to-purple-400/10 transition-opacity duration-300",
                  isDraggingOverCategory ? "opacity-100" : "opacity-0"
                )} />

                {selectedCategory ? (
                  <div className="relative flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                        <UtensilsCrossed className="h-7 w-7 text-white" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                          Category <span className="text-red-500">*</span>
                          <Check className="h-3.5 w-3.5 text-green-500" />
                        </p>
                        <p className="text-lg font-bold text-gray-900">
                          {categories.find(c => String(c._id || c.id) === selectedCategory)?.name}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleCategorySelect("")}
                      className="group p-2.5 rounded-lg bg-white/80 hover:bg-red-50 border-2 border-transparent hover:border-red-200 transition-all duration-200"
                    >
                      <X className="h-5 w-5 text-gray-400 group-hover:text-red-600 transition-colors" />
                    </button>
                  </div>
                ) : (
                  <div className="relative text-center py-6">
                    <div className={cn(
                      "w-20 h-20 mx-auto mb-4 rounded-2xl flex items-center justify-center transition-all duration-300",
                      isDraggingOverCategory
                        ? "bg-gradient-to-br from-blue-500 to-purple-600 scale-110 shadow-xl"
                        : "bg-gradient-to-br from-gray-300 to-gray-400"
                    )}>
                      <UtensilsCrossed className="h-10 w-10 text-white" />
                    </div>
                    <p className={cn(
                      "text-base font-bold mb-2 transition-colors",
                      isDraggingOverCategory ? "text-blue-700" : "text-gray-700"
                    )}>
                      {isDraggingOverCategory ? "Drop category here!" : "Select a Category"}
                    </p>
                    <p className="text-sm text-gray-500">
                      Drag from the left panel or click a category
                    </p>
                    <p className="text-xs text-red-500 mt-2 font-medium">Required field</p>
                  </div>
                )}
              </div>

              {/* Name Field */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Hash className="h-4 w-4 text-gray-400" />
                  Item Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  value={formData.name || ""}
                  onChange={(e) => handleFieldChange("name", e.target.value)}
                  placeholder="e.g., Margherita Pizza, Beef Burger..."
                  className="h-12 text-base border-2 border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                />
                {formData.name && (
                  <p className="text-xs text-green-600 flex items-center gap-1.5 animate-in fade-in">
                    <Check className="h-3 w-3" /> Name looks good!
                  </p>
                )}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-semibold text-gray-700">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={formData.description || ""}
                  onChange={(e) => handleFieldChange("description", e.target.value)}
                  placeholder="Describe what makes this item special..."
                  rows={4}
                  className="resize-none border-2 border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                />
                <p className="text-xs text-gray-500">
                  {formData.description?.length || 0} characters
                </p>
              </div>

              {/* Recipe Drop Zone */}
              <div
                onDragOver={handleRecipeDragOver}
                onDragLeave={handleRecipeDragLeave}
                onDrop={handleRecipeDrop}
                className={cn(
                  "relative rounded-xl border-3 border-dashed p-6 transition-all duration-300 overflow-hidden",
                  selectedRecipe && selectedRecipe !== 'none'
                    ? "bg-gradient-to-br from-purple-50 to-purple-100/50 border-purple-400"
                    : isDraggingOverRecipe
                    ? "bg-gradient-to-br from-purple-100 to-purple-200/50 border-purple-500 shadow-lg scale-[1.02]"
                    : "bg-gradient-to-br from-gray-50 to-gray-100/50 border-gray-300 hover:border-purple-300 hover:shadow-md"
                )}
              >
                <div className={cn(
                  "absolute inset-0 bg-gradient-to-br from-purple-400/10 to-pink-400/10 transition-opacity duration-300",
                  isDraggingOverRecipe ? "opacity-100" : "opacity-0"
                )} />

                {selectedRecipe && selectedRecipe !== 'none' ? (
                  <div className="relative flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg">
                        <BookOpen className="h-7 w-7 text-white" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-purple-600 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                          Recipe (Optional)
                          <Check className="h-3.5 w-3.5 text-green-500" />
                        </p>
                        <p className="text-lg font-bold text-gray-900">
                          {recipes.find(r => String(r._id || r.id) === selectedRecipe)?.name}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRecipeSelect("")}
                      className="group p-2.5 rounded-lg bg-white/80 hover:bg-red-50 border-2 border-transparent hover:border-red-200 transition-all duration-200"
                    >
                      <X className="h-5 w-5 text-gray-400 group-hover:text-red-600 transition-colors" />
                    </button>
                  </div>
                ) : (
                  <div className="relative text-center py-6">
                    <div className={cn(
                      "w-20 h-20 mx-auto mb-4 rounded-2xl flex items-center justify-center transition-all duration-300",
                      isDraggingOverRecipe
                        ? "bg-gradient-to-br from-purple-500 to-pink-600 scale-110 shadow-xl"
                        : "bg-gradient-to-br from-gray-300 to-gray-400"
                    )}>
                      <BookOpen className="h-10 w-10 text-white" />
                    </div>
                    <p className={cn(
                      "text-base font-bold mb-2 transition-colors",
                      isDraggingOverRecipe ? "text-purple-700" : "text-gray-700"
                    )}>
                      {isDraggingOverRecipe ? "Drop recipe here!" : "Link a Recipe (Optional)"}
                    </p>
                    <p className="text-sm text-gray-500">
                      Drag from the right panel or skip this step
                    </p>
                  </div>
                )}
              </div>

              {/* Pricing Section */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                    <DollarSign className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-base font-bold text-gray-900">Pricing Details</h3>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="basePrice" className="text-sm font-semibold text-gray-700">
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
                      className="h-12 text-lg font-semibold border-2 border-gray-200 focus:border-green-400 focus:ring-2 focus:ring-green-100"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="currency" className="text-sm font-semibold text-gray-700">Currency</Label>
                    <Select
                      value={formData.pricing?.currency || "PKR"}
                      onValueChange={(value) => handlePricingChange("currency", value)}
                    >
                      <SelectTrigger className="h-12 border-2 border-gray-200 focus:border-green-400">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PKR">🇵🇰 PKR - Pakistani Rupee</SelectItem>
                        <SelectItem value="SAR">🇸🇦 SAR - Saudi Riyal</SelectItem>
                        <SelectItem value="USD">🇺🇸 USD - US Dollar</SelectItem>
                        <SelectItem value="EUR">🇪🇺 EUR - Euro</SelectItem>
                        <SelectItem value="GBP">🇬🇧 GBP - British Pound</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between p-4 bg-white/60 rounded-lg border-2 border-green-200">
                  <span className="text-sm font-semibold text-gray-700">Price Includes Tax</span>
                  <Switch
                    id="priceIncludesTax"
                    checked={formData.pricing?.priceIncludesTax || false}
                    onCheckedChange={(checked) => handlePricingChange("priceIncludesTax", checked)}
                  />
                </div>
              </div>

              {/* Advanced Options Toggle */}
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="w-full flex items-center justify-between p-4 rounded-lg border-2 border-gray-200 hover:border-blue-300 bg-white hover:shadow-md transition-all duration-200"
              >
                <span className="text-sm font-semibold text-gray-700">Advanced Options</span>
                <ChevronDown className={cn(
                  "h-5 w-5 text-gray-400 transition-transform duration-200",
                  showAdvanced && "rotate-180"
                )} />
              </button>

              {showAdvanced && (
                <div className="space-y-6 animate-in slide-in-from-top-2 duration-300">
                  {/* Tags */}
                  <div className="space-y-2">
                    <Label htmlFor="tags" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <Tag className="h-4 w-4 text-gray-400" />
                      Tags
                    </Label>
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
                        placeholder="Type and press Enter..."
                        className="h-12 border-2 border-gray-200 focus:border-blue-400"
                      />
                      <Button
                        type="button"
                        onClick={handleAddTag}
                        className="h-12 px-6 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                      >
                        <Plus className="h-5 w-5" />
                      </Button>
                    </div>
                    {formData.tags && formData.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {formData.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="group px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 text-blue-700 text-sm font-medium rounded-lg flex items-center gap-2 hover:shadow-md transition-all duration-200"
                          >
                            <Tag className="h-3.5 w-3.5" />
                            {tag}
                            <button
                              type="button"
                              onClick={() => handleRemoveTag(tag)}
                              className="p-0.5 rounded-full hover:bg-red-100 transition-colors"
                            >
                              <X className="h-3.5 w-3.5 text-blue-600 group-hover:text-red-600" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Image Upload */}
                  <div className="space-y-2">
                    <Label htmlFor="imageUrl" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <ImageIcon className="h-4 w-4 text-gray-400" />
                      Image
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="imageUrl"
                        value={formData.media?.[0]?.url || ""}
                        onChange={(e) => {
                          const url = e.target.value;
                          handleFieldChange("media", url ? [{ url, alt: formData.name || "", type: "image" }] : []);
                        }}
                        placeholder="Paste image URL here..."
                        className="h-12 border-2 border-gray-200 focus:border-blue-400"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        className="h-12 px-6 border-2 border-gray-200 hover:border-blue-400"
                        onClick={() => toast.info("File upload coming soon!")}
                      >
                        <Upload className="h-5 w-5 mr-2" />
                        Upload
                      </Button>
                    </div>

                    {formData.media?.[0]?.url && (
                      <div className="relative rounded-xl border-2 border-gray-200 p-4 bg-white shadow-sm">
                        <div className="flex items-center gap-4">
                          <div className="w-24 h-24 rounded-lg border-2 border-gray-200 overflow-hidden bg-gray-50 flex items-center justify-center shadow-md">
                            <img
                              src={formData.media[0].url}
                              alt="Preview"
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                              }}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate">
                              {formData.name || "Menu Item Image"}
                            </p>
                            <p className="text-xs text-gray-500 truncate mt-1">
                              {formData.media[0].url}
                            </p>
                            <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                              <Check className="h-3 w-3" /> Image loaded successfully
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleFieldChange("media", [])}
                            className="group p-2 rounded-lg hover:bg-red-50 border-2 border-transparent hover:border-red-200 transition-all"
                          >
                            <X className="h-5 w-5 text-gray-400 group-hover:text-red-600" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Display Order and Status */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="displayOrder" className="text-sm font-semibold text-gray-700">
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
                        placeholder="0"
                        className="h-12 border-2 border-gray-200 focus:border-blue-400"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-700">Status</Label>
                      <div className="h-12 flex items-center justify-between px-4 rounded-lg border-2 border-gray-200 bg-white">
                        <span className="text-sm font-medium text-gray-700">Active</span>
                        <Switch
                          id="isActive"
                          checked={formData.isActive !== false}
                          onCheckedChange={(checked) => handleFieldChange("isActive", checked)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Panel - Recipes */}
          <div className="w-80 border-l border-[#d5d5dd] bg-gradient-to-b from-purple-50/50 to-white flex flex-col shadow-inner">
            <div className="px-5 py-4 border-b border-purple-100 bg-white/90 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-md">
                  <BookOpen className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">Recipes</h3>
                  <p className="text-xs text-gray-500">{filteredRecipes.length} available</p>
                </div>
              </div>

              {/* Search Box */}
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-purple-500 transition-colors" />
                <Input
                  value={recipeSearch}
                  onChange={(e) => setRecipeSearch(e.target.value)}
                  placeholder="Search recipes..."
                  className="pl-10 h-10 text-sm border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
              <div
                onClick={() => handleRecipeSelect("")}
                className={cn(
                  "group px-4 py-3.5 rounded-lg transition-all duration-200 cursor-pointer",
                  "border-2 flex items-center gap-3",
                  !selectedRecipe || selectedRecipe === 'none'
                    ? "bg-gradient-to-r from-gray-100 to-gray-200 border-gray-300 shadow-md"
                    : "bg-white border-gray-200 hover:border-purple-300 hover:shadow-md"
                )}
              >
                <span className="text-sm font-semibold flex-1">
                  {!selectedRecipe || selectedRecipe === 'none' ? "✓ No Recipe" : "No Recipe"}
                </span>
              </div>

              {filteredRecipes.length === 0 && recipeSearch && (
                <div className="text-center py-12">
                  <AlertCircle className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm font-medium text-gray-500">No recipes found</p>
                  <p className="text-xs text-gray-400 mt-1">Try a different search</p>
                </div>
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
                      "group relative px-4 py-3.5 rounded-lg transition-all duration-200 cursor-move",
                      "border-2 flex items-center gap-3",
                      isSelected
                        ? "bg-gradient-to-r from-purple-500 to-purple-600 border-purple-600 text-white shadow-lg shadow-purple-200 scale-[1.02]"
                        : "bg-white border-gray-200 hover:border-purple-300 hover:shadow-md text-gray-700 hover:scale-[1.01]"
                    )}
                  >
                    <GripVertical className={cn(
                      "h-5 w-5 flex-shrink-0 cursor-grab active:cursor-grabbing transition-colors",
                      isSelected ? "text-purple-200" : "text-gray-300 group-hover:text-purple-400"
                    )} />

                    <div className="flex-1 min-w-0">
                      <p className={cn(
                        "text-sm font-semibold truncate",
                        isSelected ? "text-white" : "text-gray-900"
                      )}>
                        {recipe.name}
                      </p>
                      {recipe.type && (
                        <p className={cn(
                          "text-xs truncate mt-0.5",
                          isSelected ? "text-purple-100" : "text-gray-500"
                        )}>
                          {recipe.type === 'sub' ? 'Sub Recipe' : 'Final Recipe'}
                        </p>
                      )}
                    </div>

                    {isSelected && (
                      <div className="flex-shrink-0">
                        <Check className="h-5 w-5 text-white animate-in zoom-in duration-200" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Recipe Variations */}
            {selectedRecipe && selectedRecipe !== 'none' && (
              <div className="border-t-2 border-purple-100 bg-white p-4 max-h-72 overflow-y-auto custom-scrollbar">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-bold text-purple-600 uppercase tracking-wider flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    Variations
                  </p>
                  {loadingVariations && (
                    <Loader2 className="h-4 w-4 animate-spin text-purple-600" />
                  )}
                </div>

                {!loadingVariations && recipeVariations.length === 0 && (
                  <p className="text-xs text-gray-500 italic text-center py-4">No variations available</p>
                )}

                {!loadingVariations && recipeVariations.length > 0 && (
                  <div className="space-y-2">
                    {recipeVariations.map((variation: any, index: number) => (
                      <div
                        key={variation._id || index}
                        className="p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border-2 border-purple-200 hover:shadow-md transition-all duration-200"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-bold text-purple-900">{variation.name}</p>
                          <span className={cn(
                            "px-2 py-0.5 text-[10px] font-bold rounded-full uppercase",
                            variation.type === 'size' ? 'bg-blue-100 text-blue-700' :
                            variation.type === 'flavor' ? 'bg-pink-100 text-pink-700' :
                            variation.type === 'crust' ? 'bg-orange-100 text-orange-700' :
                            'bg-green-100 text-green-700'
                          )}>
                            {variation.type}
                          </span>
                        </div>
                        {variation.description && (
                          <p className="text-xs text-purple-700 mt-1">{variation.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {selectedRecipe && selectedRecipe !== 'none' && (
              <div className="p-3 border-t border-purple-100 bg-purple-50/50">
                <div className="flex items-center gap-2 text-xs text-purple-700">
                  <Info className="h-4 w-4" />
                  <span className="font-medium">Drag or click to change recipe</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="px-8 py-5 border-t-2 border-[#d5d5dd] bg-white/90 backdrop-blur-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={cn(
              "w-2 h-2 rounded-full animate-pulse",
              completionPercentage === 100 ? "bg-green-500" : "bg-orange-500"
            )} />
            <span className="text-sm font-medium text-gray-600">
              {completionPercentage === 100 ? "Ready to save" : `${100 - completionPercentage}% remaining`}
            </span>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={onClose}
              variant="outline"
              className="px-8 h-12 border-2 border-gray-300 hover:border-gray-400 font-semibold"
              disabled={actionLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={actionLoading || completionPercentage < 50}
              className="px-10 h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
            >
              {actionLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
              {editingItem ? "Update Item" : "Create Item"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #3b82f6, #8b5cf6);
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #2563eb, #7c3aed);
        }
      `}</style>
    </Dialog>
  );
}
