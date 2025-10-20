// _components/types.ts
export interface OrderItem {
  Order: string;
  Name: string;
  number_item: string;
  Status: "Active" | "Inactive";
  Type: string;
  Payment: string;
  Total: string;
  Time_Date: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface OrderStats {
  mostOrdered: OrderItem[];
  leastOrdered: OrderItem[];
  orderTypeStats: Array<{
    name: string;
    value: number;
    fill: string;
  }>;
}

export interface ToastProps {
  message: string;
  type: "success" | "error";
  onClose: () => void;
}

export interface DateRangeType {
  startDate: Date;
  endDate: Date;
  key: string;
}

// ---------------------------------- //

// types/ general settings
export interface GeneralSettings {
  currency: string;
  currencyPosition: "before" | "after";
  decimalPlaces: number;
  taxRate: number;
  language: string;
  timezone: string;
  dateFormat: string;
  timeFormat: "12" | "24";
  autoPrintReceipts: boolean;
  receiptCopies: number;
  receiptFooter: string;
  requireManagerForRefunds: boolean;
  requireManagerForDiscounts: boolean;
  sessionTimeout: number;
  enableNotifications: boolean;
  enableSounds: boolean;
  
  
  // New Order Timer Settings
  orderTimerEnabled: boolean;
  greenThresholdMinutes: number;
  yellowThresholdMinutes: number;
  redThresholdMinutes: number;
  timerResetOnComplete: boolean;
}
export interface ToastProps {
  message: string;
  type: "success" | "error";
  onClose: () => void;
  isVisible: boolean;
}

export interface DropdownOption {
  value: string;
  label: string;
}

export interface DropdownProps {
  value: string;
  options: DropdownOption[];
  onValueChange: (value: string) => void;
  placeholder: string;
}

export interface ButtonPageProps {
  checked: boolean;
  onChange: (value: boolean) => void;
}


// types/restaurant.ts
export interface RestaurantData {
  name: string;
  type: string;
  ownerName:string;
  contact: string;
  email: string;
  address: string;
  description: string;
  website: string;
  openingTime: string;
  closingTime: string;
  logo: File | null;
}

