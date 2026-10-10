import React, { useState } from 'react';

export default function ThreatAnalyzer({ initialTab = 'email', setActiveView }) {
  const [selectedTab, setSelectedTab] = useState(initialTab);
  const [sender, setSender] = useState('operator@sovereign-vault-login.internal');
  const [emailBody, setEmailBody] = useState('URGENT: Your sovereign vault account access has been compromised. Verify your login credentials within 15 minutes at http://sovereign-vault-login.internal/auth or your account will be permanently locked.');
  const [urlInput, setUrlInput] = useState('http://sovereign-vault-login.internal/auth/reset');
  const [fileName, setFileName] = useState('invoice_2026.pdf.exe');
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);

  const tabs = [
    { id: 'email', label: 'Email', icon: 'mail' },
    { id: 'message', label: 'Message', icon: 'chat' },
    { id: 'url', label: 'URL', icon: 'link' },
    { id: 'website', label: 'Website', icon: 'language' },
    { id: 'qr', label: 'QR Code', icon: 'qr_code_scanner' },
    { id: 'file', label: 'File', icon: 'upload_file' },
    { id: 'image', label: 'Image', icon: 'image' },
    { id: 'audio', label: 'Audio', icon: 'graphic_eq' },
    { id: 'video', label: 'Video', icon: 'movie' },
    { id: 'log', label: 'Log', icon: 'article' }
  ];

  const handleRunAnalysis = async () => {
    setIsAnalyzing(true);
    setResult(null);

    try {
      const response = await fetch('http://localhost:8000/api/v1/analyze/threat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inputType: selectedTab,
          sender: sender,
          content: emailBody,
          url: urlInput,
          fileName: fileName
        })
      });
      const data = await response.json();
      setResult(data);
    } catch (err) {
      // Fallback mock if FastAPI server offline
      setResult({
        category: "PHISHING",
        threatCategory: "Phishing & Credential Theft",
        riskScore: 92,
        severity: "CRITICAL",
        confidence: 94,
        attackTechnique: "T1566.002 - Spearphishing Link",
        indicators: [
          "Look-alike sender domain (@sovereign-vault-login.internal)",
          "High-urgency coercion phrase ('15 minutes')",
          "Credential harvesting form embedded",
          "Insecure HTTP URL target"
        ],
        evidence: [
          { type: "SENDER_DOMAIN", label: "Domain Mismatch", detail: "Claimed: Sovereign Vault, Actual: sovereign-vault-login.internal", impact: "+30" },
          { type: "NLP_URGENCY", label: "Coercive Language", detail: "Detected phrase: 'Account permanently locked within 15 mins'", impact: "+25" },
          { type: "URL_HARVEST", label: "Credential Form", detail: "Destination points to credential harvesting form", impact: "+25" },
          { type: "BRAND_IMPERSONATION", "label": "Asset Copy", "detail": "98% match to Microsoft 365 login screen assets", "impact": "+17" }
        ],
        explanation: "High risk classification. The message originates from look-alike domain 'operator@sovereign-vault-login.internal' and contains coercive urgency language demanding immediate credential validation.",
        recommendedResponse: [
          "Do not click embedded links",
          "Quarantine message in email gateway",
          "Block domain sovereign-vault-login.internal",
          "Report threat attempt to SecOps Team"
        ]
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 pb-12">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#f59e0b]">travel_explore</span>
          <h1 className="text-2xl font-bold text-white font-heading">Unified Threat Analyzer</h1>
        </div>
        <p className="text-sm text-[#94a3b8]">
          Multi-modal detection engine for Phishing, Malware, Digital Impersonation, Deepfakes, and Malicious Infrastructure.
        </p>
      </div>

      {/* Input Selection Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#1e2638]">
        {tabs.map((t) => (
          <button
            key={t.id}
            className={`px-4 py-2 rounded-xl font-mono text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap border-0 ${
              selectedTab === t.id
                ? 'bg-[#f59e0b] text-[#080a0f] shadow-[0_0_12px_rgba(245,158,11,0.3)] font-bold'
                : 'bg-[#0f141e] text-[#94a3b8] hover:text-white hover:bg-[#161b26]'
            }`}
            onClick={() => {
              setSelectedTab(t.id);
              setResult(null);
            }}
          >
            <span className="material-symbols-outlined text-[18px]">{t.icon}</span>
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      {/* Input Form Box */}
      <div className="p-6 rounded-2xl bg-[#0f141e] border border-[#1e2638] flex flex-col gap-5 shadow-xl">
        <h2 className="text-sm font-mono text-[#f59e0b] uppercase tracking-wider font-bold flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px]">input</span>
          INPUT CONTENT FOR ANALYSIS ({selectedTab.toUpperCase()})
        </h2>

        {selectedTab === 'email' || selectedTab === 'message' ? (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 flex flex-col gap-1.5">
                <label className="text-xs font-mono text-[#94a3b8]">Sender Email / Domain</label>
                <input
                  type="text"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#080a0f] border border-[#1e2638] text-white text-sm focus:outline-none focus:border-[#f59e0b]"
                  value={sender}
                  onChange={(e) => setSender(e.target.value)}
                />
              </div>
              <div className="flex-1 flex flex-col gap-1.5">
                <label className="text-xs font-mono text-[#94a3b8]">Embedded URL Target</label>
                <input
                  type="text"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#080a0f] border border-[#1e2638] text-white text-sm focus:outline-none focus:border-[#f59e0b]"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-mono text-[#94a3b8]">Email / Message Body Content</label>
              <textarea
                rows={4}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#080a0f] border border-[#1e2638] text-white text-sm focus:outline-none focus:border-[#f59e0b] font-mono leading-relaxed"
                value={emailBody}
                onChange={(e) => setEmailBody(e.target.value)}
              />
            </div>
          </div>
        ) : selectedTab === 'url' || selectedTab === 'website' || selectedTab === 'qr' ? (
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-mono text-[#94a3b8]">Target URL / Web Domain</label>
            <input
              type="text"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#080a0f] border border-[#1e2638] text-white text-sm focus:outline-none focus:border-[#f59e0b]"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
            />
          </div>
        ) : selectedTab === 'file' ? (
          <div className="flex flex-col gap-4">
            <div className="border-2 border-dashed border-[#1e2638] hover:border-[#f59e0b] rounded-2xl p-8 flex flex-col items-center justify-center gap-3 text-center cursor-pointer transition-colors bg-[#080a0f]/50">
              <span className="material-symbols-outlined text-[#f59e0b] text-[40px]">upload_file</span>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-white">Drag & drop suspicious file or browse local disk</span>
                <span className="text-xs text-[#64748b] font-mono">Supported: PDF, DOCX, ZIP, EXE, DLL, JS, PY, HTML (Static Analysis Only)</span>
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-mono text-[#94a3b8]">File Name & Extension</label>
              <input
                type="text"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#080a0f] border border-[#1e2638] text-white text-sm focus:outline-none focus:border-[#f59e0b]"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
              />
            </div>
          </div>
        ) : (
          <div className="border-2 border-dashed border-[#1e2638] rounded-2xl p-8 flex flex-col items-center justify-center gap-3 text-center bg-[#080a0f]/50">
            <span className="material-symbols-outlined text-[#8b5cf6] text-[40px]">graphic_eq</span>
            <span className="text-sm font-semibold text-white">Upload Media (Image / Audio / Video) for Synthetic Artifact Scan</span>
            <span className="text-xs text-[#64748b]">Evaluates spectrogram harmonics, facial consistency, and ElevenLabs model signatures</span>
          </div>
        )}

        <button
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#f59e0b] to-[#d97706] text-[#080a0f] font-mono text-sm font-bold uppercase tracking-wider hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(245,158,11,0.3)] cursor-pointer border-0 mt-2"
          onClick={handleRunAnalysis}
          disabled={isAnalyzing}
        >
          {isAnalyzing ? (
            <>
              <span className="animate-spin material-symbols-outlined text-[20px]">sync</span>
              <span>RUNNING AI DETECTION ENGINE...</span>
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-[20px]">verified</span>
              <span>ANALYZE THREAT</span>
            </>
          )}
        </button>
      </div>

      {/* Threat Analysis Output Section */}
      {result && (
        <div className="p-6 lg:p-8 rounded-2xl bg-[#0f141e] border border-[#1e2638] flex flex-col gap-6 shadow-2xl animate-fade-in">
          {/* Top Result Banner */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-[#1e2638]">
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg ${
                result.severity === 'CRITICAL' ? 'bg-gradient-to-tr from-[#ef4444] to-[#b91c1c]' :
                result.severity === 'HIGH' ? 'bg-gradient-to-tr from-[#f59e0b] to-[#d97706]' :
                'bg-gradient-to-tr from-[#10b981] to-[#047857]'
              }`}>
                <span className="material-symbols-outlined text-[32px]">security</span>
              </div>
              <div className="flex flex-col">
                <span className="font-mono text-xs text-[#64748b] uppercase tracking-wider font-semibold">CLASSIFICATION RESULT</span>
                <h2 className="text-xl font-bold text-white font-heading flex items-center gap-2">
                  {result.threatCategory || result.category}
                </h2>
                <span className="text-xs text-[#94a3b8] font-mono">ATT&CK Technique: {result.attackTechnique}</span>
              </div>
            </div>

            {/* Risk Gauge & Badges */}
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-[#080a0f] border border-[#1e2638] flex flex-col items-center">
                <span className="font-mono text-[10px] text-[#64748b] uppercase">RISK SCORE</span>
                <span className={`font-mono text-2xl font-extrabold ${
                  result.riskScore >= 80 ? 'text-[#ef4444]' : result.riskScore >= 50 ? 'text-[#f59e0b]' : 'text-[#10b981]'
                }`}>{result.riskScore} / 100</span>
              </div>
              <div className="p-3 rounded-xl bg-[#080a0f] border border-[#1e2638] flex flex-col items-center">
                <span className="font-mono text-[10px] text-[#64748b] uppercase">CONFIDENCE</span>
                <span className="font-mono text-2xl font-extrabold text-[#3b82f6]">{result.confidence}%</span>
              </div>
              <div className="p-3 rounded-xl bg-[#080a0f] border border-[#1e2638] flex flex-col items-center">
                <span className="font-mono text-[10px] text-[#64748b] uppercase">SEVERITY</span>
                <span className={`px-2.5 py-0.5 mt-1 rounded font-mono text-xs font-extrabold ${
                  result.severity === 'CRITICAL' ? 'bg-[#ef4444]/20 text-[#ef4444]' :
                  result.severity === 'HIGH' ? 'bg-[#f59e0b]/20 text-[#f59e0b]' :
                  'bg-[#10b981]/20 text-[#10b981]'
                }`}>{result.severity}</span>
              </div>
            </div>
          </div>

          {/* Indicators List */}
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-mono text-[#f59e0b] uppercase font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">find_in_page</span>
              DETECTION INDICATORS
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {result.indicators.map((ind, i) => (
                <div key={i} className="p-3 rounded-xl bg-[#080a0f] border border-[#1e2638] text-xs text-white flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-[#ef4444] text-[16px]">priority_high</span>
                  <span>{ind}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Evidence Breakdown */}
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-mono text-[#f59e0b] uppercase font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">fact_check</span>
              EVIDENCE EXTRACTION
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#1e2638] text-[10px] font-mono text-[#64748b] uppercase">
                    <th className="pb-2 px-2">Evidence Type</th>
                    <th className="pb-2 px-2">Signal Label</th>
                    <th className="pb-2 px-2">Extracted Details</th>
                    <th className="pb-2 px-2">Risk Impact</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#161b26] text-xs">
                  {result.evidence.map((ev, i) => (
                    <tr key={i} className="hover:bg-[#161b26]/50">
                      <td className="py-2.5 px-2 font-mono text-[#3b82f6]">{ev.type}</td>
                      <td className="py-2.5 px-2 font-semibold text-white">{ev.label}</td>
                      <td className="py-2.5 px-2 text-[#94a3b8]">{ev.detail}</td>
                      <td className="py-2.5 px-2 font-mono text-[#ef4444] font-bold">{ev.impact}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Explainable AI Explanation */}
          <div className="p-4 rounded-xl bg-[#080a0f] border border-[#1e2638] flex flex-col gap-2">
            <span className="font-mono text-xs text-[#f59e0b] font-bold flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px]">psychology</span>
              EXPLAINABLE AI REASONING
            </span>
            <p className="text-xs text-[#e2e8f0] leading-relaxed font-mono">
              {result.explanation}
            </p>
          </div>

          {/* Recommended Countermeasures */}
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-mono text-[#10b981] uppercase font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">shield</span>
              RECOMMENDED COUNTERMEASURES
            </h3>
            <div className="flex flex-col gap-2">
              {result.recommendedResponse.map((rec, i) => (
                <div key={i} className="p-3 rounded-xl bg-[#080a0f] border border-[#10b981]/30 text-xs text-[#10b981] flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-[16px]">check_circle</span>
                  <span>{rec}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Action Bar */}
          <div className="flex items-center justify-between pt-4 border-t border-[#1e2638]">
            <button
              className="px-4 py-2 rounded-xl bg-[#ef4444]/20 border border-[#ef4444]/40 text-[#ef4444] font-mono text-xs font-bold hover:bg-[#ef4444]/30 transition-all cursor-pointer"
              onClick={() => setActiveView('user-incidents')}
            >
              CREATE INCIDENT #INC-1024
            </button>
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 rounded-xl bg-[#1e2638] text-white font-mono text-xs hover:bg-[#2a3449] transition-all cursor-pointer border-0">
                DOWNLOAD ANALYSIS REPORT
              </button>
              <button 
                className="px-4 py-2 rounded-xl bg-[#f59e0b] text-[#080a0f] font-mono text-xs font-bold hover:brightness-110 transition-all cursor-pointer border-0"
                onClick={() => setActiveView('admin-incidents')}
              >
                INVESTIGATE IN SOC CONSOLE →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
