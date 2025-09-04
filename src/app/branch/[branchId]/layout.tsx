"use client";

import { useParams, usePathname } from "next/navigation";
import BaseSubmenu from "@/components/layout/BaseSubmenu";

export default function BranchLayout({ children }: { children: React.ReactNode }) {
  const { branchId } = useParams();
  const pathname = usePathname();

  // Define main menu items
  const mainItems = [
    { label: "POS", href: `/branch/${branchId}/pos` },
    { 
      label: "Inventory", 
      href: `/branch/${branchId}/inventory`,
      hasSubmenu: true,
      submenuItems: [
        { label: "Inventory", href: `/branch/${branchId}/inventory` },
        { label: "Vendors", href: `/branch/${branchId}/inventory/vendors` },
        { label: "Reports", href: `/branch/${branchId}/inventory/reports` },
      ]
    },
    { 
      label: "Staff Management", 
      href: `/branch/${branchId}/staff`,
      hasSubmenu: true,
      submenuItems: [
        { label: "Employees", href: `/branch/${branchId}/staff` },
        { label: "Payroll", href: `/branch/${branchId}/staff/payroll` },
      ]
    },
  ];

  return (
    <div className="flex">
      <BaseSubmenu items={mainItems} showBackArrow={true} />
      <div className="flex-1 p-4">{children}</div>
    </div>
  );
}