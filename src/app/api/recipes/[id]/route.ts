// src/app/api/recipes/[id]/route.ts

import { NextResponse } from "next/server";
import { buildTenantHeaders, getRemoteBase } from "@/app/api/_utils/proxy-helpers";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { searchParams } = new URL(req.url);

  // Check if requesting with variants
  const withVariants = searchParams.get("withVariants") || searchParams.get("includeVariants");
  const activeOnly = searchParams.get("activeOnly") || "true";
  const page = searchParams.get("page") || "1";
  const limit = searchParams.get("limit") || "50";

  let url = `${getRemoteBase()}/t/recipes/${params.id}`;

  // Use the /with-variants endpoint if variants are requested
  if (withVariants === "true" || withVariants === "1") {
    url = `${getRemoteBase()}/t/recipes/${params.id}/with-variants?activeOnly=${activeOnly}&page=${page}&limit=${limit}`;
  }


  const res = await fetch(url, {
    method: "GET",
    headers: buildTenantHeaders(req, true)
  });


  const contentType = res.headers.get("content-type");
  if (contentType?.includes("application/json")) {
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  }

  const text = await res.text();
  return new NextResponse(text, { status: res.status });
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const payload = await req.json().catch(() => ({}));
  const url = `${getRemoteBase()}/t/recipes/${params.id}`;

  const res = await fetch(url, {
    method: "PUT",
    headers: buildTenantHeaders(req, true),
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

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const url = `${getRemoteBase()}/t/recipes/${params.id}`;

  const res = await fetch(url, {
    method: "DELETE",
    headers: buildTenantHeaders(req, true)
  });

  const contentType = res.headers.get("content-type");
  if (contentType?.includes("application/json")) {
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  }

  const text = await res.text();
  return new NextResponse(text, { status: res.status });
}
