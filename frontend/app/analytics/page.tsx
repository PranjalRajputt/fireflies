'use client';

import { Star, BarChart2, TrendingUp, Users, Clock, ArrowUpRight } from 'lucide-react';
import { useToast } from '@/context/ToastContext';

export default function AnalyticsPage() {
  const { addToast } = useToast();

  const handleAction = (actionType: string) => {
    if (actionType === 'trial') {
      addToast('Business trial requested! Our team will activate your access shortly.', 'success');
    } else {
      addToast('Redirecting to secure billing portal...', 'info');
    }
  };

  return (
    <div className="max-w-[1100px] mx-auto p-8 relative min-h-[calc(100vh-64px)] overflow-hidden">
      
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Analytics</h1>
      </div>

      {/* Blurred Mock Background Dashboard */}
      <div className="filter blur-sm select-none pointer-events-none opacity-40 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {['Total Meeting Time', 'Speakers Tracked', 'Action Items Generated', 'AI Summaries'].map((stat, i) => (
            <div key={stat} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <p className="text-xs text-gray-500 font-medium mb-1">{stat}</p>
              <h3 className="text-2xl font-bold text-gray-900">{['48.5 hrs', '124', '310', '100%'][i]}</h3>
              <p className="text-[11px] text-green-600 mt-2 flex items-center">↑ +14% this month</p>
            </div>
          ))}
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm h-72 flex items-center justify-center">
          <div className="flex items-end space-x-4 h-40">
            {[40, 70, 45, 90, 65, 80, 100, 85, 60, 95].map((h, i) => (
              <div key={i} className="w-10 bg-purple-100 rounded-t-lg flex items-end justify-center" style={{ height: `${h}%` }}>
                <div className="w-full bg-purple-600 rounded-t-lg" style={{ height: `${h * 0.7}%` }}></div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <div className="space-y-4">
            {[1, 2, 3].map((row) => (
              <div key={row} className="flex items-center justify-between border-b pb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-gray-100"></div>
                  <div className="space-y-1">
                    <div className="w-32 h-3 bg-gray-200 rounded"></div>
                    <div className="w-20 h-2 bg-gray-100 rounded"></div>
                  </div>
                </div>
                <div className="w-16 h-4 bg-purple-50 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Upgrade Modal Overlay (Exact match to screenshot) */}
      <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/10 backdrop-blur-[2px]">
        <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-gray-100 p-8 text-center relative overflow-hidden">
          
          {/* Gold Star Icon Badge */}
          <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-amber-100">
            <Star className="w-8 h-8 text-amber-400 fill-amber-400" />
          </div>

          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Upgrade your account to view analytics
          </h2>
          
          <p className="text-sm text-gray-500 mb-8 max-w-sm mx-auto leading-relaxed">
            You are on the free plan. To view your analytics please upgrade to business plan.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button 
              onClick={() => handleAction('trial')}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-sm font-medium border border-gray-200 text-gray-700 hover:bg-gray-50 transition shadow-sm"
            >
              Request free trial
            </button>
            <button 
              onClick={() => handleAction('upgrade')}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 transition shadow-md"
            >
              Upgrade account
            </button>
          </div>

        </div>
      </div>

    </div>
  );
}