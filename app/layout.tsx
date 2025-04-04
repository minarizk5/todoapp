import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import AppNavbar from "@/components/app-navbar"
import { AppProvider } from "@/context/app-context"
import { AuthProvider } from "@/context/auth-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Task Master | Todo List Application",
  description: "A modern todo list application for managing your tasks",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <AppProvider>
            <AppNavbar />
            {children}
          </AppProvider>
        </AuthProvider>
      </body>
    </html>
  )
}