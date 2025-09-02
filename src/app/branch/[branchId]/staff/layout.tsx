"use client";

import { useParams } from "next/navigation";
import BaseSubmenu from "@/components/layout/BaseSubmenu";

export default function StaffLayout({ children }: { children: React.ReactNode }) {
  const { branchId } = useParams();

  const items = [
    { label: "Employees", href: `/branch/${branchId}/staff` },
    { label: "Payroll", href: `/branch/${branchId}/staff/payroll` },
  ];

  return (
    <div className="flex">
      <BaseSubmenu items={items} showBackArrow={true} />
      <div className="flex-1 p-4">{children}</div>
    </div>
  );
}
