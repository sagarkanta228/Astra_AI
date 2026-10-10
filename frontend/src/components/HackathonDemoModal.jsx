import React, { useState } from 'react';

export default function HackathonDemoModal({ isOpen, onClose, setActiveView, setCurrentRole, setSelectedIncidentId }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const steps = [
    { step: 1, phase: 'RECEIVE', title: 'Phishing Email Delivered', detail: 'User receives email from operator@sovereign-vault-login.internal claiming urgent password reset.', targetView: 'user-dashboard', targetRole: 'USER' },
    { step: 2, phase: 'SUBMIT', title: 'User Submits Content', detail: 'User clicks Check Email in CyberGuard Threat Portal.', targetView: 'user-analyze', targetRole: 'USER' },
    { step: 3, phase: 'DETECT', title: 'AI Engine Detection', detail: 'AI classifies content as PHISHING with 94% confidence.', targetView: 'user-analyze', targetRole: 'USER' },
    { step: 4, phase: 'SCORE', title: 'Risk Score Calculated', detail: 'Risk Score = 92/100 (CRITICAL SEVERITY).', targetView: 'user-analyze', targetRole: 'USER' },
    { step: 5, phase: 'INCIDENT', title: 'Incident Created', detail: 'Automatic Incident #INC-1024 created and assigned to SecOps Admin.', targetView: 'user-incidents', targetRole: 'USER' },
    { step: 6, phase: 'ALERT', title: 'Admin Alert Triggered', detail: 'Real-time alert pushed to Admin Live Security Monitor.', targetView: 'admin-live-monitor', targetRole: 'ADMIN' },
    { step: 7, phase: 'OPEN', title: 'Admin Opens Incident', detail: 'Admin clicks incident #INC-1024 to enter Investigation Console.', targetView: 'admin-incidents', targetRole: 'ADMIN' },
    { step: 8, phase: 'EVIDENCE', title: 'Evidence Inspected', detail: 'Domain mismatch, urgency language, credential form, and visual asset theft confirmed.', targetView: 'admin-incidents', targetRole: 'ADMIN' },
    { step: 9, phase: 'TIMELINE', title: 'Attack Chain Visualized', detail: '6-node attack chain graph rendered from Email Delivery to Credential Harvest.', targetView: 'admin-incidents', targetRole: 'ADMIN' },
    { step: 10, phase: 'RECOMMEND', title: 'AI Countermeasure Recommended', detail: 'AI Copilot recommends QUARANTINE_EMAIL and BLOCK_URL.', targetView: 'admin-incidents', targetRole: 'ADMIN' },
    { step: 11, phase: 'APPROVE', title: 'Admin Approves Action', detail: 'Admin clicks Enforce Countermeasures button.', targetView: 'admin-incidents', targetRole: 'ADMIN' },
    { step: 12, phase: 'CONTAIN', title: 'Status Updated to CONTAINED', detail: 'Firewall domain block active. Session tokens revoked.', targetView: 'admin-incidents', targetRole: 'ADMIN' },
    { step: 13, phase: 'REPORT', title: 'Executive Report Generated', detail: 'Incident #INC-1024 report archived with full evidence audit trail.', targetView: 'admin-dashboard', targetRole: 'ADMIN' }
  ];

  const handleRunFullDemo = async () => {
    setIsRunning(true);
    setSelectedIncidentId('INC-1024');

    for (let i = 0; i < steps.length; i++) {
      setCurrentStep(i + 1);
      setCurrentRole(steps[i].targetRole);
      setActiveView(steps[i].targetView);
      await new Promise(r => setTimeout(r, 1200));
    }

    setIsRunning(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-[#0f141e] border border-[#1e2638] rounded-3xl p-6 lg:p-8 flex flex-col gap-6 shadow-2xl animate-fade-in relative overflow-hidden">
        <div className="flex items-center justify-between pb-4 border-b border-[#1e2638]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#f59e0b] to-[#d97706] flex items-center justify-center text-[#080a0f]">
              <span className="material-symbols-outlined text-[24px]">play_circle</span>
            </div>
            <div className="flex flex-col">
              <h2 className="text-xl font-bold text-white font-heading">Hackathon Demo Story Controller</h2>
              <span className="text-xs font-mono text-[#f59e0b]">13-Step Automated Attack Scenario Execution</span>
            </div>
          </div>
          <button 
            className="text-[#64748b] hover:text-white bg-transparent border-0 font-mono text-sm cursor-pointer"
            onClick={onClose}
          >
            [CLOSE X]
          </button>
        </div>

        {/* Demo Preset Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            className="p-4 rounded-2xl bg-[#080a0f] border border-[#f59e0b]/40 hover:border-[#f59e0b] text-left flex flex-col gap-1 transition-all cursor-pointer group"
            onClick={handleRunFullDemo}
            disabled={isRunning}
          >
            <span className="font-mono text-xs text-[#f59e0b] font-bold group-hover:underline flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px]">mail</span>
              RUN PHISHING ATTACK DEMO
            </span>
            <span className="text-[11px] text-[#94a3b8]">Simulates 13-step phishing submission → AI analysis → SOC triage → firewall block.</span>
          </button>

          <button
            className="p-4 rounded-2xl bg-[#080a0f] border border-[#ef4444]/40 hover:border-[#ef4444] text-left flex flex-col gap-1 transition-all cursor-pointer group"
            onClick={handleRunFullDemo}
            disabled={isRunning}
          >
            <span className="font-mono text-xs text-[#ef4444] font-bold group-hover:underline flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px]">folder_zip</span>
              RUN MALWARE EXEC DEMO
            </span>
            <span className="text-[11px] text-[#94a3b8]">Simulates double extension EXE upload → static analysis → hash quarantine.</span>
          </button>
        </div>

        {/* Progress Tracker */}
        {currentStep > 0 && (
          <div className="p-4 rounded-xl bg-[#080a0f] border border-[#1e2638] flex flex-col gap-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[#f59e0b] font-bold">STEP {currentStep} OF 13: {steps[currentStep - 1].phase}</span>
              <span className="text-white">{steps[currentStep - 1].title}</span>
            </div>
            <div className="w-full bg-[#161b26] h-2 rounded-full overflow-hidden">
              <div 
                className="bg-gradient-to-r from-[#f59e0b] to-[#ef4444] h-full transition-all duration-300"
                style={{ width: `${(currentStep / 13) * 100}%` }}
              ></div>
            </div>
            <p className="text-xs text-[#94a3b8] font-mono leading-relaxed">{steps[currentStep - 1].detail}</p>
          </div>
        )}

        <div className="flex justify-end pt-2">
          <button
            className="px-6 py-2.5 rounded-xl bg-[#1e2638] text-white font-mono text-xs font-bold hover:bg-[#2a3449] transition-all cursor-pointer border-0"
            onClick={onClose}
          >
            CLOSE DEMO CONTROLLER
          </button>
        </div>
      </div>
    </div>
  );
}
