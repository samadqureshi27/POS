import { useState } from "react";

export const useSelection = () => {
  const [selectedItems, setSelectedItems] = useState<(number | string)[]>([]);

  const handleSelectAll = (checked: boolean, items: any[], idField?: string) => {
    if (checked) {
      let allIds;
      if (idField) {
        // Use the specified ID field
        allIds = items.map((item) => item[idField]);
      } else {
        // Auto-detect the ID field
        allIds = items.map((item) => {
          // Find the first property that looks like an ID
          const keys = Object.keys(item);
          const idKey = keys.find(key => 
            key.toLowerCase().includes('id') || 
            key === 'ID' || 
            key === 'Id'
          );
          return idKey ? item[idKey] : item;
        });
      }
      setSelectedItems(allIds);
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (id: number | string, checked: boolean) => {
    setSelectedItems(
      checked ? [...selectedItems, id] : selectedItems.filter((i) => i !== id)
    );
  };

  const clearSelection = () => {
    setSelectedItems([]);
  };

  const isAllSelected = (items: any[]) => selectedItems.length === items.length && items.length > 0;
  const isSomeSelected = selectedItems.length > 0;

  return {
    selectedItems,
    handleSelectAll,
    handleSelectItem,
    clearSelection,
    isAllSelected,
    isSomeSelected,
  };
};