"use client";

import { Toast } from "@/lib/util/toast-helpers";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Loader2, Plus, X, Search, UtensilsCrossed, ChefHat, Package, Info, ChevronDown, ChevronUp, Edit2, Trash2, ChevronRight } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogBody, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { CustomTooltip } from "@/components/ui/custom-tooltip";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { cn } from "@/lib/utils";
import { MenuCategoryService } from "@/lib/services/menu-category-service";
import { MenuItemService, TenantMenuItem } from "@/lib/services/menu-item-service";
import { RecipeService } from "@/lib/services/recipe-service";
import { MenuVariationsService } from "@/lib/services/menu-variations-service";
import { logError } from "@/lib/util/logger";
import { formatPrice } from "@/lib/util/formatters";
import { BatchList } from "@/components/ui/batch-list";

// Interfaces
interface MenuItemFormData {
  id: string;
  name: string;
  description: string;
  categoryId: string;
  categoryName: string;
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
  editingItem?: any | null;
  onSubmit?: (data: any) => Promise<any>;
  actionLoading?: boolean;
  categories: any[];
  recipes: any[];
  onSuccess?: () => void;
}

export default function MenuItemModalBatch({
  isOpen,
  onClose,
  editingItem,
  onSubmit,
  actionLoading = false,
  categories,
  recipes,
  onSuccess,
}: MenuItemModalBatchProps) {
  // Tab state
  const [currentTab, setCurrentTab] = useState<"menu" | "category">("menu");

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

  // Menu item states
  const [menuItemFormData, setMenuItemFormData] = useState<MenuItemFormData>({
    id: `temp-${Date.now()}`,
    name: "",
    description: "",
    categoryId: "",
    categoryName: "",
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
  });

  // Batch creation states
  const [menuItemsList, setMenuItemsList] = useState<MenuItemFormData[]>([]);
  const [activeMenuItemId, setActiveMenuItemId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [addingToList, setAddingToList] = useState(false);
  const [scrollToMenuItemId, setScrollToMenuItemId] = useState<string | null>(null);

  // Search states
  const [categorySearch, setCategorySearch] = useState("");
  const [recipeSearch, setRecipeSearch] = useState("");

  // Drag states
  const [draggedCategory, setDraggedCategory] = useState<string | null>(null);
  const [draggedRecipe, setDraggedRecipe] = useState<string | null>(null);

  // Collapsible panel states
  const [categoriesExpanded, setCategoriesExpanded] = useState(true);
  const [recipesExpanded, setRecipesExpanded] = useState(true);
  const [menuFormExpanded, setMenuFormExpanded] = useState(true);

  // Recipe lazy loading states
  const [localRecipes, setLocalRecipes] = useState<any[]>([]);
  const [recipesPage, setRecipesPage] = useState(1);
  const [recipesHasMore, setRecipesHasMore] = useState(true);
  const [recipesLoading, setRecipesLoading] = useState(false);
  const recipesScrollRef = React.useRef<HTMLDivElement>(null);

  // Local categories state (for runtime creation like sub recipes)
  const [localCategories, setLocalCategories] = useState<any[]>([]);

  // Category editing states
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  // Delete confirmation dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<{ id: string; name: string } | null>(null);

  // Responsive panel toggles
  useEffect(() => {
    const handleInitialResponsive = () => {
      if (window.innerWidth < 1024) setCategoriesExpanded(false);
      if (window.innerWidth < 1280) setRecipesExpanded(false);
    };
    handleInitialResponsive();
  }, []);

  // Initialize modal state
  useEffect(() => {
    if (isOpen) {
      if (editingItem && editingItem._raw) {
        // EDIT MODE: Load existing menu item
        const raw = editingItem._raw;

        const categoryId = typeof raw.categoryId === 'object' && raw.categoryId?._id
          ? raw.categoryId._id
          : raw.categoryId || "";
        const recipeId = typeof raw.recipeId === 'object' && raw.recipeId?._id
          ? raw.recipeId._id
          : raw.recipeId || "";

        const category = categories.find(c => String(c._id || c.id) === String(categoryId));
        setSelectedCategoryId(String(categoryId));
        setSelectedCategoryName(category?.name || "");

        const editMenuItem: MenuItemFormData = {
          id: raw._id || raw.id || `edit-${Date.now()}`,
          name: raw.name || "",
          description: raw.description || "",
          categoryId: String(categoryId),
          categoryName: category?.name || "",
          recipeId: recipeId ? String(recipeId) : undefined,
          recipeName: typeof raw.recipeId === 'object' ? raw.recipeId?.name : undefined,
          pricing: {
            basePrice: raw.pricing?.basePrice || 0,
            priceIncludesTax: raw.pricing?.priceIncludesTax || false,
            currency: raw.pricing?.currency || "PKR",
          },
          isActive: raw.isActive !== false,
          displayOrder: raw.displayOrder || 0,
          tags: raw.tags || [],
          media: raw.media || [],
          selectedVariations: [],
          recipeVariations: [],
        };

        setMenuItemFormData(editMenuItem);

        if (recipeId) {
          fetchRecipeVariationsForEdit(String(recipeId));
        }
      } else {
        // CREATE MODE: Reset everything
        resetForm();
      }

      setCategorySearch("");
      setRecipeSearch("");
      setLocalRecipes(recipes || []);
      setLocalCategories([]);
    }
  }, [isOpen, editingItem, categories, recipes]);

  const resetForm = () => {
    setSelectedCategoryId("");
    setSelectedCategoryName("");
    setCategoryFormData({
      name: "",
      description: "",
      parentId: null,
      displayOrder: 0,
      isActive: true,
    });
    setMenuItemFormData({
      id: `temp-${Date.now()}`,
      name: "",
      description: "",
      categoryId: "",
      categoryName: "",
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
    });
    setMenuItemsList([]);
    setActiveMenuItemId(null);
    setMenuFormExpanded(true);
  };

  const fetchRecipeVariationsForEdit = async (recipeId: string) => {
    try {
      const recipeResponse = await RecipeService.getRecipe(recipeId, true);
      if (recipeResponse.success && recipeResponse.data) {
        const { variants } = recipeResponse.data;
        if (variants && Array.isArray(variants)) {
          setMenuItemFormData(prev => ({ ...prev, recipeVariations: variants }));
        }
      }
    } catch (error) {
      logError("Error fetching recipe variations for edit", error, {
        component: "MenuItemModalBatch",
        action: "fetchRecipeVariationsForEdit",
        recipeId,
      });
    }
  };

  // Category handlers
  const handleCategorySelect = (categoryId: string) => {
    const category = categories.find(c => String(c._id || c.id) === categoryId);
    const categoryName = category?.name || "";
    setSelectedCategoryId(categoryId);
    setSelectedCategoryName(categoryName);
    // Update the current form with selected category
    setMenuItemFormData(prev => ({
      ...prev,
      categoryId: categoryId,
      categoryName: categoryName,
    }));
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
      Toast.error("Category name is required");
      return;
    }

    setCreatingCategory(true);
    try {
      const payload = {
        name: categoryFormData.name,
        slug: categoryFormData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
        code: "",
        description: categoryFormData.description,
        parentId: categoryFormData.parentId || null,
        isActive: categoryFormData.isActive,
        displayOrder: categoryFormData.displayOrder,
        metadata: {},
      };

      const response = await MenuCategoryService.createCategory(payload);

      if (response.success && response.data) {
        Toast.success(`Category "${categoryFormData.name}" created successfully`);

        // Add to local categories for instant display (like sub recipes)
        const newCategory = {
          _id: response.data._id || response.data.id,
          id: response.data._id || response.data.id,
          ID: response.data._id || response.data.id,
          name: response.data.name || categoryFormData.name,
          Name: response.data.name || categoryFormData.name,
          description: response.data.description || categoryFormData.description,
          Description: response.data.description || categoryFormData.description,
          isActive: response.data.isActive !== false,
          Status: response.data.isActive !== false ? "Active" : "Inactive",
          displayOrder: response.data.displayOrder || categoryFormData.displayOrder,
          DisplayOrder: response.data.displayOrder || categoryFormData.displayOrder,
          parentId: response.data.parentId || null,
          ParentCategory: response.data.parentId || null,
        };

        setLocalCategories(prev => {
          const updated = [...prev, newCategory];
          return updated;
        });

        // Reset form
        setCategoryFormData({
          name: "",
          description: "",
          parentId: null,
          displayOrder: 0,
          isActive: true,
        });

        // Refresh parent categories list in background
        if (onSuccess) {
          setTimeout(() => onSuccess(), 100);
        }
      } else {
        Toast.error(response.message || "Failed to create category");
      }
    } catch (error) {
      logError("Error creating category", error, {
        component: "MenuItemModalBatch",
        action: "handleQuickCreateCategory",
      });
      Toast.error("Failed to create category");
    } finally {
      setCreatingCategory(false);
    }
  };

  const handleEditCategory = (categoryId: string) => {
    const category = allCategories.find(c => String(c._id || c.id || c.ID) === categoryId);
    if (!category) return;

    // Load category data into form
    setCategoryFormData({
      name: category.name || category.Name || "",
      description: category.description || category.Description || "",
      parentId: category.parentId || category.ParentCategory || null,
      displayOrder: category.displayOrder || category.DisplayOrder || 0,
      isActive: category.isActive !== false && category.Status !== "Inactive",
    });

    setEditingCategoryId(categoryId);
  };

  const handleUpdateCategory = async () => {
    if (!categoryFormData.name) {
      Toast.error("Category name is required");
      return;
    }

    if (!editingCategoryId) return;

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

      const response = await MenuCategoryService.updateCategory(editingCategoryId, payload);

      if (response.success && response.data) {
        Toast.success(`Category "${categoryFormData.name}" updated successfully`);

        // Update in local categories
        setLocalCategories(prev => {
          const index = prev.findIndex(c => String(c._id || c.id || c.ID) === editingCategoryId);
          if (index !== -1) {
            const updated = [...prev];
            updated[index] = {
              ...updated[index],
              name: response.data.name || categoryFormData.name,
              Name: response.data.name || categoryFormData.name,
              description: response.data.description || categoryFormData.description,
              Description: response.data.description || categoryFormData.description,
              isActive: response.data.isActive !== false,
              Status: response.data.isActive !== false ? "Active" : "Inactive",
              displayOrder: response.data.displayOrder || categoryFormData.displayOrder,
              DisplayOrder: response.data.displayOrder || categoryFormData.displayOrder,
              parentId: response.data.parentId || null,
              ParentCategory: response.data.parentId || null,
            };
            return updated;
          }
          return prev;
        });

        // Reset form and editing state
        setCategoryFormData({
          name: "",
          description: "",
          parentId: null,
          displayOrder: 0,
          isActive: true,
        });
        setEditingCategoryId(null);

        // Refresh parent categories list in background
        if (onSuccess) {
          setTimeout(() => onSuccess(), 100);
        }
      } else {
        Toast.error(response.message || "Failed to update category");
      }
    } catch (error) {
      logError("Error updating category", error, {
        component: "MenuItemModalBatch",
        action: "handleUpdateCategory",
        categoryId: editingCategoryId,
      });
      Toast.error("Failed to update category");
    } finally {
      setCreatingCategory(false);
    }
  };

  const handleCancelCategoryEdit = () => {
    setCategoryFormData({
      name: "",
      description: "",
      parentId: null,
      displayOrder: 0,
      isActive: true,
    });
    setEditingCategoryId(null);
  };

  const toggleCategoryExpansion = (categoryId: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  const handleDeleteCategoryClick = (categoryId: string) => {
    const category = allCategories.find(c => String(c._id || c.id || c.ID) === categoryId);
    if (!category) return;

    const categoryName = category.name || category.Name || "";
    setCategoryToDelete({ id: categoryId, name: categoryName });
    setDeleteDialogOpen(true);
  };

  const handleConfirmDeleteCategory = async () => {
    if (!categoryToDelete) return;

    const { id: categoryId, name: categoryName } = categoryToDelete;

    setCreatingCategory(true);
    try {
      const response = await MenuCategoryService.deleteCategory(categoryId);

      if (response.success) {
        Toast.success(`Category "${categoryName}" deleted successfully`);

        // Remove from local categories
        setLocalCategories(prev => prev.filter(c => String(c._id || c.id || c.ID) !== categoryId));

        // If we were editing this category, cancel edit
        if (editingCategoryId === categoryId) {
          handleCancelCategoryEdit();
        }

        // Refresh parent categories list in background
        if (onSuccess) {
          setTimeout(() => onSuccess(), 100);
        }
      } else {
        Toast.error(response.message || "Failed to delete category");
      }
    } catch (error) {
      logError("Error deleting category", error, {
        component: "MenuItemModalBatch",
        action: "handleConfirmDeleteCategory",
        categoryId,
      });
      Toast.error("Failed to delete category");
    } finally {
      setCreatingCategory(false);
      setCategoryToDelete(null);
    }
  };

  // Recipe drag handlers
  const handleRecipeDragStart = (recipeId: string) => {
    setDraggedRecipe(recipeId);
  };

  const handleRecipeDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleRecipeDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    if (!draggedRecipe) return;

    const recipe = localRecipes.find(r => String(r._id || r.id) === draggedRecipe);
    if (!recipe) return;

    const recipeId = String(recipe._id || recipe.id);
    const recipeName = recipe.name || "";

    setMenuItemFormData(prev => ({
      ...prev,
      recipeId: recipeId,
      recipeName: recipeName,
      name: prev.name || recipeName,
      pricing: {
        ...prev.pricing,
        basePrice: prev.pricing.basePrice === 0 && recipe.totalCost ? recipe.totalCost : prev.pricing.basePrice,
      },
    }));

    try {
      const recipeResponse = await RecipeService.getRecipe(recipeId, true);
      if (recipeResponse.success && recipeResponse.data) {
        const { variants } = recipeResponse.data;
        if (variants && Array.isArray(variants)) {
          setMenuItemFormData(prev => ({ ...prev, recipeVariations: variants }));
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
    Toast.success(`Recipe "${recipeName}" added to menu item`);
  };

  // Menu item field handlers
  const handleFieldChange = (field: keyof MenuItemFormData, value: any) => {
    setMenuItemFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddTag = (tag: string) => {
    if (tag.trim() && !menuItemFormData.tags.includes(tag.trim())) {
      setMenuItemFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag.trim()]
      }));
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setMenuItemFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleVariationToggle = (variationId: string) => {
    const selectedVariations = menuItemFormData.selectedVariations.includes(variationId)
      ? menuItemFormData.selectedVariations.filter(id => id !== variationId)
      : [...menuItemFormData.selectedVariations, variationId];

    setMenuItemFormData(prev => ({ ...prev, selectedVariations }));
  };

  // Batch menu creation
  const handleAddToList = () => {
    if (!menuItemFormData.name) {
      Toast.error("Please enter a menu item name before adding to list");
      return;
    }

    if (!menuItemFormData.categoryId) {
      Toast.error("Please select a category before adding to list");
      return;
    }

    if (menuItemFormData.pricing.basePrice <= 0) {
      Toast.error("Please set a valid price before adding to list");
      return;
    }

    const newMenuItem = {
      ...menuItemFormData,
      id: `temp-${Date.now()}-${Math.random()}`,
    };

    setMenuItemsList([...menuItemsList, newMenuItem]);

    // Reset form for next item but KEEP the category
    setMenuItemFormData({
      id: `temp-${Date.now()}`,
      name: "",
      description: "",
      categoryId: menuItemFormData.categoryId, // Keep current category
      categoryName: menuItemFormData.categoryName, // Keep current category name
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
    });

    Toast.success(`"${newMenuItem.name}" added to list`, { duration: 2000 });

    Toast.success(`"${newMenuItem.name}" added to list`, { duration: 2000 });
    setScrollToMenuItemId(newMenuItem.id);
  };

  const handleRemoveFromList = (id: string) => {
    const item = menuItemsList.find(m => m.id === id);
    setMenuItemsList(menuItemsList.filter(m => m.id !== id));
    if (item) {
      Toast.success(`"${item.name}" removed from list`, { duration: 2000 });
    }
  };

  const handleEditFromList = (id: string) => {
    const item = menuItemsList.find(m => m.id === id);
    if (item) {
      // Save current form if it has content
      if (menuItemFormData.name && menuItemFormData.categoryId && menuItemFormData.pricing.basePrice > 0) {
        handleAddToList();
      }

      // Load selected item into form and update selected category
      setMenuItemFormData({ ...item });
      setSelectedCategoryId(item.categoryId);
      setSelectedCategoryName(item.categoryName);
      setMenuItemsList(menuItemsList.filter(m => m.id !== id));
      setActiveMenuItemId(null);
    }
  };

  // Submit handler
  const handleSubmit = async () => {
    const isEditMode = editingItem && editingItem._raw;

    // Collect all items to submit
    const finalItemsToSubmit: MenuItemFormData[] = [...menuItemsList];

    // Validate and add current form if it has content
    const hasCurrentFormContent = menuItemFormData.name || menuItemFormData.pricing.basePrice > 0;

    if (hasCurrentFormContent) {
      if (!menuItemFormData.name) {
        Toast.error("Please enter a menu item name");
        return;
      }

      if (!menuItemFormData.categoryId) {
        Toast.error("Please select a category");
        return;
      }

      if (menuItemFormData.pricing.basePrice <= 0) {
        Toast.error("Please set a valid price");
        return;
      }

      finalItemsToSubmit.push(menuItemFormData);
    }

    // Check if we have anything to submit
    if (finalItemsToSubmit.length === 0 && !isEditMode) {
      Toast.error("No menu items to submit. Please add at least one item.");
      return;
    }

    setSubmitting(true);

    try {
      if (isEditMode && onSubmit) {
        // EDIT MODE: Update single item
        const payload = {
          name: menuItemFormData.name,
          slug: menuItemFormData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
          code: "",
          description: menuItemFormData.description,
          categoryId: menuItemFormData.categoryId,
          recipeId: menuItemFormData.recipeId || undefined,
          pricing: menuItemFormData.pricing,
          isActive: menuItemFormData.isActive,
          displayOrder: menuItemFormData.displayOrder,
          tags: menuItemFormData.tags,
          media: menuItemFormData.media,
          branchIds: [],
          metadata: {},
        };

        await onSubmit(payload);
        onClose();
      } else {
        // CREATE MODE: Batch create items
        let successCount = 0;
        let failCount = 0;

        for (const menuItem of finalItemsToSubmit) {
          try {
            const payload: Partial<TenantMenuItem> = {
              name: menuItem.name,
              description: menuItem.description,
              categoryId: menuItem.categoryId, // Use each item's own category
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
          Toast.success(`${successCount} menu item(s) created successfully`);
          resetForm();
          if (onSuccess) onSuccess();
          onClose();
        }

        if (failCount > 0) {
          Toast.error(`${failCount} menu item(s) failed to create`);
        }
      }
    } catch (error) {
      logError("Error submitting menu items", error, {
        component: "MenuItemModalBatch",
        action: "handleSubmit",
      });
      Toast.error(editingItem ? "Failed to update menu item" : "Failed to create menu items");
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
  const allCategories = useMemo(() => {
    // Merge existing categories with locally created ones
    const existingCategories = categories;
    const existingIds = new Set(existingCategories.map(c => c._id || c.id || c.ID));
    const newLocalCategories = localCategories.filter(c => !existingIds.has(c._id || c.id || c.ID));
    const merged = [...existingCategories, ...newLocalCategories];

    return merged;
  }, [categories, localCategories]);

  const filteredCategories = useMemo(() => {
    return allCategories.filter(cat =>
      (cat.name || cat.Name || "").toLowerCase().includes(categorySearch.toLowerCase())
    );
  }, [allCategories, categorySearch]);

  // Organize categories into hierarchical structure sorted by displayOrder
  const hierarchicalCategories = useMemo(() => {
    const sorted = [...filteredCategories].sort((a, b) => {
      const orderA = a.displayOrder || a.DisplayOrder || 0;
      const orderB = b.displayOrder || b.DisplayOrder || 0;
      return orderA - orderB;
    });

    const parentCategories: any[] = [];
    const childrenMap: { [key: string]: any[] } = {};

    // First pass: separate parents and children
    sorted.forEach(cat => {
      const catId = String(cat._id || cat.id || cat.ID);
      const parentId = cat.parentId || cat.ParentCategory;

      if (!parentId) {
        parentCategories.push(cat);
      } else {
        const parentIdStr = String(parentId);
        if (!childrenMap[parentIdStr]) {
          childrenMap[parentIdStr] = [];
        }
        childrenMap[parentIdStr].push(cat);
      }
    });

    // Second pass: attach children to parents
    const result: any[] = [];
    parentCategories.forEach(parent => {
      const parentId = String(parent._id || parent.id || parent.ID);
      result.push({
        ...parent,
        _children: childrenMap[parentId] || [],
      });
    });

    return result;
  }, [filteredCategories]);

  const filteredRecipes = useMemo(() => {
    return localRecipes.filter(recipe =>
      recipe.name.toLowerCase().includes(recipeSearch.toLowerCase())
    );
  }, [localRecipes, recipeSearch]);

  const isEditMode = !!(editingItem && editingItem._raw);

  // Render tab content
  const renderMenuTab = () => (
    <div className="flex h-full w-full">
      {/* Left Panel - Categories */}
      <div className={cn(
        "flex flex-col border-r border-[#d5d5dd] shrink-0 bg-white transition-all duration-300 overflow-hidden",
        categoriesExpanded ? "w-[20%]" : "w-0 md:w-10 opacity-0 md:opacity-100"
      )}>
        <div
          className="flex items-center justify-between cursor-pointer select-none px-3 h-[41px] leading-none box-border bg-[#f9fafb] border-b border-[#d5d5dd]"
          onClick={() => setCategoriesExpanded(!categoriesExpanded)}
        >
          <div className="flex items-center gap-2 overflow-hidden">
            <UtensilsCrossed className="h-4 w-4 text-[#6b7280] shrink-0" />
            <span className={cn(
              "text-[14px] font-semibold text-[#374151] uppercase leading-[14px] truncate transition-opacity duration-200",
              !categoriesExpanded && "opacity-0 md:hidden"
            )}>
              Categories
            </span>
            {filteredCategories.length > 0 && (
              <span className="text-[10px] font-medium text-[#6b7280] bg-white border border-[#d5d5dd] px-1.5 py-0.5 rounded leading-[10px]">
                {filteredCategories.length}
              </span>
            )}
          </div>
          {categoriesExpanded ? (
            <ChevronUp className="h-4 w-4 text-[#9ca3af]" />
          ) : (
            <ChevronDown className="h-4 w-4 text-[#9ca3af]" />
          )}
        </div>

        {categoriesExpanded && (
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="h-[41px] px-3 flex items-center bg-white relative border-b border-[#d5d5dd]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9ca3af]" />
              <input
                type="text"
                value={categorySearch}
                onChange={(e) => setCategorySearch(e.target.value)}
                placeholder="Search categories..."
                className="pl-9 h-full w-full border-0 p-0 focus:ring-0 focus:outline-none bg-transparent text-[15px] leading-tight"
              />
            </div>

            <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {filteredCategories.length === 0 ? (
                <div className="text-center py-8">
                  <UtensilsCrossed className="h-10 w-10 text-[#d1d5db] mx-auto mb-2" />
                  <p className="text-sm text-[#9ca3af]">No categories found</p>
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
                        "group relative flex items-center h-[41px] px-3 border-b border-[#e5e7eb] transition-all",
                        isSelected ? "bg-[#e0f2fe]" : "bg-white",
                        "cursor-grab active:cursor-grabbing hover:bg-[#e0f2fe]"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <UtensilsCrossed className={cn(
                          "h-4 w-4 shrink-0",
                          isSelected ? "text-[#0284c7]" : "text-[#6b7280]"
                        )} />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-[#111827] truncate leading-tight">
                            {category.name}
                          </div>
                          {category.description && (
                            <div className="text-[10px] text-[#9ca3af] truncate leading-tight">
                              {category.description}
                            </div>
                          )}
                        </div>
                      </div>
                      {isSelected && (
                        <div className="absolute top-1/2 -translate-y-1/2 right-3">
                          <span className="text-[9px] font-semibold bg-[#0284c7] text-white px-1.5 py-0.5 rounded">
                            SELECTED
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>

      {/* Center Panel - Menu Item Form */}
      <div className="w-[60%] flex-1 flex flex-col overflow-hidden min-w-0 bg-white relative">
        {/* Mobile Panel Toggles */}
        <div className="lg:hidden absolute left-0 top-32 z-40">
          <button
            onClick={() => setCategoriesExpanded(!categoriesExpanded)}
            className="p-1.5 bg-[#111827] text-white rounded-r-md shadow-lg hover:bg-[#1f2937] transition-colors"
            title={categoriesExpanded ? "Collapse Categories" : "Expand Categories"}
          >
            <UtensilsCrossed className="h-4 w-4" />
          </button>
        </div>
        <div className="xl:hidden absolute right-0 top-32 z-40">
          <button
            onClick={() => setRecipesExpanded(!recipesExpanded)}
            className="p-1.5 bg-[#111827] text-white rounded-l-md shadow-lg hover:bg-[#1f2937] transition-colors"
            title={recipesExpanded ? "Collapse Recipes" : "Expand Recipes"}
          >
            <ChefHat className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden m-0 p-0" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {/* Saved Menu Items List */}
          <BatchList
            items={menuItemsList}
            expandedId={activeMenuItemId}
            onToggleExpand={(id) => setActiveMenuItemId(id)}
            onEdit={handleEditFromList}
            onRemove={handleRemoveFromList}
            scrollToId={scrollToMenuItemId}
            renderHeader={(menuItem, index) => (
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <div className="h-4 w-4 rounded-full bg-[#22c55e] text-white flex items-center justify-center text-[10px] font-semibold shrink-0">
                  {index + 1}
                </div>
                <span className="text-xs font-semibold text-[#374151] leading-none truncate">
                  {menuItem.name}
                </span>
                <span className="text-[9px] font-bold bg-[#0ea5e9] text-white px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0">
                  {menuItem.categoryName}
                </span>
                <span className="text-xs font-semibold text-[#22c55e] leading-none shrink-0">
                  {formatPrice(menuItem.pricing.basePrice)} {menuItem.pricing.currency}
                </span>
              </div>
            )}
            renderDetails={(menuItem) => (
              <div className="text-xs text-[#6b7280] space-y-2">
                <p><span className="font-medium">Category:</span> <span className="text-[#0ea5e9] font-bold">{menuItem.categoryName}</span></p>
                {menuItem.description && <p><span className="font-medium">Description:</span> {menuItem.description}</p>}
                {menuItem.recipeName && <p><span className="font-medium">Recipe:</span> {menuItem.recipeName}</p>}
                <p><span className="font-medium">Price:</span> {formatPrice(menuItem.pricing.basePrice)} {menuItem.pricing.currency}</p>
                <p><span className="font-medium">Status:</span> {menuItem.isActive ? "Active" : "Inactive"}</p>
                {menuItem.tags.length > 0 && (
                  <div>
                    <span className="font-medium">Tags:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {menuItem.tags.map((tag, i) => (
                        <span key={i} className="text-[9px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          />

          {/* Current Menu Item Form */}
          <div
            className="sticky top-0 z-20 flex items-center justify-between cursor-pointer select-none px-3 h-[41px] leading-none box-border bg-[#f9fafb] border-b border-[#d5d5dd]"
            onClick={() => setMenuFormExpanded(!menuFormExpanded)}
          >
            <div className="flex items-center gap-2">
              {menuItemsList.length > 0 && (
                <div className="h-4 w-4 rounded-full bg-[#e5e7eb] text-[#6b7280] flex items-center justify-center text-[10px] font-semibold">
                  {menuItemsList.length + 1}
                </div>
              )}
              <Package className="h-4 w-4 text-[#6b7280]" />
              <span className="text-[14px] font-semibold text-[#374151] uppercase leading-[14px]">
                {isEditMode ? "Edit Menu Item" : (menuItemFormData.name?.trim() || "New Menu Item")}
              </span>
              {!menuItemFormData.name?.trim() && menuItemsList.length > 0 && (
                <span className="text-[10px] text-[#9ca3af] leading-[10px]">(optional)</span>
              )}
            </div>
            <div className="flex items-center gap-1">
              {menuFormExpanded ? (
                <ChevronUp className="h-4 w-4 text-[#9ca3af]" />
              ) : (
                <ChevronDown className="h-4 w-4 text-[#9ca3af]" />
              )}
            </div>
          </div>

          {menuFormExpanded && (
            <div className="p-4">
              <div className="space-y-5">
                {/* Category Selector Drop Zone */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Label className="text-sm font-medium text-[#374151]">
                      Category <span className="text-[#ef4444]">*</span>
                    </Label>
                    <CustomTooltip label="Drag from left panel or click to select" direction="right">
                      <Info className="h-3.5 w-3.5 text-[#9ca3af] cursor-pointer" />
                    </CustomTooltip>
                  </div>

                  <div
                    onDragOver={handleCategoryDragOver}
                    onDrop={handleCategoryDrop}
                    className={cn(
                      "rounded-sm border-2 border-dashed transition-all hover:border-[#111827] hover:bg-gray-50 cursor-pointer",
                      selectedCategoryId
                        ? "bg-[#e0f2fe] border-[#0284c7] p-3"
                        : "bg-[#f8f8fa] border-[#d5d5dd] px-12 py-8 text-center"
                    )}
                  >
                    {selectedCategoryId ? (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <UtensilsCrossed className="h-4 w-4 text-[#0284c7]" />
                          <div>
                            <p className="text-xs font-bold text-[#0284c7] uppercase">Selected Category</p>
                            <p className="text-sm font-medium text-[#0c4a6e]">{selectedCategoryName}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            setSelectedCategoryId("");
                            setSelectedCategoryName("");
                          }}
                          className="text-[#0284c7] hover:text-[#0c4a6e] p-1 rounded-sm hover:bg-[#bae6fd] transition-colors"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ) : (
                      <div className="relative z-10 flex flex-col items-center">
                        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-sm bg-[#111827] shadow-lg">
                          <UtensilsCrossed className="h-6 w-6 text-white" />
                        </div>
                        <h3 className="mb-1 text-base font-bold text-[#111827]">No Category Selected</h3>
                        <p className="mx-auto max-w-sm text-sm text-[#656565]">
                          Drag a category here or click one from the <span className="font-semibold text-[#111827]">left panel</span>
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Recipe Drop Zone */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Label className="text-sm font-medium text-[#374151]">Recipe (Optional)</Label>
                    <CustomTooltip label="Drag from right panel" direction="right">
                      <Info className="h-3.5 w-3.5 text-[#9ca3af] cursor-pointer" />
                    </CustomTooltip>
                  </div>

                  <div
                    onDragOver={handleRecipeDragOver}
                    onDrop={handleRecipeDrop}
                    className={cn(
                      "rounded-sm border-2 border-dashed transition-all hover:border-[#111827] hover:bg-gray-50 cursor-pointer",
                      menuItemFormData.recipeId
                        ? "bg-purple-50 border-purple-300 p-3"
                        : "bg-[#f8f8fa] border-[#d5d5dd] px-12 py-8 text-center"
                    )}
                  >
                    {menuItemFormData.recipeId ? (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <ChefHat className="h-4 w-4 text-purple-600" />
                          <div>
                            <p className="text-xs font-bold text-purple-600 uppercase">Linked Recipe</p>
                            <p className="text-sm font-medium text-purple-900">{menuItemFormData.recipeName || "Recipe"}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            setMenuItemFormData(prev => ({
                              ...prev,
                              recipeId: undefined,
                              recipeName: undefined,
                              recipeVariations: [],
                              selectedVariations: [],
                            }));
                          }}
                          className="text-purple-600 hover:text-purple-800 p-1 rounded-sm hover:bg-purple-100 transition-colors"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ) : (
                      <div className="relative z-10 flex flex-col items-center">
                        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-sm bg-purple-600 shadow-lg">
                          <ChefHat className="h-6 w-6 text-white" />
                        </div>
                        <h3 className="mb-1 text-base font-bold text-[#111827]">No Recipe Linked</h3>
                        <p className="mx-auto max-w-sm text-sm text-[#656565]">
                          Drag a recipe here from the <span className="font-semibold text-[#111827]">right panel</span> (optional)
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Name */}
                <div>
                  <Label className="text-sm font-medium text-[#374151] mb-1.5 block">
                    Menu Item Name <span className="text-[#ef4444]">*</span>
                  </Label>
                  <Input
                    value={menuItemFormData.name}
                    onChange={(e) => handleFieldChange("name", e.target.value)}
                    placeholder="e.g., Margherita Pizza, Caesar Salad"
                    className="h-14 text-[15px]"
                  />
                </div>

                {/* Description */}
                <div>
                  <Label className="text-sm font-medium text-[#374151] mb-1.5 block">Description (Optional)</Label>
                  <Textarea
                    value={menuItemFormData.description}
                    onChange={(e) => handleFieldChange("description", e.target.value)}
                    placeholder="Brief description..."
                    className="min-h-[72px] resize-none text-[15px]"
                    rows={2}
                  />
                </div>

                {/* Price & Currency Row */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-[#374151] mb-1.5 block">
                      Base Price <span className="text-[#ef4444]">*</span>
                    </Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={menuItemFormData.pricing.basePrice === 0 ? "" : menuItemFormData.pricing.basePrice}
                      onChange={(e) => {
                        const val = e.target.value;
                        handleFieldChange("pricing", {
                          ...menuItemFormData.pricing,
                          basePrice: val === '' ? 0 : parseFloat(val) || 0,
                        });
                      }}
                      onFocus={(e) => e.target.select()}
                      placeholder="0.00"
                      className="h-14 text-[15px] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-[#374151] mb-1.5 block">Currency</Label>
                    <Select
                      value={menuItemFormData.pricing.currency}
                      onValueChange={(value) =>
                        handleFieldChange("pricing", {
                          ...menuItemFormData.pricing,
                          currency: value,
                        })
                      }
                    >
                      <SelectTrigger className="h-14 text-[15px]">
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
                <MenuItemTags
                  tags={menuItemFormData.tags}
                  onAddTag={handleAddTag}
                  onRemoveTag={handleRemoveTag}
                />

                {/* Active Status */}
                <div>
                  <Label className="text-sm font-medium text-[#374151] mb-1.5 block">Status</Label>
                  <div className="flex items-center justify-between rounded-sm border border-[#d5d5dd] bg-[#f8f8fa] px-4 h-14 w-full">
                    <span className="text-[#111827] text-sm font-medium">Active</span>
                    <Switch
                      checked={menuItemFormData.isActive === true}
                      onCheckedChange={(checked) => handleFieldChange("isActive", checked)}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Slab - Add to List */}
          {!isEditMode && (
            <Button
              type="button"
              onClick={handleAddToList}
              variant="outline"
              className={cn(
                "shrink-0 w-full h-[41px] rounded-none border-t border-x-0 border-b-0 border-[#d5d5dd] bg-white text-[15px] font-medium transition-all duration-200 hover:bg-[#111827] hover:text-white hover:border-[#111827] text-[#374151]",
                (!menuItemFormData.name || !menuItemFormData.categoryId || menuItemFormData.pricing.basePrice <= 0) && "opacity-50 grayscale cursor-not-allowed"
              )}
              disabled={!menuItemFormData.name || !menuItemFormData.categoryId || menuItemFormData.pricing.basePrice <= 0}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Another Menu Item
            </Button>
          )}
        </div>
      </div>

      {/* Right Panel - Recipes */}
      <div className={cn(
        "flex flex-col border-l border-[#d5d5dd] shrink-0 bg-white transition-all duration-300 overflow-hidden",
        recipesExpanded ? "w-[20%]" : "w-0 md:w-10 opacity-0 md:opacity-100"
      )}>
        <div
          className="flex items-center justify-between cursor-pointer select-none px-3 h-[41px] leading-none box-border bg-[#f9fafb] border-b border-[#d5d5dd]"
          onClick={() => setRecipesExpanded(!recipesExpanded)}
        >
          <div className="flex items-center gap-2 overflow-hidden">
            <ChefHat className="h-4 w-4 text-[#6b7280] shrink-0" />
            <span className={cn(
              "text-[14px] font-semibold text-[#374151] uppercase leading-[14px] truncate transition-opacity duration-200",
              !recipesExpanded && "opacity-0 md:hidden"
            )}>
              Recipes
            </span>
            {filteredRecipes.length > 0 && (
              <span className="text-[10px] font-medium text-[#6b7280] bg-white border border-[#d5d5dd] px-1.5 py-0.5 rounded leading-[10px]">
                {filteredRecipes.length}
              </span>
            )}
          </div>
          {recipesExpanded ? (
            <ChevronUp className="h-4 w-4 text-[#9ca3af]" />
          ) : (
            <ChevronDown className="h-4 w-4 text-[#9ca3af]" />
          )}
        </div>

        {recipesExpanded && (
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="h-[41px] px-3 flex items-center bg-white relative border-b border-[#d5d5dd]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9ca3af]" />
              <input
                type="text"
                value={recipeSearch}
                onChange={(e) => setRecipeSearch(e.target.value)}
                placeholder="Search recipes..."
                className="pl-9 h-full w-full focus:ring-0 focus:outline-none bg-transparent text-[15px] leading-tight border-0 p-0"
              />
            </div>

            <div
              ref={recipesScrollRef}
              className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {filteredRecipes.length === 0 ? (
                <div className="text-center py-8">
                  <ChefHat className="h-10 w-10 text-[#d1d5db] mx-auto mb-2" />
                  <p className="text-sm text-[#9ca3af]">No recipes found</p>
                </div>
              ) : (
                filteredRecipes.map((recipe) => {
                  const recipeId = String(recipe._id || recipe.id);
                  const recipeName = recipe.name || "";
                  const isLinked = menuItemFormData.recipeId === recipeId;

                  return (
                    <div
                      key={recipeId}
                      draggable={!isLinked}
                      onDragStart={() => !isLinked && handleRecipeDragStart(recipeId)}
                      className={cn(
                        "group relative flex items-center h-[41px] px-3 border-b border-[#e5e7eb] transition-all",
                        "bg-white",
                        isLinked
                          ? "opacity-50 cursor-not-allowed"
                          : "cursor-grab active:cursor-grabbing hover:bg-[#f3e8ff]"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <ChefHat className={cn(
                          "h-4 w-4 shrink-0",
                          recipe.type === "sub" ? "text-[#9333ea]" : "text-[#3b82f6]"
                        )} />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-[#111827] truncate leading-tight">
                            {recipeName}
                          </div>
                          <div className="text-[10px] text-[#9ca3af] font-medium uppercase leading-tight">
                            {recipe.type || "Recipe"}
                          </div>
                        </div>
                      </div>
                      {isLinked && (
                        <div className="absolute top-1/2 -translate-y-1/2 right-3">
                          <span className="text-[9px] font-semibold bg-purple-600 text-white px-1.5 py-0.5 rounded">
                            LINKED
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderCategoryTab = () => {
    // Render a single category item
    const renderCategoryItem = (category: any, depth: number = 0) => {
      const catId = String(category._id || category.id || category.ID);
      const catName = category.name || category.Name || "";
      const catDesc = category.description || category.Description || "";
      const displayOrder = category.displayOrder || category.DisplayOrder || 0;
      const isNewlyCreated = localCategories.some(c => (c._id || c.id || c.ID) === (category._id || category.id || category.ID));
      const isEditing = editingCategoryId === catId;
      const hasChildren = category._children && category._children.length > 0;
      const isExpanded = expandedCategories.has(catId);

      // Get parent category name if exists
      const parentId = category.parentId || category.ParentCategory;
      const parentCategory = parentId ? allCategories.find(c => String(c._id || c.id || c.ID) === String(parentId)) : null;
      const parentName = parentCategory ? (parentCategory.name || parentCategory.Name) : null;

      return (
        <React.Fragment key={catId}>
          <div
            className={cn(
              "group relative flex items-center min-h-[48px] py-2 px-3 border-b border-[#e5e7eb] transition-all",
              isEditing ? "bg-[#fffbeb] border-l-4 border-l-[#f59e0b]" : isNewlyCreated ? "bg-[#f0fdf4]" : "bg-white hover:bg-[#f9fafb]"
            )}
            style={{ paddingLeft: `${12 + depth * 24}px` }}
          >
            <div className="flex items-center gap-2 flex-1 min-w-0">
              {/* Expand/Collapse Icon */}
              {hasChildren ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleCategoryExpansion(catId);
                  }}
                  className="shrink-0"
                >
                  <ChevronRight className={cn(
                    "h-5 w-5 text-[#111827] transition-transform stroke-[1.5]",
                    isExpanded && "rotate-90"
                  )} />
                </button>
              ) : (
                <div className="w-5 shrink-0" />
              )}

              {/* Category Icon */}
              <UtensilsCrossed className={cn(
                "h-4 w-4 shrink-0",
                isEditing ? "text-[#f59e0b]" : isNewlyCreated ? "text-[#22c55e]" : depth > 0 ? "text-[#8b5cf6]" : "text-[#0284c7]"
              )} />

              {/* Category Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-[#111827] truncate leading-tight">
                    {catName}
                  </span>
                  {isNewlyCreated && (
                    <span className="text-[9px] font-bold bg-[#22c55e] text-white px-1.5 py-0.5 rounded">NEW</span>
                  )}
                  {isEditing && (
                    <span className="text-[9px] font-bold bg-[#f59e0b] text-white px-1.5 py-0.5 rounded">EDITING</span>
                  )}
                  <span className="text-[10px] font-medium text-[#9ca3af] bg-[#f3f4f6] px-1.5 py-0.5 rounded">
                    #{displayOrder}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  {parentName && (
                    <span className="text-[10px] text-[#8b5cf6] font-medium">
                      ↳ {parentName}
                    </span>
                  )}
                  {catDesc && (
                    <span className="text-[10px] text-[#9ca3af] truncate leading-tight">
                      {catDesc}
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditCategory(catId);
                  }}
                  className="p-1.5 hover:bg-[#dbeafe] text-[#3b82f6] rounded transition-colors"
                  title="Edit category"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteCategoryClick(catId);
                  }}
                  className="p-1.5 hover:bg-[#fee2e2] text-[#ef4444] rounded transition-colors"
                  title="Delete category"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Render children if expanded */}
          {hasChildren && isExpanded && (
            <>
              {category._children.map((child: any) => renderCategoryItem(child, depth + 1))}
            </>
          )}
        </React.Fragment>
      );
    };

    return (
      <div className="flex h-full w-full">
        {/* Left Panel - Hierarchical Categories List */}
        <div className={cn(
          "flex flex-col border-r border-[#d5d5dd] shrink-0 bg-white transition-all duration-300 overflow-hidden",
          categoriesExpanded ? "w-[35%]" : "w-0 md:w-10 opacity-0 md:opacity-100"
        )}>
          <div
            className="flex items-center justify-between cursor-pointer select-none px-3 h-[41px] leading-none box-border bg-[#f9fafb] border-b border-[#d5d5dd]"
            onClick={() => setCategoriesExpanded(!categoriesExpanded)}
          >
            <div className="flex items-center gap-2 overflow-hidden">
              <UtensilsCrossed className="h-4 w-4 text-[#6b7280] shrink-0" />
              <span className={cn(
                "text-[14px] font-semibold text-[#374151] uppercase leading-[14px] truncate transition-opacity duration-200",
                !categoriesExpanded && "opacity-0 md:hidden"
              )}>
                Categories
              </span>
              {filteredCategories.length > 0 && (
                <span className="text-[10px] font-medium text-[#6b7280] bg-white border border-[#d5d5dd] px-1.5 py-0.5 rounded leading-[10px]">
                  {filteredCategories.length}
                </span>
              )}
            </div>
            {categoriesExpanded ? (
              <ChevronUp className="h-4 w-4 text-[#9ca3af]" />
            ) : (
              <ChevronDown className="h-4 w-4 text-[#9ca3af]" />
            )}
          </div>

          {categoriesExpanded && (
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="h-[41px] px-3 flex items-center bg-white relative border-b border-[#d5d5dd]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9ca3af]" />
                <input
                  type="text"
                  value={categorySearch}
                  onChange={(e) => setCategorySearch(e.target.value)}
                  placeholder="Search categories..."
                  className="pl-9 h-full w-full border-0 p-0 focus:ring-0 focus:outline-none bg-transparent text-[15px] leading-tight"
                />
              </div>

              <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                {hierarchicalCategories.length === 0 ? (
                  <div className="text-center py-8">
                    <UtensilsCrossed className="h-10 w-10 text-[#d1d5db] mx-auto mb-2" />
                    <p className="text-sm text-[#9ca3af]">No categories found</p>
                  </div>
                ) : (
                  hierarchicalCategories.map((category) => renderCategoryItem(category))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Center Panel - Category Form */}
        <div className="flex-1 flex flex-col overflow-hidden min-w-0 bg-white relative">
          <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden m-0 p-0" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {/* Form Header */}
            <div className="sticky top-0 z-20 flex items-center justify-between cursor-pointer select-none px-3 h-[41px] leading-none box-border bg-[#f9fafb] border-b border-[#d5d5dd]">
              <div className="flex items-center gap-2">
                <UtensilsCrossed className="h-4 w-4 text-[#6b7280]" />
                <span className="text-[14px] font-semibold text-[#374151] uppercase leading-[14px]">
                  {editingCategoryId ? "Edit Category" : "New Category"}
                </span>
              </div>
              {editingCategoryId && (
                <button
                  onClick={handleCancelCategoryEdit}
                  className="text-xs text-[#6b7280] hover:text-[#111827] font-medium transition-colors"
                >
                  Cancel Edit
                </button>
              )}
            </div>

            {/* Form Fields */}
            <div className="p-4">
              <div className="space-y-5">
                {/* Category Name */}
                <div>
                  <Label className="text-sm font-medium text-[#374151] mb-1.5 block">
                    Category Name <span className="text-[#ef4444]">*</span>
                  </Label>
                  <Input
                    value={categoryFormData.name}
                    onChange={(e) => setCategoryFormData({ ...categoryFormData, name: e.target.value })}
                    placeholder="e.g., Appetizers, Main Course, Desserts"
                    className="h-14 text-[15px]"
                  />
                </div>

                {/* Description */}
                <div>
                  <Label className="text-sm font-medium text-[#374151] mb-1.5 block">Description (Optional)</Label>
                  <Textarea
                    value={categoryFormData.description}
                    onChange={(e) => setCategoryFormData({ ...categoryFormData, description: e.target.value })}
                    placeholder="Brief description..."
                    className="min-h-[72px] resize-none text-[15px]"
                    rows={2}
                  />
                </div>

                {/* Parent Category */}
                <div>
                  <Label className="text-sm font-medium text-[#374151] mb-1.5 block">Parent Category</Label>
                  <Select
                    value={categoryFormData.parentId || "none"}
                    onValueChange={(value) => setCategoryFormData({ ...categoryFormData, parentId: value === "none" ? null : value })}
                  >
                    <SelectTrigger className="h-14 text-[15px]">
                      <SelectValue placeholder="None (Top Level)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None (Top Level)</SelectItem>
                      {allCategories
                        .filter(cat => String(cat._id || cat.id || cat.ID) !== editingCategoryId)
                        .map((cat) => (
                          <SelectItem key={cat._id || cat.id || cat.ID} value={String(cat._id || cat.id || cat.ID)}>
                            {cat.name || cat.Name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Display Order */}
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <Label className="text-sm font-medium text-[#374151]">Display Order</Label>
                    <CustomTooltip label="Lower numbers appear first in the menu" direction="right">
                      <Info className="h-3.5 w-3.5 text-[#9ca3af] cursor-pointer" />
                    </CustomTooltip>
                  </div>
                  <Input
                    type="number"
                    value={categoryFormData.displayOrder === 0 ? "" : categoryFormData.displayOrder}
                    onChange={(e) => {
                      const val = e.target.value;
                      setCategoryFormData({ ...categoryFormData, displayOrder: val === '' ? 0 : parseInt(val) || 0 });
                    }}
                    onFocus={(e) => e.target.select()}
                    placeholder="0"
                    className="h-14 text-[15px] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>

                {/* Active Status */}
                <div>
                  <Label className="text-sm font-medium text-[#374151] mb-1.5 block">Status</Label>
                  <div className="flex items-center justify-between rounded-sm border border-[#d5d5dd] bg-[#f8f8fa] px-4 h-14 w-full">
                    <span className="text-[#111827] text-sm font-medium">Active</span>
                    <Switch
                      checked={categoryFormData.isActive === true}
                      onCheckedChange={(checked) => setCategoryFormData({ ...categoryFormData, isActive: checked })}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {editingCategoryId ? (
              <div className="grid grid-cols-2">
                <Button
                  type="button"
                  onClick={handleUpdateCategory}
                  variant="outline"
                  className={cn(
                    "shrink-0 w-full h-[41px] rounded-none border-t border-r border-x-0 border-b-0 border-[#d5d5dd] bg-white text-[15px] font-medium transition-all duration-200 hover:bg-[#0ea5e9] hover:text-white text-[#0ea5e9]",
                    (!categoryFormData.name || creatingCategory) && "opacity-50 grayscale cursor-not-allowed"
                  )}
                  disabled={!categoryFormData.name || creatingCategory}
                >
                  {creatingCategory ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Edit2 className="h-4 w-4 mr-2" />
                      Update Category
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  onClick={() => handleDeleteCategoryClick(editingCategoryId)}
                  variant="outline"
                  className="shrink-0 w-full h-[41px] rounded-none border-t border-x-0 border-b-0 border-[#d5d5dd] bg-white text-[15px] font-medium transition-all duration-200 hover:bg-[#ef4444] hover:text-white text-[#ef4444]"
                  disabled={creatingCategory}
                >
                  {creatingCategory ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Category
                    </>
                  )}
                </Button>
              </div>
            ) : (
              <Button
                type="button"
                onClick={handleQuickCreateCategory}
                variant="outline"
                className={cn(
                  "shrink-0 w-full h-[41px] rounded-none border-t border-x-0 border-b-0 border-[#d5d5dd] bg-white text-[15px] font-medium transition-all duration-200 hover:bg-[#111827] hover:text-white hover:border-[#111827] text-[#374151]",
                  (!categoryFormData.name || creatingCategory) && "opacity-50 grayscale cursor-not-allowed"
                )}
                disabled={!categoryFormData.name || creatingCategory}
              >
                {creatingCategory ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating Category...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Category
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        size="full"
        onInteractOutside={(e) => e.preventDefault()}
        onOpenAutoFocus={(e) => e.preventDefault()}
        className="!h-[95vh] !max-h-[95vh] flex flex-col overflow-hidden"
      >
        <DialogHeader className="shrink-0 pb-2">
          <DialogTitle className="text-xl">
            {isEditMode ? "Edit Menu Item" : "Create Menu Items"}
          </DialogTitle>
        </DialogHeader>

        <Tabs
          value={currentTab}
          onValueChange={(value) => setCurrentTab(value as "menu" | "category")}
          className="flex-1 flex flex-col overflow-hidden"
        >
          <div className="px-8 pb-1 pt-2 shrink-0">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="menu">Menu Item</TabsTrigger>
              <TabsTrigger value="category">Category</TabsTrigger>
            </TabsList>
          </div>

          <DialogBody className="flex-1 overflow-hidden px-8 pt-0 pb-2">
            <TabsContent value="menu" className="mt-0 h-full data-[state=active]:flex">
              <div className="flex-1 border border-[#d5d5dd] rounded-sm overflow-hidden">
                {renderMenuTab()}
              </div>
            </TabsContent>
            <TabsContent value="category" className="mt-0 h-full data-[state=active]:flex">
              <div className="flex-1 border border-[#d5d5dd] rounded-sm overflow-hidden">
                {renderCategoryTab()}
              </div>
            </TabsContent>
          </DialogBody>
        </Tabs>

        <DialogFooter className="shrink-0 pt-3 bg-white">
          <Button
            onClick={handleSubmit}
            disabled={!menuItemFormData.name || submitting || actionLoading}
            className="bg-[#111827] hover:bg-[#1f2937] text-white px-6 h-11 text-[15px]"
          >
            {submitting || actionLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>{isEditMode ? "Update Menu Item" : `Create ${menuItemsList.length + (menuItemFormData.name && menuItemFormData.categoryId && menuItemFormData.pricing.basePrice > 0 ? 1 : 0)} Menu Item(s)`}</>
            )}
          </Button>
          <Button
            onClick={onClose}
            variant="outline"
            className="px-6 h-11 border-[#d5d5dd] text-[15px]"
            disabled={submitting || actionLoading}
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Category"
        description={`Are you sure you want to delete the category "${categoryToDelete?.name}"? This action cannot be undone.`}
        onConfirm={handleConfirmDeleteCategory}
        onCancel={() => setCategoryToDelete(null)}
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
      />
    </Dialog>
  );
}

// Menu Item Tags Component
interface MenuItemTagsProps {
  tags: string[];
  onAddTag: (tag: string) => void;
  onRemoveTag: (tag: string) => void;
}

function MenuItemTags({ tags, onAddTag, onRemoveTag }: MenuItemTagsProps) {
  const [currentTag, setCurrentTag] = useState("");

  const handleAddTagClick = () => {
    if (currentTag.trim()) {
      onAddTag(currentTag);
      setCurrentTag("");
    }
  };

  return (
    <div>
      <Label className="text-sm font-medium text-[#374151] mb-1.5 block">Tags (Optional)</Label>
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
          className="h-12 text-[15px]"
        />
        <Button
          type="button"
          onClick={handleAddTagClick}
          variant="outline"
          className="h-12 px-4"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {tags.map((tag, idx) => (
            <span
              key={idx}
              className="px-3 py-1.5 bg-blue-50 text-blue-700 text-sm rounded-sm flex items-center gap-2 border border-blue-200"
            >
              {tag}
              <button
                type="button"
                onClick={() => onRemoveTag(tag)}
                className="hover:text-blue-900"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
