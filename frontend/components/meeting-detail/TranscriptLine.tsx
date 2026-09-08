'use client';

interface TranscriptLineProps {
  speaker: string;
  startTime?: number;
  start_time?: number;
  text: string;
  isActive: boolean;
  searchQuery?: string;
  onClick: (time: number) => void;
}

export default function TranscriptLine({
  speaker,
  startTime,
  start_time,
  text,
  isActive,
  searchQuery = '',
  onClick
}: TranscriptLineProps) {
  
  // Fallback between camelCase and snake_case properties
  const timeSeconds = startTime ?? start_time ?? 0;

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const renderText = () => {
    if (!searchQuery.trim()) return text;
    const parts = text.split(new RegExp(`(${searchQuery})`, 'gi'));
    return parts.map((part, i) => 
      part.toLowerCase() === searchQuery.toLowerCase() 
        ? <mark key={i} className="bg-yellow-200 text-gray-900 rounded-sm px-0.5">{part}</mark> 
        : part
    );
  };

  return (
    <div 
      onClick={() => onClick(timeSeconds)}
      className={`flex gap-4 p-3 rounded-xl cursor-pointer transition border border-transparent ${isActive ? 'bg-purple-50 border-purple-100' : 'hover:bg-gray-50'}`}
    >
      <div className="text-xs font-medium text-gray-400 min-w-[45px] pt-1 select-none">
        {formatTime(timeSeconds)}
      </div>
      <div>
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-md mb-1.5 inline-block select-none ${isActive ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'}`}>
          {speaker || 'Unknown Speaker'}
        </span>
        <p className={`text-sm leading-relaxed ${isActive ? 'text-gray-900' : 'text-gray-600'}`}>
          {renderText()}
        </p>
      </div>
    </div>
  );
}