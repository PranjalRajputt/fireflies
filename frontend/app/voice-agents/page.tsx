'use client';

import { useState } from 'react';
import { 
  Play, Plus, X, MessageSquare, Headphones, ChevronDown, HelpCircle, 
  FileText, Database, Globe, Clock, Mic, Link2, Code, QrCode, Calendar as CalendarIcon, 
  Share2, Search
} from 'lucide-react';
import { useToast } from '@/context/ToastContext';

type VoiceAgent = {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
};

export default function VoiceAgentsPage() {
  const { addToast } = useToast();
  
  // Tab & UI State
  const [activeTab, setActiveTab] = useState<'discover' | 'my'>('discover');
  const [isCloneBannerVisible, setIsCloneBannerVisible] = useState(true);
  const [showTooltip, setShowTooltip] = useState(false);
  
  // Data State
  const [myAgents, setMyAgents] = useState<VoiceAgent[]>([]);
  const [myAgentFilter, setMyAgentFilter] = useState<'all' | 'active'>('all');

  // Modal States
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState<'setup' | 'settings'>('setup');
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  // Form State
  const [agentName, setAgentName] = useState('Custom Agent');
  const [agentDesc, setAgentDesc] = useState('Enter a short description of your Voice Agent');
  const [settingsVisibility, setSettingsVisibility] = useState(false);

  const handleAction = (actionName: string) => {
    addToast(`${actionName} action triggered (Mocked Feature)`, 'info');
  };

  const handleCreateAgent = () => {
    const newAgent: VoiceAgent = {
      id: Date.now().toString(),
      name: agentName,
      description: agentDesc,
      isActive: true
    };
    
    setMyAgents([newAgent, ...myAgents]);
    setIsCreateModalOpen(false);
    setIsSuccessModalOpen(true);
    addToast('Voice Agent has been created', 'success');
    
    // Reset form
    setAgentName('Custom Agent');
    setAgentDesc('Enter a short description of your Voice Agent');
  };

  const handleCloseSuccessModal = () => {
    setIsSuccessModalOpen(false);
    setActiveTab('my');
    setShowTooltip(true);
  };

  const toggleAgentStatus = (id: string) => {
    setMyAgents(myAgents.map(agent => 
      agent.id === id ? { ...agent, isActive: !agent.isActive } : agent
    ));
  };

  return (
    <div className="max-w-[1100px] mx-auto p-8 relative">
      
      {/* Header Tabs */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 hidden md:block">Voice Agents</h1>
        <div className="flex space-x-8 text-sm font-medium w-full md:w-auto justify-center md:justify-start border-b md:border-none border-gray-200 relative">
          <button 
            onClick={() => setActiveTab('discover')}
            className={`pb-3 transition relative ${activeTab === 'discover' ? 'text-purple-600 border-b-2 border-purple-600 font-semibold' : 'text-gray-500 hover:text-gray-900'}`}
          >
            Discover
          </button>
          <button 
            onClick={() => { setActiveTab('my'); setShowTooltip(false); }}
            className={`pb-3 transition relative ${activeTab === 'my' ? 'text-purple-600 border-b-2 border-purple-600 font-semibold' : 'text-gray-500 hover:text-gray-900'}`}
          >
            My Voice Agents {myAgents.length > 0 && `(${myAgents.length})`}
          </button>

          {/* Purple Tooltip pointing to My Voice Agents */}
          {showTooltip && activeTab === 'my' && (
            <div className="absolute top-12 left-1/2 md:left-auto md:right-0 transform -translate-x-1/2 md:translate-x-0 bg-purple-600 text-white text-sm p-4 rounded-xl shadow-xl w-72 z-10">
              <div className="absolute -top-2 left-1/2 md:left-auto md:right-12 transform -translate-x-1/2 md:translate-x-0 w-0 h-0 border-l-8 border-r-8 border-b-8 border-transparent border-b-purple-600"></div>
              <button onClick={(e) => { e.stopPropagation(); setShowTooltip(false); }} className="absolute top-2 right-2 text-purple-200 hover:text-white">
                <X className="w-4 h-4" />
              </button>
              <h4 className="font-semibold mb-1 pr-4">Your Voice Agents are here</h4>
              <p className="text-purple-100 text-xs leading-relaxed">You can find all of your created Voice Agents under My Voice Agents.</p>
            </div>
          )}
        </div>
        <div className="hidden md:block w-[100px]"></div>
      </div>

      {/* DISCOVER TAB */}
      {activeTab === 'discover' && (
        <>
          {/* Main Hero Banner */}
          <div className="bg-gradient-to-r from-[#e9e3ff] to-[#f5f0ff] rounded-3xl p-8 mb-8 flex flex-col md:flex-row items-center justify-between shadow-sm relative overflow-hidden">
            <div className="z-10 max-w-lg mb-8 md:mb-0">
              <div className="flex items-center space-x-3 mb-4">
                <h2 className="text-2xl font-semibold text-indigo-950">Experience Voice Agents</h2>
                <span className="bg-green-100 border border-green-200 text-green-700 text-xs font-semibold px-2 py-0.5 rounded-full flex items-center">
                  <SparklesIcon className="w-3 h-3 mr-1" /> 50 free AI credits
                </span>
              </div>
              <p className="text-sm text-indigo-900/80 mb-8 leading-relaxed">
                Voice Agents handle your calls, ask the right questions, and deliver clear insights.
              </p>
              <div className="flex items-center space-x-4">
                <button onClick={() => handleAction('Try It Live')} className="bg-purple-600 text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-purple-700 transition flex items-center shadow-sm">
                  <Headphones className="w-4 h-4 mr-2" /> Try It Live
                </button>
                <button onClick={() => handleAction('Watch Demo')} className="bg-white text-gray-700 px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition flex items-center shadow-sm">
                  <Play className="w-4 h-4 mr-2 fill-current" /> Watch Demo
                </button>
              </div>
            </div>

            {/* Mock Agent UI Graphic */}
            <div className="relative z-10 w-full md:w-80 h-48 bg-gradient-to-br from-indigo-950 to-black rounded-2xl shadow-2xl p-4 flex flex-col items-center justify-center border border-indigo-500/30">
              <div className="absolute top-4 left-4 bg-white/10 backdrop-blur-md text-white text-[10px] px-3 py-1.5 rounded-lg border border-white/10">
                How do you handle tight deadlines?
              </div>
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center mb-3 shadow-[0_0_30px_rgba(168,85,247,0.4)] animate-pulse">
                <Headphones className="w-6 h-6 text-white" />
              </div>
              <p className="text-white text-xs font-medium">Acme's Voice Agent</p>
              <div className="mt-4 flex space-x-2">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center"><Mic className="w-3 h-3 text-white" /></div>
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center"><ChevronDown className="w-3 h-3 text-white" /></div>
                <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center"><X className="w-3 h-3 text-white" /></div>
              </div>
            </div>
            <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-purple-300/30 rounded-full blur-3xl"></div>
          </div>

          {/* Voice Cloning Banner */}
          {isCloneBannerVisible && (
            <div className="bg-gradient-to-r from-teal-50 to-cyan-50 border border-teal-100 rounded-2xl p-4 mb-10 flex items-center justify-between shadow-sm">
              <div className="flex items-center text-sm font-medium text-teal-800">
                <Mic className="w-4 h-4 mr-3 text-teal-500" /> 
                Try Voice Cloning — Make your agent sound exactly like you in 30 seconds.
              </div>
              <div className="flex items-center space-x-4">
                <button onClick={() => handleAction('Create Voice Agent')} className="text-sm font-semibold text-teal-600 hover:text-teal-700">
                  Create Voice Agent
                </button>
                <button onClick={() => setIsCloneBannerVisible(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Section Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Pranjal, set up your Voice Agent in 2 minutes</h2>
              <button className="flex items-center text-xs text-gray-400 hover:text-gray-600 mt-2 font-medium">
                <MessageSquare className="w-3.5 h-3.5 mr-1.5" /> Share Feedback
              </button>
            </div>
            <button 
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-purple-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-purple-700 transition flex items-center shadow-sm"
            >
              <Plus className="w-4 h-4 mr-2" /> Custom Agent
            </button>
          </div>

          {/* Agent Templates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:border-purple-200 transition cursor-pointer">
              <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center mb-6">
                <FileText className="w-6 h-6 text-pink-500" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Screening Interview Agent</h3>
              <p className="text-sm text-gray-500 leading-relaxed">Hire faster with automatic screening calls that assess candidate skills.</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:border-purple-200 transition cursor-pointer">
              <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center mb-6">
                <HelpCircle className="w-6 h-6 text-cyan-500" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Discovery Call Agent</h3>
              <p className="text-sm text-gray-500 leading-relaxed">Qualify prospects with focused discovery calls that uncover needs and buying signals.</p>
            </div>
          </div>
        </>
      )}

      {/* MY VOICE AGENTS TAB */}
      {activeTab === 'my' && (
        <div className="max-w-4xl mx-auto">
          {myAgents.length === 0 ? (
            <div className="py-20 text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center mb-4">
                <Headphones className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Voice Agents Yet</h3>
              <p className="text-sm text-gray-500 mb-6 max-w-sm">Create your first custom Voice Agent to start automating your calls.</p>
              <button 
                onClick={() => setIsCreateModalOpen(true)}
                className="bg-purple-600 text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-purple-700 transition flex items-center shadow-sm"
              >
                <Plus className="w-4 h-4 mr-2" /> Custom Agent
              </button>
            </div>
          ) : (
            <>
              {/* Toolbar */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex space-x-2 text-sm font-medium bg-white border border-gray-200 p-1 rounded-xl">
                  <button 
                    onClick={() => setMyAgentFilter('all')}
                    className={`px-4 py-1.5 rounded-lg transition ${myAgentFilter === 'all' ? 'bg-purple-50 text-purple-700 border-purple-200' : 'text-gray-600 hover:bg-gray-50'}`}
                  >
                    All
                  </button>
                  <button 
                    onClick={() => setMyAgentFilter('active')}
                    className={`px-4 py-1.5 rounded-lg transition ${myAgentFilter === 'active' ? 'bg-purple-50 text-purple-700 border-purple-200' : 'text-gray-600 hover:bg-gray-50'}`}
                  >
                    Active
                  </button>
                </div>
                <div className="relative w-64 hidden md:block">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Search" 
                    className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              {/* Agents List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {myAgents.filter(a => myAgentFilter === 'all' || a.isActive).map((agent) => (
                  <div key={agent.id} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:border-purple-200 transition">
                    <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-5">
                      <FileText className="w-6 h-6 text-orange-500" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">{agent.name}</h3>
                    <p className="text-sm text-gray-500 mb-6">{agent.description}</p>
                    
                    <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                      <div 
                        onClick={() => toggleAgentStatus(agent.id)}
                        className={`w-10 h-6 rounded-full flex items-center p-1 cursor-pointer transition-colors duration-200 ${agent.isActive ? 'bg-purple-600' : 'bg-gray-200'}`}
                      >
                        <div className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform duration-200 ${agent.isActive ? 'translate-x-4' : ''}`}></div>
                      </div>
                      <button 
                        onClick={() => handleAction('Copy Link')}
                        className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 border border-gray-200 px-4 py-1.5 rounded-lg transition"
                      >
                        <Link2 className="w-4 h-4 mr-2" /> Copy Link
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* CREATE CUSTOM AGENT MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/40 z-[60] flex items-center justify-center backdrop-blur-sm">
          <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden p-0 relative flex flex-col md:flex-row h-[85vh] max-h-[800px]">
            
            {/* Left Column */}
            <div className="w-full md:w-[60%] flex flex-col h-full border-r border-gray-100 bg-[#fafafa]">
              <div className="flex border-b border-gray-200 px-8 pt-6 bg-white">
                <button 
                  onClick={() => setModalTab('setup')}
                  className={`pb-3 px-2 text-sm font-medium transition ${modalTab === 'setup' ? 'border-b-2 border-purple-600 text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  Setup
                </button>
                <button 
                  onClick={() => setModalTab('settings')}
                  className={`pb-3 px-2 ml-6 text-sm font-medium transition ${modalTab === 'settings' ? 'border-b-2 border-purple-600 text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  Settings
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 bg-white">
                {modalTab === 'setup' ? (
                  <div className="space-y-8">
                    <div>
                      <div className="flex items-center text-sm font-medium text-gray-800 mb-3">
                        <HelpCircle className="w-4 h-4 text-orange-400 mr-2" /> 
                        Questions — <span className="text-gray-500 font-normal ml-1">Enter the questions you'd like your Voice Agent to ask.</span>
                      </div>
                      <textarea 
                        rows={6}
                        defaultValue={"How has your day been going so far?\nWhat's one thing that took up most of your time today?\nDid anything slow you down or catch you off guard?\nWhat's the one thing you want to get done next?"}
                        className="w-full border border-gray-200 rounded-xl p-4 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                      />
                    </div>
                    <div className="flex items-center justify-between text-sm font-medium text-purple-700 pb-2 border-b border-gray-100">
                      <span>Knowledge & Instructions</span>
                      <ChevronDown className="w-4 h-4" />
                    </div>
                    <div className="pt-2">
                      <div className="flex items-center text-sm font-medium text-gray-800 mb-3">
                        <Database className="w-4 h-4 text-teal-400 mr-2" /> 
                        Knowledge — <span className="text-gray-500 font-normal ml-1">Provide any necessary information and context.</span>
                      </div>
                      <textarea rows={4} placeholder="Type here" className="w-full border border-gray-200 rounded-xl p-4 text-sm outline-none focus:ring-2 focus:ring-purple-500 resize-none mb-3" />
                      <div className="flex items-center justify-between text-sm text-gray-500 bg-gray-50 px-4 py-2.5 rounded-lg border border-gray-100 border-dashed">
                        <span className="flex items-center"><SparklesIcon className="w-4 h-4 mr-2 text-gray-400" /> Add your company knowledge to power smarter AI answers</span>
                        <button className="text-purple-600 font-medium hover:underline">+ Add Knowledge Base</button>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center text-sm font-medium text-gray-800 mb-3">
                        <FileText className="w-4 h-4 text-gray-400 mr-2" /> 
                        Instructions — <span className="text-gray-500 font-normal ml-1">Personalize how the Voice Agent should behave.</span>
                      </div>
                      <textarea rows={4} placeholder="Type here" className="w-full border border-gray-200 rounded-xl p-4 text-sm outline-none focus:ring-2 focus:ring-purple-500 resize-none" />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {/* Settings Tab Content */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h3 className="text-sm font-medium text-gray-900">Visibility</h3>
                          <p className="text-xs text-gray-500 mt-1">Allow members of your workspace to discover and edit this Voice Agent.</p>
                        </div>
                        <div 
                          onClick={() => setSettingsVisibility(!settingsVisibility)}
                          className={`w-10 h-6 rounded-full flex items-center p-1 cursor-pointer transition-colors ${settingsVisibility ? 'bg-purple-600' : 'bg-gray-200'}`}
                        >
                          <div className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform ${settingsVisibility ? 'translate-x-4' : ''}`}></div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 mb-1">Meeting Privacy</h3>
                      <p className="text-xs text-gray-500 mb-3">Choose who can view session notes and transcript.</p>
                      <select className="w-full border border-gray-200 rounded-xl p-3 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-purple-500 bg-white">
                        <option>Teammates & Anyone with Link</option>
                      </select>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-900 mb-1">Send Recap Email</h3>
                      <p className="text-xs text-gray-500 mb-3">Choose who'll receive session recap email.</p>
                      <select className="w-full border border-gray-200 rounded-xl p-3 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-purple-500 bg-white">
                        <option>Owner and participants</option>
                      </select>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-900 mb-1">Participant Info Required Before Talking To Agent</h3>
                      <p className="text-xs text-gray-500 mb-3">If email is selected, users will need to verify with an OTP.</p>
                      <div className="flex space-x-6 text-sm text-gray-700">
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <div className="w-4 h-4 bg-purple-600 rounded flex items-center justify-center"><div className="w-2 h-2 bg-white rounded-sm"></div></div>
                          <span>Name</span>
                        </label>
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <div className="w-4 h-4 border border-gray-300 rounded bg-white"></div>
                          <span>Email</span>
                        </label>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="border-t border-gray-200 p-6 bg-white flex items-center justify-between">
                <span className="text-sm text-gray-500 font-medium">1 AI credit / min</span>
                <div className="flex space-x-3">
                  <button onClick={() => setIsCreateModalOpen(false)} className="px-6 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-xl transition">Cancel</button>
                  <button onClick={handleCreateAgent} className="px-8 py-2.5 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-sm transition">Create</button>
                </div>
              </div>
            </div>

            {/* Right Column - Agent Preview Details */}
            <div className="hidden md:flex w-[40%] flex-col p-10 bg-white relative">
              <div className="flex items-start space-x-4 mb-8">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center shrink-0">
                  <FileText className="w-6 h-6 text-orange-500" />
                </div>
                <div className="w-full">
                  <input 
                    type="text"
                    value={agentName}
                    onChange={(e) => setAgentName(e.target.value)}
                    className="text-lg font-semibold text-gray-900 outline-none w-full border-b border-transparent hover:border-gray-200 focus:border-purple-500 pb-1 bg-transparent transition"
                  />
                  <p className="text-sm text-gray-500 mt-0.5">Pranjal Raj</p>
                </div>
              </div>

              <div className="mb-10 w-full">
                <input 
                  type="text"
                  value={agentDesc}
                  onChange={(e) => setAgentDesc(e.target.value)}
                  className="text-sm text-gray-400 outline-none w-full border-b border-transparent hover:border-gray-200 focus:border-purple-500 pb-1 bg-transparent transition"
                />
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-gray-500"><Globe className="w-4 h-4 mr-3" /> Language</div>
                  <select className="border-none bg-transparent text-gray-800 font-medium outline-none cursor-pointer text-right">
                    <option>English</option>
                  </select>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-gray-500"><Clock className="w-4 h-4 mr-3" /> Session duration</div>
                  <select className="border-none bg-transparent text-gray-800 font-medium outline-none cursor-pointer text-right">
                    <option>10 mins</option>
                  </select>
                </div>

                <div className="bg-gradient-to-r from-[#f5fdf7] to-[#faf5ff] border border-green-100/50 rounded-xl p-3 flex flex-col space-y-3 relative overflow-hidden">
                  <div className="flex items-center justify-between text-sm relative z-10">
                    <div className="flex items-center text-gray-600 font-medium"><Mic className="w-4 h-4 mr-3 text-purple-400" /> Voice</div>
                    <select className="border-none bg-transparent text-gray-800 font-medium outline-none cursor-pointer text-right">
                      <option>Fred</option>
                    </select>
                  </div>
                  <button className="text-left text-sm font-medium text-teal-600 hover:underline relative z-10">
                    Clone your voice →
                  </button>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-gray-500"><Headphones className="w-4 h-4 mr-3" /> Tone</div>
                  <select className="border-none bg-transparent text-gray-800 font-medium outline-none cursor-pointer text-right">
                    <option>Professional</option>
                  </select>
                </div>

                <button className="flex items-center text-sm text-gray-400 hover:text-gray-600 pt-2 border-t border-gray-100 w-full justify-between">
                  <span>Less</span> <ChevronDown className="w-3 h-3 ml-1 transform rotate-180" />
                </button>

                <div className="mt-8 border border-gray-200 rounded-xl p-3 flex items-center justify-center cursor-pointer hover:bg-gray-50 transition">
                  <Play className="w-4 h-4 text-gray-800 fill-current mr-2" />
                  <span className="text-sm font-medium text-gray-800">Preview</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUCCESS MODAL (Your Agent is live) */}
      {isSuccessModalOpen && (
        <div className="fixed inset-0 bg-black/40 z-[70] flex items-center justify-center backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden relative">
            <button onClick={handleCloseSuccessModal} className="absolute top-4 right-4 text-gray-400 hover:text-white z-10 p-1 bg-black/20 rounded-full backdrop-blur-md transition">
              <X className="w-4 h-4" />
            </button>
            
            {/* Top Graphic Area */}
            <div className="h-48 w-full bg-gradient-to-br from-[#1a1235] to-[#0a0510] relative flex items-center justify-center p-6 border-b border-gray-100">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30"></div>
              
              <div className="text-center relative z-10 flex flex-col items-center mt-4">
                <div className="w-12 h-12 bg-orange-200 rounded-xl flex items-center justify-center mb-3 shadow-[0_0_20px_rgba(251,146,60,0.3)]">
                  <FileText className="w-6 h-6 text-orange-600" />
                </div>
                <h2 className="text-white font-semibold text-lg">{myAgents[0]?.name || "Custom Agent"}</h2>
              </div>
            </div>

            <div className="p-8 text-center bg-white relative">
              <div className="inline-flex items-center justify-center bg-white border border-gray-100 shadow-sm rounded-full px-4 py-1.5 -mt-12 mb-6 relative z-20">
                <span className="text-xs font-medium text-gray-700">🎉 Congratulations! You've unlocked <span className="text-teal-500 font-bold">50 Free AI Credits</span></span>
              </div>
              
              <h2 className="text-xl font-bold text-gray-900 mb-2 flex items-center justify-center">
                Your Agent is live - put it to work 🚀
              </h2>
              <p className="text-sm text-gray-500 mb-8 max-w-sm mx-auto">
                Let people talk to your agent via link, email, embed, or social channels.
              </p>

              <div className="flex items-center justify-center space-x-3 mb-10">
                <button 
                  onClick={() => handleAction('Try It Live')}
                  className="px-6 py-2.5 rounded-xl text-sm font-medium border border-purple-200 text-purple-600 hover:bg-purple-50 transition flex items-center"
                >
                  <Play className="w-4 h-4 mr-2" /> Try It Live
                </button>
                <button 
                  onClick={() => handleAction('Copy Link')}
                  className="px-6 py-2.5 rounded-xl text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 transition flex items-center shadow-sm"
                >
                  <Link2 className="w-4 h-4 mr-2" /> Copy Link
                </button>
              </div>

              {/* Action List Accordion */}
              <div className="space-y-0 border border-gray-100 rounded-xl overflow-hidden text-left bg-white shadow-sm">
                <div className="flex items-center justify-between p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition">
                  <div className="flex items-center text-sm font-medium text-gray-700"><Code className="w-4 h-4 mr-3 text-gray-400" /> &lt;&gt; Embed Code</div>
                  <Link2 className="w-4 h-4 text-gray-400" />
                </div>
                <div className="flex items-center justify-between p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition">
                  <div className="flex items-center text-sm font-medium text-gray-700"><QrCode className="w-4 h-4 mr-3 text-gray-400" /> QR Code</div>
                  <span className="text-gray-400 text-xl font-light leading-none mb-1">↓</span>
                </div>
                <div className="flex items-center justify-between p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition">
                  <div className="flex items-center text-sm font-medium text-gray-700"><CalendarIcon className="w-4 h-4 mr-3 text-gray-400" /> Add to Calendar</div>
                  <div className="flex space-x-1">
                    <div className="w-5 h-5 bg-blue-500 rounded flex items-center justify-center"><span className="text-[10px] text-white font-bold">G</span></div>
                    <ChevronDown className="w-4 h-4 text-gray-400 ml-1" />
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer transition">
                  <div className="flex items-center text-sm font-medium text-gray-700"><Share2 className="w-4 h-4 mr-3 text-gray-400" /> Share on Social</div>
                  <div className="flex space-x-1">
                    <div className="w-5 h-5 bg-blue-700 rounded flex items-center justify-center"><span className="text-[10px] text-white font-bold">in</span></div>
                    <div className="w-5 h-5 bg-black rounded flex items-center justify-center"><span className="text-[10px] text-white font-bold">X</span></div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SparklesIcon(props: any) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
    </svg>
  );
}