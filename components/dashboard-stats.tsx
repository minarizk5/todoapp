"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Calendar, Star } from "lucide-react"
import { useAppContext } from "@/context/app-context"
import { useAuth } from "@/context/auth-context"
import { useState, useEffect } from "react"

export function DashboardStats() {
  const { state } = useAppContext()
  const { user } = useAuth()
  const [stats, setStats] = useState({ completed: 0, inProgress: 0, notStarted: 0 })
  const [importantCount, setImportantCount] = useState(0)

  // Update stats when context is available
  useEffect(() => {
    if (state) {
      setStats(state.stats)
      
      // Count important tasks for the current user
      if (user && user.id && state.tasks) {
        const userImportantTasks = state.tasks.filter(
          task => task.user_id === user.id && task.important
        );
        setImportantCount(userImportantTasks.length);
      }
    }
  }, [state, user])

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

      {/* Remaining Tasks card removed as requested */}
      {/* 
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
      */}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Important Tasks</CardTitle>
          <Star className="h-4 w-4 text-yellow-500" fill="currentColor" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{importantCount}</div>
          <p className="text-xs text-muted-foreground">
            {importantCount > 0 ? `${importantCount} high priority tasks` : "No important tasks"}
          </p>
        </CardContent>
      </Card>
    </>
  )
}
