import React from 'react';

export default function Sidebar({ currentRole, activeView, setActiveView }) {
  const userNav = [
    { id: 'user-dashboard', label: 'Dashboard', icon: 'grid_view' },
    { id: 'user-files', label: 'File Manager', icon: 'folder_shared', badge: 'SCAN' },
    { id: 'user-analyze', label: 'Data Security', icon: 'lock', badge: '91' },
  ];

  const manageNav = [
    { id: 'user-alerts', label: 'Destinations', icon: 'inbox' },
    { id: 'user-incidents', label: 'Protection', icon: 'shield' },
    { id: 'user-profile', label: 'Data Classification', icon: 'tune' },
    { id: 'user-devices', label: 'Devices', icon: 'devices', badge: '12' },
  ];

  return (
    <aside className="fixed left-0 top-16 bottom-0 w-64 bg-[#080a0f] border-r border-[#161b26] flex flex-col justify-between z-40 p-4 overflow-y-auto">
      <div className="flex flex-col gap-5">
        {/* Sidebar Search Input */}
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#64748b] text-[16px]">search</span>
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#0f141e] border border-[#1e2638] text-xs text-white placeholder-[#64748b] focus:outline-none focus:border-[#f59e0b]/60"
          />
        </div>

        {/* Menu Section */}
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-mono text-[#64748b] font-semibold uppercase tracking-wider px-2 mb-1">
            Menu
          </span>
          {userNav.map((item) => (
            <button
              key={item.id}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl font-sans text-xs transition-all text-left border-0 cursor-pointer ${
                activeView === item.id || (activeView === 'user-dashboard' && item.id === 'user-dashboard')
                  ? 'bg-[#f59e0b]/15 text-[#f59e0b] border border-[#f59e0b]/30 shadow-[0_0_12px_rgba(245,158,11,0.2)] font-semibold'
                  : 'text-[#94a3b8] hover:bg-[#0f141e] hover:text-white'
              }`}
              onClick={() => setActiveView(item.id)}
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="px-1.5 py-0.5 rounded font-mono text-[9px] font-extrabold bg-[#1e2638] text-[#f59e0b]">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Manage Section */}
        <div className="flex flex-col gap-1 pt-2 border-t border-[#161b26]">
          <span className="text-[10px] font-mono text-[#64748b] font-semibold uppercase tracking-wider px-2 mb-1">
            Manage
          </span>
          {manageNav.map((item) => (
            <button
              key={item.id}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl font-sans text-xs transition-all text-left border-0 cursor-pointer ${
                activeView === item.id
                  ? 'bg-[#f59e0b]/15 text-[#f59e0b] border border-[#f59e0b]/30 shadow-[0_0_12px_rgba(245,158,11,0.2)] font-semibold'
                  : 'text-[#94a3b8] hover:bg-[#0f141e] hover:text-white'
              }`}
              onClick={() => setActiveView(item.id)}
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="px-1.5 py-0.5 rounded font-mono text-[9px] font-extrabold bg-[#1e2638] text-[#f59e0b]">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

    </aside>
  );
}
