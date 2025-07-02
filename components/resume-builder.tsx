"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ThemeToggle } from "@/components/theme-toggle"
import { AuthButton } from "@/components/auth-button"
import { FileText, ArrowLeft, ArrowRight } from "lucide-react"
import Link from "next/link"
import { PersonalInfoStep } from "@/components/resume-steps/personal-info-step"
import { EducationStep } from "@/components/resume-steps/education-step"
import { ExperienceStep } from "@/components/resume-steps/experience-step"
import { ProjectsStep } from "@/components/resume-steps/projects-step"
import { SkillsStep } from "@/components/resume-steps/skills-step"
import { JobDescriptionStep } from "@/components/resume-steps/job-description-step"
import { ReviewStep } from "@/components/resume-steps/review-step"
import type { ResumeData } from "@/types/resume"

const steps = [
  { id: "personal", title: "Personal Info", description: "Basic information and contact details" },
  { id: "education", title: "Education", description: "Academic background and qualifications" },
  { id: "experience", title: "Experience", description: "Work history and achievements" },
  { id: "projects", title: "Projects", description: "Notable projects and contributions" },
  { id: "skills", title: "Skills", description: "Technical and soft skills" },
  { id: "job-description", title: "Job Target", description: "Upload target job description" },
  { id: "review", title: "Review & Generate", description: "AI optimization and final review" },
]

export function ResumeBuilder() {
  const [currentStep, setCurrentStep] = useState(0)
  const [resumeData, setResumeData] = useState<ResumeData>({
    personalInfo: {
      fullName: "",
      email: "",
      phone: "",
      location: "",
      linkedin: "",
      website: "",
    },
    education: [],
    experience: [],
    projects: [],
    skills: {
      technical: [],
      soft: [],
    },
    jobDescription: "",
  })

  const updateResumeData = (section: keyof ResumeData, data: any) => {
    setResumeData((prev) => ({
      ...prev,
      [section]: data,
    }))
  }

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const renderStep = () => {
    switch (steps[currentStep].id) {
      case "personal":
        return (
          <PersonalInfoStep
            data={resumeData.personalInfo}
            onUpdate={(data) => updateResumeData("personalInfo", data)}
          />
        )
      case "education":
        return <EducationStep data={resumeData.education} onUpdate={(data) => updateResumeData("education", data)} />
      case "experience":
        return <ExperienceStep data={resumeData.experience} onUpdate={(data) => updateResumeData("experience", data)} />
      case "projects":
        return <ProjectsStep data={resumeData.projects} onUpdate={(data) => updateResumeData("projects", data)} />
      case "skills":
        return <SkillsStep data={resumeData.skills} onUpdate={(data) => updateResumeData("skills", data)} />
      case "job-description":
        return (
          <JobDescriptionStep
            data={resumeData.jobDescription}
            onUpdate={(data) => updateResumeData("jobDescription", data)}
          />
        )
      case "review":
        return <ReviewStep resumeData={resumeData} onUpdate={setResumeData} />
      default:
        return null
    }
  }

  const progress = ((currentStep + 1) / steps.length) * 100

  return (
    <div>
      {/* Header */}
      <header className="border-b bg-white dark:bg-gray-900 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <FileText className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">ATScribe</h1>
          </Link>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <AuthButton />
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="bg-white dark:bg-gray-900 border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{steps[currentStep].title}</h2>
            <span className="text-sm text-gray-600 dark:text-gray-300">
              Step {currentStep + 1} of {steps.length}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>{steps[currentStep].title}</CardTitle>
              <CardDescription>{steps[currentStep].description}</CardDescription>
            </CardHeader>
            <CardContent>{renderStep()}</CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8">
            <Button variant="outline" onClick={prevStep} disabled={currentStep === 0}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>

            <div className="flex items-center space-x-2">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    index <= currentStep ? "bg-blue-600" : "bg-gray-300 dark:bg-gray-600"
                  }`}
                />
              ))}
            </div>

            <Button onClick={nextStep} disabled={currentStep === steps.length - 1}>
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
