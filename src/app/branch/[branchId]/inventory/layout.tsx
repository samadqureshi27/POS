"use client";

import { useParams } from "next/navigation";
import BaseSubmenu from "@/components/layout/BaseSubmenu";

export default function InventoryLayout({ children }: { children: React.ReactNode }) {
  const { branchId } = useParams();

  const items = [
    { label: "Inventory", href: `/branch/${branchId}/inventory` },
    { label: "Vendors", href: `/branch/${branchId}/inventory/vendors` },
    { label: "Reports", href: `/branch/${branchId}/inventory/reports` },
  ];

  return (
    <div className="flex">
      <BaseSubmenu items={items} />
      <div className="flex-1 p-4">{children}</div>
    </div>
  );
}
