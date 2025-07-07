import React, { useState } from 'react';

export interface ChatMessage {
  role: 'user' | 'ai';
  content: string;
}

interface ResumeSectionChatProps {
  sectionType: string;
  sectionContent: string;
  onUpdate: (newContent: string, chatHistory: ChatMessage[]) => void;
  initialChatHistory?: ChatMessage[];
}

export const ResumeSectionChat: React.FC<ResumeSectionChatProps> = ({
  sectionType,
  sectionContent,
  onUpdate,
  initialChatHistory = [],
}) => {
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>(initialChatHistory);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    setLoading(true);
    const res = await fetch('/api/refine-section', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sectionType,
        sectionContent,
        chatHistory,
        userMessage: input,
      }),
    });
    const data = await res.json();
    setChatHistory(data.chatHistory);
    onUpdate(data.revisedContent, data.chatHistory);
    setInput('');
    setLoading(false);
  };

  return (
    <div className="border rounded p-4 bg-white shadow">
      <div className="mb-2 font-semibold">Refine this section</div>
      <div className="h-40 overflow-y-auto bg-gray-50 p-2 mb-2 rounded">
        {chatHistory.length === 0 && <div className="text-gray-400">Start a conversation to refine this section.</div>}
        {chatHistory.map((msg, i) => (
          <div key={i} className={msg.role === 'user' ? 'text-right' : 'text-left'}>
            <span className={msg.role === 'user' ? 'bg-blue-100' : 'bg-green-100'} style={{ borderRadius: 8, padding: 4, display: 'inline-block', margin: 2 }}>
              <b>{msg.role === 'user' ? 'You' : 'AI'}:</b> {msg.content}
            </span>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          className="flex-1 border rounded px-2 py-1"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="E.g. Make this more concise"
          disabled={loading}
          onKeyDown={e => { if (e.key === 'Enter') sendMessage(); }}
        />
        <button
          className="bg-blue-600 text-white px-4 py-1 rounded disabled:opacity-50"
          onClick={sendMessage}
          disabled={loading || !input.trim()}
        >
          Send
        </button>
      </div>
    </div>
  );
};
