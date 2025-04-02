import { supabase } from "./supabase"
import bcrypt from "bcryptjs"

export async function createUser(userData: {
  name: string
  email: string
  password: string
}) {
  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(userData.password, 10)

    // Check if user already exists
    const { data: existingUser, error: queryError } = await supabase
      .from("users")
      .select("*")
      .eq("email", userData.email)
      .single()

    if (queryError && !queryError.message.includes("No rows found")) {
      console.error("Error checking existing user:", queryError)
      return { success: false, error: "Database error" }
    }

    if (existingUser) {
      return { success: false, error: "User already exists" }
    }

    // Create new user
    const { data, error } = await supabase
      .from("users")
      .insert([
        {
          name: userData.name,
          email: userData.email,
          password: hashedPassword,
          provider: "credentials",
        },
      ])
      .select()

    if (error) {
      console.error("Error creating user:", error)
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error: any) {
    console.error("Error in createUser:", error)
    return { success: false, error: error.message || "Failed to create user" }
  }
}

export async function getUserByEmail(email: string) {
  try {
    const { data, error } = await supabase.from("users").select("*").eq("email", email).single()

    if (error) {
      if (error.message.includes("No rows found")) {
        return null
      }
      console.error("Error getting user by email:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Error in getUserByEmail:", error)
    return null
  }
}

