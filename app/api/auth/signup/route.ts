import { NextResponse } from "next/server"
import { createUser } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { firstName, lastName, email, password } = body

    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 })
    }

    const name = `${firstName} ${lastName}`
    const result = await createUser({ name, email, password })

    if (!result.success) {
      return NextResponse.json({ success: false, message: result.error }, { status: 400 })
    }

    return NextResponse.json({ success: true, message: "User created successfully" }, { status: 201 })
  } catch (error) {
    console.error("Error in signup route:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}

