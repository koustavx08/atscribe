"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ResumeChat } from "@/components/resume-chat"
import { ResumePDFExport } from "@/components/resume-pdf-export"
import { Loader2, Sparkles, Download, MessageCircle, Eye } from "lucide-react"
import type { ResumeData } from "@/types/resume"
import { useToast } from "@/hooks/use-toast"

interface ReviewStepProps {
  resumeData: ResumeData
  onUpdate: (data: ResumeData) => void
}

interface AIGeneratedContent {
  summary: string
  experiences: Array<{
    id: string
    bulletPoints: string[]
    keywords: string[]
  }>
  skills: {
    technical: string[]
    soft: string[]
  }
  suggestions: string[]
}

export function ReviewStep({ resumeData, onUpdate }: ReviewStepProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [aiContent, setAiContent] = useState<AIGeneratedContent | null>(null)
  const [activeTab, setActiveTab] = useState("preview")
  const { toast } = useToast()

  const generateAIContent = async () => {
    if (!resumeData.jobDescription.trim()) {
      toast({
        title: "Job Description Required",
        description: "Please add a job description to generate AI-optimized content.",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)

    try {
      const response = await fetch("/api/generate-resume", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          resumeData,
          jobDescription: resumeData.jobDescription,
        }),
      })

      const result = await response.json()

      if (result.success) {
        setAiContent(result.data)
        toast({
          title: "AI Content Generated",
          description: "Your resume has been optimized for ATS compatibility.",
        })
      } else {
        // Handle specific error types
        if (response.status === 429) {
          const retryAfter = result.retryAfter || 60
          toast({
            title: "Rate Limit Exceeded",
            description: `API quota exceeded. Please try again in ${retryAfter} seconds.`,
            variant: "destructive",
          })
        } else {
          throw new Error(result.error || "Unknown error occurred")
        }
      }
    } catch (error) {
      console.error("Error generating AI content:", error)
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate AI content. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const applyAIContent = () => {
    if (!aiContent) return

    // Apply AI-generated content to resume data
    const updatedData = { ...resumeData }

    // Update experiences with AI-generated bullet points
    updatedData.experience = updatedData.experience.map((exp) => {
      const aiExp = aiContent.experiences.find((ai) => ai.id === exp.id)
      if (aiExp) {
        return {
          ...exp,
          description: aiExp.bulletPoints.join("\n• "),
        }
      }
      return exp
    })

    // Update skills with AI suggestions
    updatedData.skills = {
      technical: [...new Set([...updatedData.skills.technical, ...aiContent.skills.technical])],
      soft: [...new Set([...updatedData.skills.soft, ...aiContent.skills.soft])],
    }

    onUpdate(updatedData)

    toast({
      title: "Content Applied",
      description: "AI-generated content has been applied to your resume.",
    })
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold mb-2">Review & Generate</h3>
        <p className="text-gray-600 dark:text-gray-400">Review your resume and generate AI-optimized content</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="preview">
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </TabsTrigger>
          <TabsTrigger value="ai-optimize">
            <Sparkles className="h-4 w-4 mr-2" />
            AI Optimize
          </TabsTrigger>
          <TabsTrigger value="chat">
            <MessageCircle className="h-4 w-4 mr-2" />
            AI Chat
          </TabsTrigger>
          <TabsTrigger value="export">
            <Download className="h-4 w-4 mr-2" />
            Export
          </TabsTrigger>
        </TabsList>

        <TabsContent value="preview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Resume Preview</CardTitle>
              <CardDescription>Review your resume content before optimization</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Personal Info */}
              <div>
                <h4 className="font-semibold text-lg mb-2">{resumeData.personalInfo.fullName}</h4>
                <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <p>
                    {resumeData.personalInfo.email} • {resumeData.personalInfo.phone}
                  </p>
                  <p>{resumeData.personalInfo.location}</p>
                  {resumeData.personalInfo.linkedin && <p>{resumeData.personalInfo.linkedin}</p>}
                  {resumeData.personalInfo.website && <p>{resumeData.personalInfo.website}</p>}
                </div>
              </div>

              <Separator />

              {/* Experience */}
              {resumeData.experience.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-3">Experience</h4>
                  <div className="space-y-4">
                    {resumeData.experience.map((exp) => (
                      <div key={exp.id}>
                        <div className="flex justify-between items-start mb-1">
                          <h5 className="font-medium">{exp.position}</h5>
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          {exp.company} • {exp.location}
                        </p>
                        <div className="text-sm whitespace-pre-line">{exp.description}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Separator />

              {/* Skills */}
              <div>
                <h4 className="font-semibold mb-3">Skills</h4>
                <div className="space-y-3">
                  {resumeData.skills.technical.length > 0 && (
                    <div>
                      <p className="text-sm font-medium mb-2">Technical Skills</p>
                      <div className="flex flex-wrap gap-1">
                        {resumeData.skills.technical.map((skill, index) => (
                          <Badge key={index} variant="secondary">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {resumeData.skills.soft.length > 0 && (
                    <div>
                      <p className="text-sm font-medium mb-2">Soft Skills</p>
                      <div className="flex flex-wrap gap-1">
                        {resumeData.skills.soft.map((skill, index) => (
                          <Badge key={index} variant="outline">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai-optimize" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-600" />
                AI Optimization
              </CardTitle>
              <CardDescription>Generate ATS-optimized content tailored to your target job</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={generateAIContent}
                disabled={isGenerating || !resumeData.jobDescription.trim()}
                size="lg"
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating AI Content...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate AI-Optimized Content
                  </>
                )}
              </Button>

              {!resumeData.jobDescription.trim() && (
                <p className="text-sm text-amber-600 dark:text-amber-400 text-center">
                  Please add a job description in the previous step to enable AI optimization
                </p>
              )}

              {aiContent && (
                <div className="space-y-4 mt-6">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">AI-Generated Content</h4>
                    <Button onClick={applyAIContent} size="sm">
                      Apply to Resume
                    </Button>
                  </div>

                  {/* AI Summary */}
                  <Card className="bg-blue-50 dark:bg-blue-900/20">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Professional Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm">{aiContent.summary}</p>
                    </CardContent>
                  </Card>

                  {/* AI Suggestions */}
                  <Card className="bg-green-50 dark:bg-green-900/20">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">ATS Optimization Suggestions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="text-sm space-y-1">
                        {aiContent.suggestions.map((suggestion, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-green-600 dark:text-green-400">•</span>
                            {suggestion}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  {/* Enhanced Skills */}
                  <Card className="bg-purple-50 dark:bg-purple-900/20">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Recommended Skills</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <p className="text-xs font-medium mb-2">Technical Skills</p>
                        <div className="flex flex-wrap gap-1">
                          {aiContent.skills.technical.map((skill, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs font-medium mb-2">Soft Skills</p>
                        <div className="flex flex-wrap gap-1">
                          {aiContent.skills.soft.map((skill, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="chat">
          <ResumeChat resumeData={resumeData} />
        </TabsContent>

        <TabsContent value="export">
          <ResumePDFExport resumeData={resumeData} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
