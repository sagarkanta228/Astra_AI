import React, { useState } from 'react';

export default function AISecurityCopilotConsole() {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([
    { sender: 'ai', text: 'Hello Analyst Sarah Jenkins. I am CyberGuard AI Security Copilot. Ask me anything regarding active incidents, evidence analysis, attack timelines, or recommended countermeasures.' }
  ]);
  const [isAsking, setIsAsking] = useState(false);

  const suggestedQuestions = [
    "What happened in incident #INC-1024?",
    "Why was this classified as phishing?",
    "Show the extracted evidence indicators.",
    "Which users and devices are affected?",
    "What countermeasure actions should we enforce next?"
  ];

  const handleAsk = async (userQ) => {
    const qText = userQ || query;
    if (!qText.trim()) return;

    const newMsgs = [...messages, { sender: 'user', text: qText }];
    setMessages(newMsgs);
    setQuery('');
    setIsAsking(true);

    try {
      const res = await fetch('http://localhost:8000/api/v1/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: qText })
      });
      const data = await res.json();
      setMessages([...newMsgs, { sender: 'ai', text: data.answer }]);
    } catch (e) {
      setMessages([...newMsgs, { sender: 'ai', text: `Incident #INC-1024 involves a Critical Phishing campaign (Risk: 92/100). The attacker impersonated Sovereign Vault using domain '@sovereign-vault-login.internal' with an unencrypted credential harvesting URL. Recommended action is to quarantine the email and block the domain.` }]);
    } finally {
      setIsAsking(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 pb-12 h-[calc(100vh-120px)]">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#8b5cf6]">smart_toy</span>
          <h1 className="text-2xl font-bold text-white font-heading">AI Security Copilot</h1>
        </div>
        <p className="text-sm text-[#94a3b8]">Interactive natural language assistant trained on CyberGuard platform telemetry and MITRE ATT&CK frameworks.</p>
      </div>

      {/* Chat Container */}
      <div className="flex-1 p-6 rounded-2xl bg-[#0f141e] border border-[#1e2638] flex flex-col justify-between gap-4 overflow-hidden shadow-xl">
        <div className="flex flex-col gap-4 overflow-y-auto pr-2">
          {messages.map((m, i) => (
            <div key={i} className={`flex gap-3 text-xs leading-relaxed max-w-3xl ${m.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-white shrink-0 ${
                m.sender === 'user' ? 'bg-[#f59e0b]' : 'bg-[#8b5cf6]'
              }`}>
                <span className="material-symbols-outlined text-[18px]">{m.sender === 'user' ? 'person' : 'smart_toy'}</span>
              </div>
              <div className={`p-4 rounded-2xl font-mono ${
                m.sender === 'user'
                  ? 'bg-[#f59e0b]/15 text-[#f59e0b] border border-[#f59e0b]/30'
                  : 'bg-[#080a0f] text-white border border-[#1e2638]'
              }`}>
                {m.text}
              </div>
            </div>
          ))}
          {isAsking && (
            <div className="flex items-center gap-2 text-xs font-mono text-[#8b5cf6] animate-pulse">
              <span className="material-symbols-outlined text-[18px]">sync</span>
              <span>Analyzing telemetry graph...</span>
            </div>
          )}
        </div>

        {/* Suggested Quick Questions */}
        <div className="flex flex-col gap-2 pt-2 border-t border-[#1e2638]">
          <span className="text-[10px] font-mono text-[#64748b]">SUGGESTED COPILOT PROMPTS:</span>
          <div className="flex flex-wrap gap-2">
            {suggestedQuestions.map((sq, i) => (
              <button
                key={i}
                className="px-3 py-1.5 rounded-lg bg-[#080a0f] border border-[#1e2638] text-[#94a3b8] hover:text-white hover:border-[#8b5cf6] font-mono text-[11px] transition-all cursor-pointer"
                onClick={() => handleAsk(sq)}
              >
                {sq}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Ask AI Copilot about incidents, evidence, timelines, or countermeasures..."
            className="flex-1 px-4 py-3 rounded-xl bg-[#080a0f] border border-[#1e2638] text-white text-xs font-mono focus:outline-none focus:border-[#8b5cf6]"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
          />
          <button
            className="px-5 py-3 rounded-xl bg-[#8b5cf6] text-white font-mono text-xs font-bold hover:brightness-110 transition-all cursor-pointer border-0 shadow-[0_0_15px_rgba(139,92,246,0.3)] flex items-center gap-2"
            onClick={() => handleAsk()}
          >
            <span>SEND</span>
            <span className="material-symbols-outlined text-[16px]">send</span>
          </button>
        </div>
      </div>
    </div>
  );
}
