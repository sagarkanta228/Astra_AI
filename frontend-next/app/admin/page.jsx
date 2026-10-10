'use client';

import React, { useState } from 'react';
import Navbar from '../../../frontend/src/components/Navbar';
import Sidebar from '../../../frontend/src/components/Sidebar';
import AdminDashboard from '../../../frontend/src/components/AdminDashboard';
import LiveSecurityMonitor from '../../../frontend/src/components/LiveSecurityMonitor';
import IncidentInvestigationConsole from '../../../frontend/src/components/IncidentInvestigationConsole';
import ThreatIntelligenceHub from '../../../frontend/src/components/ThreatIntelligenceHub';
import AISecurityCopilotConsole from '../../../frontend/src/components/AISecurityCopilotConsole';
import AuditLogsView from '../../../frontend/src/components/AuditLogsView';
import HackathonDemoModal from '../../../frontend/src/components/HackathonDemoModal';

export default function AdminPage() {
  const [currentRole, setCurrentRole] = useState('ADMIN');
  const [activeView, setActiveView] = useState('admin-dashboard');
  const [selectedIncidentId, setSelectedIncidentId] = useState('INC-1024');
  const [isDemoOpen, setIsDemoOpen] = useState(false);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  };

  return (
    <div className="min-h-screen bg-[#080a0f] text-white flex flex-col font-sans">
      <Navbar
        currentRole={currentRole}
        setCurrentRole={(role) => {
          if (role === 'USER') {
            window.location.href = '/';
          } else {
            setCurrentRole(role);
          }
        }}
        activeView={activeView}
        setActiveView={setActiveView}
        onOpenDemo={() => setIsDemoOpen(true)}
        onLogout={handleLogout}
      />

      <div className="flex flex-1 pt-16">
        <Sidebar
          currentRole={currentRole}
          activeView={activeView}
          setActiveView={setActiveView}
          onLogout={handleLogout}
        />

        <main className="flex-1 p-6 lg:p-8 transition-all ml-64">
          {activeView === 'admin-dashboard' && (
            <AdminDashboard setActiveView={setActiveView} setSelectedIncidentId={setSelectedIncidentId} />
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
          {activeView === 'admin-copilot' && (
            <AISecurityCopilotConsole />
          )}
          {activeView === 'admin-audit-logs' && (
            <AuditLogsView />
          )}
        </main>
      </div>

      <HackathonDemoModal
        isOpen={isDemoOpen}
        onClose={() => setIsDemoOpen(false)}
        setActiveView={setActiveView}
        setCurrentRole={setCurrentRole}
        setSelectedIncidentId={setSelectedIncidentId}
      />
    </div>
  );
}
