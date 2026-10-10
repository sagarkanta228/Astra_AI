import React, { useState } from 'react';

export default function UserDashboard({ setActiveView, onSelectScanTab }) {
  const [activeTab, setActiveTab] = useState('incidents');

  const chartDays = [
    { day: '22', high: 140, medium: 90 },
    { day: '23', high: 80, medium: 45 },
    { day: '24', high: 120, medium: 70 },
    { day: '25', high: 90, medium: 60 },
    { day: '26', high: 170, medium: 110 },
    { day: '27', high: 110, medium: 80 },
    { day: '28', high: 145, medium: 95 },
    { day: '29', high: 125, medium: 85 },
    { day: '30', high: 100, medium: 65 },
    { day: '31', high: 165, medium: 105 }
  ];

  const eventsData = [
    {
      id: 1,
      riskLevel: 'High',
      user: 'Erika Vargas',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      destination: 'USB',
      source: 'Google Drive',
      time: '29 Mar 2023 - 20 Sep...'
    },
    {
      id: 2,
      riskLevel: 'High',
      user: 'Don Gonzales',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
      destination: 'USB',
      source: 'Local path',
      time: '19 Mar 2023 - 28 Apr...'
    },
    {
      id: 3,
      riskLevel: 'High',
      user: 'Devin Franco',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
      destination: 'Email',
      source: 'Local Path',
      time: '15 Mar 2023 - 05 Apr...'
    },
    {
      id: 4,
      riskLevel: 'High',
      user: 'Rebekah Price',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
      destination: 'Cloud Vault',
      source: 'SharePoint',
      time: '12 Mar 2023 - 18 Apr...'
    }
  ];

  const userEvents = [
    { name: 'Don Gonzales', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80' },
    { name: 'Nikki Wilkinson', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80' },
    { name: 'Devin Franco', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80' },
    { name: 'Rebekah Price', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80' },
    { name: 'Carl Mooney', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&auto=format&fit=crop&q=80' },
    { name: 'Eva Bailey', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80' },
    { name: 'Jessie Thomas', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80' },
    { name: 'Erika Vargas', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80' },
    { name: 'Susan Scott', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80' }
  ];

  return (
    <div className="flex flex-col gap-6 pb-12 text-white font-sans">
      {/* Top Header & Action */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-3">
          <h1 className="text-2xl font-bold font-heading tracking-tight text-white">
            Data Security
          </h1>

          {/* Sub Navigation Tabs */}
          <div className="flex items-center gap-6 border-b border-[#1e2638]">
            <button
              className={`pb-2.5 text-xs font-semibold transition-all border-0 bg-transparent cursor-pointer relative ${
                activeTab === 'incidents' ? 'text-white font-bold' : 'text-[#64748b] hover:text-white'
              }`}
              onClick={() => setActiveTab('incidents')}
            >
              Incidents
              {activeTab === 'incidents' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#f59e0b] rounded-full"></span>
              )}
            </button>
            <button
              className={`pb-2.5 text-xs font-semibold transition-all border-0 bg-transparent cursor-pointer relative ${
                activeTab === 'events' ? 'text-white font-bold' : 'text-[#64748b] hover:text-white'
              }`}
              onClick={() => setActiveTab('events')}
            >
              All events
              {activeTab === 'events' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#f59e0b] rounded-full"></span>
              )}
            </button>
          </div>
        </div>

        {/* Investigate Action Button */}
        <button
          className="px-4 py-2 rounded-xl bg-[#0f141e] border border-[#1e2638] hover:border-[#f59e0b]/50 text-xs font-semibold text-white transition-all shadow-md cursor-pointer flex items-center gap-2"
          onClick={() => setActiveView('user-analyze')}
        >
          <span className="material-symbols-outlined text-[16px] text-[#f59e0b]">travel_explore</span>
          Investigate
        </button>
      </div>

      {/* Main Grid: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left 3 Columns: Files in Time Chart + Event Overview Table */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          {/* Card 1: Files in Time Bar Chart */}
          <div className="p-6 rounded-2xl bg-[#0f141e] border border-[#1e2638] flex flex-col gap-6 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-white font-heading">
                Files in time
              </span>

              {/* Legend & Month Filter */}
              <div className="flex items-center gap-6 text-xs">
                <div className="flex items-center gap-4 text-[#94a3b8]">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]"></span> High
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#334155]"></span> Medium
                  </span>
                </div>

                <div className="flex items-center gap-1 px-3 py-1 rounded-xl bg-[#080a0f] border border-[#1e2638] text-xs text-white cursor-pointer select-none">
                  <span>March</span>
                  <span className="material-symbols-outlined text-[16px] text-[#64748b]">expand_more</span>
                </div>
              </div>
            </div>

            {/* Custom Bar Chart Canvas */}
            <div className="flex flex-col gap-2 pt-2">
              <div className="h-44 flex items-end justify-between px-2 gap-2 border-b border-[#1e2638]">
                {chartDays.map((item, idx) => (
                  <div key={idx} className="flex-1 flex items-end justify-center gap-1.5 h-full">
                    {/* High Bar */}
                    <div
                      className="w-2.5 bg-gradient-to-t from-[#f59e0b] to-[#d97706] rounded-t-full transition-all hover:brightness-125 cursor-pointer shadow-[0_0_8px_rgba(245,158,11,0.2)]"
                      style={{ height: `${(item.high / 200) * 100}%` }}
                      title={`High Risk Files: ${item.high}`}
                    ></div>
                    {/* Medium Bar */}
                    <div
                      className="w-2.5 bg-[#1e2638] rounded-t-full transition-all hover:bg-[#334155] cursor-pointer"
                      style={{ height: `${(item.medium / 200) * 100}%` }}
                      title={`Medium Risk Files: ${item.medium}`}
                    ></div>
                  </div>
                ))}
              </div>

              {/* X Axis Day Labels */}
              <div className="flex items-center justify-between px-2 text-[11px] font-mono text-[#64748b]">
                {chartDays.map((item, idx) => (
                  <span key={idx} className="flex-1 text-center">{item.day}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Card 2: Event Overview Table */}
          <div className="p-6 rounded-2xl bg-[#0f141e] border border-[#1e2638] flex flex-col gap-5 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-white font-heading">
                Event overview
              </span>

              <button className="px-3.5 py-1.5 rounded-xl bg-[#080a0f] border border-[#1e2638] hover:border-[#f59e0b]/50 text-xs font-semibold text-[#94a3b8] hover:text-white transition-all cursor-pointer">
                Export
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#1e2638] text-[11px] text-[#64748b] font-mono uppercase">
                    <th className="pb-3 px-3">Risk level</th>
                    <th className="pb-3 px-3">User</th>
                    <th className="pb-3 px-3">Destination</th>
                    <th className="pb-3 px-3">Source</th>
                    <th className="pb-3 px-3">Time</th>
                    <th className="pb-3 px-3 text-right">Option</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#161b26] text-xs">
                  {eventsData.map((row) => (
                    <tr key={row.id} className="hover:bg-[#161b26]/60 transition-colors">
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1 text-xs font-semibold text-white">
                          <span className="px-2 py-0.5 rounded bg-[#ef4444]/15 text-[#ef4444] font-mono text-[10px]">{row.riskLevel}</span>
                          <span className="material-symbols-outlined text-[16px] text-[#64748b]">expand_more</span>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2.5">
                          <img className="w-7 h-7 rounded-full object-cover border border-[#f59e0b]/40" src={row.avatar} alt={row.user} />
                          <span className="font-semibold text-white">{row.user}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-[#94a3b8]">{row.destination}</td>
                      <td className="py-3 px-3 text-[#94a3b8]">{row.source}</td>
                      <td className="py-3 px-3 text-[#64748b] font-mono text-[11px]">{row.time}</td>
                      <td className="py-3 px-3 text-right">
                        <button className="text-[#64748b] hover:text-white bg-transparent border-0 cursor-pointer">
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

        {/* Right 1 Column: Events Per User Panel */}
        <div className="lg:col-span-1 p-6 rounded-2xl bg-[#0f141e] border border-[#1e2638] flex flex-col gap-5 shadow-xl">
          <span className="text-sm font-bold text-white font-heading">
            Events per user
          </span>

          <div className="flex flex-col gap-3.5">
            {userEvents.map((user, idx) => (
              <div key={idx} className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#161b26] transition-all cursor-pointer">
                <img className="w-8 h-8 rounded-full object-cover border border-[#1e2638]" src={user.avatar} alt={user.name} />
                <span className="text-xs font-semibold text-white">{user.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
