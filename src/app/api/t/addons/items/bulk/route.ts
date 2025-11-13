// src/app/api/t/addons/items/bulk/route.ts

import { NextResponse } from "next/server";
import { buildTenantHeaders, getRemoteBase } from "@/app/api/_utils/proxy-helpers";

export async function POST(req: Request) {
  const payload = await req.json().catch(() => ({}));
  const url = `${getRemoteBase()}/t/addons/items/bulk`;

  const res = await fetch(url, {
    method: "POST",
    headers: buildTenantHeaders(req, true),
    body: JSON.stringify(payload)
  });

  const contentType = res.headers.get("content-type");
  if (contentType?.includes("application/json")) {
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  }

  const text = await res.text();
  return new NextResponse(text, { status: res.status });
}
