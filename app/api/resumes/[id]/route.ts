import { auth } from "@clerk/nextjs/server"
import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongoose"
import Resume from "@/lib/models/Resume"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const resume = await Resume.findOne({ _id: params.id, userId })

    if (!resume) {
      return NextResponse.json({ error: "Resume not found" }, { status: 404 })
    }

    return NextResponse.json({ resume })
  } catch (error) {
    console.error("Error fetching resume:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { title, data } = await request.json()

    await connectDB()

    const resume = await Resume.findOneAndUpdate(
      { _id: params.id, userId },
      { title, data, updatedAt: new Date() },
      { new: true },
    )

    if (!resume) {
      return NextResponse.json({ error: "Resume not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, resume })
  } catch (error) {
    console.error("Error updating resume:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const resume = await Resume.findOneAndDelete({ _id: params.id, userId })

    if (!resume) {
      return NextResponse.json({ error: "Resume not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting resume:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
