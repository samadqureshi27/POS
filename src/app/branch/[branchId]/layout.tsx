"use client";

import { useParams, usePathname } from "next/navigation";
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
    <div className="flex">
      <BaseSubmenu items={mainItems} showBackArrow={true} />
      <div className="flex-1">{children}</div>
    </div>
  );
}