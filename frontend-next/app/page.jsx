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
import UserManagement from '../../frontend/src/components/UserManagement';
import AdminAISidebar from '../../frontend/src/components/AdminAISidebar';
import HackathonDemoModal from '../../frontend/src/components/HackathonDemoModal';

export default function Page() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentRole, setCurrentRole] = useState('USER');
  const [activeView, setActiveView] = useState('login');
  const [initialScanTab, setInitialScanTab] = useState('email');
  const [selectedIncidentId, setSelectedIncidentId] = useState('INC-1024');
  const [isDemoOpen, setIsDemoOpen] = useState(false);
  const [isAISidebarOpen, setIsAISidebarOpen] = useState(false);

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

  const handleLoginSuccess = (user) => {
    setIsAuthenticated(true);
    setCurrentUser(user);
    const role = user?.role || 'USER';
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
    setCurrentUser(null);
    setCurrentRole('USER');
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
        openSecOpsModal={() => {}}
      />
    );
  }

  const isAdminView = activeView.startsWith('admin-');
  const effectiveView = (!isAdminView || currentRole === 'ADMIN') ? activeView : 'user-dashboard';

  return (
    <div className="min-h-screen bg-[#080a0f] text-white flex flex-col font-sans selection:bg-[#f59e0b] selection:text-[#080a0f]">
      <Navbar
        currentRole={currentRole}
        currentUser={currentUser}
        setCurrentRole={setCurrentRole}
        activeView={effectiveView}
        setActiveView={setActiveView}
        onOpenDemo={() => setIsDemoOpen(true)}
        onLogout={handleLogout}
        onToggleAISidebar={() => setIsAISidebarOpen(prev => !prev)}
      />

      <div className="flex flex-1 pt-16">
        {effectiveView !== 'landing' && (
          <Sidebar
            currentRole={currentRole}
            activeView={effectiveView}
            setActiveView={setActiveView}
            onLogout={handleLogout}
          />
        )}

        <main className={`flex-1 p-6 lg:p-8 transition-all ${effectiveView !== 'landing' ? 'ml-64' : 'ml-0'}`}>
          {effectiveView === 'landing' && (
            <LandingPage setActiveView={setActiveView} setCurrentRole={setCurrentRole} />
          )}
          {effectiveView === 'user-dashboard' && (
            <UserDashboard setActiveView={setActiveView} onSelectScanTab={handleSelectScanTab} />
          )}
          {effectiveView === 'user-analyze' && (
            <ThreatAnalyzer initialTab={initialScanTab} setActiveView={setActiveView} />
          )}
          {effectiveView === 'user-files' && (
            <FileManager isAdmin={false} />
          )}
          {effectiveView === 'user-alerts' && (
            <LiveSecurityMonitor />
          )}
          {effectiveView === 'user-incidents' && (
            <IncidentInvestigationConsole incidentId={selectedIncidentId} />
          )}
          {effectiveView === 'user-profile' && (
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
                    <span className={`px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold border ${
                      currentUser?.role === 'ADMIN'
                        ? 'bg-[#ef4444]/15 text-[#ef4444] border-[#ef4444]/30'
                        : 'bg-[#3b82f6]/15 text-[#3b82f6] border-[#3b82f6]/30'
                    }`}>
                      {currentUser?.role === 'ADMIN' ? 'SOC ANALYST (ADMIN)' : 'STANDARD ENTERPRISE USER'}
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

          {/* Admin Views */}
          {effectiveView === 'admin-dashboard' && (
            <AdminDashboard setActiveView={setActiveView} setSelectedIncidentId={setSelectedIncidentId} />
          )}
          {effectiveView === 'admin-live-monitor' && (
            <LiveSecurityMonitor />
          )}
          {effectiveView === 'admin-incidents' && (
            <IncidentInvestigationConsole incidentId={selectedIncidentId} />
          )}
          {effectiveView === 'admin-threat-intelligence' && (
            <ThreatIntelligenceHub />
          )}
          {effectiveView === 'admin-files' && (
            <FileManager isAdmin={true} />
          )}
          {effectiveView === 'admin-users' && (
            <UserManagement setActiveView={setActiveView} />
          )}
          {effectiveView === 'admin-copilot' && (
            <AISecurityCopilotConsole />
          )}
          {effectiveView === 'admin-audit-logs' && (
            <AuditLogsView />
          )}
        </main>
      </div>

      {/* Admin AI Side Bar (Groq LPU Powered) */}
      {currentRole === 'ADMIN' && (
        <AdminAISidebar
          isOpen={isAISidebarOpen}
          onToggle={() => setIsAISidebarOpen(prev => !prev)}
          setActiveView={setActiveView}
        />
      )}

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
