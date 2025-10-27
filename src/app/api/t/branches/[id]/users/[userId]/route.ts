import { NextResponse } from "next/server";
import { buildTenantHeaders, getRemoteBase } from "@/app/api/_utils/proxy-helpers";

export async function POST(req: Request, { params }: { params: { id: string; userId: string } }) {
  try {
    const url = `${getRemoteBase()}/t/branches/${params.id}/users/${params.userId}`;

    console.log('🔄 Proxy: POST /t/branches/:id/users/:userId', { url });

    const res = await fetch(url, {
      method: "POST",
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
      { success: false, message: err?.message || "Proxy POST /t/branches/:id/users/:userId failed" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string; userId: string } }) {
  try {
    const url = `${getRemoteBase()}/t/branches/${params.id}/users/${params.userId}`;

    console.log('🔄 Proxy: DELETE /t/branches/:id/users/:userId', { url });

    const res = await fetch(url, {
      method: "DELETE",
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
      { success: false, message: err?.message || "Proxy DELETE /t/branches/:id/users/:userId failed" },
      { status: 500 }
    );
  }
}
