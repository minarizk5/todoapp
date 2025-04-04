import { NextRequest, NextResponse } from "next/server";
import { createUser } from "@/lib/auth-utils";
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    // Parse request body
    const body = await req.json();
    const { name, email, password } = body;

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, message: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    // Create user
    const result = await createUser({ name, email, password });
    
    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: 400 }
      );
    }

    // Create session token
    const sessionId = crypto.randomUUID();
    
    // Create response
    const response = NextResponse.json({
      success: true,
      message: 'User created successfully',
      userId: result.userId
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
      value: result.userId || '',
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      sameSite: 'lax',
    });

    return response;
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred during signup' },
      { status: 500 }
    );
  }
}
