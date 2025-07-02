"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, FileText, Loader2 } from "lucide-react"
import type { ResumeData } from "@/types/resume"

interface ResumePDFExportProps {
  resumeData: ResumeData
}

export function ResumePDFExport({ resumeData }: ResumePDFExportProps) {
  const [selectedTemplate, setSelectedTemplate] = useState("modern")
  const [isGenerating, setIsGenerating] = useState(false)

  const templates = [
    { id: "modern", name: "Modern", description: "Clean and contemporary design" },
    { id: "classic", name: "Classic", description: "Traditional professional layout" },
    { id: "minimal", name: "Minimal", description: "Simple and elegant design" },
    { id: "creative", name: "Creative", description: "Unique design for creative roles" },
  ]

  const generatePDF = async () => {
    setIsGenerating(true)

    try {
      // Create HTML content for PDF generation
      const htmlContent = generateHTMLResume(resumeData, selectedTemplate)

      // Create a new window for PDF generation
      const printWindow = window.open('', '_blank')
      if (!printWindow) {
        throw new Error('Unable to open print window. Please check your popup blocker.')
      }

      // Write the HTML content to the new window
      printWindow.document.write(htmlContent)
      printWindow.document.close()

      // Wait for content to load
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Focus on the print window and trigger print dialog
      printWindow.focus()
      printWindow.print()

      // Close the window after printing
      setTimeout(() => {
        printWindow.close()
      }, 1000)

      // Note: This uses the browser's built-in print-to-PDF functionality
      // Users will need to select "Save as PDF" in their print dialog
    } catch (error) {
      console.error("Error generating PDF:", error)
      alert("Failed to generate PDF. Please ensure popups are allowed and try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  const generateHTMLResume = (data: ResumeData, template: string): string => {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${data.personalInfo.fullName} - Resume</title>
        <style>
            body {
                font-family: 'Arial', sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 800px;
                margin: 0 auto;
                padding: 20px;
                background: white;
                font-size: 12px;
            }
            .header {
                text-align: center;
                border-bottom: 2px solid #2563eb;
                padding-bottom: 20px;
                margin-bottom: 30px;
            }
            .header h1 {
                margin: 0;
                font-size: 2.5em;
                color: #2563eb;
            }
            .contact-info {
                margin-top: 10px;
                font-size: 0.9em;
                color: #666;
            }
            .section {
                margin-bottom: 30px;
                page-break-inside: avoid;
            }
            .section h2 {
                color: #2563eb;
                border-bottom: 1px solid #e5e7eb;
                padding-bottom: 5px;
                margin-bottom: 15px;
                font-size: 1.2em;
                page-break-after: avoid;
            }
            .experience-item, .education-item, .project-item {
                margin-bottom: 20px;
                page-break-inside: avoid;
            }
            .experience-header {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                margin-bottom: 5px;
            }
            .position {
                font-weight: bold;
                font-size: 1.1em;
            }
            .company {
                color: #666;
                font-style: italic;
            }
            .date {
                color: #666;
                font-size: 0.9em;
            }
            .description {
                margin-top: 10px;
                white-space: pre-line;
            }
            .skills {
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
            }
            .skill-tag {
                background: #f3f4f6;
                padding: 4px 8px;
                border-radius: 4px;
                font-size: 0.9em;
                border: 1px solid #e5e7eb;
            }
            /* PDF-specific styles */
            @media print {
                body { 
                    margin: 0; 
                    padding: 15px; 
                    font-size: 11px;
                    max-width: none;
                }
                .header { 
                    page-break-after: avoid; 
                    margin-bottom: 20px;
                }
                .section { 
                    page-break-inside: avoid; 
                    margin-bottom: 20px;
                }
                .experience-item, .education-item, .project-item {
                    page-break-inside: avoid;
                    margin-bottom: 15px;
                }
                h2 {
                    page-break-after: avoid;
                }
                /* Ensure links are visible in PDF */
                a {
                    color: #2563eb;
                    text-decoration: none;
                }
                /* Hide any interactive elements in PDF */
                button, input, select, textarea {
                    display: none;
                }
            }
            @page {
                margin: 0.5in;
                size: letter;
            }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>${data.personalInfo.fullName}</h1>
            <div class="contact-info">
                ${data.personalInfo.email} • ${data.personalInfo.phone}
                ${data.personalInfo.location ? ` • ${data.personalInfo.location}` : ""}
                ${data.personalInfo.linkedin ? ` • ${data.personalInfo.linkedin}` : ""}
                ${data.personalInfo.website ? ` • ${data.personalInfo.website}` : ""}
            </div>
        </div>

        ${
          data.experience.length > 0
            ? `
        <div class="section">
            <h2>Professional Experience</h2>
            ${data.experience
              .map(
                (exp) => `
                <div class="experience-item">
                    <div class="experience-header">
                        <div>
                            <div class="position">${exp.position}</div>
                            <div class="company">${exp.company} • ${exp.location}</div>
                        </div>
                        <div class="date">${exp.startDate} - ${exp.current ? "Present" : exp.endDate}</div>
                    </div>
                    <div class="description">${exp.description}</div>
                </div>
            `,
              )
              .join("")}
        </div>
        `
            : ""
        }

        ${
          data.education.length > 0
            ? `
        <div class="section">
            <h2>Education</h2>
            ${data.education
              .map(
                (edu) => `
                <div class="education-item">
                    <div class="experience-header">
                        <div>
                            <div class="position">${edu.degree} ${edu.field ? `in ${edu.field}` : ""}</div>
                            <div class="company">${edu.institution}</div>
                        </div>
                        <div class="date">${edu.startDate} - ${edu.endDate}</div>
                    </div>
                    ${edu.gpa ? `<div>GPA: ${edu.gpa}</div>` : ""}
                    ${edu.description ? `<div class="description">${edu.description}</div>` : ""}
                </div>
            `,
              )
              .join("")}
        </div>
        `
            : ""
        }

        ${
          data.projects.length > 0
            ? `
        <div class="section">
            <h2>Projects</h2>
            ${data.projects
              .map(
                (project) => `
                <div class="project-item">
                    <div class="position">${project.name}</div>
                    ${project.technologies ? `<div class="company">Technologies: ${project.technologies}</div>` : ""}
                    <div class="description">${project.description}</div>
                    ${
                      project.url || project.github
                        ? `
                        <div style="margin-top: 5px;">
                            ${project.url ? `<a href="${project.url}">Live Demo</a>` : ""}
                            ${project.url && project.github ? " • " : ""}
                            ${project.github ? `<a href="${project.github}">GitHub</a>` : ""}
                        </div>
                    `
                        : ""
                    }
                </div>
            `,
              )
              .join("")}
        </div>
        `
            : ""
        }

        ${
          data.skills.technical.length > 0 || data.skills.soft.length > 0
            ? `
        <div class="section">
            <h2>Skills</h2>
            ${
              data.skills.technical.length > 0
                ? `
                <div style="margin-bottom: 15px;">
                    <strong>Technical Skills:</strong>
                    <div class="skills" style="margin-top: 8px;">
                        ${data.skills.technical.map((skill) => `<span class="skill-tag">${skill}</span>`).join("")}
                    </div>
                </div>
            `
                : ""
            }
            ${
              data.skills.soft.length > 0
                ? `
                <div>
                    <strong>Soft Skills:</strong>
                    <div class="skills" style="margin-top: 8px;">
                        ${data.skills.soft.map((skill) => `<span class="skill-tag">${skill}</span>`).join("")}
                    </div>
                </div>
            `
                : ""
            }
        </div>
        `
            : ""
        }
    </body>
    </html>
    `
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="h-5 w-5 text-green-600" />
          Export Resume as PDF
        </CardTitle>
        <CardDescription>Choose a template and export your resume as PDF only</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Select Template</label>
          <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a template" />
            </SelectTrigger>
            <SelectContent>
              {templates.map((template) => (
                <SelectItem key={template.id} value={template.id}>
                  <div>
                    <div className="font-medium">{template.name}</div>
                    <div className="text-sm text-gray-600">{template.description}</div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <Card className="border-2 border-dashed border-gray-300 dark:border-gray-600">
            <CardContent className="p-6 text-center">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h4 className="font-medium mb-2">Template Preview</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {templates.find((t) => t.id === selectedTemplate)?.description}
              </p>
            </CardContent>
          </Card>            <div className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium">PDF Export Features</h4>
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <p>✓ ATS-optimized formatting</p>
                  <p>✓ Professional PDF layout</p>
                  <p>✓ Print-ready quality</p>
                  <p>✓ PDF format only</p>
                </div>
              </div>

              <Button onClick={generatePDF} disabled={isGenerating} size="lg" className="w-full">
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Preparing PDF...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Export as PDF
                  </>
                )}
              </Button>
            </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">� PDF Export Instructions</h4>
          <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
            <li>• Click "Export as PDF" to open the print dialog</li>
            <li>• Select "Save as PDF" as your printer destination</li>
            <li>• Choose "Letter" or "A4" paper size for best results</li>
            <li>• Ensure "More settings" → "Options" → "Headers and footers" is unchecked</li>
            <li>• Save the PDF with a professional filename</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
