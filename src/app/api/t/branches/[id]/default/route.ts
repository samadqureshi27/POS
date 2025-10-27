import { NextResponse } from "next/server";
import { buildTenantHeaders, getRemoteBase } from "@/app/api/_utils/proxy-helpers";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const url = `${getRemoteBase()}/t/branches/${params.id}/default`;

    console.log('🔄 Proxy: PUT /t/branches/:id/default', { url });

    const res = await fetch(url, {
      method: "PUT",
      headers: buildTenantHeaders(req, true)
    });

    const contentType = res.headers.get("content-type") || "application/json";
    const body = contentType.includes("application/json")
      ? await res.json().catch(() => ({}))
      : await res.text();

    console.log('📡 Proxy Response:', { status: res.status, ok: res.ok });

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
      { success: false, message: err?.message || "Proxy PUT /t/branches/:id/default failed" },
      { status: 500 }
    );
  }
}
