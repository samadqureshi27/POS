import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const token = request.headers.get("Authorization");
    const tenantId = request.headers.get("x-tenant-id");

    // Get backend URL from environment
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000";

    // Forward to backend with-variants endpoint
    const response = await fetch(`${backendUrl}/t/recipes/with-variants`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token || "",
        "x-tenant-id": tenantId || "",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: data.message || "Failed to create recipe with variants" },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      data: data.result || data,
      message: "Recipe with variants created successfully",
    });
  } catch (error) {
    console.error("Error creating recipe with variants:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get("Authorization");
    const tenantId = request.headers.get("x-tenant-id");

    // Get recipe ID from URL if provided
    const { searchParams } = new URL(request.url);
    const recipeId = searchParams.get("recipeId");

    if (!recipeId) {
      return NextResponse.json(
        { success: false, message: "Recipe ID is required" },
        { status: 400 }
      );
    }

    // Get backend URL from environment
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000";

    // Forward to backend with-variants endpoint
    const response = await fetch(`${backendUrl}/t/recipes/${recipeId}/with-variants`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token || "",
        "x-tenant-id": tenantId || "",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: data.message || "Failed to fetch recipe with variants" },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      data: data.result || data,
    });
  } catch (error) {
    console.error("Error fetching recipe with variants:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
