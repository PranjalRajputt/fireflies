'use client';
import { API_BASE_URL } from '@/lib/config';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Video, Calendar, Clock, Plus } from 'lucide-react';

export default function MeetingsPage() {
  const router = useRouter();
  const [meetings, setMeetings] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchMeetings() {
      try {
        const res = await fetch(`${API_BASE_URL}/api/meetings`);
        const data = await res.json();
        setMeetings(data);
      } catch (error) {
        console.error('Failed to fetch meetings', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchMeetings();
  }, []);

  const formatDuration = (seconds?: number) => {
    if (!seconds || seconds <= 0) return 'Custom';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}m ${secs > 0 ? `${secs}s` : ''}` : `${secs}s`;
  };

  const filteredMeetings = meetings.filter(m => 
    m.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-[1200px] mx-auto p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-1">Meetings Library</h1>
          <p className="text-sm text-gray-500">Browse all recorded meetings, transcripts, and summaries.</p>
        </div>
        <button 
          onClick={() => router.push('/meetings/new')}
          className="bg-purple-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-purple-700 transition flex items-center shadow-sm"
        >
          <Plus className="w-4 h-4 mr-2" /> New Meeting
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input 
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search meetings by title..."
          className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-purple-500 shadow-sm"
        />
      </div>

      {isLoading ? (
        <div className="text-center py-20 text-gray-400">Loading meetings...</div>
      ) : filteredMeetings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMeetings.map((meeting) => (
            <div 
              key={meeting.id}
              onClick={() => router.push(`/meetings/${meeting.id}`)}
              className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:border-purple-300 hover:shadow-md transition cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-4">
                  <Video className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1">{meeting.title}</h3>
                <p className="text-xs text-gray-500 line-clamp-2 mb-4">
                  {meeting.summary?.overview || meeting.summary || 'Click to view transcript, summary, and action items.'}
                </p>
              </div>

              <div className="border-t border-gray-100 pt-4 flex items-center justify-between text-xs text-gray-400">
                <span className="flex items-center">
                  <Clock className="w-3.5 h-3.5 mr-1" /> {formatDuration(meeting.duration_seconds)}
                </span>
                <span className="flex items-center">
                  <Calendar className="w-3.5 h-3.5 mr-1" /> {new Date(meeting.date || Date.now()).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white border border-gray-200 rounded-2xl">
          <p className="text-gray-500 text-sm">No meetings found.</p>
        </div>
      )}
    </div>
  );
}