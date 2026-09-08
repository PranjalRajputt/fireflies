'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, Bell, Video, Calendar, Upload, Mic, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const router = useRouter();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCaptureOpen, setIsCaptureOpen] = useState(false);
  const captureRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (captureRef.current && !captureRef.current.contains(e.target as Node)) {
        setIsCaptureOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <>
      <header className="h-16 border-b bg-white flex items-center justify-between px-6 sticky top-0 z-20 w-full">
        {/* Search Bar */}
        <div className="flex items-center flex-1 max-w-xl">
          <div 
            className="relative w-full cursor-text"
            onClick={() => setIsSearchOpen(true)}
          >
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <div className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-400 hover:bg-gray-100 transition">
              Search by title or keyword (Ctrl + K)
            </div>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-500 font-medium">3 Free meetings</span>
          <button className="text-sm font-medium text-green-600 border border-green-200 bg-green-50 px-4 py-1.5 rounded-full hover:bg-green-100 transition">
            Upgrade
          </button>
          <Bell className="w-5 h-5 text-gray-500 cursor-pointer hover:text-gray-900" />
          
          {/* Capture Dropdown */}
          <div className="relative" ref={captureRef}>
            <button 
              onClick={() => setIsCaptureOpen(!isCaptureOpen)}
              className="flex items-center bg-purple-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-purple-700 transition"
            >
              <Video className="w-4 h-4 mr-2" />
              Capture 
              <span className="ml-2 text-xs">▼</span>
            </button>

            {isCaptureOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white border rounded-xl shadow-lg py-2 z-50">
                <button className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                  <Video className="w-4 h-4 mr-3 text-gray-400" /> Add to live meeting
                </button>
                <button className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                  <Calendar className="w-4 h-4 mr-3 text-gray-400" /> Schedule new meeting
                </button>
                <button 
                  onClick={() => {
                    setIsCaptureOpen(false);
                    router.push('/meetings/new');
                  }}
                  className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <Upload className="w-4 h-4 mr-3 text-gray-400" /> Upload audio or video
                </button>
                <button className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                  <Mic className="w-4 h-4 mr-3 text-gray-400" /> Start recording
                </button>
              </div>
            )}
          </div>

          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-bold ml-2 cursor-pointer">
            P
          </div>
        </div>
      </header>

      {/* Global Search Overlay Modal */}
      {isSearchOpen && (
        <div className="fixed inset-0 bg-black/20 z-50 flex justify-center pt-24 backdrop-blur-sm">
          <div className="bg-white w-full max-w-2xl rounded-xl shadow-2xl h-max overflow-hidden border">
            <div className="flex items-center p-4 border-b">
              <Search className="w-5 h-5 text-gray-400 mr-3" />
              <input 
                autoFocus
                type="text" 
                placeholder="Search by title or keyword..."
                className="flex-1 outline-none text-gray-700 text-lg"
              />
              <button onClick={() => setIsSearchOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 bg-gray-50 flex items-center justify-between cursor-pointer hover:bg-gray-100 transition">
              <div className="flex items-center text-purple-600 text-sm font-medium">
                <span className="w-6 h-6 bg-purple-100 rounded flex items-center justify-center mr-3">🤖</span>
                Ask Fred anything about your meetings
              </div>
              <span className="text-sm text-purple-600 font-medium">Try AskFred</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}