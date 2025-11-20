import { NextResponse } from "next/server";
import { buildTenantHeaders, getRemoteBase } from "@/app/api/_utils/proxy-helpers";

// GET - Get effective branch menu (merged menu)
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    // Build query params
    const queryParams = new URLSearchParams();
    if (searchParams.get("branchId")) queryParams.append("branchId", searchParams.get("branchId")!);
    if (searchParams.get("page")) queryParams.append("page", searchParams.get("page")!);
    if (searchParams.get("limit")) queryParams.append("limit", searchParams.get("limit")!);

    const queryString = queryParams.toString();
    const url = `${getRemoteBase()}/t/branch-menu/effective${queryString ? `?${queryString}` : ''}`;

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
    console.error('❌ Proxy Error:', err);
    return NextResponse.json(
      { success: false, message: err?.message || "Proxy GET /t/branch-menu/effective failed" },
      { status: 500 }
    );
  }
}
