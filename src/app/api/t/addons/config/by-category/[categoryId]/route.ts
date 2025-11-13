// src/app/api/t/addons/config/by-category/[categoryId]/route.ts

import { NextResponse } from "next/server";
import { buildTenantHeaders, getRemoteBase } from "@/app/api/_utils/proxy-helpers";

export async function GET(req: Request, { params }: { params: { categoryId: string } }) {
  const { categoryId } = params;
  const url = `${getRemoteBase()}/t/addons/config/by-category/${categoryId}`;

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
