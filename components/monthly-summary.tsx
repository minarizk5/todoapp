"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAppContext } from "@/context/app-context"
import { useState, useEffect } from "react"

export function MonthlySummary() {
  const [stats, setStats] = useState({ completed: 0, inProgress: 0, notStarted: 0 })
  const [viewType, setViewType] = useState("monthly")
  const { state } = useAppContext() // Moved useAppContext call outside try-catch

  // Initialize contextStats with default values
  let contextStats = { completed: 0, inProgress: 0, notStarted: 0 }

  // Update contextStats based on context, but don't rely on try-catch
  if (state && state.stats) {
    contextStats = state.stats
  } else {
    console.log("Context not available yet")
  }

  // Update stats when context is available
  useEffect(() => {
    setStats(contextStats)
  }, [contextStats])

  // Generate monthly data based on tasks
  const generateMonthlyData = () => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ]
    const currentMonth = new Date().getMonth()

    // For demo purposes, we'll show the last 6 months
    const relevantMonths = months.slice(Math.max(0, currentMonth - 5), currentMonth + 1)

    return relevantMonths.map((month, index) => {
      // In a real app, you would filter tasks by month and calculate these values
      return {
        month,
        completed: Math.max(5, stats.completed + index),
      }
    })
  }

  const monthlyData = generateMonthlyData()

  // Find the maximum value for scaling
  const maxCompleted = Math.max(...monthlyData.map((item) => item.completed))

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Task Completion</CardTitle>
          <Select defaultValue="monthly" onValueChange={setViewType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="View" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <div className="flex items-end h-[250px] w-full gap-2">
              {monthlyData.map((item, index) => (
                <div key={index} className="flex flex-col items-center flex-1">
                  <div
                    className="w-full bg-blue-500 rounded-t-md transition-all duration-500 ease-in-out hover:bg-blue-600"
                    style={{ height: `${(item.completed / maxCompleted) * 100}%` }}
                  ></div>
                  <span className="text-xs mt-2">{item.month}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-4">
              <span className="text-xs text-muted-foreground">0</span>
              <span className="text-xs text-muted-foreground">{maxCompleted}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <p className="text-sm text-muted-foreground">Average Tasks per Month</p>
                  <p className="text-2xl font-bold">
                    {(monthlyData.reduce((acc, item) => acc + item.completed, 0) / monthlyData.length).toFixed(1)}
                  </p>
                </div>
                <div className="border rounded-lg p-4">
                  <p className="text-sm text-muted-foreground">Total Tasks (YTD)</p>
                  <p className="text-2xl font-bold">{monthlyData.reduce((acc, item) => acc + item.completed, 0)}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Efficiency</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <p className="text-sm text-muted-foreground">Completion Rate</p>
                <div className="flex items-center space-x-2">
                  <p className="text-2xl font-bold">
                    {stats.completed > 0
                      ? Math.round((stats.completed / (stats.completed + stats.inProgress + stats.notStarted)) * 100)
                      : 0}
                    %
                  </p>
                  <span className="text-xs text-green-600">↑ 3%</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full mt-2">
                  <div
                    className="h-full bg-green-500 rounded-full"
                    style={{
                      width: `${
                        stats.completed > 0
                          ? Math.round(
                              (stats.completed / (stats.completed + stats.inProgress + stats.notStarted)) * 100,
                            )
                          : 0
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

