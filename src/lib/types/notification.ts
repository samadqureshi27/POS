export interface NotificationSettings {
  // Order Management
  newOrderAlerts: boolean;
  orderSound: boolean;
  orderPushNotifications: boolean;
  orderModificationAlerts: boolean;

  // Table & Reservations
  newReservationAlerts: boolean;
  tableReadyNotifications: boolean;
  reservationReminders: boolean;

  // Kitchen Notifications
  kitchenOrderAlerts: boolean;
  priorityOrderAlerts: boolean;
  inventoryLowAlerts: boolean;

  // Payment Notifications
  paymentAlerts: boolean;
  refundAlerts: boolean;
  highValueTransactionAlerts: boolean;

  // Customer Service
  customerFeedbackAlerts: boolean;
  specialRequestAlerts: boolean;

  // Notification Preferences
  emailNotifications: boolean;
  quietHoursEnabled: boolean;
  quietHoursStart: string;
  quietHoursEnd: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

