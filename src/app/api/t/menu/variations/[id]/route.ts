// app/api/t/menu/variations/[id]/route.ts
// Proxy for single Menu Variation operations

import { NextRequest, NextResponse } from "next/server";
import { buildTenantHeaders, getRemoteBase } from "@/app/api/_utils/proxy-helpers";

const REMOTE_BASE = getRemoteBase();

/**
 * GET /api/t/menu/variations/[id]
 * Get a single menu variation by ID
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const url = `${REMOTE_BASE}/t/menu/variations/${params.id}`;

    const response = await fetch(url, {
      method: "GET",
      headers: buildTenantHeaders(req, true),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: data.message || "Failed to fetch menu variation" },
        { status: response.status }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    console.error("❌ [Menu variation API] GET error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/t/menu/variations/[id]
 * Update a menu variation
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const url = `${REMOTE_BASE}/t/menu/variations/${params.id}`;

    const response = await fetch(url, {
      method: "PUT",
      headers: buildTenantHeaders(req, true),
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: data.message || "Failed to update menu variation" },
        { status: response.status }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    console.error("❌ [Menu variation API] PUT error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/t/menu/variations/[id]
 * Delete a menu variation
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const url = `${REMOTE_BASE}/t/menu/variations/${params.id}`;

    const response = await fetch(url, {
      method: "DELETE",
      headers: buildTenantHeaders(req, true),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: data.message || "Failed to delete menu variation" },
        { status: response.status }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    console.error("❌ [Menu variation API] DELETE error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
