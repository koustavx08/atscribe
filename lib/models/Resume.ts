import mongoose from "mongoose"

export interface IResume {
  _id?: string
  userId: string
  title: string
  data: {
    personalInfo: {
      fullName: string
      email: string
      phone: string
      location: string
      linkedin: string
      website: string
    }
    education: Array<{
      id: string
      institution: string
      degree: string
      field: string
      startDate: string
      endDate: string
      gpa: string
      description: string
    }>
    experience: Array<{
      id: string
      company: string
      position: string
      location: string
      startDate: string
      endDate: string
      current: boolean
      description: string
    }>
    projects: Array<{
      id: string
      name: string
      description: string
      technologies: string
      url: string
      github: string
    }>
    skills: {
      technical: string[]
      soft: string[]
    }
    jobDescription: string
  }
  createdAt: Date
  updatedAt: Date
}

const ResumeSchema = new mongoose.Schema<IResume>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
    },
    data: {
      personalInfo: {
        fullName: String,
        email: String,
        phone: String,
        location: String,
        linkedin: String,
        website: String,
      },
      education: [
        {
          id: String,
          institution: String,
          degree: String,
          field: String,
          startDate: String,
          endDate: String,
          gpa: String,
          description: String,
        },
      ],
      experience: [
        {
          id: String,
          company: String,
          position: String,
          location: String,
          startDate: String,
          endDate: String,
          current: Boolean,
          description: String,
        },
      ],
      projects: [
        {
          id: String,
          name: String,
          description: String,
          technologies: String,
          url: String,
          github: String,
        },
      ],
      skills: {
        technical: [String],
        soft: [String],
      },
      jobDescription: String,
    },
  },
  {
    timestamps: true,
  },
)

// Create text indexes for search functionality
ResumeSchema.index({
  "data.personalInfo.fullName": "text",
  "data.experience.company": "text",
  "data.experience.position": "text",
  "data.skills.technical": "text",
  "data.skills.soft": "text",
})

export default mongoose.models.Resume || mongoose.model<IResume>("Resume", ResumeSchema)
