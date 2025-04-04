"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAppContext, type Task } from "@/context/app-context"
import { useAuth } from "@/context/auth-context"
import { useState, useEffect } from "react"
import { format, subMonths, startOfMonth, endOfMonth, isWithinInterval, subWeeks, startOfWeek, endOfWeek, subYears, startOfYear, endOfYear } from "date-fns"

export function MonthlySummary() {
  const [stats, setStats] = useState({ completed: 0, inProgress: 0, notStarted: 0 })
  const [viewType, setViewType] = useState("monthly")
  const [chartData, setChartData] = useState<Array<{ label: string, completed: number }>>([])
  const { state } = useAppContext()
  const { user } = useAuth()

  // Calculate stats directly from tasks
  useEffect(() => {
    if (!state?.tasks || !user?.id) return;
    
    // Ensure we only get tasks for the current user
    const userTasks = state.tasks.filter((task: Task) => task.user_id === user.id);
    
    const completedTasks = userTasks.filter((task: Task) => task.status === "completed").length;
    const inProgressTasks = userTasks.filter((task: Task) => task.status === "in-progress").length;
    const notStartedTasks = userTasks.filter((task: Task) => task.status === "not-started").length;
    
    setStats({
      completed: completedTasks,
      inProgress: inProgressTasks,
      notStarted: notStartedTasks
    });
    
    // Calculate chart data
    let data: Array<{ label: string, completed: number }> = [];
    const now = new Date();

    if (viewType === "weekly") {
      for (let i = 6; i >= 0; i--) {
        const weekStart = startOfWeek(subWeeks(now, i));
        const weekEnd = endOfWeek(subWeeks(now, i));
        const weekLabel = `Week ${format(weekStart, "d/M")}`;
        
        const completedCount = userTasks.filter((task: Task) => 
          task.status === "completed" && 
          isWithinInterval(new Date(task.date), { start: weekStart, end: weekEnd })
        ).length;
        
        data.push({ label: weekLabel, completed: completedCount });
      }
    } else if (viewType === "monthly") {
      for (let i = 5; i >= 0; i--) {
        const monthDate = subMonths(now, i);
        const monthStart = startOfMonth(monthDate);
        const monthEnd = endOfMonth(monthDate);
        const monthLabel = format(monthDate, "MMM");
        
        const completedCount = userTasks.filter((task: Task) => 
          task.status === "completed" && 
          isWithinInterval(new Date(task.date), { start: monthStart, end: monthEnd })
        ).length;
        
        data.push({ label: monthLabel, completed: completedCount });
      }
    } else if (viewType === "yearly") {
      for (let i = 4; i >= 0; i--) {
        const yearDate = subYears(now, i);
        const yearStart = startOfYear(yearDate);
        const yearEnd = endOfYear(yearDate);
        const yearLabel = format(yearDate, "yyyy");
        
        const completedCount = userTasks.filter((task: Task) => 
          task.status === "completed" && 
          isWithinInterval(new Date(task.date), { start: yearStart, end: yearEnd })
        ).length;
        
        data.push({ label: yearLabel, completed: completedCount });
      }
    }

    setChartData(data);
  }, [state?.tasks, user?.id, viewType]);

  // Calculate derived stats
  const totalTasks = stats.completed + stats.inProgress + stats.notStarted;
  const completionRate = totalTasks > 0 ? Math.round((stats.completed / totalTasks) * 100) : 0;
  const maxCompleted = Math.max(1, ...chartData.map(item => item.completed));
  const averageTasks = chartData.length > 0 
    ? Math.round(chartData.reduce((sum, item) => sum + item.completed, 0) / chartData.length) 
    : 0;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Task Completion</CardTitle>
          <Select value={viewType} onValueChange={setViewType}>
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
              {chartData.map((item, index) => (
                <div key={index} className="flex flex-col items-center flex-1">
                  <div
                    className="w-full bg-blue-500 rounded-t-md transition-all duration-500 ease-in-out hover:bg-blue-600"
                    style={{ height: `${(item.completed / maxCompleted) * 100}%` }}
                  ></div>
                  <span className="text-xs mt-2">{item.label}</span>
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
                  <p className="text-sm text-muted-foreground">
                    Average Tasks per {viewType === "weekly" ? "Week" : viewType === "monthly" ? "Month" : "Year"}
                  </p>
                  <p className="text-2xl font-bold">{averageTasks}</p>
                </div>
                <div className="border rounded-lg p-4">
                  <p className="text-sm text-muted-foreground">
                    Total Tasks ({viewType === "weekly" ? "7 Weeks" : viewType === "monthly" ? "6 Months" : "5 Years"})
                  </p>
                  <p className="text-2xl font-bold">{totalTasks}</p>
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
                  <p className="text-2xl font-bold">{completionRate}%</p>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full mt-2">
                  <div
                    className="h-full bg-green-500 rounded-full"
                    style={{ width: `${completionRate}%` }}
                  ></div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="border rounded-lg p-3">
                  <p className="text-xs text-muted-foreground">Completed</p>
                  <p className="text-xl font-bold text-green-600">{stats.completed}</p>
                </div>
                <div className="border rounded-lg p-3">
                  <p className="text-xs text-muted-foreground">In Progress</p>
                  <p className="text-xl font-bold text-blue-600">{stats.inProgress}</p>
                </div>
                <div className="border rounded-lg p-3">
                  <p className="text-xs text-muted-foreground">Not Started</p>
                  <p className="text-xl font-bold text-gray-600">{stats.notStarted}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
