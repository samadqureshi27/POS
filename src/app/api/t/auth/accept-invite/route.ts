import { NextResponse } from "next/server";
import { buildTenantHeaders, getRemoteBase } from "@/app/api/_utils/proxy-helpers";
import { AcceptInviteRequestSchema } from "@/lib/validations/api-schemas";
import { ZodError } from "zod";

/**
 * POST /api/t/auth/accept-invite
 * Accepts an invitation and sets the user's password
 * Remote endpoint: POST /t/auth/accept-invite
 * Expected payload: { token: string, password: string }
 */
export async function POST(req: Request) {
  try {
    // Parse and validate request body
    const body = await req.json().catch(() => ({}));

    let payload;
    try {
      payload = AcceptInviteRequestSchema.parse(body);
    } catch (error) {
      if (error instanceof ZodError) {
        return NextResponse.json(
          {
            success: false,
            error: 'Validation failed',
            errors: error.issues.map(err => ({
              field: err.path.join('.'),
              message: err.message,
            })),
          },
          { status: 400 }
        );
      }
      throw error;
    }

    // Build remote URL
    const url = `${getRemoteBase()}/t/auth/accept-invite`;

    // Prepare payload for backend (only token and password)
    const backendPayload = {
      token: payload.token,
      password: payload.password,
    };

    // Forward request to backend
    const res = await fetch(url, {
      method: "POST",
      headers: buildTenantHeaders(req, false, false),
      body: JSON.stringify(backendPayload),
    });

    const contentType = res.headers.get("content-type") || "application/json";
    const responseBody = contentType.includes("application/json")
      ? await res.json().catch(() => ({}))
      : await res.text();

    // Extract token if login is successful (some backends auto-login after accepting invite)
    let token: string | undefined;
    try {
      const obj = typeof responseBody === 'string' ? JSON.parse(responseBody) : responseBody;
      token = obj?.result?.token || obj?.token;
    } catch {
      // Non-JSON body or no token, ignore
    }

    const response = new NextResponse(
      typeof responseBody === "string" ? responseBody : JSON.stringify(responseBody),
      {
        status: res.status,
        headers: { "content-type": contentType },
      }
    );

    // Set httpOnly session cookie if token is returned (auto-login after invitation)
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
    return NextResponse.json(
      { 
        success: false, 
        message: err?.message || "Proxy POST /t/auth/accept-invite failed" 
      },
      { status: 500 }
    );
  }
}