'use client';

import { useState, useRef, useEffect } from 'react';
import { Plus, Video, Calendar, Upload, Mic, CheckSquare, MessageSquare, X, Star } from 'lucide-react';
import { useToast } from '@/context/ToastContext';
import { useRouter } from 'next/navigation';

export default function TasksPage() {
  const router = useRouter();
  const { addToast } = useToast();
  
  const [activeTab, setActiveTab] = useState<'my' | 'all'>('my');
  const [isNewMenuOpen, setIsNewMenuOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [feedbackType, setFeedbackType] = useState('Something was unclear or hard to use');
  const [feedbackCategory, setFeedbackCategory] = useState('Tasks');
  const [rating, setRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState('');

  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsNewMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addToast("Thank you for your feedback!", "success");
    setIsFeedbackOpen(false);
    setRating(0);
    setFeedbackText('');
  };

  return (
    <div className="max-w-[1000px] mx-auto p-8 relative">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Tasks</h1>

      {/* Tabs and Feedback Button */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg text-sm font-medium">
          <button 
            onClick={() => setActiveTab('my')}
            className={`px-4 py-1.5 rounded-md transition ${activeTab === 'my' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            My Tasks
          </button>
          <button 
            onClick={() => setActiveTab('all')}
            className={`px-4 py-1.5 rounded-md transition ${activeTab === 'all' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            All Tasks
          </button>
        </div>
        <button 
          onClick={() => setIsFeedbackOpen(true)}
          className="flex items-center text-xs text-gray-500 hover:text-gray-700 font-medium bg-white border border-gray-200 px-3 py-1.5 rounded-lg shadow-sm transition"
        >
          <MessageSquare className="w-3.5 h-3.5 mr-1.5 text-gray-400" /> Share Feedback
        </button>
      </div>

      {/* Connect Work Apps Banner */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between mb-16 shadow-sm">
        <div className="flex items-center space-x-4">
          <div className="flex -space-x-1">
            <span className="w-6 h-6 rounded-full bg-red-100 text-red-500 flex items-center justify-center text-xs font-bold border border-white">A</span>
            <span className="w-6 h-6 rounded-full bg-orange-100 text-orange-500 flex items-center justify-center text-xs font-bold border border-white">M</span>
            <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-500 flex items-center justify-center text-xs font-bold border border-white">T</span>
            <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-500 flex items-center justify-center text-xs font-bold border border-white">Z</span>
          </div>
          <span className="text-sm text-gray-700 font-medium">Automatically send all your tasks to your work apps.</span>
        </div>
        <button 
          onClick={() => router.push('/integrations')}
          className="text-sm font-medium text-purple-600 hover:text-purple-700 bg-purple-50 px-4 py-1.5 rounded-lg border border-purple-100 transition"
        >
          Connect
        </button>
      </div>

      {/* Empty State / Main Content */}
      <div className="flex flex-col items-center justify-center py-12 relative">
        <div className="w-12 h-12 bg-purple-50 text-purple-500 rounded-xl flex items-center justify-center mb-4">
          <CheckSquare className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-1">All your meeting tasks in one place</h3>
        <p className="text-gray-500 text-sm mb-8 text-center max-w-sm">
          Manage, assign and update all your meeting tasks here.
        </p>

        {/* New Button with Dropdown */}
        <div className="relative" ref={menuRef}>
          <button 
            onClick={() => setIsNewMenuOpen(!isNewMenuOpen)}
            className="bg-purple-600 text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-purple-700 transition flex items-center shadow-sm"
          >
            <Plus className="w-4 h-4 mr-2" /> New
          </button>

          {isNewMenuOpen && (
            <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-3 w-64 bg-white border border-gray-100 rounded-2xl shadow-xl py-2 z-50">
              <button 
                onClick={() => { setIsNewMenuOpen(false); router.push('/'); }} 
                className="w-full flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
              >
                <Video className="w-4 h-4 mr-3 text-gray-400" /> Add to live meeting
              </button>
              <button 
                onClick={() => { setIsNewMenuOpen(false); router.push('/'); }} 
                className="w-full flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
              >
                <Calendar className="w-4 h-4 mr-3 text-gray-400" /> Schedule new meeting
              </button>
              <button 
                onClick={() => { setIsNewMenuOpen(false); router.push('/meetings/new'); }} 
                className="w-full flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
              >
                <Upload className="w-4 h-4 mr-3 text-gray-400" /> Upload audio or video
              </button>
              <button 
                onClick={() => { setIsNewMenuOpen(false); router.push('/'); }} 
                className="w-full flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
              >
                <Mic className="w-4 h-4 mr-3 text-gray-400" /> Start recording
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Share Feedback Modal */}
      {isFeedbackOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden p-6 relative">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Share Feedback</h2>
              <button onClick={() => setIsFeedbackOpen(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            
            <p className="text-sm text-gray-600 mb-2">
              We&apos;d love to hear your thoughts! Share your feedback with us and help us improve our product.
            </p>
            <p className="text-xs text-purple-600 mb-6 font-medium cursor-pointer hover:underline">
              Need support? Chat with our team
            </p>

            <form onSubmit={handleFeedbackSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Type:</label>
                <select 
                  value={feedbackType} 
                  onChange={(e) => setFeedbackType(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option>Something was unclear or hard to use</option>
                  <option>Bug report / Issue</option>
                  <option>Feature request</option>
                  <option>General praise</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Category:</label>
                <select 
                  value={feedbackCategory} 
                  onChange={(e) => setFeedbackCategory(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option>Tasks</option>
                  <option>Meetings & Transcripts</option>
                  <option>AI Summaries & Skills</option>
                  <option>Integrations</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Rate your experience:</label>
                <div className="flex space-x-1 my-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star 
                      key={star}
                      onClick={() => setRating(star)}
                      className={`w-6 h-6 cursor-pointer transition ${rating >= star ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
              </div>

              <div>
                <textarea 
                  rows={4}
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="Share anything you would like..."
                  className="w-full border border-gray-200 rounded-lg p-3 text-sm outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button 
                  type="button" 
                  onClick={() => setIsFeedbackOpen(false)} 
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg border border-gray-200"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg shadow-sm transition"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}