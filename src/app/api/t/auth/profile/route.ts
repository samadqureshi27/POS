import { NextResponse } from "next/server";

const REMOTE_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE || "https://api.tritechtechnologyllc.com";

function pickTenant(req: Request): { slug?: string; id?: string } {
  const fromHeaderSlug = req.headers.get("x-tenant-slug") || undefined;
  const fromHeaderId = req.headers.get("x-tenant-id") || undefined;
  const envSlug = process.env.NEXT_PUBLIC_TENANT_SLUG || undefined;
  const envId = process.env.NEXT_PUBLIC_TENANT_ID || undefined;
  return { slug: fromHeaderSlug || envSlug, id: fromHeaderId || envId };
}

function buildHeaders(req: Request) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "Accept": "application/json",
  };
  const auth = req.headers.get("authorization");
  if (auth) headers["Authorization"] = auth;
  const { slug, id } = pickTenant(req);
  if (slug) headers["x-tenant-slug"] = slug;
  else if (id) headers["x-tenant-id"] = id;
  return headers;
}

export async function GET(req: Request) {
  try {
    const url = `${REMOTE_BASE}/t/auth/profile`;
    const res = await fetch(url, { headers: buildHeaders(req) });
    const contentType = res.headers.get("content-type") || "application/json";
    const body = contentType.includes("application/json") ? await res.json().catch(() => ({})) : await res.text();
    return new NextResponse(typeof body === "string" ? body : JSON.stringify(body), {
      status: res.status,
      headers: { "content-type": contentType },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err?.message || "Proxy GET /t/auth/profile failed" }, { status: 500 });
  }
}