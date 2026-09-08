'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Home, Bot, Video, CheckSquare, Sparkles, BarChart2, Headset, 
  Mail, Layers, Settings, ChevronDown, PanelLeftClose, Smartphone, 
  Monitor, Puzzle, ArrowRight, PlaySquare
} from 'lucide-react';
import { useToast } from '@/context/ToastContext';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { addToast } = useToast();
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  useEffect(() => {
    const sidebar = document.getElementById('main-sidebar');
    if (sidebar && sidebar.nextElementSibling) {
      const mainContent = sidebar.nextElementSibling as HTMLElement;
      mainContent.style.transition = 'margin-left 0.3s ease-in-out, padding-left 0.3s ease-in-out, width 0.3s ease-in-out';
      if (isCollapsed) {
        mainContent.style.setProperty('margin-left', '64px', 'important');
        mainContent.style.setProperty('padding-left', '0px', 'important');
      } else {
        mainContent.style.removeProperty('margin-left');
        mainContent.style.removeProperty('padding-left');
      }
    }
  }, [isCollapsed]);

  const handleLinkClick = (path: string) => {
    setIsDropdownOpen(false);
    router.push(path);
  };

  const handleMockAction = (action: string) => {
    setIsDropdownOpen(false);
    addToast(`${action} action triggered`, 'info');
  };

  const navItems = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'AskFred', href: '/askfred', icon: Bot },
    { name: 'Meetings', href: '/meetings', icon: Video },
    { name: 'Tasks', href: '/tasks', icon: CheckSquare },
    { name: 'AI Skills', href: '/ai-skills', icon: Sparkles },
    { name: 'Analytics', href: '/analytics', icon: BarChart2 },
    { name: 'Voice Agents', href: '/voice-agents', icon: Headset },
  ];

  return (
    <aside 
      id="main-sidebar"
      className={`border-r border-gray-200 bg-[#fbfbfa] flex flex-col justify-between h-screen fixed left-0 top-0 pt-3 pb-4 overflow-y-visible z-40 transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-16 lg:w-[240px]'}`}
    >
      <div className="flex flex-col items-center lg:items-stretch relative w-full">
        <div className={`flex w-full mb-4 ${isCollapsed ? 'flex-col items-center space-y-4 px-0' : 'items-center justify-between px-3'}`}>
          <div 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className={`flex items-center hover:bg-gray-200 py-2 rounded-lg cursor-pointer transition ${isCollapsed ? 'w-10 h-10 justify-center' : 'flex-1 px-2'}`}
          >
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-slate-400 rounded text-white flex items-center justify-center text-xs font-bold shadow-sm">
                P
              </div>
              {!isCollapsed && <span className="text-sm font-medium text-gray-800">Pranjal</span>}
            </div>
            {!isCollapsed && <ChevronDown className="w-3 h-3 text-gray-500 ml-auto" />}
          </div>

          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`hidden lg:flex p-2 text-gray-400 hover:bg-gray-200 rounded-lg transition ${isCollapsed ? '' : 'ml-1'}`}
          >
            <PanelLeftClose className={`w-4 h-4 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {isDropdownOpen && (
          <div 
            ref={dropdownRef}
            className={`fixed top-16 w-[600px] bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 flex overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 ${isCollapsed ? 'left-20' : 'left-4'}`}
          >
            <div className="w-[45%] p-6 border-r border-gray-100 flex flex-col">
              <h2 className="text-lg font-semibold text-gray-900 leading-tight">Hi Pranjal</h2>
              <p className="text-xs text-gray-400 mb-6">mailrajsingh50@gmail.com</p>

              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-800 mb-1">Free</h3>
                <div className="flex justify-between text-xs text-gray-400 mb-2">
                  <span>3 left / 3 free meetings</span>
                </div>
                <div className="w-full bg-green-100 h-1.5 rounded-full mb-3">
                  <div className="w-full bg-green-500 h-1.5 rounded-full"></div>
                </div>
                <button 
                  onClick={() => handleLinkClick('/upgrade')}
                  className="w-full bg-green-50 hover:bg-green-100 text-green-700 font-semibold text-sm py-1.5 rounded-lg flex items-center justify-center transition"
                >
                  ⚡ Upgrade
                </button>
              </div>

              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-800 mb-1">Storage</h3>
                <div className="text-xs text-gray-400 mb-2">0 / 400 mins</div>
                <div className="w-full bg-gray-100 h-1.5 rounded-full">
                  <div className="w-0 bg-purple-500 h-1.5 rounded-full"></div>
                </div>
              </div>

              <div className="space-y-4 text-sm text-gray-600 font-medium flex-1">
                <button onClick={() => handleLinkClick('/settings?tab=refer')} className="flex items-center hover:text-purple-600 transition w-full">Refer and Earn $5</button>
                <div className="h-px bg-gray-100 w-full my-2"></div>
                <button onClick={() => handleMockAction('Playlist')} className="flex items-center hover:text-purple-600 transition w-full">Playlist</button>
                <button onClick={() => handleLinkClick('/settings')} className="flex items-center hover:text-purple-600 transition w-full">Settings</button>
                <button onClick={() => handleLinkClick('/settings?tab=members')} className="flex items-center hover:text-purple-600 transition w-full">My Team</button>
                <button onClick={() => handleMockAction('Manage Devices')} className="flex items-center hover:text-purple-600 transition w-full">Manage Devices</button>
                <button onClick={() => handleLinkClick('/settings?tab=rules')} className="flex items-center hover:text-purple-600 transition w-full">Platform Rules</button>
                <button onClick={() => handleMockAction('Logging out...')} className="flex items-center hover:text-red-600 transition w-full text-red-500 pt-2">Logout</button>
              </div>
            </div>

            <div className="w-[55%] bg-gray-50/50 p-6 space-y-4">
              <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
                <Smartphone className="w-6 h-6 text-pink-500 mb-2" />
                <h3 className="font-semibold text-gray-900 text-sm">Mobile App</h3>
                <p className="text-xs text-gray-500 mb-3 leading-relaxed">Transcribe and summarize in-person conversations with mobile app.</p>
                <div className="flex space-x-2">
                  <div className="w-6 h-6 bg-blue-50 rounded flex items-center justify-center"><Monitor className="w-3 h-3 text-blue-500" /></div>
                  <div className="w-6 h-6 bg-green-50 rounded flex items-center justify-center"><PlaySquare className="w-3 h-3 text-green-500" /></div>
                </div>
              </div>

              <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
                <Puzzle className="w-6 h-6 text-orange-500 mb-2" />
                <h3 className="font-semibold text-gray-900 text-sm">Chrome Extension</h3>
                <p className="text-xs text-gray-500 mb-3 leading-relaxed">Record and transcribe Google Meet calls without Fireflies notetaker bot.</p>
                <button onClick={() => handleMockAction('Installing Extension')} className="text-xs font-semibold text-gray-700 bg-white border border-gray-200 px-4 py-1.5 rounded-lg hover:bg-gray-50 transition shadow-sm">
                  Install
                </button>
              </div>

              <button onClick={() => handleMockAction('Downloading Desktop App')} className="w-full bg-gradient-to-r from-gray-900 to-black rounded-xl p-4 flex items-center justify-between text-white hover:opacity-90 transition shadow-md">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-purple-600 rounded flex items-center justify-center font-bold text-xs">F</div>
                  <span className="text-sm font-medium">Download Fireflies Desktop App</span>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </div>
        )}

        <nav className={`flex flex-col space-y-0.5 w-full ${isCollapsed ? 'px-2' : 'lg:px-3'}`}>
          {navItems.map((item) => {
            const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/');
            const Icon = item.icon;
            return (
              <Link 
                key={item.name} 
                href={item.href} 
                className={`flex items-center p-2.5 rounded-lg transition ${isActive ? 'bg-purple-100/50 text-purple-700' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'} ${isCollapsed ? 'justify-center' : 'justify-center lg:justify-start'}`}
              >
                <Icon className={`w-5 h-5 ${isCollapsed ? '' : 'lg:w-[18px] lg:h-[18px] lg:mr-3'} ${isActive ? 'text-purple-600' : 'text-gray-500'}`} />
                <span className={`text-sm ${isActive ? 'font-medium' : ''} ${isCollapsed ? 'hidden' : 'hidden lg:block'}`}>
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className={`flex flex-col space-y-0.5 mt-8 border-t border-gray-100 pt-4 w-full ${isCollapsed ? 'px-2 items-center' : 'lg:px-3 items-center lg:items-stretch'}`}>
        <Link href="/upgrade" className={`flex items-center p-2.5 rounded-lg text-green-600 hover:bg-gray-100 transition ${isCollapsed ? 'justify-center' : 'justify-center lg:justify-start'}`}>
          <svg className={`w-5 h-5 ${isCollapsed ? '' : 'lg:w-[18px] lg:h-[18px] lg:mr-3'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <span className={`text-sm font-medium ${isCollapsed ? 'hidden' : 'hidden lg:block'}`}>Upgrade</span>
          <span className={`ml-auto text-[10px] bg-green-100 px-1.5 py-0.5 rounded font-bold ${isCollapsed ? 'hidden' : 'hidden lg:block'}`}>40% OFF</span>
        </Link>
        
        <Link href="/email-assistant" className={`flex items-center p-2.5 rounded-lg text-gray-600 hover:bg-gray-100 transition mt-2 ${isCollapsed ? 'justify-center' : 'justify-center lg:justify-start'}`}>
          <Mail className={`w-5 h-5 text-red-400 ${isCollapsed ? '' : 'lg:w-[18px] lg:h-[18px] lg:mr-3'}`} />
          <span className={`text-sm ${isCollapsed ? 'hidden' : 'hidden lg:block'}`}>Try Email Assistant</span>
        </Link>
        
        <Link href="/integrations" className={`flex items-center p-2.5 rounded-lg text-gray-600 hover:bg-gray-100 transition ${isCollapsed ? 'justify-center' : 'justify-center lg:justify-start'}`}>
          <Layers className={`w-5 h-5 text-gray-500 ${isCollapsed ? '' : 'lg:w-[18px] lg:h-[18px] lg:mr-3'}`} />
          <span className={`text-sm ${isCollapsed ? 'hidden' : 'hidden lg:block'}`}>Integrations</span>
        </Link>
        
        <Link href="/settings" className={`flex items-center p-2.5 rounded-lg text-gray-600 hover:bg-gray-100 transition ${isCollapsed ? 'justify-center' : 'justify-center lg:justify-start'}`}>
          <Settings className={`w-5 h-5 text-gray-500 ${isCollapsed ? '' : 'lg:w-[18px] lg:h-[18px] lg:mr-3'}`} />
          <span className={`text-sm ${isCollapsed ? 'hidden' : 'hidden lg:block'}`}>Settings</span>
        </Link>
      </div>
    </aside>
  );
}