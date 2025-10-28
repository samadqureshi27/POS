import { NextResponse } from "next/server";
import { buildTenantHeaders, getRemoteBase } from "@/app/api/_utils/proxy-helpers";

export async function POST(req: Request) {
  try {
    const payload = await req.json().catch(() => ({}));
    const url = `${getRemoteBase()}/t/auth/login`;

    console.log('🔄 Proxy: /t/auth/login', {
      url,
      headers: buildTenantHeaders(req),
      body: { ...payload, password: '***' }
    });

    const res = await fetch(url, {
      method: "POST",
      headers: buildTenantHeaders(req),
      body: JSON.stringify(payload)
    });

    const contentType = res.headers.get("content-type") || "application/json";
    const body = contentType.includes("application/json")
      ? await res.json().catch(() => ({}))
      : await res.text();

    console.log('📡 Proxy Response:', { status: res.status, ok: res.ok });

    // Attempt to set httpOnly session cookie when login succeeds
    let token: string | undefined;
    try {
      const obj = typeof body === 'string' ? JSON.parse(body) : body;
      token = obj?.result?.token || obj?.token;
    } catch {
      // Non-JSON body, ignore
    }

    const response = new NextResponse(
      typeof body === "string" ? body : JSON.stringify(body),
      {
        status: res.status,
        headers: { "content-type": contentType },
      }
    );

    if (res.ok && token) {
      const isProd = process.env.NODE_ENV === 'production';
      response.cookies.set('accessToken', token, {
        httpOnly: true,
        secure: isProd,
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60, // 1 hour default
      });
    }

    return response;
  } catch (err: any) {
    console.error('❌ Proxy Error:', err);
    return NextResponse.json(
      { success: false, message: err?.message || "Proxy POST /t/auth/login failed" },
      { status: 500 }
    );
  }
}