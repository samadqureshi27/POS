"use client";

import { useParams } from "next/navigation";
import BaseSubmenu from "@/components/layout/BaseSubmenu";

export default function PosLayout({ children }: { children: React.ReactNode }) {
  const { branchId } = useParams(); // ✅ get branchId dynamically

  const items = [
    { label: "POS Dashboard", href: `/branch/${branchId}/pos` },
    { label: "Transactions", href: `/branch/${branchId}/pos/transactions` },
    { label: "Reports", href: `/branch/${branchId}/pos/reports` },
  ];

  return (
    <div className="flex">
      <BaseSubmenu items={items} />
      <div className="flex-1 p-4">{children}</div>
    </div>
  );
}
