import React from 'react';

export default function AdminDashboard({ setActiveView, setSelectedIncidentId }) {
  const kpis = [
    { title: 'Total Events', val: '1,248', change: '+14% vs yesterday', icon: 'monitoring', color: 'text-[#3b82f6]' },
    { title: 'Threats Detected', val: '84', change: '84 Flagged', icon: 'warning', color: 'text-[#f59e0b]' },
    { title: 'Critical Threats', val: '12', change: 'Action Required', icon: 'report_problem', color: 'text-[#ef4444]' },
    { title: 'Active Incidents', val: '3', change: '2 Investigating', icon: 'emergency_home', color: 'text-[#ef4444]' },
    { title: 'Affected Users', val: '5', change: 'Targeted accounts', icon: 'person_alert', color: 'text-[#f59e0b]' },
    { title: 'Malicious Files', val: '18', change: 'Quarantined', icon: 'folder_zip', color: 'text-[#8b5cf6]' },
    { title: 'Blocked URLs', val: '42', change: 'Perimeter firewall', icon: 'link_off', color: 'text-[#10b981]' },
    { title: 'Open Investigations', val: '2', change: 'Assigned to SOC', icon: 'search', color: 'text-[#3b82f6]' }
  ];

  const liveIncidents = [
    { id: 'INC-1024', title: 'Credential Harvesting Phishing via Look-Alike Domain', type: 'PHISHING', severity: 'CRITICAL', riskScore: 92, user: 'Robert Vance', analyst: 'Sarah Jenkins', status: 'INVESTIGATING' },
    { id: 'INC-1025', title: 'Anomalous Account Takeover Attempt from Foreign IP', type: 'ACCOUNT_TAKEOVER', severity: 'HIGH', riskScore: 88, user: 'Robert Vance', analyst: 'David Miller', status: 'TRIAGED' },
    { id: 'INC-1026', title: 'Obfuscated Double Extension Executable in ZIP Upload', type: 'MALWARE', severity: 'HIGH', riskScore: 85, user: 'Robert Vance', analyst: 'Sarah Jenkins', status: 'CONTAINED' }
  ];

  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* Executive SOC Header */}
      <div className="p-6 lg:p-8 rounded-2xl bg-[#0f141e] border border-[#1e2638] flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#ef4444]/20 text-[#ef4444] font-mono text-[10px] font-bold border border-[#ef4444]/30">SOC ANALYST CONSOLE</span>
            <span className="text-[#64748b] text-xs font-mono">Live Threat Defense Grid</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white font-heading">
            Enterprise Security <span className="text-[#ef4444]">SOC Console</span>
          </h1>
          <p className="text-sm text-[#94a3b8]">
            Enterprise SOC console for real-time threat detection, incident triage, user access provisioning, and security response orchestration.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            className="px-4 py-2.5 rounded-xl bg-[#3b82f6] text-white font-mono text-xs font-bold hover:bg-[#2563eb] transition-all cursor-pointer border-0 shadow-[0_0_15px_rgba(59,130,246,0.3)] flex items-center gap-2"
            onClick={() => setActiveView('admin-users')}
          >
            <span className="material-symbols-outlined text-[18px]">manage_accounts</span>
            <span>USER MANAGEMENT</span>
          </button>
          <button
            className="px-4 py-2.5 rounded-xl bg-[#1e2638] text-white font-mono text-xs font-bold hover:bg-[#2a3449] transition-all cursor-pointer border-0 flex items-center gap-2"
            onClick={() => setActiveView('admin-live-monitor')}
          >
            <span className="material-symbols-outlined text-[#10b981] text-[18px]">ssid_chart</span>
            <span>LIVE MONITOR</span>
          </button>
          <button
            className="px-4 py-2.5 rounded-xl bg-[#ef4444] text-white font-mono text-xs font-bold hover:brightness-110 transition-all cursor-pointer border-0 shadow-[0_0_15px_rgba(239,68,68,0.3)] flex items-center gap-2"
            onClick={() => {
              setSelectedIncidentId('INC-1024');
              setActiveView('admin-incidents');
            }}
          >
            <span className="material-symbols-outlined text-[18px]">emergency</span>
            <span>INVESTIGATE INC-1024</span>
          </button>
        </div>
      </div>

      {/* 8 Metric KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => (
          <div key={i} className="p-4 rounded-2xl bg-[#0f141e] border border-[#1e2638] flex flex-col gap-2 shadow-md hover:border-[#1e2638]/80 transition-all">
            <div className="flex items-center justify-between text-[#64748b]">
              <span className="font-mono text-[11px] uppercase font-semibold">{kpi.title}</span>
              <span className={`material-symbols-outlined ${kpi.color} text-[20px]`}>{kpi.icon}</span>
            </div>
            <span className="text-2xl font-extrabold text-white font-mono">{kpi.val}</span>
            <span className="text-[10px] text-[#94a3b8] font-mono">{kpi.change}</span>
          </div>
        ))}
      </div>

      {/* Live Incidents Section */}
      <div className="p-6 rounded-2xl bg-[#0f141e] border border-[#1e2638] flex flex-col gap-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#ef4444]">report_problem</span>
            <h2 className="text-base font-bold text-white font-heading">Active Security Incidents</h2>
          </div>
          <span className="text-xs text-[#64748b] font-mono">Showing 3 Active SOC Incidents</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#1e2638] text-[10px] font-mono text-[#64748b] uppercase">
                <th className="pb-3 px-3">Incident ID</th>
                <th className="pb-3 px-3">Threat Category</th>
                <th className="pb-3 px-3">Severity</th>
                <th className="pb-3 px-3">Risk Score</th>
                <th className="pb-3 px-3">Affected User</th>
                <th className="pb-3 px-3">Assigned Analyst</th>
                <th className="pb-3 px-3">Status</th>
                <th className="pb-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#161b26] text-xs">
              {liveIncidents.map((inc) => (
                <tr key={inc.id} className="hover:bg-[#161b26]/50 transition-colors">
                  <td className="py-3.5 px-3 font-mono font-bold text-[#ef4444]">{inc.id}</td>
                  <td className="py-3.5 px-3 font-semibold text-white">{inc.title}</td>
                  <td className="py-3.5 px-3">
                    <span className={`px-2.5 py-0.5 rounded font-mono text-[10px] font-extrabold ${
                      inc.severity === 'CRITICAL' ? 'bg-[#ef4444]/20 text-[#ef4444]' : 'bg-[#f59e0b]/20 text-[#f59e0b]'
                    }`}>
                      {inc.severity}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 font-mono font-bold text-white">{inc.riskScore} / 100</td>
                  <td className="py-3.5 px-3 text-[#94a3b8]">{inc.user}</td>
                  <td className="py-3.5 px-3 text-white font-medium">{inc.analyst}</td>
                  <td className="py-3.5 px-3">
                    <span className="px-2 py-0.5 rounded bg-[#1e2638] text-[#3b82f6] font-mono text-[10px] font-bold">
                      {inc.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    <button
                      className="px-3 py-1 rounded-lg bg-[#ef4444]/20 border border-[#ef4444]/40 text-[#ef4444] font-mono text-xs font-bold hover:bg-[#ef4444]/30 transition-all cursor-pointer"
                      onClick={() => {
                        setSelectedIncidentId(inc.id);
                        setActiveView('admin-incidents');
                      }}
                    >
                      INVESTIGATE →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
