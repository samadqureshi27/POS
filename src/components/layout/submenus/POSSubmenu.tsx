// src/components/layout/submenus/POSSubmenu.tsx
import BaseSubmenu from '../BaseSubmenu';

export default function POSSubmenu() {
  const submenuConfig = {
    title: "POS Management",
    logo: "/pos-logo.png",
    items: [
      { label: "Dashboard", href: "/pos/dashboard" },
      { label: "Orders", href: "/pos/orders" },
      { label: "Products", href: "/pos/products" },
    ],
    actions: ["Add Product", "View Reports"]
  };

  const currentPath = "/pos/dashboard"; // Get this from router or props

  return (
    <BaseSubmenu 
      config={submenuConfig} 
      currentPath={currentPath} 
    />
  );
}