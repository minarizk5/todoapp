import { NextRequest, NextResponse } from "next/server";
import { findUserById } from "@/lib/auth-utils";

export async function GET(req: NextRequest) {
  try {
    // Get user ID from cookie
    const userId = req.cookies.get('user_id')?.value;
    const sessionId = req.cookies.get('session')?.value;
    
    // If no session or user ID, user is not authenticated
    if (!userId || !sessionId) {
      return NextResponse.json({
        success: false,
        message: 'Not authenticated'
      });
    }
    
    // Find user by ID
    const user = findUserById(userId);
    
    if (!user) {
      return NextResponse.json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Return user data without password
    const { password, ...userWithoutPassword } = user;
    
    return NextResponse.json({
      success: true,
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Error checking authentication:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred' },
      { status: 500 }
    );
  }
}
