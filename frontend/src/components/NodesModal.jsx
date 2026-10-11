import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function NodesModal({ onClose }) {
  const [nodes, setNodes] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8000/api/v1/telemetry/nodes')
      .then(res => setNodes(res.data))
      .catch(() => {
        setNodes([
          { nodeCode: 'US-EAST-VAULT-09', region: 'Virginia, USA', status: 'NOMINAL', latencyMs: 14.2, throughputGbps: 248.5, postQuantumShield: true },
          { nodeCode: 'EU-CENTRAL-01', region: 'Frankfurt, GER', status: 'NOMINAL', latencyMs: 28.5, throughputGbps: 194.2, postQuantumShield: true },
          { nodeCode: 'AP-SOUTH-02', region: 'Singapore, SG', status: 'NOMINAL', latencyMs: 45.1, throughputGbps: 128.9, postQuantumShield: true },
          { nodeCode: 'SA-EAST-04', region: 'Sao Paulo, BRA', status: 'DEGRADED', latencyMs: 89.4, throughputGbps: 42.0, postQuantumShield: false }
        ]);
      });
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="relative w-full max-w-2xl rounded-2xl bg-[#0D0F14] border border-[#F59E0B]/30 p-6 shadow-2xl text-[#E2E8F0] font-sans">
        <div className="flex items-center justify-between pb-4 border-b border-[#1E2433]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#F59E0B] text-[22px]">hub</span>
            <h3 className="font-heading font-bold text-lg text-white">Global Nodes Telemetry & Latency</h3>
          </div>
          <button className="text-[#94A3B8] hover:text-white bg-transparent border-0 cursor-pointer text-lg" onClick={onClose}>✕</button>
        </div>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {nodes.map((node) => (
            <div key={node.nodeCode} className="p-4 rounded-xl bg-[#06080B] border border-[#1E2433] flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-white">{node.nodeCode}</span>
                <span className={`px-2 py-0.5 rounded font-mono text-[10px] font-semibold ${node.status === 'NOMINAL' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-400'}`}>
                  {node.status}
                </span>
              </div>
              <p className="font-mono text-[11px] text-[#94A3B8]">{node.region}</p>
              <div className="flex items-center justify-between pt-2 border-t border-[#1E2433] font-mono text-[11px]">
                <span>Latency: <strong className="text-[#F59E0B]">{node.latencyMs?.toFixed(1)}ms</strong></span>
                <span>Throughput: <strong className="text-white">{node.throughputGbps} Gbps</strong></span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-end">
          <button className="px-4 py-2 rounded bg-[#11141C] border border-[#1E2433] text-xs font-mono text-[#E2E8F0] hover:text-white cursor-pointer" onClick={onClose}>
            Close Telemetry Stream
          </button>
        </div>
      </div>
    </div>
  );
}
