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