"use client";

import { useParams, usePathname } from "next/navigation";
import { Building2 } from "lucide-react";
import BaseSubmenu from "@/components/base-submenu";

export default function BranchLayout({ children }: { children: React.ReactNode }) {
  const { branchId } = useParams();
  const pathname = usePathname();

  // Define main menu items
  const mainItems = [
    { label: "POS", href: `/branch/${branchId}/pos` },
    {
      label: "Inventory",
      href: `/branch/${branchId}/inventory`, // Main button navigates here
      hasSubmenu: true,
      submenuItems: [
        { label: "Inventory", href: `/branch/${branchId}/inventory` }, // This gets skipped by slice(1)
        { label: "Vendors", href: `/branch/${branchId}/inventory/vendors` },
        { label: "Reports", href: `/branch/${branchId}/inventory/reports` },
      ]
    },
    {
      label: "Staff Management",
      href: `/branch/${branchId}/staff`, // Main button navigates here
      hasSubmenu: true,
      submenuItems: [
        { label: "Employees", href: `/branch/${branchId}/staff` }, // This gets skipped by slice(1)
        { label: "Payroll", href: `/branch/${branchId}/staff/payroll` },
      ]
    },
    { label: "Menu", href: `/branch/${branchId}/menu` },
  ];

  return (
    <div className="flex min-w-0 max-w-full overflow-x-hidden">
      {/* When showBackArrow is true, it shows back arrow instead of contextIcon */}
      <BaseSubmenu items={mainItems} showBackArrow={true} />
      <div className="flex-1 min-w-0 max-w-full overflow-x-hidden">{children}</div>
    </div>
  );
}