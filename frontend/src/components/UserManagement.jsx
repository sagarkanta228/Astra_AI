import React, { useState, useEffect } from 'react';
import { getStoredUsers, createNewUser, deleteUserById } from '../utils/authService';

export default function UserManagement({ setActiveView }) {
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('ALL');
  const [toastMessage, setToastMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    role: 'USER',
    department: 'Finance & Operations',
    device: ''
  });

  const loadUsers = () => {
    setUsers(getStoredUsers());
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.fullName.trim()) {
      setErrorMessage('Full name is required.');
      return;
    }
    if (!formData.email.trim()) {
      setErrorMessage('Enterprise email is required.');
      return;
    }
    if (!formData.password || formData.password.length < 4) {
      setErrorMessage('Password must be at least 4 characters.');
      return;
    }

    try {
      const created = await createNewUser(formData);
      showToast(`User ${created.fullName} (${created.email}) provisioned successfully! They can now log in from the main login page.`);
      setIsModalOpen(false);
      setFormData({
        fullName: '',
        email: '',
        password: '',
        role: 'USER',
        department: 'Finance & Operations',
        device: ''
      });
      loadUsers();
    } catch (err) {
      setErrorMessage(err.message || 'Failed to provision user.');
    }
  };

  const handleDeleteUser = (userId, userEmail) => {
    if (window.confirm(`Are you sure you want to revoke and delete access for ${userEmail}?`)) {
      try {
        deleteUserById(userId);
        showToast(`User ${userEmail} has been deleted.`);
        loadUsers();
      } catch (err) {
        alert(err.message);
      }
    }
  };

  const handleGeneratePassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%';
    let pass = '';
    for (let i = 0; i < 10; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData(prev => ({ ...prev, password: pass }));
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = 
      (u.fullName && u.fullName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (u.email && u.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (u.department && u.department.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesRole = filterRole === 'ALL' || u.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const totalUsers = users.length;
  const adminCount = users.filter(u => u.role === 'ADMIN').length;
  const standardCount = users.filter(u => u.role === 'USER').length;

  return (
    <div className="flex flex-col gap-6 pb-12 font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl bg-[#10b981]/20 border border-[#10b981] text-[#10b981] backdrop-blur-xl shadow-2xl animate-fade-in">
          <span className="material-symbols-outlined text-[20px]">check_circle</span>
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="p-6 lg:p-8 rounded-2xl bg-[#0f141e] border border-[#1e2638] flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#3b82f6]/20 text-[#3b82f6] font-mono text-[10px] font-bold border border-[#3b82f6]/30">
              IDENTITY & ACCESS MANAGEMENT (IAM)
            </span>
            <span className="text-[#64748b] text-xs font-mono">Role-Based Access Control</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white font-heading">
            Enterprise User <span className="text-[#3b82f6]">Provisioning & Management</span>
          </h1>
          <p className="text-sm text-[#94a3b8]">
            As SOC Analyst (Admin), provision new user accounts, assign enterprise departments, and control authentication access.
          </p>
        </div>

        <button
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#3b82f6] to-[#2563eb] text-white font-mono text-xs font-bold hover:brightness-110 transition-all cursor-pointer border-0 shadow-[0_0_20px_rgba(59,130,246,0.35)] flex items-center gap-2"
          onClick={() => {
            setErrorMessage('');
            setIsModalOpen(true);
          }}
        >
          <span className="material-symbols-outlined text-[18px]">person_add</span>
          <span>CREATE NEW USER</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-[#0f141e] border border-[#1e2638] flex items-center justify-between">
          <div>
            <div className="text-xs font-mono text-[#64748b] uppercase">Total Provisioned</div>
            <div className="text-2xl font-bold text-white mt-1">{totalUsers}</div>
            <div className="text-[11px] text-[#10b981] mt-0.5">Enrolled Identities</div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-[#3b82f6]/10 border border-[#3b82f6]/30 flex items-center justify-center text-[#3b82f6]">
            <span className="material-symbols-outlined text-[24px]">group</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0f141e] border border-[#1e2638] flex items-center justify-between">
          <div>
            <div className="text-xs font-mono text-[#64748b] uppercase">SOC Analysts (Admins)</div>
            <div className="text-2xl font-bold text-white mt-1">{adminCount}</div>
            <div className="text-[11px] text-[#ef4444] mt-0.5">Full Privileged Access</div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-[#ef4444]/10 border border-[#ef4444]/30 flex items-center justify-center text-[#ef4444]">
            <span className="material-symbols-outlined text-[24px]">shield_person</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0f141e] border border-[#1e2638] flex items-center justify-between">
          <div>
            <div className="text-xs font-mono text-[#64748b] uppercase">Standard Users</div>
            <div className="text-2xl font-bold text-white mt-1">{standardCount}</div>
            <div className="text-[11px] text-[#f59e0b] mt-0.5">Department Operators</div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-[#f59e0b]/10 border border-[#f59e0b]/30 flex items-center justify-center text-[#f59e0b]">
            <span className="material-symbols-outlined text-[24px]">badge</span>
          </div>
        </div>
      </div>

      {/* Instruction Pill */}
      <div className="p-4 rounded-xl bg-[#1e2638]/40 border border-[#1e2638] flex items-center gap-3 text-xs text-[#94a3b8]">
        <span className="material-symbols-outlined text-[#3b82f6] text-[20px]">info</span>
        <span>
          <strong className="text-white">Unified Login Access:</strong> Any user created below can log in directly from the single login page using their Email and Password. Admins are routed to the SOC Console, while Users are routed to their User Security Dashboard.
        </span>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-[#0f141e] border border-[#1e2638]">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-72">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#64748b] text-[18px]">search</span>
            <input
              type="text"
              placeholder="Search user by name, email, department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#080a0f] border border-[#1e2638] text-xs text-white placeholder-[#64748b] focus:outline-none focus:border-[#3b82f6]"
            />
          </div>

          <div className="flex items-center gap-1 bg-[#080a0f] border border-[#1e2638] p-1 rounded-xl">
            {['ALL', 'ADMIN', 'USER'].map((r) => (
              <button
                key={r}
                className={`px-3 py-1 rounded-lg text-xs font-mono font-semibold transition-all border-0 cursor-pointer ${
                  filterRole === r
                    ? 'bg-[#3b82f6] text-white shadow-sm'
                    : 'text-[#64748b] bg-transparent hover:text-white'
                }`}
                onClick={() => setFilterRole(r)}
              >
                {r === 'ALL' ? 'All Roles' : (r === 'ADMIN' ? 'SOC Admins' : 'Users')}
              </button>
            ))}
          </div>
        </div>

        <span className="text-xs font-mono text-[#64748b]">
          Showing {filteredUsers.length} of {totalUsers} accounts
        </span>
      </div>

      {/* Users Table */}
      <div className="rounded-2xl bg-[#0f141e] border border-[#1e2638] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#1e2638] bg-[#080a0f]/60 text-[#64748b] font-mono text-[11px] uppercase tracking-wider">
                <th className="py-3.5 px-4 font-semibold">User</th>
                <th className="py-3.5 px-4 font-semibold">Email & Login ID</th>
                <th className="py-3.5 px-4 font-semibold">Password</th>
                <th className="py-3.5 px-4 font-semibold">Role</th>
                <th className="py-3.5 px-4 font-semibold">Department</th>
                <th className="py-3.5 px-4 font-semibold">Assigned Device</th>
                <th className="py-3.5 px-4 font-semibold">Status</th>
                <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e2638] text-xs">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-[#161c28]/50 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={u.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"}
                        alt={u.fullName}
                        className="w-8 h-8 rounded-full object-cover border border-[#1e2638]"
                      />
                      <div className="flex flex-col">
                        <span className="font-semibold text-white">{u.fullName}</span>
                        <span className="text-[10px] text-[#64748b] font-mono">{u.title || u.role}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-mono text-white select-all bg-[#080a0f] px-2 py-1 rounded border border-[#1e2638]">
                      {u.email}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[#94a3b8]">
                    <span className="bg-[#080a0f] px-2 py-1 rounded border border-[#1e2638] text-[#f59e0b] select-all">
                      {u.password}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-1 rounded-full font-mono text-[10px] font-bold border ${
                      u.role === 'ADMIN'
                        ? 'bg-[#ef4444]/15 text-[#ef4444] border-[#ef4444]/30'
                        : 'bg-[#3b82f6]/15 text-[#3b82f6] border-[#3b82f6]/30'
                    }`}>
                      {u.role === 'ADMIN' ? 'SOC ANALYST' : 'STANDARD USER'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-[#94a3b8]">
                    {u.department}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[11px] text-[#64748b]">
                    {u.device || 'Unassigned'}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="flex items-center gap-1.5 font-mono text-[11px] text-[#10b981]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]"></span>
                      Active
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {u.email === 'admin@astra.internal' ? (
                      <span className="text-[11px] font-mono text-[#64748b] italic">Default Superadmin</span>
                    ) : (
                      <button
                        className="px-2.5 py-1 rounded-lg bg-[#ef4444]/10 hover:bg-[#ef4444]/20 text-[#ef4444] border border-[#ef4444]/30 font-mono text-[11px] cursor-pointer transition-all"
                        onClick={() => handleDeleteUser(u.id, u.email)}
                        title="Delete User"
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan="8" className="py-8 text-center text-[#64748b] font-mono">
                    No users found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-lg rounded-2xl bg-[#0f141e] border border-[#1e2638] shadow-2xl p-6 sm:p-8 flex flex-col gap-6 animate-scale-in">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#1e2638]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#3b82f6]/10 border border-[#3b82f6]/30 flex items-center justify-center text-[#3b82f6]">
                  <span className="material-symbols-outlined text-[22px]">person_add</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white font-heading">Provision New Enterprise User</h3>
                  <p className="text-xs text-[#94a3b8]">Create credentials for employees to log in to Astra</p>
                </div>
              </div>
              <button
                className="p-1 rounded-lg text-[#64748b] hover:text-white bg-transparent border-0 cursor-pointer"
                onClick={() => setIsModalOpen(false)}
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="p-3 rounded-xl bg-[#ef4444]/15 border border-[#ef4444]/30 text-[#ef4444] text-xs flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px]">error</span>
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleCreateUser} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-mono text-[#94a3b8] mb-1.5 uppercase font-semibold">
                  Full Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. David Miller"
                  value={formData.fullName}
                  onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#080a0f] border border-[#1e2638] text-xs text-white placeholder-[#64748b] focus:outline-none focus:border-[#3b82f6]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-[#94a3b8] mb-1.5 uppercase font-semibold">
                  Enterprise Email (Login ID) *
                </label>
                <input
                  type="email"
                  placeholder="e.g. david.miller@astra.internal"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#080a0f] border border-[#1e2638] text-xs text-white placeholder-[#64748b] focus:outline-none focus:border-[#3b82f6]"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-mono text-[#94a3b8] uppercase font-semibold">
                    Login Password *
                  </label>
                  <button
                    type="button"
                    onClick={handleGeneratePassword}
                    className="text-[11px] font-mono text-[#3b82f6] hover:underline bg-transparent border-0 cursor-pointer"
                  >
                    Generate Password
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="e.g. Pass123!"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#080a0f] border border-[#1e2638] text-xs text-white placeholder-[#64748b] focus:outline-none focus:border-[#3b82f6] font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-[#94a3b8] mb-1.5 uppercase font-semibold">
                    Access Role
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl bg-[#080a0f] border border-[#1e2638] text-xs text-white focus:outline-none focus:border-[#3b82f6]"
                  >
                    <option value="USER">Standard User</option>
                    <option value="ADMIN">SOC Analyst (Admin)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-[#94a3b8] mb-1.5 uppercase font-semibold">
                    Department
                  </label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl bg-[#080a0f] border border-[#1e2638] text-xs text-white focus:outline-none focus:border-[#3b82f6]"
                  >
                    <option value="Finance & Operations">Finance & Operations</option>
                    <option value="Software Engineering">Software Engineering</option>
                    <option value="Security Operations">Security Operations</option>
                    <option value="Executive & Legal">Executive & Legal</option>
                    <option value="IT Infrastructure">IT Infrastructure</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-[#94a3b8] mb-1.5 uppercase font-semibold">
                  Assigned Device Hostname (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. WS-9912 (192.168.1.112)"
                  value={formData.device}
                  onChange={(e) => setFormData(prev => ({ ...prev, device: e.target.value }))}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#080a0f] border border-[#1e2638] text-xs text-white placeholder-[#64748b] focus:outline-none focus:border-[#3b82f6]"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 mt-4 pt-4 border-t border-[#1e2638]">
                <button
                  type="button"
                  className="px-4 py-2 rounded-xl text-xs text-[#94a3b8] hover:text-white bg-transparent border-0 cursor-pointer"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#3b82f6] hover:bg-[#2563eb] text-white font-mono text-xs font-bold transition-all cursor-pointer border-0 shadow-[0_0_15px_rgba(59,130,246,0.3)] flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[16px]">save</span>
                  <span>Provision Account</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
