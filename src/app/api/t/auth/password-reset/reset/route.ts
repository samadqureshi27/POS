import { NextRequest, NextResponse } from 'next/server';

const REMOTE_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE || 'https://api.tritechtechnologyllc.com';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    const remoteUrl = `${REMOTE_BASE}/t/auth/password-reset/reset`;

    const response = await fetch(remoteUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    const contentType = response.headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
      const data = await response.json();
      return NextResponse.json(data, { status: response.status });
    } else {
      const text = await response.text();
      return new NextResponse(text, { status: response.status });
    }
  } catch (error: any) {
    console.error('Reset password proxy error:', error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to reset password'
      },
      { status: 500 }
    );
  }
}
