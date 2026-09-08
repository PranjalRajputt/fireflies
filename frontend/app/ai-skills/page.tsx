'use client';

import { useState } from 'react';
import { Search, Plus, Sparkles, CheckCircle2, MessageSquare, X, ChevronRight, SlidersHorizontal, ArrowRight, Play } from 'lucide-react';
import { useToast } from '@/context/ToastContext';
import { useRouter } from 'next/navigation';

const ENGINEERING_SKILLS = [
  { id: 'automation', name: 'Automation Finder', usage: '52.8k', desc: 'Identify tasks that could benefit from automation.' },
  { id: 'process', name: 'Process Improvement', usage: '45k', desc: 'Propose improvements in process for Engineers.' },
  { id: 'feature', name: 'Feature Requirements', usage: '44.1k', desc: 'Extract clean software requirements and specifications from conversations.' },
  { id: 'scaling', name: 'Infrastructure Scaling', usage: '14.1k', desc: 'Analyze technical bottlenecks and scaling constraints discussed.' },
  { id: 'costs', name: 'Infrastructure Costs', usage: '10.6k', desc: 'Track cloud spend mentions and financial optimization ideas.' },
  { id: 'alerts', name: 'Alert Thresholds', usage: '9.9k', desc: 'Surface monitoring alerts, uptime targets, and reliability goals.' },
  { id: 'resource', name: 'Resource Allocation', usage: '5.7k', desc: 'Monitor engineering bandwidth and team assignments.' },
];

