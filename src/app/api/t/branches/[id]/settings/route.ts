import { NextResponse } from "next/server";
import { buildTenantHeaders, getRemoteBase } from "@/app/api/_utils/proxy-helpers";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const url = `${getRemoteBase()}/t/branches/${params.id}/settings`;

    console.log('🔄 Proxy: GET /t/branches/:id/settings', { url });

    const res = await fetch(url, {
      method: "GET",
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
      { success: false, message: err?.message || "Proxy GET /t/branches/:id/settings failed" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const payload = await req.json().catch(() => ({}));
    const url = `${getRemoteBase()}/t/branches/${params.id}/settings`;

    console.log('🔄 Proxy: PUT /t/branches/:id/settings', {
      url,
      body: payload
    });

    const res = await fetch(url, {
      method: "PUT",
      headers: buildTenantHeaders(req, true),
      body: JSON.stringify(payload)
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
      { success: false, message: err?.message || "Proxy PUT /t/branches/:id/settings failed" },
      { status: 500 }
    );
  }
}
