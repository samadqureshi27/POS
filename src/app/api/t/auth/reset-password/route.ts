import { NextResponse } from "next/server";
import { buildTenantHeaders, getRemoteBase } from "@/app/api/_utils/proxy-helpers";

// Proxy for tenant reset password endpoint
// Remote: POST /t/auth/reset-password { token, password }
export async function POST(req: Request) {
  try {
    const payload = await req.json().catch(() => ({}));
    const url = `${getRemoteBase()}/t/auth/reset-password`;

    const res = await fetch(url, {
      method: "POST",
      headers: buildTenantHeaders(req, false),
      body: JSON.stringify(payload),
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
    console.error("❌ Proxy Error (reset-password):", err);
    return NextResponse.json(
      { success: false, message: err?.message || "Proxy POST /t/auth/reset-password failed" },
      { status: 500 }
    );
  }
}