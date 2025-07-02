import mongoose from "mongoose"

export interface IJobDescription {
  _id?: string
  userId: string
  content: string
  keywords: string[]
  requirements: string[]
  createdAt: Date
  updatedAt: Date
}

const JobDescriptionSchema = new mongoose.Schema<IJobDescription>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    content: {
      type: String,
      required: true,
    },
    keywords: [String],
    requirements: [String],
  },
  {
    timestamps: true,
  },
)

// Create text index for semantic search
JobDescriptionSchema.index({ content: "text", keywords: "text" })

export default mongoose.models.JobDescription || mongoose.model<IJobDescription>("JobDescription", JobDescriptionSchema)
