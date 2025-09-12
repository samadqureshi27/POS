// types/interfaces.ts
export interface MenuItemOptions {
  ID: number;
  Name: string;
  DisplayType: "Radio" | "Select" | "Checkbox";
  Priority: number;
  OptionValue: string[];
  OptionPrice: number[];
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface ToastProps {
  message: string;
  type: "success" | "error";
  onClose: () => void;
}