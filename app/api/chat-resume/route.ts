import { streamText } from "ai"
import { google } from "@ai-sdk/google"
import type { NextRequest } from "next/server"
import { auth } from "@clerk/nextjs/server"

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return new Response("Unauthorized", { status: 401 })
    }

    const { messages, resumeContext } = await request.json()

    const systemPrompt = `
    You are an expert resume consultant and career advisor. You help users improve their resumes through conversational guidance.
    
    Current resume context:
    ${JSON.stringify(resumeContext, null, 2)}
    
    Your role:
    - Provide specific, actionable advice for resume improvement
    - Suggest ATS-optimized language and keywords
    - Help quantify achievements with metrics
    - Recommend better action verbs and phrasing
    - Ensure content aligns with target job requirements
    - Keep responses concise and practical
    
    Always focus on making the resume more competitive and ATS-friendly.
    `

    const result = streamText({
      model: google("gemini-1.5-pro"),
      system: systemPrompt,
      messages,
    })

    return result.toDataStreamResponse()
  } catch (error) {
    console.error("Error in chat-resume:", error)
    return new Response("Internal Server Error", { status: 500 })
  }
}
