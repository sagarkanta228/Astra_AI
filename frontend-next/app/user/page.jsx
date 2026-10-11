'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '../../../frontend/src/components/Navbar';
import Sidebar from '../../../frontend/src/components/Sidebar';
import UserDashboard from '../../../frontend/src/components/UserDashboard';
import ThreatAnalyzer from '../../../frontend/src/components/ThreatAnalyzer';
import FileManager from '../../../frontend/src/components/FileManager';
import LiveSecurityMonitor from '../../../frontend/src/components/LiveSecurityMonitor';
import IncidentInvestigationConsole from '../../../frontend/src/components/IncidentInvestigationConsole';
import HackathonDemoModal from '../../../frontend/src/components/HackathonDemoModal';
import { getStoredUsers } from '../../../frontend/src/utils/authService';

const SESSION_KEY = 'astra_active_session';

export default function UserPortalPage() {
  const [currentUser, setCurrentUser] = useState(null);
  const [activeView, setActiveView] = useState('user-dashboard');
  const [initialScanTab, setInitialScanTab] = useState('email');
  const [selectedIncidentId, setSelectedIncidentId] = useState('INC-1024');
  const [isDemoOpen, setIsDemoOpen] = useState(false);

  useEffect(() => {
    let saved = null;
    try {
      const raw = sessionStorage.getItem(SESSION_KEY);
      if (raw) saved = JSON.parse(raw);
    } catch (_) {}

    if (saved && saved.role === 'USER') {
      setCurrentUser(saved);
    } else {
      const users = getStoredUsers();
      const defaultUser = users.find(u => u.role === 'USER') || users[0];
      setCurrentUser(defaultUser);
    }
  }, []);

  const handleLogout = () => {
    try {
      sessionStorage.removeItem(SESSION_KEY);
    } catch (_) {}
    window.location.href = '/login';
  };

  const handleSelectScanTab = (tab) => {
    setInitialScanTab(tab);
    setActiveView('user-analyze');
  };

  return (
    <div className="min-h-screen bg-[#080a0f] text-white flex flex-col font-sans selection:bg-[#f59e0b] selection:text-[#080a0f]">
      <Navbar
        currentRole="USER"
        currentUser={currentUser}
        setCurrentRole={() => {}}
        activeView={activeView}
        setActiveView={setActiveView}
        onOpenDemo={() => setIsDemoOpen(true)}
        onLogout={handleLogout}
      />

      <div className="flex flex-1 pt-16">
        <Sidebar
          currentRole="USER"
          activeView={activeView}
          setActiveView={setActiveView}
          onLogout={handleLogout}
        />

        <main className="flex-1 p-6 lg:p-8 transition-all ml-64">
          {activeView === 'user-dashboard' && (
            <UserDashboard setActiveView={setActiveView} onSelectScanTab={handleSelectScanTab} />
          )}
          {activeView === 'user-analyze' && (
            <ThreatAnalyzer initialTab={initialScanTab} setActiveView={setActiveView} />
          )}
          {activeView === 'user-files' && (
            <FileManager isAdmin={false} />
          )}
          {activeView === 'user-alerts' && (
            <LiveSecurityMonitor />
          )}
          {activeView === 'user-incidents' && (
            <IncidentInvestigationConsole incidentId={selectedIncidentId} />
          )}
          {activeView === 'user-profile' && (
            <div className="p-6 lg:p-8 rounded-2xl bg-[#0f141e] border border-[#1e2638] flex flex-col gap-6 shadow-xl max-w-4xl">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 pb-6 border-b border-[#1e2638]">
                <img 
                  src={currentUser?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"} 
                  className="w-20 h-20 rounded-2xl object-cover border border-[#1e2638] shadow-lg"
                  alt="Profile"
                />
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-bold text-white font-heading">
                      {currentUser?.fullName || 'Enterprise User'}
                    </h1>
                    <span className="px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold border bg-[#3b82f6]/15 text-[#3b82f6] border-[#3b82f6]/30">
                      STANDARD ENTERPRISE USER
                    </span>
                  </div>
                  <p className="text-xs font-mono text-[#94a3b8]">{currentUser?.email || 'user@astra.internal'}</p>
                  <p className="text-xs text-[#64748b]">{currentUser?.department || 'Finance & Operations'}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-[#080a0f] border border-[#1e2638]">
                  <span className="text-[11px] font-mono text-[#64748b] uppercase">Assigned Workstation</span>
                  <p className="text-xs font-semibold font-mono text-white mt-1">
                    {currentUser?.device || 'WS-8812 (192.168.1.104)'}
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-[#080a0f] border border-[#1e2638]">
                  <span className="text-[11px] font-mono text-[#64748b] uppercase">Account Security</span>
                  <p className="text-xs font-semibold text-[#10b981] mt-1 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#10b981]"></span>
                    Protected & Verified
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-[#080a0f] border border-[#1e2638]">
                  <span className="text-[11px] font-mono text-[#64748b] uppercase">Session Expiry</span>
                  <p className="text-xs font-semibold font-mono text-white mt-1">Active (12 Hours)</p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      <HackathonDemoModal
        isOpen={isDemoOpen}
        onClose={() => setIsDemoOpen(false)}
        setActiveView={setActiveView}
        setCurrentRole={() => {}}
        setSelectedIncidentId={setSelectedIncidentId}
      />
    </div>
  );
}
