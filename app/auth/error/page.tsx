"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"

export default function AuthErrorPage() {
  const searchParams = useSearchParams()
  const [errorMessage, setErrorMessage] = useState<string>("An authentication error occurred")

  useEffect(() => {
    const error = searchParams.get("error")
    if (error) {
      switch (error) {
        case "CredentialsSignin":
          setErrorMessage("Invalid email or password.")
          break
        case "OAuthSignin":
        case "OAuthCallback":
          setErrorMessage("There was a problem with the authentication provider.")
          break
        case "OAuthAccountNotLinked":
          setErrorMessage("This email is already associated with another account.")
          break
        default:
          setErrorMessage("An unexpected authentication error occurred.")
          break
      }
    }
  }, [searchParams])

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md">
        <Card className="w-full shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              Authentication Error
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{errorMessage}</p>
            <p className="text-sm text-muted-foreground mt-2">
              Please try again or contact support if the problem persists.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link href="/">Return to Login</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </main>
  )
}

