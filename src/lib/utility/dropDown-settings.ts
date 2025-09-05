import { GeneralSettings, DropdownOption } from "../../types/types";

export const DEFAULT_SETTINGS: GeneralSettings = {
  currency: "PKR",
  currencyPosition: "before",
  decimalPlaces: 2,
  taxRate: 0,
  language: "en",
  timezone: "Asia/Karachi",
  dateFormat: "MM/DD/YYYY",
  timeFormat: "12",
  autoPrintReceipts: false,
  receiptCopies: 1,
  receiptFooter: "Thank you for your business!",
  requireManagerForRefunds: true,
  requireManagerForDiscounts: false,
  sessionTimeout: 60,
  enableNotifications: true,
  enableSounds: true,
};

export const OPTIONS = {
  language: [
    { value: "en", label: "English" },
    { value: "es", label: "Spanish" },
    { value: "fr", label: "French" },
    { value: "de", label: "German" },
    { value: "zh", label: "Chinese" },
  ] as DropdownOption[],

  currency: [
    { value: "USD", label: "US Dollar ($)" },
    { value: "EUR", label: "Euro (€)" },
    { value: "GBP", label: "British Pound (£)" },
    { value: "JPY", label: "Japanese Yen (¥)" },
    { value: "CAD", label: "Canadian Dollar (C$)" },
    { value: "PKR", label: "Pakistani Rupee (₨)" },
  ] as DropdownOption[],

  timezone: [
    { value: "America/New_York", label: "Eastern Time" },
    { value: "America/Chicago", label: "Central Time" },
    { value: "America/Denver", label: "Mountain Time" },
    { value: "America/Los_Angeles", label: "Pacific Time" },
    { value: "Europe/London", label: "GMT" },
    { value: "Asia/Karachi", label: "Pakistan Standard Time" },
  ] as DropdownOption[],

  dateFormat: [
    { value: "MM/DD/YYYY", label: "MM/DD/YYYY (12/31/2024)" },
    { value: "DD/MM/YYYY", label: "DD/MM/YYYY (31/12/2024)" },
    { value: "YYYY-MM-DD", label: "YYYY-MM-DD (2024-12-31)" },
  ] as DropdownOption[],
};
