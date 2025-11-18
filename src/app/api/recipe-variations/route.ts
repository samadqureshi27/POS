// app/api/recipe-variations/route.ts
// Proxy for Recipe variations API

import { NextRequest, NextResponse } from "next/server";
import { buildTenantHeaders, getRemoteBase } from "../_utils/proxy-helpers";

const REMOTE_BASE = getRemoteBase();

/**
 * GET /api/recipe-variations
 * List all recipe variations with optional filtering
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const queryString = searchParams.toString();
    const url = `${REMOTE_BASE}/t/recipe-variations${queryString ? `?${queryString}` : ""}`;


    const response = await fetch(url, {
      method: "GET",
      headers: buildTenantHeaders(req, true),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: data.message || "Failed to fetch recipe variations" },
        { status: response.status }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    console.error("❌ [Recipe variations API] GET error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/recipe-variations
 * Create a new recipe variant
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const url = `${REMOTE_BASE}/t/recipe-variations`;


    const response = await fetch(url, {
      method: "POST",
      headers: buildTenantHeaders(req, true),
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: data.message || "Failed to create recipe variant" },
        { status: response.status }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    console.error("❌ [Recipe variations API] POST error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
