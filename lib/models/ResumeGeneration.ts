import mongoose from "mongoose"

export interface IResumeGeneration {
  _id?: string
  userId: string
  originalData: any
  jobDescription: string
  generatedContent: {
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
  createdAt: Date
}

const ResumeGenerationSchema = new mongoose.Schema<IResumeGeneration>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    originalData: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    jobDescription: {
      type: String,
      required: true,
    },
    generatedContent: {
      summary: String,
      experiences: [
        {
          id: String,
          bulletPoints: [String],
          keywords: [String],
        },
      ],
      skills: {
        technical: [String],
        soft: [String],
      },
      suggestions: [String],
    },
  },
  {
    timestamps: true,
  },
)

export default mongoose.models.ResumeGeneration ||
  mongoose.model<IResumeGeneration>("ResumeGeneration", ResumeGenerationSchema)
