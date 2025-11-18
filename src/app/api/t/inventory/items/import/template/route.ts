// src/app/api/t/inventory/items/import/template/route.ts

import { NextResponse } from "next/server";
import { buildTenantHeaders, getRemoteBase } from "@/app/api/_utils/proxy-helpers";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const sample = searchParams.get("sample") || "true";

    const url = `${getRemoteBase()}/t/inventory/items/import/template?sample=${sample}`;


    // Create AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    const res = await fetch(url, {
      method: "GET",
      headers: buildTenantHeaders(req, true),
      signal: controller.signal
    });

    clearTimeout(timeoutId);


    if (!res.ok) {
      console.error("❌ Template Error:", res.status, res.statusText);
      return NextResponse.json(
        { success: false, message: `Failed to download template: ${res.status} ${res.statusText}` },
        { status: res.status }
      );
    }

    // Handle CSV response
    const contentType = res.headers.get("content-type") || "text/csv";
    const body = await res.text();

    return new NextResponse(body, {
      status: res.status,
      headers: {
        "content-type": contentType,
        "content-disposition": res.headers.get("content-disposition") || "attachment; filename=inventory-template.csv"
      }
    });
  } catch (error: any) {
    console.error("❌ Template Proxy Error:", error);
    
    if (error.name === 'AbortError') {
      return NextResponse.json(
        { success: false, message: "Request timeout - please try again" },
        { status: 504 }
      );
    }

    return NextResponse.json(
      { success: false, message: error?.message || "Failed to download template" },
      { status: 500 }
    );
  }
}