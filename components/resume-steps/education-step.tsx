"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2 } from "lucide-react"
import type { Education } from "@/types/resume"

interface EducationStepProps {
  data: Education[]
  onUpdate: (data: Education[]) => void
}

export function EducationStep({ data, onUpdate }: EducationStepProps) {
  const addEducation = () => {
    const newEducation: Education = {
      id: Date.now().toString(),
      institution: "",
      degree: "",
      field: "",
      startDate: "",
      endDate: "",
      gpa: "",
      description: "",
    }
    onUpdate([...data, newEducation])
  }

  const updateEducation = (id: string, field: keyof Education, value: string) => {
    onUpdate(data.map((edu) => (edu.id === id ? { ...edu, [field]: value } : edu)))
  }

  const removeEducation = (id: string) => {
    onUpdate(data.filter((edu) => edu.id !== id))
  }

  return (
    <div className="space-y-6">
      {data.map((education) => (
        <Card key={education.id}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg">Education Entry</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => removeEducation(education.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Institution *</Label>
                <Input
                  value={education.institution}
                  onChange={(e) => updateEducation(education.id, "institution", e.target.value)}
                  placeholder="University of California, Berkeley"
                />
              </div>
              <div className="space-y-2">
                <Label>Degree *</Label>
                <Input
                  value={education.degree}
                  onChange={(e) => updateEducation(education.id, "degree", e.target.value)}
                  placeholder="Bachelor of Science"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Field of Study</Label>
                <Input
                  value={education.field}
                  onChange={(e) => updateEducation(education.id, "field", e.target.value)}
                  placeholder="Computer Science"
                />
              </div>
              <div className="space-y-2">
                <Label>GPA (Optional)</Label>
                <Input
                  value={education.gpa}
                  onChange={(e) => updateEducation(education.id, "gpa", e.target.value)}
                  placeholder="3.8/4.0"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Input
                  type="month"
                  value={education.startDate}
                  onChange={(e) => updateEducation(education.id, "startDate", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>End Date</Label>
                <Input
                  type="month"
                  value={education.endDate}
                  onChange={(e) => updateEducation(education.id, "endDate", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Description (Optional)</Label>
              <Textarea
                value={education.description}
                onChange={(e) => updateEducation(education.id, "description", e.target.value)}
                placeholder="Relevant coursework, honors, activities..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>
      ))}

      <Button onClick={addEducation} variant="outline" className="w-full bg-transparent">
        <Plus className="h-4 w-4 mr-2" />
        Add Education
      </Button>
    </div>
  )
}
