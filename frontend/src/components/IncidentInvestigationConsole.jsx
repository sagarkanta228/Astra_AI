import React, { useState, useEffect } from 'react';

export default function IncidentInvestigationConsole({ incidentId = 'INC-1024' }) {
  const [activeTab, setActiveTab] = useState('attack-chain');
  const [incident, setIncident] = useState(null);
  const [isApplyingResponse, setIsApplyingResponse] = useState(false);
  const [appliedActions, setAppliedActions] = useState([]);

  useEffect(() => {
    fetchIncidentData();
  }, [incidentId]);

  const fetchIncidentData = async () => {
    try {
      const res = await fetch(`http://localhost:8000/api/v1/incidents/${incidentId}`);
      const data = await res.json();
      setIncident(data);
    } catch (err) {
      // Fallback mock dataset
      setIncident({
        id: "INC-1024",
        title: "Credential Harvesting Phishing Campaign via Look-Alike Domain",
        threatType: "PHISHING",
        severity: "CRITICAL",
        riskScore: 92,
        confidence: 94,
        affectedUser: "Robert Vance (user@company.com)",
        affectedDevice: "Workstation WS-8812 (192.168.1.104)",
        status: "INVESTIGATING",
        assignedAnalyst: "Sarah Jenkins",
        detectedAt: "2026-10-02 10:14:02 UTC",
        summary: "Suspicious email claiming urgent password reset received from operator@sovereign-vault-login.internal with embedded credential harvesting URL.",
        attackTechnique: "T1566.002 - Phishing: Spearphishing Link",
        indicators: [
          "Look-alike sender domain (@sovereign-vault-login.internal)",
          "High-urgency language & suspension threat ('15 minutes')",
          "Embedded OAuth credential harvesting link",
          "M365 visual brand impersonation asset theft"
        ],
        evidence: [
          { type: "SENDER_DOMAIN", label: "Domain Mismatch", detail: "Claimed: Sovereign Vault, Actual: sovereign-vault-login.internal", impact: "+25" },
          { type: "NLP_URGENCY", label: "Urgent Coercion", detail: "Detected phrase: 'Account permanently suspended within 15 minutes'", impact: "+20" },
          { type: "URL_HARVEST", label: "Credential Form", detail: "URL destination contains unencrypted login credential form", impact: "+30" },
          { type: "BRAND_IMPERSONATION", label: "Asset Copy", detail: "98% structural match to Microsoft 365 OAuth screen", impact: "+17" }
        ],
        timeline: [
          { stageOrder: 1, stageName: "Phishing Email Delivered", timestamp: "10:14:02", description: "Email landed in user@company.com inbox from operator@sovereign-vault-login.internal", nodeType: "EMAIL" },
          { stageOrder: 2, stageName: "User Submitted Analysis", timestamp: "10:15:10", description: "User clicked Check Email in CyberGuard Threat Analyzer", nodeType: "USER_ACTION" },
          { stageOrder: 3, stageName: "AI Engine Classification", timestamp: "10:15:12", description: "AI Engine classified content as CRITICAL PHISHING (Risk: 92/100)", nodeType: "AI_ENGINE" },
          { stageOrder: 4, stageName: "Incident INC-1024 Created", timestamp: "10:15:13", description: "Automatic incident creation and routing to SecOps Admin", nodeType: "INCIDENT" },
          { stageOrder: 5, stageName: "Alert Routed to SOC", timestamp: "10:15:15", description: "High-priority alert dispatched to Live Security Monitor", nodeType: "ALERT" },
          { stageOrder: 6, stageName: "Countermeasure Confirmation", timestamp: "Pending", description: "Awaiting analyst approval for quarantine & URL block", nodeType: "RESPONSE" }
        ],
        attackChain: [
          { id: "node-1", label: "PHISHING EMAIL", subtext: "operator@sovereign-vault-login.internal", status: "MALICIOUS", icon: "mail" },
          { id: "node-2", label: "USER CLICK", subtext: "Clicked embedded link", status: "TRIGGERED", icon: "ads_click" },
          { id: "node-3", label: "CREDENTIAL HARVEST", subtext: "sovereign-vault-login.internal/auth", status: "CRITICAL", icon: "key" },
          { id: "node-4", label: "ACCOUNT COMPROMISE", subtext: "user@company.com credentials stolen", status: "SUSPECTED", icon: "lock_open" },
          { id: "node-5", label: "UNKNOWN DEVICE LOGIN", subtext: "185.220.101.5 (Android 14)", status: "DETECTED", icon: "devices" },
          { id: "node-6", label: "DATA ACCESS", subtext: "Access to Financial Vault #4", status: "PREVENTED", icon: "folder_shared" }
        ],
        recommendedResponse: [
          { action: "QUARANTINE_EMAIL", label: "Quarantine Phishing Email", reason: "Prevents other users from opening malicious message", requiresApproval: true },
          { action: "BLOCK_URL", label: "Block Domain sovereign-vault-login.internal", reason: "Halts active credential exfiltration tunnel at perimeter firewall", requiresApproval: true },
          { action: "REVOKE_SESSION", label: "Revoke User Session Tokens", reason: "Mitigates immediate account takeover risk", requiresApproval: true },
          { action: "FORCE_MFA", label: "Force Password Reset & MFA Prompt", reason: "Restores account integrity", requiresApproval: false }
        ]
      });
    }
  };

  const handleExecuteAction = async (actionKey) => {
    setIsApplyingResponse(true);
    try {
      await fetch(`http://localhost:8000/api/v1/incidents/${incidentId}/response`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: actionKey, confirmed: true })
      });
    } catch (e) {
      console.log('Using local fallback for action update');
    } finally {
      setIsApplyingResponse(false);
      setAppliedActions([...appliedActions, actionKey]);
      if (incident) {
        setIncident({ ...incident, status: 'CONTAINED' });
      }
    }
  };

  if (!incident) return <div className="p-8 text-white">Loading incident data...</div>;

  return (
    <div className="flex flex-col gap-6 pb-12">
      {/* Top Incident Summary Header */}
      <div className="p-6 rounded-2xl bg-[#0f141e] border border-[#1e2638] flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 shadow-xl">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <span className="font-mono text-lg font-extrabold text-[#ef4444] bg-[#ef4444]/15 px-3 py-1 rounded-lg border border-[#ef4444]/30">
              #{incident.id}
            </span>
            <span className={`px-2.5 py-0.5 rounded font-mono text-xs font-extrabold ${
              incident.severity === 'CRITICAL' ? 'bg-[#ef4444]/20 text-[#ef4444]' : 'bg-[#f59e0b]/20 text-[#f59e0b]'
            }`}>
              {incident.severity}
            </span>
            <span className="text-xs text-[#64748b] font-mono">Detected: {incident.detectedAt}</span>
          </div>

          <h1 className="text-2xl font-bold text-white font-heading">{incident.title}</h1>
          <p className="text-xs text-[#94a3b8] max-w-2xl">{incident.summary}</p>
        </div>

        {/* Status Dropdown & Analysts */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-[#080a0f] p-4 rounded-xl border border-[#1e2638]">
          <div className="flex flex-col">
            <span className="font-mono text-[10px] text-[#64748b] uppercase">INCIDENT STATUS</span>
            <span className={`font-mono text-sm font-bold ${
              incident.status === 'CONTAINED' ? 'text-[#10b981]' : 'text-[#3b82f6]'
            }`}>{incident.status}</span>
          </div>

          <div className="flex flex-col">
            <span className="font-mono text-[10px] text-[#64748b] uppercase">RISK SCORE</span>
            <span className="font-mono text-sm font-extrabold text-[#ef4444]">{incident.riskScore} / 100</span>
          </div>

          <div className="flex flex-col">
            <span className="font-mono text-[10px] text-[#64748b] uppercase">ASSIGNED ANALYST</span>
            <span className="font-sans text-xs font-semibold text-white">{incident.assignedAnalyst}</span>
          </div>
        </div>
      </div>

      {/* Tabs Row */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#1e2638]">
        {[
          { id: 'attack-chain', label: 'Attack Chain Graph', icon: 'hub' },
          { id: 'overview', label: 'Overview', icon: 'overview' },
          { id: 'evidence', label: 'Evidence Extraction', icon: 'fact_check' },
          { id: 'timeline', label: 'Attack Timeline', icon: 'timeline' },
          { id: 'explanation', label: 'AI Explanation', icon: 'psychology' },
          { id: 'response', label: 'Recommended Countermeasures', icon: 'shield' }
        ].map((tab) => (
          <button
            key={tab.id}
            className={`px-4 py-2.5 rounded-xl font-mono text-xs font-bold flex items-center gap-2 transition-all cursor-pointer border-0 ${
              activeTab === tab.id
                ? 'bg-[#ef4444] text-white shadow-[0_0_12px_rgba(239,68,68,0.3)]'
                : 'bg-[#0f141e] text-[#94a3b8] hover:text-white hover:bg-[#161b26]'
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="material-symbols-outlined text-[18px]">{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* TAB CONTENT: ATTACK CHAIN VISUAL GRAPH */}
      {activeTab === 'attack-chain' && (
        <div className="p-6 rounded-2xl bg-[#0f141e] border border-[#1e2638] flex flex-col gap-6 shadow-xl">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white font-heading flex items-center gap-2">
              <span className="material-symbols-outlined text-[#ef4444]">hub</span>
              Visual Attack Chain Graph (MITRE ATT&CK Mapping)
            </h2>
            <span className="text-xs text-[#64748b] font-mono">Interactive Nodes • Click to View Evidence</span>
          </div>

          {/* Interactive Graph Node Strip */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3 pt-2">
            {incident.attackChain.map((node, i) => (
              <div key={node.id} className="relative flex flex-col items-center">
                <div className={`w-full p-4 rounded-xl bg-[#080a0f] border text-center flex flex-col items-center gap-2 transition-all ${
                  node.status === 'CRITICAL' || node.status === 'MALICIOUS' ? 'border-[#ef4444] shadow-[0_0_12px_rgba(239,68,68,0.2)]' :
                  node.status === 'PREVENTED' ? 'border-[#10b981]' : 'border-[#1e2638]'
                }`}>
                  <span className={`material-symbols-outlined text-[24px] ${
                    node.status === 'CRITICAL' || node.status === 'MALICIOUS' ? 'text-[#ef4444]' :
                    node.status === 'PREVENTED' ? 'text-[#10b981]' : 'text-[#f59e0b]'
                  }`}>{node.icon}</span>

                  <span className="font-mono text-xs font-bold text-white leading-tight">{node.label}</span>
                  <span className="font-mono text-[10px] text-[#64748b] truncate w-full">{node.subtext}</span>

                  <span className={`px-2 py-0.5 rounded font-mono text-[9px] font-extrabold mt-1 ${
                    node.status === 'CRITICAL' || node.status === 'MALICIOUS' ? 'bg-[#ef4444]/20 text-[#ef4444]' :
                    node.status === 'PREVENTED' ? 'bg-[#10b981]/20 text-[#10b981]' : 'bg-[#1e2638] text-[#f59e0b]'
                  }`}>
                    {node.status}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-[#080a0f] border border-[#1e2638] text-xs text-[#94a3b8] flex items-center justify-between">
            <span>Attack Propagation Path: Phishing Email → Embedded Link Click → Credential Harvesting → Account Compromise → Device Anomaly → Data Access Prevented.</span>
            <span className="font-mono text-[#10b981] font-bold">CONTAINMENT READY</span>
          </div>
        </div>
      )}

      {/* TAB CONTENT: EVIDENCE */}
      {activeTab === 'evidence' && (
        <div className="p-6 rounded-2xl bg-[#0f141e] border border-[#1e2638] flex flex-col gap-4 shadow-xl">
          <h2 className="text-base font-bold text-white font-heading">Extracted Threat Evidence</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#1e2638] text-[10px] font-mono text-[#64748b] uppercase">
                  <th className="pb-2 px-2">Type</th>
                  <th className="pb-2 px-2">Signal Label</th>
                  <th className="pb-2 px-2">Technical Detail</th>
                  <th className="pb-2 px-2">Risk Impact</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#161b26] text-xs">
                {incident.evidence.map((ev, i) => (
                  <tr key={i} className="hover:bg-[#161b26]/50">
                    <td className="py-3 px-2 font-mono text-[#3b82f6]">{ev.type}</td>
                    <td className="py-3 px-2 font-semibold text-white">{ev.label}</td>
                    <td className="py-3 px-2 text-[#94a3b8]">{ev.detail}</td>
                    <td className="py-3 px-2 font-mono text-[#ef4444] font-bold">{ev.impact}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB CONTENT: TIMELINE */}
      {activeTab === 'timeline' && (
        <div className="p-6 rounded-2xl bg-[#0f141e] border border-[#1e2638] flex flex-col gap-6 shadow-xl">
          <h2 className="text-base font-bold text-white font-heading">Attack Chronological Timeline</h2>
          <div className="flex flex-col gap-4 relative pl-6 border-l-2 border-[#1e2638]">
            {incident.timeline.map((stage) => (
              <div key={stage.stageOrder} className="relative flex flex-col gap-1">
                <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-[#080a0f] border-2 border-[#ef4444] flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#ef4444]"></div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-white">{stage.stageName}</span>
                  <span className="font-mono text-[10px] text-[#64748b]">[{stage.timestamp}]</span>
                </div>
                <p className="text-xs text-[#94a3b8]">{stage.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: RECOMMENDED RESPONSE & COUNTERMEASURES */}
      {(activeTab === 'response' || activeTab === 'overview' || activeTab === 'explanation') && (
        <div className="p-6 rounded-2xl bg-[#0f141e] border border-[#1e2638] flex flex-col gap-6 shadow-xl">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white font-heading flex items-center gap-2">
              <span className="material-symbols-outlined text-[#10b981]">admin_panel_settings</span>
              Countermeasure Response Engine
            </h2>
            <span className="text-xs text-[#64748b] font-mono">Requires Analyst Approval for High-Impact Actions</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {incident.recommendedResponse.map((rec) => {
              const isApplied = appliedActions.includes(rec.action);
              return (
                <div key={rec.action} className="p-5 rounded-2xl bg-[#080a0f] border border-[#1e2638] flex flex-col justify-between gap-4">
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-sm">{rec.label}</span>
                      {isApplied ? (
                        <span className="px-2 py-0.5 rounded bg-[#10b981]/20 text-[#10b981] font-mono text-[10px] font-bold">ENFORCED</span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-[#f59e0b]/20 text-[#f59e0b] font-mono text-[10px] font-bold">APPROVAL REQ</span>
                      )}
                    </div>
                    <p className="text-xs text-[#94a3b8]">{rec.reason}</p>
                  </div>

                  <button
                    className={`w-full py-2.5 rounded-xl font-mono text-xs font-bold transition-all border-0 cursor-pointer ${
                      isApplied 
                        ? 'bg-[#10b981]/20 text-[#10b981] cursor-not-allowed'
                        : 'bg-[#ef4444] text-white hover:brightness-110 shadow-[0_0_12px_rgba(239,68,68,0.3)]'
                    }`}
                    onClick={() => handleExecuteAction(rec.action)}
                    disabled={isApplied || isApplyingResponse}
                  >
                    {isApplied ? '✓ ACTION EXECUTED' : `APPROVE & ENFORCE (${rec.action})`}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
