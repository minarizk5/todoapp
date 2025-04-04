import bcrypt from 'bcryptjs';
import { NextRequest } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

// Helper function to generate a unique ID
function generateId() {
  return uuidv4();
}

// Define the User type
export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
};

// Client-side authentication functions
// These functions don't use fs and are safe to import in client components

// Check if user is authenticated (for middleware)
export function isUserAuthenticated(request: NextRequest) {
  const authToken = request.cookies.get('auth_token')?.value;
  const userId = request.cookies.get('user_id')?.value;
  
  console.log('Auth check - token:', authToken);
  console.log('Auth check - userId:', userId);
  
  if (!authToken || !userId) {
    console.log('Auth check failed: Missing token or userId');
    return false;
  }
  
  // We only check if the cookies exist, actual validation happens in API routes
  console.log('Auth check passed: User is authenticated');
  return true;
}
