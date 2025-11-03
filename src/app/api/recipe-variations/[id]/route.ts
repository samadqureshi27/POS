// app/api/recipe-variations/[id]/route.ts
// Proxy for individual Recipe Variant operations

import { NextRequest, NextResponse } from "next/server";
import { buildTenantHeaders, getRemoteBase } from "../../_utils/proxy-helpers";

const REMOTE_BASE = getRemoteBase();

/**
 * GET /api/recipe-variations/:id
 * Get a single recipe variant by ID
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const url = `${REMOTE_BASE}/t/recipe-variations/${id}`;

    console.log("🔍 [Recipe Variant API] GET request:", url);

    const response = await fetch(url, {
      method: "GET",
      headers: buildTenantHeaders(req, true),
    });

    const data = await response.json();
    console.log("📦 [Recipe Variant API] Response:", data);

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: data.message || "Failed to fetch recipe variant" },
        { status: response.status }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    console.error("❌ [Recipe Variant API] GET error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/recipe-variations/:id
 * Update an existing recipe variant
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await req.json();
    const url = `${REMOTE_BASE}/t/recipe-variations/${id}`;

    console.log("📤 [Recipe Variant API] PUT request:", url);
    console.log("📦 [Recipe Variant API] Body:", body);

    const response = await fetch(url, {
      method: "PUT",
      headers: buildTenantHeaders(req, true),
      body: JSON.stringify(body),
    });

    const data = await response.json();
    console.log("📦 [Recipe Variant API] Response:", data);

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: data.message || "Failed to update recipe variant" },
        { status: response.status }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    console.error("❌ [Recipe Variant API] PUT error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/recipe-variations/:id
 * Delete a recipe variant
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const url = `${REMOTE_BASE}/t/recipe-variations/${id}`;

    console.log("🗑️ [Recipe Variant API] DELETE request:", url);

    const response = await fetch(url, {
      method: "DELETE",
      headers: buildTenantHeaders(req, true),
    });

    const data = await response.json();
    console.log("📦 [Recipe Variant API] Response:", data);

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: data.message || "Failed to delete recipe variant" },
        { status: response.status }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    console.error("❌ [Recipe Variant API] DELETE error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
