// src/app/api/menu/items/route.ts

import { NextResponse } from "next/server";
import { buildTenantHeaders, getRemoteBase } from "@/app/api/_utils/proxy-helpers";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    // Build query params
    const queryParams = new URLSearchParams();
    if (searchParams.get("q")) queryParams.append("q", searchParams.get("q")!);
    if (searchParams.get("categoryId")) queryParams.append("categoryId", searchParams.get("categoryId")!);
    if (searchParams.get("isActive")) queryParams.append("isActive", searchParams.get("isActive")!);
    if (searchParams.get("page")) queryParams.append("page", searchParams.get("page")!);
    // Set default limit to 100 if not provided
    queryParams.append("limit", searchParams.get("limit") || "100");
    if (searchParams.get("sort")) queryParams.append("sort", searchParams.get("sort")!);
    if (searchParams.get("order")) queryParams.append("order", searchParams.get("order")!);

    const queryString = queryParams.toString();
    const url = `${getRemoteBase()}/t/menu/items${queryString ? `?${queryString}` : ''}`;

    let headers;
    try {
      headers = buildTenantHeaders(req, true);
    } catch (headerError: any) {
      return NextResponse.json(
        {
          success: false,
          message: headerError.message || "Failed to build request headers",
          items: []
        },
        { status: 401 }
      );
    }

    const res = await fetch(url, {
      method: "GET",
      headers,
      cache: "no-store", // Prevent caching issues
    });

    const contentType = res.headers.get("content-type");
    if (contentType?.includes("application/json")) {
      const data = await res.json();
      return NextResponse.json(data, {
        status: res.status,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        }
      });
    }

    const text = await res.text();
    return new NextResponse(text, {
      status: res.status,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      }
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to fetch menu items",
        items: []
      },
      { status: 500 }
    );
  }
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
