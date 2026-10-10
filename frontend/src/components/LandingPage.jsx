import React from 'react';

export default function LandingPage({ setActiveView, setCurrentRole }) {
  return (
    <div className="min-h-screen bg-[#080a0f] text-white flex flex-col pt-16 font-sans">
      {/* Hero Section */}
      <section className="relative px-6 lg:px-16 py-20 flex flex-col items-center justify-center text-center overflow-hidden border-b border-[#161b26]">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#f59e0b]/10 rounded-full blur-[120px] -z-0 pointer-events-none"></div>

        <div className="relative z-10 max-w-4xl flex flex-col items-center gap-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#f59e0b]/10 border border-[#f59e0b]/30">
            <span className="material-symbols-outlined text-[#f59e0b] text-[18px]">verified_user</span>
            <span className="font-mono text-xs text-[#f59e0b] font-bold tracking-wider uppercase">AI-POWERED DEFENSIVE CYBERSECURITY</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold font-heading tracking-tight leading-tight">
            Detect. Understand. <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#f59e0b] via-[#ef4444] to-[#8b5cf6]">Respond.</span>
          </h1>

          <p className="text-lg sm:text-xl text-[#94a3b8] max-w-2xl font-light leading-relaxed">
            AI-powered cyber threat, phishing & digital impersonation detection and response platform for enterprise SOCs and digital trust ecosystems.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-[#f59e0b] to-[#d97706] text-[#080a0f] font-mono text-sm font-bold uppercase tracking-wider hover:brightness-110 transition-all flex items-center gap-3 shadow-[0_0_25px_rgba(245,158,11,0.4)] cursor-pointer border-0"
              onClick={() => {
                setCurrentRole('USER');
                setActiveView('user-dashboard');
              }}
            >
              <span>PROTECT YOUR ORGANIZATION</span>
              <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
            </button>

            <button
              className="px-8 py-4 rounded-xl bg-[#0f141e] border border-[#1e2638] text-white font-mono text-sm font-bold uppercase tracking-wider hover:border-[#f59e0b] transition-all flex items-center gap-3 cursor-pointer"
              onClick={() => {
                setCurrentRole('USER');
                setActiveView('user-analyze');
              }}
            >
              <span className="material-symbols-outlined text-[20px]">travel_explore</span>
              <span>ANALYZE A THREAT</span>
            </button>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="px-6 lg:px-16 py-20 border-b border-[#161b26] bg-[#0f141e]">
        <div className="max-w-6xl mx-auto flex flex-col gap-12">
          <div className="text-center flex flex-col items-center gap-2">
            <span className="font-mono text-xs text-[#f59e0b] font-bold uppercase">ENTERPRISE CORE CAPABILITIES</span>
            <h2 className="text-3xl font-bold font-heading">Complete Threat Defense System</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'Phishing Detection', desc: 'Analyzes email headers, urgency coercion, credential harvesting URLs, and look-alike domains.', icon: 'mail', color: 'text-[#f59e0b]' },
              { title: 'Safe Static Malware Scanner', desc: 'Inspects double extensions, SHA-256 signatures, entropy, and obfuscated payload scripts without code execution.', icon: 'folder_zip', color: 'text-[#ef4444]' },
              { title: 'Digital Impersonation', desc: 'Detects sender identity mismatches, CEO communication anomalies, and forged domain claims.', icon: 'face', color: 'text-[#8b5cf6]' },
              { title: 'Deepfake Media Assessment', desc: 'Evaluates high-frequency vocal harmonics, spectrogram gaps, and video frame lip-sync drift.', icon: 'movie', color: 'text-[#3b82f6]' },
              { title: 'Account Takeover Monitoring', desc: 'Correlates failed logins, impossible travel, unknown device fingerprints, and password sprays.', icon: 'lock_open', color: 'text-[#ef4444]' },
              { title: 'AI Security Copilot', desc: 'Natural language assistant answering queries on threat evidence, attack graphs, and countermeasures.', icon: 'smart_toy', color: 'text-[#10b981]' }
            ].map((f, i) => (
              <div key={i} className="p-6 rounded-2xl bg-[#080a0f] border border-[#1e2638] flex flex-col gap-3 hover:border-[#f59e0b]/50 transition-all">
                <span className={`material-symbols-outlined ${f.color} text-[32px]`}>{f.icon}</span>
                <h3 className="text-lg font-bold text-white font-heading">{f.title}</h3>
                <p className="text-xs text-[#94a3b8] leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Animated Attack-Flow Section */}
      <section className="px-6 lg:px-16 py-20 bg-[#080a0f]">
        <div className="max-w-5xl mx-auto flex flex-col items-center gap-8 text-center">
          <span className="font-mono text-xs text-[#f59e0b] font-bold uppercase">AUTOMATED DEFENSE PIPELINE</span>
          <h2 className="text-2xl lg:text-3xl font-bold font-heading">From Threat Submission to Countermeasure Resolution</h2>

          <div className="w-full grid grid-cols-1 md:grid-cols-5 gap-3 pt-4 font-mono text-xs">
            {[
              { step: '01', label: 'THREAT SUBMISSION', sub: 'User submits asset', icon: 'input' },
              { step: '02', label: 'AI DETECTION', sub: 'Extracted indicators', icon: 'psychology' },
              { step: '03', label: 'RISK SCORE', sub: 'Transparent 0-100 gauge', icon: 'speed' },
              { step: '04', label: 'INCIDENT CREATED', sub: 'Routed to SOC Console', icon: 'report_problem' },
              { step: '05', label: 'COUNTERMEASURE', sub: 'Analyst approved firewall block', icon: 'shield' }
            ].map((p) => (
              <div key={p.step} className="p-4 rounded-2xl bg-[#0f141e] border border-[#1e2638] flex flex-col items-center gap-2">
                <span className="text-[10px] text-[#64748b] font-bold">STEP {p.step}</span>
                <span className="material-symbols-outlined text-[#f59e0b] text-[24px]">{p.icon}</span>
                <span className="font-bold text-white text-xs">{p.label}</span>
                <span className="text-[10px] text-[#94a3b8] font-sans">{p.sub}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
