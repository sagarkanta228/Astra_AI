import React from 'react';

export default function Navbar({ currentRole, currentUser, activeView, setActiveView, onOpenDemo, onLogout, onToggleAISidebar }) {
  const isAdmin = currentRole === 'ADMIN';
  const displayName = currentUser?.fullName || (isAdmin ? 'Sarah Jenkins' : 'Robert Vance');
  const avatarUrl = currentUser?.avatar || (
    isAdmin
      ? "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"
      : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
  );

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-[#080a0f]/95 backdrop-blur-xl border-b border-[#161b26] flex items-center justify-between px-4 lg:px-6 shadow-md font-sans">
      {/* Brand Logo & Search */}
      <div className="flex items-center gap-6">
        <a 
          className="flex items-center gap-3 cursor-pointer select-none" 
          onClick={() => setActiveView(isAdmin ? 'admin-dashboard' : 'user-dashboard')}
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#f59e0b] via-[#d97706] to-[#ef4444] p-[1px] shadow-[0_0_15px_rgba(245,158,11,0.3)]">
            <div className="w-full h-full rounded-xl bg-[#080a0f] flex items-center justify-center">
              <span className="material-symbols-outlined text-[#f59e0b] text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                shield_locked
              </span>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-heading text-lg font-bold text-white tracking-wider flex items-center gap-1">
              ASTRA <span className="text-[#f59e0b]">SOC</span>
            </span>
            <span className="text-[8px] font-mono text-[#64748b] tracking-tight uppercase hidden sm:inline">
              ENTERPRISE THREAT DEFENSE & SECURITY PLATFORM
            </span>
          </div>
        </a>

        {/* Global Search Input Bar */}
        <div className="hidden md:flex items-center gap-2 bg-[#0f141e] border border-[#1e2638] px-4 py-1.5 rounded-full w-72 lg:w-96 focus-within:border-[#f59e0b]/60 transition-all">
          <span className="material-symbols-outlined text-[#64748b] text-[18px]">search</span>
          <input
            type="text"
            placeholder="Search threats, logs, users, IP addresses..."
            className="w-full bg-transparent text-xs text-white placeholder-[#64748b] focus:outline-none font-sans"
          />
        </div>
      </div>

      {/* Right Controls & Utilities */}
      <div className="flex items-center gap-3 lg:gap-4">
        {/* AI Copilot Quick Trigger for Admins */}
        {isAdmin && onToggleAISidebar && (
          <button
            className="px-3 py-1.5 rounded-full bg-[#8b5cf6]/20 border border-[#8b5cf6]/40 text-[#a78bfa] hover:text-white hover:bg-[#8b5cf6]/30 font-mono text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-[0_0_12px_rgba(139,92,246,0.25)]"
            onClick={onToggleAISidebar}
            title="Toggle Groq AI Copilot Sidebar"
          >
            <span className="material-symbols-outlined text-[16px]">smart_toy</span>
            <span className="hidden sm:inline">AI COPILOT</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]"></span>
          </button>
        )}

        {/* Simulation / Demo Action */}
        <button
          className="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#f59e0b] to-[#d97706] text-[#080a0f] font-mono text-xs font-bold uppercase tracking-wider hover:brightness-110 transition-all flex items-center gap-1.5 shadow-[0_0_15px_rgba(245,158,11,0.25)] cursor-pointer border-0"
          onClick={onOpenDemo}
          title="Run Incident Simulation"
        >
          <span className="material-symbols-outlined text-[16px]">play_circle</span>
          <span className="hidden sm:inline">SCENARIO DEMO</span>
        </button>

        {/* Current Role Badge */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0f141e] border border-[#1e2638] font-mono text-[11px]">
          <span className={`w-2 h-2 rounded-full ${isAdmin ? 'bg-[#ef4444]' : 'bg-[#3b82f6]'}`}></span>
          <span className="font-bold text-white uppercase tracking-wider">
            {isAdmin ? 'SOC ANALYST (ADMIN)' : 'ENTERPRISE USER'}
          </span>
        </div>

        {/* User Profile Pill */}
        <div 
          className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-full bg-[#0f141e] border border-[#1e2638] cursor-pointer hover:border-[#f59e0b]/50 transition-all"
          onClick={() => setActiveView(isAdmin ? 'admin-users' : 'user-profile')}
          title={isAdmin ? "Manage Enterprise Users" : "View My Profile"}
        >
          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#f59e0b] to-[#d97706] p-[1px]">
            <img 
              className="w-full h-full rounded-full object-cover"
              src={avatarUrl} 
              alt="Profile" 
            />
          </div>
          <span className="text-xs font-semibold text-white max-w-[120px] truncate">
            {displayName}
          </span>
        </div>

        {/* Logout */}
        <button
          className="p-1.5 rounded-full bg-[#0f141e] border border-[#1e2638] text-[#64748b] hover:text-[#ef4444] hover:border-[#ef4444]/40 transition-all cursor-pointer flex items-center justify-center"
          title="Logout"
          onClick={onLogout}
        >
          <span className="material-symbols-outlined text-[18px]">logout</span>
        </button>
      </div>
    </header>
  );
}
