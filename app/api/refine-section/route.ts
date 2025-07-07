import { NextRequest, NextResponse } from 'next/server';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';

// Types for request/response
interface RefineSectionRequest {
  sectionType: string;
  sectionContent: string;
  chatHistory: { role: 'user' | 'ai'; content: string }[];
  userMessage: string;
}

export async function POST(req: NextRequest) {
  try {
    const { sectionType, sectionContent, chatHistory, userMessage } = (await req.json()) as RefineSectionRequest;

    // Prepare context: combine section content and chat history
    const context = `Section Type: ${sectionType}\nCurrent Content: ${sectionContent}`;
    const history = chatHistory.map(h => `${h.role === 'user' ? 'User' : 'AI'}: ${h.content}`).join('\n');

    // Use a plain string prompt
    const prompt = `You are an expert resume writer. Given the following resume section and chat history, respond to the user's request and return only the revised section content.

${context}

Chat History:
${history}

User: ${userMessage}

Please provide only the improved/revised content for the ${sectionType} section:`;

    // Set up Gemini model
    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      throw new Error('Google Generative AI API key not configured');
    }

    const model = new ChatGoogleGenerativeAI({
      model: 'gemini-pro',
      temperature: 0.7,
      maxOutputTokens: 512,
    });

    // Get response from the model
    const result = await model.invoke(prompt);

    // Update chat history
    const updatedHistory = [
      ...chatHistory,
      { role: 'user' as const, content: userMessage },
      { role: 'ai' as const, content: result.content as string },
    ];

    return NextResponse.json({
      revisedContent: result.content,
      chatHistory: updatedHistory,
    });
  } catch (error) {
    console.error('Refine section error:', error);
    return NextResponse.json(
      {
        error: 'Failed to refine section',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
