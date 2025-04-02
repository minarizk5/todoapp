"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import ReactMarkdown from "react-markdown"

interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function MarkdownEditor({ value, onChange, placeholder = "Write your notes here..." }: MarkdownEditorProps) {
  const [tab, setTab] = useState<string>("write")
  const [preview, setPreview] = useState<string>("")

  useEffect(() => {
    setPreview(value)
  }, [value, tab])

  return (
    <div className="w-full">
      <Tabs defaultValue="write" value={tab} onValueChange={setTab} className="w-full">
        <TabsList className="grid grid-cols-2">
          <TabsTrigger value="write">Write</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>
        <TabsContent value="write" className="mt-2">
          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="min-h-[150px] font-mono text-sm"
          />
          <div className="mt-2 text-xs text-muted-foreground">
            <p>Supports Markdown: **bold**, *italic*, [links](url), etc.</p>
          </div>
        </TabsContent>
        <TabsContent value="preview" className="mt-2">
          <div className="border rounded-md p-3 min-h-[150px] prose prose-sm max-w-none">
            {preview ? (
              <ReactMarkdown>{preview}</ReactMarkdown>
            ) : (
              <p className="text-muted-foreground italic">Nothing to preview</p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

