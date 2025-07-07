import { NextRequest, NextResponse } from 'next/server';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { RunnableSequence } from '@langchain/core/runnables';
import { ChatPromptTemplate } from '@langchain/core/prompts';

// Define the expected input structure
type Experience = {
  title: string;
  company: string;
  startDate: string;
  endDate: string;
  description: string;
};

type ResumeInput = {
  name: string;
  experiences: Experience[];
  education: string;
  skills: string[];
  // Add more fields as needed
};

type JobDescriptionInput = {
  jobTitle: string;
  jobDescription: string;
};

export async function POST(req: NextRequest) {
  const { resume, job }: { resume: ResumeInput; job: JobDescriptionInput } = await req.json();

  // Compose the prompt for Gemini
  const prompt = ChatPromptTemplate.fromTemplate(`You are an expert resume writer and ATS optimization specialist. Given the following structured resume data and a job description, generate:\n1. ATS-optimized bullet points for each experience (max 3 per experience, focus on impact, skills, and relevance to the job).\n2. A personalized professional summary tailored to the job.\n\nFormat your response as:\n{\n  \"summary\": \"...\",\n  \"experiences\": [\n    { \"title\": \"...\", \"company\": \"...\", \"bullets\": [\"...\", \"...\", \"...\"] },\n    ...\n  ]\n}\n\nResume Data:\n{resume}\n\nJob Description:\n{job}\n`);

  // Set up Gemini via LangChain
  const model = new ChatGoogleGenerativeAI({
    apiKey: process.env.GOOGLE_API_KEY!,
    model: 'gemini-pro',
    temperature: 0.7,
    maxOutputTokens: 1024,
  });

  const chain = RunnableSequence.from([prompt, model]);
  const response = await chain.invoke({ resume, job });

  // Try to parse the output as JSON
  let result;
  try {
    result = typeof response === 'string' ? JSON.parse(response) : response;
  } catch (e) {
    result = { error: 'Failed to parse Gemini output', raw: response };
  }

  return NextResponse.json(result);
}
