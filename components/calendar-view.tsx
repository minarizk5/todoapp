"use client"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { format, isSameDay, isToday } from "date-fns"
import { useAppContext, type Task } from "@/context/app-context"
import { Star, CheckCircle, Clock } from "lucide-react"
import { useAuth } from "@/context/auth-context"

export function CalendarView() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const { user } = useAuth()
  const { state } = useAppContext()

  // Get tasks directly from context (filtered by user)
  const tasks = user?.id ? (state?.tasks || []).filter((task: Task) => task.user_id === user.id) : []

  // Find tasks for the selected date
  const selectedDateTasks = selectedDate 
    ? tasks.filter((task: Task) => isSameDay(new Date(task.date), selectedDate)) 
    : []

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "in-progress":
        return <Clock className="h-4 w-4 text-blue-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-400" />
    }
  }

  // Custom CSS for calendar days
  const getDayClass = (date: Date) => {
    if (!date) return ""
    
    const dateHasTasks = tasks.some((task: Task) => isSameDay(new Date(task.date), date))
    const hasImportantTask = tasks.some((task: Task) => 
      isSameDay(new Date(task.date), date) && task.important
    )
    
    let className = "relative"
    
    if (dateHasTasks) {
      className += hasImportantTask 
        ? " after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-1.5 after:h-1.5 after:bg-yellow-500 after:rounded-full" 
        : " after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-1.5 after:h-1.5 after:bg-primary after:rounded-full"
    }
    
    if (isToday(date)) {
      className += " font-bold"
    }
    
    return className
  }

  // Custom day renderer to handle type issues
  const customDayClassNames = {
    day_today: "bg-primary/10 font-bold",
    day_selected: "bg-primary text-primary-foreground",
    day: (date: Date) => getDayClass(date)
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Calendar</CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded-md border"
            classNames={customDayClassNames as any}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{selectedDate ? format(selectedDate, "MMMM d, yyyy") : "No date selected"}</CardTitle>
        </CardHeader>
        <CardContent>
          {selectedDateTasks.length > 0 ? (
            <div className="space-y-4">
              {selectedDateTasks.map((task: Task) => (
                <div key={task.id} className="flex justify-between items-center p-3 border rounded-md">
                  <div className="flex items-center">
                    {task.important && <Star className="h-4 w-4 text-yellow-500 mr-2" fill="currentColor" />}
                    <span className="font-medium">{task.title}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(task.status)}
                    <Badge
                      variant="outline"
                      className={
                        task.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : task.status === "in-progress"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                      }
                    >
                      {task.status === "in-progress"
                        ? "In Progress"
                        : task.status === "not-started"
                          ? "Not Started"
                          : "Completed"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No tasks scheduled for this date.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
