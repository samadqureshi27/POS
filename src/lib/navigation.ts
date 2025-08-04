export const navigationConfig = {
  pos: {
    title: "POS Management",
    logo: "/logos/pos.svg",
    items: [
      { label: "POS List", href: "/pos-list" },
      { label: "Staff Management", href: "/staff-management" },
      { label: "Menu Management", href: "/menu-management" },
      { label: "Inventory Management", href: "/inventory-management" },
      { label: "Recipes Management", href: "/recipes-management" }
    ],
    actions: ["New POS", "Settings"]
  },
  
  staff: {
    title: "Staff Management",
    logo: "/logos/staff.svg",
    items: [
      { label: "Overview", href: "/staff-management" },
      { label: "Payroll", href: "/payroll" },
      { label: "Employee Records", href: "/employee-records" }
    ],
    actions: ["Add Employee", "Generate Report"]
  },
  
  menu: {
    title: "Menu Management",
    logo: "/logos/menu.svg",
    items: [
      { label: "Overview", href: "/menu-management" },
      { label: "Options", href: "/options" },
      { label: "Category", href: "/category" }
    ],
    actions: ["Add Item", "Import Menu"]
  },
  
  inventory: {
    title: "Inventory Management",
    logo: "/logos/inventory.svg",
    items: [
      { label: "Overview", href: "/inventory-management" },
      { label: "Vendors", href: "/vendors" },
      { label: "Reports", href: "/reports" }
    ],
    actions: ["Add Stock", "Order Supplies"]
  },
  
  recipes: {
    title: "Recipes Management",
    logo: "/logos/recipes.svg",
    items: [
      { label: "Overview", href: "/recipes-management" },
      { label: "Options", href: "/options" },
      { label: "Ingredients", href: "/ingredients" }
    ],
    actions: ["New Recipe", "Import Recipes"]
  },
  
  analytics: {
    title: "Analytics & Reports",
    logo: "/logos/analytics.svg",
    items: [
      { label: "Overview", href: "/analytics" },
      { label: "Financial Report", href: "/financial-report" },
      { label: "Customer Analytics", href: "/customer-analytics" },
      { label: "Customer Reports", href: "/customer-reports" }
    ],
    actions: ["Export Data", "Schedule Report"]
  },
  
  customerManagement: {
    title: "Customer Management",
    logo: "/logos/customer.svg",
    items: [
      { label: "Overview", href: "/customer-management" },
      { label: "Customer Details", href: "/customer-details" },
      { label: "Loyalty Details", href: "/loyalty-details" }
    ],
    actions: ["Add Customer", "Import Customers"]
  }
}