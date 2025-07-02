"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, FileText, Loader2 } from "lucide-react"
import { useState, useRef } from "react"
import { useToast } from "@/hooks/use-toast"

interface JobDescriptionStepProps {
  data: string
  onUpdate: (data: string) => void
}

export function JobDescriptionStep({ data, onUpdate }: JobDescriptionStepProps) {
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("textContent", data)

      const response = await fetch("/api/upload-job-description", {
        method: "POST",
        body: formData,
      })

      const result = await response.json()

      if (result.success) {
        onUpdate(result.jobDescription)
        toast({
          title: "Success",
          description: result.message,
        })
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process job description",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Upload Job Description</h3>
        <p className="text-gray-600 dark:text-gray-400">
          Upload the job description you're targeting to get AI-optimized resume suggestions
        </p>
      </div>

      {/* File Upload */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload File
          </CardTitle>
          <CardDescription>Upload a PDF or text file containing the job description</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
            <input ref={fileInputRef} type="file" accept=".pdf,.txt" onChange={handleFileUpload} className="hidden" />
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Drag and drop your file here, or click to browse
            </p>
            <Button onClick={() => fileInputRef.current?.click()} disabled={isUploading} variant="outline">
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Choose File
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Text Input */}
      <div className="space-y-2">
        <Label htmlFor="jobDescription">Or paste job description text</Label>
        <Textarea
          id="jobDescription"
          value={data}
          onChange={(e) => onUpdate(e.target.value)}
          placeholder="Paste the complete job description here..."
          rows={12}
          className="min-h-[300px]"
        />
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Include the complete job posting with requirements, responsibilities, and qualifications for best results.
        </p>
      </div>

      {data && (
        <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-green-800 dark:text-green-200">
              <FileText className="h-5 w-5" />
              <span className="font-medium">Job description loaded</span>
            </div>
            <p className="text-sm text-green-700 dark:text-green-300 mt-1">
              {data.length} characters • Ready for AI optimization
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
