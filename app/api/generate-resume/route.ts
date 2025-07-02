import { generateObject } from "ai"
import { google } from "@ai-sdk/google"
import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { auth } from "@clerk/nextjs/server"
import connectDB from "@/lib/mongoose"
import ResumeGeneration from "@/lib/models/ResumeGeneration"
import { AI_CONFIG } from "@/lib/config/ai"

// Helper function to check if error is quota-related
function isQuotaError(error: any): boolean {
  return error?.statusCode === 429 || 
         error?.message?.includes('quota') || 
         error?.message?.includes('rate limit') ||
         error?.responseBody?.includes('RESOURCE_EXHAUSTED')
}

// Helper function to get retry delay from error
function getRetryDelay(error: any): number {
  try {
    const responseBody = typeof error.responseBody === 'string' 
      ? JSON.parse(error.responseBody) 
      : error.responseBody
    
    const retryInfo = responseBody?.error?.details?.find(
      (detail: any) => detail['@type']?.includes('RetryInfo')
    )
    
    if (retryInfo?.retryDelay) {
      const delay = retryInfo.retryDelay.replace('s', '')
      return parseInt(delay) * 1000 // Convert to milliseconds
    }
  } catch {
    // Fallback delay
  }
  return AI_CONFIG.DEFAULT_RETRY_AFTER * 1000 // Default in milliseconds
}

const resumeSchema = z.object({
  summary: z.string().describe("Professional summary tailored to the job description"),
  experiences: z.array(
    z.object({
      id: z.string(),
      bulletPoints: z.array(z.string()).describe("ATS-optimized bullet points highlighting achievements"),
      keywords: z.array(z.string()).describe("Relevant keywords for this role"),
    }),
  ),
  skills: z.object({
    technical: z.array(z.string()).describe("Technical skills relevant to the job"),
    soft: z.array(z.string()).describe("Soft skills that match the role requirements"),
  }),
  suggestions: z.array(z.string()).describe("Specific suggestions to improve ATS compatibility"),
})

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { resumeData, jobDescription } = await request.json()

    const prompt = `
    You are an expert resume writer and ATS optimization specialist. 
    
    Given this resume data:
    ${JSON.stringify(resumeData, null, 2)}
    
    And this job description:
    ${jobDescription}
    
    Generate ATS-optimized content that:
    1. Creates a compelling professional summary
    2. Enhances experience bullet points with quantified achievements
    3. Suggests relevant keywords for each experience
    4. Recommends technical and soft skills
    5. Provides specific ATS optimization suggestions
    
    Focus on:
    - Using action verbs and quantified results
    - Including relevant keywords from the job description
    - Highlighting transferable skills
    - Ensuring ATS compatibility
    - Matching the tone and requirements of the target role
    `

    let result
    let lastError

    // Try with primary model first (gemini-1.5-pro)
    try {
      result = await generateObject({
        model: google(AI_CONFIG.PRIMARY_MODEL),
        schema: resumeSchema,
        prompt,
      })
    } catch (error) {
      lastError = error
      console.warn("Primary model failed, trying fallback:", error)
      
      // If quota exceeded, try with lighter model
      if (isQuotaError(error)) {
        try {
          console.log(`Quota exceeded for ${AI_CONFIG.PRIMARY_MODEL}, trying ${AI_CONFIG.FALLBACK_MODEL}...`)
          result = await generateObject({
            model: google(AI_CONFIG.FALLBACK_MODEL),
            schema: resumeSchema,
            prompt,
          })
        } catch (fallbackError) {
          console.error("Fallback model also failed:", fallbackError)
          
          // If still quota issues, return helpful error
          if (isQuotaError(fallbackError)) {
            const retryDelay = getRetryDelay(fallbackError)
            return NextResponse.json({ 
              error: AI_CONFIG.QUOTA_ERROR_MESSAGE,
              retryAfter: Math.ceil(retryDelay / 1000), // seconds
              details: "The AI service is temporarily unavailable due to rate limits. Please wait a few minutes before trying again."
            }, { 
              status: 429,
              headers: {
                'Retry-After': Math.ceil(retryDelay / 1000).toString()
              }
            })
          }
          
          throw fallbackError
        }
      } else {
        throw error
      }
    }

    if (!result) {
      throw lastError
    }

    // Store the generated content in MongoDB
    await connectDB()

    const resumeGeneration = new ResumeGeneration({
      userId,
      originalData: resumeData,
      jobDescription,
      generatedContent: result.object,
    })

    await resumeGeneration.save()

    return NextResponse.json({ success: true, data: result.object })
  } catch (error) {
    console.error("Error generating resume:", error)
    
    // Handle quota errors specifically
    if (isQuotaError(error)) {
      const retryDelay = getRetryDelay(error)
      return NextResponse.json({ 
        error: AI_CONFIG.QUOTA_ERROR_MESSAGE,
        retryAfter: Math.ceil(retryDelay / 1000),
        details: "The AI service is temporarily unavailable due to rate limits. Please wait a few minutes before trying again."
      }, { 
        status: 429,
        headers: {
          'Retry-After': Math.ceil(retryDelay / 1000).toString()
        }
      })
    }
    
    // Handle other errors
    return NextResponse.json({ 
      error: AI_CONFIG.GENERAL_ERROR_MESSAGE,
      details: "An unexpected error occurred. Please try again."
    }, { status: 500 })
  }
}
