import { ResumeData } from '@/types/resume';

interface LinkedInImportData {
  extracted: {
    name: string;
    headline: string;
    experience: string[];
    education: string[];
    skills: string[];
    rawText?: string;
  };
  aiEnhanced: {
    summary?: string;
    enhancedExperience?: string[];
    keywords?: string[];
    suggestions?: string[];
    error?: string;
  };
}

/**
 * Maps LinkedIn import data to resume form structure
 */
export function mapLinkedInToResume(importData: LinkedInImportData): Partial<ResumeData> {
  const { extracted, aiEnhanced } = importData;
  
  // Parse name into first and last
  const nameParts = (extracted.name || '').split(' ');
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || '';
  
  // Map experience data with fallback for AI-enhanced bullets
  const mappedExperience = (extracted.experience || []).map((exp, index) => {
    let enhancedBullet = aiEnhanced.enhancedExperience?.[index];
    if (!enhancedBullet && aiEnhanced.enhancedExperience && aiEnhanced.enhancedExperience.length > 0) {
      enhancedBullet = aiEnhanced.enhancedExperience[0];
    }
    if (!enhancedBullet) {
      enhancedBullet = exp;
    }
    const lines = (exp || '').split('\n').filter(Boolean);
    const title = lines[0] || '';
    const company = lines[1] || '';
    const duration = lines[2] || '';
    return {
      id: `exp-${index}`,
      company: company.trim(),
      position: title.trim(),
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: enhancedBullet
    };
  });
  
  // Map education data
  const mappedEducation = (extracted.education || []).map((edu, index) => {
    const lines = (edu || '').split('\n').filter(Boolean);
    const degree = lines[0] || '';
    const school = lines[1] || '';
    const year = lines[2] || '';
    return {
      id: `edu-${index}`,
      institution: school.trim(),
      degree: degree.trim(),
      field: '',
      startDate: '',
      endDate: year.trim(),
      gpa: '',
      description: ''
    };
  });
  
  // Combine original skills with AI-suggested keywords, remove duplicates, and filter falsy
  const allSkills = [
    ...(Array.isArray(extracted.skills) ? extracted.skills : []),
    ...(Array.isArray(aiEnhanced.keywords) ? aiEnhanced.keywords : [])
  ].filter((skill: unknown, index: number, array: unknown[]) =>
    typeof skill === 'string' && !!skill && array.indexOf(skill) === index
  ) as string[];
  
  return {
    personalInfo: {
      fullName: `${firstName} ${lastName}`.trim(),
      email: '',
      phone: '',
      location: '',
      linkedin: '',
      website: ''
    },
    experience: mappedExperience,
    education: mappedEducation,
    skills: {
      technical: allSkills,
      soft: []
    },
    projects: [],
    jobDescription: aiEnhanced.summary || extracted.headline || ''
  };
}

/**
 * Validates mapped resume data and returns validation errors
 */
export function validateMappedResume(resumeData: Partial<ResumeData>): string[] {
  const errors: string[] = [];
  if (!resumeData.personalInfo?.fullName?.trim()) {
    errors.push('Full name is required');
  }
  if (!resumeData.jobDescription?.trim()) {
    errors.push('Job description is required');
  }
  if (!resumeData.experience?.length) {
    errors.push('At least one work experience entry is required');
  }
  return errors;
}

/**
 * Generates preview data for user confirmation before applying import
 */
export function generateImportPreview(importData: LinkedInImportData) {
  const mapped = mapLinkedInToResume(importData);
  const errors = validateMappedResume(mapped);
  return {
    preview: mapped,
    errors,
    suggestions: importData.aiEnhanced.suggestions || [],
    isValid: errors.length === 0
  };
}
