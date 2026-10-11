import React from 'react';

export default function Sidebar({ currentRole, activeView, setActiveView, onLogout }) {
  // Navigation for SOC Analyst (Admin)
  const adminNavOverview = [
    { id: 'admin-dashboard', label: 'SOC Console', icon: 'grid_view' },
    { id: 'admin-incidents', label: 'Incidents & Triage', icon: 'shield', badge: '3 NEW' },
    { id: 'admin-live-monitor', label: 'Live Threat Stream', icon: 'ssid_chart' },
    { id: 'admin-threat-intelligence', label: 'Threat Intel Hub', icon: 'hub' },
  ];

  const adminNavManage = [
    { id: 'admin-users', label: 'User Management', icon: 'manage_accounts', badge: 'IAM' },
    { id: 'admin-files', label: 'File Quarantine Vault', icon: 'folder_zip' },
    { id: 'admin-copilot', label: 'Security Copilot', icon: 'smart_toy' },
    { id: 'admin-audit-logs', label: 'Audit & Compliance', icon: 'history' },
  ];

  // Navigation for Standard Enterprise User
  const userNavOverview = [
    { id: 'user-dashboard', label: 'Security Dashboard', icon: 'grid_view' },
    { id: 'user-analyze', label: 'Threat Scanner', icon: 'policy', badge: 'SCAN' },
    { id: 'user-files', label: 'Secured File Vault', icon: 'folder_shared' },
  ];

  const userNavManage = [
    { id: 'user-alerts', label: 'Security Alerts', icon: 'notifications_active' },
    { id: 'user-incidents', label: 'Incident Protection', icon: 'shield' },
    { id: 'user-profile', label: 'My Security Profile', icon: 'account_circle' },
  ];

  const isAdmin = currentRole === 'ADMIN';
  const overviewItems = isAdmin ? adminNavOverview : userNavOverview;
  const manageItems = isAdmin ? adminNavManage : userNavManage;

  return (
    <aside className="fixed left-0 top-16 bottom-0 w-64 bg-[#080a0f] border-r border-[#161b26] flex flex-col justify-between z-40 p-4 overflow-y-auto font-sans">
      <div className="flex flex-col gap-5">
        {/* Role Identification Header */}
        <div className={`p-3 rounded-xl border flex items-center justify-between ${
          isAdmin 
            ? 'bg-[#ef4444]/10 border-[#ef4444]/25 text-[#ef4444]' 
            : 'bg-[#3b82f6]/10 border-[#3b82f6]/25 text-[#3b82f6]'
        }`}>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">
              {isAdmin ? 'shield_person' : 'badge'}
            </span>
            <span className="font-mono text-[11px] font-bold uppercase tracking-wider">
              {isAdmin ? 'SOC Analyst (Admin)' : 'Enterprise User'}
            </span>
          </div>
          <span className={`w-2 h-2 rounded-full ${isAdmin ? 'bg-[#ef4444]' : 'bg-[#3b82f6]'}`}></span>
        </div>

        {/* Overview Section */}
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-mono text-[#64748b] font-semibold uppercase tracking-wider px-2 mb-1">
            {isAdmin ? 'SOC Operations' : 'Security Workspace'}
          </span>
          {overviewItems.map((item) => {
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl font-sans text-xs transition-all text-left border-0 cursor-pointer ${
                  isActive
                    ? 'bg-[#f59e0b]/15 text-[#f59e0b] border border-[#f59e0b]/30 shadow-[0_0_12px_rgba(245,158,11,0.2)] font-semibold'
                    : 'text-[#94a3b8] hover:bg-[#0f141e] hover:text-white bg-transparent'
                }`}
                onClick={() => setActiveView(item.id)}
              >
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`px-1.5 py-0.5 rounded font-mono text-[9px] font-extrabold ${
                    item.badge === '3 NEW' 
                      ? 'bg-[#ef4444]/20 text-[#ef4444]' 
                      : 'bg-[#1e2638] text-[#f59e0b]'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Management Section */}
        <div className="flex flex-col gap-1 pt-2 border-t border-[#161b26]">
          <span className="text-[10px] font-mono text-[#64748b] font-semibold uppercase tracking-wider px-2 mb-1">
            {isAdmin ? 'Administration & IAM' : 'Account & Alerts'}
          </span>
          {manageItems.map((item) => {
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl font-sans text-xs transition-all text-left border-0 cursor-pointer ${
                  isActive
                    ? 'bg-[#f59e0b]/15 text-[#f59e0b] border border-[#f59e0b]/30 shadow-[0_0_12px_rgba(245,158,11,0.2)] font-semibold'
                    : 'text-[#94a3b8] hover:bg-[#0f141e] hover:text-white bg-transparent'
                }`}
                onClick={() => setActiveView(item.id)}
              >
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`px-1.5 py-0.5 rounded font-mono text-[9px] font-extrabold ${
                    item.badge === 'IAM'
                      ? 'bg-[#3b82f6]/20 text-[#3b82f6]'
                      : 'bg-[#1e2638] text-[#f59e0b]'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Logout button at bottom of sidebar */}
      <div className="pt-4 border-t border-[#161b26]">
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-mono text-[#ef4444] hover:bg-[#ef4444]/10 transition-all border border-[#ef4444]/20 cursor-pointer bg-transparent"
        >
          <span className="material-symbols-outlined text-[16px]">logout</span>
          <span>SIGN OUT</span>
        </button>
      </div>
    </aside>
  );
}
