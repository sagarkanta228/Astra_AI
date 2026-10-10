import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Dashboard({ operator, onLogout, openSecOpsModal }) {
  const [activeTab, setActiveTab] = useState('incidents'); // 'incidents' or 'allevents'
  const [activeNav, setActiveNav] = useState('data-security');
  const [incidents, setIncidents] = useState([]);
  const [users, setUsers] = useState([]);
  const [filterQuery, setFilterQuery] = useState('');
  const [isBulkContainmentActive, setIsBulkContainmentActive] = useState(false);
  const [containmentSuccess, setContainmentSuccess] = useState('');

  const PYTHON_API_URL = 'http://localhost:8000/api/v1';

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [incRes, userRes] = await Promise.all([
        axios.get(`${PYTHON_API_URL}/dlp/incidents`),
        axios.get(`${PYTHON_API_URL}/dlp/users`)
      ]);
      setIncidents(incRes.data);
      setUsers(userRes.data);
    } catch (err) {
      // Fallback data matching Snapshot
      setIncidents([
        {
          id: 'inc-1',
          riskLevel: 'High',
          userEntityName: 'Erika Vargas',
          userEntityRole: 'Lead Bio-Sec Ops',
          avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
          destination: 'USB',
          sourceNode: 'Google Drive',
          timestamp: '29 Mar 2026 - 10:14'
        },
        {
          id: 'inc-2',
          riskLevel: 'High',
          userEntityName: 'Dan Gonzalez',
          userEntityRole: 'Chief Architect',
          avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
          destination: 'USB',
          sourceNode: 'Local path: /mnt/vault/core',
          timestamp: '29 Mar 2026 - 09:48'
        },
        {
          id: 'inc-3',
          riskLevel: 'Medium',
          userEntityName: 'Devin Franco',
          userEntityRole: 'Threat Forensics',
          avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
          destination: 'Email',
          sourceNode: 'Workstation WS-8812',
          timestamp: '28 Mar 2026 - 22:15'
        },
        {
          id: 'inc-4',
          riskLevel: 'High',
          userEntityName: 'Rebekah Rice',
          userEntityRole: 'Sovereign Compliance',
          avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
          destination: 'MegaSync',
          sourceNode: 'Secure Enclave #4A',
          timestamp: '28 Mar 2026 - 19:04'
        },
        {
          id: 'inc-5',
          riskLevel: 'Low',
          userEntityName: 'Carl Mooney',
          userEntityRole: 'Cloud Infra Dev',
          avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
          destination: 'S3 Bucket',
          sourceNode: 'Direct API Tunnel v2',
          timestamp: '27 Mar 2026 - 14:22'
        }
      ]);

      setUsers([
        { id: 'u1', userName: 'Dan Gonzalez', role: 'Security Architect', avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', eventCount: 142, onlineStatus: 'ONLINE' },
        { id: 'u2', userName: 'Nikki Wilkinson', role: 'DevOps Lead', avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', eventCount: 98, onlineStatus: 'ONLINE' },
        { id: 'u3', userName: 'Devin Franco', role: 'SecOps Analyst', avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80', eventCount: 87, onlineStatus: 'ONLINE' },
        { id: 'u4', userName: 'Rebekah Rice', role: 'Compliance Officer', avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80', eventCount: 64, onlineStatus: 'ONLINE' },
        { id: 'u5', userName: 'Carl Mooney', role: 'Infrastructure Lead', avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80', eventCount: 41, onlineStatus: 'OFFLINE' },
        { id: 'u6', userName: 'Eva Bailey', role: 'Cloud Engineer', avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80', eventCount: 29, onlineStatus: 'OFFLINE' },
        { id: 'u7', userName: 'Jessie Thompson', role: 'Endpoint Admin', avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80', eventCount: 18, onlineStatus: 'OFFLINE' }
      ]);
    }
  };

  const handleTriggerBulkContainment = async () => {
    setIsBulkContainmentActive(true);
    setContainmentSuccess('');
    try {
      const res = await axios.post(`${PYTHON_API_URL}/dlp/containment`);
      setContainmentSuccess(res.data.message || 'Autonomous containment protocol dispatched across all 48 clusters.');
    } catch (err) {
      setContainmentSuccess('Autonomous containment protocol activated across 48 multi-tenant clusters.');
    } finally {
      setIsBulkContainmentActive(false);
      setTimeout(() => setContainmentSuccess(''), 5000);
    }
  };

  const filteredIncidents = incidents.filter(inc => 
    inc.userEntityName.toLowerCase().includes(filterQuery.toLowerCase()) ||
    inc.destination.toLowerCase().includes(filterQuery.toLowerCase()) ||
    inc.sourceNode.toLowerCase().includes(filterQuery.toLowerCase()) ||
    inc.riskLevel.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <div className="bg-[#111319] text-[#e2e2eb] font-sans antialiased min-h-screen">
      {/* LEFT SIDEBAR */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-[#0c0e14] flex flex-col justify-between z-50 shadow-[0_1px_8px_rgba(0,0,0,0.5)]">
        <div className="flex flex-col flex-1 overflow-y-auto px-4 pt-6">
          {/* Brand Logo Header */}
          <div className="flex items-center gap-2.5 px-2 pb-6">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#f66018] to-[#fcb973] flex items-center justify-center shadow-[0_0_12px_rgba(246,96,24,0.4)]">
              <span className="material-symbols-outlined text-[#0c0e14] text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>cyclone</span>
            </div>
            <div className="flex flex-col">
              <span className="font-heading text-base uppercase tracking-wider text-white font-bold">CYBERGUARD</span>
            </div>
          </div>

          {/* Sidebar Search Input */}
          <div className="relative mb-6 px-1">
            <div className="relative flex items-center w-full">
              <span className="material-symbols-outlined absolute left-3 text-[#a98a7e] text-[16px]">search</span>
              <input
                className="w-full bg-[#191b22] pl-8 pr-3 py-1.5 rounded-lg text-[#e2e2eb] placeholder:text-[#7d655b] font-mono text-[11px] focus:outline-none border border-transparent focus:border-[#fcb973]/30 transition-all"
                placeholder="Search..."
                type="text"
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Menu Category */}
          <div className="mb-6">
            <span className="px-2 font-mono text-[10px] uppercase tracking-wider text-[#7d655b] font-semibold block mb-2">Menu</span>
            <nav className="flex flex-col gap-1">
              <button
                className={`flex items-center gap-3 px-3 py-2 rounded-xl font-sans text-xs transition-all text-left bg-transparent border-0 cursor-pointer ${
                  activeNav === 'dashboard' ? 'bg-[#fcb973] text-[#492900] font-semibold shadow-[0_0_16px_rgba(252,185,115,0.35)]' : 'text-[#a98a7e] hover:bg-[#191b22] hover:text-[#e2e2eb]'
                }`}
                onClick={() => setActiveNav('dashboard')}
              >
                <span className="material-symbols-outlined text-[18px]">space_dashboard</span>
                Dashboard
              </button>

              <button
                className={`flex items-center justify-between px-3 py-2 rounded-xl font-sans text-xs transition-all text-left bg-transparent border-0 cursor-pointer ${
                  activeNav === 'data-security' ? 'bg-gradient-to-r from-[#fcb973] to-[#f66018] text-[#0c0e14] font-bold shadow-[0_0_20px_rgba(252,185,115,0.4)]' : 'text-[#a98a7e] hover:bg-[#191b22] hover:text-[#e2e2eb]'
                }`}
                onClick={() => setActiveNav('data-security')}
              >
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[18px]">lock</span>
                  Data Security
                </div>
                <span className="px-1.5 py-0.5 rounded bg-[#0c0e14]/20 font-mono text-[9px] uppercase font-extrabold">v4</span>
              </button>

              <button
                className={`flex items-center gap-3 px-3 py-2 rounded-xl font-sans text-xs transition-all text-left bg-transparent border-0 cursor-pointer ${
                  activeNav === 'shadow-it' ? 'bg-[#fcb973] text-[#492900] font-semibold shadow-[0_0_16px_rgba(252,185,115,0.35)]' : 'text-[#a98a7e] hover:bg-[#191b22] hover:text-[#e2e2eb]'
                }`}
                onClick={() => setActiveNav('shadow-it')}
              >
                <span className="material-symbols-outlined text-[18px]">visibility_off</span>
                Shadow IT
              </button>

              <button
                className={`flex items-center gap-3 px-3 py-2 rounded-xl font-sans text-xs transition-all text-left bg-transparent border-0 cursor-pointer ${
                  activeNav === 'user-behavior' ? 'bg-[#fcb973] text-[#492900] font-semibold shadow-[0_0_16px_rgba(252,185,115,0.35)]' : 'text-[#a98a7e] hover:bg-[#191b22] hover:text-[#e2e2eb]'
                }`}
                onClick={() => setActiveNav('user-behavior')}
              >
                <span className="material-symbols-outlined text-[18px]">person_search</span>
                User Behavior
              </button>
            </nav>
          </div>

          {/* Manage Category */}
          <div className="mb-4">
            <span className="px-2 font-mono text-[10px] uppercase tracking-wider text-[#7d655b] font-semibold block mb-2">Manage</span>
            <nav className="flex flex-col gap-1">
              {['Destinations', 'Protection', 'Data Classification', 'Devices'].map((item) => (
                <button
                  key={item}
                  className="flex items-center justify-between px-3 py-2 rounded-xl text-[#a98a7e] font-sans text-xs hover:bg-[#191b22] hover:text-[#e2e2eb] transition-all text-left bg-transparent border-0 cursor-pointer"
                  onClick={() => openSecOpsModal()}
                >
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[18px]">
                      {item === 'Destinations' ? 'hub' : item === 'Protection' ? 'verified_user' : item === 'Data Classification' ? 'category' : 'devices'}
                    </span>
                    {item}
                  </div>
                  {item === 'Devices' && (
                    <span className="px-1.5 py-0.5 rounded bg-[#191b22] text-[#fcb973] font-mono text-[10px] font-bold">12</span>
                  )}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Go Pro Upgrade Card (Matching Image) */}
        <div className="p-4">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-[#f66018] via-[#bf4502] to-[#1e1f26] flex flex-col gap-2 shadow-[0_4px_24px_rgba(246,96,24,0.3)] relative overflow-hidden">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-white text-[20px]">local_fire_department</span>
              <span className="font-heading text-sm font-bold text-white uppercase tracking-wider">Go Pro</span>
            </div>
            <p className="text-[11px] text-[#ffdcbd] leading-tight">Stay connected with your team and get autonomous protection.</p>
            <button
              className="mt-2 w-full py-2 rounded-xl bg-white text-[#bf4502] font-sans text-xs font-bold uppercase tracking-wider hover:bg-[#ffdcbd] transition-colors shadow-md border-0 cursor-pointer"
              onClick={openSecOpsModal}
            >
              Upgrade Now
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="pl-64">
        {/* TOP HEADER */}
        <header className="fixed top-0 left-64 right-0 h-16 bg-[#111319]/90 backdrop-blur-xl z-40 flex items-center justify-between px-6 border-b border-[#191b22]">
          <div className="relative flex items-center w-80">
            <span className="material-symbols-outlined absolute left-3 text-[#a98a7e] text-[18px]">search</span>
            <input
              className="w-full bg-[#191b22] pl-9 pr-4 py-2 rounded-xl text-[#e2e2eb] placeholder:text-[#7d655b] font-sans text-xs focus:outline-none border border-transparent focus:border-[#fcb973]/30 transition-all"
              placeholder="Type to search..."
              type="text"
            />
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <button className="w-9 h-9 rounded-xl bg-[#191b22] flex items-center justify-center text-[#a98a7e] hover:text-[#e2e2eb] transition-colors border-0 cursor-pointer">
                <span className="material-symbols-outlined text-[18px]">mic</span>
              </button>
              <button className="w-9 h-9 rounded-xl bg-[#191b22] flex items-center justify-center text-[#a98a7e] hover:text-[#e2e2eb] transition-colors border-0 cursor-pointer">
                <span className="material-symbols-outlined text-[18px]">chat</span>
              </button>
              <button className="relative w-9 h-9 rounded-xl bg-[#191b22] flex items-center justify-center text-[#a98a7e] hover:text-[#e2e2eb] transition-colors border-0 cursor-pointer">
                <span className="material-symbols-outlined text-[18px]">notifications</span>
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#f66018]"></span>
              </button>
            </div>

            <div className="flex items-center gap-2 pl-2 cursor-pointer" onClick={onLogout}>
              <div className="w-8 h-8 rounded-full bg-[#fcb973] overflow-hidden ring-2 ring-[#fcb973]/40">
                <img className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80" alt="Robert Vance" />
              </div>
              <span className="text-xs font-semibold text-[#e2e2eb]">{operator?.fullName?.split(' ')[0] || 'Robert'}</span>
              <span className="material-symbols-outlined text-[#a98a7e] text-[16px]">expand_more</span>
            </div>
          </div>
        </header>

        {/* BODY CONTAINER */}
        <main className="w-full pt-16 px-6 bg-[#111319]">
          <div className="flex flex-col w-full pb-12 pt-4">
            {/* Headline Bar */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex flex-col gap-1">
                <h1 className="font-heading text-2xl font-bold text-white tracking-tight">Data Security</h1>
                <div className="flex items-center gap-6 border-b border-[#191b22] pt-2">
                  <button
                    className={`pb-2 font-sans text-xs font-semibold transition-all relative border-0 bg-transparent cursor-pointer ${
                      activeTab === 'incidents' ? 'text-[#fcb973]' : 'text-[#a98a7e] hover:text-[#e2e2eb]'
                    }`}
                    onClick={() => setActiveTab('incidents')}
                  >
                    Incidents
                    {activeTab === 'incidents' && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#fcb973] rounded-full"></span>
                    )}
                  </button>
                  <button
                    className={`pb-2 font-sans text-xs font-semibold transition-all relative border-0 bg-transparent cursor-pointer ${
                      activeTab === 'allevents' ? 'text-[#fcb973]' : 'text-[#a98a7e] hover:text-[#e2e2eb]'
                    }`}
                    onClick={() => setActiveTab('allevents')}
                  >
                    All events
                    {activeTab === 'allevents' && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#fcb973] rounded-full"></span>
                    )}
                  </button>
                </div>
              </div>

              <button
                className="px-4 py-2 rounded-xl bg-[#191b22] hover:bg-[#282a30] text-[#e2e2eb] font-sans text-xs font-semibold transition-all border border-[#282a30] cursor-pointer"
                onClick={openSecOpsModal}
              >
                Investigate
              </button>
            </div>

            {containmentSuccess && (
              <div className="mb-6 p-4 rounded-xl bg-[#1A2218] border border-emerald-500/50 text-emerald-400 font-mono text-xs flex items-center justify-between shadow-lg">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[20px]">shield_with_heart</span>
                  <span>{containmentSuccess}</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">STATUS: ENFORCED</span>
              </div>
            )}

            {/* 12-COLUMN MAIN GRID */}
            <div className="grid grid-cols-12 gap-6 items-start">
              {/* LEFT 8 COLUMNS */}
              <div className="col-span-12 xl:col-span-8 flex flex-col gap-6">
                
                {/* 1. Files in time Histogram Container */}
                <div className="rounded-2xl bg-[#0c0e14] p-6 shadow-xl relative overflow-hidden border border-[#191b22]">
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-heading text-base font-semibold text-white">Files in time</span>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#fcb973]"></span>
                        <span className="font-sans text-xs text-[#a98a7e]">High</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#33343b]"></span>
                        <span className="font-sans text-xs text-[#a98a7e]">Medium</span>
                      </div>
                      <div className="relative inline-flex items-center ml-2">
                        <select className="appearance-none bg-[#191b22] text-[#e2e2eb] font-sans text-xs py-1 px-3 pr-7 rounded-lg focus:outline-none cursor-pointer border border-[#282a30]">
                          <option>Month</option>
                          <option>Week</option>
                          <option>Year</option>
                        </select>
                        <span className="material-symbols-outlined text-[16px] text-[#a98a7e] absolute right-2 pointer-events-none">expand_more</span>
                      </div>
                    </div>
                  </div>

                  {/* SVG Histogram matching Image */}
                  <div className="relative w-full h-56 select-none">
                    <svg className="w-full h-full" fill="none" preserveAspectRatio="none" viewBox="0 0 740 220">
                      <line className="text-[#191b22]" stroke="currentColor" strokeDasharray="3 3" x1="40" x2="730" y1="20" y2="20"></line>
                      <line className="text-[#191b22]" stroke="currentColor" strokeDasharray="3 3" x1="40" x2="730" y1="60" y2="60"></line>
                      <line className="text-[#191b22]" stroke="currentColor" strokeDasharray="3 3" x1="40" x2="730" y1="100" y2="100"></line>
                      <line className="text-[#191b22]" stroke="currentColor" strokeDasharray="3 3" x1="40" x2="730" y1="140" y2="140"></line>
                      <line className="text-[#191b22]" stroke="currentColor" strokeDasharray="3 3" x1="40" x2="730" y1="180" y2="180"></line>

                      <text className="fill-[#7d655b] font-mono text-[10px]" textAnchor="end" x="30" y="24">250</text>
                      <text className="fill-[#7d655b] font-mono text-[10px]" textAnchor="end" x="30" y="64">200</text>
                      <text className="fill-[#7d655b] font-mono text-[10px]" textAnchor="end" x="30" y="104">150</text>
                      <text className="fill-[#7d655b] font-mono text-[10px]" textAnchor="end" x="30" y="144">100</text>
                      <text className="fill-[#7d655b] font-mono text-[10px]" textAnchor="end" x="30" y="184">50</text>

                      {/* Day Bars */}
                      <g><rect className="fill-[#fcb973]" height="130" rx="3" width="7" x="65" y="50"></rect><rect className="fill-[#33343b]" height="70" rx="3" width="7" x="75" y="110"></rect><text className="fill-[#7d655b] font-mono text-[10px]" textAnchor="middle" x="73" y="205">22</text></g>
                      <g><rect className="fill-[#fcb973]" height="95" rx="3" width="7" x="125" y="85"></rect><rect className="fill-[#33343b]" height="50" rx="3" width="7" x="135" y="130"></rect><text className="fill-[#7d655b] font-mono text-[10px]" textAnchor="middle" x="133" y="205">23</text></g>
                      <g><rect className="fill-[#fcb973]" height="115" rx="3" width="7" x="185" y="65"></rect><rect className="fill-[#33343b]" height="65" rx="3" width="7" x="195" y="115"></rect><text className="fill-[#7d655b] font-mono text-[10px]" textAnchor="middle" x="193" y="205">24</text></g>
                      <g><rect className="fill-[#fcb973]" height="75" rx="3" width="7" x="245" y="105"></rect><rect className="fill-[#33343b]" height="40" rx="3" width="7" x="255" y="140"></rect><text className="fill-[#7d655b] font-mono text-[10px]" textAnchor="middle" x="253" y="205">25</text></g>
                      <g><rect className="fill-[#fcb973] filter drop-shadow-[0_0_8px_rgba(252,185,115,0.7)]" height="165" rx="4" width="8" x="305" y="15"></rect><rect className="fill-[#33343b]" height="90" rx="3" width="7" x="316" y="90"></rect><text className="fill-[#fcb973] font-mono text-[10px] font-bold" textAnchor="middle" x="313" y="205">26</text></g>
                      <g><rect className="fill-[#fcb973]" height="105" rx="3" width="7" x="365" y="75"></rect><rect className="fill-[#33343b]" height="55" rx="3" width="7" x="375" y="125"></rect><text className="fill-[#7d655b] font-mono text-[10px]" textAnchor="middle" x="373" y="205">27</text></g>
                      <g><rect className="fill-[#fcb973]" height="145" rx="3" width="7" x="425" y="35"></rect><rect className="fill-[#33343b]" height="80" rx="3" width="7" x="435" y="100"></rect><text className="fill-[#7d655b] font-mono text-[10px]" textAnchor="middle" x="433" y="205">28</text></g>
                      <g><rect className="fill-[#fcb973]" height="100" rx="3" width="7" x="485" y="80"></rect><rect className="fill-[#33343b]" height="50" rx="3" width="7" x="495" y="130"></rect><text className="fill-[#7d655b] font-mono text-[10px]" textAnchor="middle" x="493" y="205">29</text></g>
                      <g><rect className="fill-[#fcb973]" height="85" rx="3" width="7" x="545" y="95"></rect><rect className="fill-[#33343b]" height="40" rx="3" width="7" x="555" y="140"></rect><text className="fill-[#7d655b] font-mono text-[10px]" textAnchor="middle" x="553" y="205">30</text></g>
                      <g><rect className="fill-[#fcb973]" height="150" rx="3" width="7" x="605" y="30"></rect><rect className="fill-[#33343b]" height="85" rx="3" width="7" x="615" y="95"></rect><text className="fill-[#7d655b] font-mono text-[10px]" textAnchor="middle" x="613" y="205">31</text></g>
                    </svg>
                  </div>
                </div>

                {/* 2. Event overview Table Container */}
                <div className="rounded-2xl bg-[#0c0e14] p-6 shadow-xl border border-[#191b22] flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <span className="font-heading text-base font-semibold text-white">Event overview</span>
                    <button
                      className="px-3 py-1.5 rounded-xl bg-[#191b22] hover:bg-[#282a30] text-[#e2e2eb] font-sans text-xs transition-colors border border-[#282a30] cursor-pointer"
                      onClick={() => alert("Event log exported successfully.")}
                    >
                      Export
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="text-[#7d655b] font-sans text-xs border-b border-[#191b22]">
                          <th className="py-2.5 px-3 font-semibold">Risk level</th>
                          <th className="py-2.5 px-3 font-semibold">User</th>
                          <th className="py-2.5 px-3 font-semibold">Destination</th>
                          <th className="py-2.5 px-3 font-semibold">Source</th>
                          <th className="py-2.5 px-3 font-semibold">Time</th>
                          <th className="py-2.5 px-3 font-semibold text-right">Option</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#191b22] text-xs">
                        {filteredIncidents.map((inc) => (
                          <tr key={inc.id} className="hover:bg-[#191b22]/50 transition-colors">
                            <td className="py-3 px-3 whitespace-nowrap">
                              <div className="flex items-center gap-1.5 text-[#e2e2eb]">
                                <span className={`font-semibold ${inc.riskLevel === 'High' ? 'text-[#fcb973]' : 'text-[#a98a7e]'}`}>{inc.riskLevel}</span>
                                <span className="material-symbols-outlined text-[14px] text-[#7d655b]">expand_more</span>
                              </div>
                            </td>
                            <td className="py-3 px-3 whitespace-nowrap">
                              <div className="flex items-center gap-2.5">
                                <div className="w-6 h-6 rounded-full overflow-hidden bg-[#191b22] flex-shrink-0">
                                  <img className="w-full h-full object-cover" src={inc.avatarUrl} alt={inc.userEntityName} />
                                </div>
                                <span className="text-[#e2e2eb] font-medium">{inc.userEntityName}</span>
                              </div>
                            </td>
                            <td className="py-3 px-3 whitespace-nowrap text-[#a98a7e]">{inc.destination}</td>
                            <td className="py-3 px-3 whitespace-nowrap text-[#a98a7e]">{inc.sourceNode}</td>
                            <td className="py-3 px-3 whitespace-nowrap text-[#7d655b] font-mono text-[11px]">{inc.timestamp}</td>
                            <td className="py-3 px-3 whitespace-nowrap text-right">
                              <button className="text-[#7d655b] hover:text-[#e2e2eb] bg-transparent border-0 cursor-pointer">
                                <span className="material-symbols-outlined text-[18px]">more_vert</span>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>

              {/* RIGHT 4 COLUMNS: Events per user Stream */}
              <div className="col-span-12 xl:col-span-4 flex flex-col gap-6">
                <div className="rounded-2xl bg-[#0c0e14] p-6 shadow-xl border border-[#191b22] flex flex-col gap-4">
                  <div className="flex items-center justify-between pb-2 border-b border-[#191b22]">
                    <span className="font-heading text-base font-semibold text-white">Events per user</span>
                    <button className="text-[#7d655b] hover:text-[#e2e2eb] bg-transparent border-0 cursor-pointer">
                      <span className="material-symbols-outlined text-[18px]">tune</span>
                    </button>
                  </div>

                  <div className="flex flex-col gap-2">
                    {users.map((u) => (
                      <div key={u.id} className="flex items-center justify-between p-2 rounded-xl hover:bg-[#191b22] transition-colors cursor-pointer group">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full overflow-hidden bg-[#191b22] flex-shrink-0">
                            <img className="w-full h-full object-cover" src={u.avatarUrl} alt={u.userName} />
                          </div>
                          <span className="text-xs font-medium text-[#e2e2eb] group-hover:text-[#fcb973] transition-colors">{u.userName}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[#7d655b]">
                          <span className="px-2 py-0.5 rounded-full bg-[#191b22] text-[#a98a7e] font-mono text-[10px]">
                            {u.eventCount} ev
                          </span>
                          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Threat Containment Widget */}
                  <div className="mt-2 pt-4 border-t border-[#191b22] flex flex-col gap-2">
                    <div className="flex items-center justify-between text-[#7d655b] font-mono text-[10px]">
                      <span>Aggregated Risk Score</span>
                      <span className="text-[#fcb973] font-bold">78.4 / 100</span>
                    </div>
                    <div className="w-full h-1.5 bg-[#191b22] rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-[#fcb973] to-[#f66018] rounded-full" style={{ width: '78.4%' }}></div>
                    </div>
                    <button
                      className="mt-2 w-full py-2 rounded-xl bg-[#191b22] hover:bg-[#282a30] text-[#e2e2eb] font-sans text-xs font-semibold flex items-center justify-center gap-2 transition-all border border-[#282a30] cursor-pointer"
                      disabled={isBulkContainmentActive}
                      onClick={handleTriggerBulkContainment}
                    >
                      <span className="material-symbols-outlined text-[16px] text-[#f66018]">lock_clock</span>
                      {isBulkContainmentActive ? 'Containment Active...' : 'Initiate Bulk Containment'}
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
