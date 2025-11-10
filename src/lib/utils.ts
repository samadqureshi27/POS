import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Inventory helpers
// Calculate stock status based on current stock and threshold
// Kept here to decouple UI logic from any mock API implementations
export function calculateStatus(
  updatedStock: number,
  threshold: number
): "Low" | "Medium" | "High" {
  if (updatedStock <= threshold) {
    return "Low";
  } else if (updatedStock <= threshold * 1.25) {
    return "Medium";
  } else {
    return "High";
  }
}
