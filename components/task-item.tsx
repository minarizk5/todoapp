"use client"
import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Star, CheckCircle, Clock, Edit, ChevronDown, ChevronUp, LinkIcon, Paperclip } from "lucide-react"
import { type Task, useAppContext } from "@/context/app-context"
import { TaskForm } from "@/components/task-form"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import ReactMarkdown from "react-markdown"

type TaskItemProps = {
  task: Task
  onStatusChange: (status: string) => void
  onToggleImportant: () => void
  onDelete: () => void
}

export function TaskItem({ task, onStatusChange, onToggleImportant, onDelete }: TaskItemProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const { dispatch } = useAppContext()

  const statusColors = {
    completed: "bg-green-100 text-green-800",
    "in-progress": "bg-blue-100 text-blue-800",
    "not-started": "bg-gray-100 text-gray-800",
  }

  const statusIcons = {
    completed: <CheckCircle className="h-4 w-4" />,
    "in-progress": <Clock className="h-4 w-4" />,
    "not-started": <Clock className="h-4 w-4 text-gray-400" />,
  }

  const handleEditTask = (updatedTask: Omit<Task, "id">) => {
    dispatch({
      type: "UPDATE_TASK",
      payload: { ...updatedTask, id: task.id },
    })
    setIsOpen(false)
  }

  const hasDetails = !!(
    task.notes ||
    (task.links && task.links.length > 0) ||
    (task.attachments && task.attachments.length > 0)
  )

  return (
    <>
      <Card className="transform transition-all hover:scale-[1.01] hover:shadow-lg">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={onToggleImportant}
                className={task.important ? "text-yellow-500" : "text-gray-300"}
              >
                <Star className="h-5 w-5" fill={task.important ? "currentColor" : "none"} />
                <span className="sr-only">Toggle important</span>
              </Button>

              <div>
                <h3 className="font-medium">{task.title}</h3>
                <p className="text-sm text-muted-foreground">{new Date(task.date).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Badge
                variant="outline"
                className={`flex items-center gap-1 ${statusColors[task.status as keyof typeof statusColors]}`}
              >
                {statusIcons[task.status as keyof typeof statusIcons]}
                {task.status === "in-progress"
                  ? "In Progress"
                  : task.status === "not-started"
                    ? "Not Started"
                    : "Completed"}
              </Badge>

              <Select value={task.status} onValueChange={onStatusChange}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="not-started">Not Started</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="ghost" size="icon" onClick={() => setIsOpen(true)}>
                <Edit className="h-4 w-4" />
                <span className="sr-only">Edit task</span>
              </Button>
            </div>
          </div>

          {hasDetails && (
            <Collapsible open={isExpanded} onOpenChange={setIsExpanded} className="mt-4">
              <div className="flex justify-between items-center">
                <div className="flex space-x-2">
                  {task.notes && <Badge variant="outline">Notes</Badge>}
                  {task.links && task.links.length > 0 && (
                    <Badge variant="outline" className="flex items-center gap-1">
                      <LinkIcon className="h-3 w-3" />
                      {task.links.length}
                    </Badge>
                  )}
                  {task.attachments && task.attachments.length > 0 && (
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Paperclip className="h-3 w-3" />
                      {task.attachments.length}
                    </Badge>
                  )}
                </div>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm" className="p-0 h-7 w-7">
                    {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    <span className="sr-only">Toggle details</span>
                  </Button>
                </CollapsibleTrigger>
              </div>

              <CollapsibleContent className="mt-2 space-y-3">
                {task.notes && (
                  <div className="prose prose-sm max-w-none border rounded-md p-3 bg-gray-50">
                    <ReactMarkdown>{task.notes}</ReactMarkdown>
                  </div>
                )}

                {task.links && task.links.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Links</h4>
                    <div className="space-y-1">
                      {task.links.map((link) => (
                        <div key={link.id} className="flex items-center">
                          <LinkIcon className="h-3 w-3 mr-2 text-blue-500" />
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-500 hover:underline"
                          >
                            {link.title}
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {task.attachments && task.attachments.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Attachments</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {task.attachments.map((attachment) => (
                        <div key={attachment.id} className="border rounded-md p-2">
                          {attachment.type === "image" ? (
                            <div className="space-y-1">
                              <div className="aspect-video bg-gray-100 rounded-md overflow-hidden">
                                <img
                                  src={attachment.url || "/placeholder.svg"}
                                  alt={attachment.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <p className="text-xs truncate">{attachment.name}</p>
                            </div>
                          ) : (
                            <div className="flex items-center">
                              <Paperclip className="h-4 w-4 mr-2" />
                              <span className="text-sm truncate">{attachment.name}</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CollapsibleContent>
            </Collapsible>
          )}
        </CardContent>
      </Card>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>

          <TaskForm
            initialData={task}
            onSubmit={handleEditTask}
            onCancel={() => setIsOpen(false)}
            submitLabel="Save Changes"
            onDelete={onDelete}
          />
        </DialogContent>
      </Dialog>
    </>
  )
}
