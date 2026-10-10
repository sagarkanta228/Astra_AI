import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import LoginPortal from './components/LoginPortal';
import LandingPage from './components/LandingPage';
import UserDashboard from './components/UserDashboard';
import ThreatAnalyzer from './components/ThreatAnalyzer';
import FileManager from './components/FileManager';
import AdminDashboard from './components/AdminDashboard';
import IncidentInvestigationConsole from './components/IncidentInvestigationConsole';
import LiveSecurityMonitor from './components/LiveSecurityMonitor';
import ThreatIntelligenceHub from './components/ThreatIntelligenceHub';
import AISecurityCopilotConsole from './components/AISecurityCopilotConsole';
import AuditLogsView from './components/AuditLogsView';
import HackathonDemoModal from './components/HackathonDemoModal';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentRole, setCurrentRole] = useState('USER'); // 'USER', 'ADMIN', 'LANDING'
  const [activeView, setActiveView] = useState('login'); // Starts on 'login'
  const [initialScanTab, setInitialScanTab] = useState('email');
  const [selectedIncidentId, setSelectedIncidentId] = useState('INC-1024');
  const [isDemoOpen, setIsDemoOpen] = useState(false);

  const handleLoginSuccess = (operatorData) => {
    setIsAuthenticated(true);
    setCurrentRole(operatorData?.role || 'USER');
    setActiveView('user-dashboard'); // Redirects to Main Dashboard
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setActiveView('login');
  };

  const handleSelectScanTab = (tab) => {
    setInitialScanTab(tab);
    setActiveView('user-analyze');
  };

  // If not authenticated or active view is login, show LoginPortal
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
    <div className="min-h-screen bg-[#080a0f] text-white flex flex-col font-sans selection:bg-[#f59e0b] selection:text-[#080a0f]">
      {/* Top Navbar */}
      <Navbar
        currentRole={currentRole}
        setCurrentRole={setCurrentRole}
        activeView={activeView}
        setActiveView={setActiveView}
        onOpenDemo={() => setIsDemoOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main View Area */}
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
          {/* Public / Landing Views */}
          {activeView === 'landing' && (
            <LandingPage setActiveView={setActiveView} setCurrentRole={setCurrentRole} />
          )}

          {/* User Portal Views */}
          {activeView === 'user-dashboard' && (
            <UserDashboard setActiveView={setActiveView} onSelectScanTab={handleSelectScanTab} />
          )}
          {activeView === 'user-analyze' && (
            <ThreatAnalyzer initialTab={initialScanTab} setActiveView={setActiveView} />
          )}
          {activeView === 'user-files' && (
            <FileManager isAdmin={false} />
          )}
          {activeView === 'user-history' && (
            <UserDashboard setActiveView={setActiveView} onSelectScanTab={handleSelectScanTab} />
          )}
          {activeView === 'user-alerts' && (
            <LiveSecurityMonitor />
          )}
          {activeView === 'user-incidents' && (
            <IncidentInvestigationConsole incidentId={selectedIncidentId} />
          )}
          {activeView === 'user-profile' && (
            <div className="p-6 rounded-2xl bg-[#0f141e] border border-[#1e2638] flex flex-col gap-4">
              <h1 className="text-xl font-bold text-white font-heading">User Security Profile</h1>
              <p className="text-xs text-[#94a3b8]">Robert Vance (Finance & Ops Lead). Role: USER. Multi-factor authentication active.</p>
            </div>
          )}

          {/* Admin SOC Views */}
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
          {activeView === 'admin-files' && (
            <FileManager isAdmin={true} />
          )}
          {activeView === 'admin-users' && (
            <div className="p-6 rounded-2xl bg-[#0f141e] border border-[#1e2638] flex flex-col gap-4">
              <h1 className="text-xl font-bold text-white font-heading">Enterprise User & Device Management</h1>
              <p className="text-xs text-[#94a3b8]">Managing 142 enterprise workstations and user permissions.</p>
            </div>
          )}
          {activeView === 'admin-copilot' && (
            <AISecurityCopilotConsole />
          )}
          {activeView === 'admin-audit-logs' && (
            <AuditLogsView />
          )}
        </main>
      </div>

      {/* Hackathon Automated Attack Scenario Demo Controller Modal */}
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
