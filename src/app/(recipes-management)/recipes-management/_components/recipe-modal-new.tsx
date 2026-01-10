"use client";

import { Toast } from "@/lib/util/toast-helpers";

import React, { useState, useEffect, useMemo } from "react";
import { Loader2, Plus, X, Search, UtensilsCrossed, Sparkles, Package, ChefHat, Info, ChevronDown, ChevronUp } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogBody, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { CustomTooltip } from "@/components/ui/custom-tooltip";
import { cn } from "@/lib/utils";
import { RecipeVariantInput } from "./recipe-variant-input";
import { BatchList } from "@/components/ui/batch-list";
import { InventoryService } from "@/lib/services/inventory-service";
import { RecipeOption, RecipeIngredient, RecipeVariantInline } from "@/lib/types/recipes";

// API Recipe structure


interface Recipe {
  _id?: string;
  name: string;
  type: "sub" | "final";
  description?: string;
  ingredients: RecipeIngredient[];
  isActive?: boolean;
  totalCost?: number;
  yield?: number;
  createdAt?: string;
  updatedAt?: string;
  variations?: RecipeVariantInline[];
}


interface InventoryItem {
  ID?: number | string;
  _id?: string;
  id?: string;
  Name?: string;
  name?: string;
  Unit?: string;
  baseUnit?: string;
  type?: "stock" | "nonstock" | "service";
  quantity?: number;
  reorderPoint?: number;
  sku?: string;
}

interface RecipeModalProps {
  isOpen: boolean;
  editingItem: RecipeOption | null;
  ingredients: InventoryItem[];
  availableRecipeOptions: any[];
  onClose: () => void;
  onSubmit: (data: any) => Promise<any>;
  actionLoading: boolean;
  onRefreshRecipes?: () => void;
}

