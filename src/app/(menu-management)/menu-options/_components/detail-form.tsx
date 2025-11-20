// components/DetailsForm.tsx
import React, { useState, useEffect } from 'react';
import { toast } from "sonner";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MenuItemOptions, DetailsFormProps } from '@/lib/types/menuItemOptions';
import { MenuCategoryService } from '@/lib/services/menu-category-service';
import { AddonsGroupsService, AddonGroup } from '@/lib/services/addons-groups-service';
import { Plus, Loader2, ChevronDown } from 'lucide-react';

interface MenuCategory {
  _id?: string;
  id?: string;
  name: string;
}

const DetailsForm: React.FC<DetailsFormProps> = ({ formData, onFormDataChange }) => {
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [groups, setGroups] = useState<AddonGroup[]>([]);
  const [groupInput, setGroupInput] = useState("");
  const [showGroupSuggestions, setShowGroupSuggestions] = useState(false);
  const [addingGroup, setAddingGroup] = useState(false);

  // Load categories and groups on mount
  useEffect(() => {
    loadCategories();
    loadGroups();
  }, []);

  // Reload groups when category changes
  useEffect(() => {
    if (formData.categoryId) {
      loadGroups(formData.categoryId);
    }
  }, [formData.categoryId]);

  const loadCategories = async () => {
    const res = await MenuCategoryService.listCategories({ limit: 1000 });
    if (res.success && res.data) {
      setCategories(res.data);
    }
  };

  const loadGroups = async (categoryId?: string) => {
    const res = await AddonsGroupsService.listGroups(categoryId ? { categoryId } : undefined);
    if (res.success && res.data) {
      setGroups(res.data);
    }
  };

  const handleGroupInputChange = (value: string) => {
    setGroupInput(value);
    setShowGroupSuggestions(value.length > 0);
  };

  const selectGroup = (group: AddonGroup) => {
    setGroupInput(group.name);
    onFormDataChange({
      ...formData,
      groupId: group._id || group.id,
      groupName: group.name,
      categoryId: group.categoryId,
    });
    setShowGroupSuggestions(false);
  };

  const handleCategoryChange = (categoryId: string) => {
    onFormDataChange({
      ...formData,
      categoryId,
      groupId: undefined,
      groupName: undefined,
    });
    setGroupInput("");
  };

  const handleAddGroup = async () => {
    if (!groupInput.trim()) return;
    if (!formData.categoryId) {
      toast.error("Please select a category first");
      return;
    }

    setAddingGroup(true);
    try {
      const res = await AddonsGroupsService.createGroup({
        categoryId: formData.categoryId,
        name: groupInput.trim(),
        isActive: true,
      });

      if (res.success && res.data) {
        setGroups([...groups, res.data]);
        onFormDataChange({
          ...formData,
          groupId: res.data._id || res.data.id,
          groupName: res.data.name,
        });
        setShowGroupSuggestions(false);
      } else {
        toast.error(res.message || "Failed to create group");
      }
    } catch (error) {
      toast.error("An error occurred while creating the group");
    } finally {
      setAddingGroup(false);
    }
  };

  const filteredGroups = groups.filter((group) =>
    group.name?.toLowerCase().includes(groupInput.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Fixed Header Section - Non-scrollable */}
      <div className="flex-shrink-0 space-y-4 p-6 bg-white">
        <div>
          <h3 className="text-sm font-semibold text-gray-800">
            Option Details
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            Configure the basic settings for this menu item option
          </p>
        </div>
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 min-h-0 overflow-y-auto px-6 pb-6">
        <div className="space-y-6">
          {/* Menu Category */}
          <div className="space-y-2">
            <Label htmlFor="categoryId" className="text-sm font-medium text-gray-700">
              Menu Category <span className="text-red-500">*</span>
            </Label>
            <p className="text-xs text-gray-500">
              Select the menu category for this add-on group
            </p>
            <Select
              value={formData.categoryId}
              onValueChange={handleCategoryChange}
            >
              <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-blue-500/20 w-full min-w-0">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent className="z-[100]">
                {categories.map((cat) => (
                  <SelectItem key={cat._id || cat.id} value={cat._id || cat.id || ''}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Add-on Group with Runtime Creation */}
          {formData.categoryId && (
            <div className="space-y-2">
              <Label htmlFor="groupId" className="text-sm font-medium text-gray-700">
                Add-on Group <span className="text-red-500">*</span>
              </Label>
              <p className="text-xs text-gray-500">
                Select or create a new add-on group
              </p>
              <div className="relative flex gap-2">
                <div className="relative flex-1">
                  <Input
                    id="groupId"
                    type="text"
                    value={groupInput}
                    onChange={(e) => handleGroupInputChange(e.target.value)}
                    onFocus={() => setShowGroupSuggestions(groupInput.length > 0)}
                    placeholder="Type to search or create group"
                    className="transition-all duration-200 focus:ring-2 focus:ring-blue-500/20 w-full min-w-0 pr-8"
                  />
                  <ChevronDown
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 cursor-pointer"
                    onClick={() => setShowGroupSuggestions(!showGroupSuggestions)}
                  />

                  {/* Suggestions Dropdown */}
                  {showGroupSuggestions && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-y-auto z-50">
                      {filteredGroups.length > 0 ? (
                        filteredGroups.map((group) => (
                          <div
                            key={group._id || group.id}
                            onClick={() => selectGroup(group)}
                            className="px-3 py-2 cursor-pointer hover:bg-gray-100 text-sm"
                          >
                            {group.name}
                          </div>
                        ))
                      ) : (
                        <div className="px-3 py-2 text-sm text-gray-500">
                          No groups found. Click + to create one.
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <Button
                  type="button"
                  onClick={handleAddGroup}
                  disabled={!groupInput.trim() || addingGroup}
                  className="bg-gray-900 hover:bg-black text-white"
                >
                  {addingGroup ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Plus className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="optionName" className="text-sm font-medium text-gray-700">
              Option Name <span className="text-red-500">*</span>
            </Label>
            <p className="text-xs text-gray-500">
              Name of the option that will appear in the POS system
            </p>
            <Input
              id="optionName"
              type="text"
              value={formData.Name}
              onChange={(e) =>
                onFormDataChange({ ...formData, Name: e.target.value })
              }
              placeholder="Enter option name (e.g., Size, Toppings)"
              className="transition-all duration-200 focus:ring-2 focus:ring-blue-500/20 w-full min-w-0"
            />
          </div>

          {/* Display Type and Priority Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Display Type */}
            <div className="space-y-2 min-w-0">
              <Label htmlFor="displayType" className="text-sm font-medium text-gray-700">
                Display Type <span className="text-red-500">*</span>
              </Label>
              <p className="text-xs text-gray-500">
                How options will be displayed to customers
              </p>
              <Select
                value={formData.DisplayType}
                onValueChange={(value) => onFormDataChange({ ...formData, DisplayType: value as "Radio" | "Select" | "Checkbox" })}
              >
                <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-blue-500/20 w-full min-w-0">
                  <SelectValue placeholder="Select display type" />
                </SelectTrigger>
                <SelectContent className="z-[100]">
                  <SelectItem value="Radio">Radio - Select only one option</SelectItem>
                  <SelectItem value="Select">Select - Select one or none</SelectItem>
                  <SelectItem value="Checkbox">Checkbox - Select one or more</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Priority */}
            <div className="space-y-2 min-w-0">
              <Label htmlFor="priority" className="text-sm font-medium text-gray-700">
                Priority
              </Label>
              <p className="text-xs text-gray-500">
                Display order in the POS (lower numbers appear first)
              </p>
              <Input
                id="priority"
                type="number"
                value={formData.Priority || ""}
                onChange={(e) => {
                  const value = e.target.value;
                  // Only allow numbers and empty string
                  if (value === '' || /^\d+$/.test(value)) {
                    onFormDataChange({
                      ...formData,
                      Priority: value === '' ? 0 : Number(value)
                    });
                  }
                  // If invalid input, just ignore it (don't update state)
                }}
                placeholder="1"
                min={1}
                className="transition-all duration-200 focus:ring-2 focus:ring-blue-500/20 w-full min-w-0"
              />
            </div>
          </div>

          {/* Information Card */}
          <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <div className="min-w-0 flex-1">
                <h4 className="text-sm font-medium text-blue-800 mb-1">Next Step</h4>
                <p className="text-xs text-blue-700 leading-relaxed">
                  After saving the option details, switch to the "Option Values" tab to add add-on items from inventory or recipes.
                </p>
              </div>
            </div>
          </div>

          {/* Additional spacing for better scroll experience */}
          <div className="h-4"></div>
        </div>
      </div>
    </div>
  );
};

export default DetailsForm;
