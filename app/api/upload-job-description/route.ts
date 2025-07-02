import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import connectDB from "@/lib/mongoose"
import JobDescription from "@/lib/models/JobDescription"

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File
    const textContent = formData.get("textContent") as string

    let jobDescriptionContent = ""

    if (file) {
      // Handle PDF file upload
      if (file.type === "application/pdf") {
        // For now, we'll ask users to copy-paste text content
        // In production, you'd use a PDF parsing library
        jobDescriptionContent = textContent || "Please copy and paste the job description text."
      } else if (file.type === "text/plain") {
        jobDescriptionContent = await file.text()
      }
    } else if (textContent) {
      jobDescriptionContent = textContent
    }

    // Extract keywords and requirements (basic implementation)
    const keywords = extractKeywords(jobDescriptionContent)
    const requirements = extractRequirements(jobDescriptionContent)

    // Store job description in MongoDB
    await connectDB()

    const jobDescription = new JobDescription({
      userId,
      content: jobDescriptionContent,
      keywords,
      requirements,
    })

    await jobDescription.save()

    return NextResponse.json({
      success: true,
      jobDescription: jobDescriptionContent,
      message: "Job description processed successfully",
    })
  } catch (error) {
    console.error("Error processing job description:", error)
    return NextResponse.json({ error: "Failed to process job description" }, { status: 500 })
  }
}

function extractKeywords(content: string): string[] {
  // Basic keyword extraction - in production, use more sophisticated NLP
  const commonKeywords = [
    "javascript",
    "python",
    "react",
    "node.js",
    "aws",
    "docker",
    "kubernetes",
    "leadership",
    "communication",
    "problem solving",
    "teamwork",
    "agile",
    "scrum",
    "git",
    "sql",
    "mongodb",
    "postgresql",
    "typescript",
    "next.js",
  ]

  const contentLower = content.toLowerCase()
  return commonKeywords.filter((keyword) => contentLower.includes(keyword))
}

function extractRequirements(content: string): string[] {
  // Basic requirement extraction
  const lines = content.split("\n")
  return lines
    .filter(
      (line) =>
        line.includes("require") ||
        line.includes("must have") ||
        line.includes("experience with") ||
        line.includes("knowledge of"),
    )
    .slice(0, 10) // Limit to first 10 requirements
}
