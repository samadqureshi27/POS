"use client";

import { useParams } from "next/navigation";
import BaseSubmenu from "@/components/layout/BaseSubmenu";

export default function PosLayout({ children }: { children: React.ReactNode }) {
  const { branchId } = useParams(); // ✅ get branchId dynamically

  const items = [
    { label: "POS", href: `/branch/${branchId}/pos` },
    { label: "Inventory", href: `/branch/${branchId}/inventory` },
    { label: "Staff Management", href: `/branch/${branchId}/staff` },
  ];

  return (
   <div className="flex">
      <BaseSubmenu items={items} showBackArrow={true} />
      <div className="flex-1 p-4">{children}</div>
    </div>
  );
}
