import { NextRequest, NextResponse } from "next/server";
import { verifyCredentials } from "@/lib/auth-utils";

export async function POST(req: NextRequest) {
  try {
    // Parse request body
    const body = await req.json();
    const { email, password } = body;

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Verify credentials
    const result = await verifyCredentials(email, password);
    
    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: 401 }
      );
    }

    // Create session token
    const sessionId = crypto.randomUUID();
    
    // Create response
    const response = NextResponse.json({
      success: true,
      message: 'Login successful',
      user: result.user
    });
    
    // Set cookies in the response
    response.cookies.set({
      name: 'session',
      value: sessionId,
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      sameSite: 'lax',
    });
    
    response.cookies.set({
      name: 'user_id',
      value: result.user?.id || '',
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      sameSite: 'lax',
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred during login' },
      { status: 500 }
    );
  }
}
