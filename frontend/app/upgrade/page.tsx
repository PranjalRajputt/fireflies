'use client';

import { useState } from 'react';
import { Check, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/context/ToastContext';

export default function UpgradePage() {
  const { addToast } = useToast();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');

  const handleUpgrade = (planName: string) => {
    addToast(`Redirecting to secure checkout for ${planName} plan...`, 'info');
  };

  return (
    <div className="max-w-[1200px] mx-auto p-8 relative">
      
      {/* Header */}
      <div className="text-center mt-4 mb-10">
        <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-2">You are on the Free plan</h1>
        <p className="text-sm text-gray-500">You need to upgrade your plan to perform this action.</p>
      </div>

      {/* Billing Toggle */}
      <div className="flex justify-center mb-12">
        <div className="inline-flex items-center bg-gray-50 border border-gray-200 rounded-lg p-1">
          <button 
            onClick={() => setBillingCycle('monthly')}
            className={`px-6 py-2 text-sm font-medium rounded-md transition ${billingCycle === 'monthly' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            MONTHLY
          </button>
          <button 
            onClick={() => setBillingCycle('annual')}
            className={`px-6 py-2 text-sm font-medium rounded-md transition flex items-center ${billingCycle === 'annual' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            ANNUAL 
            <span className="ml-2 bg-green-100 text-green-700 text-[10px] font-bold px-1.5 py-0.5 rounded">40% OFF</span>
          </button>
        </div>
      </div>

      {/* Pricing Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Free Plan */}
        <div className="flex flex-col h-full">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-purple-600 flex items-center mb-2">
              Free <CheckCircle2 className="w-5 h-5 ml-1 fill-purple-600 text-white" />
            </h2>
            <p className="text-xs text-gray-500 h-8">For individuals starting with Fireflies</p>
          </div>
          <div className="mb-8">
            <div className="text-3xl font-semibold text-gray-900 mb-1">$0</div>
            <p className="text-xs text-gray-400">Free forever</p>
          </div>
          <div className="flex-1 space-y-4 text-sm text-gray-600 mb-8">
            <div className="flex items-start"><Check className="w-4 h-4 text-gray-300 mr-3 shrink-0 mt-0.5" /> Unlimited transcription*</div>
            <div className="flex items-start"><Check className="w-4 h-4 text-gray-300 mr-3 shrink-0 mt-0.5" /> Limited AI summaries</div>
            <div className="flex items-start"><Check className="w-4 h-4 text-gray-300 mr-3 shrink-0 mt-0.5" /> 400 minutes of storage/team</div>
            
            <div className="pt-4 mt-4 text-xs text-gray-400">Features</div>
            <div className="flex items-start"><Check className="w-4 h-4 text-gray-300 mr-3 shrink-0 mt-0.5" /> Record Zoom, GMeet, MS Teams, more</div>
          </div>
          <button className="w-full py-2.5 rounded-xl text-sm font-medium text-gray-400 bg-transparent transition cursor-default">
            Current
          </button>
        </div>

        {/* Pro Plan */}
        <div className="flex flex-col h-full border-l border-gray-100 pl-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-purple-600 mb-2">Pro</h2>
            <p className="text-xs text-gray-500 h-8">Best suited for individuals and small teams</p>
          </div>
          <div className="mb-8">
            <div className="text-3xl font-semibold text-gray-900 mb-1">{billingCycle === 'annual' ? '$10' : '$18'}</div>
            <p className="text-xs text-gray-400">Per seat/month billed {billingCycle}</p>
          </div>
          <div className="flex-1 space-y-4 text-sm text-gray-600 mb-8">
            <div className="flex items-start"><Check className="w-4 h-4 text-gray-300 mr-3 shrink-0 mt-0.5" /> Unlimited transcription</div>
            <div className="flex items-start"><Check className="w-4 h-4 text-gray-300 mr-3 shrink-0 mt-0.5" /> Unlimited AI summaries</div>
            <div className="flex items-start"><Check className="w-4 h-4 text-gray-300 mr-3 shrink-0 mt-0.5" /> 8,000 mins of storage/seat</div>
            
            <div className="pt-4 mt-4 text-xs text-gray-400">Everything in Free, plus</div>
            <div className="flex items-start"><Check className="w-4 h-4 text-gray-300 mr-3 shrink-0 mt-0.5" /> Capture meeting video</div>
          </div>
          <button onClick={() => handleUpgrade('Pro')} className="w-full py-2.5 rounded-xl text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 transition shadow-sm">
            Upgrade
          </button>
        </div>

        {/* Business Plan */}
        <div className="flex flex-col h-full border-l border-gray-100 pl-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-purple-600 flex items-center justify-between mb-2">
              Business <span className="bg-pink-100 text-pink-600 text-[10px] font-bold px-2 py-0.5 rounded uppercase">Most Popular</span>
            </h2>
            <p className="text-xs text-gray-500 h-8">Manage your fast growing team or business</p>
          </div>
          <div className="mb-8">
            <div className="text-3xl font-semibold text-gray-900 mb-1">{billingCycle === 'annual' ? '$19' : '$29'}</div>
            <p className="text-xs text-gray-400">Per seat/month billed {billingCycle}</p>
          </div>
          <div className="flex-1 space-y-4 text-sm text-gray-600 mb-8">
            <div className="flex items-start"><Check className="w-4 h-4 text-gray-300 mr-3 shrink-0 mt-0.5" /> Unlimited transcription</div>
            <div className="flex items-start"><Check className="w-4 h-4 text-gray-300 mr-3 shrink-0 mt-0.5" /> Unlimited AI summaries</div>
            <div className="flex items-start"><Check className="w-4 h-4 text-gray-300 mr-3 shrink-0 mt-0.5" /> Unlimited storage</div>
            
            <div className="pt-4 mt-4 text-xs text-gray-400">Everything in Pro, plus</div>
            <div className="flex items-start"><Check className="w-4 h-4 text-gray-300 mr-3 shrink-0 mt-0.5" /> Multi-language mode</div>
          </div>
          <button onClick={() => handleUpgrade('Business')} className="w-full py-2.5 rounded-xl text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 transition shadow-sm">
            Upgrade
          </button>
        </div>

        {/* Enterprise Plan */}
        <div className="flex flex-col h-full border-l border-gray-100 pl-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-purple-600 mb-2">Enterprise</h2>
            <p className="text-xs text-gray-500 h-8">For advanced security, control & support</p>
          </div>
          <div className="mb-8">
            <div className="text-3xl font-semibold text-gray-900 mb-1">{billingCycle === 'annual' ? '$39' : '$59'}</div>
            <p className="text-xs text-gray-400">Per seat/month billed {billingCycle}</p>
          </div>
          <div className="flex-1 space-y-4 text-sm text-gray-600 mb-8">
            <div className="flex items-start"><Check className="w-4 h-4 text-gray-300 mr-3 shrink-0 mt-0.5" /> Unlimited transcription</div>
            <div className="flex items-start"><Check className="w-4 h-4 text-gray-300 mr-3 shrink-0 mt-0.5" /> Unlimited AI summaries</div>
            <div className="flex items-start"><Check className="w-4 h-4 text-gray-300 mr-3 shrink-0 mt-0.5" /> Unlimited storage</div>
            
            <div className="pt-4 mt-4 text-xs text-gray-400">Everything in Business, plus</div>
            <div className="flex items-start items-center">
              <Check className="w-4 h-4 text-gray-300 mr-3 shrink-0" /> 
              Rules engine <span className="bg-green-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded ml-2">NEW</span>
            </div>
          </div>
          <button onClick={() => handleUpgrade('Enterprise')} className="w-full py-2.5 rounded-xl text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 transition shadow-sm">
            Upgrade
          </button>
        </div>

      </div>
    </div>
  );
}