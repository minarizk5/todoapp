"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Calendar } from "lucide-react"
import { useAppContext } from "@/context/app-context"
import { useState, useEffect } from "react"

export function DashboardStats() {
  const { state } = useAppContext()
  const [stats, setStats] = useState({ completed: 0, inProgress: 0, notStarted: 0 })

  // Use a try-catch to safely access the context
  // let contextStats = { completed: 0, inProgress: 0, notStarted: 0 }
  // try {
  //   const { state } = useAppContext()
  //   contextStats = state.stats
  // } catch (e) {
  //   // Context not available yet (during SSR)
  //   console.log("Context not available yet")
  // }

  // Update stats when context is available
  useEffect(() => {
    if (state) {
      setStats(state.stats)
    }
  }, [state])

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Tasks Completed</CardTitle>
          <CheckCircle className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.completed}</div>
          <p className="text-xs text-muted-foreground">
            {stats.completed > 0
              ? `${Math.round((stats.completed / (stats.completed + stats.inProgress + stats.notStarted)) * 100)}% completion rate`
              : "No tasks completed yet"}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Remaining Tasks</CardTitle>
          <Calendar className="h-4 w-4 text-orange-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.inProgress + stats.notStarted}</div>
          <p className="text-xs text-muted-foreground">
            {stats.inProgress > 0 ? `${stats.inProgress} in progress` : "No tasks in progress"}
          </p>
        </CardContent>
      </Card>
    </>
  )
}

