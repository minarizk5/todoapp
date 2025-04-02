"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useAppContext } from "@/context/app-context"
import { TaskForm } from "@/components/task-form"

export function AddTaskButton() {
  const [open, setOpen] = useState(false)
  const { dispatch } = useAppContext()

  const handleAddTask = (task: any) => {
    // Add task to global state
    dispatch({
      type: "ADD_TASK",
      payload: task,
    })

    // Close dialog
    setOpen(false)
  }

  return (
    <>
      <Button
        size="icon"
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg"
        onClick={() => setOpen(true)}
      >
        <Plus className="h-6 w-6" />
        <span className="sr-only">Add Task</span>
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Task</DialogTitle>
          </DialogHeader>

          <TaskForm onSubmit={handleAddTask} onCancel={() => setOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  )
}

