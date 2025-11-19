import { NextResponse } from "next/server";
import { z } from "zod";
import { PinLoginRequestSchema } from "@/lib/validations/api-schemas";

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
  const { slug, id } = pickTenant(req);
  if (slug) headers["x-tenant-slug"] = slug;
  else if (id) headers["x-tenant-id"] = id;
  return headers;
}

export async function POST(req: Request) {
  try {
    const payload = await req.json().catch(() => ({}));

    // Validate request body using Zod schema
    const validationResult = PinLoginRequestSchema.safeParse(payload);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid request data',
          details: validationResult.error.format(),
        },
        { status: 400 }
      );
    }

    const validatedPayload = validationResult.data;

    const url = `${REMOTE_BASE}/t/auth/pin-login`;
    const res = await fetch(url, {
      method: "POST",
      headers: buildHeaders(req),
      body: JSON.stringify(validatedPayload)
    });

    const contentType = res.headers.get("content-type") || "application/json";
    const body = contentType.includes("application/json")
      ? await res.json().catch(() => ({}))
      : await res.text();

    return new NextResponse(typeof body === "string" ? body : JSON.stringify(body), {
      status: res.status,
      headers: { "content-type": contentType },
    });
  } catch (err: any) {
    console.error("PIN login error:", err);
    return NextResponse.json(
      { success: false, message: err?.message || "Proxy POST /t/auth/pin-login failed" },
      { status: 500 }
    );
  }
}