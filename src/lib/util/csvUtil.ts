// src/lib/util/csvUtil.ts

import type { InventoryItem } from "./inventoryApi";

export const exportToCSV = (items: InventoryItem[], filename: string = "inventory") => {
  if (items.length === 0) {
    alert("No items to export");
    return;
  }

  // Define CSV headers
  const headers = [
    "ID",
    "Name",
    "SKU",
    "Type",
    "Base Unit",
    "Purchase Unit",
    "Conversion Factor",
    "Track Stock",
    "Current Stock",
    "Reorder Point",
    "Category",
    "Barcode",
    "Tax Category",
    "Status",
    "Priority",
  ];

  // Convert items to CSV rows
  const rows = items.map((item) => [
    item.ID,
    item.name,
    item.sku || "",
    item.type,
    item.baseUnit,
    item.purchaseUnit || "",
    item.conversionFactor || "",
    item.trackStock ? "Yes" : "No",
    item.currentStock || 0,
    item.reorderPoint || 0,
    item.category || "",
    item.barcode || "",
    item.taxCategory || "",
    item.Status,
    item.Priority,
  ]);

  // Combine headers and rows
  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
  ].join("\n");

  // Create blob and download
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}_${new Date().toISOString().split("T")[0]}.csv`);
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const importFromCSV = (file: File): Promise<Partial<InventoryItem>[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const lines = text.split("\n").filter((line) => line.trim());

        if (lines.length < 2) {
          reject(new Error("CSV file is empty or invalid"));
          return;
        }

        // Skip header row
        const dataLines = lines.slice(1);

        const items: Partial<InventoryItem>[] = dataLines.map((line) => {
          const values = line.split(",").map((val) => val.replace(/^"|"$/g, "").trim());

          return {
            name: values[1] || "",
            sku: values[2] || undefined,
            type: (values[3] as "stock" | "service") || "stock",
            baseUnit: values[4] || "pc",
            purchaseUnit: values[5] || undefined,
            conversionFactor: values[6] ? parseFloat(values[6]) : undefined,
            trackStock: values[7] === "Yes",
            currentStock: values[8] ? parseInt(values[8]) : 0,
            reorderPoint: values[9] ? parseInt(values[9]) : 0,
            category: values[10] || undefined,
            barcode: values[11] || undefined,
            taxCategory: values[12] || undefined,
            Status: (values[13] as "Active" | "Inactive") || "Active",
            Priority: values[14] ? parseInt(values[14]) : 1,
          };
        });

        resolve(items);
      } catch (error) {
        reject(new Error("Failed to parse CSV file"));
      }
    };

    reader.onerror = () => {
      reject(new Error("Failed to read file"));
    };

    reader.readAsText(file);
  });
};
