'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import TranscriptLine from './TranscriptLine';
import TranscriptSearch from './TranscriptSearch';

interface TranscriptItem {
  id: string | number;
  speaker: string;
  startTime?: number;
  start_time?: number;
  text: string;
}

interface TranscriptProps {
  data: TranscriptItem[];
  currentTime: number;
  onSeek: (time: number) => void;
}

export default function Transcript({ data, currentTime, onSeek }: TranscriptProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
  const activeLineRef = useRef<HTMLDivElement>(null);

  // Normalize items to ensure start_time is always computed
  const normalizedData = useMemo(() => {
    if (!data) return [];
    return data.map(item => ({
      ...item,
      computedStartTime: item.startTime ?? item.start_time ?? 0
    }));
  }, [data]);

  // Find the active transcript index based on currentTime
  const activeIndex = useMemo(() => {
    if (!normalizedData || normalizedData.length === 0) return -1;
    
    let index = -1;
    for (let i = 0; i < normalizedData.length; i++) {
      if (normalizedData[i].computedStartTime <= currentTime) {
        index = i;
      } else {
        break;
      }
    }
    return index;
  }, [normalizedData, currentTime]);

  // Auto-scroll to active line
  useEffect(() => {
    if (activeLineRef.current && !searchQuery) {
      activeLineRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
    }
  }, [activeIndex, searchQuery]);

  // Handle Search Filtering & Counting
  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return normalizedData;
    const query = searchQuery.toLowerCase();
    return normalizedData.filter(item => 
      item.text.toLowerCase().includes(query) || item.speaker.toLowerCase().includes(query)
    );
  }, [normalizedData, searchQuery]);

  const handleNextMatch = () => {
    setCurrentMatchIndex((prev) => (prev < filteredData.length - 1 ? prev + 1 : 0));
  };

  const handlePrevMatch = () => {
    setCurrentMatchIndex((prev) => (prev > 0 ? prev - 1 : filteredData.length - 1));
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
      <TranscriptSearch 
        searchQuery={searchQuery}
        setSearchQuery={(q) => {
          setSearchQuery(q);
          setCurrentMatchIndex(0);
        }}
        matchCount={filteredData.length}
        currentMatch={filteredData.length > 0 ? currentMatchIndex + 1 : 0}
        onNextMatch={handleNextMatch}
        onPrevMatch={handlePrevMatch}
      />

      <div className="flex-1 overflow-y-auto p-4 space-y-2 relative scroll-smooth">
        {filteredData.length > 0 ? (
          filteredData.map((item, index) => {
            const isActive = index === activeIndex && !searchQuery;
            return (
              <div key={item.id || index} ref={isActive ? activeLineRef : null}>
                <TranscriptLine
                  speaker={item.speaker}
                  startTime={item.computedStartTime}
                  text={item.text}
                  isActive={isActive}
                  searchQuery={searchQuery}
                  onClick={onSeek}
                />
              </div>
            );
          })
        ) : (
          <div className="py-20 text-center text-gray-500 text-sm flex flex-col items-center">
            <span className="text-3xl mb-3">🔍</span>
            No matches found for "{searchQuery}"
          </div>
        )}
      </div>
    </div>
  );
}