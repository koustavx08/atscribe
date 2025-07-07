"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, FileText, Loader2 } from "lucide-react"
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import type { ResumeData } from "@/types/resume"

interface ResumePDFExportProps {
  resumeData: ResumeData
}

// Register Arial font using a standard web font as a fallback (or provide your own font file URL)
Font.register({
  family: 'Arial',
  fonts: [
    {
      src: 'https://fonts.gstatic.com/s/arial/v11/UqyNK9UOIntux_czAvDQx_Zc.ttf', // You may want to host your own or use a local font file
    },
  ],
});

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Arial',
    fontSize: 11,
    padding: 32,
    color: '#222',
    backgroundColor: '#fff',
    lineHeight: 1.5,
  },
  section: { marginBottom: 16 },
  header: { textAlign: 'center', marginBottom: 12 },
  name: { fontSize: 20, fontWeight: 'bold', color: '#2563eb' },
  contact: { fontSize: 10, color: '#666', marginTop: 4 },
  title: { fontSize: 13, fontWeight: 'bold', color: '#2563eb', marginBottom: 4 },
  itemHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 },
  position: { fontWeight: 'bold' },
  company: { fontStyle: 'italic', color: '#666' },
  date: { color: '#666', fontSize: 9 },
  description: { marginTop: 2, whiteSpace: 'pre-line' },
  skills: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginTop: 4 },
  skillTag: { backgroundColor: '#f3f4f6', borderRadius: 2, padding: 2, fontSize: 9, marginRight: 4, border: '1px solid #e5e7eb' },
});

const ResumePDF = ({ data }: { data: ResumeData }) => {
  // Safely access all properties with fallbacks to prevent undefined errors
  const safeData = {
    personalInfo: {
      fullName: data.personalInfo?.fullName || '',
      email: data.personalInfo?.email || '',
      phone: data.personalInfo?.phone || '',
      location: data.personalInfo?.location || '',
      linkedin: data.personalInfo?.linkedin || '',
      website: data.personalInfo?.website || ''
    },
    experience: Array.isArray(data.experience) ? data.experience : [],
    education: Array.isArray(data.education) ? data.education : [],
    projects: Array.isArray(data.projects) ? data.projects : [],
    skills: {
      technical: Array.isArray(data.skills?.technical) ? data.skills.technical : [],
      soft: Array.isArray(data.skills?.soft) ? data.skills.soft : []
    },
    jobDescription: data.jobDescription || ''
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.name}>{safeData.personalInfo.fullName}</Text>
          <Text style={styles.contact}>
            {safeData.personalInfo.email} • {safeData.personalInfo.phone}
            {safeData.personalInfo.location ? ` • ${safeData.personalInfo.location}` : ''}
            {safeData.personalInfo.linkedin ? ` • ${safeData.personalInfo.linkedin}` : ''}
            {safeData.personalInfo.website ? ` • ${safeData.personalInfo.website}` : ''}
          </Text>
        </View>
        {safeData.jobDescription && (
          <View style={styles.section}>
            <Text style={styles.title}>Professional Summary</Text>
            <Text>{safeData.jobDescription}</Text>
          </View>
        )}
        {safeData.experience.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.title}>Professional Experience</Text>
            {safeData.experience.map((exp, i) => (
              <View key={i} style={{ marginBottom: 8 }}>
                <View style={styles.itemHeader}>
                  <View>
                    <Text style={styles.position}>{exp.position || ''}</Text>
                    <Text style={styles.company}>
                      {exp.company || ''}{exp.location ? ` • ${exp.location}` : ''}
                    </Text>
                  </View>
                  <Text style={styles.date}>
                    {exp.startDate || ''} - {exp.current ? 'Present' : (exp.endDate || '')}
                  </Text>
                </View>
                <Text style={styles.description}>{exp.description || ''}</Text>
              </View>
            ))}
          </View>
        )}
        {safeData.education.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.title}>Education</Text>
            {safeData.education.map((edu, i) => (
              <View key={i} style={{ marginBottom: 8 }}>
                <View style={styles.itemHeader}>
                  <View>
                    <Text style={styles.position}>
                      {edu.degree || ''}{edu.field ? ` in ${edu.field}` : ''}
                    </Text>
                    <Text style={styles.company}>{edu.institution || ''}</Text>
                  </View>
                  <Text style={styles.date}>
                    {edu.startDate || ''} - {edu.endDate || ''}
                  </Text>
                </View>
                {edu.gpa && <Text>GPA: {edu.gpa}</Text>}
                {edu.description && <Text style={styles.description}>{edu.description}</Text>}
              </View>
            ))}
          </View>
        )}
        {safeData.projects.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.title}>Projects</Text>
            {safeData.projects.map((project, i) => (
              <View key={i} style={{ marginBottom: 8 }}>
                <Text style={styles.position}>{project.name || ''}</Text>
                {project.technologies && (
                  <Text style={styles.company}>Technologies: {project.technologies}</Text>
                )}
                <Text style={styles.description}>{project.description || ''}</Text>
              {(project.url || project.github) && (
                <Text style={{ color: '#2563eb', fontSize: 9 }}>
                  {project.url ? `Live Demo: ${project.url}` : ''}
                  {project.url && project.github ? ' • ' : ''}
                  {project.github ? `GitHub: ${project.github}` : ''}
                </Text>
              )}
            </View>
          ))}
        </View>
        )}
        {(safeData.skills.technical.length > 0 || safeData.skills.soft.length > 0) && (
          <View style={styles.section}>
            <Text style={styles.title}>Skills</Text>
            {safeData.skills.technical.length > 0 && (
              <View style={styles.skills}>
                <Text style={{ fontWeight: 'bold', marginRight: 4 }}>Technical:</Text>
                {safeData.skills.technical.map((skill, i) => (
                  <Text key={i} style={styles.skillTag}>{skill || ''}</Text>
              ))}
            </View>
          )}
          {safeData.skills.soft.length > 0 && (
            <View style={styles.skills}>
              <Text style={{ fontWeight: 'bold', marginRight: 4 }}>Soft:</Text>
              {safeData.skills.soft.map((skill, i) => (
                <Text key={i} style={styles.skillTag}>{skill || ''}</Text>
              ))}
            </View>
          )}
        </View>
        )}
      </Page>
    </Document>
  );
};

