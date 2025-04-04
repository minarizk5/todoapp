'use server'

import { cookies } from 'next/headers'
import fs from 'fs'
import path from 'path'
import bcrypt from 'bcryptjs'
import { redirect } from 'next/navigation'

const usersFilePath = path.join(process.cwd(), 'data', 'users.json')

// Define user type
interface User {
  id: string
  name: string
  email: string
  password: string
  createdAt: string
}

// Get all users
function getUsers(): User[] {
  try {
    if (!fs.existsSync(usersFilePath)) {
      fs.writeFileSync(usersFilePath, '[]', 'utf8')
      return []
    }
    const data = fs.readFileSync(usersFilePath, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Error reading users file:', error)
    return []
  }
}

// Get user by email
function getUserByEmail(email: string): User | null {
  const users = getUsers()
  return users.find((user: User) => user.email === email) || null
}

// Generate a unique ID
function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15)
}

export async function loginAction(formData: FormData): Promise<{ error: string } | undefined> {
  'use server'
  
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  // Validate input
  if (!email || !password) {
    return { error: 'Email and password are required' }
  }

  // Get user by email
  const user = getUserByEmail(email)
  
  if (!user) {
    return { error: 'Invalid email or password' }
  }
  
  // Compare passwords
  const isPasswordValid = await bcrypt.compare(password, user.password)
  
  if (!isPasswordValid) {
    return { error: 'Invalid email or password' }
  }
  
  // Create a session token
  const token = generateId()
  
  // Set cookies
  const cookieStore = cookies()
  
  // Set auth token cookie
  cookieStore.set({
    name: 'auth_token',
    value: token,
    httpOnly: true,
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    sameSite: 'strict'
  })
  
  // Set user ID cookie
  cookieStore.set({
    name: 'user_id',
    value: user.id,
    httpOnly: true,
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    sameSite: 'strict'
  })
  
  // Redirect to dashboard
  redirect('/dashboard')
}
