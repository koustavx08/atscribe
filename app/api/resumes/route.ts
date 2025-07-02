import { auth } from "@clerk/nextjs/server"
import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongoose"
import Resume from "@/lib/models/Resume"

export async function GET() {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const resumes = await Resume.find({ userId }).sort({ updatedAt: -1 }).select("_id title createdAt updatedAt")

    return NextResponse.json({ resumes })
  } catch (error) {
    console.error("Error fetching resumes:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { title, data } = await request.json()

    await connectDB()

    const resume = new Resume({
      userId,
      title,
      data,
    })

    await resume.save()

    return NextResponse.json({
      success: true,
      resume: {
        _id: resume._id,
        title: resume.title,
        createdAt: resume.createdAt,
        updatedAt: resume.updatedAt,
      },
    })
  } catch (error) {
    console.error("Error creating resume:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
