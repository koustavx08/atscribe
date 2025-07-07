import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { RunnableSequence } from '@langchain/core/runnables';
import { PromptTemplate } from '@langchain/core/prompts';

// Prevent execution during build time
if (typeof window === 'undefined' && process.env.NODE_ENV === 'production' && !process.env.VERCEL) {
  // This is likely a build process, don't execute
}

// Types for extracted data
interface ExtractedData {
  name: string;
  headline: string;
  experience: string[];
  education: string[];
  skills: string[];
  rawText?: string;
}

// Constants
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const TIMEOUT_MS = 30000; // 30 seconds
const ALLOWED_FILE_TYPES = ['application/pdf'];

// Helper: Extract data from LinkedIn PDF
async function extractFromPDF(fileBuffer: Buffer): Promise<ExtractedData> {
  try {
    // Dynamic import to prevent build-time issues
    let pdfParse;
    try {
      pdfParse = (await import('pdf-parse')).default;
    } catch (importError) {
      console.error('Failed to import pdf-parse:', importError);
      throw new Error('PDF parsing functionality is not available');
    }
    
    const data = await pdfParse(fileBuffer);
    const text = data.text;
    // Enhanced extraction with better regex patterns
    const nameMatch = text.match(/(?:Name\s*:?\s*|^)([A-Z][a-z]+\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/i);
    const headlineMatch = text.match(/(?:Headline\s*:?\s*|Title\s*:?\s*)([^\n\r]+)/i);
    // Experience, Education, Skills extraction
    const experienceMatches = text.match(/Experience[\s\S]*?(?=Education|Skills|$)/i);
    const educationMatches = text.match(/Education[\s\S]*?(?=Skills|Experience|$)/i);
    const skillsMatches = text.match(/Skills[\s\S]*$/i);
    return {
      name: nameMatch ? nameMatch[1].trim() : '',
      headline: headlineMatch ? headlineMatch[1].trim() : '',
      experience: experienceMatches
        ? experienceMatches[0].replace(/Experience/i, '').trim().split(/\n+/).filter(Boolean)
        : [],
      education: educationMatches
        ? educationMatches[0].replace(/Education/i, '').trim().split(/\n+/).filter(Boolean)
        : [],
      skills: skillsMatches
        ? skillsMatches[0].replace(/Skills/i, '').trim().split(/,|\n/).map((s: string) => s.trim()).filter(Boolean)
        : [],
      rawText: text,
    };
  } catch (error) {
    console.error('PDF extraction error:', error);
    throw new Error('Failed to extract data from PDF');
  }
}

// Helper: Scrape LinkedIn public profile
async function scrapeLinkedInProfile(url: string): Promise<ExtractedData> {
  let browser: puppeteer.Browser | null = null;
  try {
    // Validate URL
    if (!/^https:\/\/(www\.)?linkedin\.com\//.test(url)) {
      throw new Error('Invalid LinkedIn URL');
    }
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      timeout: TIMEOUT_MS
    });
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: TIMEOUT_MS });
    await page.waitForTimeout(2000);
    let name = '';
    let headline = '';
    let experience: string[] = [];
    let education: string[] = [];
    let skills: string[] = [];
    try {
      name = await page.$eval('h1.text-heading-xlarge, h1.top-card-layout__title', el => el.textContent?.trim() || '');
    } catch {}
    try {
      headline = await page.$eval('.text-body-medium.break-words, .top-card-layout__headline', el => el.textContent?.trim() || '');
    } catch {}
    try {
      experience = await page.$$eval('section[data-section="experience"] .experience-item, #experience-section .pv-entity__summary-info', els => els.map(el => el.textContent?.trim() || '').filter(Boolean));
    } catch {}
    try {
      education = await page.$$eval('section[data-section="education"] .education-item, #education-section .pv-entity__degree-name', els => els.map(el => el.textContent?.trim() || '').filter(Boolean));
    } catch {}
    try {
      skills = await page.$$eval('section[data-section="skills"] .skill-category-entity__name, .pv-skill-category-entity__name span', els => els.map(el => el.textContent?.trim() || '').filter(Boolean));
    } catch {}
    return { name, headline, experience, education, skills };
  } catch (error) {
    console.error('LinkedIn scraping error:', error);
    throw new Error('Failed to scrape LinkedIn profile');
  } finally {
    if (browser) await browser.close();
  }
}

