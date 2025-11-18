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


  const res = await fetch(url, {
    method: "GET",
    headers
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
  const url = `${getRemoteBase()}/t/menu/items`;

  const headers = buildTenantHeaders(req, true);


  const res = await fetch(url, {
    method: "POST",
    headers,
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
