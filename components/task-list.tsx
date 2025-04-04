"use client"
import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TaskItem } from "@/components/task-item"
import { useAppContext, type Task } from "@/context/app-context"
import { useAuth } from "@/context/auth-context"

export default function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([])
  const { user } = useAuth()

  // Use a try-catch to safely access the context
  const context = useAppContext()
  const contextState = context?.state || { tasks: [] }
  const contextDispatch = context?.dispatch || (() => {})

  // Update tasks when context is available
  useEffect(() => {
    if (contextState.tasks) {
      // The API already filters tasks by user, so we can use all tasks from context
      setTasks(contextState.tasks);
    } else {
      setTasks([]);
    }
  }, [contextState.tasks])

  const updateTaskStatus = (id: number, status: string) => {
    const task = tasks.find((t) => t.id === id)
    if (task) {
      contextDispatch({
        type: "UPDATE_TASK",
        payload: { ...task, status: status as "not-started" | "in-progress" | "completed" },
      })
    }
  }

  const markAsImportant = (id: number) => {
    contextDispatch({
      type: "TOGGLE_IMPORTANT",
      payload: id,
    })
  }

  const deleteTask = (id: number) => {
    contextDispatch({
      type: "DELETE_TASK",
      payload: id,
    })
  }

  return (
    <Tabs defaultValue="all" className="w-full">
      <TabsList className="grid grid-cols-4 mb-6">
        <TabsTrigger value="all">All</TabsTrigger>
        <TabsTrigger value="today">Today</TabsTrigger>
        <TabsTrigger value="important">Important</TabsTrigger>
        <TabsTrigger value="remaining">Remaining</TabsTrigger>
      </TabsList>

      <TabsContent value="all" className="space-y-4">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onStatusChange={(status) => updateTaskStatus(task.id, status)}
              onToggleImportant={() => markAsImportant(task.id)}
              onDelete={() => deleteTask(task.id)}
            />
          ))
        ) : (
          <p className="text-center text-muted-foreground py-4">No tasks yet. Add your first task!</p>
        )}
      </TabsContent>

      <TabsContent value="today" className="space-y-4">
        {tasks
          .filter((task) => {
            const today = new Date()
            const taskDate = new Date(task.date)
            return taskDate.toDateString() === today.toDateString()
          })
          .map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onStatusChange={(status) => updateTaskStatus(task.id, status)}
              onToggleImportant={() => markAsImportant(task.id)}
              onDelete={() => deleteTask(task.id)}
            />
          ))}
      </TabsContent>

      <TabsContent value="important" className="space-y-4">
        {tasks
          .filter((task) => task.important)
          .map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onStatusChange={(status) => updateTaskStatus(task.id, status)}
              onToggleImportant={() => markAsImportant(task.id)}
              onDelete={() => deleteTask(task.id)}
            />
          ))}
      </TabsContent>

      <TabsContent value="remaining" className="space-y-4">
        {tasks
          .filter((task) => task.status !== "completed")
          .map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onStatusChange={(status) => updateTaskStatus(task.id, status)}
              onToggleImportant={() => markAsImportant(task.id)}
              onDelete={() => deleteTask(task.id)}
            />
          ))}
      </TabsContent>
    </Tabs>
  )
}
