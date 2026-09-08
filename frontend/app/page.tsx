'use client';

import { useEffect, useState } from 'react';
import { fetchMeetings } from '@/lib/api';
import { MeetingListItem } from '@/types';
import { format } from 'date-fns';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useToast } from '@/context/ToastContext';
import { 
  Calendar, Upload, Plus, Settings, X, Sparkles, Monitor, Smartphone, 
  Mail, Lock, Globe, FileText, Eye, Users, Play, Zap, User 
} from 'lucide-react';

const AI_SKILLS = [
  { id: 'standups', name: 'Daily Standups', views: '206.7k', color: 'bg-purple-100 text-purple-500' },
  { id: 'interview', name: 'Interview Screening', views: '44.5k', color: 'bg-teal-100 text-teal-500' },
  { id: 'research', name: 'User Research', views: '49.2k', color: 'bg-orange-100 text-orange-500' },
];

export default function Home() {
  const router = useRouter();
  const { addToast } = useToast();
  
  const [meetings, setMeetings] = useState<MeetingListItem[]>([]);
  const [activeTab, setActiveTab] = useState<'recent' | 'upcoming' | 'ai_feed'>('recent');
  
  // Modals state
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [isCaptureOpen, setIsCaptureOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<typeof AI_SKILLS[0] | null>(null);
  
  // Interactive forms state
  const [captureLink, setCaptureLink] = useState('');
  const [enabledSkills, setEnabledSkills] = useState<string[]>([]);

  useEffect(() => {
    fetchMeetings().then(setMeetings).catch(console.error);
  }, []);

  const handleCaptureSubmit = () => {
    if (!captureLink.trim()) return;
    addToast('Bot invited! Joining your meeting shortly...', 'success');
    setIsCaptureOpen(false);
    setCaptureLink('');
  };

  const handleToggleSkill = (e: React.MouseEvent, skillId: string) => {
    e.stopPropagation();
    setEnabledSkills(prev => {
      const isEnabled = prev.includes(skillId);
      if (!isEnabled) {
        addToast('Skill is enabled to run for all future meetings', 'info');
        return [...prev, skillId];
      }
      return prev.filter(id => id !== skillId);
    });
  };

  return (
    <div className="max-w-[1000px] mx-auto p-8 relative">
      
      {/* Welcome Banner */}
      <div className="bg-[#fdf8f4] rounded-2xl p-8 flex items-center justify-between mb-10 shadow-sm border border-orange-100/50">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Welcome Aboard, Pranjal!</h1>
          <p className="text-gray-500 text-sm max-w-sm leading-relaxed">
            Fireflies is now ready to automate your meetings and streamline your workflows.
          </p>
        </div>
        <div className="hidden md:block w-64 h-32 bg-gradient-to-br from-indigo-900 via-purple-900 to-black rounded-xl shadow-lg border border-purple-700/30 flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
          <div className="w-12 h-12 bg-purple-600/80 rounded-full flex items-center justify-center backdrop-blur-sm shadow-xl z-10">
            <div className="w-0 h-0 border-t-8 border-t-transparent border-l-[14px] border-l-white border-b-8 border-b-transparent ml-1"></div>
          </div>
        </div>
      </div>

      {/* Quick Start */}
      <div className="mb-10">
        <h2 className="text-lg font-semibold text-gray-900 mb-1">Quick Start</h2>
        <p className="text-sm text-gray-500 mb-5">Capture your first meeting or upload a recording to see Fireflies in action.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            onClick={() => setIsScheduleOpen(true)}
            className="flex items-center justify-between p-4 bg-[#fdf5f8] border border-pink-100 rounded-xl hover:border-pink-200 transition group"
          >
            <div className="flex items-center text-pink-500 text-sm font-medium">
              <Calendar className="w-5 h-5 mr-3" /> Schedule Meeting
            </div>
            <span className="text-gray-300 group-hover:text-pink-400">›</span>
          </button>
          
          <button 
            onClick={() => router.push('/meetings/new')}
            className="flex items-center justify-between p-4 bg-[#f4fcf9] border border-teal-100 rounded-xl hover:border-teal-200 transition group"
          >
            <div className="flex items-center text-teal-500 text-sm font-medium">
              <Upload className="w-5 h-5 mr-3" /> Upload File
            </div>
            <span className="text-gray-300 group-hover:text-teal-400">›</span>
          </button>
          
          <button 
            onClick={() => setIsCaptureOpen(true)}
            className="flex items-center justify-between p-4 bg-[#f8f5fd] border border-purple-100 rounded-xl hover:border-purple-200 transition group"
          >
            <div className="flex items-center text-purple-500 text-sm font-medium">
              <Plus className="w-5 h-5 mr-3" /> Capture Meeting
            </div>
            <span className="text-gray-300 group-hover:text-purple-400">›</span>
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="mb-16">
        <div className="flex items-center justify-between border-b border-gray-200 pb-0 mb-4">
          <div className="flex space-x-2 bg-gray-100 p-1 rounded-lg text-sm font-medium">
            <button 
              onClick={() => setActiveTab('recent')}
              className={`px-4 py-1.5 rounded-md transition ${activeTab === 'recent' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Recent
            </button>
            <button 
              onClick={() => setActiveTab('upcoming')}
              className={`px-4 py-1.5 rounded-md transition ${activeTab === 'upcoming' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Upcoming
            </button>
            <button 
              onClick={() => setActiveTab('ai_feed')}
              className={`px-4 py-1.5 rounded-md transition ${activeTab === 'ai_feed' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              AI Feed
            </button>
          </div>
          <button 
            onClick={() => setIsSettingsOpen(true)}
            className="flex items-center text-sm text-gray-500 hover:text-gray-900 pb-3"
          >
            <Settings className="w-4 h-4 mr-2" /> Settings
          </button>
        </div>

        {/* Tab Content: Recent */}
        {activeTab === 'recent' && (
          <div className="space-y-2 mt-6">
            {meetings.map((meeting) => (
              <Link key={meeting.id} href={`/meetings/${meeting.id}`}>
                <div className="flex items-start p-4 hover:bg-gray-50 rounded-xl transition cursor-pointer">
                  <div className="w-9 h-9 rounded bg-pink-500 text-white flex items-center justify-center font-bold mr-4 shrink-0 mt-1 shadow-sm">
                    {meeting.title.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-[15px] font-medium text-gray-900">{meeting.title}</h3>
                    <p className="text-[13px] text-gray-500 mt-1">
                      {format(new Date(meeting.date), "EEE, MMM d yyyy, h:mm a")}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
            {meetings.length === 0 && <p className="text-gray-500 text-sm py-4">No recent meetings found.</p>}
          </div>
        )}

        {/* Tab Content: Upcoming */}
        {activeTab === 'upcoming' && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-64 bg-white border border-gray-100 rounded-xl shadow-sm p-4 flex items-center mb-6">
              <Calendar className="w-5 h-5 text-gray-400 mr-4" />
              <div className="space-y-2 flex-1">
                <div className="h-2.5 bg-gray-100 rounded w-full"></div>
                <div className="h-2.5 bg-gray-100 rounded w-2/3"></div>
              </div>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No upcoming meeting scheduled</h3>
            <p className="text-gray-500 text-sm mb-8 text-center max-w-sm">
              Schedule a meeting on your calendar or transcribe a live meeting.
            </p>
            <button 
              onClick={() => setIsCaptureOpen(true)}
              className="bg-purple-600 text-white px-20 py-2.5 rounded-lg text-sm font-medium hover:bg-purple-700 transition flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" /> Capture
            </button>
          </div>
        )}

        {/* Tab Content: AI Feed */}
        {activeTab === 'ai_feed' && (
          <div className="pt-8">
            <h3 className="text-center text-sm font-semibold text-gray-600 mb-6 flex items-center justify-center">
              Extract specific insights from your meetings <Sparkles className="w-4 h-4 ml-2 text-yellow-500" />
            </h3>
            
            <div className="bg-[#f2faf9] rounded-2xl p-6 border border-teal-50 max-w-2xl mx-auto">
              <div className="flex items-center text-teal-600 text-sm font-medium mb-4">
                <Sparkles className="w-4 h-4 mr-2" /> Recommended Skills
              </div>
              <div className="space-y-3">
                {AI_SKILLS.map((skill) => {
                  const isEnabled = enabledSkills.includes(skill.id);
                  return (
                    <div 
                      key={skill.id} 
                      onClick={() => setSelectedSkill(skill)}
                      className="bg-white rounded-xl p-4 flex items-center justify-between shadow-sm border border-gray-100 hover:border-teal-200 cursor-pointer transition group"
                    >
                      <div className="flex items-center">
                        <div className={`w-6 h-6 rounded flex items-center justify-center mr-3 font-bold text-lg ${skill.color}`}>✦</div>
                        <span className="font-medium text-gray-700 group-hover:text-purple-600 transition">{skill.name}</span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="text-gray-400 text-sm">⚡ {skill.views}</span>
                        <div 
                          onClick={(e) => handleToggleSkill(e, skill.id)}
                          className={`w-10 h-6 rounded-full flex items-center p-1 cursor-pointer transition-colors duration-200 ${isEnabled ? 'bg-purple-600' : 'bg-gray-200'}`}
                        >
                          <div className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform duration-200 ${isEnabled ? 'translate-x-4' : ''}`}></div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <button className="text-teal-600 text-sm font-medium mt-4 hover:underline">View All ›</button>
            </div>
          </div>
        )}
      </div>

      {/* Try More Section */}
      <div className="mb-10">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Try More</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border rounded-2xl p-6 shadow-sm flex flex-col items-start">
            <Monitor className="w-6 h-6 text-purple-400 mb-4" />
            <h3 className="font-semibold text-gray-900 mb-2">Desktop App</h3>
            <p className="text-sm text-gray-500 mb-6 flex-1">Capture conversations without any bot present in your meeting.</p>
            <button className="bg-purple-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition">
              Download
            </button>
          </div>
          <div className="bg-white border rounded-2xl p-6 shadow-sm flex flex-col items-start">
            <Smartphone className="w-6 h-6 text-pink-400 mb-4" />
            <h3 className="font-semibold text-gray-900 mb-2">Mobile App</h3>
            <p className="text-sm text-gray-500 mb-6 flex-1">Record in-person conversations and review meetings on the go.</p>
            <div className="flex space-x-2">
              <button className="p-2 border rounded-lg hover:bg-gray-50"><Monitor className="w-5 h-5 text-blue-500" /></button>
              <button className="p-2 border rounded-lg hover:bg-gray-50"><Smartphone className="w-5 h-5 text-green-500" /></button>
            </div>
          </div>
        </div>
      </div>

      {/* Schedule Meeting Modal */}
      {isScheduleOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b">
              <h2 className="font-semibold text-gray-900">Schedule Meeting</h2>
              <button onClick={() => setIsScheduleOpen(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-500 mb-6">Your AI Notetaker will be invited to the calendar meeting to record, transcribe and summarize.</p>
              <button className="w-full flex items-center justify-center px-4 py-3 border rounded-xl mb-3 hover:bg-gray-50 transition text-sm font-medium text-gray-700">
                <span className="w-5 h-5 mr-3 bg-blue-500 text-white rounded flex items-center justify-center text-xs">G</span> Google Calendar
              </button>
              <button className="w-full flex items-center justify-center px-4 py-3 border rounded-xl hover:bg-gray-50 transition text-sm font-medium text-gray-700">
                <span className="w-5 h-5 mr-3 bg-blue-600 text-white rounded flex items-center justify-center text-xs">M</span> Microsoft Outlook
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Capture Meeting Modal */}
      {isCaptureOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-semibold text-gray-900">Add to live meeting</h2>
              <button onClick={() => setIsCaptureOpen(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            
            <label className="block text-sm font-medium text-gray-700 mb-1">Name your meeting <span className="text-gray-400 font-normal">(Optional)</span></label>
            <input type="text" placeholder="E.g. Product team sync" className="w-full border rounded-lg px-4 py-2 mb-4 text-sm outline-none focus:ring-2 focus:ring-purple-500" />
            
            <label className="block text-sm font-medium text-gray-700 mb-1">Meeting link</label>
            <p className="text-xs text-gray-500 mb-2">Capture meetings from GMeet, Zoom, MS teams, and more.</p>
            <input 
              type="text" 
              value={captureLink}
              onChange={(e) => setCaptureLink(e.target.value)}
              placeholder="https://zoom.us/s/77277195107" 
              className="w-full border rounded-lg px-4 py-2 mb-4 text-sm outline-none focus:ring-2 focus:ring-purple-500" 
            />
            
            <label className="block text-sm font-medium text-gray-700 mb-1">Meeting language</label>
            <select className="w-full border rounded-lg px-4 py-2 mb-8 text-sm outline-none focus:ring-2 focus:ring-purple-500 bg-white">
              <option>English (Global)</option>
            </select>
            
            <div className="flex justify-end space-x-3">
              <button onClick={() => setIsCaptureOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg">Cancel</button>
              <button 
                onClick={handleCaptureSubmit}
                disabled={!captureLink.trim()}
                className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition ${captureLink.trim() ? 'bg-purple-600 hover:bg-purple-700' : 'bg-purple-200 cursor-not-allowed'}`}
              >
                Start Capturing
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Skill Management Modal */}
      {selectedSkill && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center backdrop-blur-sm">
          <div className="bg-white w-full max-w-4xl rounded-2xl shadow-xl overflow-hidden p-8 relative flex flex-col md:flex-row h-auto min-h-[500px]">
            <button onClick={() => setSelectedSkill(null)} className="absolute top-6 right-6 text-gray-300 hover:text-gray-500 z-10 transition"><X className="w-4 h-4" /></button>
            
            {/* Left Column */}
            <div className="w-full md:w-1/2 pr-8 border-r border-gray-100 flex flex-col">
              <div className="flex items-center mb-8">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-4 text-xl ${selectedSkill.color}`}>✦</div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">{selectedSkill.name}</h2>
                  <p className="text-sm text-gray-400">Management</p>
                </div>
              </div>

              <div className="space-y-6 flex-1">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">About</h3>
                  <p className="text-sm text-gray-700 leading-relaxed">Summarize and surface action items and blockers in your daily standup.</p>
                </div>
                
                <div className="space-y-4 pt-4">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-gray-400"><Calendar className="w-4 h-4 mr-3" /> Schedule</div>
                    <span className="text-gray-700 font-medium">Per Meeting</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-gray-400"><FileText className="w-4 h-4 mr-3" /> Output Type</div>
                    <span className="text-gray-700 font-medium">Text</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-gray-400"><Globe className="w-4 h-4 mr-3" /> Output Visibility</div>
                    <span className="text-gray-700 font-medium">Only me</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-gray-400"><Users className="w-4 h-4 mr-3" /> Run Skill on</div>
                    <span className="text-gray-700 font-medium">My meetings</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="w-full md:w-1/2 pl-8 flex flex-col relative">
              <div className="flex items-center justify-end space-x-4 mb-16">
                <div className="flex items-center text-xs text-gray-400 font-medium"><Zap className="w-3 h-3 mr-1" /> GPT: Basic</div>
                <div className="flex items-center text-xs text-gray-400 font-medium"><User className="w-3 h-3 mr-1" /> Only me</div>
                <div 
                  onClick={(e) => handleToggleSkill(e, selectedSkill.id)}
                  className={`w-10 h-6 rounded-full flex items-center p-1 cursor-pointer transition-colors ${enabledSkills.includes(selectedSkill.id) ? 'bg-purple-600' : 'bg-gray-200'}`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform ${enabledSkills.includes(selectedSkill.id) ? 'translate-x-4' : ''}`}></div>
                </div>
              </div>

              <div className="flex-1 flex flex-col items-center justify-center text-center">
                <Sparkles className="w-6 h-6 text-gray-300 mb-4" />
                <h3 className="text-gray-900 font-medium mb-1">Select a meeting to preview notes</h3>
                <p className="text-xs text-gray-400 mb-6 max-w-xs leading-relaxed">Refine your instructions based on the output.</p>
                <select className="w-64 border border-gray-200 rounded-lg px-4 py-2 mb-4 text-sm outline-none text-gray-400 bg-gray-50/50">
                  <option>Select a meeting</option>
                </select>
                <button className="flex items-center text-gray-300 text-sm font-medium cursor-not-allowed">
                  <Play className="w-4 h-4 mr-2 fill-current" /> Preview Notes
                </button>
              </div>

              <div className="flex justify-end space-x-3 mt-8">
                <button className="px-5 py-2 text-sm font-medium text-gray-500 hover:text-gray-700">Edit</button>
                <button onClick={() => setSelectedSkill(null)} className="px-5 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg shadow-sm">Done</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center backdrop-blur-sm">
          <div className="bg-white w-full max-w-[460px] rounded-2xl shadow-xl overflow-hidden p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-semibold text-gray-900">Meeting Settings</h2>
              <button onClick={() => setIsSettingsOpen(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between border border-purple-100 rounded-xl p-4">
                <div className="flex items-center text-sm font-medium text-gray-700">
                  <Sparkles className="w-4 h-4 text-teal-400 mr-3" /> Get unlimited transcripts <span className="text-teal-500 text-[10px] ml-2 font-bold uppercase tracking-wider">Free</span>
                </div>
                <div className="w-9 h-5 bg-purple-200 rounded-full flex items-center p-0.5 cursor-not-allowed opacity-70">
                  <div className="w-4 h-4 bg-white rounded-full shadow-sm"></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center text-sm font-medium text-gray-700">
                    <Calendar className="w-4 h-4 text-blue-500 mr-3" /> Auto-join calendar meetings
                  </div>
                  <div className="w-9 h-5 bg-purple-600 rounded-full flex items-center justify-end p-0.5 cursor-pointer">
                    <div className="w-4 h-4 bg-white rounded-full shadow-sm"></div>
                  </div>
                </div>
                <select className="w-[calc(100%-28px)] ml-7 border rounded-lg px-3 py-1.5 text-sm outline-none text-gray-600 bg-white">
                  <option>All meetings with web-conf link</option>
                </select>
              </div>

              <div>
                <div className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Mail className="w-4 h-4 text-purple-600 mr-3" /> Send email recap to
                </div>
                <select className="w-[calc(100%-28px)] ml-7 border rounded-lg px-3 py-1.5 text-sm outline-none text-gray-600 bg-white">
                  <option>Everyone on the invite</option>
                </select>
              </div>

              <div>
                <div className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Lock className="w-4 h-4 text-gray-400 mr-3" /> Meeting privacy
                </div>
                <select className="w-[calc(100%-28px)] ml-7 border rounded-lg px-3 py-1.5 text-sm outline-none text-gray-600 bg-white">
                  <option>Teammates & Anyone with Link</option>
                </select>
              </div>

              <div>
                <div className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Globe className="w-4 h-4 text-purple-600 mr-3" /> Meeting language
                </div>
                <select className="w-[calc(100%-28px)] ml-7 border rounded-lg px-3 py-1.5 text-sm outline-none text-gray-600 bg-white">
                  <option>English (Global)</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-8">
              <button onClick={() => setIsSettingsOpen(false)} className="px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg">Cancel</button>
              <button onClick={() => setIsSettingsOpen(false)} className="px-5 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}