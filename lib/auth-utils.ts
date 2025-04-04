import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

// File paths
const DATA_DIR = path.join(process.cwd(), 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Ensure users file exists
if (!fs.existsSync(USERS_FILE)) {
  fs.writeFileSync(USERS_FILE, JSON.stringify([], null, 2), 'utf8');
}

// User type definition
export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: string;
}

// Generate a unique ID
export function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}

// Get all users
export function getUsers(): User[] {
  try {
    const data = fs.readFileSync(USERS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading users file:', error);
    return [];
  }
}

// Save users to file
export function saveUsers(users: User[]): boolean {
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error writing users file:', error);
    return false;
  }
}

// Find user by email
export function findUserByEmail(email: string): User | null {
  const users = getUsers();
  return users.find(user => user.email === email) || null;
}

// Find user by ID
export function findUserById(id: string): User | null {
  const users = getUsers();
  return users.find(user => user.id === id) || null;
}

// Create a new user
export async function createUser(userData: { 
  name: string; 
  email: string; 
  password: string;
}): Promise<{ success: boolean; message: string; userId?: string }> {
  try {
    const { name, email, password } = userData;
    
    // Check if user already exists
    if (findUserByEmail(email)) {
      return { success: false, message: 'User with this email already exists' };
    }
    
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create new user object
    const newUser: User = {
      id: generateId(),
      name,
      email,
      password: hashedPassword,
      createdAt: new Date().toISOString()
    };
    
    // Get current users and add the new one
    const users = getUsers();
    users.push(newUser);
    
    // Save updated users list
    if (saveUsers(users)) {
      return { 
        success: true, 
        message: 'User created successfully',
        userId: newUser.id
      };
    } else {
      return { success: false, message: 'Failed to save user data' };
    }
  } catch (error) {
    console.error('Error creating user:', error);
    return { success: false, message: 'An error occurred while creating user' };
  }
}

// Verify user credentials
export async function verifyCredentials(email: string, password: string): Promise<{
  success: boolean;
  message: string;
  user?: Omit<User, 'password'>;
}> {
  try {
    // Find user by email
    const user = findUserByEmail(email);
    
    if (!user) {
      return { success: false, message: 'Invalid email or password' };
    }
    
    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return { success: false, message: 'Invalid email or password' };
    }
    
    // Return user data without password
    const { password: _, ...userWithoutPassword } = user;
    
    return {
      success: true,
      message: 'Login successful',
      user: userWithoutPassword
    };
  } catch (error) {
    console.error('Error verifying credentials:', error);
    return { success: false, message: 'An error occurred during login' };
  }
}
