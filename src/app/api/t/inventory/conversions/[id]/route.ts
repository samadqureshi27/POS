// src/app/api/t/inventory/conversions/[id]/route.ts

import { NextResponse } from "next/server";
import { buildTenantHeaders, getRemoteBase } from "@/app/api/_utils/proxy-helpers";

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const url = `${getRemoteBase()}/t/inventory/conversions/${id}`;

  const res = await fetch(url, {
    method: "DELETE",
    headers: buildTenantHeaders(req, true)
  });

  const contentType = res.headers.get("content-type");
  if (contentType?.includes("application/json")) {
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  }

  const text = await res.text();
  return new NextResponse(text, { status: res.status });
}