export function ResumePDFExport({ resumeData }: ResumePDFExportProps) {
  const [selectedTemplate, setSelectedTemplate] = useState("modern")
  const [isGenerating, setIsGenerating] = useState(false)
  const [pdfError, setPdfError] = useState<string | null>(null)

  const templates = [
    { id: "modern", name: "Modern", description: "Clean and contemporary design" },
    { id: "classic", name: "Classic", description: "Traditional professional layout" },
    { id: "minimal", name: "Minimal", description: "Simple and elegant design" },
    { id: "creative", name: "Creative", description: "Unique design for creative roles" },
  ]

  // Validate resume data before PDF generation
  const isValidResumeData = (data: ResumeData): boolean => {
    try {
      return !!(
        data &&
        data.personalInfo &&
        typeof data.personalInfo.fullName === 'string' &&
        Array.isArray(data.experience) &&
        Array.isArray(data.education) &&
        Array.isArray(data.projects) &&
        data.skills &&
        Array.isArray(data.skills.technical) &&
        Array.isArray(data.skills.soft)
      );
    } catch (error) {
      console.error('Resume data validation error:', error);
      return false;
    }
  };

  // Safe PDF component wrapper
  const SafeResumePDF = ({ data }: { data: ResumeData }) => {
    try {
      if (!isValidResumeData(data)) {
        throw new Error('Invalid resume data structure');
      }
      return <ResumePDF data={data} />;
    } catch (error) {
      console.error('PDF generation error:', error);
      setPdfError(error instanceof Error ? error.message : 'Unknown PDF error');
      return null;
    }
  };

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

              {pdfError ? (
                <div className="text-center">
                  <p className="text-red-600 text-sm mb-2">PDF Generation Error: {pdfError}</p>
                  <Button 
                    variant="outline" 
                    onClick={() => setPdfError(null)}
                    className="w-full"
                  >
                    Try Again
                  </Button>
                </div>
              ) : (
                <PDFDownloadLink
                  document={<SafeResumePDF data={resumeData} />}
                  fileName={`${(resumeData.personalInfo?.fullName || 'Resume').replace(/\s+/g, '_')}_Resume.pdf`}
                  className="w-full"
                >
                  {({ loading, error }) => {
                    if (error) {
                      setPdfError(error.message || 'PDF generation failed');
                      return null;
                    }
                    
                    return (
                      <Button size="lg" className="w-full" disabled={loading}>
                        {loading ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Preparing PDF...
                          </>
                        ) : (
                          <>
                            <Download className="h-4 w-4 mr-2" />
                            Download as PDF
                          </>
                        )}
                      </Button>
                    );
                  }}
                </PDFDownloadLink>
              )}
            </div>
        </div>

        {pdfError && (
          <div className="text-red-600 text-sm">
            Error generating PDF: {pdfError}
          </div>
        )}

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
