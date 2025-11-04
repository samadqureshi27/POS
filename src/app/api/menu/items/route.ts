// src/app/api/menu/items/route.ts

import { NextResponse } from "next/server";
import { buildTenantHeaders, getRemoteBase } from "@/app/api/_utils/proxy-helpers";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  // Build query params
  const queryParams = new URLSearchParams();
  if (searchParams.get("q")) queryParams.append("q", searchParams.get("q")!);
  if (searchParams.get("categoryId")) queryParams.append("categoryId", searchParams.get("categoryId")!);
  if (searchParams.get("isActive")) queryParams.append("isActive", searchParams.get("isActive")!);
  if (searchParams.get("page")) queryParams.append("page", searchParams.get("page")!);
  if (searchParams.get("limit")) queryParams.append("limit", searchParams.get("limit")!);
  if (searchParams.get("sort")) queryParams.append("sort", searchParams.get("sort")!);
  if (searchParams.get("order")) queryParams.append("order", searchParams.get("order")!);

  const queryString = queryParams.toString();
  const url = `${getRemoteBase()}/t/menu/items${queryString ? `?${queryString}` : ''}`;

  const headers = buildTenantHeaders(req, true);

  console.log("🌐 GET /api/menu/items - Proxying to:", url);
  console.log("📋 Headers:", headers);

  const res = await fetch(url, {
    method: "GET",
    headers
  });

  console.log("✅ Response status:", res.status);

  const contentType = res.headers.get("content-type");
  if (contentType?.includes("application/json")) {
    const data = await res.json();
    console.log("📦 Response data count:", Array.isArray(data) ? data.length : data.data?.length || "unknown");
    return NextResponse.json(data, { status: res.status });
  }

  const text = await res.text();
  return new NextResponse(text, { status: res.status });
}

export async function POST(req: Request) {
  const payload = await req.json().catch(() => ({}));
  const url = `${getRemoteBase()}/t/menu/items`;

  const headers = buildTenantHeaders(req, true);

  console.log("🌐 POST /api/menu/items - Creating menu item");
  console.log("📋 Headers:", headers);
  console.log("📤 Payload:", JSON.stringify(payload, null, 2));

  const res = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(payload)
  });

  console.log("✅ Response status:", res.status);

  const contentType = res.headers.get("content-type");
  if (contentType?.includes("application/json")) {
    const data = await res.json();
    console.log("📦 Response data:", data);
    return NextResponse.json(data, { status: res.status });
  }

  const text = await res.text();
  console.log("📄 Response text:", text);
  return new NextResponse(text, { status: res.status });
}