export default function RecipeModalNew({
  isOpen,
  onClose,
  editingItem,
  ingredients,
  availableRecipeOptions,
  onSubmit,
  actionLoading,
  onRefreshRecipes,
}: RecipeModalProps) {
  const [loading, setLoading] = useState(false);
  const [addingToList, setAddingToList] = useState(false);
  const [localSubRecipes, setLocalSubRecipes] = useState<any[]>([]);

  // Infinite scroll states for inventory
  const [localInventory, setLocalInventory] = useState<InventoryItem[]>([]);
  const [inventoryPage, setInventoryPage] = useState(1);
  const [inventoryHasMore, setInventoryHasMore] = useState(true);
  const [inventoryLoading, setInventoryLoading] = useState(false);
  const inventoryScrollRef = React.useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState<Partial<Recipe>>({
    name: "",
    type: "final",
    description: "",
    ingredients: [],
    isActive: true,
    variations: [],
    yield: 1,
  });

  const [recipeIngredients, setRecipeIngredients] = useState<RecipeIngredient[]>([]);
  const [variants, setVariants] = useState<RecipeVariantInline[]>([]);

  // Search states
  const [inventorySearch, setInventorySearch] = useState("");
  const [recipeSearch, setRecipeSearch] = useState("");

  // Drag and drop states
  const [draggedInventory, setDraggedInventory] = useState<string | null>(null);
  const [draggedRecipe, setDraggedRecipe] = useState<string | null>(null);

  // Collapsible panel states
  const [inventoryExpanded, setInventoryExpanded] = useState(true);
  const [subRecipesExpanded, setSubRecipesExpanded] = useState(true);
  const [recipeFormExpanded, setRecipeFormExpanded] = useState(true);

  // Bulk recipe state - list of recipes to be created
  const [recipesList, setRecipesList] = useState<Array<{
    id: string;
    name: string;
    type: "sub" | "final";
    description: string;
    ingredients: RecipeIngredient[];
    variations: RecipeVariantInline[];
    yield: number;
    isActive: boolean;
  }>>([]);
  const [activeRecipeId, setActiveRecipeId] = useState<string | null>(null);
  const [scrollToRecipeId, setScrollToRecipeId] = useState<string | null>(null);

  // Refs for auto-focus and scroll
  const ingredientRefs = React.useRef<{ [key: number]: HTMLInputElement | null }>({});
  const variantRefs = React.useRef<{ [key: number]: HTMLDivElement | null }>({});

  useEffect(() => {
    const handleInitialResponsive = () => {
      if (window.innerWidth < 1024) setInventoryExpanded(false);
      if (window.innerWidth < 1280) setSubRecipesExpanded(false);
    };
    handleInitialResponsive();
  }, []);

  // Fetch inventory with pagination
  const fetchInventory = React.useCallback(async (page: number, searchQuery: string = "", reset: boolean = false) => {
    if (inventoryLoading) return;

    setInventoryLoading(true);
    try {
      const ITEMS_PER_PAGE = 50;
      const response = await InventoryService.listItems({
        page,
        limit: ITEMS_PER_PAGE,
        q: searchQuery,
      });

      if (response.success && response.data) {
        const newItems = response.data;

        if (reset) {
          setLocalInventory(newItems);
        } else {
          setLocalInventory(prev => [...prev, ...newItems]);
        }

        // If we got fewer items than requested, we've reached the end
        setInventoryHasMore(newItems.length >= ITEMS_PER_PAGE);
      } else {
        if (reset) {
          setLocalInventory([]);
        }
        setInventoryHasMore(false);
      }
    } catch (error) {
      if (reset) {
        setLocalInventory([]);
      }
      setInventoryHasMore(false);
    } finally {
      setInventoryLoading(false);
    }
  }, [inventoryLoading]);

  // Initial load when modal opens or panel expands
  useEffect(() => {
    if (isOpen && inventoryExpanded && localInventory.length === 0) {
      setInventoryPage(1);
      setInventoryHasMore(true);
      fetchInventory(1, inventorySearch, true);
    }
  }, [isOpen, inventoryExpanded]);

  // Handle search changes with debounce
  useEffect(() => {
    if (!isOpen || !inventoryExpanded) return;

    const debounceTimer = setTimeout(() => {
      setInventoryPage(1);
      setInventoryHasMore(true);
      fetchInventory(1, inventorySearch, true);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [inventorySearch]);

  // Infinite scroll handler
  const handleInventoryScroll = React.useCallback(() => {
    const scrollContainer = inventoryScrollRef.current;
    if (!scrollContainer || inventoryLoading || !inventoryHasMore) return;

    const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
    const scrollThreshold = 200; // pixels from bottom

    if (scrollHeight - scrollTop - clientHeight < scrollThreshold) {
      const nextPage = inventoryPage + 1;
      setInventoryPage(nextPage);
      fetchInventory(nextPage, inventorySearch, false);
    }
  }, [inventoryLoading, inventoryHasMore, inventoryPage, inventorySearch, fetchInventory]);

  useEffect(() => {
    if (isOpen) {
      // Refresh recipes when modal opens to get latest sub recipes
      if (onRefreshRecipes) {
        onRefreshRecipes();
      }

      if (editingItem) {
        const existingIngredients = editingItem.ingredients || [];
        const existingVariants: RecipeVariantInline[] = (editingItem as any).variations || [];
        setFormData({
          name: editingItem.Name,
          type: editingItem.type || "sub",
          description: editingItem.Description,
          isActive: editingItem.Status === "Active",
          ingredients: existingIngredients,
          variations: existingVariants,
          yield: editingItem.yield || 1,
        });
        setRecipeIngredients(existingIngredients);
        setVariants(existingVariants);
      } else {
        setFormData({
          name: "",
          type: "final",
          description: "",
          ingredients: [],
          isActive: true,
          variations: [],
          yield: 1,
        });
        setRecipeIngredients([]);
        setVariants([]);
      }
      setInventorySearch("");
      setRecipeSearch("");
      setRecipesList([]);
      setActiveRecipeId(null);
      setRecipeFormExpanded(true);
      setLocalSubRecipes([]);
      // Reset inventory when modal closes
      if (!isOpen) {
        setLocalInventory([]);
        setInventoryPage(1);
        setInventoryHasMore(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, editingItem]);

  const handleFieldChange = (field: keyof Recipe, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Drag handlers for inventory items
  const handleInventoryDragStart = (itemId: string) => {
    setDraggedInventory(itemId);
  };

  const handleInventoryDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleInventoryDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (!draggedInventory) return;

    // Search in both passed ingredients and locally fetched inventory
    const allInventory = [...ingredients, ...localInventory];
    const item = allInventory.find(
      (inv) => String(inv._id || inv.id || inv.ID) === draggedInventory
    );

    if (item) {
      const itemId = String(item._id || item.id || item.ID);
      const itemName = item.Name || item.name || "";
      const itemUnit = item.Unit || item.baseUnit || "pc";

      // Check if already added
      const exists = recipeIngredients.some(ing => ing.sourceId === itemId);
      if (exists) {
        Toast.error("This item is already added to ingredients");
        setDraggedInventory(null);
        return;
      }

      const newIngredient: RecipeIngredient = {
        sourceType: "inventory",
        sourceId: itemId,
        nameSnapshot: itemName,
        quantity: 1,
        unit: itemUnit,
      };

      const newIndex = recipeIngredients.length;
      setRecipeIngredients([...recipeIngredients, newIngredient]);

      // Auto-focus and scroll to the new ingredient
      setTimeout(() => {
        const inputRef = ingredientRefs.current[newIndex];
        if (inputRef) {
          inputRef.focus();
          inputRef.select();
          inputRef.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);

      Toast.success(`Added ${itemName} to ingredients`, { duration: 2000 });
    }

    setDraggedInventory(null);
  };

  // Drag handlers for sub recipes
  const handleRecipeDragStart = (recipeId: string) => {
    setDraggedRecipe(recipeId);
  };

  const handleRecipeDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleRecipeDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (!draggedRecipe) return;

    // Search in both available recipes and newly created local recipes
    const allRecipes = [...availableRecipeOptions, ...localSubRecipes];
    const recipe = allRecipes.find(
      (rec) => String(rec._id || rec.ID) === draggedRecipe
    );

    if (recipe) {
      const recipeId = String(recipe._id || recipe.ID);
      const recipeName = recipe.Name || "";

      // Check if already added
      const exists = recipeIngredients.some(ing => ing.sourceId === recipeId);
      if (exists) {
        Toast.error("This recipe is already added to ingredients");
        setDraggedRecipe(null);
        return;
      }

      const newIngredient: RecipeIngredient = {
        sourceType: "recipe",
        sourceId: recipeId,
        nameSnapshot: recipeName,
        quantity: 1,
        unit: "portion",
      };

      const newIndex = recipeIngredients.length;
      setRecipeIngredients([...recipeIngredients, newIngredient]);

      // Auto-focus and scroll to the new ingredient
      setTimeout(() => {
        const inputRef = ingredientRefs.current[newIndex];
        if (inputRef) {
          inputRef.focus();
          inputRef.select();
          inputRef.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);

      Toast.success(`Added ${recipeName} to ingredients`, { duration: 2000 });
    } else {
    }

    setDraggedRecipe(null);
  };

  // Ingredient management
  const handleRemoveIngredient = (index: number) => {
    setRecipeIngredients(recipeIngredients.filter((_, i) => i !== index));
  };

  const handleUpdateIngredient = (index: number, field: keyof RecipeIngredient, value: any) => {
    const updated = [...recipeIngredients];
    updated[index] = { ...updated[index], [field]: value };
    setRecipeIngredients(updated);
  };

  // Variant management
  const handleAddVariant = () => {
    const newVariant: RecipeVariantInline = {
      name: "",
      description: "",
      type: "custom",
      sizeMultiplier: 1,
      baseCostAdjustment: 0,
      ingredients: [],
      isActive: true,
    };
    const newIndex = variants.length;
    setVariants([...variants, newVariant]);

    // Auto-scroll to the new variant
    setTimeout(() => {
      const variantRef = variantRefs.current[newIndex];
      if (variantRef) {
        variantRef.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 150);
  };

  // Add standard size variants
  const handleAddStandardSize = (sizeName: string, multiplier: number) => {
    // Check if size already exists
    const exists = variants.some(v => v.name.toLowerCase() === sizeName.toLowerCase() && v.type === "size");
    if (exists) {
      Toast.error(`${sizeName} size variant already exists`);
      return;
    }

    const newVariant: RecipeVariantInline = {
      name: sizeName,
      description: `${sizeName} size`,
      type: "size",
      sizeMultiplier: multiplier,
      baseCostAdjustment: 0,
      ingredients: [],
      isActive: true,
    };
    const newIndex = variants.length;
    setVariants([...variants, newVariant]);
    Toast.success(`${sizeName} size added`, { duration: 2000 });
    Toast.success(`${sizeName} size added`, {
      duration: 2000,
      position: "top-right",
    });

    // Auto-scroll to the new variant
    setTimeout(() => {
      const variantRef = variantRefs.current[newIndex];
      if (variantRef) {
        variantRef.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 150);
  };

  const handleUpdateVariant = (index: number, field: keyof RecipeVariantInline, value: any) => {
    const updated = [...variants];
    updated[index] = { ...updated[index], [field]: value };
    setVariants(updated);
  };

  const handleRemoveVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const handleUpdateVariantIngredient = (vIndex: number, iIndex: number, field: keyof RecipeIngredient, value: any) => {
    const updatedVariants = [...variants];
    const updatedIngredients = [...(updatedVariants[vIndex].ingredients || [])];
    updatedIngredients[iIndex] = { ...updatedIngredients[iIndex], [field]: value };
    updatedVariants[vIndex] = { ...updatedVariants[vIndex], ingredients: updatedIngredients };
    setVariants(updatedVariants);
  };

  const handleRemoveVariantIngredient = (vIndex: number, iIndex: number) => {
    const updatedVariants = [...variants];
    const updatedIngredients = (updatedVariants[vIndex].ingredients || []).filter((_, i) => i !== iIndex);
    updatedVariants[vIndex] = { ...updatedVariants[vIndex], ingredients: updatedIngredients };
    setVariants(updatedVariants);
  };

  const handleVariantIngredientDrop = (vIndex: number, e: React.DragEvent) => {
    e.preventDefault();

    let itemToAdd: RecipeIngredient | null = null;
    let itemName = "";

    if (draggedInventory) {
      // Search in both passed ingredients and locally fetched inventory
      const allInventory = [...ingredients, ...localInventory];
      const item = allInventory.find(
        (inv) => String(inv._id || inv.id || inv.ID) === draggedInventory
      );
      if (item) {
        itemName = item.Name || item.name || "";
        itemToAdd = {
          sourceType: "inventory",
          sourceId: String(item._id || item.id || item.ID),
          nameSnapshot: itemName,
          quantity: 1,
          unit: item.Unit || item.baseUnit || "pc",
        };
      }
    } else if (draggedRecipe) {
      // Search in both available recipes and newly created local recipes
      const allRecipes = [...availableRecipeOptions, ...localSubRecipes];
      const recipe = allRecipes.find(
        (rec) => String(rec._id || rec.ID) === draggedRecipe
      );
      if (recipe) {
        itemName = recipe.Name || "";
        itemToAdd = {
          sourceType: "recipe",
          sourceId: String(recipe._id || recipe.ID),
          nameSnapshot: itemName,
          quantity: 1,
          unit: "portion",
        };
      }
    }

    if (itemToAdd) {
      const updatedVariants = [...variants];
      const variant = updatedVariants[vIndex];
      const existingIngredients = variant.ingredients || [];

      if (existingIngredients.some(ing => ing.sourceId === itemToAdd!.sourceId)) {
        Toast.error(`${itemName} is already added to this variant`);
        return;
      }

      updatedVariants[vIndex] = {
        ...variant,
        ingredients: [...existingIngredients, itemToAdd]
      };
      setVariants(updatedVariants);
      Toast.success(`Added ${itemName} to ${variant.name || `Variant ${vIndex + 1}`}`, { duration: 2000 });
    }

    setDraggedInventory(null);
    setDraggedRecipe(null);
  };

  // Bulk recipe management
  const handleAddToList = async () => {
    if (!formData.name) {
      Toast.error("Please enter a recipe name before adding to list");
      return;
    }

    if (recipeIngredients.length === 0) {
      Toast.error("Please add at least one ingredient before adding to list");
      return;
    }

    const newRecipe = {
      id: `temp-${Date.now()}`,
      name: formData.name || "",
      type: formData.type || "final",
      description: formData.description || "",
      ingredients: [...recipeIngredients],
      variations: [...variants],
      yield: formData.yield || 1,
      isActive: formData.isActive ?? true,
    };

    // If it's a sub recipe, save it to backend immediately
    if (newRecipe.type === "sub") {
      setAddingToList(true);
      try {
        const parseNum = (val: any, fallback: number = 0) => {
          if (val === "" || val === null || val === undefined) return fallback;
          const parsed = parseFloat(val);
          return isNaN(parsed) ? fallback : parsed;
        };

        const submitData = {
          ...newRecipe,
          yield: parseNum(newRecipe.yield, 1),
          ingredients: newRecipe.ingredients.map((ing: any) => ({
            ...ing,
            quantity: parseNum(ing.quantity, 0)
          })),
        };

        // Remove temporary id before submitting
        delete (submitData as any).id;

        const result = await onSubmit(submitData);


        if (result.success) {
          Toast.success(`"${newRecipe.name}" created successfully`, {
            duration: 2000,
          });

          // Add the newly created recipe to local state for instant display
          // Handle different possible response structures
          let createdRecipe = result.data;

          // If data is wrapped in result property
          if (result.data?.result) {
            createdRecipe = result.data.result;
          }

          // If data has recipe property
          if (createdRecipe?.recipe) {
            createdRecipe = createdRecipe.recipe;
          }


          // If we still don't have recipe data, use the submitted data with a temporary ID
          if (!createdRecipe || !createdRecipe._id) {
            createdRecipe = {
              _id: `temp-${Date.now()}`,
              ...submitData,
              name: submitData.name,
              isActive: submitData.isActive !== false,
            };
          }

          if (createdRecipe) {
            const newSubRecipe = {
              _id: createdRecipe._id || createdRecipe.id || `temp-${Date.now()}`,
              ID: createdRecipe._id || createdRecipe.id || `temp-${Date.now()}`,
              Name: createdRecipe.name || submitData.name,
              name: createdRecipe.name || submitData.name,
              Status: (createdRecipe.isActive !== false ? "Active" : "Inactive") as "Active" | "Inactive",
              Description: createdRecipe.description || submitData.description || "",
              type: "sub" as const,
              ingredients: createdRecipe.ingredients || submitData.ingredients || [],
            };

            setLocalSubRecipes(prev => {
              const updated = [...prev, newSubRecipe];
              return updated;
            });
          }

          // Refresh recipes in background to update parent list
          if (onRefreshRecipes) {
            setTimeout(() => onRefreshRecipes(), 100);
          }

          // Reset form for next recipe
          setFormData({
            name: "",
            type: formData.type, // Keep the same type
            description: "",
            ingredients: [],
            isActive: true,
            variations: [],
            yield: 1,
          });
          setRecipeIngredients([]);
          setVariants([]);
        } else {
          Toast.error(
            result.error || "Failed to create sub recipe"
          );
        }
      } catch (error) {
        Toast.error(error);
      } finally {
        setAddingToList(false);
      }
    } else {
      // For final recipes, keep the old behavior (add to list)
      setRecipesList([...recipesList, newRecipe]);

      // Reset form for next recipe
      setFormData({
        name: "",
        type: formData.type, // Keep the same type
        description: "",
        ingredients: [],
        isActive: true,
        variations: [],
        yield: 1,
      });
      setRecipeIngredients([]);
      setVariants([]);

      Toast.success(`"${newRecipe.name}" added to list`, { duration: 2000 });
    }
    Toast.success(`"${newRecipe.name}" added to list`, {
      duration: 2000,
      position: "top-right",
    });

    // Auto-scroll to the newly added recipe in the list
    setScrollToRecipeId(newRecipe.id);
  };

  const handleRemoveFromList = (id: string) => {
    const recipe = recipesList.find(r => r.id === id);
    setRecipesList(recipesList.filter(r => r.id !== id));
    if (recipe) {
      Toast.success(`"${recipe.name}" removed from list`, { duration: 2000 });
    }
  };

  const handleEditFromList = (id: string) => {
    const recipe = recipesList.find(r => r.id === id);
    if (recipe) {
      // Save current form if it has content
      if (formData.name && recipeIngredients.length > 0) {
        handleAddToList();
      }

      // Load selected recipe into form
      setFormData({
        name: recipe.name,
        type: recipe.type,
        description: recipe.description,
        ingredients: recipe.ingredients,
        isActive: recipe.isActive,
        variations: recipe.variations,
        yield: recipe.yield,
      });
      setRecipeIngredients([...recipe.ingredients]);
      setVariants([...recipe.variations]);

      // Remove from list since it's now being edited
      setRecipesList(recipesList.filter(r => r.id !== id));
      setActiveRecipeId(null);
    }
  };

  const handleSave = async () => {
    const parseNum = (val: any, fallback: number = 0) => {
      if (val === "" || val === null || val === undefined) return fallback;
      const parsed = parseFloat(val);
      return isNaN(parsed) ? fallback : parsed;
    };

    const finalRecipesToSubmit: any[] = [...recipesList];
    const isEditingMode = !!editingItem;

    // 1. Validate and capture current form content
    const hasCurrentFormContent = formData.name || recipeIngredients.length > 0;
    let currentFormValid = false;

    if (hasCurrentFormContent) {
      if (!formData.name) {
        Toast.error("Please enter a recipe name", { duration: 5000 });
        return;
      }

      if (recipeIngredients.length === 0) {
        Toast.error("Please add at least one ingredient", { duration: 5000 });
        return;
      }

      const invalidIngredients = recipeIngredients.filter(
        (ing) => !ing.sourceId || !ing.quantity || parseNum(ing.quantity, 0) <= 0 || !ing.unit
      );

      if (invalidIngredients.length > 0) {
        Toast.error(`Current recipe has ${invalidIngredients.length} ingredient(s) with missing information`, { duration: 5000 });
        return;
      }

      const invalidVariants = variants.filter((v) => !v.name || !v.type);
      if (invalidVariants.length > 0) {
        Toast.error(`Current recipe has ${invalidVariants.length} variant(s) missing required fields`, { duration: 5000 });
        return;
      }

      // Add current form to the submission queue
      finalRecipesToSubmit.push({
        name: formData.name,
        type: formData.type || "final",
        description: formData.description || "",
        ingredients: [...recipeIngredients],
        variations: [...variants],
        yield: formData.yield || 1,
        isActive: formData.isActive ?? true,
      });
      currentFormValid = true;
    }

    // 2. Logic Check: What are we actually submitting?
    if (finalRecipesToSubmit.length === 0 && !isEditingMode) {
      Toast.error("No recipes to submit. Add ingredients to create a recipe.", { duration: 5000 });
      return;
    }

    // 3. Execution Phase
    setLoading(true);
    try {

      // Submit each recipe in the queue
      for (const recipe of finalRecipesToSubmit) {
        const submitData = {
          ...recipe,
          yield: parseNum(recipe.yield, 1),
          ingredients: recipe.ingredients.map((ing: any) => ({
            ...ing,
            quantity: parseNum(ing.quantity, 0)
          })),
          variations: recipe.variations && recipe.variations.length > 0
            ? recipe.variations.map((v: any) => ({
              ...v,
              sizeMultiplier: parseNum(v.sizeMultiplier, 1),
              baseCostAdjustment: parseNum(v.baseCostAdjustment, 0),
              ingredients: v.ingredients && v.ingredients.length > 0
                ? v.ingredients.map((ing: any) => ({
                  ...ing,
                  quantity: parseNum(ing.quantity, 0)
                }))
                : undefined
            }))
            : undefined,
        };

        const result = await onSubmit(submitData);

        // Add successfully created sub recipes to local state
        if (result.success && submitData.type === "sub") {
          let createdRecipe = result.data;

          // Handle different response structures
          if (result.data?.result) {
            createdRecipe = result.data.result;
          }
          if (createdRecipe?.recipe) {
            createdRecipe = createdRecipe.recipe;
          }

          // Fallback to submitted data if no response data
          if (!createdRecipe || !createdRecipe._id) {
            createdRecipe = {
              _id: `temp-${Date.now()}`,
              ...submitData,
            };
          }

          const newSubRecipe = {
            _id: createdRecipe._id || createdRecipe.id || `temp-${Date.now()}`,
            ID: createdRecipe._id || createdRecipe.id || `temp-${Date.now()}`,
            Name: createdRecipe.name || submitData.name,
            name: createdRecipe.name || submitData.name,
            Status: (createdRecipe.isActive !== false ? "Active" : "Inactive") as "Active" | "Inactive",
            Description: createdRecipe.description || submitData.description || "",
            type: "sub" as const,
            ingredients: createdRecipe.ingredients || submitData.ingredients || [],
          };

          setLocalSubRecipes(prev => [...prev, newSubRecipe]);
        }
      }

      if (finalRecipesToSubmit.length > 1) {
        Toast.success(`Successfully created ${finalRecipesToSubmit.length} recipes`, { duration: 3000 });
      }
    } catch (error) {
      Toast.error(error, { duration: 5000 });
    } finally {
      setLoading(false);
    }
  };

  // Use localInventory (fetched with pagination) instead of passed ingredients
  // The search filtering is done server-side in the fetchInventory function
  const filteredInventory = localInventory;

  // Merge available recipes with locally created sub recipes
  const allSubRecipes = useMemo(() => {
    const existingRecipes = availableRecipeOptions.filter(r => r.type === "sub");
    // Add local recipes that aren't already in the list
    const existingIds = new Set(existingRecipes.map(r => r._id || r.ID));
    const newLocalRecipes = localSubRecipes.filter(r => !existingIds.has(r._id || r.ID));
    const merged = [...existingRecipes, ...newLocalRecipes];

    return merged;
  }, [availableRecipeOptions, localSubRecipes]);

  const filteredRecipes = useMemo(() => {
    const filtered = allSubRecipes.filter((recipe) => {
      const name = (recipe.Name || "").toLowerCase();
      const search = recipeSearch.toLowerCase();
      return name.includes(search);
    });

    return filtered;
  }, [allSubRecipes, recipeSearch]);

  const getCompatibleUnits = (baseUnit: string): string[] => {
    const unit = baseUnit.toLowerCase();

    const weightUnits = ["g", "kg", "gram", "grams", "kilogram", "kilograms", "oz", "ounce", "ounces", "lb", "lbs", "pound", "pounds"];
    if (weightUnits.includes(unit)) {
      return ["g", "kg", "oz", "lb"];
    }

    const volumeUnits = ["ml", "l", "liter", "liters", "milliliter", "milliliters", "cup", "cups", "tbsp", "tablespoon", "tablespoons", "tsp", "teaspoon", "teaspoons", "gallon", "gallons"];
    if (volumeUnits.includes(unit)) {
      return ["ml", "l", "cup", "tbsp", "tsp"];
    }

    const countUnits = ["pc", "pcs", "piece", "pieces", "portion", "portions"];
    if (countUnits.includes(unit)) {
      return ["pc", "portion"];
    }

    return [baseUnit];
  };

  const renderTabContent = (recipeType: "sub" | "final") => (
    <div className="flex h-full w-full">
      {/* Left Panel - Inventory Items */}
      <div className={cn(
        "flex flex-col border-r border-[#d5d5dd] shrink-0 bg-white transition-all duration-300 overflow-hidden",
        inventoryExpanded ? "w-[20%]" : "w-0 md:w-10 opacity-0 md:opacity-100"
      )}>
        <div
          className="flex items-center justify-between cursor-pointer select-none px-3 h-[41px] leading-none box-border bg-[#f9fafb] border-b border-[#d5d5dd]"
          onClick={() => setInventoryExpanded(!inventoryExpanded)}
        >
          <div className="flex items-center gap-2 overflow-hidden">
            <Package className="h-4 w-4 text-[#6b7280] shrink-0" />
            <span className={cn(
              "text-[14px] font-semibold text-[#374151] uppercase leading-[14px] truncate transition-opacity duration-200",
              !inventoryExpanded && "opacity-0 md:hidden"
            )}>
              Inventory Items
            </span>
            {filteredInventory.length > 0 && (
              <span className="text-[10px] font-medium text-[#6b7280] bg-white border border-[#d5d5dd] px-1.5 py-0.5 rounded leading-[10px]">
                {filteredInventory.length}
              </span>
            )}
          </div>
          {inventoryExpanded ? (
            <ChevronUp className="h-4 w-4 text-[#9ca3af]" />
          ) : (
            <ChevronDown className="h-4 w-4 text-[#9ca3af]" />
          )}
        </div>

        {inventoryExpanded && (
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="h-[41px] px-3 flex items-center bg-white relative border-b border-[#d5d5dd]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9ca3af]" />
              <input
                type="text"
                value={inventorySearch}
                onChange={(e) => setInventorySearch(e.target.value)}
                placeholder="Search inventory..."
                className="pl-9 h-full w-full border-0 p-0 focus:ring-0 focus:outline-none bg-transparent text-[15px] leading-tight"
              />
            </div>

            <div
              ref={inventoryScrollRef}
              onScroll={handleInventoryScroll}
              className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {inventoryLoading && filteredInventory.length === 0 ? (
                <div className="text-center py-8">
                  <Loader2 className="h-10 w-10 text-[#9ca3af] mx-auto mb-2 animate-spin" />
                  <p className="text-sm text-[#9ca3af]">Loading inventory...</p>
                </div>
              ) : filteredInventory.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="h-10 w-10 text-[#d1d5db] mx-auto mb-2" />
                  <p className="text-sm text-[#9ca3af]">No inventory items</p>
                </div>
              ) : (
                <>
                  {filteredInventory.map((item) => {
                    const itemId = String(item._id || item.id || item.ID);
                    const itemName = item.Name || item.name || "";
                    const itemUnit = item.Unit || item.baseUnit || "pc";
                    const isAdded = recipeIngredients.some(ing => ing.sourceId === itemId);

                    return (
                      <div
                        key={itemId}
                        draggable={!isAdded}
                        onDragStart={() => !isAdded && handleInventoryDragStart(itemId)}
                        className={cn(
                          "group relative flex items-center h-[41px] px-3 bg-white border-b border-[#d5d5dd] transition-all",
                          isAdded
                            ? "opacity-50 cursor-not-allowed"
                            : "cursor-grab active:cursor-grabbing hover:bg-[#e0f2fe]"
                        )}
                      >
                        <div className="flex items-center gap-2">
                          <Package className="h-4 w-4 text-[#ea580c] shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-[#111827] truncate leading-tight">{itemName}</div>
                            <div className="text-[10px] text-[#9ca3af] font-medium uppercase leading-tight">
                              {itemUnit}
                            </div>
                          </div>
                        </div>
                        {isAdded && (
                          <div className="absolute top-1/2 -translate-y-1/2 right-3">
                            <span className="text-[9px] font-semibold bg-[#22c55e] text-white px-1.5 py-0.5 rounded">
                              ADDED
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                  {inventoryLoading && filteredInventory.length > 0 && (
                    <div className="text-center py-4 border-t border-[#e5e7eb]">
                      <Loader2 className="h-5 w-5 text-[#9ca3af] mx-auto animate-spin" />
                    </div>
                  )}
                  {!inventoryLoading && !inventoryHasMore && filteredInventory.length > 0 && (
                    <div className="text-center py-3 border-t border-[#e5e7eb]">
                      <p className="text-xs text-[#9ca3af]">All items loaded</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Center Panel - Recipe Form */}
      <div className="w-[60%] flex-1 flex flex-col overflow-hidden min-w-0 bg-white relative">
        {/* Mobile Panel Toggles - Positioned at top-32 for better visibility and workflow */}
        <div className="lg:hidden absolute left-0 top-32 z-40">
          <button
            onClick={() => setInventoryExpanded(!inventoryExpanded)}
            className="p-1.5 bg-[#111827] text-white rounded-r-md shadow-lg hover:bg-[#1f2937] transition-colors"
            title={inventoryExpanded ? "Collapse Inventory" : "Expand Inventory"}
          >
            <Package className="h-4 w-4" />
          </button>
        </div>
        <div className="xl:hidden absolute right-0 top-32 z-40">
          <button
            onClick={() => setSubRecipesExpanded(!subRecipesExpanded)}
            className="p-1.5 bg-[#111827] text-white rounded-l-md shadow-lg hover:bg-[#1f2937] transition-colors"
            title={subRecipesExpanded ? "Collapse Sub Recipes" : "Expand Sub Recipes"}
          >
            <Sparkles className="h-4 w-4" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden m-0 p-0" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {/* Saved Recipes List - Each as collapsible section */}
          <BatchList
            items={recipesList}
            expandedId={activeRecipeId}
            onToggleExpand={(id) => setActiveRecipeId(id)}
            onEdit={handleEditFromList}
            onRemove={handleRemoveFromList}
            scrollToId={scrollToRecipeId}
            renderHeader={(recipe, index) => (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded-full bg-[#22c55e] text-white flex items-center justify-center text-[10px] font-semibold">
                  {index + 1}
                </div>
                <span className={cn(
                  "text-xs font-semibold px-1.5 rounded uppercase h-5 flex items-center leading-none",
                  recipe.type === "final" ? "bg-[#eff6ff] text-[#3b82f6]" : "bg-[#faf5ff] text-[#9333ea]"
                )}>
                  {recipe.type}
                </span>
                <span className="text-xs font-semibold text-[#374151] leading-none">
                  {recipe.name} ({recipe.ingredients.length} ingredients)
                </span>
              </div>
            )}
            renderDetails={(recipe) => (
              <div className="text-xs text-[#6b7280] space-y-2">
                {recipe.description && <p><span className="font-medium">Description:</span> {recipe.description}</p>}
                <p><span className="font-medium">Yield:</span> {recipe.yield} portion(s)</p>
                <p><span className="font-medium">Status:</span> {recipe.isActive ? "Active" : "Inactive"}</p>
                <div>
                  <span className="font-medium">Ingredients:</span>
                  <ul className="mt-1 ml-4 list-disc">
                    {recipe.ingredients.map((ing: any, i: number) => (
                      <li key={i}>{ing.nameSnapshot} - {ing.quantity} {ing.unit}</li>
                    ))}
                  </ul>
                </div>
                {recipe.variations.length > 0 && (
                  <div>
                    <span className="font-medium">Variants:</span>
                    <ul className="mt-1 ml-4 list-disc">
                      {recipe.variations.map((v: any, i: number) => (
                        <li key={i}>{v.name} ({v.type})</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          />

          {/* Current Recipe Form - Collapsible Header */}
          <div
            className="sticky top-0 z-20 flex items-center justify-between cursor-pointer select-none px-3 h-[41px] leading-none box-border bg-[#f9fafb] border-b border-[#d5d5dd]"
            onClick={() => setRecipeFormExpanded(!recipeFormExpanded)}
          >
            <div className="flex items-center gap-2">
              {recipesList.length > 0 && (
                <div className="h-4 w-4 rounded-full bg-[#e5e7eb] text-[#6b7280] flex items-center justify-center text-[10px] font-semibold">
                  {recipesList.length + 1}
                </div>
              )}
              <UtensilsCrossed className="h-4 w-4 text-[#6b7280]" />
              <span className="text-[14px] font-semibold text-[#374151] uppercase leading-[14px]">
                {editingItem ? "Edit Recipe" : (formData.name?.trim() || "New Recipe")}
              </span>
              {!formData.name?.trim() && recipesList.length > 0 && (
                <span className="text-[10px] text-[#9ca3af] leading-[10px]">(optional)</span>
              )}
            </div>
            <div className="flex items-center gap-1">
              {recipeFormExpanded ? (
                <ChevronUp className="h-4 w-4 text-[#9ca3af]" />
              ) : (
                <ChevronDown className="h-4 w-4 text-[#9ca3af]" />
              )}
            </div>
          </div>

          {recipeFormExpanded && (
            <div className="p-4">
              <div className="space-y-5">
                {/* Name */}
                <div>
                  <Label className="text-sm font-medium text-[#374151] mb-1.5 block">
                    Recipe Name <span className="text-[#ef4444]">*</span>
                  </Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => handleFieldChange("name", e.target.value)}
                    placeholder={
                      recipeType === "sub"
                        ? "e.g., Burger Sauce, Grilled Patty"
                        : "e.g., Cheeseburger, Caesar Salad"
                    }
                    className="h-14 text-[15px]"
                  />
                </div>

                {/* Description */}
                <div>
                  <Label className="text-sm font-medium text-[#374151] mb-1.5 block">Description (Optional)</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => handleFieldChange("description", e.target.value)}
                    placeholder="Brief description..."
                    className="min-h-[72px] resize-none text-[15px]"
                    rows={2}
                  />
                </div>

                {/* Yield & Active Status Row */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-[#374151] mb-1.5 block">
                      Yield (Portions)
                    </Label>
                    <Input
                      type="number"
                      min="1"
                      value={formData.yield ?? ""}
                      onChange={(e) => {
                        handleFieldChange("yield", e.target.value);
                      }}
                      onFocus={(e) => e.target.select()}
                      placeholder="1"
                      className="h-14 text-[15px] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-[#374151] mb-1.5 block">Status</Label>
                    <div className="flex items-center justify-between rounded-sm border border-[#d5d5dd] bg-[#f8f8fa] px-4 h-14 w-full">
                      <span className="text-[#111827] text-sm font-medium">Active</span>
                      <Switch
                        checked={formData.isActive === true}
                        onCheckedChange={(checked) => handleFieldChange("isActive", checked)}
                      />
                    </div>
                  </div>
                </div>

                {/* Ingredients Drop Zone */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Label className="text-sm font-medium text-[#374151]">
                      Ingredients <span className="text-[#ef4444]">*</span>
                    </Label>
                    <CustomTooltip
                      label="Drag items from the side panels"
                      direction="right"
                    >
                      <Info className="h-3.5 w-3.5 text-[#9ca3af] cursor-pointer" />
                    </CustomTooltip>
                    {recipeIngredients.length > 0 && (
                      <span className="text-[10px] font-semibold bg-[#111827] text-white px-2 py-0.5 rounded-full">
                        {recipeIngredients.length}
                      </span>
                    )}
                  </div>

                  <div
                    onDragOver={(e) => {
                      handleInventoryDragOver(e);
                      handleRecipeDragOver(e);
                    }}
                    onDrop={(e) => {
                      if (draggedInventory) handleInventoryDrop(e);
                      if (draggedRecipe) handleRecipeDrop(e);
                    }}
                    className={cn(
                      "rounded-sm border-2 border-dashed transition-all hover:border-[#111827] hover:bg-gray-50 cursor-pointer",
                      recipeIngredients.length > 0
                        ? "bg-[#f8f8fa] border-[#d5d5dd] p-4"
                        : "bg-[#f8f8fa] border-[#d5d5dd] px-12 py-16 text-center"
                    )}
                  >
                    {recipeIngredients.length === 0 ? (
                      <div className="relative z-10 flex flex-col items-center">
                        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-sm bg-[#111827] shadow-lg">
                          <Package className="h-8 w-8 text-white" />
                        </div>
                        <h3 className="mb-2 text-lg font-bold text-[#111827]">No Ingredients Yet</h3>
                        <p className="mx-auto max-w-sm text-sm text-[#656565]">
                          Start building your recipe by dragging items from the <span className="font-semibold text-[#111827]">side panels</span>
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3 p-1">
                        {recipeIngredients.map((ingredient, index) => (
                          <div
                            key={index}
                            className="p-3 border border-[#d5d5dd] rounded-sm bg-white transition-colors"
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-2 min-w-0 flex-1">
                                <div className="min-w-0 flex-1">
                                  <div className="text-[14px] font-semibold text-[#111827] truncate">
                                    {ingredient.nameSnapshot}
                                  </div>
                                  <div className="flex items-center gap-1 mt-0.5">
                                    <span className={cn(
                                      "text-[9px] font-bold uppercase tracking-wider text-[#656565]"
                                    )}>
                                      {ingredient.sourceType}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleRemoveIngredient(index)}
                                className="text-[#9ca3af] hover:text-[#ef4444] transition-colors p-1"
                              >
                                <X size={16} />
                              </button>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <Label className="text-[11px] font-medium text-[#656565] mb-1 block">Quantity</Label>
                                <Input
                                  ref={(el) => {
                                    ingredientRefs.current[index] = el;
                                  }}
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  value={ingredient.quantity ?? ""}
                                  onChange={(e) => {
                                    handleUpdateIngredient(index, "quantity", e.target.value);
                                  }}
                                  onFocus={(e) => e.target.select()}
                                  placeholder="0"
                                  className="h-9 text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                />
                              </div>
                              <div>
                                <Label className="text-[11px] font-medium text-[#656565] mb-1 block">Unit</Label>
                                <div className="flex h-9 items-center px-4 rounded-sm bg-[#f8f8fa] border border-[#d5d5dd] text-xs font-medium text-[#656565]">
                                  {ingredient.unit || "—"}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Variants Section - Only for Final Recipes */}
                {recipeType === "final" && (
                  <div className="mt-8">
                    <div className="flex items-center gap-2 mb-2">
                      <Label className="text-sm font-medium text-[#374151]">Recipe Variants</Label>
                      <CustomTooltip label="Add size, flavor, or crust variants" direction="right">
                        <Info className="h-3.5 w-3.5 text-[#9ca3af] cursor-pointer" />
                      </CustomTooltip>
                      {variants.length > 0 && (
                        <span className="text-[10px] font-semibold bg-[#111827] text-white px-2 py-0.5 rounded-full">
                          {variants.length}
                        </span>
                      )}
                    </div>

                    {variants.length === 0 ? (
                      <div className="relative overflow-hidden rounded-sm border-2 border-dashed border-[#d5d5dd] bg-[#f8f8fa] p-12 text-center transition-all mb-4 hover:border-[#111827] hover:bg-gray-50 cursor-pointer">
                        <div className="relative z-10 flex flex-col items-center">
                          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-sm bg-[#111827] shadow-lg">
                            <Sparkles className="h-8 w-8 text-white" />
                          </div>
                          <h3 className="mb-2 text-lg font-bold text-[#111827]">No Variants Yet</h3>
                          <p className="mx-auto max-w-sm text-sm text-[#656565]">
                            Create standard sizes or a custom variant below to expand your menu
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3 p-1 mb-6">
                        {variants.map((variant, index) => (
                          <div key={index} ref={el => { variantRefs.current[index] = el; }}>
                            <RecipeVariantInput
                              variant={variant}
                              index={index}
                              ingredients={ingredients}
                              availableRecipeOptions={availableRecipeOptions}
                              onUpdate={handleUpdateVariant}
                              onRemove={handleRemoveVariant}
                              onIngredientUpdate={handleUpdateVariantIngredient}
                              onIngredientRemove={handleRemoveVariantIngredient}
                              onIngredientDrop={handleVariantIngredientDrop}
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Center Panel - Dynamic Action Slabs (Inline at end of scroll) */}
          <div className="flex flex-col shrink-0 mt-4">
            {/* Variant Creation Slabs - Only for Final Recipes */}
            {recipeType === "final" && (
              <div className="flex flex-col">
                {/* Size Slabs Row */}
                {(() => {
                  const availableSizes = [
                    { name: "Small", multiplier: 1 },
                    { name: "Medium", multiplier: 1.5 },
                    { name: "Large", multiplier: 2 }
                  ].filter(size => !variants.some(v => v.name.toLowerCase() === size.name.toLowerCase()));

                  if (availableSizes.length === 0) return null;

                  return (
                    <div className="flex bg-white h-[41px] border-t border-[#d5d5dd]">
                      {availableSizes.map(size => (
                        <button
                          key={size.name}
                          type="button"
                          onClick={() => handleAddStandardSize(size.name, size.multiplier)}
                          className="flex-1 flex flex-col items-center justify-center border-r last:border-r-0 border-[#d5d5dd] hover:bg-[#111827] group transition-all"
                        >
                          <span className="text-[12px] font-bold text-[#111827] group-hover:text-white leading-none mb-0.5">
                            {size.name}
                          </span>
                          <span className="text-[9px] font-medium text-[#656565] group-hover:text-gray-300 leading-none">
                            {size.multiplier}x Yield
                          </span>
                        </button>
                      ))}
                    </div>
                  );
                })()}

                <Button
                  type="button"
                  onClick={handleAddVariant}
                  variant="outline"
                  className="shrink-0 w-full h-[41px] rounded-none border-t border-x-0 border-b-0 border-[#d5d5dd] bg-white text-[15px] font-medium transition-all duration-200 hover:bg-[#111827] hover:text-white hover:border-[#111827] text-[#374151] group"
                >
                  <Plus className="h-4 w-4 mr-2 text-[#6b7280] group-hover:text-white transition-colors" />
                  Add Custom Recipe Variant
                </Button>
              </div>
            )}

            {/* Core Action Slab */}
            {!editingItem && (
              <Button
                type="button"
                onClick={handleAddToList}
                variant="outline"
                className={cn(
                  "shrink-0 w-full h-[41px] rounded-none border-t border-x-0 border-b-0 border-[#d5d5dd] bg-white text-[15px] font-medium transition-all duration-200 hover:bg-[#111827] hover:text-white hover:border-[#111827] text-[#374151]",
                  (!formData.name || recipeIngredients.length === 0) && "opacity-50 grayscale cursor-not-allowed"
                )}
                disabled={!formData.name || recipeIngredients.length === 0}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Another Recipe
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Right Panel - Sub Recipes */}
      <div className={cn(
        "flex flex-col border-l border-[#d5d5dd] shrink-0 bg-white transition-all duration-300 overflow-hidden",
        subRecipesExpanded ? "w-[20%]" : "w-0 md:w-10 opacity-0 md:opacity-100"
      )}>
        <div
          className="flex items-center justify-between cursor-pointer select-none px-3 h-[41px] leading-none box-border bg-[#f9fafb] border-b border-[#d5d5dd]"
          onClick={() => setSubRecipesExpanded(!subRecipesExpanded)}
        >
          <div className="flex items-center gap-2 overflow-hidden">
            <UtensilsCrossed className="h-4 w-4 text-[#6b7280] shrink-0" />
            <span className={cn(
              "text-[14px] font-semibold text-[#374151] uppercase leading-[14px] truncate transition-opacity duration-200",
              !subRecipesExpanded && "opacity-0 md:hidden"
            )}>
              Sub Recipes
            </span>
            {filteredRecipes.length > 0 && (
              <span className="text-[10px] font-medium text-[#6b7280] bg-white border border-[#d5d5dd] px-1.5 py-0.5 rounded leading-[10px]">
                {filteredRecipes.length}
              </span>
            )}
          </div>
          {subRecipesExpanded ? (
            <ChevronUp className="h-4 w-4 text-[#9ca3af]" />
          ) : (
            <ChevronDown className="h-4 w-4 text-[#9ca3af]" />
          )}
        </div>

        {subRecipesExpanded && (
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="h-[41px] px-3 flex items-center bg-white relative border-b border-[#d5d5dd]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9ca3af]" />
              <input
                type="text"
                value={recipeSearch}
                onChange={(e) => setRecipeSearch(e.target.value)}
                placeholder="Search recipes..."
                className="pl-9 h-full w-full focus:ring-0 focus:outline-none bg-transparent text-[15px] leading-tight"
              />
            </div>

            <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {filteredRecipes.length === 0 ? (
                <div className="text-center py-8">
                  <ChefHat className="h-10 w-10 text-[#d1d5db] mx-auto mb-2" />
                  <p className="text-sm text-[#9ca3af]">No sub recipes</p>
                </div>
              ) : (
                filteredRecipes.map((recipe, index) => {
                  const recipeId = String(recipe._id || recipe.ID);
                  const recipeName = recipe.Name || "";
                  const isAdded = recipeIngredients.some(ing => ing.sourceId === recipeId);
                  const isNewlyCreated = localSubRecipes.some(r => (r._id || r.ID) === (recipe._id || recipe.ID));

                  return (
                    <div
                      key={`${recipeId}-${index}`}
                      draggable={!isAdded}
                      onDragStart={() => !isAdded && handleRecipeDragStart(recipeId)}
                      className={cn(
                        "group relative flex items-center h-[41px] px-3 border-b border-[#e5e7eb] transition-all",
                        isNewlyCreated ? "bg-[#f0fdf4] animate-pulse" : "bg-white",
                        isAdded
                          ? "opacity-50 cursor-not-allowed"
                          : "cursor-grab active:cursor-grabbing hover:bg-[#f3e8ff]"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <ChefHat className={cn(
                          "h-4 w-4 shrink-0",
                          isNewlyCreated ? "text-[#22c55e]" : "text-[#9333ea]"
                        )} />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-[#111827] truncate leading-tight">
                            {recipeName}
                            {isNewlyCreated && (
                              <span className="ml-1 text-[9px] font-bold text-[#22c55e]">NEW</span>
                            )}
                          </div>
                          <div className="text-[10px] text-[#9ca3af] font-medium uppercase leading-tight">
                            Sub Recipe
                          </div>
                        </div>
                      </div>
                      {isAdded && (
                        <div className="absolute top-1/2 -translate-y-1/2 right-3">
                          <span className="text-[9px] font-semibold bg-[#22c55e] text-white px-1.5 py-0.5 rounded">
                            ADDED
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
            {editingItem ? "Edit Recipe" : "Create Recipe"}
          </DialogTitle>
        </DialogHeader>

        <Tabs
          value={formData.type}
          onValueChange={(value) => handleFieldChange("type", value as "sub" | "final")}
          className="flex-1 flex flex-col overflow-hidden"
        >
          <div className="px-8 pb-1 pt-2 shrink-0">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="final">Final Recipe</TabsTrigger>
              <TabsTrigger value="sub">Sub Recipe</TabsTrigger>
            </TabsList>
          </div>

          <DialogBody className="flex-1 overflow-hidden px-8 pt-0 pb-2">
            <TabsContent value="final" className="mt-0 h-full data-[state=active]:flex">
              <div className="flex-1 border border-[#d5d5dd] rounded-sm overflow-hidden">
                {renderTabContent("final")}
              </div>
            </TabsContent>
            <TabsContent value="sub" className="mt-0 h-full data-[state=active]:flex">
              <div className="flex-1 border border-[#d5d5dd] rounded-sm overflow-hidden">
                {renderTabContent("sub")}
              </div>
            </TabsContent>
          </DialogBody>
        </Tabs>

        <DialogFooter className="shrink-0 pt-3 bg-white">
          <Button
            onClick={handleSave}
            disabled={!formData.name || loading || actionLoading}
            className="bg-[#111827] hover:bg-[#1f2937] text-white px-6 h-11 text-[15px]"
          >
            {loading || actionLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>{editingItem ? "Update Recipe" : "Create Recipe"}</>
            )}
          </Button>
          <Button
            onClick={onClose}
            variant="outline"
            className="px-6 h-11 border-[#d5d5dd] text-[15px]"
            disabled={loading || actionLoading}
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
