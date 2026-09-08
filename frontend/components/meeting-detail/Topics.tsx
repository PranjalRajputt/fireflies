'use client';

import { ListTree } from 'lucide-react';

interface TopicItem {
  id?: string | number;
  title: string;
  timestamp?: number;
  time?: number;
  start_time?: number;
}

interface TopicsProps {
  topics: TopicItem[];
  onSeek: (time: number) => void;
}

export default function Topics({ topics, onSeek }: TopicsProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 flex flex-col h-full">
      <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
        <h3 className="font-semibold text-gray-900 flex items-center text-sm">
          <ListTree className="w-4 h-4 mr-2 text-purple-600" /> Outline & Chapters
        </h3>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3">
        {topics && topics.length > 0 ? (
          topics.map((topic, index) => {
            const timeSec = topic.timestamp ?? topic.time ?? topic.start_time ?? 0;
            return (
              <div
                key={topic.id || index}
                onClick={() => onSeek(timeSec)}
                className="flex items-center p-3 rounded-xl hover:bg-purple-50/60 cursor-pointer transition border border-transparent hover:border-purple-100 group"
              >
                <span className="text-xs font-medium text-gray-700 leading-snug group-hover:text-purple-700 transition">
                  {topic.title}
                </span>
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center h-40 text-gray-400 text-xs">
            <p>No topics extracted.</p>
          </div>
        )}
      </div>
    </div>
  );
} 