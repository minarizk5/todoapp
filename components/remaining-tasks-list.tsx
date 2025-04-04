"use client"
import { useState, useEffect } from "react"
import { TaskItem } from "@/components/task-item"
import { useAppContext, type Task } from "@/context/app-context"
import { useAuth } from "@/context/auth-context"

export function RemainingTasksList() {
  const [tasks, setTasks] = useState<Task[]>([])
  const { user } = useAuth()

  // Use context to access tasks
  const context = useAppContext()
  const contextState = context?.state || { tasks: [] }
  const contextDispatch = context?.dispatch || (() => {})

  // Update tasks when context is available - filter by user ID and not completed
  useEffect(() => {
    if (user && user.id) {
      // Only show non-completed tasks for the current user
      const userTasks = contextState.tasks.filter(
        task => task.user_id === user.id && task.status !== "completed"
      )
      setTasks(userTasks || [])
    } else {
      setTasks([])
    }
  }, [contextState.tasks, user])

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
    <div className="space-y-4">
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
        <p className="text-center text-muted-foreground py-4">No remaining tasks.</p>
      )}
    </div>
  )
}
