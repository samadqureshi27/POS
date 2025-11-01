// src/app/api/t/inventory/items/route.ts

import { NextResponse } from "next/server";
import { buildTenantHeaders, getRemoteBase } from "@/app/api/_utils/proxy-helpers";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  // Build query params properly
  const queryParams = new URLSearchParams();
  if (searchParams.get("q")) queryParams.append("q", searchParams.get("q")!);
  if (searchParams.get("page")) queryParams.append("page", searchParams.get("page")!);
  if (searchParams.get("limit")) queryParams.append("limit", searchParams.get("limit")!);
  if (searchParams.get("type")) queryParams.append("type", searchParams.get("type")!);
  if (searchParams.get("categoryId")) queryParams.append("categoryId", searchParams.get("categoryId")!);
  if (searchParams.get("sort")) queryParams.append("sort", searchParams.get("sort")!);
  if (searchParams.get("order")) queryParams.append("order", searchParams.get("order")!);

  const queryString = queryParams.toString();
  const url = `${getRemoteBase()}/t/inventory/items${queryString ? `?${queryString}` : ''}`;

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
  const url = `${getRemoteBase()}/t/inventory/items`;

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
