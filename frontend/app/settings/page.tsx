'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Video, Bell, Mail, Sparkles, Monitor, Book, Code, Lock, 
  Search, MessageSquare, X, Shield, Gift, ChevronDown, Copy, 
  ArrowLeft, Users, Settings2, Link2, Zap, CheckCircle2, ChevronUp, XCircle 
} from 'lucide-react';
import { useToast } from '@/context/ToastContext';

export default function SettingsPage() {
  const router = useRouter();
  const { addToast } = useToast();
  
  const [mode, setMode] = useState<'personal' | 'team'>('personal');
  const [activeTab, setActiveTab] = useState('recording');
  const [isBannerVisible, setIsBannerVisible] = useState(true);
  const [isSecurityOpen, setIsSecurityOpen] = useState(false);
  const securityRef = useRef<HTMLDivElement>(null);

  // Centralized toggle states for interactivity
  const [toggles, setToggles] = useState({
    autoRecord: true,
    notifyEmail: false,
    chatNotif: true,
    realtimeChat: true,
    realtimeEmail: false,
    chatFireflies: true
  });

  const handleToggle = (key: keyof typeof toggles) => {
    setToggles(prev => ({ ...prev, [key]: !prev[key] }));
    addToast('Settings updated successfully', 'success');
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('tab')) {
      setActiveTab(params.get('tab') as string);
    }
  }, []);

  // Close security popover when clicking outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (securityRef.current && !securityRef.current.contains(e.target as Node)) {
        setIsSecurityOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleModeSwitch = (newMode: 'personal' | 'team') => {
    setMode(newMode);
    setActiveTab('recording'); 
  };

  const handleAction = (action: string) => {
    addToast(`${action} action triggered`, 'info');
  };

  const PERSONAL_TABS = [
    { id: 'recording', label: 'Recording & Privacy', icon: Video },
    { id: 'compliance', label: 'Compliance Notification', icon: Bell },
    { id: 'email', label: 'Email Assistant', icon: Mail },
    { id: 'ai', label: 'AI Settings', icon: Sparkles },
    { id: 'live', label: 'Live Assist', icon: Monitor },
    { id: 'knowledge', label: 'Knowledge Base', icon: Book },
    { id: 'mcp', label: '<> MCP & API', icon: Code, noIcon: true },
    { id: 'cookies', label: 'Cookies', icon: Lock },
  ];

  const TEAM_TABS = [
    { id: 'recording', label: 'Recording & Privacy', icon: Video },
    { id: 'compliance', label: 'Compliance Notification', icon: Bell },
    { id: 'ai', label: 'AI Settings', icon: Sparkles },
    { id: 'live', label: 'Live Meeting', icon: Monitor },
    { id: 'rules', label: 'Rules', icon: Settings2 },
    { id: 'members', label: 'Teammates and groups', icon: Users },
  ];

  const activeTabs = mode === 'personal' ? PERSONAL_TABS : TEAM_TABS;

  return (
    <div className="fixed inset-0 z-50 flex h-screen bg-white">
      
      {/* Settings Left Sidebar */}
      <div className="w-64 border-r border-gray-200 bg-[#fbfbfa] flex flex-col justify-between overflow-y-auto shrink-0 relative">
        <div>
          {/* Back Arrow & Profile Selector */}
          <div className="p-4 border-b border-gray-200">
            <button 
              onClick={() => router.push('/')} 
              className="mb-4 text-gray-500 hover:text-gray-900 transition flex items-center"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <div className="flex items-center justify-between cursor-pointer hover:bg-gray-100 p-2 -mx-2 rounded-lg transition mb-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-slate-300 rounded text-slate-700 flex items-center justify-center text-xs font-bold shrink-0">P</div>
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-gray-900 truncate">mailrajsingh50@...</div>
                  <div className="text-[10px] text-gray-500">Free Plan</div>
                </div>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
            </div>

            <div className="flex bg-gray-100 p-1 rounded-lg text-sm font-medium">
              <button 
                onClick={() => handleModeSwitch('personal')} 
                className={`flex-1 py-1 rounded-md transition ${mode === 'personal' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Personal
              </button>
              <button 
                onClick={() => handleModeSwitch('team')} 
                className={`flex-1 py-1 rounded-md transition ${mode === 'team' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Team
              </button>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-0.5">
            {activeTabs.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center px-3 py-2.5 rounded-lg transition text-sm ${isActive ? 'bg-purple-50 text-purple-700 font-medium' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  {!tab.icon && <Icon className={`w-4 h-4 mr-3 ${isActive ? 'text-purple-600' : 'text-gray-400'}`} />}
                  {tab.label}
                </button>
              )
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-200 space-y-1 bg-[#fbfbfa]">
          <button 
            onClick={() => setActiveTab('refer')}
            className={`w-full flex items-center px-3 py-2 text-sm rounded-lg transition ${activeTab === 'refer' ? 'bg-purple-50 text-purple-700' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <Gift className={`w-4 h-4 mr-3 ${activeTab === 'refer' ? 'text-purple-600' : 'text-gray-400'}`} /> Refer and earn $5 each
          </button>
          
          <div className="pt-2 mt-2 border-t border-gray-200 relative">
            <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase">Account</div>
            
            <div className="relative" ref={securityRef}>
              <button 
                onClick={() => setIsSecurityOpen(!isSecurityOpen)}
                className="w-full flex items-center justify-between px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition"
              >
                <span className="flex items-center"><Shield className="w-4 h-4 mr-3 text-gray-400" /> Security overview</span>
                <span className="text-[10px] bg-purple-100 text-purple-600 px-1.5 rounded font-bold">2/3</span>
              </button>

              {/* Security Overview Popover */}
              {isSecurityOpen && (
                <div className="absolute bottom-full left-2 mb-2 w-72 bg-white border border-gray-200 shadow-2xl rounded-2xl p-5 z-[60] animate-in fade-in slide-in-from-bottom-2">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-semibold text-gray-900">Security Overview</span>
                    <span className="text-xs text-gray-500 flex items-center font-medium">2/3 <ChevronUp className="w-3 h-3 ml-1" /></span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5 mb-5">
                    <div className="bg-purple-600 h-1.5 rounded-full w-2/3"></div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center text-sm text-gray-700 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-green-500 fill-green-100 mr-3 shrink-0" /> Zero data retention
                    </div>
                    <div className="flex items-center text-sm text-gray-700 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-green-500 fill-green-100 mr-3 shrink-0" /> Data is private
                    </div>
                    <div className="flex items-center text-sm text-gray-700 font-medium cursor-pointer hover:text-purple-600 transition">
                      <div className="w-4 h-4 rounded-full border border-dashed border-gray-300 mr-3 shrink-0 flex items-center justify-center"></div> 
                      Get your SOC 2 Type II certificate
                    </div>
                  </div>
                </div>
              )}
            </div>

            <button 
              onClick={() => setActiveTab('account')}
              className={`w-full flex items-center px-3 py-2 text-sm rounded-lg transition pl-10 ${activeTab === 'account' ? 'bg-purple-50 text-purple-700' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              Privacy & Access
            </button>
          </div>
        </div>
      </div>

      {/* Main Settings Content Area */}
      <div className="flex-1 overflow-y-auto relative bg-white">
        
        {/* Top Sticky Bar */}
        <div className="sticky top-0 bg-white/80 backdrop-blur-md z-10 border-b border-gray-100 p-4 flex items-center justify-between">
          <div className="relative w-full max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search settings" 
              className="w-full pl-9 pr-4 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <button className="flex items-center text-xs text-gray-500 hover:text-gray-900 font-medium">
            <MessageSquare className="w-4 h-4 mr-1.5" /> Feedback
          </button>
        </div>

        <div className="max-w-3xl mx-auto p-8 pb-24">
          
          {/* Universal Email Banner */}
          {isBannerVisible && activeTab !== 'email' && activeTab !== 'refer' && activeTab !== 'account' && (
            <div className="bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-100 rounded-xl p-3 mb-10 flex items-center justify-between shadow-sm">
              <div className="flex items-center text-sm">
                <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500 mr-2">M</span>
                <span className="font-semibold text-gray-900 mr-1">Email Assistant</span>
                <span className="text-gray-500 hidden sm:inline">— Auto-drafts replies and follow-ups, and labels your inbox.</span>
              </div>
              <div className="flex items-center space-x-3 shrink-0">
                <button onClick={() => { setMode('personal'); setActiveTab('email'); }} className="text-sm font-medium text-gray-700 hover:text-purple-600 border border-gray-200 bg-white px-3 py-1 rounded-lg shadow-sm transition">Try Now →</button>
                <button onClick={() => setIsBannerVisible(false)} className="text-gray-400 hover:text-gray-600"><X className="w-4 h-4" /></button>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* SPECIAL TABS (Refer & Account) */}
          {/* ======================================================== */}

          {activeTab === 'refer' && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="bg-blue-50 text-blue-600 text-xs px-4 py-3 rounded-lg mb-8 font-medium">
                Personal email domains are not eligible for referral credits anymore.
              </div>
              
              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">Refer & Get $5</h2>
                  <p className="text-sm text-gray-500 mb-8 leading-relaxed">Redeem your credits by subscribing to paid plan with advanced features & instant discount.</p>
                  
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Refer by email</h3>
                  <div className="border border-gray-200 rounded-xl p-2 flex flex-col mb-4 bg-white shadow-sm">
                    <input type="text" placeholder="Emails, separate with comma, tab or enter" className="w-full p-2 outline-none text-sm text-gray-700" />
                    <div className="flex justify-end mt-2">
                      <button onClick={() => handleAction('Refer people')} className="bg-gray-100 text-gray-400 px-4 py-1.5 rounded-lg text-sm font-medium cursor-not-allowed">Refer people</button>
                    </div>
                  </div>

                  <div className="bg-purple-50 text-purple-700 text-xs px-4 py-3 rounded-lg mb-8 flex items-center font-medium">
                    <Zap className="w-4 h-4 mr-2 fill-current" /> Anyone who signs up using your referral link will get 10% OFF on all plans.
                  </div>

                  <h3 className="text-sm font-medium text-gray-700 mb-2">Share your referral link</h3>
                  <div className="flex items-center space-x-2 mb-6">
                    <input readOnly value="https://app.fireflies.ai/login?referralCode=01M1YM43980KMK441WHER" className="flex-1 border border-gray-200 rounded-lg px-4 py-2.5 text-sm bg-gray-50 text-gray-500 outline-none" />
                    <button onClick={() => { handleAction('Link Copied'); navigator.clipboard.writeText('https://app.fireflies.ai/login?referralCode=01M1YM43980KMK441WHER'); }} className="bg-purple-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium flex items-center hover:bg-purple-700 transition shadow-sm">
                      <Link2 className="w-4 h-4 mr-2" /> Copy
                    </button>
                  </div>

                  {/* Mock Social Icons Row */}
                  <div className="flex space-x-3">
                    <button className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-bold text-xs hover:opacity-80 transition">X</button>
                    <button className="w-8 h-8 rounded-full bg-[#0a66c2] text-white flex items-center justify-center font-bold text-xs hover:opacity-80 transition">in</button>
                    <button className="w-8 h-8 rounded-full bg-[#1877f2] text-white flex items-center justify-center font-bold text-xs hover:opacity-80 transition">f</button>
                    <button className="w-8 h-8 rounded-full bg-[#25d366] text-white flex items-center justify-center font-bold text-xs hover:opacity-80 transition">WA</button>
                    <button className="w-8 h-8 rounded-full bg-[#229ED9] text-white flex items-center justify-center font-bold text-xs hover:opacity-80 transition">TG</button>
                  </div>
                </div>

                <div className="w-full md:w-64">
                  <div className="border border-gray-200 rounded-xl p-8 bg-white flex flex-col items-center justify-center mb-4 shadow-sm relative overflow-hidden">
                    <span className="text-4xl font-semibold text-gray-900 mb-1 z-10">0</span>
                    <span className="text-[10px] text-gray-400 font-bold tracking-wider uppercase z-10">Credits Earned</span>
                    <div className="absolute right-4 bottom-4 text-purple-100 opacity-50 text-5xl font-light select-none">∆</div>
                  </div>
                  <div className="flex justify-between items-center text-sm text-gray-600 border border-gray-200 rounded-xl p-4 bg-white mb-4 shadow-sm">
                    <span>Referred</span>
                    <span className="font-semibold text-gray-900">0</span>
                  </div>
                  <div className="text-xs text-green-700 bg-green-50 p-4 rounded-xl flex items-start leading-relaxed border border-green-100">
                    <Gift className="w-5 h-5 mr-2 shrink-0 text-green-600" />
                    Earned credits can be redeemed on subscribing to a paid plan.
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'account' && (
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-300">
              
              <div className="flex items-center justify-between border border-gray-200 rounded-xl p-5 bg-white shadow-sm hover:border-gray-300 transition">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 border border-gray-200 rounded-lg flex items-center justify-center bg-gray-50">
                    <div className="w-5 h-5 bg-gray-300 rounded-sm"></div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 flex items-center text-base">
                      Pranjal Raj's Team <span className="ml-2 text-[10px] text-teal-600 font-bold tracking-widest uppercase bg-teal-50 px-1.5 py-0.5 rounded">Free</span>
                    </h3>
                    <p className="text-sm text-gray-500 mt-0.5">1 member</p>
                  </div>
                </div>
                <button onClick={() => router.push('/upgrade')} className="text-purple-600 text-sm font-semibold hover:underline">Upgrade</button>
              </div>

              <div>
                <h2 className="text-sm font-semibold text-gray-500 mb-4">Accounts</h2>
                
                <div className="border border-gray-200 rounded-xl divide-y divide-gray-100 bg-white shadow-sm">
                  <div className="p-6 flex items-start space-x-4">
                    <Users className="w-5 h-5 text-gray-400 mt-1 shrink-0" />
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 mb-1">Leave team</h3>
                      <p className="text-xs text-gray-500 mb-5">You're the team admin. After leaving the team, you'll be downgraded to the free plan.</p>
                      <button onClick={() => handleAction('Leave Team')} className="border border-gray-200 text-gray-700 text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-50 transition shadow-sm">Leave Team</button>
                    </div>
                  </div>

                  <div className="p-6 flex items-start space-x-4">
                    <XCircle className="w-5 h-5 text-gray-400 mt-1 shrink-0" />
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 mb-1">Delete Account</h3>
                      <p className="text-xs text-gray-500 mb-5 leading-relaxed">Permanently delete all your data, including meetings, summaries, extensions, and analytics.</p>
                      <button onClick={() => handleAction('Delete Account')} className="border border-gray-200 text-gray-700 text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-50 transition shadow-sm">Delete My Account</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TEAM MODE CONTENT */}
          {/* ======================================================== */}

          {mode === 'team' && activeTab === 'recording' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <h2 className="text-lg font-semibold text-gray-900 mb-6 border-b border-gray-100 pb-2">Recording</h2>
              
              <div className="space-y-8">
                <div>
                  <div className="flex items-center font-medium text-gray-900 text-sm mb-1">
                    <Video className="w-4 h-4 text-blue-500 mr-3 shrink-0" /> Auto-record meetings
                  </div>
                  <p className="text-xs text-gray-500 ml-7 mb-3">Fireflies notetaker will join and record workspace members' calendar events.</p>
                  <select className="w-[calc(100%-28px)] ml-7 border border-gray-200 rounded-lg p-2.5 text-sm outline-none bg-white text-gray-700">
                    <option>Allow teammates to choose</option>
                  </select>
                </div>

                <div className="opacity-50 cursor-not-allowed">
                  <div className="flex items-center font-medium text-gray-900 text-sm mb-1">
                    <Video className="w-4 h-4 text-purple-400 mr-3 shrink-0" /> Capture meeting video <span className="ml-2 text-[10px] bg-purple-100 text-purple-600 px-1.5 rounded font-bold uppercase">Pro</span>
                  </div>
                  <p className="text-xs text-gray-500 ml-7 mb-3">Capture your meeting screen and shared content as video.</p>
                  <select disabled className="w-[calc(100%-28px)] ml-7 border border-gray-100 rounded-lg p-2.5 text-sm outline-none bg-gray-50 text-gray-400">
                    <option>Allow teammates to choose</option>
                  </select>
                </div>

                <div>
                  <div className="flex items-center font-medium text-gray-900 text-sm mb-1">
                    <div className="w-4 h-4 mr-3 flex items-center justify-center font-serif text-gray-400 shrink-0">T</div> Meeting language
                  </div>
                  <p className="text-xs text-gray-500 ml-7 mb-3">Set the default language for transcripts and summaries across the workspace.</p>
                  <select className="w-[calc(100%-28px)] ml-7 border border-gray-200 rounded-lg p-2.5 text-sm outline-none bg-white text-gray-700">
                    <option>Allow teammates to choose</option>
                  </select>
                </div>

                <div className="opacity-50 cursor-not-allowed">
                  <div className="flex items-center font-medium text-gray-900 text-sm mb-1">
                    <Lock className="w-4 h-4 text-gray-400 mr-3 shrink-0" /> Auto-delete meetings <span className="ml-2 text-[10px] bg-purple-100 text-purple-600 px-1.5 rounded font-bold uppercase">Pro</span>
                  </div>
                  <p className="text-xs text-gray-500 ml-7 mb-3">Automatically delete workspace members' meetings after the set retention period.</p>
                  <select disabled className="w-[calc(100%-28px)] ml-7 border border-gray-100 rounded-lg p-2.5 text-sm outline-none bg-gray-50 text-gray-400">
                    <option>Allow teammates to choose</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {mode === 'team' && activeTab === 'compliance' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <h2 className="text-lg font-semibold text-gray-900 mb-6 border-b border-gray-100 pb-2">Compliance Notification</h2>
              <div className="space-y-8">
                <div>
                  <div className="flex items-center font-medium text-gray-900 text-sm mb-1">
                    <Mail className="w-4 h-4 text-gray-400 mr-3 shrink-0" /> Notify participants via email
                  </div>
                  <p className="text-xs text-gray-500 ml-7 mb-3">Notify all participants 1 hour before a meeting that Fireflies will record it.</p>
                  <select className="w-[calc(100%-28px)] ml-7 border border-gray-200 rounded-lg p-2.5 text-sm outline-none bg-white text-gray-700">
                    <option>Allow teammates to choose</option>
                  </select>
                </div>
                <div>
                  <div className="flex items-center font-medium text-gray-900 text-sm mb-1">
                    <MessageSquare className="w-4 h-4 text-gray-400 mr-3 shrink-0" /> Meeting chat notification
                  </div>
                  <p className="text-xs text-gray-500 ml-7 mb-3">Send a message in the meeting chat to let attendees know the meeting is being recorded.</p>
                  <select className="w-[calc(100%-28px)] ml-7 border border-gray-200 rounded-lg p-2.5 text-sm outline-none bg-white text-gray-700">
                    <option>Allow teammates to choose</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {mode === 'team' && activeTab === 'ai' && (
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-6 border-b border-gray-100 pb-2">AI Skills</h2>
                <div className="space-y-8">
                  <div>
                    <div className="flex items-center font-medium text-gray-900 text-sm mb-1">
                      <Sparkles className="w-4 h-4 text-gray-400 mr-3 shrink-0" /> Who can create AI Skills in the workspace
                    </div>
                    <p className="text-xs text-gray-500 ml-7 mb-3">AI Skills can be created by selected people in the workspace.</p>
                    <select className="w-[calc(100%-28px)] ml-7 border border-gray-200 rounded-lg p-2.5 text-sm outline-none bg-white text-gray-700">
                      <option>Allow teammates to create AI Skills</option>
                    </select>
                  </div>
                  <div>
                    <div className="flex items-center font-medium text-gray-900 text-sm mb-1">
                      <Lock className="w-4 h-4 text-gray-400 mr-3 shrink-0" /> Who can access AI Skills in the workspace
                    </div>
                    <p className="text-xs text-gray-500 ml-7 mb-3">Choose who can customize and use AI Skills created in the workspace.</p>
                    <select className="w-[calc(100%-28px)] ml-7 border border-gray-200 rounded-lg p-2.5 text-sm outline-none bg-white text-gray-700">
                      <option>Allow teammates to choose</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-6 border-b border-gray-100 pb-2">Personal Assistant</h2>
                <div>
                  <div className="flex items-center font-medium text-gray-900 text-sm mb-1">
                    <Sparkles className="w-4 h-4 text-gray-400 mr-3 shrink-0" /> Who can access personal assistant in the workspace
                  </div>
                  <p className="text-xs text-gray-500 ml-7 mb-3">Choose who can view output from personal assistant.</p>
                  <select className="w-[calc(100%-28px)] ml-7 border border-gray-200 rounded-lg p-2.5 text-sm outline-none bg-white text-gray-700">
                    <option>Enable for all teammates</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {mode === 'team' && activeTab === 'live' && (
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-6 border-b border-gray-100 pb-2">Real-Time Pane Notification</h2>
                <div className="space-y-8">
                  <div>
                    <div className="flex items-center font-medium text-gray-900 text-sm mb-1">
                      <MessageSquare className="w-4 h-4 text-gray-400 mr-3 shrink-0" /> Real-time pane notification
                    </div>
                    <p className="text-xs text-gray-500 ml-7 mb-3">Real-time pane link shared via email to participants for meetings in the workspace.</p>
                    <select className="w-[calc(100%-28px)] ml-7 border border-gray-200 rounded-lg p-2.5 text-sm outline-none bg-white text-gray-700">
                      <option>Allow teammates to choose</option>
                    </select>
                  </div>
                  <div>
                    <div className="flex items-center font-medium text-gray-900 text-sm mb-1">
                      <Monitor className="w-4 h-4 text-gray-400 mr-3 shrink-0" /> Send key takeaways on meeting chat
                    </div>
                    <p className="text-xs text-gray-500 ml-7 mb-3">For workspace meetings, action items will be sent in the meeting chat 5 minutes before the call ends.</p>
                    <select className="w-[calc(100%-28px)] ml-7 border border-gray-200 rounded-lg p-2.5 text-sm outline-none bg-white text-gray-700">
                      <option>Allow teammates to choose</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-6 border-b border-gray-100 pb-2">Talk to Fireflies</h2>
                <div>
                  <div className="flex items-center font-medium text-gray-900 text-sm mb-1">
                    <MessageSquare className="w-4 h-4 text-gray-400 mr-3 shrink-0" /> Interact with Fireflies
                  </div>
                  <p className="text-xs text-gray-500 ml-7 mb-3 max-w-xl leading-relaxed">
                    Workspace members can interact with Fireflies through chat or voice to ask questions, search the web and get instant responses.
                  </p>
                  <select className="w-[calc(100%-28px)] ml-7 border border-gray-200 rounded-lg p-2.5 text-sm outline-none bg-white text-gray-700">
                    <option>Allow teammates to choose</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {mode === 'team' && activeTab === 'rules' && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 py-20 flex flex-col items-center justify-center text-center">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Automate what happens after every meeting</h2>
              <p className="text-sm text-gray-500 max-w-md mx-auto mb-8 leading-relaxed">
                Create rules to automatically route meetings to channels, share them with the right teams, or apply privacy settings based on meeting details.
              </p>
              <button 
                onClick={() => router.push('/upgrade')}
                className="bg-purple-600 text-white px-6 py-3 rounded-xl text-sm font-medium hover:bg-purple-700 transition shadow-sm mb-4 flex items-center"
              >
                <Zap className="w-4 h-4 mr-2 fill-current" /> Upgrade To Enterprise
              </button>
              <button className="text-sm font-medium text-gray-500 hover:text-gray-900">
                How To Use Rules ↗
              </button>
            </div>
          )}

          {mode === 'team' && activeTab === 'members' && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex space-x-6 border-b border-gray-200 mb-6 text-sm font-medium">
                <button className="pb-3 border-b-2 border-purple-600 text-gray-900">1 Teammate</button>
                <button className="pb-3 text-gray-500 hover:text-gray-900">0 User Groups</button>
                <button className="pb-3 text-gray-500 hover:text-gray-900">Advanced Settings</button>
              </div>

              <div className="flex items-center space-x-3 mb-8">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Search teammates" 
                    className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <button className="bg-purple-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition flex items-center shadow-sm">
                  + Invite Teammate
                </button>
                <button className="bg-purple-600 text-white px-3 py-2 rounded-lg hover:bg-purple-700 transition shadow-sm">
                  <Link2 className="w-4 h-4" />
                </button>
              </div>

              <div className="text-sm text-gray-500 mb-4 cursor-pointer">
                All teammates (1) ▾
              </div>

              <div className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition cursor-pointer border border-transparent hover:border-gray-100">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-slate-500 text-white rounded flex items-center justify-center font-bold text-sm">P</div>
                  <div>
                    <div className="flex items-center text-sm font-medium text-gray-900">
                      Pranjal Raj <span className="ml-2 text-[10px] text-blue-500 font-bold uppercase tracking-wide">Admin</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">mailrajsingh50@gmail.com</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* PERSONAL MODE CONTENT */}
          {/* ======================================================== */}

          {mode === 'personal' && activeTab === 'recording' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <h2 className="text-lg font-semibold text-gray-900 mb-6 border-b border-gray-100 pb-2">Recording</h2>
              <div className="space-y-8">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center font-medium text-gray-900 text-sm">
                      <Video className="w-4 h-4 text-blue-500 mr-3" /> Auto-record meetings
                    </div>
                    <div onClick={() => handleToggle('autoRecord')} className={`w-10 h-6 rounded-full flex items-center p-1 cursor-pointer transition-colors ${toggles.autoRecord ? 'bg-purple-600' : 'bg-gray-200'}`}>
                      <div className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform ${toggles.autoRecord ? 'translate-x-4' : ''}`}></div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 ml-7 mb-3">Fireflies notetaker will join and record your calendar events.</p>
                  <select className="w-[calc(100%-28px)] ml-7 border border-gray-200 rounded-lg p-2.5 text-sm outline-none bg-white text-gray-700">
                    <option>Record all calendar events with a meeting link</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {mode === 'personal' && activeTab === 'compliance' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <h2 className="text-lg font-semibold text-gray-900 mb-6 border-b border-gray-100 pb-2">Compliance Notification</h2>
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center font-medium text-gray-900 text-sm mb-1">
                      <Mail className="w-4 h-4 text-gray-400 mr-3" /> Notify participants via email
                    </div>
                    <p className="text-xs text-gray-500 ml-7">Notify all participants 1 hour before a meeting that Fireflies will record it.</p>
                  </div>
                  <div onClick={() => handleToggle('notifyEmail')} className={`w-10 h-6 rounded-full flex items-center p-1 cursor-pointer transition-colors ${toggles.notifyEmail ? 'bg-purple-600' : 'bg-gray-200'}`}>
                    <div className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform ${toggles.notifyEmail ? 'translate-x-4' : ''}`}></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {mode === 'personal' && activeTab === 'email' && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 pt-4">
              <div className="text-center mb-10">
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">Email Assistant for your inbox</h2>
                <p className="text-sm text-gray-500 max-w-md mx-auto">Emails are auto-labeled, replies are drafted, and follow-ups are prepared. You review and send.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="flex flex-col items-center">
                  <div className="w-full bg-white border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl p-4 mb-4">
                    <div className="flex items-center justify-between mb-3 text-xs text-gray-400 border-b border-gray-50 pb-2">
                      <span className="font-semibold text-gray-700 flex items-center"><span className="text-pink-500 mr-1">M</span> janice@acme.com</span>
                      <span className="flex items-center text-pink-400"><Sparkles className="w-3 h-3 mr-1" /> Drafting...</span>
                    </div>
                    <p className="text-sm font-semibold text-gray-800">Hi Max,</p>
                    <p className="text-sm text-gray-600 mb-4">We've shared your feedback <span className="bg-green-100 text-transparent select-none">██████</span></p>
                    <div className="bg-blue-600 text-white text-[10px] font-bold px-3 py-1.5 rounded-full inline-block">Send ▾</div>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">Auto-Draft</h3>
                  <p className="text-xs text-gray-500">Reply in your tone, instantly</p>
                </div>

                <div className="flex flex-col items-center">
                  <div className="w-full bg-white border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl p-4 mb-4">
                    <div className="flex items-center mb-3 text-xs font-semibold text-gray-700 border-b border-gray-50 pb-2">
                      <span className="text-pink-500 mr-1">M</span> Inbox
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-400">Stripe</span>
                        <span className="text-gray-800">Failed Billing</span>
                        <span className="text-red-500 bg-red-50 px-2 py-0.5 rounded font-medium">Critical</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-400">Janice</span>
                        <span className="text-gray-800">Share contract</span>
                        <span className="text-green-500 bg-green-50 px-2 py-0.5 rounded font-medium">Task</span>
                      </div>
                      <div className="flex items-center space-x-2 opacity-30"><div className="w-6 h-3 bg-gray-200 rounded"></div><div className="flex-1 h-3 bg-gray-200 rounded"></div><div className="w-10 h-3 bg-gray-200 rounded"></div></div>
                    </div>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">Auto Label</h3>
                  <p className="text-xs text-gray-500">See what needs attention first</p>
                </div>
              </div>

              <div className="flex flex-col items-center">
                <button 
                  onClick={() => addToast('Connecting Email Provider...', 'success')}
                  className="bg-purple-600 text-white px-24 py-3 rounded-xl text-sm font-semibold hover:bg-purple-700 transition shadow-md mb-3"
                >
                  Connect →
                </button>
                <p className="text-[11px] text-gray-400 flex items-center"><Sparkles className="w-3 h-3 mr-1" /> Consumes AI Credits</p>
              </div>
            </div>
          )}

          {mode === 'personal' && activeTab === 'ai' && (
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-6 border-b border-gray-100 pb-2">AI Skills</h2>
                <div className="opacity-50 cursor-not-allowed">
                  <div className="flex items-center font-medium text-gray-900 text-sm mb-1">
                    <Sparkles className="w-4 h-4 text-gray-400 mr-3 shrink-0" /> Who can access your AI Skills <span className="ml-2 text-[10px] bg-purple-100 text-purple-600 px-1.5 rounded font-bold uppercase">Pro</span>
                  </div>
                  <p className="text-xs text-gray-500 ml-7 mb-3">Choose who can customize and use AI Skills created by you.</p>
                  <select disabled className="w-[calc(100%-28px)] ml-7 border border-gray-100 bg-gray-50 rounded-lg p-2.5 text-sm text-gray-400">
                    <option>Only me</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {mode === 'personal' && activeTab === 'live' && (
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-6 border-b border-gray-100 pb-2">Talk to Fireflies</h2>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center font-medium text-gray-900 text-sm mb-1">
                      <MessageSquare className="w-4 h-4 text-gray-400 mr-3" /> Chat with Fireflies
                    </div>
                    <p className="text-xs text-gray-500 ml-7 max-w-lg leading-relaxed">
                      Type <span className="font-mono bg-gray-100 px-1 rounded text-gray-700">/ff</span> in the meeting chat to ask Fireflies questions about the ongoing discussion or search the web.
                    </p>
                  </div>
                  <div onClick={() => handleToggle('chatFireflies')} className={`w-10 h-6 rounded-full flex items-center p-1 cursor-pointer transition-colors ${toggles.chatFireflies ? 'bg-purple-600' : 'bg-gray-200'}`}>
                    <div className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform ${toggles.chatFireflies ? 'translate-x-4' : ''}`}></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {mode === 'personal' && activeTab === 'knowledge' && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex items-center justify-between border-b border-gray-100 pb-6 mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Knowledge Base</h2>
                <button className="text-sm font-medium text-purple-600 hover:text-purple-700">+ Create</button>
              </div>
              <p className="text-xs text-gray-500 flex items-center mb-8"><Sparkles className="w-3.5 h-3.5 mr-1.5 text-teal-400" /> Add your company knowledge to get personalized recommendations in realtime.</p>
              
              <div className="flex items-center justify-between bg-white border border-gray-100 shadow-sm rounded-xl p-4 hover:shadow-md transition cursor-pointer">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-green-500"><Book className="w-5 h-5" /></div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Sales</h3>
                    <p className="text-xs text-gray-500 mt-0.5">0 sources</p>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-gray-600">⋮</button>
              </div>
            </div>
          )}

          {mode === 'personal' && activeTab === 'mcp' && (
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-6 border-b border-gray-100 pb-2">MCP</h2>
                <div className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg p-3 mb-6">
                  <span className="text-sm text-gray-600 font-mono">https://api.fireflies.ai/mcp</span>
                  <Copy className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-pointer" />
                </div>
              </div>
            </div>
          )}

          {mode === 'personal' && activeTab === 'cookies' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Global Privacy Control Detected</h2>
                <p className="text-sm text-gray-500 leading-relaxed max-w-2xl bg-gray-50 p-4 rounded-xl border border-gray-100">
                  Your browser has Global Privacy Control (GPC) enabled. In accordance with applicable privacy laws, we have honored this signal and disabled all non-essential tracking.
                </p>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}