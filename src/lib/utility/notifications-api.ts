import { NotificationSettings, ApiResponse } from "../../types/notification";

export class NotificationsAPI {
  private static delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  private static mockSettings: NotificationSettings = {
    newOrderAlerts: true,
    orderSound: true,
    orderPushNotifications: true,
    orderModificationAlerts: true,
    newReservationAlerts: true,
    tableReadyNotifications: true,
    reservationReminders: true,
    kitchenOrderAlerts: true,
    priorityOrderAlerts: true,
    inventoryLowAlerts: true,
    paymentAlerts: true,
    refundAlerts: true,
    highValueTransactionAlerts: true,
    customerFeedbackAlerts: true,
    specialRequestAlerts: true,
    emailNotifications: true,
    quietHoursEnabled: false,
    quietHoursStart: "22:00",
    quietHoursEnd: "07:00",
  };

  static async getSettings(): Promise<ApiResponse<NotificationSettings>> {
    await this.delay(800);
    return {
      success: true,
      data: { ...this.mockSettings },
      message: "Notification settings loaded successfully",
    };
  }

  static async updateSettings(
    settings: Partial<NotificationSettings>
  ): Promise<ApiResponse<NotificationSettings>> {
    await this.delay(1000);
    this.mockSettings = { ...this.mockSettings, ...settings };
    return {
      success: true,
      data: { ...this.mockSettings },
      message: "Notification settings updated successfully",
    };
  }

  static async resetToDefaults(): Promise<ApiResponse<NotificationSettings>> {
    await this.delay(1200);
    const defaultSettings: NotificationSettings = {
      newOrderAlerts: true,
      orderSound: true,
      orderPushNotifications: true,
      orderModificationAlerts: true,
      newReservationAlerts: true,
      tableReadyNotifications: true,
      reservationReminders: true,
      kitchenOrderAlerts: true,
      priorityOrderAlerts: true,
      inventoryLowAlerts: true,
      paymentAlerts: true,
      refundAlerts: true,
      highValueTransactionAlerts: true,
      customerFeedbackAlerts: true,
      specialRequestAlerts: true,
      emailNotifications: true,
      quietHoursEnabled: false,
      quietHoursStart: "22:00",
      quietHoursEnd: "07:00",
    };

    this.mockSettings = { ...defaultSettings };
    return {
      success: true,
      data: { ...this.mockSettings },
      message: "Settings reset to defaults successfully",
    };
  }
}
