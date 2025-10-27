import { NextResponse } from "next/server";
import { buildTenantHeaders, getRemoteBase } from "@/app/api/_utils/proxy-helpers";

// Proxy for tenant forgot password endpoint
// Remote: POST /t/auth/forgotPassword { email }
export async function POST(req: Request) {
  try {
    const payload = await req.json().catch(() => ({}));
    const url = `${getRemoteBase()}/t/auth/forgot-password`;

    console.log("🔄 Proxy: /t/auth/forgot-password", {
      url,
      headers: buildTenantHeaders(req, false),
      body: payload,
    });

    const res = await fetch(url, {
      method: "POST",
      headers: buildTenantHeaders(req, false),
      body: JSON.stringify(payload),
    });

    const contentType = res.headers.get("content-type") || "application/json";
    const body = contentType.includes("application/json")
      ? await res.json().catch(() => ({}))
      : await res.text();

    console.log("📡 Proxy Response (forgot-password):", { status: res.status, ok: res.ok });

    return new NextResponse(
      typeof body === "string" ? body : JSON.stringify(body),
      {
        status: res.status,
        headers: { "content-type": contentType },
      }
    );
  } catch (err: any) {
    console.error("❌ Proxy Error (forgot-password):", err);
    return NextResponse.json(
      { success: false, message: err?.message || "Proxy POST /t/auth/forgot-password failed" },
      { status: 500 }
    );
  }
}