import React, { useState, useEffect } from 'react';
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
import UserManagement from './components/UserManagement';
import AdminAISidebar from './components/AdminAISidebar';
import HackathonDemoModal from './components/HackathonDemoModal';
import { getStoredUsers } from './utils/authService';

const SESSION_KEY = 'astra_active_session';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentRole, setCurrentRole] = useState('USER');
  const [activeView, setActiveView] = useState('login');
  const [initialScanTab, setInitialScanTab] = useState('email');
  const [selectedIncidentId, setSelectedIncidentId] = useState('INC-1024');
  const [isDemoOpen, setIsDemoOpen] = useState(false);
  const [isAISidebarOpen, setIsAISidebarOpen] = useState(false);


  // Helper to get fallback users
  const getDefaultUser = (role) => {
    const users = getStoredUsers();
    return users.find(u => u.role === role) || users[0];
  };

  // Convert pathname to view state
  const pathToView = (path) => {
    const clean = path.replace(/\/$/, '') || '/';
    if (clean === '/login') return { view: 'login', role: 'USER', auth: false };
    if (clean === '/admin' || clean === '/admin/dashboard') return { view: 'admin-dashboard', role: 'ADMIN', auth: true };
    if (clean === '/admin/users') return { view: 'admin-users', role: 'ADMIN', auth: true };
    if (clean === '/admin/incidents') return { view: 'admin-incidents', role: 'ADMIN', auth: true };
    if (clean === '/admin/live-monitor') return { view: 'admin-live-monitor', role: 'ADMIN', auth: true };
    if (clean === '/admin/threat-intel' || clean === '/admin/threat-intelligence') return { view: 'admin-threat-intelligence', role: 'ADMIN', auth: true };
    if (clean === '/admin/files') return { view: 'admin-files', role: 'ADMIN', auth: true };
    if (clean === '/admin/copilot') return { view: 'admin-copilot', role: 'ADMIN', auth: true };
    if (clean === '/admin/audit-logs') return { view: 'admin-audit-logs', role: 'ADMIN', auth: true };
    
    if (clean === '/user' || clean === '/user/dashboard') return { view: 'user-dashboard', role: 'USER', auth: true };
    if (clean === '/user/analyze' || clean === '/user/scan') return { view: 'user-analyze', role: 'USER', auth: true };
    if (clean === '/user/files') return { view: 'user-files', role: 'USER', auth: true };
    if (clean === '/user/alerts') return { view: 'user-alerts', role: 'USER', auth: true };
    if (clean === '/user/incidents') return { view: 'user-incidents', role: 'USER', auth: true };
    if (clean === '/user/profile') return { view: 'user-profile', role: 'USER', auth: true };

    return null;
  };

  // Convert view to URL pathname
  const viewToPath = (view) => {
    if (view === 'login') return '/login';
    if (view === 'admin-dashboard') return '/admin';
    if (view.startsWith('admin-')) return `/admin/${view.replace('admin-', '')}`;
    if (view === 'user-dashboard') return '/user';
    if (view.startsWith('user-')) return `/user/${view.replace('user-', '')}`;
    return '/';
  };

  // Initialize from browser URL and session on load
  useEffect(() => {
    const path = window.location.pathname;
    let savedSession = null;
    try {
      const raw = sessionStorage.getItem(SESSION_KEY);
      if (raw) savedSession = JSON.parse(raw);
    } catch (_) {}

    const resolved = pathToView(path);

    if (resolved) {
      if (resolved.view === 'login') {
        setIsAuthenticated(false);
        setCurrentUser(null);
        setActiveView('login');
      } else {
        const user = savedSession && savedSession.role === resolved.role ? savedSession : getDefaultUser(resolved.role);
        setIsAuthenticated(true);
        setCurrentRole(resolved.role);
        setCurrentUser(user);
        setActiveView(resolved.view);
      }
    } else {
      // Default path '/'
      if (savedSession) {
        setIsAuthenticated(true);
        setCurrentRole(savedSession.role);
        setCurrentUser(savedSession);
        const nextView = savedSession.role === 'ADMIN' ? 'admin-dashboard' : 'user-dashboard';
        setActiveView(nextView);
        window.history.replaceState({}, '', viewToPath(nextView));
      } else {
        setIsAuthenticated(false);
        setActiveView('login');
        window.history.replaceState({}, '', '/login');
      }
    }

    // Listen for browser Back/Forward navigation
    const handlePopState = () => {
      const p = window.location.pathname;
      const res = pathToView(p);
      if (res) {
        if (res.view === 'login') {
          setIsAuthenticated(false);
          setActiveView('login');
        } else {
          setIsAuthenticated(true);
          setCurrentRole(res.role);
          setActiveView(res.view);
        }
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Update browser URL bar when activeView changes
  const handleNavigate = (newView) => {
    setActiveView(newView);
    const newPath = viewToPath(newView);
    if (window.location.pathname !== newPath) {
      window.history.pushState({}, '', newPath);
    }
  };

  const handleLoginSuccess = (user) => {
    setIsAuthenticated(true);
    setCurrentUser(user);
    const role = user?.role || 'USER';
    setCurrentRole(role);
    try {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(user));
    } catch (_) {}

    const nextView = role === 'ADMIN' ? 'admin-dashboard' : 'user-dashboard';
    setActiveView(nextView);
    const nextPath = role === 'ADMIN' ? '/admin' : '/user';
    window.history.pushState({}, '', nextPath);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setCurrentRole('USER');
    setActiveView('login');
    try {
      sessionStorage.removeItem(SESSION_KEY);
    } catch (_) {}
    window.history.pushState({}, '', '/login');
  };

  const handleSelectScanTab = (tab) => {
    setInitialScanTab(tab);
    handleNavigate('user-analyze');
  };

  // If not authenticated or active view is login, show unified LoginPortal
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
      {/* Top Navbar */}
      <Navbar
        currentRole={currentRole}
        currentUser={currentUser}
        setCurrentRole={setCurrentRole}
        activeView={effectiveView}
        setActiveView={handleNavigate}
        onOpenDemo={() => setIsDemoOpen(true)}
        onLogout={handleLogout}
        onToggleAISidebar={() => setIsAISidebarOpen(prev => !prev)}
      />

      {/* Main View Area */}
      <div className="flex flex-1 pt-16">
        {effectiveView !== 'landing' && (
          <Sidebar
            currentRole={currentRole}
            activeView={effectiveView}
            setActiveView={handleNavigate}
            onLogout={handleLogout}
          />
        )}

        <main className={`flex-1 p-6 lg:p-8 transition-all ${effectiveView !== 'landing' ? 'ml-64' : 'ml-0'}`}>
          {/* Public / Landing Views */}
          {effectiveView === 'landing' && (
            <LandingPage setActiveView={handleNavigate} setCurrentRole={setCurrentRole} />
          )}

          {/* User Portal Views (/user) */}
          {effectiveView === 'user-dashboard' && (
            <UserDashboard setActiveView={handleNavigate} onSelectScanTab={handleSelectScanTab} />
          )}
          {effectiveView === 'user-analyze' && (
            <ThreatAnalyzer initialTab={initialScanTab} setActiveView={handleNavigate} />
          )}
          {effectiveView === 'user-files' && (
            <FileManager isAdmin={false} />
          )}
          {effectiveView === 'user-history' && (
            <UserDashboard setActiveView={handleNavigate} onSelectScanTab={handleSelectScanTab} />
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

          {/* Admin SOC Views (/admin) */}
          {effectiveView === 'admin-dashboard' && (
            <AdminDashboard setActiveView={handleNavigate} setSelectedIncidentId={setSelectedIncidentId} />
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
            <UserManagement setActiveView={handleNavigate} />
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
          setActiveView={handleNavigate}
        />
      )}

      {/* Incident Simulation Controller Modal */}
      <HackathonDemoModal
        isOpen={isDemoOpen}
        onClose={() => setIsDemoOpen(false)}
        setActiveView={handleNavigate}
        setCurrentRole={setCurrentRole}
        setSelectedIncidentId={setSelectedIncidentId}
      />
    </div>
  );
}
