
import React, { useState, useRef, useEffect } from 'react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const tabs = [
    { id: 'dashboard', label: 'DASHBOARD' },
    { id: 'workout', label: 'WORKOUTS' },
    { id: 'nutrition', label: 'NUTRITION' },
    { id: 'progress', label: 'PROGRESS' },
    { id: 'chat', label: 'COACH CHAT' },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 glass border-b border-zinc-800 px-4 pt-4 pb-2 sm:px-8">
      <div className="max-w-7xl mx-auto space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center font-oswald text-2xl font-bold italic shadow-lg shadow-blue-900/40">A</div>
            <div className="flex flex-col">
              <h1 className="font-oswald text-2xl font-bold tracking-tighter text-white uppercase leading-none">ABEBE AI</h1>
              <span className="text-[10px] text-blue-400 font-bold tracking-[0.3em] uppercase opacity-80">Hypertrophy Elite</span>
            </div>
          </div>

          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-zinc-400 hover:text-blue-400 transition-colors"
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        <nav className="hidden md:flex items-center justify-between border-t border-zinc-800/50 pt-3">
          <div className="flex gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`px-4 py-2 rounded-md text-[11px] font-bold transition-all whitespace-nowrap tracking-[0.15em] uppercase ${
                  activeTab === tab.id
                    ? 'text-blue-400 border-b-2 border-blue-600'
                    : 'text-zinc-500 hover:text-white hover:bg-zinc-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <button 
            onClick={() => setActiveTab('settings')}
            className={`p-2 rounded-lg transition-all group ${
              activeTab === 'settings' 
                ? 'bg-blue-600 text-white' 
                : 'text-zinc-500 hover:text-white hover:bg-zinc-800'
            }`}
            title="App Settings"
          >
            <svg className="w-5 h-5 transform group-hover:rotate-90 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </nav>

        {isMobileMenuOpen && (
          <div ref={menuRef} className="md:hidden space-y-1 pb-4 animate-in slide-in-from-top duration-300">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold tracking-widest uppercase transition-colors ${
                  activeTab === tab.id ? 'bg-blue-600 text-white' : 'text-zinc-400 hover:bg-zinc-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
            <div className="h-[1px] bg-zinc-800 mx-4 my-2"></div>
            <button
              onClick={() => {
                setActiveTab('settings');
                setIsMobileMenuOpen(false);
              }}
              className={`w-full text-left px-4 py-3 rounded-xl flex items-center justify-between group transition-colors ${
                activeTab === 'settings' ? 'bg-blue-600 text-white' : 'text-zinc-500 hover:bg-zinc-800'
              }`}
            >
              <span className="text-xs font-bold tracking-widest uppercase">APP SETTINGS</span>
              <svg className="w-5 h-5 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
