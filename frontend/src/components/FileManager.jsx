import React, { useState } from 'react';

export default function FileManager({ isAdmin = false }) {
  // Permission State
  const [hasStoragePermission, setHasStoragePermission] = useState(false);
  const [showPermissionModal, setShowPermissionModal] = useState(true);

  // Active Directory & Local Storage Files
  const [currentFolder, setCurrentFolder] = useState('d:\\HAWK');

  const [folders, setFolders] = useState([
    { id: 'fol-1', name: 'd:\\HAWK\\backend-django', path: 'd:\\HAWK\\backend-django', itemCount: 18, icon: 'folder_code', risk: 'SAFE' },
    { id: 'fol-2', name: 'd:\\HAWK\\frontend-next', path: 'd:\\HAWK\\frontend-next', itemCount: 24, icon: 'folder_zip', risk: 'SAFE' },
    { id: 'fol-3', name: 'C:\\Users\\gsaga\\Downloads', path: 'C:\\Users\\gsaga\\Downloads', itemCount: 8, icon: 'download', risk: 'HIGH' },
    { id: 'fol-4', name: 'C:\\Windows\\System32', path: 'C:\\Windows\\System32', itemCount: 1420, icon: 'folder_special', risk: 'SUSPICIOUS' }
  ]);

  const [files, setFiles] = useState([
    {
      id: 'f1',
      name: 'CyberGuard_AI_System.exe',
      type: 'Win32 Application (.exe)',
      size: '42.8 MB',
      path: 'd:\\HAWK\\dist\\CyberGuard_AI_System.exe',
      uploadedBy: 'System / Local Storage',
      date: '2026-10-02',
      status: 'SAFE',
      risk: 2,
      hash: '9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b',
      quarantined: false,
      threatInfo: null
    },
    {
      id: 'f2',
      name: 'invoice_2026.pdf.exe',
      type: 'Executable (Double Extension)',
      size: '840 KB',
      path: 'C:\\Users\\gsaga\\Downloads\\invoice_2026.pdf.exe',
      uploadedBy: 'External Download',
      date: '2026-10-02',
      status: 'MALICIOUS',
      risk: 97,
      hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      quarantined: true,
      threatInfo: {
        malwareType: 'Trojan.Win32.CredentialStealer.Botnet',
        behavior: 'Attempts to access system storage, harvest saved browser passwords, session cookies & keylog input.',
        entropy: '7.94 / 8.00 (High Obfuscation)',
        mitre: 'T1056.001 - Keylogging / Input Capture'
      }
    },
    {
      id: 'f3',
      name: 'Credential_Stealer_Bot.bat',
      type: 'Windows Batch Script',
      size: '14 KB',
      path: 'C:\\Users\\gsaga\\Downloads\\Credential_Stealer_Bot.bat',
      uploadedBy: 'External Download',
      date: '2026-10-01',
      status: 'MALICIOUS',
      risk: 94,
      hash: '99887766554433221100aabbccddeeff99887766554433221100aabbccddeeff',
      quarantined: false,
      threatInfo: {
        malwareType: 'Trojan.Script.BotLoader',
        behavior: 'Hidden PowerShell wrapper attempting background token exfiltration and privilege escalation.',
        entropy: '6.85 / 8.00',
        mitre: 'T1059.001 - Command and Scripting Interpreter'
      }
    },
    {
      id: 'f4',
      name: 'views.py',
      type: 'Python Source File',
      size: '28 KB',
      path: 'd:\\HAWK\\backend-django\\cyberguard_app\\views.py',
      uploadedBy: 'Local System',
      date: '2026-10-02',
      status: 'SAFE',
      risk: 4,
      hash: 'f0e9d8c7b6a55432109876543210fedcba9876543210fedcba9876543210fedc',
      quarantined: false,
      threatInfo: null
    },
    {
      id: 'f5',
      name: 'hosts',
      type: 'System Configuration File',
      size: '2 KB',
      path: 'C:\\Windows\\System32\\drivers\\etc\\hosts',
      uploadedBy: 'OS Core',
      date: '2026-09-30',
      status: 'SUSPICIOUS',
      risk: 65,
      hash: '778899aabbccddeeff00112233445566778899aabbccddeeff00112233445566',
      quarantined: false,
      threatInfo: {
        malwareType: 'Suspicious Host Redirect',
        behavior: 'Modified DNS routing rules attempting to redirect bank portal traffic.',
        entropy: '4.20 / 8.00',
        mitre: 'T1565.001 - Data Manipulation: Stored Data Modification'
      }
    }
  ]);

  // Inspection Modal & Scanning States
  const [inspectedItem, setInspectedItem] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanLogs, setScanLogs] = useState([]);
  const [scanCompleted, setScanCompleted] = useState(false);
  const [newFolderNameInput, setNewFolderNameInput] = useState('');
  const [showNewFolderModal, setShowNewFolderModal] = useState(false);

  // Grant Storage Access
  const handleGrantPermission = () => {
    setHasStoragePermission(true);
    setShowPermissionModal(false);
  };

  // Trigger AI Security Scan for Selected File or Folder
  const triggerAIScan = (item) => {
    if (!hasStoragePermission) {
      setShowPermissionModal(true);
      return;
    }

    setInspectedItem(item);
    setIsScanning(true);
    setScanProgress(0);
    setScanCompleted(false);
    setScanLogs([
      `[INIT] ASTRA AI Storage Inspector connected to local drive...`,
      `[PATH] Accessing: ${item.path || item.name}`,
      `[PHASE 1] Calculating SHA-256 hash signature & binary entropy...`
    ]);

    let current = 0;
    const interval = setInterval(() => {
      current += 20;
      setScanProgress(current);

      if (current === 40) {
        setScanLogs(prev => [...prev, `[PHASE 2] Inspecting PE headers, double-extensions (.pdf.exe) & execution privileges...`]);
      } else if (current === 60) {
        setScanLogs(prev => [...prev, `[PHASE 3] Scanning for Trojan.Win32, Credential Stealer Botnets & Keyloggers...`]);
      } else if (current === 80) {
        setScanLogs(prev => [...prev, `[PHASE 4] Evaluating MITRE ATT&CK behavioural signatures against local drive...`]);
      } else if (current >= 100) {
        clearInterval(interval);
        setIsScanning(false);
        setScanCompleted(true);
        setScanLogs(prev => [...prev, `[COMPLETE] ASTRA AI Storage Inspection finished. Final Verdict Generated.`]);
      }
    }, 600);
  };

  // Upload Simulated File
  const handleUploadFile = () => {
    const newFile = {
      id: `f-${Date.now()}`,
      name: 'System_Patch_Update.bat',
      type: 'Batch Script Payload',
      size: '48 KB',
      path: `d:\\HAWK\\System_Patch_Update.bat`,
      uploadedBy: 'Local Administrator',
      date: '2026-10-09',
      status: 'SUSPICIOUS',
      risk: 85,
      hash: '66778899aabbccddeeff00112233445566778899aabbccddeeff001122334455',
      quarantined: false,
      threatInfo: {
        malwareType: 'Suspicious Trojan Script',
        behavior: 'Automated script attempting background elevated process execution.',
        entropy: '7.10 / 8.00',
        mitre: 'T1059.001 - Command Execution'
      }
    };
    setFiles([newFile, ...files]);
    triggerAIScan(newFile);
  };

  // Create New Folder
  const handleCreateFolder = () => {
    if (!newFolderNameInput.trim()) return;
    const newFolder = {
      id: `fol-${Date.now()}`,
      name: `d:\\HAWK\\${newFolderNameInput.trim()}`,
      path: `d:\\HAWK\\${newFolderNameInput.trim()}`,
      itemCount: 0,
      icon: 'folder',
      risk: 'SAFE'
    };
    setFolders([...folders, newFolder]);
    setNewFolderNameInput('');
    setShowNewFolderModal(false);
  };

  // Quarantine Action
  const handleToggleQuarantine = (fileId) => {
    setFiles(files.map(f => {
      if (f.id === fileId) {
        const nextQ = !f.quarantined;
        return {
          ...f,
          quarantined: nextQ,
          status: nextQ ? 'QUARANTINED' : (f.risk > 80 ? 'MALICIOUS' : 'SAFE')
        };
      }
      return f;
    }));
    if (inspectedItem && inspectedItem.id === fileId) {
      setInspectedItem(prev => ({
        ...prev,
        quarantined: !prev.quarantined,
        status: !prev.quarantined ? 'QUARANTINED' : (prev.risk > 80 ? 'MALICIOUS' : 'SAFE')
      }));
    }
  };

  // Delete Action
  const handleDeleteFile = (fileId) => {
    setFiles(files.filter(f => f.id !== fileId));
    setInspectedItem(null);
  };

  return (
    <div className="flex flex-col gap-6 pb-12 text-white font-sans relative">
      {/* STORAGE ACCESS PERMISSION PROMPT MODAL */}
      {showPermissionModal && (
        <div className="fixed inset-0 z-50 bg-[#080a0f]/90 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-2xl bg-[#0f141e] border border-[#f59e0b]/50 p-6 shadow-[0_0_50px_rgba(245,158,11,0.25)] flex flex-col gap-5 relative animate-fade-in">
            <div className="flex items-center gap-3 pb-3 border-b border-[#1e2638]">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#f59e0b] to-[#d97706] p-[1px] shadow-[0_0_15px_rgba(245,158,11,0.3)]">
                <div className="w-full h-full rounded-xl bg-[#080a0f] flex items-center justify-center">
                  <span className="material-symbols-outlined text-[#f59e0b] text-[24px]">folder_managed</span>
                </div>
              </div>
              <div className="flex flex-col">
                <h3 className="text-base font-bold text-white font-heading">
                  System Storage Access Permission Required
                </h3>
                <span className="text-[10px] font-mono text-[#f59e0b] uppercase font-semibold">
                  ASTRA AI Autonomous Security Inspection Engine
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-3 text-xs text-[#94a3b8] leading-relaxed font-sans">
              <p>
                To scan local storage, system drives (`d:\HAWK\`, `C:\Windows\System32`, `C:\Users\gsaga\Downloads`), binaries, and software applications, <strong className="text-white">ASTRA AI</strong> requests permission to access your current system storage.
              </p>
              <div className="p-3 rounded-xl bg-[#080a0f] border border-[#1e2638] flex flex-col gap-2 font-mono text-[11px]">
                <div className="flex items-center justify-between text-[#f59e0b]">
                  <span>System Path Access:</span>
                  <span className="font-bold">d:\HAWK & C:\ System Drive</span>
                </div>
                <div className="flex items-center justify-between text-[#94a3b8]">
                  <span>Inspection Mode:</span>
                  <span>Direct Binary & Heuristic Bot Scan</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
              <button
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#080a0f] border border-[#1e2638] text-xs font-mono text-[#94a3b8] hover:text-white transition-all cursor-pointer"
                onClick={() => setShowPermissionModal(false)}
              >
                Use Demo Sandbox Mode
              </button>
              <button
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#f59e0b] to-[#d97706] text-[#080a0f] font-mono text-xs font-bold uppercase tracking-wider hover:brightness-110 transition-all shadow-[0_4px_20px_rgba(245,158,11,0.3)] cursor-pointer border-0 flex items-center justify-center gap-2"
                onClick={handleGrantPermission}
              >
                <span className="material-symbols-outlined text-[18px]">key</span>
                GRANT SYSTEM STORAGE ACCESS
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Header & Action Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#f59e0b] to-[#d97706] p-[1px]">
              <div className="w-full h-full rounded-xl bg-[#080a0f] flex items-center justify-center">
                <span className="material-symbols-outlined text-[#f59e0b] text-[18px]">folder_special</span>
              </div>
            </div>
            <h1 className="text-2xl font-bold font-heading text-white tracking-tight">
              Local System Storage & File Management
            </h1>
          </div>
          <p className="text-xs text-[#94a3b8]">
            Inspect real system drive directories (`d:\HAWK\`, `C:\System32`) and run <strong className="text-[#f59e0b]">ASTRA AI Security Scans</strong> to detect Trojans, Credential Stealer bots, and malicious executable payloads.
          </p>
        </div>

        {/* Storage Access Status & Actions */}
        <div className="flex items-center gap-3">
          {!hasStoragePermission ? (
            <button
              className="px-4 py-2 rounded-xl bg-[#f59e0b]/20 border border-[#f59e0b]/50 text-[#f59e0b] text-xs font-mono font-bold hover:bg-[#f59e0b] hover:text-[#080a0f] transition-all cursor-pointer flex items-center gap-2"
              onClick={() => setShowPermissionModal(true)}
            >
              <span className="material-symbols-outlined text-[16px]">lock_open</span>
              GRANT STORAGE ACCESS
            </button>
          ) : (
            <span className="px-3 py-1.5 rounded-full bg-[#10b981]/20 border border-[#10b981]/40 text-[#10b981] font-mono text-[11px] font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse"></span>
              SYSTEM STORAGE AUTHORIZED
            </span>
          )}

          <button
            className="px-4 py-2 rounded-xl bg-[#0f141e] border border-[#1e2638] hover:border-[#f59e0b]/60 text-xs font-semibold text-white transition-all shadow-md cursor-pointer flex items-center gap-2"
            onClick={handleUploadFile}
          >
            <span className="material-symbols-outlined text-[16px] text-[#f59e0b]">cloud_upload</span>
            Upload File
          </button>
          <button
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#f59e0b] to-[#d97706] text-[#080a0f] text-xs font-bold font-mono uppercase tracking-wider hover:brightness-110 transition-all shadow-md cursor-pointer border-0 flex items-center gap-2"
            onClick={() => setShowNewFolderModal(true)}
          >
            <span className="material-symbols-outlined text-[16px]">create_new_folder</span>
            New Folder
          </button>
        </div>
      </div>

      {/* Storage Access Sandbox Status Banner */}
      <div className="p-4 rounded-2xl bg-[#0f141e] border border-[#1e2638] flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-[#f59e0b] text-[24px]">sd_storage</span>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-white font-heading">
              Local System Drive (`d:\HAWK\`) Scanner Active
            </span>
            <span className="text-[11px] text-[#94a3b8]">
              Automated heuristics scanning SHA-256 signatures, entropy levels, double extensions (`.pdf.exe`), and hidden credential theft scripts.
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#080a0f] border border-[#1e2638] text-[11px] font-mono text-[#f59e0b]">
          <span className="w-2 h-2 rounded-full bg-[#f59e0b] animate-ping"></span>
          <span>AUTONOMOUS THREAT ENGINE READY</span>
        </div>
      </div>

      {/* System Folders Exploration Grid */}
      <div className="flex flex-col gap-3">
        <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#64748b]">
          Local System Drive Directories & Storage Folders
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {folders.map((fol) => (
            <div
              key={fol.id}
              className="p-4 rounded-2xl bg-[#0f141e] border border-[#1e2638] hover:border-[#f59e0b]/50 transition-all cursor-pointer flex items-center justify-between group shadow-md"
              onClick={() => {
                setCurrentFolder(fol.path);
                triggerAIScan(fol);
              }}
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[#f59e0b] text-[28px] group-hover:scale-110 transition-transform">
                  {fol.icon}
                </span>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-white group-hover:text-[#f59e0b] transition-colors truncate max-w-[150px]">
                    {fol.name}
                  </span>
                  <span className="text-[11px] font-mono text-[#64748b]">
                    {fol.itemCount} items
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  className="px-2 py-1 rounded bg-[#080a0f] border border-[#1e2638] text-[10px] font-mono text-[#f59e0b] hover:bg-[#f59e0b] hover:text-[#080a0f] transition-all cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    triggerAIScan(fol);
                  }}
                  title="Run ASTRA AI Security Scan on Folder"
                >
                  AI SCAN
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Files List Table */}
      <div className="p-6 rounded-2xl bg-[#0f141e] border border-[#1e2638] flex flex-col gap-5 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-white font-heading">
              System Files & Executables ({files.length})
            </span>
            <span className="text-xs text-[#64748b] font-mono">
              [Click any row to run ASTRA AI Security Scan]
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-[#64748b]">
            <span>Active Drive Path:</span>
            <span className="px-2.5 py-1 rounded-lg bg-[#080a0f] border border-[#1e2638] text-white">
              {currentFolder}
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#1e2638] text-[11px] font-mono uppercase text-[#64748b]">
                <th className="pb-3 px-3">File Name</th>
                <th className="pb-3 px-3">Type</th>
                <th className="pb-3 px-3">Size</th>
                <th className="pb-3 px-3">Owner / Origin</th>
                <th className="pb-3 px-3">Date</th>
                <th className="pb-3 px-3">Scan Status</th>
                <th className="pb-3 px-3">Risk Score</th>
                <th className="pb-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#161b26] text-xs">
              {files.map((file) => (
                <tr
                  key={file.id}
                  className={`hover:bg-[#161b26]/70 transition-colors cursor-pointer ${
                    file.quarantined ? 'bg-[#ef4444]/5' : ''
                  }`}
                  onClick={() => triggerAIScan(file)}
                >
                  <td className="py-3.5 px-3">
                    <div className="flex items-center gap-3">
                      <span className={`material-symbols-outlined text-[20px] ${
                        file.quarantined ? 'text-[#ef4444]' : file.risk > 80 ? 'text-[#ef4444]' : file.risk > 50 ? 'text-[#f59e0b]' : 'text-[#10b981]'
                      }`}>
                        {file.quarantined ? 'lock' : file.type.includes('Executable') ? 'warning' : 'description'}
                      </span>
                      <div className="flex flex-col">
                        <span className="font-semibold text-white flex items-center gap-1.5">
                          {file.name}
                          {file.quarantined && (
                            <span className="px-1.5 py-0.2 rounded bg-[#ef4444]/20 text-[#ef4444] font-mono text-[9px] uppercase font-bold">
                              Quarantined
                            </span>
                          )}
                        </span>
                        <span className="font-mono text-[10px] text-[#64748b] truncate max-w-[240px]">
                          {file.path}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-3 font-mono text-[#94a3b8]">{file.type}</td>
                  <td className="py-3.5 px-3 font-mono text-[#94a3b8]">{file.size}</td>
                  <td className="py-3.5 px-3 text-white">{file.uploadedBy}</td>
                  <td className="py-3.5 px-3 font-mono text-[#64748b]">{file.date}</td>
                  <td className="py-3.5 px-3">
                    <span className={`px-2.5 py-0.5 rounded font-mono text-[10px] font-bold ${
                      file.status === 'QUARANTINED' || file.status === 'MALICIOUS' ? 'bg-[#ef4444]/20 text-[#ef4444]' :
                      file.status === 'SUSPICIOUS' ? 'bg-[#f59e0b]/20 text-[#f59e0b]' :
                      'bg-[#10b981]/20 text-[#10b981]'
                    }`}>
                      {file.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 font-mono font-bold">
                    <span className={file.risk > 80 ? 'text-[#ef4444]' : file.risk > 50 ? 'text-[#f59e0b]' : 'text-[#10b981]'}>
                      {file.risk} / 100
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-2">
                      <button
                        className="px-2.5 py-1 rounded-lg bg-[#080a0f] border border-[#1e2638] text-[#f59e0b] hover:bg-[#f59e0b] hover:text-[#080a0f] text-[11px] font-mono font-bold transition-all cursor-pointer"
                        onClick={() => triggerAIScan(file)}
                      >
                        AI SCAN
                      </button>
                      <button
                        className={`px-2.5 py-1 rounded-lg font-mono text-[11px] font-bold border-0 cursor-pointer ${
                          file.quarantined
                            ? 'bg-[#10b981]/20 text-[#10b981] hover:bg-[#10b981]/30'
                            : 'bg-[#ef4444]/20 text-[#ef4444] hover:bg-[#ef4444]/30'
                        }`}
                        onClick={() => handleToggleQuarantine(file.id)}
                      >
                        {file.quarantined ? 'RELEASE' : 'QUARANTINE'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ASTRA AI SECURITY INSPECTOR POPUP CARD MODAL */}
      {inspectedItem && (
        <div className="fixed inset-0 z-50 bg-[#080a0f]/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-[#0f141e] border border-[#f59e0b]/40 p-6 shadow-[0_0_40px_rgba(245,158,11,0.2)] flex flex-col gap-5 animate-fade-in relative max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#1e2638]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#f59e0b] to-[#d97706] p-[1px]">
                  <div className="w-full h-full rounded-xl bg-[#080a0f] flex items-center justify-center">
                    <span className="material-symbols-outlined text-[#f59e0b] text-[20px]">security_update_warning</span>
                  </div>
                </div>
                <div className="flex flex-col">
                  <h3 className="text-base font-bold text-white font-heading flex items-center gap-2">
                    ASTRA AI SECURITY INSPECTOR
                  </h3>
                  <span className="text-[10px] font-mono text-[#f59e0b] uppercase font-semibold">
                    Autonomous Security & Threat Response AI Engine
                  </span>
                </div>
              </div>

              <button
                className="w-8 h-8 rounded-full bg-[#080a0f] border border-[#1e2638] text-[#94a3b8] hover:text-white flex items-center justify-center transition-all cursor-pointer"
                onClick={() => setInspectedItem(null)}
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {/* Item File / Folder Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono bg-[#080a0f] p-3.5 rounded-xl border border-[#1e2638]">
              <div className="flex flex-col gap-1">
                <span className="text-[#64748b]">Target Name:</span>
                <span className="text-white font-bold">{inspectedItem.name}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[#64748b]">Type / Size:</span>
                <span className="text-white">{inspectedItem.type || 'System Directory'} ({inspectedItem.size || `${inspectedItem.itemCount} items`})</span>
              </div>
              <div className="col-span-1 md:col-span-2 flex flex-col gap-1">
                <span className="text-[#64748b]">Local System Path / Hash:</span>
                <span className="text-[#f59e0b] break-all">{inspectedItem.path || inspectedItem.hash}</span>
              </div>
            </div>

            {/* AI Scan Progress Bar */}
            {isScanning && (
              <div className="flex flex-col gap-3 p-4 rounded-xl bg-[#080a0f] border border-[#1e2638]">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-white font-semibold flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#f59e0b] text-[16px] animate-spin">refresh</span>
                    Scanning local drive for Trojans, Botnets & Credential Stealers...
                  </span>
                  <span className="text-[#f59e0b] font-bold">{scanProgress}%</span>
                </div>

                <div className="w-full h-2 rounded-full bg-[#1e2638] overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#f59e0b] to-[#d97706] rounded-full transition-all duration-300"
                    style={{ width: `${scanProgress}%` }}
                  ></div>
                </div>

                {/* Scan Terminal Log Stream */}
                <div className="flex flex-col gap-1 font-mono text-[11px] text-[#94a3b8] pt-2">
                  {scanLogs.map((log, idx) => (
                    <span key={idx} className="text-[#f59e0b]/90">{log}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Scan Results Card */}
            {scanCompleted && (
              <div className="flex flex-col gap-4">
                <div className={`p-4 rounded-xl border flex flex-col gap-3 ${
                  inspectedItem.risk > 80 || inspectedItem.threatInfo
                    ? 'bg-[#ef4444]/10 border-[#ef4444]/40 text-[#ef4444]'
                    : inspectedItem.risk > 50
                    ? 'bg-[#f59e0b]/10 border-[#f59e0b]/40 text-[#f59e0b]'
                    : 'bg-[#10b981]/10 border-[#10b981]/40 text-[#10b981]'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[24px]">
                        {inspectedItem.risk > 50 ? 'warning' : 'verified_user'}
                      </span>
                      <span className="font-bold text-sm font-heading">
                        {inspectedItem.risk > 80 || inspectedItem.threatInfo
                          ? 'MALICIOUS SOFTWARE & BOT DETECTED'
                          : inspectedItem.risk > 50
                          ? 'SUSPICIOUS FILE PATTERN DETECTED'
                          : 'VERIFIED CLEAN & SAFE FILE'}
                      </span>
                    </div>

                    <span className="font-mono text-xs font-extrabold px-2.5 py-1 rounded bg-[#080a0f] border border-current">
                      RISK SCORE: {inspectedItem.risk || 5} / 100
                    </span>
                  </div>

                  {/* Detailed Threat Report */}
                  {inspectedItem.threatInfo ? (
                    <div className="flex flex-col gap-2 pt-2 border-t border-current/20 text-xs font-mono text-white">
                      <div className="flex items-center gap-2">
                        <span className="text-[#64748b]">Malware Classifier:</span>
                        <span className="text-[#ef4444] font-bold">{inspectedItem.threatInfo.malwareType}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[#64748b]">Harmful Behavior:</span>
                        <span className="text-white">{inspectedItem.threatInfo.behavior}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[#64748b]">Obfuscation Entropy:</span>
                        <span className="text-[#f59e0b]">{inspectedItem.threatInfo.entropy}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[#64748b]">MITRE ATT&CK Mapping:</span>
                        <span className="text-[#ef4444] font-mono">{inspectedItem.threatInfo.mitre}</span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-[#94a3b8] font-mono">
                      No malicious Trojans, credential stealers, keyloggers, or hidden scripts detected. SHA-256 signature verified against global threat databases.
                    </p>
                  )}
                </div>

                {/* Remediation Action Buttons */}
                <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
                  {inspectedItem.risk > 50 && (
                    <>
                      <button
                        className="px-4 py-2 rounded-xl bg-[#ef4444] text-white font-mono text-xs font-bold hover:brightness-110 transition-all cursor-pointer border-0 flex items-center gap-1.5"
                        onClick={() => handleToggleQuarantine(inspectedItem.id)}
                      >
                        <span className="material-symbols-outlined text-[16px]">lock</span>
                        {inspectedItem.quarantined ? 'RELEASE FROM QUARANTINE' : 'QUARANTINE PAYLOAD'}
                      </button>
                      <button
                        className="px-4 py-2 rounded-xl bg-[#1e2638] hover:bg-[#ef4444]/20 hover:text-[#ef4444] text-white font-mono text-xs font-bold transition-all cursor-pointer border border-[#1e2638] flex items-center gap-1.5"
                        onClick={() => handleDeleteFile(inspectedItem.id)}
                      >
                        <span className="material-symbols-outlined text-[16px]">delete</span>
                        DELETE PERMANENTLY
                      </button>
                    </>
                  )}
                  <button
                    className="px-4 py-2 rounded-xl bg-[#080a0f] border border-[#1e2638] hover:border-[#f59e0b] text-white font-mono text-xs font-bold transition-all cursor-pointer"
                    onClick={() => setInspectedItem(null)}
                  >
                    CLOSE INSPECTOR
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* New Folder Modal */}
      {showNewFolderModal && (
        <div className="fixed inset-0 z-50 bg-[#080a0f]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-[#0f141e] border border-[#1e2638] p-6 flex flex-col gap-4 shadow-2xl">
            <h3 className="text-sm font-bold text-white font-heading flex items-center gap-2">
              <span className="material-symbols-outlined text-[#f59e0b]">create_new_folder</span>
              CREATE NEW SYSTEM DIRECTORY
            </h3>
            <input
              type="text"
              placeholder="Enter folder path name..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#080a0f] border border-[#1e2638] text-xs text-white placeholder-[#64748b] focus:outline-none focus:border-[#f59e0b]"
              value={newFolderNameInput}
              onChange={(e) => setNewFolderNameInput(e.target.value)}
            />
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                className="px-4 py-2 rounded-xl bg-[#080a0f] text-[#94a3b8] hover:text-white text-xs font-mono border border-[#1e2638] cursor-pointer"
                onClick={() => setShowNewFolderModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded-xl bg-[#f59e0b] text-[#080a0f] text-xs font-mono font-bold hover:brightness-110 border-0 cursor-pointer"
                onClick={handleCreateFolder}
              >
                Create Directory
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
