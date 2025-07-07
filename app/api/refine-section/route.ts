import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@langchain/google-genai';
import { ConversationalRetrievalChain } from 'langchain/chains';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import { ChatPromptTemplate } from 'langchain/prompts';

// Types for request/response
interface RefineSectionRequest {
  sectionType: string;
  sectionContent: string;
  chatHistory: { role: 'user' | 'ai'; content: string }[];
  userMessage: string;
}

export async function POST(req: NextRequest) {
  const { sectionType, sectionContent, chatHistory, userMessage } = (await req.json()) as RefineSectionRequest;

  // Prepare context: combine section content and chat history
  const context = `Section Type: ${sectionType}\nCurrent Content: ${sectionContent}`;
  const history = chatHistory.map(h => `${h.role === 'user' ? 'User' : 'AI'}: ${h.content}`).join('\n');

  // Prompt template
  const prompt = ChatPromptTemplate.fromTemplate(`You are an expert resume writer. Given the following resume section and chat history, respond to the user's request and return only the revised section content.\n\n{context}\n\nChat History:\n{history}\n\nUser: {userMessage}\nAI:`);

  // Set up Gemini model
  const model = new GoogleGenerativeAI({
    apiKey: process.env.GOOGLE_API_KEY!,
    model: 'gemini-pro',
    temperature: 0.7,
    maxOutputTokens: 512,
  });

  // Use a simple in-memory vector store for context (can be replaced with Supabase)
  const vectorStore = new MemoryVectorStore();
  await vectorStore.addDocuments([{ pageContent: sectionContent, metadata: { sectionType } }]);

  // Set up ConversationalRetrievalChain
  const chain = ConversationalRetrievalChain.fromLLM(model, vectorStore.asRetriever(), {
    prompt,
    returnSourceDocuments: false,
  });

  // Run the chain
  const result = await chain.call({
    question: userMessage,
    chat_history: history,
    context,
  });

  // Update chat history
  const updatedHistory = [
    ...chatHistory,
    { role: 'user', content: userMessage },
    { role: 'ai', content: result.text },
  ];

  return NextResponse.json({
    revisedContent: result.text,
    chatHistory: updatedHistory,
  });
}
