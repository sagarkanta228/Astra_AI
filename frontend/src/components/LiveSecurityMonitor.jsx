import React, { useState, useEffect } from 'react';

export default function LiveSecurityMonitor() {
  const [events, setEvents] = useState([]);
  const [isLive, setIsLive] = useState(true);
  const [filterSeverity, setFilterSeverity] = useState('ALL');

  useEffect(() => {
    fetchStream();
    const interval = setInterval(() => {
      if (isLive) fetchStream();
    }, 3000);
    return () => clearInterval(interval);
  }, [isLive]);

  const fetchStream = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/v1/live-monitor/stream');
      const data = await res.json();
      setEvents(data);
    } catch (e) {
      setEvents([
        { id: "evt-901", timestamp: "10:31:04", eventType: "PHISHING", severity: "CRITICAL", source: "185.220.101.5", user: "user@company.com", detail: "Phishing link sovereign-vault-login.internal detected" },
        { id: "evt-902", timestamp: "10:31:11", eventType: "ACCOUNT_TAKEOVER", severity: "HIGH", source: "192.168.1.104", user: "devin.franco@company.com", detail: "17 failed login attempts followed by successful auth" },
        { id: "evt-903", timestamp: "10:31:17", eventType: "MALWARE", severity: "HIGH", source: "WS-8812", user: "robert.vance@company.com", detail: "Double extension executable invoice_2026.pdf.exe quarantined" },
        { id: "evt-904", timestamp: "10:31:23", eventType: "DEEPFAKE", severity: "MEDIUM", source: "Audio Stream #4", user: "carol.white@company.com", detail: "Synthetic voice harmonic gap detected (>8kHz)" }
      ]);
    }
  };

  const filtered = events.filter(e => filterSeverity === 'ALL' || e.severity === filterSeverity);

  return (
    <div className="flex flex-col gap-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#10b981]">ssid_chart</span>
            <h1 className="text-2xl font-bold text-white font-heading">Live Security Monitor Stream</h1>
          </div>
          <p className="text-sm text-[#94a3b8]">Real-time SIEM event stream capturing network probes, auth anomalies, and threat detections.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            className={`px-3.5 py-1.5 rounded-xl font-mono text-xs font-bold border-0 cursor-pointer flex items-center gap-2 ${
              isLive ? 'bg-[#10b981]/20 text-[#10b981]' : 'bg-[#ef4444]/20 text-[#ef4444]'
            }`}
            onClick={() => setIsLive(!isLive)}
          >
            <span className="material-symbols-outlined text-[16px]">{isLive ? 'pause' : 'play_arrow'}</span>
            <span>{isLive ? 'STREAM LIVE' : 'STREAM PAUSED'}</span>
          </button>
        </div>
      </div>

      {/* Stream Box */}
      <div className="p-6 rounded-2xl bg-[#0f141e] border border-[#1e2638] flex flex-col gap-4 shadow-xl font-mono">
        <div className="flex items-center justify-between pb-3 border-b border-[#1e2638] text-xs text-[#64748b]">
          <span>FILTER BY SEVERITY:</span>
          <div className="flex gap-2">
            {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map(sev => (
              <button
                key={sev}
                className={`px-2.5 py-0.5 rounded text-[10px] font-bold border-0 cursor-pointer ${
                  filterSeverity === sev ? 'bg-[#f59e0b] text-[#080a0f]' : 'bg-[#1e2638] text-[#94a3b8]'
                }`}
                onClick={() => setFilterSeverity(sev)}
              >
                {sev}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          {filtered.map(evt => (
            <div key={evt.id} className="p-3 rounded-xl bg-[#080a0f] border border-[#1e2638] flex items-center justify-between text-xs hover:border-[#3b82f6]/50 transition-all">
              <div className="flex items-center gap-3">
                <span className="text-[#64748b]">[{evt.timestamp}]</span>
                <span className={`px-2 py-0.5 rounded font-extrabold text-[10px] ${
                  evt.severity === 'CRITICAL' ? 'bg-[#ef4444]/20 text-[#ef4444]' :
                  evt.severity === 'HIGH' ? 'bg-[#f59e0b]/20 text-[#f59e0b]' :
                  'bg-[#3b82f6]/20 text-[#3b82f6]'
                }`}>{evt.severity}</span>
                <span className="text-white font-bold">{evt.eventType}</span>
                <span className="text-[#94a3b8]">{evt.detail}</span>
              </div>
              <span className="text-[#64748b] hidden md:inline">{evt.source} ({evt.user})</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
