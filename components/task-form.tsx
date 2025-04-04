"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DatePicker } from "@/components/date-picker"
import { MarkdownEditor } from "@/components/markdown-editor"
import { PlusCircle, X, LinkIcon, Paperclip, Image } from "lucide-react"
import type { Task, TaskLink, TaskAttachment } from "@/context/app-context"
import { v4 as uuidv4 } from "uuid"

interface TaskFormProps {
  onSubmit: (task: Omit<Task, "id">) => void
  onCancel: () => void
  initialData?: Task
  submitLabel?: string
  onDelete?: () => void
}

export function TaskForm({ onSubmit, onCancel, initialData, submitLabel = "Add Task", onDelete }: TaskFormProps) {
  const [taskTitle, setTaskTitle] = useState(initialData?.title || "")
  const [date, setDate] = useState<Date | undefined>(initialData?.date || new Date())
  const [notes, setNotes] = useState(initialData?.notes || "")
  const [links, setLinks] = useState<TaskLink[]>(initialData?.links || [])
  const [attachments, setAttachments] = useState<TaskAttachment[]>(initialData?.attachments || [])
  const [newLinkTitle, setNewLinkTitle] = useState("")
  const [newLinkUrl, setNewLinkUrl] = useState("")
  const [showLinkForm, setShowLinkForm] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!taskTitle.trim()) return

    // Capitalize first letter
    const capitalizedTitle = taskTitle.charAt(0).toUpperCase() + taskTitle.slice(1)

    // Get user ID from localStorage if available
    const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') || '' : '';
    
    console.log("Submitting task with user ID:", userId);

    // Create the task object
    const taskData = {
      title: capitalizedTitle,
      date: date || new Date(),
      status: initialData?.status || "not-started",
      important: initialData?.important || false,
      notes: notes || undefined,
      links: links.length > 0 ? links : undefined,
      attachments: attachments.length > 0 ? attachments : undefined,
      user_id: initialData?.user_id || userId,
    };

    // Pass the task to the onSubmit handler
    // The AppContext will handle the API call
    onSubmit(taskData);
  }

  const addLink = () => {
    if (newLinkTitle.trim() && newLinkUrl.trim()) {
      setLinks([...links, { id: uuidv4(), title: newLinkTitle, url: newLinkUrl }])
      setNewLinkTitle("")
      setNewLinkUrl("")
      setShowLinkForm(false)
    }
  }

  const removeLink = (id: string) => {
    setLinks(links.filter((link) => link.id !== id))
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: "image" | "file") => {
    const files = e.target.files
    if (!files || files.length === 0) return

    // In a real app, you would upload these files to a server
    // For this demo, we'll create object URLs
    Array.from(files).forEach((file) => {
      const url = URL.createObjectURL(file)
      setAttachments([
        ...attachments,
        {
          id: uuidv4(),
          type,
          name: file.name,
          url,
        },
      ])
    })

    // Reset the input
    e.target.value = ""
  }

  const removeAttachment = (id: string) => {
    const attachment = attachments.find((a) => a.id === id)
    if (attachment) {
      // Revoke the object URL to prevent memory leaks
      URL.revokeObjectURL(attachment.url)
    }
    setAttachments(attachments.filter((a) => a.id !== id))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="task-title">Task Title</Label>
        <Input
          id="task-title"
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
          placeholder="Enter your task"
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Due Date</Label>
        <DatePicker date={date} setDate={setDate} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="task-notes">Notes</Label>
        <MarkdownEditor value={notes} onChange={setNotes} placeholder="Add notes, details, or instructions..." />
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label>Links</Label>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setShowLinkForm(!showLinkForm)}
            className="h-8 px-2"
          >
            <PlusCircle className="h-4 w-4 mr-1" />
            Add Link
          </Button>
        </div>

        {showLinkForm && (
          <div className="flex flex-col space-y-2 p-3 border rounded-md">
            <Input placeholder="Link Title" value={newLinkTitle} onChange={(e) => setNewLinkTitle(e.target.value)} />
            <Input placeholder="URL (https://...)" value={newLinkUrl} onChange={(e) => setNewLinkUrl(e.target.value)} />
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setShowLinkForm(false)}>
                Cancel
              </Button>
              <Button type="button" size="sm" onClick={addLink}>
                Add
              </Button>
            </div>
          </div>
        )}

        {links.length > 0 && (
          <div className="space-y-2 mt-2">
            {links.map((link) => (
              <div key={link.id} className="flex items-center justify-between p-2 border rounded-md">
                <div className="flex items-center">
                  <LinkIcon className="h-4 w-4 mr-2 text-blue-500" />
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    {link.title}
                  </a>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeLink(link.id)}
                  className="h-6 w-6 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label>Attachments</Label>
        <div className="flex flex-wrap gap-2">
          <div className="relative">
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileUpload(e, "image")}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            <Button type="button" variant="outline" className="flex items-center">
              <Image className="h-4 w-4 mr-2" />
              Add Image
            </Button>
          </div>

          <div className="relative">
            <Input
              type="file"
              onChange={(e) => handleFileUpload(e, "file")}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            <Button type="button" variant="outline" className="flex items-center">
              <Paperclip className="h-4 w-4 mr-2" />
              Add File
            </Button>
          </div>
        </div>

        {attachments.length > 0 && (
          <div className="grid grid-cols-2 gap-2 mt-2">
            {attachments.map((attachment) => (
              <div key={attachment.id} className="flex items-center justify-between p-2 border rounded-md">
                <div className="flex items-center overflow-hidden">
                  {attachment.type === "image" ? (
                    <Image className="h-4 w-4 mr-2 flex-shrink-0" />
                  ) : (
                    <Paperclip className="h-4 w-4 mr-2 flex-shrink-0" />
                  )}
                  <span className="truncate text-sm">{attachment.name}</span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeAttachment(attachment.id)}
                  className="h-6 w-6 p-0 flex-shrink-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-end space-x-2 pt-2">
        {initialData && onDelete && (
          <Button 
            type="button" 
            variant="destructive" 
            onClick={onDelete}
            className="mr-auto"
          >
            Delete Task
          </Button>
        )}
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">{submitLabel}</Button>
      </div>
    </form>
  )
}
