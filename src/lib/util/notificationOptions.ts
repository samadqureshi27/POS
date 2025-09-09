import {
    ShoppingCart,
    Calendar,
    Utensils,
    CreditCard,
    MessageSquare,
    Settings,
} from "lucide-react";

export const NOTIFICATION_SECTIONS = [
    {
        title: "Order Management",
        icon: ShoppingCart,
        options: [
            { key: "newOrderAlerts" as const, label: "New Order Alerts" },
            { key: "orderSound" as const, label: "Order Sounds" },
            { key: "orderPushNotifications" as const, label: "Push Notifications" },
            { key: "orderModificationAlerts" as const, label: "Modification Alerts" },
        ],
    },
    {
        title: "Table & Reservations",
        icon: Calendar,
        options: [
            { key: "newReservationAlerts" as const, label: "New Reservations" },
            { key: "tableReadyNotifications" as const, label: "Table Ready" },
            { key: "reservationReminders" as const, label: "Reservation Reminders" },
        ],
    },
    {
        title: "Kitchen & Inventory",
        icon: Utensils,
        options: [
            { key: "kitchenOrderAlerts" as const, label: "Kitchen Orders" },
            { key: "priorityOrderAlerts" as const, label: "Priority Orders" },
            { key: "inventoryLowAlerts" as const, label: "Low Inventory" },
        ],
    },
    {
        title: "Payment Alerts",
        icon: CreditCard,
        options: [
            { key: "paymentAlerts" as const, label: "Payment Alerts" },
            { key: "refundAlerts" as const, label: "Refund Alerts" },
            {
                key: "highValueTransactionAlerts" as const,
                label: "High-Value Transactions",
            },
        ],
    },
    {
        title: "Customer Service",
        icon: MessageSquare,
        options: [
            { key: "customerFeedbackAlerts" as const, label: "Feedback Alerts" },
            { key: "specialRequestAlerts" as const, label: "Special Requests" },
        ],
    },
    {
        title: "Preferences",
        icon: Settings,
        options: [
            { key: "emailNotifications" as const, label: "Email Notifications" },
        ],
        hasQuietHours: true,
    },
];
