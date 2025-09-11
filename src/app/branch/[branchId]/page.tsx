import { redirect } from "next/navigation";

export default function BranchPage({ params }: { params: { branchId: string } }) {
  // Redirect only when someone visits /branch/[branchId] directly
  redirect(`/branch/${params.branchId}/pos`);
}
