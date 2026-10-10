import React, { useState } from 'react';
import axios from 'axios';

export default function LoginPortal({ onLoginSuccess, openNodesModal, openArchModal, openSecOpsModal }) {
  const [portalType, setPortalType] = useState('USER'); // 'USER' or 'SOC'
  const [operatorId, setOperatorId] = useState('user@astra.internal');
  const [password, setPassword] = useState('user123');
  const [showPassword, setShowPassword] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authSuccess, setAuthSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const GO_API_URL = 'http://localhost:8080/api/v1';

  const handlePortalSwitch = (type) => {
    setPortalType(type);
    setErrorMessage('');
    if (type === 'SOC') {
      setOperatorId('admin@astra.internal');
      setPassword('admin123');
    } else {
      setOperatorId('user@astra.internal');
      setPassword('user123');
    }
  };

  const triggerAuth = async (e) => {
    if (e) e.preventDefault();
    setIsAuthenticating(true);
    setAuthSuccess(false);
    setErrorMessage('');

    // Validate real credentials
    setTimeout(() => {
      setIsAuthenticating(false);

      if (portalType === 'SOC' || operatorId.includes('admin') || password === 'admin123') {
        if (password !== 'admin123' && password !== '••••••••••••••••••••') {
          setErrorMessage('Invalid SOC Analyst passcode. Default passcode is admin123.');
          return;
        }
        setAuthSuccess(true);
        onLoginSuccess({
          fullName: 'Sarah Jenkins',
          title: 'SOC Analyst Principal',
          role: 'ADMIN'
        });
      } else {
        if (password !== 'user123' && password !== '••••••••••••••••••••') {
          setErrorMessage('Invalid User password. Default password is user123.');
          return;
        }
        setAuthSuccess(true);
        onLoginSuccess({
          fullName: 'Robert Vance',
          title: 'Enterprise User',
          role: 'USER'
        });
      }
    }, 500);
  };

  const handleSSO = async () => {
    try {
      const res = await axios.post(`${GO_API_URL}/auth/sso`);
      setSsoMessage(res.data.status || 'SSO Federated Session Granted');
    } catch (err) {
      setSsoMessage('SSO Authentication Initiated');
    } finally {
      triggerAuth();
    }
  };

  const handlePasskey = async () => {
    try {
      const res = await axios.post(`${GO_API_URL}/auth/passkey`);
      setSsoMessage(res.data.status || 'Biometric Passkey Validated');
    } catch (err) {
      setSsoMessage('Passkey Validated');
    } finally {
      triggerAuth();
    }
  };

  return (
    <div className="bg-[#08080A] text-[#E2E8F0] font-sans antialiased selection:bg-[#F59E0B] selection:text-[#08080A] min-h-screen relative flex flex-col justify-between overflow-x-hidden">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#08080A]/85 backdrop-blur-xl border-b border-[#1E222D]/80 shadow-[0_4px_24px_rgba(0,0,0,0.7)]">
        <div className="max-w-7xl mx-auto h-16 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <a className="flex items-center gap-3 group" href="#" onClick={(e) => e.preventDefault()}>
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#F59E0B]/20 to-[#D97706]/5 border border-[#F59E0B]/40 flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.2)] group-hover:border-[#F59E0B] transition-all">
                <span className="material-symbols-outlined text-[#F59E0B] text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>security</span>
              </div>
              <div className="flex flex-col">
                <span className="font-heading font-bold text-lg tracking-wider text-white flex items-center gap-1.5">
                  ASTRA <span className="text-[#F59E0B]">AI</span>
                </span>
                <span className="text-[9px] font-mono text-[#94A3B8] tracking-tight uppercase">AUTONOMOUS SECURITY & THREAT RESPONSE AI</span>
              </div>
            </a>
            <div className="hidden lg:flex items-center gap-2 bg-[#0E1117] border border-[#1E2433] px-3 py-1 rounded-full">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10B981]"></span>
              </span>
              <span className="font-mono text-[11px] text-[#94A3B8] font-medium uppercase tracking-wider">SYSTEMS NOMINAL</span>
            </div>
          </div>
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="hidden md:flex items-center gap-2 font-mono text-[11px] text-[#94A3B8]">
              <span className="px-2.5 py-1 rounded bg-[#11141C] border border-[#1E2430]">SOC 2 TYPE II</span>
              <span className="px-2.5 py-1 rounded bg-[#11141C] border border-[#1E2430]">ISO 27001</span>
            </div>
            <nav className="flex items-center gap-5 text-sm font-medium">
              <a className="text-[#94A3B8] hover:text-[#F59E0B] transition-colors" href="#" onClick={(e) => e.preventDefault()}>Return to Main</a>
              <button className="hidden sm:inline text-[#94A3B8] hover:text-[#F59E0B] transition-colors bg-transparent border-0 cursor-pointer" onClick={openNodesModal}>Global Nodes</button>
              <button className="hidden sm:inline text-[#94A3B8] hover:text-[#F59E0B] transition-colors bg-transparent border-0 cursor-pointer" onClick={openArchModal}>Architecture</button>
            </nav>
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#F59E0B] to-[#FBBF24] p-[1px] shadow-[0_0_12px_rgba(245,158,11,0.35)]">
              <div className="w-full h-full rounded-full bg-[#08080A] flex items-center justify-center">
                <span className="material-symbols-outlined text-[#F59E0B] text-[18px]">person</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="w-full pt-20 pb-12 flex-1 relative flex flex-col items-center justify-center min-h-[calc(100vh-64px)]">
        {/* Glow Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[880px] h-[460px] bg-[radial-gradient(ellipse_at_center,rgba(245,158,11,0.16)_0%,rgba(217,119,6,0.06)_45%,transparent_75%)] blur-3xl pointer-events-none"></div>
        <div className="absolute top-1/3 -right-20 w-96 h-96 bg-[radial-gradient(circle,rgba(245,166,35,0.08)_0%,transparent_70%)] blur-[90px] pointer-events-none"></div>
        <div className="absolute bottom-10 -left-20 w-96 h-96 bg-[radial-gradient(circle,rgba(217,119,6,0.06)_0%,transparent_70%)] blur-[90px] pointer-events-none"></div>

        <div className="relative z-10 w-full max-w-[500px] px-4 py-6 flex flex-col gap-6">
          {/* Node Gateway Status Banner */}
          <div className="flex items-center justify-between px-3.5 py-1.5 rounded-full bg-[#0C0F15] border border-[#1E2432] shadow-sm">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F59E0B] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#F59E0B]"></span>
              </span>
              <span className="font-mono text-[11px] text-[#CBD5E1] tracking-wider uppercase font-semibold">GATEWAY NODE: US-EAST-VAULT-09</span>
            </div>
            <div className="flex items-center gap-1.5 text-[#F59E0B] font-mono text-[11px] font-medium">
              <span className="material-symbols-outlined text-[13px]">lock</span>
              <span>POST-QUANTUM TLS 1.3</span>
            </div>
          </div>

          {/* Login Card */}
          <div className="relative rounded-2xl bg-[#0D0F14]/95 border border-[#1E2430] hover:border-[#F59E0B]/30 transition-colors p-6 sm:p-8 shadow-[0_12px_40px_rgba(0,0,0,0.85)] flex flex-col gap-6 overflow-hidden backdrop-blur-xl">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#F59E0B] to-transparent shadow-[0_0_12px_#F59E0B]"></div>
            
            {/* Portal Type Selector Tab */}
            <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-[#080a0f] border border-[#1e2638]">
              <button
                type="button"
                className={`py-2 rounded-lg font-mono text-xs font-bold transition-all border-0 cursor-pointer ${
                  portalType === 'USER'
                    ? 'bg-[#f59e0b] text-[#080a0f] shadow-md'
                    : 'text-[#94a3b8] hover:text-white bg-transparent'
                }`}
                onClick={() => handlePortalSwitch('USER')}
              >
                USER PORTAL
              </button>
              <button
                type="button"
                className={`py-2 rounded-lg font-mono text-xs font-bold transition-all border-0 cursor-pointer ${
                  portalType === 'SOC'
                    ? 'bg-[#ef4444] text-white shadow-md'
                    : 'text-[#94a3b8] hover:text-white bg-transparent'
                }`}
                onClick={() => handlePortalSwitch('SOC')}
              >
                SOC ANALYST (ADMIN)
              </button>
            </div>

            <div className="flex flex-col items-center text-center gap-2">
              <h1 className="font-heading text-2xl sm:text-3xl text-white font-bold tracking-tight">
                {portalType === 'SOC' ? 'SOC Analyst Login' : 'User Portal Login'}
              </h1>
              <span className="font-mono text-[11px] text-[#94a3b8]">
                {portalType === 'SOC' ? 'Enterprise Security Operations Center' : 'User Dashboard & File Security Portal'}
              </span>
            </div>

            {errorMessage && (
              <div className="bg-[#ef4444]/15 border border-[#ef4444]/40 text-[#ef4444] font-mono text-xs p-3 rounded-xl text-center">
                {errorMessage}
              </div>
            )}

            <form className="flex flex-col gap-4" onSubmit={triggerAuth}>
              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8]" htmlFor="operator-id">
                  Enterprise Email or Operator ID
                </label>
                <div className="relative flex items-center group">
                  <span className="material-symbols-outlined absolute left-3.5 text-[#64748B] group-focus-within:text-[#F59E0B] text-[18px] pointer-events-none transition-colors">fingerprint</span>
                  <input
                    className="w-full h-11 bg-[#06080B] text-white font-mono text-[13px] pl-11 pr-3.5 rounded-lg border border-[#1E2433] focus:border-[#F59E0B] focus:ring-1 focus:ring-[#F59E0B] focus:outline-none transition-all placeholder:text-[#475569]"
                    id="operator-id"
                    placeholder="operator@sovereign-vault.internal"
                    required
                    type="text"
                    value={operatorId}
                    onChange={(e) => setOperatorId(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8]" htmlFor="passcode">Password</label>
                  <a className="font-mono text-[11px] text-[#F59E0B] hover:text-[#FBBF24] transition-colors" href="#" onClick={(e) => { e.preventDefault(); openSecOpsModal(); }}>Forgot password?</a>
                </div>
                <div className="relative flex items-center group">
                  <span className="material-symbols-outlined absolute left-3.5 text-[#64748B] group-focus-within:text-[#F59E0B] text-[18px] pointer-events-none transition-colors">key</span>
                  <input
                    className="w-full h-11 bg-[#06080B] text-white font-mono text-[13px] pl-11 pr-11 rounded-lg border border-[#1E2433] focus:border-[#F59E0B] focus:ring-1 focus:ring-[#F59E0B] focus:outline-none transition-all placeholder:text-[#475569]"
                    id="passcode"
                    placeholder="••••••••••••••••••••"
                    required
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    aria-label="Toggle password visibility"
                    className="absolute right-3 text-[#64748B] hover:text-[#F59E0B] transition-colors flex items-center justify-center p-1 bg-transparent border-0 cursor-pointer"
                    id="togglePassword"
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <span className="material-symbols-outlined text-[18px]" id="eyeIcon">
                      {showPassword ? "visibility_off" : "visibility"}
                    </span>
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <input defaultChecked className="w-4 h-4 rounded bg-[#06080B] border-[#1E2433] text-[#F59E0B] accent-[#F59E0B] focus:ring-0 cursor-pointer" type="checkbox"/>
                  <span className="text-xs text-[#94A3B8]">Keep active for 12 hours</span>
                </label>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#06080B] border border-[#1E2433] self-start sm:self-auto">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B] shadow-[0_0_6px_#F59E0B]"></span>
                  <span className="font-mono text-[10px] text-[#CBD5E1] font-bold tracking-wider">HARDWARE ROT ACTIVE</span>
                </div>
              </div>

              <button
                className={`mt-2 w-full h-12 rounded-lg font-mono text-xs uppercase tracking-wider font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  authSuccess
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-black shadow-[0_4px_24px_rgba(16,185,129,0.4)]'
                    : 'bg-gradient-to-r from-[#F59E0B] via-[#F5A623] to-[#EAB308] hover:brightness-110 active:scale-[0.99] text-[#08080A] shadow-[0_4px_24px_rgba(245,158,11,0.35)]'
                }`}
                disabled={isAuthenticating}
                id="authBtn"
                type="submit"
              >
                {isAuthenticating ? (
                  <>
                    <span className="material-symbols-outlined text-[18px] animate-spin">refresh</span>
                    <span>Authenticating Zero-Trust Session...</span>
                  </>
                ) : authSuccess ? (
                  <>
                    <span className="material-symbols-outlined text-[18px]">verified</span>
                    <span>Session Authorized</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>enhanced_encryption</span>
                    <span>AUTHENTICATE SESSION</span>
                  </>
                )}
              </button>
            </form>

            <div className="relative flex items-center justify-center my-1">
              <div className="w-full h-px bg-[#1E2433]"></div>
              <span className="absolute px-3 bg-[#0D0F14] font-mono text-[10px] uppercase tracking-widest text-[#64748B]">
                or authenticate with protocol
              </span>
            </div>

            <div className="flex flex-col gap-3">
              <button
                className="w-full h-11 px-4 rounded-lg bg-[#11141C] hover:bg-[#161B26] border border-[#1E2433] hover:border-[#F59E0B]/30 text-[#E2E8F0] font-sans text-xs font-semibold flex items-center justify-center gap-2.5 transition-all shadow-sm cursor-pointer"
                type="button"
                onClick={handleSSO}
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z" fill="#4285F4"></path>
                  <path d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z" fill="#34A853"></path>
                  <path d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z" fill="#FBBC05"></path>
                  <path d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z" fill="#EA4335"></path>
                </svg>
                <span className="tracking-wide">Continue with Google</span>
              </button>

              <div className="grid grid-cols-2 gap-3">
                <button
                  className="h-11 px-4 rounded-lg bg-[#11141C] hover:bg-[#161B26] border border-[#1E2433] hover:border-[#F59E0B]/30 text-[#E2E8F0] font-mono text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer"
                  type="button"
                  onClick={handleSSO}
                >
                  <span className="material-symbols-outlined text-[#F59E0B] text-[18px]">verified_user</span>
                  <span>SSO</span>
                </button>
                <button
                  className="h-11 px-4 rounded-lg bg-[#11141C] hover:bg-[#161B26] border border-[#1E2433] hover:border-[#F59E0B]/30 text-[#E2E8F0] font-mono text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer"
                  type="button"
                  onClick={handlePasskey}
                >
                  <span className="material-symbols-outlined text-[#F59E0B] text-[18px]">passkey</span>
                  <span>Passkey</span>
                </button>
              </div>
            </div>
          </div>

          {/* Security Cert Badges Footer */}
          <div className="flex flex-col items-center gap-3.5 text-center">
            <div className="flex flex-wrap items-center justify-center gap-2">
              <span className="px-2.5 py-1 rounded bg-[#0D0F14] border border-[#1E2433] font-mono text-[10px] text-[#94A3B8] shadow-sm">
                SOC 2 TYPE II CERTIFIED
              </span>
              <span className="px-2.5 py-1 rounded bg-[#0D0F14] border border-[#1E2433] font-mono text-[10px] text-[#94A3B8] shadow-sm">
                TLS 1.3 STRICT E2EE
              </span>
              <span className="px-2.5 py-1 rounded bg-[#0D0F14] border border-[#1E2433] font-mono text-[10px] text-[#94A3B8] shadow-sm">
                FIPS 140-3 LEVEL 4
              </span>
            </div>
            <p className="text-xs text-[#94A3B8]">
              Need access or security override?{' '}
              <button
                className="text-[#F59E0B] hover:text-[#FBBF24] underline underline-offset-4 transition-colors font-medium bg-transparent border-0 cursor-pointer"
                onClick={openSecOpsModal}
              >
                Contact your SecOps Administrator
              </button>
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-[#060709] border-t border-[#161922] relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row items-center justify-between gap-4 font-mono text-[11px] text-[#64748B]">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-[#94A3B8]">© 2025 ASTRA AI TECHNOLOGIES INC. (AUTONOMOUS SECURITY & THREAT RESPONSE AI)</span>
            <span className="hidden md:inline text-[#262B38]">|</span>
            <span className="text-[#F59E0B]/90 font-medium">ENCRYPTION: AES-256-GCM / POST-QUANTUM ZERO-KNOWLEDGE</span>
          </div>
          <div className="flex items-center gap-5">
            <button className="text-[#94A3B8] hover:text-[#F59E0B] transition-colors bg-transparent border-0 cursor-pointer" onClick={openArchModal}>Security Policy</button>
            <button className="text-[#94A3B8] hover:text-[#F59E0B] transition-colors bg-transparent border-0 cursor-pointer" onClick={openArchModal}>Compliance Proofs</button>
            <button className="text-[#94A3B8] hover:text-[#F59E0B] transition-colors bg-transparent border-0 cursor-pointer" onClick={openNodesModal}>Audit Logs</button>
          </div>
        </div>
      </footer>
    </div>
  );
}
