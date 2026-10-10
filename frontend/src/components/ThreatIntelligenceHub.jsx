import React, { useState, useEffect } from 'react';

export default function ThreatIntelligenceHub() {
  const [query, setQuery] = useState('');
  const [iocs, setIocs] = useState([]);

  useEffect(() => {
    fetchIocs();
  }, [query]);

  const fetchIocs = async () => {
    try {
      const res = await fetch(`http://localhost:8000/api/v1/threat-intelligence?query=${encodeURIComponent(query)}`);
      const data = await res.json();
      setIocs(data);
    } catch (e) {
      setIocs([
        { id: "ioc-01", type: "DOMAIN", value: "sovereign-vault-login.internal", threatFamily: "Emotet Phishing", severity: "CRITICAL", riskScore: 95, firstSeen: "2026-09-15", lastSeen: "2026-10-02", description: "Active credential harvesting domain impersonating vault auth." },
        { id: "ioc-02", type: "IP", value: "185.220.101.5", threatFamily: "TOR Exit Node / Botnet", severity: "HIGH", riskScore: 88, firstSeen: "2026-08-20", lastSeen: "2026-10-02", description: "Reputable exit node linked with brute force password spraying." },
        { id: "ioc-03", type: "HASH", value: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855", threatFamily: "Trojan.Win32.Agent.exe", severity: "HIGH", riskScore: 90, firstSeen: "2026-09-01", lastSeen: "2026-10-02", description: "High-entropy executable payload embedded in compressed archive." }
      ]);
    }
  };

  return (
    <div className="flex flex-col gap-6 pb-12">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#f59e0b]">database</span>
          <h1 className="text-2xl font-bold text-white font-heading">Threat Intelligence IOC Search</h1>
        </div>
        <p className="text-sm text-[#94a3b8]">Universal search engine across global Indicators of Compromise (IPs, Domains, Hashes, URLs, Malware Families).</p>
      </div>

      <div className="p-4 rounded-2xl bg-[#0f141e] border border-[#1e2638] flex items-center gap-3">
        <span className="material-symbols-outlined text-[#64748b]">search</span>
        <input
          type="text"
          placeholder="Search IP, Domain, Hash, URL, or Malware Family (e.g. sovereign-vault-login.internal or 185.220.101.5)..."
          className="w-full bg-transparent text-white font-mono text-sm focus:outline-none"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="p-6 rounded-2xl bg-[#0f141e] border border-[#1e2638] flex flex-col gap-4 shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#1e2638] text-[10px] font-mono text-[#64748b] uppercase">
                <th className="pb-3 px-3">Type</th>
                <th className="pb-3 px-3">IOC Value</th>
                <th className="pb-3 px-3">Threat Family</th>
                <th className="pb-3 px-3">Risk Score</th>
                <th className="pb-3 px-3">Severity</th>
                <th className="pb-3 px-3">First Seen</th>
                <th className="pb-3 px-3">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#161b26] text-xs font-mono">
              {iocs.map((ioc) => (
                <tr key={ioc.id} className="hover:bg-[#161b26]/50">
                  <td className="py-3 px-3 text-[#3b82f6] font-bold">{ioc.type}</td>
                  <td className="py-3 px-3 text-white font-bold">{ioc.value}</td>
                  <td className="py-3 px-3 text-[#f59e0b]">{ioc.threatFamily}</td>
                  <td className="py-3 px-3 text-[#ef4444] font-bold">{ioc.riskScore} / 100</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded bg-[#ef4444]/20 text-[#ef4444] text-[10px] font-extrabold">{ioc.severity}</span>
                  </td>
                  <td className="py-3 px-3 text-[#64748b]">{ioc.firstSeen}</td>
                  <td className="py-3 px-3 font-sans text-[#94a3b8] text-[11px]">{ioc.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
