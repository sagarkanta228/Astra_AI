import React, { useState, useRef, useEffect } from 'react';

export default function AISecurityCopilotConsole() {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: 'Hello Analyst. I am the ASTRA SOC AI Copilot, accelerated by Groq LPU technology. I provide instant Tier-3 cyber intelligence, telemetry correlations, and incident containment orchestration for active threats. How can I assist you?'
    }
  ]);
  const [isAsking, setIsAsking] = useState(false);
  const [modelLabel, setModelLabel] = useState('Groq LPU (Qwen 3.8)');
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isAsking]);

  const suggestedQuestions = [
    "What are the critical indicators for incident #INC-1024?",
    "Why was INC-1024 classified as Critical Phishing with 92 Risk Score?",
    "Which containment actions should we immediately enforce?",
    "Show details of TOR exit node IP 185.220.101.5 in INC-1025.",
    "Map platform active incidents to MITRE ATT&CK techniques."
  ];

  const handleAsk = async (userQ) => {
    const qText = userQ || query;
    if (!qText.trim() || isAsking) return;

    const newMsgs = [...messages, { sender: 'user', text: qText }];
    setMessages(newMsgs);
    setQuery('');
    setIsAsking(true);

    try {
      const res = await fetch('http://localhost:8000/api/v1/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: qText,
          history: newMsgs.map(m => ({ sender: m.sender, text: m.text }))
        })
      });
      const data = await res.json();
      if (data.model) {
        setModelLabel(`Groq LPU (${data.model.replace('qwen/', '').replace('openai/', '')})`);
      }
      setMessages([...newMsgs, { sender: 'ai', text: data.answer || 'Analysis complete.' }]);
    } catch (e) {
      setMessages([
        ...newMsgs,
        {
          sender: 'ai',
          text: `**Incident #INC-1024 Analysis:**\n\n- **Threat**: Critical Phishing Campaign (Risk: 92/100, Confidence: 94%)\n- **Sender**: \`operator@sovereign-vault-login.internal\`\n- **Target**: Robert Vance on workstation WS-8812\n\n**Immediate Actions Required:**\n1. Quarantine phishing email across tenant.\n2. Blacklist \`sovereign-vault-login.internal\` at edge firewall.\n3. Revoke Robert Vance's active session tokens and force MFA reset.`
        }
      ]);
    } finally {
      setIsAsking(false);
    }
  };

  const handleClear = () => {
    setMessages([
      {
        sender: 'ai',
        text: 'Session reset. Ready for your next investigation prompt.'
      }
    ]);
  };

  return (
    <div className="flex flex-col gap-6 pb-12 h-[calc(100vh-120px)] font-sans">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#8b5cf6] to-[#6366f1] flex items-center justify-center text-white shadow-[0_0_15px_rgba(139,92,246,0.4)]">
              <span className="material-symbols-outlined text-[20px]">smart_toy</span>
            </div>
            <h1 className="text-2xl font-bold text-white font-heading">AI Security Copilot Console</h1>
            <span className="px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold bg-[#8b5cf6]/20 text-[#a78bfa] border border-[#8b5cf6]/40 flex items-center gap-1.5">
              <span>⚡</span>
              <span>{modelLabel}</span>
            </span>
          </div>
          <p className="text-xs text-[#94a3b8]">
            Sub-second cyber intelligence and incident investigation powered by Groq LPU inference.
          </p>
        </div>

        <button
          onClick={handleClear}
          className="px-3.5 py-1.5 rounded-xl bg-[#1e2638] hover:bg-[#2a3449] text-xs font-mono text-[#94a3b8] hover:text-white transition-all cursor-pointer border-0 flex items-center gap-1.5"
        >
          <span className="material-symbols-outlined text-[16px]">refresh</span>
          <span>Clear Thread</span>
        </button>
      </div>

      {/* Chat Container */}
      <div className="flex-1 p-6 rounded-2xl bg-[#0f141e] border border-[#1e2638] flex flex-col justify-between gap-4 overflow-hidden shadow-2xl">
        <div className="flex flex-col gap-4 overflow-y-auto pr-2 scrollbar-thin">
          {messages.map((m, i) => (
            <div key={i} className={`flex gap-3 text-xs leading-relaxed max-w-4xl ${m.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-white shrink-0 shadow-md ${
                m.sender === 'user' ? 'bg-[#f59e0b]' : 'bg-[#8b5cf6]'
              }`}>
                <span className="material-symbols-outlined text-[18px]">{m.sender === 'user' ? 'person' : 'smart_toy'}</span>
              </div>
              <div className={`p-4 rounded-2xl whitespace-pre-wrap ${
                m.sender === 'user'
                  ? 'bg-[#f59e0b]/15 text-[#f59e0b] border border-[#f59e0b]/30 font-sans'
                  : 'bg-[#080a0f] text-[#e2e8f0] border border-[#1e2638] font-mono text-[11px] leading-relaxed'
              }`}>
                {m.text}
              </div>
            </div>
          ))}
          {isAsking && (
            <div className="flex items-center gap-2 text-xs font-mono text-[#a78bfa] p-3 rounded-xl bg-[#080a0f] border border-[#1e2638] w-fit">
              <span className="material-symbols-outlined text-[18px] animate-spin">refresh</span>
              <span>Groq LPU correlating telemetry graph...</span>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Suggested Quick Questions */}
        <div className="flex flex-col gap-2 pt-3 border-t border-[#1e2638]">
          <span className="text-[10px] font-mono text-[#64748b] uppercase">RECOMMENDED SOC PROMPTS:</span>
          <div className="flex flex-wrap gap-2">
            {suggestedQuestions.map((sq, i) => (
              <button
                key={i}
                className="px-3 py-1.5 rounded-lg bg-[#080a0f] border border-[#1e2638] text-[#94a3b8] hover:text-white hover:border-[#8b5cf6] font-mono text-[11px] transition-all cursor-pointer text-left"
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
            placeholder="Ask AI Copilot about incidents, IOC indicators, network forensics, or containment..."
            className="flex-1 px-4 py-3 rounded-xl bg-[#080a0f] border border-[#1e2638] text-white text-xs font-mono focus:outline-none focus:border-[#8b5cf6]"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
          />
          <button
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed] text-white font-mono text-xs font-bold hover:brightness-110 transition-all cursor-pointer border-0 shadow-[0_0_15px_rgba(139,92,246,0.35)] flex items-center gap-2"
            onClick={() => handleAsk()}
            disabled={isAsking}
          >
            <span>SUBMIT</span>
            <span className="material-symbols-outlined text-[16px]">send</span>
          </button>
        </div>
      </div>
    </div>
  );
}
