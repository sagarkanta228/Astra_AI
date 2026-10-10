import React from 'react';

export default function ArchitectureModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="relative w-full max-w-2xl rounded-2xl bg-[#0D0F14] border border-[#F59E0B]/30 p-6 shadow-2xl text-[#E2E8F0] font-sans max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-[#1E2433]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#F59E0B] text-[22px]">verified</span>
            <h3 className="font-heading font-bold text-lg text-white">CYBERGUARD AI Architecture Whitepaper</h3>
          </div>
          <button className="text-[#94A3B8] hover:text-white bg-transparent border-0 cursor-pointer text-lg" onClick={onClose}>✕</button>
        </div>

        <div className="mt-4 flex flex-col gap-4 font-mono text-xs text-[#CBD5E1]">
          <div className="p-3 rounded bg-[#06080B] border border-[#1E2433]">
            <h4 className="text-[#F59E0B] font-bold text-sm mb-1">1. Post-Quantum TLS 1.3 Handshake</h4>
            <p className="text-[#94A3B8]">
              Utilizes hybrid Kyber-1024 and Dilithium3 lattice-based cryptography, protecting data egress against harvest-now-decrypt-later quantum attacks.
            </p>
          </div>

          <div className="p-3 rounded bg-[#06080B] border border-[#1E2433]">
            <h4 className="text-[#F59E0B] font-bold text-sm mb-1">2. Hardware Root of Trust (RoT)</h4>
            <p className="text-[#94A3B8]">
              FIPS 140-3 Level 4 certified Hardware Security Modules (HSM) manage ephemeral session key rotation every 12 hours with automated hardware attenuation.
            </p>
          </div>

          <div className="p-3 rounded bg-[#06080B] border border-[#1E2433]">
            <h4 className="text-[#F59E0B] font-bold text-sm mb-1">3. Autonomous DLP Containment (v4.8)</h4>
            <p className="text-[#94A3B8]">
              Real-time exfiltration vector heuristics engine (Python FastAPI service) continuously calculates risk scores and triggers perimeter isolation across all 48 multi-tenant clusters.
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button className="px-4 py-2 rounded bg-[#11141C] border border-[#1E2433] text-xs font-mono text-[#E2E8F0] hover:text-white cursor-pointer" onClick={onClose}>
            Close Whitepaper
          </button>
        </div>
      </div>
    </div>
  );
}
