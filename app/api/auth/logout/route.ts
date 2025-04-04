import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // Create response
    const response = NextResponse.json({
      success: true,
      message: 'Logged out successfully'
    });
    
    // Clear cookies
    response.cookies.set({
      name: 'session',
      value: '',
      path: '/',
      maxAge: 0,
    });
    
    response.cookies.set({
      name: 'user_id',
      value: '',
      path: '/',
      maxAge: 0,
    });
    
    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred during logout' },
      { status: 500 }
    );
  }
}
