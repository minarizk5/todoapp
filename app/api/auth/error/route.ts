import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const error = searchParams.get("error")

  let errorMessage = "An unknown error occurred"

  switch (error) {
    case "Configuration":
      errorMessage = "There is a problem with the server configuration."
      break
    case "AccessDenied":
      errorMessage = "You do not have access to this resource."
      break
    case "Verification":
      errorMessage = "The verification link may have been used or is invalid."
      break
    case "OAuthSignin":
    case "OAuthCallback":
    case "OAuthCreateAccount":
    case "EmailCreateAccount":
    case "Callback":
      errorMessage = "There was a problem with the authentication provider."
      break
    case "OAuthAccountNotLinked":
      errorMessage = "This email is already associated with another account."
      break
    case "EmailSignin":
      errorMessage = "The email could not be sent."
      break
    case "CredentialsSignin":
      errorMessage = "Invalid email or password."
      break
    default:
      errorMessage = "An unexpected authentication error occurred."
      break
  }

  return NextResponse.json({ error: errorMessage })
}

