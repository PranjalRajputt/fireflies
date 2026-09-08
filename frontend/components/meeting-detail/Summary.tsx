'use client';

import { Sparkles, FileText } from 'lucide-react';

interface SummaryProps {
  content: any;
}

export default function Summary({ content }: SummaryProps) {
  // Extract text safely and handle empty strings from the backend
  let textContent = '';
  if (typeof content === 'object' && content !== null) {
    textContent = content.overview || content.text || '';
  } else {
    textContent = content || '';
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden h-full flex flex-col">
      <div className="border-b border-gray-100 p-4 bg-gray-50/50 flex items-center justify-between">
        <h3 className="font-semibold text-gray-900 flex items-center">
          <Sparkles className="w-4 h-4 mr-2 text-purple-600" /> AI Summary
        </h3>
        <button className="text-xs text-purple-600 font-medium hover:underline">Copy</button>
      </div>
      <div className="p-6 overflow-y-auto flex-1 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
        {textContent.trim() ? (
          textContent
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 py-12">
            <FileText className="w-8 h-8 mb-2 opacity-50" />
            <p>No summary generated for this upload yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}