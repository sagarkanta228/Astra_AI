'use client';

import React, { useState } from 'react';
import Navbar from '../../frontend/src/components/Navbar';
import Sidebar from '../../frontend/src/components/Sidebar';
import LoginPortal from '../../frontend/src/components/LoginPortal';
import LandingPage from '../../frontend/src/components/LandingPage';
import UserDashboard from '../../frontend/src/components/UserDashboard';
import ThreatAnalyzer from '../../frontend/src/components/ThreatAnalyzer';
import FileManager from '../../frontend/src/components/FileManager';
import AdminDashboard from '../../frontend/src/components/AdminDashboard';
import IncidentInvestigationConsole from '../../frontend/src/components/IncidentInvestigationConsole';
import LiveSecurityMonitor from '../../frontend/src/components/LiveSecurityMonitor';
import ThreatIntelligenceHub from '../../frontend/src/components/ThreatIntelligenceHub';
import AISecurityCopilotConsole from '../../frontend/src/components/AISecurityCopilotConsole';
import AuditLogsView from '../../frontend/src/components/AuditLogsView';
import HackathonDemoModal from '../../frontend/src/components/HackathonDemoModal';

export default function Page() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentRole, setCurrentRole] = useState('USER');
  const [activeView, setActiveView] = useState('login');
  const [initialScanTab, setInitialScanTab] = useState('email');
  const [selectedIncidentId, setSelectedIncidentId] = useState('INC-1024');
  const [isDemoOpen, setIsDemoOpen] = useState(false);

  // Sync URL pathname with active view (/login, /admin, /)
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      if (path === '/login') {
        setActiveView('login');
      } else if (path === '/admin') {
        setIsAuthenticated(true);
        setCurrentRole('ADMIN');
        setActiveView('admin-dashboard');
      }
    }
  }, []);

  // Update browser URL state when activeView changes
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      if (activeView === 'login' && window.location.pathname !== '/login') {
        window.history.pushState({}, '', '/login');
      } else if (currentRole === 'ADMIN' && window.location.pathname !== '/admin') {
        window.history.pushState({}, '', '/admin');
      } else if (isAuthenticated && activeView !== 'login' && currentRole === 'USER' && window.location.pathname !== '/') {
        window.history.pushState({}, '', '/');
      }
    }
  }, [activeView, currentRole, isAuthenticated]);

  const handleLoginSuccess = (operatorData) => {
    setIsAuthenticated(true);
    const role = operatorData?.role || 'USER';
    setCurrentRole(role);
    if (role === 'ADMIN') {
      setActiveView('admin-dashboard');
      if (typeof window !== 'undefined') window.history.pushState({}, '', '/admin');
    } else {
      setActiveView('user-dashboard');
      if (typeof window !== 'undefined') window.history.pushState({}, '', '/');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setActiveView('login');
    if (typeof window !== 'undefined') window.history.pushState({}, '', '/login');
  };

  const handleSelectScanTab = (tab) => {
    setInitialScanTab(tab);
    setActiveView('user-analyze');
  };

  if (!isAuthenticated || activeView === 'login') {
    return (
      <LoginPortal
        onLoginSuccess={handleLoginSuccess}
        openNodesModal={() => {}}
        openArchModal={() => {}}
        openSecOpsModal={() => {}}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#080a0f] text-white flex flex-col font-sans">
      <Navbar
        currentRole={currentRole}
        setCurrentRole={setCurrentRole}
        activeView={activeView}
        setActiveView={setActiveView}
        onOpenDemo={() => setIsDemoOpen(true)}
        onLogout={handleLogout}
      />

      <div className="flex flex-1 pt-16">
        {activeView !== 'landing' && (
          <Sidebar
            currentRole={currentRole}
            activeView={activeView}
            setActiveView={setActiveView}
            onLogout={handleLogout}
          />
        )}

        <main className={`flex-1 p-6 lg:p-8 transition-all ${activeView !== 'landing' ? 'ml-64' : 'ml-0'}`}>
          {activeView === 'landing' && (
            <LandingPage setActiveView={setActiveView} setCurrentRole={setCurrentRole} />
          )}
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
