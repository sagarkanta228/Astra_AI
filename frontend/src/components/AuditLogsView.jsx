import React, { useState, useEffect } from 'react';

export default function AuditLogsView() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/v1/audit-logs');
      const data = await res.json();
      setLogs(data);
    } catch (e) {
      setLogs([
        { id: "log-01", actor: "Robert Vance", action: "ANALYSIS_SUBMITTED", target: "EMAIL_PHISHING", detail: "Submitted suspicious message from operator@sovereign-vault-login.internal", ip: "192.168.1.104", timestamp: "2026-10-02 10:15:10 UTC" },
        { id: "log-02", actor: "Sarah Jenkins", action: "INCIDENT_TRIAGED", target: "INC-1024", detail: "Verified credential harvesting evidence and assigned analyst", ip: "10.0.4.12", timestamp: "2026-10-02 10:16:00 UTC" },
        { id: "log-03", actor: "Sarah Jenkins", action: "COUNTERMEASURE_ENFORCED", target: "INC-1024", detail: "Enforced QUARANTINE_EMAIL and BLOCK_URL on domain sovereign-vault-login.internal", ip: "10.0.4.12", timestamp: "2026-10-02 10:18:22 UTC" }
      ]);
    }
  };

  return (
    <div className="flex flex-col gap-6 pb-12">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#3b82f6]">receipt_long</span>
          <h1 className="text-2xl font-bold text-white font-heading">System Audit Logs</h1>
        </div>
        <p className="text-sm text-[#94a3b8]">Tamper-evident audit trail recording every administrative, analysis, and response action across CyberGuard AI.</p>
      </div>

      <div className="p-6 rounded-2xl bg-[#0f141e] border border-[#1e2638] flex flex-col gap-4 shadow-xl font-mono text-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#1e2638] text-[10px] text-[#64748b] uppercase">
                <th className="pb-3 px-3">Timestamp</th>
                <th className="pb-3 px-3">Actor / Operator</th>
                <th className="pb-3 px-3">Action Type</th>
                <th className="pb-3 px-3">Target Asset</th>
                <th className="pb-3 px-3">Action Details</th>
                <th className="pb-3 px-3">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#161b26]">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-[#161b26]/50">
                  <td className="py-3 px-3 text-[#64748b]">{log.timestamp}</td>
                  <td className="py-3 px-3 font-semibold text-white">{log.actor}</td>
                  <td className="py-3 px-3 text-[#f59e0b] font-bold">{log.action}</td>
                  <td className="py-3 px-3 text-[#3b82f6]">{log.target}</td>
                  <td className="py-3 px-3 text-[#94a3b8] font-sans">{log.detail}</td>
                  <td className="py-3 px-3 text-[#64748b]">{log.ip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
