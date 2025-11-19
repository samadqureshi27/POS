import { redirect } from "next/navigation";

export default async function BranchPage({ params }: { params: Promise<{ branchId: string }> }) {
  const { branchId } = await params;
  // Redirect only when someone visits /branch/[branchId] directly
  redirect(`/branch/${branchId}/pos`);
}
