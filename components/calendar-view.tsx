"use client"

import { useState, useEffect } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { format, isSameDay } from "date-fns"
import { useAppContext, type Task } from "@/context/app-context"
import { Star, CheckCircle, Clock } from "lucide-react"

export function CalendarView() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())

  // Use a try-catch to safely access the context
  const { state } = useAppContext()
  const contextTasks: Task[] = state?.tasks || []

  // Update tasks when context is available
  useEffect(() => {
    setTasks(contextTasks || [])
  }, [contextTasks])

  // Find tasks for the selected date
  const selectedDateTasks = selectedDate ? tasks.filter((task) => isSameDay(new Date(task.date), selectedDate)) : []

  // Function to customize day cell rendering
  const renderDay = (day: Date | undefined) => {
    // Check if day is a valid Date object
    if (!day || !(day instanceof Date) || isNaN(day.getTime())) {
      return null
    }

    const dateHasTasks = tasks.some((task) => isSameDay(new Date(task.date), day))
    const tasksForDay = tasks.filter((task) => isSameDay(new Date(task.date), day))
    const hasImportantTask = tasksForDay.some((task) => task.important)

    return (
      <div className="relative flex h-8 w-8 items-center justify-center">
        {day.getDate()}
        {dateHasTasks && (
          <span
            className={`absolute bottom-1 h-1 w-1 rounded-full ${hasImportantTask ? "bg-yellow-500" : "bg-primary"}`}
          ></span>
        )}
      </div>
    )
  }

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
            components={{
              DayContent: ({ day }) => renderDay(day),
            }}
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
              {selectedDateTasks.map((task) => (
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

