// src/app/api/t/addons/groups/route.ts

import { NextResponse } from "next/server";
import { buildTenantHeaders, getRemoteBase, proxyFetch } from "@/app/api/_utils/proxy-helpers";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const categoryId = searchParams.get("categoryId") || "";

  let url = `${getRemoteBase()}/t/addons/groups`;
  if (categoryId) url += `?categoryId=${encodeURIComponent(categoryId)}`;

  const res = await proxyFetch(url, {
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
  const url = `${getRemoteBase()}/t/addons/groups`;

  const res = await proxyFetch(url, {
    method: "POST",
    headers: buildTenantHeaders(req, true),
    body: JSON.stringify(payload),
    logBody: payload
  });

  const contentType = res.headers.get("content-type");
  if (contentType?.includes("application/json")) {
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  }

  const text = await res.text();
  return new NextResponse(text, { status: res.status });
}
