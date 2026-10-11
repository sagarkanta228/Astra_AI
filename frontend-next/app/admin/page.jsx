'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '../../../frontend/src/components/Navbar';
import Sidebar from '../../../frontend/src/components/Sidebar';
import AdminDashboard from '../../../frontend/src/components/AdminDashboard';
import LiveSecurityMonitor from '../../../frontend/src/components/LiveSecurityMonitor';
import IncidentInvestigationConsole from '../../../frontend/src/components/IncidentInvestigationConsole';
import ThreatIntelligenceHub from '../../../frontend/src/components/ThreatIntelligenceHub';
import AISecurityCopilotConsole from '../../../frontend/src/components/AISecurityCopilotConsole';
import AuditLogsView from '../../../frontend/src/components/AuditLogsView';
import UserManagement from '../../../frontend/src/components/UserManagement';
import FileManager from '../../../frontend/src/components/FileManager';
import AdminAISidebar from '../../../frontend/src/components/AdminAISidebar';
import HackathonDemoModal from '../../../frontend/src/components/HackathonDemoModal';
import { getStoredUsers } from '../../../frontend/src/utils/authService';

const SESSION_KEY = 'astra_active_session';

export default function AdminPage() {
  const [currentUser, setCurrentUser] = useState(null);
  const [activeView, setActiveView] = useState('admin-dashboard');
  const [selectedIncidentId, setSelectedIncidentId] = useState('INC-1024');
  const [isDemoOpen, setIsDemoOpen] = useState(false);
  const [isAISidebarOpen, setIsAISidebarOpen] = useState(false);

  useEffect(() => {
    let saved = null;
    try {
      const raw = sessionStorage.getItem(SESSION_KEY);
      if (raw) saved = JSON.parse(raw);
    } catch (_) {}

    if (saved && saved.role === 'ADMIN') {
      setCurrentUser(saved);
    } else {
      const users = getStoredUsers();
      const defaultAdmin = users.find(u => u.role === 'ADMIN') || users[0];
      setCurrentUser(defaultAdmin);
    }
  }, []);

  const handleLogout = () => {
    try {
      sessionStorage.removeItem(SESSION_KEY);
    } catch (_) {}
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-[#080a0f] text-white flex flex-col font-sans selection:bg-[#f59e0b] selection:text-[#080a0f]">
      <Navbar
        currentRole="ADMIN"
        currentUser={currentUser}
        setCurrentRole={() => {}}
        activeView={activeView}
        setActiveView={setActiveView}
        onOpenDemo={() => setIsDemoOpen(true)}
        onLogout={handleLogout}
        onToggleAISidebar={() => setIsAISidebarOpen(prev => !prev)}
      />

      <div className="flex flex-1 pt-16">
        <Sidebar
          currentRole="ADMIN"
          activeView={activeView}
          setActiveView={setActiveView}
          onLogout={handleLogout}
        />

        <main className="flex-1 p-6 lg:p-8 transition-all ml-64">
          {activeView === 'admin-dashboard' && (
            <AdminDashboard setActiveView={setActiveView} setSelectedIncidentId={setSelectedIncidentId} />
          )}
          {activeView === 'admin-users' && (
            <UserManagement setActiveView={setActiveView} />
          )}
          {activeView === 'admin-live-monitor' && (
            <LiveSecurityMonitor />
          )}
          {activeView === 'admin-incidents' && (
            <IncidentInvestigationConsole incidentId={selectedIncidentId} />
          )}
          {activeView === 'admin-threat-intelligence' && (
            <ThreatIntelligenceHub />
          )}
          {activeView === 'admin-files' && (
            <FileManager isAdmin={true} />
          )}
          {activeView === 'admin-copilot' && (
            <AISecurityCopilotConsole />
          )}
          {activeView === 'admin-audit-logs' && (
            <AuditLogsView />
          )}
        </main>
      </div>

      {/* Admin AI Side Bar (Groq LPU Powered) */}
      <AdminAISidebar
        isOpen={isAISidebarOpen}
        onToggle={() => setIsAISidebarOpen(prev => !prev)}
        setActiveView={setActiveView}
      />

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
