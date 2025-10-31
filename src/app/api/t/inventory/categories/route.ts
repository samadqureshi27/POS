// src/app/api/t/inventory/categories/route.ts

import { NextResponse } from "next/server";
import { buildTenantHeaders, getRemoteBase } from "@/app/api/_utils/proxy-helpers";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";
  const page = searchParams.get("page") || "1";
  const limit = searchParams.get("limit") || "100";
  const isActive = searchParams.get("isActive") || "";
  const sort = searchParams.get("sort") || "";
  const order = searchParams.get("order") || "";

  let url = `${getRemoteBase()}/t/inventory/categories?q=${encodeURIComponent(q)}&page=${page}&limit=${limit}`;
  if (isActive) url += `&isActive=${isActive}`;
  if (sort) url += `&sort=${sort}`;
  if (order) url += `&order=${order}`;

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
  const url = `${getRemoteBase()}/t/inventory/categories`;

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
