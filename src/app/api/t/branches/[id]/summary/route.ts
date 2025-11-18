import { NextResponse } from "next/server";
import { buildTenantHeaders, getRemoteBase } from "@/app/api/_utils/proxy-helpers";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const url = `${getRemoteBase()}/t/branches/${params.id}/summary`;


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
      { success: false, message: err?.message || "Proxy GET /t/branches/:id/summary failed" },
      { status: 500 }
    );
  }
}
