import { NextResponse } from "next/server";
import { buildTenantHeaders, getRemoteBase } from "@/app/api/_utils/proxy-helpers";

/**
 * GET /api/recipes/with-variants/:id
 * Fetches a single recipe with its variants
 */
export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  const { id } = params;

  console.log(`🔍 GET /api/recipes/with-variants/${id}`, { id, params });

  if (!id) {
    return NextResponse.json(
      { success: false, message: "Recipe ID is required" },
      { status: 400 }
    );
  }

  const url = `${getRemoteBase()}/t/recipes/with-variants/${id}`;
  const headers = buildTenantHeaders(req, true);

  console.log(`📡 Proxying GET ${url}`);

  try {
    const res = await fetch(url, {
      method: "GET",
      headers,
    });

    const contentType = res.headers.get("content-type");
    if (contentType?.includes("application/json")) {
      const data = await res.json();
      return NextResponse.json(data, { status: res.status });
    }

    const text = await res.text();
    return new NextResponse(text, { status: res.status });
  } catch (error: any) {
    console.error("Error fetching recipe with variants:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch recipe" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/recipes/with-variants/:id
 * Updates a recipe with its variants
 */
export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  const { id } = params;

  console.log(`🔍 PUT /api/recipes/with-variants/${id}`, { id, params });

  if (!id) {
    return NextResponse.json(
      { success: false, message: "Recipe ID is required" },
      { status: 400 }
    );
  }

  const payload = await req.json().catch(() => ({}));
  const url = `${getRemoteBase()}/t/recipes/with-variants/${id}`;
  const headers = buildTenantHeaders(req, true);

  console.log(`📡 Proxying PUT ${url}`, {
    type: payload.type,
    hasVariations: payload.variations && payload.variations.length > 0,
    variationsCount: payload.variations?.length || 0
  });

  try {
    const res = await fetch(url, {
      method: "PUT",
      headers,
      body: JSON.stringify(payload),
    });

    const contentType = res.headers.get("content-type");
    if (contentType?.includes("application/json")) {
      const data = await res.json();
      return NextResponse.json(data, { status: res.status });
    }

    const text = await res.text();
    return new NextResponse(text, { status: res.status });
  } catch (error: any) {
    console.error("Error updating recipe with variants:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to update recipe" },
      { status: 500 }
    );
  }
}