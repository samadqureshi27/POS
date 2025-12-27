// src/app/api/t/branch-inventory/items/route.ts

import { NextResponse } from "next/server";
import { buildTenantHeaders, getRemoteBase } from "@/app/api/_utils/proxy-helpers";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  // Build query params properly
  const queryParams = new URLSearchParams();
  if (searchParams.get("branchId")) queryParams.append("branchId", searchParams.get("branchId")!);
  if (searchParams.get("page")) queryParams.append("page", searchParams.get("page")!);
  if (searchParams.get("limit")) queryParams.append("limit", searchParams.get("limit")!);
  if (searchParams.get("q")) queryParams.append("q", searchParams.get("q")!);
  if (searchParams.get("status")) queryParams.append("status", searchParams.get("status")!);

  // Always request populated data with item details (itemId is the reference field)
  queryParams.append("populate", "itemId");

  const queryString = queryParams.toString();
  const url = `${getRemoteBase()}/t/branch-inventory/items${queryString ? `?${queryString}` : ''}`;

  const res = await fetch(url, {
    method: "GET",
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

export async function POST(req: Request) {
  const payload = await req.json().catch(() => ({}));
  // Request populated data with item details when creating
  const url = `${getRemoteBase()}/t/branch-inventory/items?populate=itemId`;

  console.log("🔵 POST to backend:", url);
  console.log("🔵 Payload:", payload);

  const res = await fetch(url, {
    method: "POST",
    headers: buildTenantHeaders(req, true),
    body: JSON.stringify(payload)
  });

  const contentType = res.headers.get("content-type");
  if (contentType?.includes("application/json")) {
    const data = await res.json();
    console.log("🔵 Backend response:", JSON.stringify(data).substring(0, 500));
    return NextResponse.json(data, { status: res.status });
  }

  const text = await res.text();
  return new NextResponse(text, { status: res.status });
}
