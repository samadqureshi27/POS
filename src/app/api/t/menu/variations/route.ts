// app/api/t/menu/variations/route.ts
// Proxy for Menu Variations API - Links menu items to recipe variants

import { NextRequest, NextResponse } from "next/server";
import { buildTenantHeaders, getRemoteBase } from "@/app/api/_utils/proxy-helpers";

const REMOTE_BASE = getRemoteBase();

/**
 * GET /api/t/menu/variations
 * List all menu variations with optional filtering by menuItemId
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const queryString = searchParams.toString();
    const url = `${REMOTE_BASE}/t/menu/variations${queryString ? `?${queryString}` : ""}`;

    const response = await fetch(url, {
      method: "GET",
      headers: buildTenantHeaders(req, true),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: data.message || "Failed to fetch menu variations" },
        { status: response.status }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    console.error("❌ [Menu variations API] GET error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/t/menu/variations
 * Create a new menu variation
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const url = `${REMOTE_BASE}/t/menu/variations`;

    const response = await fetch(url, {
      method: "POST",
      headers: buildTenantHeaders(req, true),
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: data.message || "Failed to create menu variation" },
        { status: response.status }
      );
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error("❌ [Menu variations API] POST error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
