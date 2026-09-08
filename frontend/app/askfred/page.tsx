'use client';

import { useState } from 'react';
import { Plus, Search, Layers, Sparkles, Send, Mic, ArrowUp, Bot, MessageSquare } from 'lucide-react';
import { useToast } from '@/context/ToastContext';

export default function AskFredPage() {
  const { addToast } = useToast();
  const [input, setInput] = useState('');
  const [chats, setChats] = useState<string[]>([]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    setChats(prev => [input, ...prev]);
    setInput('');
    addToast("AskFred LLM integration is mocked as a 'Coming Soon' placeholder.", "info");
  };

  const handlePromptClick = (promptText: string) => {
    setChats(prev => [promptText, ...prev]);
    addToast("AskFred LLM integration is mocked as a 'Coming Soon' placeholder.", "info");
  };

  return (
    <div className="flex h-[calc(100vh-64px)] bg-white overflow-hidden">
      
      {/* AskFred Sidebar */}
      <div className="w-64 border-r bg-[#fbfbfa] flex flex-col p-4">
        <button 
          onClick={() => addToast("New Chat session initialized", "success")}
          className="flex items-center justify-center w-full bg-purple-600 text-white rounded-xl py-2.5 px-4 text-sm font-medium hover:bg-purple-700 transition shadow-sm mb-6"
        >
          <Plus className="w-4 h-4 mr-2" /> New Chat
        </button>

        <div className="space-y-1 text-sm font-medium text-gray-600 mb-6">
          <button className="w-full flex items-center px-3 py-2 rounded-lg hover:bg-gray-100 transition text-left">
            <Search className="w-4 h-4 mr-3 text-gray-400" /> Search
          </button>
          <button className="w-full flex items-center px-3 py-2 rounded-lg hover:bg-gray-100 transition text-left">
            <Layers className="w-4 h-4 mr-3 text-gray-400" /> Connectors
          </button>
        </div>

        <div className="mt-auto border-t pt-4">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">No chats yet</div>
          <p className="text-xs text-gray-400 leading-relaxed">
            Your chats will appear here once you start one.
          </p>
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="flex-1 flex flex-col items-center justify-between p-8 overflow-y-auto relative">
        
        <div className="w-full max-w-2xl mx-auto pt-12 flex flex-col items-center">
          <h1 className="text-2xl font-semibold text-gray-900 mb-8">
            Hi Pranjal, how can I help today?
          </h1>

          {/* Input Box */}
          <form onSubmit={handleSend} className="w-full bg-white border border-purple-200 rounded-2xl shadow-lg p-4 focus-within:ring-2 focus-within:ring-purple-100 transition mb-8">
            <textarea
              rows={3}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything, @ for context and / for skills"
              className="w-full border-none outline-none resize-none text-sm text-gray-700 placeholder-gray-400"
            />
            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <div className="flex items-center space-x-3 text-gray-400">
                <button type="button" className="hover:text-gray-600 p-1"><Plus className="w-4 h-4" /></button>
                <button type="button" className="hover:text-gray-600 p-1"><Sparkles className="w-4 h-4" /></button>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded border">Auto</span>
                <button type="button" className="text-gray-400 hover:text-gray-600 p-1"><Mic className="w-4 h-4" /></button>
                <button 
                  type="submit" 
                  className="w-7 h-7 bg-purple-600 text-white rounded-lg flex items-center justify-center hover:bg-purple-700 transition"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
              </div>
            </div>
          </form>

          {/* MCP Integration Banner */}
          <div className="flex items-center justify-center space-x-2 text-xs text-gray-500 bg-gray-50 border border-gray-100 px-4 py-2 rounded-full mb-10">
            <span>⚡ Bring context from 100+ apps with custom MCP</span>
            <button className="text-purple-600 font-medium hover:underline">+ Add</button>
          </div>

          {/* Prompt Suggestions */}
          <div className="w-full space-y-3">
            {[
              "List my action items & todos for this week",
              "Summarize my last meeting",
              "Prepare me for the upcoming meeting",
              "Connect Gmail, Notion, and 30+ sources for richer insights.",
              "Prepare weekly digest, based on my meetings"
            ].map((prompt, idx) => (
              <div 
                key={idx}
                onClick={() => handlePromptClick(prompt)}
                className="flex items-center p-3 bg-white border border-gray-100 rounded-xl hover:border-purple-200 hover:shadow-sm cursor-pointer transition text-sm text-gray-700"
              >
                <MessageSquare className="w-4 h-4 text-purple-500 mr-3 shrink-0" />
                <span>{prompt}</span>
              </div>
            ))}
          </div>

          {/* Active Chat History Mock */}
          {chats.length > 0 && (
            <div className="w-full mt-8 space-y-4">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Recent Activity (Placeholder)</h3>
              {chats.map((chat, idx) => (
                <div key={idx} className="bg-purple-50 border border-purple-100 rounded-xl p-4 text-sm text-gray-800">
                  <p className="font-semibold text-purple-900 mb-1">You asked:</p>
                  <p className="mb-3">{chat}</p>
                  <p className="font-semibold text-purple-900 mb-1">AskFred (Coming Soon):</p>
                  <p className="text-gray-600 text-xs italic">
                    Real-time LLM query generation is mocked for this clone assignment. Core meeting transcript search and action items are fully functional in the Meetings library!
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="text-xs text-gray-400 pb-2">
          Consumes AI credits
        </div>
      </div>
    </div>
  );
}