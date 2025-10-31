// src/app/api/inventory/items/export.csv/route.ts

import { NextResponse } from "next/server";
import { buildTenantHeaders, getRemoteBase } from "@/app/api/_utils/proxy-helpers";

export async function GET(req: Request) {
  try {
    const url = `${getRemoteBase()}/api/inventory/items/export.csv`;

    console.log("🔄 Proxy: Items export", { url });

    // Create AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 45000); // 45 second timeout

    const res = await fetch(url, {
      method: "GET",
      headers: buildTenantHeaders(req, true),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    console.log("📡 Export Response:", { status: res.status, ok: res.ok });

    if (!res.ok) {
      console.error("❌ Export Error:", res.status, res.statusText);
      return NextResponse.json(
        { success: false, message: `Failed to export items: ${res.status} ${res.statusText}` },
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
        "content-disposition": res.headers.get("content-disposition") || "attachment; filename=inventory-export.csv"
      }
    });
  } catch (error: any) {
    console.error("❌ Export Proxy Error:", error);
    
    if (error.name === 'AbortError') {
      return NextResponse.json(
        { success: false, message: "Export timeout - please try again" },
        { status: 504 }
      );
    }

    return NextResponse.json(
      { success: false, message: error?.message || "Failed to export items" },
      { status: 500 }
    );
  }
}