"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2 } from "lucide-react"
import type { Project } from "@/types/resume"

interface ProjectsStepProps {
  data: Project[]
  onUpdate: (data: Project[]) => void
}

export function ProjectsStep({ data, onUpdate }: ProjectsStepProps) {
  const addProject = () => {
    const newProject: Project = {
      id: Date.now().toString(),
      name: "",
      description: "",
      technologies: "",
      url: "",
      github: "",
    }
    onUpdate([...data, newProject])
  }

  const updateProject = (id: string, field: keyof Project, value: string) => {
    onUpdate(data.map((project) => (project.id === id ? { ...project, [field]: value } : project)))
  }

  const removeProject = (id: string) => {
    onUpdate(data.filter((project) => project.id !== id))
  }

  return (
    <div className="space-y-6">
      {data.map((project) => (
        <Card key={project.id}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg">Project</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => removeProject(project.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Project Name *</Label>
              <Input
                value={project.name}
                onChange={(e) => updateProject(project.id, "name", e.target.value)}
                placeholder="E-commerce Platform"
              />
            </div>

            <div className="space-y-2">
              <Label>Description *</Label>
              <Textarea
                value={project.description}
                onChange={(e) => updateProject(project.id, "description", e.target.value)}
                placeholder="• Built a full-stack e-commerce platform with React and Node.js&#10;• Implemented secure payment processing with Stripe&#10;• Achieved 99.9% uptime with AWS deployment"
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label>Technologies Used</Label>
              <Input
                value={project.technologies}
                onChange={(e) => updateProject(project.id, "technologies", e.target.value)}
                placeholder="React, Node.js, MongoDB, AWS"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Live URL</Label>
                <Input
                  value={project.url}
                  onChange={(e) => updateProject(project.id, "url", e.target.value)}
                  placeholder="https://myproject.com"
                />
              </div>
              <div className="space-y-2">
                <Label>GitHub Repository</Label>
                <Input
                  value={project.github}
                  onChange={(e) => updateProject(project.id, "github", e.target.value)}
                  placeholder="https://github.com/username/project"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      <Button onClick={addProject} variant="outline" className="w-full bg-transparent">
        <Plus className="h-4 w-4 mr-2" />
        Add Project
      </Button>
    </div>
  )
}
