'use client';
import { API_BASE_URL } from '@/lib/config';
import { useState, useRef, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Share2, Download, Trash2, Edit2, Check, X, FileText, Sparkles, CheckSquare } from 'lucide-react';
import MediaPlayer from '@/components/meeting-detail/MediaPlayer';
import Transcript from '@/components/meeting-detail/Transcript';
import Summary from '@/components/meeting-detail/Summary';
import Topics from '@/components/meeting-detail/Topics';
import ActionItems from '@/components/meeting-detail/ActionItems';
import { updateMeeting, deleteMeeting } from '@/lib/api';
import { useToast } from '@/context/ToastContext';

export default function MeetingDetail() {
  const router = useRouter();
  const params = useParams();
  const meetingId = params.id;
  const { addToast } = useToast();
  
  const [activeTab, setActiveTab] = useState<'transcript' | 'summary' | 'action_items'>('transcript');
  const [currentTime, setCurrentTime] = useState(0);
  const [meetingData, setMeetingData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [newTitle, setNewTitle] = useState('');

  const mediaRef = useRef<any>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchMeeting() {
      try {
        const res = await fetch(`${API_BASE_URL}/api/meetings/${meetingId}`);
        if (!res.ok) throw new Error('Meeting not found');
        const data = await res.json();
        if (isMounted && !isDeleting) {
          setMeetingData(data);
          setNewTitle(data.title);
        }
      } catch (error) {
        if (isMounted && !isDeleting) {
          console.error(error);
          addToast('Failed to load meeting from server', 'error');
        }
      } finally {
        if (isMounted && !isDeleting) {
          setIsLoading(false);
        }
      }
    }

    if (meetingId) fetchMeeting();

    return () => {
      isMounted = false;
    };
  }, [meetingId, isDeleting, addToast]);

  const handleSeek = (time: number) => {
    setCurrentTime(time);
    if (mediaRef.current) {
      try {
        mediaRef.current.currentTime = time;
      } catch (e) {}
      if (typeof mediaRef.current.pause === 'function') {
        mediaRef.current.pause();
      }
    }
  };

  const handleUpdateTitle = async () => {
    if (!newTitle.trim()) return;
    try {
      await updateMeeting(meetingId as string, { title: newTitle.trim() });
      setMeetingData({ ...meetingData, title: newTitle.trim() });
      setIsEditingTitle(false);
      addToast('Meeting title updated successfully', 'success');
    } catch (error) {
      addToast('Failed to update title', 'error');
    }
  };

  const handleDeleteMeeting = async () => {
    if (!confirm('Are you sure you want to delete this meeting?')) return;
    setIsDeleting(true);
    try {
      await deleteMeeting(meetingId as string);
      addToast('Meeting deleted successfully', 'success');
      router.push('/meetings');
    } catch (error) {
      setIsDeleting(false);
      addToast('Failed to delete meeting', 'error');
    }
  };

  const handleAction = (action: string) => {
    addToast(`${action} triggered`, 'info');
  };

  const handleDownload = () => {
    try {
      window.open(`${API_BASE_URL}/api/meetings/${meetingId}/export?format=pdf`, '_blank');
      addToast('Downloading meeting PDF...', 'success');
    } catch (error) {
      addToast('Failed to download meeting report', 'error');
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!meetingData) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-white">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">Meeting not found</h2>
        <button onClick={() => router.push('/meetings')} className="text-purple-600 text-sm hover:underline">Return to meetings list</button>
      </div>
    );
  }

  const transcriptSegments = meetingData.segments || meetingData.transcript || [];
  
  const maxSegmentTime = transcriptSegments.reduce((max: number, s: any) => Math.max(max, s.end_time || s.start_time || 0), 0);
  const effectiveDuration = meetingData.duration_seconds && meetingData.duration_seconds > 10 
    ? meetingData.duration_seconds 
    : (maxSegmentTime > 0 ? Math.ceil(maxSegmentTime) : 300);

  const summaryText = 
    typeof meetingData.summary === 'object' && meetingData.summary !== null
      ? meetingData.summary.overview || meetingData.summary.text || ''
      : meetingData.summary || 'No summary available for this upload.';

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-gray-50/30 text-gray-900">
      
      <div className="bg-white border-b border-gray-200 px-6 py-4 shrink-0 flex items-center justify-between z-10 shadow-sm">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => router.push('/meetings')}
            className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          
          <div className="flex items-center space-x-3">
            {isEditingTitle ? (
              <div className="flex items-center space-x-2">
                <input 
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="px-3 py-1 border border-gray-300 bg-white text-gray-900 rounded-lg text-lg font-semibold outline-none focus:ring-2 focus:ring-purple-500"
                  autoFocus
                />
                <button onClick={handleUpdateTitle} className="p-1.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                  <Check className="w-4 h-4" />
                </button>
                <button onClick={() => setIsEditingTitle(false)} className="p-1.5 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2 group">
                <h1 className="text-xl font-semibold text-gray-900">{meetingData.title}</h1>
                <button 
                  onClick={() => setIsEditingTitle(true)}
                  className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-purple-600 transition"
                  title="Edit title"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <button onClick={() => handleAction('Share')} className="hidden md:flex items-center px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition shadow-sm">
            <Share2 className="w-4 h-4 mr-2" /> Share
          </button>
          <button onClick={handleDownload} className="p-2 border border-gray-200 bg-white rounded-lg text-gray-500 hover:bg-gray-50 transition shadow-sm" title="Download PDF Report">
            <Download className="w-4 h-4" />
          </button>
          <button onClick={handleDeleteMeeting} disabled={isDeleting} className="p-2 border border-red-200 bg-white text-red-500 rounded-lg hover:bg-red-50 transition shadow-sm disabled:opacity-50" title="Delete meeting">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden p-6">
        <div className="max-w-[1400px] mx-auto h-full grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          <div className="lg:col-span-4 flex flex-col space-y-6 h-full overflow-y-auto pr-2 pb-6">
            <MediaPlayer 
              ref={mediaRef}
              src={meetingData.media_url || '/sample-media/sample-meeting.mp4'} 
              title={meetingData.title}
              durationSeconds={effectiveDuration}
              currentTime={currentTime}
              onTimeUpdate={setCurrentTime} 
            />
            
            <div className="flex-1 min-h-[300px]">
              <Topics topics={meetingData.topics || []} onSeek={handleSeek} />
            </div>
          </div>

          <div className="lg:col-span-8 flex flex-col h-full bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
            
            <div className="flex px-4 pt-4 border-b border-gray-100 bg-gray-50/50 shrink-0 space-x-2">
              <button 
                onClick={() => setActiveTab('transcript')}
                className={`flex items-center px-5 py-3 text-sm font-medium rounded-t-xl transition-colors ${activeTab === 'transcript' ? 'bg-white text-purple-700 border-t border-l border-r border-gray-200' : 'text-gray-500 hover:bg-gray-100'}`}
              >
                <FileText className="w-4 h-4 mr-2" /> Transcript ({transcriptSegments.length})
              </button>
              <button 
                onClick={() => setActiveTab('summary')}
                className={`flex items-center px-5 py-3 text-sm font-medium rounded-t-xl transition-colors ${activeTab === 'summary' ? 'bg-white text-purple-700 border-t border-l border-r border-gray-200' : 'text-gray-500 hover:bg-gray-100'}`}
              >
                <Sparkles className="w-4 h-4 mr-2" /> AI Summary
              </button>
              <button 
                onClick={() => setActiveTab('action_items')}
                className={`flex items-center px-5 py-3 text-sm font-medium rounded-t-xl transition-colors ${activeTab === 'action_items' ? 'bg-white text-purple-700 border-t border-l border-r border-gray-200' : 'text-gray-500 hover:bg-gray-100'}`}
              >
                <CheckSquare className="w-4 h-4 mr-2" /> Action Items
              </button>
            </div>

            <div className="flex-1 overflow-hidden bg-white p-4">
              {activeTab === 'transcript' && (
                <Transcript 
                  data={transcriptSegments} 
                  currentTime={currentTime} 
                  onSeek={handleSeek} 
                />
              )}
              
              {activeTab === 'summary' && (
                <Summary content={summaryText} />
              )}
              
              {activeTab === 'action_items' && (
                <ActionItems initialItems={meetingData.action_items || []} />
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}