export default function AISkillsPage() {
  const router = useRouter();
  const { addToast } = useToast();
  
  const [mainTab, setMainTab] = useState<'discover' | 'active' | 'feed'>('discover');
  const [activeSubTab, setActiveSubTab] = useState<'my' | 'team'>('my');
  const [selectedCategory, setSelectedCategory] = useState('Engineering');
  const [selectedSkill, setSelectedSkill] = useState(ENGINEERING_SKILLS[0]);
  const [activeSkillIds, setActiveSkillIds] = useState<string[]>(['automation']);
  
  // Create Skill Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createStep, setCreateStep] = useState(1);
  const [skillPrompt, setSkillPrompt] = useState('');

  const handleToggleSkill = (skillId: string) => {
    setActiveSkillIds(prev => {
      const isEnabled = prev.includes(skillId);
      if (!isEnabled) {
        addToast(`${ENGINEERING_SKILLS.find(s => s.id === skillId)?.name} skill is now enabled.`, 'success');
        return [...prev, skillId];
      }
      return prev.filter(id => id !== skillId);
    });
  };

  const handleEnableAll = () => {
    setActiveSkillIds(ENGINEERING_SKILLS.map(s => s.id));
    addToast('All recommended engineering skills enabled!', 'success');
  };

  return (
    <div className="max-w-[1100px] mx-auto p-8 relative">
      
      {/* Top Banner */}
      <div className="bg-[#fcf4fb] border border-pink-100 rounded-xl px-6 py-3 flex items-center justify-between mb-8 shadow-sm">
        <div className="flex items-center space-x-2 text-sm text-gray-800 font-medium">
          <span className="text-pink-500 font-bold">✦</span>
          <span>Meet AI Skills — Automate meeting insights, follow-ups, and reports.</span>
          <button className="text-purple-600 font-semibold hover:underline flex items-center ml-2">
            See how it works <ChevronRight className="w-4 h-4 ml-0.5" />
          </button>
        </div>
        <button onClick={() => addToast('Banner dismissed', 'info')} className="text-gray-400 hover:text-gray-600">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Main Header & Tabs */}
      <div className="flex items-center justify-between border-b border-gray-200 mb-8">
        <div className="flex space-x-8 text-sm font-medium">
          <button 
            onClick={() => setMainTab('discover')}
            className={`pb-3 transition relative ${mainTab === 'discover' ? 'text-purple-600 border-b-2 border-purple-600 font-semibold' : 'text-gray-500 hover:text-gray-900'}`}
          >
            Discover
          </button>
          <button 
            onClick={() => setMainTab('active')}
            className={`pb-3 transition relative ${mainTab === 'active' ? 'text-purple-600 border-b-2 border-purple-600 font-semibold' : 'text-gray-500 hover:text-gray-900'}`}
          >
            Active Skills ({activeSkillIds.length})
          </button>
          <button 
            onClick={() => setMainTab('feed')}
            className={`pb-3 transition relative ${mainTab === 'feed' ? 'text-purple-600 border-b-2 border-purple-600 font-semibold' : 'text-gray-500 hover:text-gray-900'}`}
          >
            Feed
          </button>
        </div>

        <button 
          onClick={() => { setIsCreateModalOpen(true); setCreateStep(1); }}
          className="bg-purple-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-purple-700 transition flex items-center shadow-sm mb-3"
        >
          <Plus className="w-4 h-4 mr-1.5" /> Create Skill
        </button>
      </div>

      {/* DISCOVER TAB */}
      {mainTab === 'discover' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Left Column: Skill List */}
          <div className="md:col-span-7 space-y-4">
            
            {/* Category Selector */}
            <div className="flex items-center space-x-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 shadow-sm">
              <span className="text-gray-400 text-xs font-mono">&lt;&gt;</span>
              <select 
                value={selectedCategory} 
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-transparent text-sm font-medium text-gray-800 outline-none border-none"
              >
                <option>Engineering</option>
                <option>Product & Design</option>
                <option>Sales & Success</option>
                <option>Marketing</option>
              </select>
            </div>

            {/* List */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm divide-y divide-gray-100 overflow-hidden">
              {ENGINEERING_SKILLS.map((skill) => {
                const isSelected = selectedSkill.id === skill.id;
                const isEnabled = activeSkillIds.includes(skill.id);
                return (
                  <div 
                    key={skill.id}
                    onClick={() => setSelectedSkill(skill)}
                    className={`p-4 flex items-center justify-between cursor-pointer transition ${isSelected ? 'bg-purple-50/40 border-l-4 border-purple-600' : 'hover:bg-gray-50'}`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-sm">✦</div>
                      <span className="text-sm font-medium text-gray-900">{skill.name}</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-xs text-gray-400">⚡ {skill.usage}</span>
                      <div 
                        onClick={(e) => { e.stopPropagation(); handleToggleSkill(skill.id); }}
                        className={`w-10 h-6 rounded-full flex items-center p-1 cursor-pointer transition-colors ${isEnabled ? 'bg-purple-600' : 'bg-gray-200'}`}
                      >
                        <div className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform ${isEnabled ? 'translate-x-4' : ''}`}></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Skill Detail Inspector */}
          <div className="md:col-span-5 space-y-6">
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm relative">
              <div className="flex items-center justify-between mb-6">
                <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-lg">✦</div>
                <button className="text-xs font-medium text-gray-500 hover:text-gray-900 flex items-center">
                  Copy Link
                </button>
              </div>

              <h2 className="text-lg font-semibold text-gray-900 mb-2">{selectedSkill.name}</h2>
              <p className="text-sm text-gray-500 mb-6 leading-relaxed">{selectedSkill.desc}</p>

              <div className="flex items-center space-x-2 text-xs text-gray-400 mb-8 border-b pb-4">
                <span className="font-medium text-gray-700">Pranjal Raj</span>
                <span>•</span>
                <span>⚡ {selectedSkill.usage}</span>
              </div>

              <div className="flex items-center space-x-3">
                <button 
                  onClick={() => handleToggleSkill(selectedSkill.id)}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition shadow-sm ${activeSkillIds.includes(selectedSkill.id) ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-purple-600 text-white hover:bg-purple-700'}`}
                >
                  {activeSkillIds.includes(selectedSkill.id) ? 'Enabled' : 'Enable'}
                </button>
                <button 
                  onClick={() => addToast('Launching interactive skill preview...', 'info')}
                  className="px-4 py-2.5 rounded-xl text-sm font-medium border border-gray-200 text-gray-700 hover:bg-gray-50 transition"
                >
                  Try Skill
                </button>
                <button 
                  onClick={() => { setIsCreateModalOpen(true); setCreateStep(1); }}
                  className="px-4 py-2.5 rounded-xl text-sm font-medium border border-gray-200 text-gray-700 hover:bg-gray-50 transition"
                >
                  Edit
                </button>
              </div>
            </div>

            {/* Slack Widget */}
            <div className="bg-white border border-gray-200 rounded-2xl p-4 flex items-center justify-between shadow-sm">
              <div className="flex items-center space-x-3">
                <span className="text-xl">💬</span>
                <div>
                  <h4 className="text-xs font-bold text-gray-800">Get insights on Slack</h4>
                  <p className="text-[11px] text-gray-500">Receive skills output to your Slack channel.</p>
                </div>
              </div>
              <button onClick={() => router.push('/integrations')} className="text-xs font-semibold text-purple-600 hover:underline">
                Connect →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ACTIVE SKILLS TAB */}
      {mainTab === 'active' && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <div className="flex space-x-2 text-sm font-medium">
              <button onClick={() => setActiveSubTab('my')} className={`px-4 py-1.5 rounded-lg border ${activeSubTab === 'my' ? 'bg-purple-50 border-purple-200 text-purple-700' : 'border-gray-200 text-gray-600 bg-white'}`}>My Skills</button>
              <button onClick={() => setActiveSubTab('team')} className={`px-4 py-1.5 rounded-lg border ${activeSubTab === 'team' ? 'bg-purple-50 border-purple-200 text-purple-700' : 'border-gray-200 text-gray-600 bg-white'}`}>Team Skills</button>
            </div>
            
            <div className="flex items-center space-x-3 text-xs text-gray-500">
              <span className="flex items-center bg-gray-100 px-3 py-1.5 rounded-lg cursor-pointer">Category ▾</span>
              <span className="flex items-center bg-gray-100 px-3 py-1.5 rounded-lg cursor-pointer">Schedule ▾</span>
              <span className="flex items-center bg-gray-100 px-3 py-1.5 rounded-lg cursor-pointer">Created by 1 ▾</span>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl divide-y divide-gray-100 shadow-sm">
            {ENGINEERING_SKILLS.filter(s => activeSkillIds.includes(s.id)).map((skill) => (
              <div key={skill.id} className="p-5 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center font-bold">✦</div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{skill.name}</h3>
                    <p className="text-xs text-gray-400 mt-0.5">Pranjal Raj • Per Meeting</p>
                  </div>
                </div>
                <div 
                  onClick={() => handleToggleSkill(skill.id)}
                  className="w-10 h-6 bg-purple-600 rounded-full flex items-center justify-end p-1 cursor-pointer"
                >
                  <div className="w-4 h-4 bg-white rounded-full shadow-sm"></div>
                </div>
              </div>
            ))}
            {activeSkillIds.length === 0 && (
              <div className="py-16 text-center text-gray-500 text-sm">
                No active skills enabled. Go to the Discover tab to enable skills.
              </div>
            )}
          </div>
        </div>
      )}

      {/* FEED TAB */}
      {mainTab === 'feed' && (
        <div className="py-16 text-center bg-white border border-gray-200 rounded-2xl shadow-sm">
          <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3 text-gray-400">🔔</div>
          <h3 className="font-medium text-gray-900 mb-1">You have no new updates</h3>
          <p className="text-xs text-gray-400 max-w-xs mx-auto mb-6">Nothing here for this time range. Try enabling more skills to generate automated insights.</p>
          <button onClick={() => setMainTab('discover')} className="bg-purple-600 text-white px-5 py-2 rounded-xl text-sm font-medium hover:bg-purple-700 transition">
            Explore Skills
          </button>
        </div>
      )}

      {/* CREATE SKILL MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center backdrop-blur-sm">
          <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden p-8 relative flex flex-col md:flex-row h-auto min-h-[500px]">
            <button onClick={() => setIsCreateModalOpen(false)} className="absolute top-6 right-6 text-gray-300 hover:text-gray-500 z-10"><X className="w-5 h-5" /></button>
            
            {/* Left Box */}
            <div className="w-full md:w-1/2 pr-8 border-r border-gray-100 flex flex-col justify-between">
              <div>
                <div className="flex items-center space-x-2 mb-6">
                  <span className="w-6 h-6 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center text-xs font-bold">✦</span>
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Untitled Skill</span>
                </div>
                
                <h2 className="text-xl font-semibold text-gray-900 mb-2">What Would You Like To Do?</h2>
                <p className="text-xs text-gray-500 mb-6 leading-relaxed">Describe what the skill should do. The clearer your prompt, the better the results.</p>

                <textarea 
                  rows={4}
                  value={skillPrompt}
                  onChange={(e) => setSkillPrompt(e.target.value)}
                  placeholder="Create a Skill that..."
                  className="w-full border border-purple-300 rounded-xl p-4 text-sm outline-none focus:ring-2 focus:ring-purple-500 resize-none shadow-sm"
                />
              </div>

              <div className="flex items-center justify-between pt-6 border-t mt-6">
                <span className="text-xs text-gray-400 font-medium">{createStep} of 2</span>
                <div className="space-x-3">
                  <button onClick={() => setIsCreateModalOpen(false)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">Cancel</button>
                  <button 
                    onClick={() => {
                      if (createStep === 1) setCreateStep(2);
                      else {
                        addToast('Custom skill successfully created!', 'success');
                        setIsCreateModalOpen(false);
                      }
                    }}
                    className="px-6 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition"
                  >
                    {createStep === 1 ? 'Next' : 'Save Skill'}
                  </button>
                </div>
              </div>
            </div>

            {/* Right Box */}
            <div className="w-full md:w-1/2 pl-8 flex flex-col items-center justify-center text-center">
              <Sparkles className="w-8 h-8 text-gray-300 mb-3" />
              <h3 className="text-gray-900 font-medium mb-1">Select at least 2 meetings to preview notes</h3>
              <p className="text-xs text-gray-400 mb-6 max-w-xs leading-relaxed">Refine your instructions based on the output.</p>
              
              <select className="w-64 border border-gray-200 rounded-xl px-4 py-2.5 mb-4 text-sm outline-none text-gray-400 bg-gray-50">
                <option>Select meetings</option>
              </select>

              <button disabled className="flex items-center text-gray-300 text-sm font-medium cursor-not-allowed">
                <Play className="w-4 h-4 mr-2 fill-current" /> Preview Notes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}