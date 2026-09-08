'use client';

import { useState } from 'react';
import { Search, Sparkles, CheckCircle2, MessageSquare } from 'lucide-react';
import { useToast } from '@/context/ToastContext';

const INTEGRATIONS = [
  { name: 'ActiveCampaign', category: 'CRM', desc: 'Sync Fireflies meeting notes to ActiveCampaign CRM and keep contacts and companies automatically updated.', icon: '▶' },
  { name: 'Activepieces', category: 'MCP', desc: 'Activepieces offers a no-code integration with Fireflies.ai, enabling users to automate workflows involving meeting...', icon: '▲' },
  { name: 'Affinity', category: 'CRM', desc: 'Automatically sync meeting data and tasks to the relevant people and companies in Affinity, streamlining your...', icon: '∰' },
  { name: 'HubSpot', category: 'CRM', desc: 'Log notes, call activities, and transcripts directly to HubSpot CRM contacts and deals seamlessly.', icon: '🟠' },
  { name: 'Slack', category: 'MCP', desc: 'Receive real-time AI summaries and channel notifications instantly when your meetings conclude.', icon: '💬' },
  { name: 'Notion', category: 'MCP', desc: 'Export structured meeting notes, transcripts, and action items directly into your Notion workspace.', icon: '📝' },
];

export default function IntegrationsPage() {
  const { addToast } = useToast();
  const [activeSubTab, setActiveSubTab] = useState<'discover' | 'connected'>('discover');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [connectedApps, setConnectedApps] = useState<string[]>([]);

  const handleConnect = (appName: string) => {
    if (connectedApps.includes(appName)) {
      setConnectedApps(prev => prev.filter(app => app !== appName));
      addToast(`Disconnected from ${appName}`, 'info');
    } else {
      setConnectedApps(prev => [...prev, appName]);
      addToast(`Successfully connected to ${appName}!`, 'success');
    }
  };

  const filteredApps = INTEGRATIONS.filter(app => {
    const matchesCategory = selectedCategory === 'All' || app.category === selectedCategory || (selectedCategory === 'Audio recording' && app.name === 'Telegram');
    const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase()) || app.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-[1100px] mx-auto p-8">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Integrations</h1>

      {/* Main Discover / Connected Tabs */}
      <div className="flex space-x-8 border-b border-gray-200 mb-8 text-sm font-medium">
        <button 
          onClick={() => setActiveSubTab('discover')}
          className={`pb-3 transition relative ${activeSubTab === 'discover' ? 'text-purple-600 border-b-2 border-purple-600 font-semibold' : 'text-gray-500 hover:text-gray-900'}`}
        >
          Discover
        </button>
        <button 
          onClick={() => setActiveSubTab('connected')}
          className={`pb-3 transition relative ${activeSubTab === 'connected' ? 'text-purple-600 border-b-2 border-purple-600 font-semibold' : 'text-gray-500 hover:text-gray-900'}`}
        >
          Connected ({connectedApps.length})
        </button>
      </div>

      {activeSubTab === 'discover' && (
        <>
          {/* Featured Telegram Banner */}
          <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-8 mb-10 border border-blue-100 flex flex-col md:flex-row items-center justify-between shadow-sm">
            <div className="space-y-3 max-w-lg mb-6 md:mb-0">
              <div className="flex items-center space-x-2">
                <span className="w-12 h-12 bg-blue-500 text-white rounded-2xl flex items-center justify-center text-xl font-bold shadow-md">✈️</span>
                <h2 className="text-xl font-semibold text-gray-900">Telegram</h2>
                <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">NEW</span>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                Automatically log meeting insights from Fireflies into Telegram for easy tracking and sharing with your team.
              </p>
              <button 
                onClick={() => handleConnect('Telegram')}
                className={`px-6 py-2.5 rounded-xl text-sm font-medium transition shadow-sm ${connectedApps.includes('Telegram') ? 'bg-green-600 text-white' : 'bg-purple-600 text-white hover:bg-purple-700'}`}
              >
                {connectedApps.includes('Telegram') ? '✓ Connected' : '+ Connect'}
              </button>
            </div>

            {/* Preview Card Mock */}
            <div className="bg-white rounded-xl shadow-lg border p-4 w-72">
              <div className="flex items-center space-x-2 mb-3 border-b pb-2">
                <span className="w-6 h-6 bg-pink-500 text-white rounded-full flex items-center justify-center text-xs font-bold">S</span>
                <span className="text-xs font-semibold text-gray-800">Product Sync</span>
              </div>
              <div className="space-y-1.5 text-[11px] text-gray-500">
                <p className="font-semibold text-gray-700">Summary & Tasks</p>
                <p className="line-clamp-2">The team discussed the phased rollout of default AI apps, onboarding for new reps...</p>
              </div>
            </div>
          </div>

          {/* Filter Bar & Search */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
            <div className="flex flex-wrap gap-2 text-sm">
              {['All', 'Audio recording', 'Applicant tracking system', 'CRM', 'MCP'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-1.5 rounded-lg font-medium transition ${selectedCategory === cat ? 'bg-purple-50 text-purple-600 border border-purple-200' : 'text-gray-600 hover:bg-gray-100 border border-transparent'}`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search integrations..."
                className="w-full pl-9 pr-4 py-1.5 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-purple-500 bg-white"
              />
            </div>
          </div>

          {/* Integrations Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredApps.map((app) => {
              const isConnected = connectedApps.includes(app.name);
              return (
                <div key={app.name} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:border-purple-200 transition group">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-lg group-hover:scale-105 transition">
                        {app.icon}
                      </div>
                      {isConnected && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">{app.name}</h3>
                    <p className="text-xs text-gray-500 mb-6 leading-relaxed">{app.desc}</p>
                  </div>
                  <button 
                    onClick={() => handleConnect(app.name)}
                    className={`w-full py-2 rounded-xl text-sm font-medium transition ${isConnected ? 'bg-green-50 text-green-600 border border-green-200 hover:bg-green-100' : 'bg-purple-50 text-purple-600 hover:bg-purple-600 hover:text-white'}`}
                  >
                    {isConnected ? 'Connected' : '+ Connect'}
                  </button>
                </div>
              );
            })}
          </div>
        </>
      )}

      {activeSubTab === 'connected' && (
        <div className="py-12 text-center">
          {connectedApps.length === 0 ? (
            <div className="text-gray-500 text-sm">
              <p className="mb-2">No integrations connected yet.</p>
              <button onClick={() => setActiveSubTab('discover')} className="text-purple-600 font-medium hover:underline">
                Browse available integrations ›
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {connectedApps.map((appName) => (
                <div key={appName} className="bg-white border border-green-200 bg-green-50/20 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 rounded-xl bg-green-100 text-green-600 flex items-center justify-center font-bold">✓</div>
                      <span className="text-xs text-green-600 font-medium bg-green-100 px-2.5 py-1 rounded-full">Active</span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">{appName}</h3>
                    <p className="text-xs text-gray-500 mb-6">Successfully connected and syncing meeting data.</p>
                  </div>
                  <button 
                    onClick={() => handleConnect(appName)}
                    className="w-full bg-white border border-gray-200 text-gray-700 hover:bg-red-50 hover:text-red-600 hover:border-red-200 py-2 rounded-xl text-sm font-medium transition"
                  >
                    Disconnect
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}