// Helper: Enhance data with AI
async function enhanceWithAI(extractedData: ExtractedData): Promise<any> {
  try {
    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      console.warn('Google Generative AI API key not configured, skipping AI enhancement');
      return {
        summary: extractedData.headline || 'Professional with diverse experience',
        enhancedExperience: extractedData.experience,
        keywords: extractedData.skills,
        suggestions: ['Consider adding more specific achievements', 'Quantify your impact where possible']
      };
    }
    
    const prompt = PromptTemplate.fromTemplate(`
You are an expert resume writer. Given the following LinkedIn profile data, generate:
1. An ATS-optimized professional summary (2-3 sentences)
2. Enhanced bullet points for each experience entry
3. Industry-relevant keywords
4. Suggestions for improvement

Profile Data:
Name: {name}
Headline: {headline}
Experience: {experience}
Education: {education}
Skills: {skills}

Please return the response in JSON format with the following structure:
{{
  "summary": "ATS-optimized professional summary",
  "enhancedExperience": ["bullet point 1", "bullet point 2", ...],
  "keywords": ["keyword1", "keyword2", ...],
  "suggestions": ["suggestion1", "suggestion2", ...]
}}
`);

    const model = new ChatGoogleGenerativeAI({ 
      model: 'gemini-pro', 
      maxOutputTokens: 2048,
      temperature: 0.7
    });
    
    const chain = RunnableSequence.from([prompt, model]);
    const result = await chain.invoke({
      name: extractedData.name,
      headline: extractedData.headline,
      experience: extractedData.experience.join(', '),
      education: extractedData.education.join(', '),
      skills: extractedData.skills.join(', ')
    });
    
    // Parse the JSON response from the AI
    try {
      const aiResponse = JSON.parse(result.content as string);
      return aiResponse;
    } catch (parseError) {
      // If JSON parsing fails, return the raw content with fallback structure
      return {
        summary: result.content || extractedData.headline || 'Professional with diverse experience',
        enhancedExperience: extractedData.experience,
        keywords: extractedData.skills,
        suggestions: ['Consider adding more specific achievements', 'Quantify your impact where possible'],
        rawAiResponse: result.content
      };
    }
  } catch (error) {
    console.error('AI enhancement error:', error);
    // Return fallback data instead of throwing
    return { 
      summary: extractedData.headline || 'Professional with diverse experience',
      enhancedExperience: extractedData.experience,
      keywords: extractedData.skills,
      suggestions: ['Consider adding more specific achievements', 'Quantify your impact where possible'],
      error: 'AI enhancement failed', 
      details: error instanceof Error ? error.message : String(error) 
    };
  }
}

export async function POST(req: NextRequest) {
  try {
    console.log('LinkedIn import POST request received');
    
    // Runtime check to prevent build-time execution
    if (typeof window !== 'undefined') {
      console.log('Window detected, rejecting request');
      return NextResponse.json(
        { error: 'This endpoint can only be called server-side' },
        { status: 400 }
      );
    }

    // Parse form data with error handling
    let formData: FormData;
    try {
      formData = await req.formData();
      console.log('Form data parsed successfully');
    } catch (parseError) {
      console.error('Failed to parse form data:', parseError);
      return NextResponse.json(
        { error: 'Invalid form data' },
        { status: 400 }
      );
    }

    const url = formData.get('url') as string | null;
    const file = formData.get('file') as File | null;
    
    console.log('Input validation:', { hasUrl: !!url, hasFile: !!file });
    
    // Validate input
    if (!url && !file) {
      return NextResponse.json(
        { error: 'Please provide either a LinkedIn URL or PDF file' },
        { status: 400 }
      );
    }
    
    // For now, return a simple success response to test basic functionality
    if (url) {
      console.log('Processing URL:', url);
      return NextResponse.json({
        success: true,
        extracted: {
          name: 'Test User',
          headline: 'Test Headline',
          experience: ['Test Experience'],
          education: ['Test Education'],
          skills: ['Test Skill']
        },
        aiEnhanced: {
          summary: 'Test summary from URL import',
          enhancedExperience: ['Enhanced test experience'],
          keywords: ['test', 'keyword'],
          suggestions: ['Test suggestion']
        }
      });
    }
    
    // File validation
    if (file) {
      console.log('Processing file:', { name: file.name, size: file.size, type: file.type });
      
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { error: `File size exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit` },
          { status: 400 }
        );
      }
      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        return NextResponse.json(
          { error: 'Only PDF files are allowed' },
          { status: 400 }
        );
      }
      
      // For now, return a simple success response for file uploads too
      return NextResponse.json({
        success: true,
        extracted: {
          name: 'Test User from PDF',
          headline: 'Test Headline from PDF',
          experience: ['Test Experience from PDF'],
          education: ['Test Education from PDF'],
          skills: ['Test Skill from PDF']
        },
        aiEnhanced: {
          summary: 'Test summary from PDF import',
          enhancedExperience: ['Enhanced test experience from PDF'],
          keywords: ['pdf', 'test', 'keyword'],
          suggestions: ['Test suggestion for PDF']
        }
      });
    }
    
    return NextResponse.json(
      { error: 'No valid input provided' },
      { status: 400 }
    );
  } catch (error) {
    console.error('LinkedIn import error:', error);
    return NextResponse.json(
      {
        error: 'Import failed',
        details: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

// Health check endpoint
export async function GET() {
  try {
    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      environment: {
        hasGoogleAI: !!process.env.GOOGLE_GENERATIVE_AI_API_KEY,
        nodeEnv: process.env.NODE_ENV
      }
    });
  } catch (error) {
    return NextResponse.json(
      { status: 'error', error: String(error) },
      { status: 500 }
    );
  }
}
