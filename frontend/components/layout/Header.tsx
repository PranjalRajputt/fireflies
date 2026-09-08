'use client';

import { useState, useRef, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Search, Bell, Video, ChevronDown, Calendar, Upload, Mic, 
  MessageSquare, ShieldCheck, Mail, X, Link2, Download
} from 'lucide-react';
import { useToast } from '@/context/ToastContext';

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { addToast } = useToast();

  // State
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isCaptureDropdownOpen, setIsCaptureDropdownOpen] = useState(false);
  const [isCaptureModalOpen, setIsCaptureModalOpen] = useState(false);
  const [captureLink, setCaptureLink] = useState('');
  const [notifTab, setNotifTab] = useState('New');

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Refs for click-outside detection
  const notifRef = useRef<HTMLDivElement>(null);
  const captureDropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  // Dynamic Title based on route
  const getPageTitle = () => {
    if (pathname === '/') return 'Home';
    const path = pathname.split('/')[1];
    return path.charAt(0).toUpperCase() + path.slice(1).replace('-', ' ');
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotifOpen(false);
      }
      if (captureDropdownRef.current && !captureDropdownRef.current.contains(e.target as Node)) {
        setIsCaptureDropdownOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Fetch live search results from backend
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!searchQuery.trim()) {
        setSearchResults([]);
        setIsSearchOpen(false);
        return;
      }

      try {
        const res = await fetch(`http://localhost:8000/api/meetings?search=${encodeURIComponent(searchQuery)}`);
        if (res.ok) {
          const data = await res.json();
          setSearchResults(Array.isArray(data) ? data : data.meetings || []);
          setIsSearchOpen(true);
        }
      } catch (err) {
        console.error('Search error:', err);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSelectMeeting = (id: string) => {
    setIsSearchOpen(false);
    setSearchQuery('');
    router.push(`/meetings/${id}`);
  };

  const handleCaptureSubmit = () => {
    if (!captureLink.trim()) return;
    addToast('Bot invited! Joining your meeting shortly...', 'success');
    setIsCaptureModalOpen(false);
    setCaptureLink('');
  };

  const handleMockAction = (action: string) => {
    setIsNotifOpen(false);
    setIsCaptureDropdownOpen(false);
    addToast(`${action} action triggered`, 'info');
  };

  return (
    <header className="h-16 border-b border-gray-200 bg-white flex items-center justify-between px-6 sticky top-0 z-30">
      
      {/* Left: Breadcrumb/Title */}
      <div className="flex-1 hidden md:block">
        <h1 className="text-sm font-medium text-gray-700">{getPageTitle()}</h1>
      </div>

      {/* Middle: Functional Global Search */}
      <div className="flex-1 flex justify-center w-full md:w-auto" ref={searchRef}>
        <div className="relative w-full max-w-lg">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => { if (searchResults.length > 0) setIsSearchOpen(true); }}
            placeholder="Search by title or keyword (Ctrl + K)" 
            className="w-full pl-9 pr-4 py-2 bg-gray-50/50 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-purple-500 transition shadow-sm"
          />

          {/* Search Results Dropdown */}
          {isSearchOpen && searchResults.length > 0 && (
            <div className="absolute left-0 right-0 mt-2 bg-white rounded-xl border border-gray-200 shadow-xl overflow-hidden z-50 max-h-80 overflow-y-auto">
              <div className="p-2 text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-100">
                Matching Meetings ({searchResults.length})
              </div>
              {searchResults.map((meeting) => (
                <div
                  key={meeting.id}
                  onClick={() => handleSelectMeeting(meeting.id)}
                  className="flex items-center px-4 py-3 hover:bg-purple-50 cursor-pointer transition border-b border-gray-50 last:border-none"
                >
                  <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs mr-3 shrink-0">
                    <Video className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-900 truncate">{meeting.title}</h4>
                    <p className="text-xs text-gray-400 flex items-center mt-0.5">
                      <Calendar className="w-3 h-3 mr-1" />
                      {meeting.date ? new Date(meeting.date).toLocaleDateString() : 'Recent'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex-1 flex justify-end items-center space-x-4">
        
        <div className="hidden lg:flex items-center space-x-3">
          <span className="flex items-center text-xs font-semibold text-green-700 bg-green-50 px-2 py-1 rounded-md border border-green-100">
            <span className="w-3 h-3 bg-green-500 text-white rounded flex items-center justify-center text-[8px] mr-1">3</span>
            Free meetings
          </span>
          
          <button 
            onClick={() => router.push('/upgrade')}
            className="text-xs font-semibold text-green-700 bg-green-50 hover:bg-green-100 border border-green-200 px-3 py-1.5 rounded-lg transition"
          >
            Upgrade
          </button>
        </div>

        {/* Notification Bell Dropdown */}
        <div className="relative" ref={notifRef}>
          <button 
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition relative"
          >
            <Bell className="w-5 h-5" />
            <div className="absolute top-1 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></div>
          </button>

          {isNotifOpen && (
            <div className="absolute right-0 top-full mt-3 w-[420px] bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-top-2">
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center justify-between text-xs font-medium">
                  <div className="flex space-x-4">
                    {['All', 'Updates', 'Auto-Fill', 'Status', 'New'].map(tab => (
                      <button 
                        key={tab} 
                        onClick={() => setNotifTab(tab)}
                        className={`${notifTab === tab ? 'text-green-600 bg-green-50 px-2 py-0.5 rounded' : 'text-gray-500 hover:text-gray-900'}`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                  <label className="flex items-center space-x-2 text-gray-400 cursor-pointer">
                    <input type="checkbox" className="rounded text-purple-600 focus:ring-purple-500" />
                    <span>Unread</span>
                  </label>
                </div>
              </div>

              <div className="max-h-[400px] overflow-y-auto">
                <div className="p-4 space-y-6">
                  {/* Slack Recap */}
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center shrink-0">
                      <MessageSquare className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h4 className="text-sm font-semibold text-gray-900 mb-1">Your Slack recaps, your way</h4>
                        <span className="text-[10px] text-gray-400 mt-0.5">03:18 AM</span>
                      </div>
                      <p className="text-xs text-gray-500 mb-3 leading-relaxed">Pick what Fireflies sends to Slack after every call.</p>
                      <button className="bg-purple-600 text-white text-xs font-semibold px-4 py-1.5 rounded-lg shadow-sm hover:bg-purple-700 transition">See How It Works</button>
                    </div>
                  </div>

                  {/* Voice Agent */}
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center shrink-0">
                      <Mic className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h4 className="text-sm font-semibold text-gray-900 mb-1">Stop taking the same call twice</h4>
                        <span className="text-[10px] text-gray-400 mt-0.5">03:18 AM</span>
                      </div>
                      <p className="text-xs text-gray-500 mb-3 leading-relaxed">Fireflies Voice Agents can run it for you instead, automatically. Get 100 free credits to try it.</p>
                      <button className="bg-purple-600 text-white text-xs font-semibold px-4 py-1.5 rounded-lg shadow-sm hover:bg-purple-700 transition">Try now</button>
                    </div>
                  </div>

                  {/* Trust Webinar */}
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h4 className="text-sm font-semibold text-gray-900 mb-1">Trust and privacy webinar</h4>
                        <span className="text-[10px] text-gray-400 mt-0.5">03:18 AM</span>
                      </div>
                      <p className="text-xs text-gray-500 mb-3 leading-relaxed">Tomorrow, Aug 25, 2 PM UTC. Privacy, proven live.</p>
                      <button className="bg-purple-600 text-white text-xs font-semibold px-4 py-1.5 rounded-lg shadow-sm hover:bg-purple-700 transition">Save Your Spot</button>
                    </div>
                  </div>

                  {/* Email Assistant Webinar */}
                  <div className="flex items-start space-x-4 opacity-70">
                    <div className="w-10 h-10 border border-gray-200 rounded-xl flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5 text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h4 className="text-sm font-semibold text-gray-900">Email Assistant webinar</h4>
                        <span className="text-[10px] text-gray-400">03:18 AM</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Banner */}
                <div className="m-4 bg-gradient-to-r from-gray-900 to-black rounded-xl p-4 flex items-center justify-between text-white cursor-pointer hover:opacity-90 transition">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center font-bold text-sm shadow-sm">F</div>
                    <div>
                      <h4 className="text-sm font-semibold mb-0.5">Fireflies Desktop App</h4>
                      <p className="text-[11px] text-gray-300">Capture conversations without a bot.</p>
                    </div>
                  </div>
                  <div className="flex items-center text-xs font-medium bg-white/10 px-3 py-1.5 rounded-lg">
                    Download <Download className="w-3 h-3 ml-2" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Capture Split Button */}
        <div className="relative flex shadow-sm rounded-lg" ref={captureDropdownRef}>
          <button 
            onClick={() => setIsCaptureModalOpen(true)}
            className="bg-purple-600 text-white px-4 py-2 text-sm font-medium hover:bg-purple-700 transition flex items-center rounded-l-lg border-r border-purple-700/50"
          >
            <Video className="w-4 h-4 mr-2" /> Capture
          </button>
          <button 
            onClick={() => setIsCaptureDropdownOpen(!isCaptureDropdownOpen)}
            className="bg-purple-600 text-white px-2 py-2 hover:bg-purple-700 transition flex items-center rounded-r-lg"
          >
            <ChevronDown className="w-4 h-4" />
          </button>

          {/* Capture Dropdown Menu */}
          {isCaptureDropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden py-1 z-50 animate-in fade-in slide-in-from-top-2">
              <button onClick={() => { setIsCaptureModalOpen(true); setIsCaptureDropdownOpen(false); }} className="w-full flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition">
                <Video className="w-4 h-4 mr-3 text-gray-400" /> Add to live meeting
              </button>
              <button onClick={() => handleMockAction('Schedule Meeting')} className="w-full flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition">
                <Calendar className="w-4 h-4 mr-3 text-gray-400" /> Schedule new meeting
              </button>
              <button onClick={() => { router.push('/meetings/new'); setIsCaptureDropdownOpen(false); }} className="w-full flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition">
                <Upload className="w-4 h-4 mr-3 text-gray-400" /> Upload audio or video
              </button>
              <button onClick={() => handleMockAction('Start Recording')} className="w-full flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition">
                <Mic className="w-4 h-4 mr-3 text-gray-400" /> Start recording
              </button>
            </div>
          )}
        </div>

        {/* Desktop Profile Icon */}
        <div className="hidden lg:flex w-8 h-8 bg-slate-300 rounded text-slate-700 items-center justify-center text-xs font-bold ml-2">
          P
        </div>
      </div>

      {/* ========================================= */}
      {/* CAPTURE LIVE MEETING MODAL */}
      {/* ========================================= */}
      {isCaptureModalOpen && (
        <div className="fixed inset-0 bg-black/40 z-[100] flex items-center justify-center backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden p-6 relative animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Add to live meeting</h2>
              <button onClick={() => setIsCaptureModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition"><X className="w-5 h-5" /></button>
            </div>
            
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name your meeting <span className="text-gray-400 font-normal">(Optional)</span>
                </label>
                <input 
                  type="text" 
                  placeholder="E.g. Product team sync" 
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-purple-500 transition shadow-sm" 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Meeting link</label>
                <p className="text-xs text-gray-500 mb-2">Capture meetings from GMeet, Zoom, MS teams, and more.</p>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-gray-100 rounded flex items-center justify-center">
                    <Link2 className="w-3.5 h-3.5 text-gray-500" />
                  </div>
                  <input 
                    type="text" 
                    value={captureLink}
                    onChange={(e) => setCaptureLink(e.target.value)}
                    placeholder="https://meet.google.com/sha-xjvh-ooz" 
                    className="w-full border border-gray-200 rounded-lg pl-11 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-purple-500 transition shadow-sm" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Meeting language</label>
                <select className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-purple-500 bg-white transition shadow-sm">
                  <option>English (Global)</option>
                </select>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-8">
              <button 
                onClick={() => setIsCaptureModalOpen(false)} 
                className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition"
              >
                Cancel
              </button>
              <button 
                onClick={handleCaptureSubmit}
                disabled={!captureLink.trim()}
                className={`px-5 py-2.5 text-sm font-medium text-white rounded-lg transition shadow-sm ${captureLink.trim() ? 'bg-purple-600 hover:bg-purple-700' : 'bg-purple-200 cursor-not-allowed'}`}
              >
                Start Capturing
              </button>
            </div>
          </div>
        </div>
      )}

    </header>
  );
}