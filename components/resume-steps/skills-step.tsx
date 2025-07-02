"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { X, Plus } from "lucide-react"
import type { Skills } from "@/types/resume"
import { useState } from "react"

interface SkillsStepProps {
  data: Skills
  onUpdate: (data: Skills) => void
}

export function SkillsStep({ data, onUpdate }: SkillsStepProps) {
  const [newTechnicalSkill, setNewTechnicalSkill] = useState("")
  const [newSoftSkill, setNewSoftSkill] = useState("")

  const addTechnicalSkill = () => {
    if (newTechnicalSkill.trim()) {
      onUpdate({
        ...data,
        technical: [...data.technical, newTechnicalSkill.trim()],
      })
      setNewTechnicalSkill("")
    }
  }

  const addSoftSkill = () => {
    if (newSoftSkill.trim()) {
      onUpdate({
        ...data,
        soft: [...data.soft, newSoftSkill.trim()],
      })
      setNewSoftSkill("")
    }
  }

  const removeTechnicalSkill = (index: number) => {
    onUpdate({
      ...data,
      technical: data.technical.filter((_, i) => i !== index),
    })
  }

  const removeSoftSkill = (index: number) => {
    onUpdate({
      ...data,
      soft: data.soft.filter((_, i) => i !== index),
    })
  }

  const handleKeyPress = (e: React.KeyboardEvent, type: "technical" | "soft") => {
    if (e.key === "Enter") {
      e.preventDefault()
      if (type === "technical") {
        addTechnicalSkill()
      } else {
        addSoftSkill()
      }
    }
  }

  return (
    <div className="space-y-8">
      {/* Technical Skills */}
      <div className="space-y-4">
        <div>
          <Label className="text-lg font-semibold">Technical Skills</Label>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Programming languages, frameworks, tools, and technologies
          </p>
        </div>

        <div className="flex gap-2">
          <Input
            value={newTechnicalSkill}
            onChange={(e) => setNewTechnicalSkill(e.target.value)}
            onKeyPress={(e) => handleKeyPress(e, "technical")}
            placeholder="e.g., JavaScript, React, Python"
          />
          <Button onClick={addTechnicalSkill} size="sm">
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          {data.technical.map((skill, index) => (
            <Badge key={index} variant="secondary" className="text-sm">
              {skill}
              <button onClick={() => removeTechnicalSkill(index)} className="ml-2 hover:text-red-500">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>

        {data.technical.length === 0 && (
          <p className="text-sm text-gray-500 italic">
            No technical skills added yet. Add skills that are relevant to your target role.
          </p>
        )}
      </div>

      {/* Soft Skills */}
      <div className="space-y-4">
        <div>
          <Label className="text-lg font-semibold">Soft Skills</Label>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Communication, leadership, and interpersonal skills
          </p>
        </div>

        <div className="flex gap-2">
          <Input
            value={newSoftSkill}
            onChange={(e) => setNewSoftSkill(e.target.value)}
            onKeyPress={(e) => handleKeyPress(e, "soft")}
            placeholder="e.g., Leadership, Communication, Problem Solving"
          />
          <Button onClick={addSoftSkill} size="sm">
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          {data.soft.map((skill, index) => (
            <Badge key={index} variant="outline" className="text-sm">
              {skill}
              <button onClick={() => removeSoftSkill(index)} className="ml-2 hover:text-red-500">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>

        {data.soft.length === 0 && (
          <p className="text-sm text-gray-500 italic">
            No soft skills added yet. Include skills that demonstrate your ability to work with others.
          </p>
        )}
      </div>

      {/* Suggested Skills */}
      <div className="space-y-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <Label className="text-lg font-semibold text-blue-900 dark:text-blue-100">💡 Skill Suggestions</Label>
        <div className="space-y-2">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            <strong>Popular Technical Skills:</strong> JavaScript, Python, React, Node.js, AWS, Docker, Git, SQL,
            MongoDB, TypeScript
          </p>
          <p className="text-sm text-blue-800 dark:text-blue-200">
            <strong>Popular Soft Skills:</strong> Leadership, Communication, Problem Solving, Team Collaboration,
            Project Management, Adaptability
          </p>
        </div>
      </div>
    </div>
  )
}
