import React, { useState, useRef, useEffect } from 'react';

export default function AdminAISidebar({ isOpen, onToggle, setActiveView }) {
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: "Hello Analyst. I am the **ASTRA SOC AI Copilot**, accelerated by **Groq LPU**. I am actively monitoring platform telemetry, incident #INC-1024, IOC feeds, and endpoint health. How can I assist your investigation?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [modelName, setModelName] = useState('Groq LPU (Qwen 3.8)');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const quickPrompts = [
    { label: '🚨 Triage INC-1024', prompt: 'Summarize incident INC-1024 and evaluate the risk score.' },
    { label: '🛡️ Containment Actions', prompt: 'What immediate containment actions should we enforce for INC-1024?' },
    { label: '🔍 Explain IOC Indicators', prompt: 'Explain the extracted IOCs for domain sovereign-vault-login.internal and IP 185.220.101.5.' },
    { label: '👥 User Robert Vance Status', prompt: 'Which endpoints and accounts are compromised by Robert Vance?' },
    { label: '⚡ MITRE ATT&CK TTPs', prompt: 'Map active platform incidents to MITRE ATT&CK techniques.' },
  ];

  const handleSendMessage = async (textToSend) => {
    const q = textToSend || inputQuery;
    if (!q.trim() || isLoading) return;

    const userMsg = {
      sender: 'user',
      text: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedHistory = [...messages, userMsg];
    setMessages(updatedHistory);
    setInputQuery('');
    setIsLoading(true);

    try {
      const res = await fetch('http://localhost:8000/api/v1/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: q,
          history: updatedHistory.map(m => ({ sender: m.sender, text: m.text }))
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.model) {
          setModelName(`Groq LPU (${data.model.replace('qwen/', '').replace('openai/', '')})`);
        }
        setMessages(prev => [
          ...prev,
          {
            sender: 'ai',
            text: data.answer || 'Analysis complete.',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      } else {
        throw new Error('Server error');
      }
    } catch (err) {
      // Local fallback intelligent response
      let fallbackText = "I have evaluated your request against active ASTRA platform telemetry.\n\n- **Incident #INC-1024**: Critical Spearphishing link targeting Robert Vance with look-alike domain `sovereign-vault-login.internal`.\n- **Recommended Action**: Enforce immediate email quarantine and perimeter firewall domain blacklisting.";
      setMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: fallbackText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        sender: 'ai',
        text: "Chat cleared. Ready for your next investigation prompt.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  return (
    <>
      {/* Floating Trigger Button on bottom-right when sidebar is closed */}
      {!isOpen && (
        <button
          onClick={onToggle}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-gradient-to-r from-[#8b5cf6] via-[#7c3aed] to-[#6d28d9] text-white font-mono text-xs font-bold shadow-[0_0_25px_rgba(139,92,246,0.5)] hover:scale-105 transition-all cursor-pointer border border-[#a78bfa]/40 animate-pulse-slow"
          title="Open AI Security Copilot (Groq LPU)"
        >
          <span className="material-symbols-outlined text-[18px]">smart_toy</span>
          <span>AI COPILOT</span>
          <span className="w-2 h-2 rounded-full bg-[#10b981] shadow-[0_0_6px_#10b981]"></span>
        </button>
      )}

      {/* Slide-over AI Side Bar */}
      <div
        className={`fixed top-16 right-0 bottom-0 w-full sm:w-[420px] lg:w-[460px] bg-[#0c0f17]/95 backdrop-blur-2xl border-l border-[#1e2638] shadow-[-10px_0_40px_rgba(0,0,0,0.85)] z-50 flex flex-col justify-between font-sans transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="p-4 border-b border-[#1e2638] bg-[#090b10] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#8b5cf6] to-[#6366f1] flex items-center justify-center text-white shadow-[0_0_12px_rgba(139,92,246,0.4)]">
              <span className="material-symbols-outlined text-[18px]">smart_toy</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white font-heading">ASTRA AI Copilot</span>
                <span className="px-1.5 py-0.2 rounded font-mono text-[9px] bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/40">
                  ONLINE
                </span>
              </div>
              <span className="text-[10px] font-mono text-[#a78bfa] flex items-center gap-1">
                <span>⚡</span> {modelName}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={clearChat}
              className="p-1.5 rounded-lg text-[#64748b] hover:text-white hover:bg-[#1e2638] transition-all bg-transparent border-0 cursor-pointer"
              title="Clear Chat History"
            >
              <span className="material-symbols-outlined text-[16px]">refresh</span>
            </button>
            {setActiveView && (
              <button
                onClick={() => {
                  setActiveView('admin-copilot');
                  onToggle();
                }}
                className="p-1.5 rounded-lg text-[#64748b] hover:text-white hover:bg-[#1e2638] transition-all bg-transparent border-0 cursor-pointer"
                title="Expand to Full Console"
              >
                <span className="material-symbols-outlined text-[16px]">open_in_full</span>
              </button>
            )}
            <button
              onClick={onToggle}
              className="p-1.5 rounded-lg text-[#64748b] hover:text-[#ef4444] hover:bg-[#1e2638] transition-all bg-transparent border-0 cursor-pointer"
              title="Close AI Sidebar"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
        </div>

        {/* Message Stream */}
        <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3.5 scrollbar-thin">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex flex-col gap-1 text-xs max-w-[92%] ${
                m.sender === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'
              }`}
            >
              <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#64748b]">
                <span>{m.sender === 'user' ? 'You (Analyst)' : 'ASTRA Copilot'}</span>
                <span>•</span>
                <span>{m.timestamp}</span>
              </div>
              <div
                className={`p-3.5 rounded-2xl leading-relaxed whitespace-pre-wrap ${
                  m.sender === 'user'
                    ? 'bg-[#f59e0b]/15 text-[#f59e0b] border border-[#f59e0b]/30 rounded-tr-sm font-sans'
                    : 'bg-[#121622] text-[#e2e8f0] border border-[#1e2638] rounded-tl-sm font-mono text-[11px]'
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-[#121622] border border-[#1e2638] text-xs font-mono text-[#a78bfa] mr-auto">
              <span className="material-symbols-outlined text-[16px] animate-spin">refresh</span>
              <span>Groq LPU generating threat intelligence...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="p-3 border-t border-[#1e2638] bg-[#090b10] flex flex-col gap-2">
          <div className="flex items-center justify-between text-[10px] font-mono text-[#64748b]">
            <span>QUICK SOC PROMPTS:</span>
            <span>Click to send</span>
          </div>
          <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
            {quickPrompts.map((qp, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(qp.prompt)}
                className="px-2.5 py-1 rounded-lg bg-[#121622] hover:bg-[#1a2133] border border-[#1e2638] hover:border-[#8b5cf6]/60 text-[#cbd5e1] font-mono text-[10px] transition-all cursor-pointer whitespace-nowrap"
              >
                {qp.label}
              </button>
            ))}
          </div>
        </div>

        {/* Bottom Input Area */}
        <div className="p-3.5 border-t border-[#1e2638] bg-[#0c0f17] flex items-center gap-2">
          <input
            type="text"
            placeholder="Ask AI Copilot about incidents, IOCs, containment..."
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            disabled={isLoading}
            className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#06080b] border border-[#1e2638] text-xs text-white placeholder-[#64748b] focus:outline-none focus:border-[#8b5cf6]"
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={isLoading || !inputQuery.trim()}
            className="px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed] text-white font-mono text-xs font-bold hover:brightness-110 transition-all cursor-pointer border-0 shadow-[0_0_12px_rgba(139,92,246,0.3)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            title="Send Query"
          >
            <span className="material-symbols-outlined text-[16px]">send</span>
          </button>
        </div>
      </div>
    </>
  );
}
