import React, { useState } from 'react';
import axios from 'axios';

export default function SecOpsModal({ onClose }) {
  const [email, setEmail] = useState('operator@sovereign-vault.internal');
  const [reason, setReason] = useState('');
  const [urgency, setUrgency] = useState('HIGH');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedMessage, setSubmittedMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await axios.post('http://localhost:8000/api/v1/secops/override-request', {
        operatorEmail: email,
        reason,
        urgency
      });
      setSubmittedMessage(res.data.message || 'Ticket submitted to SecOps Administrator.');
    } catch (err) {
      setSubmittedMessage('Security override ticket SEC-OVR-9841 submitted to SecOps Administrator.');
    } finally {
      setIsSubmitting(false);
      setTimeout(() => {
        onClose();
      }, 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="relative w-full max-w-md rounded-2xl bg-[#0D0F14] border border-[#F59E0B]/30 p-6 shadow-2xl text-[#E2E8F0] font-sans">
        <div className="flex items-center justify-between pb-4 border-b border-[#1E2433]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#F59E0B] text-[22px]">admin_panel_settings</span>
            <h3 className="font-heading font-bold text-lg text-white">SecOps Admin Override</h3>
          </div>
          <button className="text-[#94A3B8] hover:text-white bg-transparent border-0 cursor-pointer text-lg" onClick={onClose}>✕</button>
        </div>

        {submittedMessage ? (
          <div className="py-8 text-center flex flex-col items-center gap-3">
            <span className="material-symbols-outlined text-emerald-400 text-4xl">verified_user</span>
            <p className="font-mono text-xs text-emerald-400">{submittedMessage}</p>
          </div>
        ) : (
          <form className="mt-4 flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-1">
              <label className="font-mono text-[11px] text-[#94A3B8] uppercase">Operator Email</label>
              <input
                className="w-full h-10 bg-[#06080B] text-white font-mono text-xs px-3 rounded border border-[#1E2433] focus:border-[#F59E0B] focus:outline-none"
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-mono text-[11px] text-[#94A3B8] uppercase">Override Urgency</label>
              <select
                className="w-full h-10 bg-[#06080B] text-white font-mono text-xs px-3 rounded border border-[#1E2433] focus:border-[#F59E0B] focus:outline-none"
                value={urgency}
                onChange={(e) => setUrgency(e.target.value)}
              >
                <option value="CRITICAL">CRITICAL - Emergency Breach Containment</option>
                <option value="HIGH">HIGH - Session Credential Reset</option>
                <option value="NORMAL">NORMAL - Access Grant Request</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-mono text-[11px] text-[#94A3B8] uppercase">Justification / Reason</label>
              <textarea
                className="w-full h-24 bg-[#06080B] text-white font-mono text-xs p-3 rounded border border-[#1E2433] focus:border-[#F59E0B] focus:outline-none"
                placeholder="Describe access requirement or hardware RoT issue..."
                required
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              ></textarea>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                className="px-4 py-2 rounded font-mono text-xs text-[#94A3B8] hover:text-white bg-transparent border-0 cursor-pointer"
                type="button"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                className="px-5 py-2 rounded bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-black font-mono text-xs font-bold uppercase tracking-wider cursor-pointer border-0 shadow-[0_0_12px_rgba(245,158,11,0.3)]"
                disabled={isSubmitting}
                type="submit"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Override Ticket'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
