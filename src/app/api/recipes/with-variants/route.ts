import { NextResponse } from "next/server";
import { buildTenantHeaders, getRemoteBase } from "@/app/api/_utils/proxy-helpers";

export async function POST(req: Request) {
  const payload = await req.json().catch(() => ({}));
  const url = `${getRemoteBase()}/t/recipes/with-variants`;

  const headers = buildTenantHeaders(req, true);

  const res = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(payload)
  });

  const contentType = res.headers.get("content-type");
  if (contentType?.includes("application/json")) {
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  }

  const text = await res.text();
  return new NextResponse(text, { status: res.status });
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const recipeId = searchParams.get("recipeId");

  if (!recipeId) {
    return NextResponse.json(
      { success: false, message: "Recipe ID is required" },
      { status: 400 }
    );
  }

  const url = `${getRemoteBase()}/t/recipes/${recipeId}/with-variants`;
  const headers = buildTenantHeaders(req, true);

  const res = await fetch(url, {
    method: "GET",
    headers
  });

  const contentType = res.headers.get("content-type");
  if (contentType?.includes("application/json")) {
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  }

  const text = await res.text();
  return new NextResponse(text, { status: res.status });
}
