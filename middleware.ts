import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Define which routes are protected
const protectedRoutes = ['/dashboard', '/tasks', '/profile', '/test-dashboard']
const authRoutes = ['/login', '/signup']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  console.log('Middleware running for path:', pathname);
  
  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
  const isAuthRoute = authRoutes.some(route => pathname === route)
  
  // Get cookies directly
  const sessionId = request.cookies.get('session')?.value
  const userId = request.cookies.get('user_id')?.value
  
  console.log('Session ID:', sessionId);
  console.log('User ID:', userId);
  
  // Check if user is authenticated
  const isAuthenticated = !!sessionId && !!userId
  
  console.log('Is authenticated:', isAuthenticated);
  
  // If trying to access protected route while not authenticated, redirect to login
  if (isProtectedRoute && !isAuthenticated) {
    console.log('Redirecting to login');
    const url = new URL('/login', request.url)
    return NextResponse.redirect(url)
  }
  
  // If trying to access login/signup while already authenticated, redirect to dashboard
  if (isAuthRoute && isAuthenticated) {
    console.log('Redirecting to dashboard');
    const url = new URL('/dashboard', request.url)
    return NextResponse.redirect(url)
  }
  
  // Otherwise, continue with the request
  console.log('Continuing with request');
  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/tasks/:path*", "/profile/:path*", "/test-dashboard/:path*", "/login", "/signup"]
}
