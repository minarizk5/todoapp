"use client"

import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, Calendar, BarChart2, User, LogOut } from "lucide-react"
import { useAppContext } from "@/context/app-context"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function AppNavbar() {
  const pathname = usePathname()
  const router = useRouter()
  const { state, dispatch } = useAppContext()

  // Don't show navbar on login or signup pages
  if (pathname === "/" || pathname === "/signup") return null

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" })
    router.push("/")
  }

  return (
    <header className="border-b bg-white">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/dashboard" className="font-bold text-xl">
          Task Master
        </Link>

        <nav className="flex items-center space-x-1">
          <Button asChild variant={pathname === "/dashboard" ? "default" : "ghost"} size="sm">
            <Link href="/dashboard" className="flex items-center">
              <Home className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </Link>
          </Button>

          <Button asChild variant={pathname === "/dashboard/calendar" ? "default" : "ghost"} size="sm">
            <Link href="/dashboard/calendar" className="flex items-center">
              <Calendar className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Calendar</span>
            </Link>
          </Button>

          <Button asChild variant={pathname === "/dashboard/summary" ? "default" : "ghost"} size="sm">
            <Link href="/dashboard/summary" className="flex items-center">
              <BarChart2 className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Summary</span>
            </Link>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <User className="h-4 w-4" />
                <span className="sr-only">User profile</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{state.user ? state.user.name : "Account"}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-red-500 cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
      </div>
    </header>
  )
}

