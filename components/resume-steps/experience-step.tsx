"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Trash2 } from "lucide-react"
import type { Experience } from "@/types/resume"

interface ExperienceStepProps {
  data: Experience[]
  onUpdate: (data: Experience[]) => void
}

export function ExperienceStep({ data, onUpdate }: ExperienceStepProps) {
  const addExperience = () => {
    const newExperience: Experience = {
      id: Date.now().toString(),
      company: "",
      position: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
    }
    onUpdate([...data, newExperience])
  }

  const updateExperience = (id: string, field: keyof Experience, value: string | boolean) => {
    onUpdate(data.map((exp) => (exp.id === id ? { ...exp, [field]: value } : exp)))
  }

  const removeExperience = (id: string) => {
    onUpdate(data.filter((exp) => exp.id !== id))
  }

  return (
    <div className="space-y-6">
      {data.map((experience) => (
        <Card key={experience.id}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg">Work Experience</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => removeExperience(experience.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Company *</Label>
                <Input
                  value={experience.company}
                  onChange={(e) => updateExperience(experience.id, "company", e.target.value)}
                  placeholder="Google"
                />
              </div>
              <div className="space-y-2">
                <Label>Position *</Label>
                <Input
                  value={experience.position}
                  onChange={(e) => updateExperience(experience.id, "position", e.target.value)}
                  placeholder="Software Engineer"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Location</Label>
              <Input
                value={experience.location}
                onChange={(e) => updateExperience(experience.id, "location", e.target.value)}
                placeholder="Mountain View, CA"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Input
                  type="month"
                  value={experience.startDate}
                  onChange={(e) => updateExperience(experience.id, "startDate", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>End Date</Label>
                <Input
                  type="month"
                  value={experience.endDate}
                  onChange={(e) => updateExperience(experience.id, "endDate", e.target.value)}
                  disabled={experience.current}
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id={`current-${experience.id}`}
                checked={experience.current}
                onCheckedChange={(checked) => updateExperience(experience.id, "current", checked as boolean)}
              />
              <Label htmlFor={`current-${experience.id}`}>I currently work here</Label>
            </div>

            <div className="space-y-2">
              <Label>Description *</Label>
              <Textarea
                value={experience.description}
                onChange={(e) => updateExperience(experience.id, "description", e.target.value)}
                placeholder="• Developed and maintained web applications using React and Node.js&#10;• Collaborated with cross-functional teams to deliver features&#10;• Improved application performance by 30%"
                rows={5}
              />
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Use bullet points to describe your achievements and responsibilities. Focus on quantifiable results.
              </p>
            </div>
          </CardContent>
        </Card>
      ))}

      <Button onClick={addExperience} variant="outline" className="w-full bg-transparent">
        <Plus className="h-4 w-4 mr-2" />
        Add Experience
      </Button>
    </div>
  )
}
