// src/app/api/menu/categories/[id]/route.ts

import { NextResponse } from "next/server";
import { buildTenantHeaders, getRemoteBase } from "@/app/api/_utils/proxy-helpers";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const url = `${getRemoteBase()}/t/menu/categories/${params.id}`;

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
  const url = `${getRemoteBase()}/t/menu/categories/${params.id}`;

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
  const url = `${getRemoteBase()}/t/menu/categories/${params.id}`;

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
