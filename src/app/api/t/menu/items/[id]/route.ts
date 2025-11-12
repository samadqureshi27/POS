import { NextResponse } from "next/server";
import { buildTenantHeaders, getRemoteBase } from "@/app/api/_utils/proxy-helpers";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const { searchParams } = new URL(req.url);
    const includeRecipeVariants = searchParams.get("includeRecipeVariants") || "";
    const includeCategoryAddOns = searchParams.get("includeCategoryAddOns") || "";

    let url = `${getRemoteBase()}/t/menu/items/${params.id}`;
    const queryParams = [];
    if (includeRecipeVariants) queryParams.push(`includeRecipeVariants=${encodeURIComponent(includeRecipeVariants)}`);
    if (includeCategoryAddOns) queryParams.push(`includeCategoryAddOns=${encodeURIComponent(includeCategoryAddOns)}`);
    if (queryParams.length > 0) url += `?${queryParams.join("&")}`;

    const res = await fetch(url, {
      method: "GET",
      headers: buildTenantHeaders(req, true)
    });

    const contentType = res.headers.get("content-type") || "application/json";
    const body = contentType.includes("application/json")
      ? await res.json().catch(() => ({}))
      : await res.text();

    return new NextResponse(
      typeof body === "string" ? body : JSON.stringify(body),
      {
        status: res.status,
        headers: { "content-type": contentType },
      }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err?.message || "Proxy GET /t/menu/items/:id failed" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const payload = await req.json().catch(() => ({}));
    const url = `${getRemoteBase()}/t/menu/items/${params.id}`;

    const res = await fetch(url, {
      method: "PUT",
      headers: buildTenantHeaders(req, true),
      body: JSON.stringify(payload)
    });

    const contentType = res.headers.get("content-type") || "application/json";
    const body = contentType.includes("application/json")
      ? await res.json().catch(() => ({}))
      : await res.text();

    return new NextResponse(
      typeof body === "string" ? body : JSON.stringify(body),
      {
        status: res.status,
        headers: { "content-type": contentType },
      }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err?.message || "Proxy PUT /t/menu/items/:id failed" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const url = `${getRemoteBase()}/t/menu/items/${params.id}`;

    const res = await fetch(url, {
      method: "DELETE",
      headers: buildTenantHeaders(req, true)
    });

    const contentType = res.headers.get("content-type") || "application/json";
    const body = contentType.includes("application/json")
      ? await res.json().catch(() => ({}))
      : await res.text();

    return new NextResponse(
      typeof body === "string" ? body : JSON.stringify(body),
      {
        status: res.status,
        headers: { "content-type": contentType },
      }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err?.message || "Proxy DELETE /t/menu/items/:id failed" },
      { status: 500 }
    );
  }
}
