// src/app/api/t/inventory/items/import/route.ts

import { NextResponse } from "next/server";
import { buildTenantHeaders, getRemoteBase } from "@/app/api/_utils/proxy-helpers";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const url = `${getRemoteBase()}/t/inventory/items/import`;


    // Build headers without Content-Type to let fetch set it for FormData
    const headers = buildTenantHeaders(req, true);
    delete headers["Content-Type"];

    // Create AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout for file upload

    const res = await fetch(url, {
      method: "POST",
      headers,
      body: formData,
      signal: controller.signal
    });

    clearTimeout(timeoutId);


    const contentType = res.headers.get("content-type");
    if (contentType?.includes("application/json")) {
      const data = await res.json();
      return NextResponse.json(data, { status: res.status });
    }

    const text = await res.text();
    return new NextResponse(text, { status: res.status });
  } catch (error: any) {
    console.error("❌ Import Proxy Error:", error);
    
    if (error.name === 'AbortError') {
      return NextResponse.json(
        { success: false, message: "Import timeout - please try again with a smaller file" },
        { status: 504 }
      );
    }

    return NextResponse.json(
      { success: false, message: error?.message || "Failed to import items" },
      { status: 500 }
    );
  }
}