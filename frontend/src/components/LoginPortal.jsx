import React, { useState } from 'react';
import { authenticateUser } from '../utils/authService';

export default function LoginPortal({ onLoginSuccess, openSecOpsModal }) {
  const [operatorId, setOperatorId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authSuccess, setAuthSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const triggerAuth = async (e) => {
    if (e) e.preventDefault();
    if (!operatorId.trim()) {
      setErrorMessage('Please enter your Enterprise Email or Username.');
      return;
    }
    if (!password) {
      setErrorMessage('Please enter your password.');
      return;
    }

    setIsAuthenticating(true);
    setAuthSuccess(false);
    setErrorMessage('');

    try {
      const result = await authenticateUser(operatorId, password);
      setIsAuthenticating(false);

      if (result.success && result.user) {
        setAuthSuccess(true);
        setTimeout(() => {
          onLoginSuccess(result.user);
        }, 400);
      } else {
        setErrorMessage(result.error || 'Authentication failed. Please verify your credentials.');
      }
    } catch (err) {
      setIsAuthenticating(false);
      setErrorMessage('Authentication error occurred. Please try again.');
    }
  };

  const fillQuickCredentials = (email, pass) => {
    setOperatorId(email);
    setPassword(pass);
    setErrorMessage('');
  };

  return (
    <div className="bg-[#08080A] text-[#E2E8F0] font-sans antialiased selection:bg-[#F59E0B] selection:text-[#08080A] min-h-screen relative flex flex-col justify-between overflow-x-hidden">
      {/* Clean Top Header - Red-circled elements removed per request */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#08080A]/90 backdrop-blur-xl border-b border-[#1E222D]/80 shadow-[0_4px_24px_rgba(0,0,0,0.7)]">
        <div className="max-w-7xl mx-auto h-16 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 select-none">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#F59E0B]/20 to-[#D97706]/10 border border-[#F59E0B]/50 flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.25)]">
                <span className="material-symbols-outlined text-[#F59E0B] text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>security</span>
              </div>
              <div className="flex flex-col">
                <span className="font-heading font-bold text-lg tracking-wider text-white flex items-center gap-1.5">
                  ASTRA <span className="text-[#F59E0B]">SOC</span>
                </span>
                <span className="text-[9px] font-mono text-[#94A3B8] tracking-tight uppercase">ENTERPRISE THREAT DEFENSE & SECURITY PLATFORM</span>
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-2 bg-[#0E1117] border border-[#1E2433] px-3 py-1 rounded-full">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10B981]"></span>
              </span>
              <span className="font-mono text-[11px] text-[#94A3B8] font-medium uppercase tracking-wider">SYSTEMS OPERATIONAL</span>
            </div>
          </div>

          {/* Clean minimal right side (removed Return to Main, Global Nodes, Architecture, cert badges and user icon) */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-[#64748B] hidden md:inline">
              SECURE ACCESS GATEWAY
            </span>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0E1117] border border-[#1E2433] text-xs font-mono text-[#94A3B8]">
              <span className="material-symbols-outlined text-[#10B981] text-[14px]">lock</span>
              <span>TLS ENCRYPTED</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Login Area */}
      <main className="w-full pt-24 pb-12 flex-1 relative flex flex-col items-center justify-center min-h-[calc(100vh-64px)]">
        {/* Subtle Ambient Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[radial-gradient(ellipse_at_center,rgba(245,158,11,0.12)_0%,rgba(217,119,6,0.03)_50%,transparent_75%)] blur-3xl pointer-events-none"></div>

        <div className="relative z-10 w-full max-w-[480px] px-4 py-6 flex flex-col gap-6">
          {/* Single Unified Login Card */}
          <div className="relative rounded-2xl bg-[#0D0F14]/95 border border-[#1E2430] hover:border-[#F59E0B]/30 transition-colors p-6 sm:p-8 shadow-[0_12px_40px_rgba(0,0,0,0.85)] flex flex-col gap-6 overflow-hidden backdrop-blur-xl">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#F59E0B] to-transparent shadow-[0_0_12px_#F59E0B]"></div>

            {/* Header info */}
            <div className="flex flex-col items-center text-center gap-1.5">
              <div className="w-12 h-12 rounded-xl bg-[#F59E0B]/10 border border-[#F59E0B]/30 flex items-center justify-center text-[#F59E0B] mb-1 shadow-[0_0_15px_rgba(245,158,11,0.15)]">
                <span className="material-symbols-outlined text-[26px]">shield_person</span>
              </div>
              <h1 className="font-heading text-2xl sm:text-3xl text-white font-bold tracking-tight">
                Enterprise Login
              </h1>
              <p className="font-sans text-xs text-[#94A3B8] max-w-sm">
                Unified sign-in for SOC Analysts and Enterprise Personnel. Roles & permissions are applied automatically.
              </p>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="bg-[#ef4444]/15 border border-[#ef4444]/40 text-[#ef4444] text-xs p-3 rounded-xl flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">error</span>
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Single Login Form */}
            <form className="flex flex-col gap-4" onSubmit={triggerAuth}>
              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8]" htmlFor="operator-id">
                  Enterprise Email or Operator ID
                </label>
                <div className="relative flex items-center group">
                  <span className="material-symbols-outlined absolute left-3.5 text-[#64748B] group-focus-within:text-[#F59E0B] text-[18px] pointer-events-none transition-colors">
                    account_circle
                  </span>
                  <input
                    className="w-full h-11 bg-[#06080B] text-white font-sans text-xs pl-11 pr-3.5 rounded-xl border border-[#1E2433] focus:border-[#F59E0B] focus:ring-1 focus:ring-[#F59E0B] focus:outline-none transition-all placeholder:text-[#475569]"
                    id="operator-id"
                    placeholder="e.g. admin@astra.internal or user@astra.internal"
                    required
                    type="text"
                    value={operatorId}
                    onChange={(e) => setOperatorId(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8]" htmlFor="passcode">
                    Password
                  </label>
                  <button
                    type="button"
                    className="font-mono text-[11px] text-[#F59E0B] hover:underline bg-transparent border-0 cursor-pointer"
                    onClick={() => {
                      if (openSecOpsModal) openSecOpsModal();
                      else alert('Default credentials: admin@astra.internal / admin123 (SOC Admin) or user@astra.internal / user123 (User)');
                    }}
                  >
                    Need Help?
                  </button>
                </div>
                <div className="relative flex items-center group">
                  <span className="material-symbols-outlined absolute left-3.5 text-[#64748B] group-focus-within:text-[#F59E0B] text-[18px] pointer-events-none transition-colors">
                    lock
                  </span>
                  <input
                    className="w-full h-11 bg-[#06080B] text-white font-mono text-xs pl-11 pr-11 rounded-xl border border-[#1E2433] focus:border-[#F59E0B] focus:ring-1 focus:ring-[#F59E0B] focus:outline-none transition-all placeholder:text-[#475569]"
                    id="passcode"
                    placeholder="Enter your password"
                    required
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    aria-label="Toggle password visibility"
                    className="absolute right-3 text-[#64748B] hover:text-[#F59E0B] transition-colors flex items-center justify-center p-1 bg-transparent border-0 cursor-pointer"
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {showPassword ? "visibility_off" : "visibility"}
                    </span>
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <input defaultChecked className="w-4 h-4 rounded bg-[#06080B] border-[#1E2433] text-[#F59E0B] accent-[#F59E0B] focus:ring-0 cursor-pointer" type="checkbox"/>
                  <span className="text-xs text-[#94A3B8]">Remember active session</span>
                </label>
                <span className="text-[11px] font-mono text-[#64748B]">Enterprise SSO Ready</span>
              </div>

              {/* Submit Button */}
              <button
                className={`mt-2 w-full h-11 rounded-xl font-mono text-xs uppercase tracking-wider font-bold flex items-center justify-center gap-2 transition-all cursor-pointer border-0 ${
                  authSuccess
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-black shadow-[0_4px_24px_rgba(16,185,129,0.4)]'
                    : 'bg-gradient-to-r from-[#F59E0B] via-[#F5A623] to-[#EAB308] hover:brightness-110 active:scale-[0.99] text-[#08080A] shadow-[0_4px_24px_rgba(245,158,11,0.35)]'
                }`}
                disabled={isAuthenticating}
                type="submit"
              >
                {isAuthenticating ? (
                  <>
                    <span className="material-symbols-outlined text-[18px] animate-spin">refresh</span>
                    <span>Verifying Credentials...</span>
                  </>
                ) : authSuccess ? (
                  <>
                    <span className="material-symbols-outlined text-[18px]">verified</span>
                    <span>Access Authorized</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>login</span>
                    <span>SIGN IN TO ENTERPRISE PORTAL</span>
                  </>
                )}
              </button>
            </form>

            {/* Quick Credentials / Demo Access Helper */}
            <div className="p-3.5 rounded-xl bg-[#080a0f] border border-[#1e2638] flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-[#64748B] uppercase tracking-wider font-semibold">
                  Quick Access Profiles
                </span>
                <span className="text-[10px] text-[#94A3B8]">Click to Auto-Fill</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  className="p-2 rounded-lg bg-[#11141c] hover:bg-[#181d28] border border-[#ef4444]/30 hover:border-[#ef4444] text-left transition-all cursor-pointer flex flex-col gap-0.5"
                  onClick={() => fillQuickCredentials('admin@astra.internal', 'admin123')}
                >
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ef4444]"></span>
                    <span className="text-[11px] font-bold text-white">SOC Analyst</span>
                  </div>
                  <span className="text-[10px] font-mono text-[#94A3B8] truncate">admin@astra.internal</span>
                </button>

                <button
                  type="button"
                  className="p-2 rounded-lg bg-[#11141c] hover:bg-[#181d28] border border-[#f59e0b]/40 hover:border-[#f59e0b] text-left transition-all cursor-pointer flex flex-col gap-0.5"
                  onClick={() => fillQuickCredentials('tanmayapany09@gmail.com', 'Tanmaya123')}
                >
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#f59e0b]"></span>
                    <span className="text-[11px] font-bold text-white">Admin (Tanmaya)</span>
                  </div>
                  <span className="text-[10px] font-mono text-[#94A3B8] truncate">tanmayapany09...</span>
                </button>

                <button
                  type="button"
                  className="p-2 rounded-lg bg-[#11141c] hover:bg-[#181d28] border border-[#3b82f6]/30 hover:border-[#3b82f6] text-left transition-all cursor-pointer flex flex-col gap-0.5"
                  onClick={() => fillQuickCredentials('user@astra.internal', 'user123')}
                >
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#3b82f6]"></span>
                    <span className="text-[11px] font-bold text-white">Standard User</span>
                  </div>
                  <span className="text-[10px] font-mono text-[#94A3B8] truncate">user@astra.internal</span>
                </button>
              </div>

              <span className="text-[10px] text-[#64748B] text-center">
                * Newly created employee accounts provisioned by the Admin also log in here.
              </span>
            </div>
          </div>
        </div>
      </main>

      {/* Clean Minimal Enterprise Footer */}
      <footer className="w-full bg-[#060709] border-t border-[#161922] py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 font-mono text-[11px] text-[#64748B]">
          <span>© 2026 ASTRA Enterprise SOC & Threat Defense System. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <span>Enterprise IAM</span>
            <span>Role-Based Access Control (RBAC)</span>
            <span>Zero-Trust Verification</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
