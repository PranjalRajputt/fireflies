'use client';

import { Search, X, ChevronUp, ChevronDown } from 'lucide-react';

interface TranscriptSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  matchCount?: number;
  currentMatch?: number;
  onNextMatch?: () => void;
  onPrevMatch?: () => void;
}

export default function TranscriptSearch({
  searchQuery,
  setSearchQuery,
  matchCount = 0,
  currentMatch = 0,
  onNextMatch,
  onPrevMatch
}: TranscriptSearchProps) {
  return (
    <div className="sticky top-0 bg-white/90 backdrop-blur-md border-b border-gray-100 p-4 z-10 flex items-center justify-between">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input 
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search transcript..."
          className="w-full pl-9 pr-8 py-2 bg-gray-50/50 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-purple-500 transition shadow-sm"
        />
        {searchQuery && (
          <button 
            onClick={() => setSearchQuery('')} 
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Show match navigation only if there is a query and matches exist */}
      {searchQuery && matchCount > 0 && (
        <div className="flex items-center space-x-3 ml-4 animate-in fade-in zoom-in-95">
          <span className="text-xs text-gray-500 font-medium">
            {currentMatch} / {matchCount}
          </span>
          <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
            <button 
              onClick={onPrevMatch} 
              className="p-1.5 hover:bg-gray-50 border-r border-gray-200 text-gray-500 transition"
            >
              <ChevronUp className="w-4 h-4" />
            </button>
            <button 
              onClick={onNextMatch} 
              className="p-1.5 hover:bg-gray-50 text-gray-500 transition"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}