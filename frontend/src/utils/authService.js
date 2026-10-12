// Shared enterprise authentication service with persistent storage and SOC user provisioning

const STORAGE_KEY = 'ASTRA_ENTERPRISE_USERS';

const DEFAULT_USERS = [
  {
    id: 'usr-admin-01',
    fullName: 'Sarah Jenkins',
    email: 'admin@astra.internal',
    password: 'admin123',
    role: 'ADMIN',
    title: 'SOC Analyst (Admin)',
    department: 'Security Operations Center',
    device: 'SOC-STATION-01 (10.0.4.15)',
    status: 'ACTIVE',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    createdAt: '2026-10-01 08:00:00'
  },
  {
    id: 'usr-tanmaya-01',
    fullName: 'Tanmaya Pany',
    email: 'tanmayapany09@gmail.com',
    password: 'Tanmaya123',
    role: 'ADMIN',
    title: 'Enterprise Administrator / SOC Analyst',
    department: 'Security Engineering',
    device: 'WS-706 (192.168.1.109)',
    status: 'ACTIVE',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    createdAt: '2026-10-10 19:31:46'
  },
  {
    id: 'usr-user-01',
    fullName: 'Robert Vance',
    email: 'user@astra.internal',
    password: 'user123',
    role: 'USER',
    title: 'Finance & Operations Lead',
    department: 'Finance & Operations',
    device: 'Workstation WS-8812 (192.168.1.104)',
    status: 'ACTIVE',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    createdAt: '2026-10-02 09:30:00'
  }
];

export const getStoredUsers = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    let users = [];
    if (!raw) {
      users = [...DEFAULT_USERS];
    } else {
      const parsed = JSON.parse(raw);
      users = Array.isArray(parsed) && parsed.length > 0 ? parsed : [...DEFAULT_USERS];
    }

    // Ensure all default users exist and maintain updated credentials
    let hasChanges = false;
    for (const defUser of DEFAULT_USERS) {
      const matchIdx = users.findIndex(u => u.email && u.email.toLowerCase() === defUser.email.toLowerCase());
      if (matchIdx === -1) {
        users.push(defUser);
        hasChanges = true;
      } else if (defUser.email.toLowerCase() === 'tanmayapany09@gmail.com') {
        if (users[matchIdx].password !== defUser.password || users[matchIdx].role !== defUser.role) {
          users[matchIdx].password = defUser.password;
          users[matchIdx].role = defUser.role;
          users[matchIdx].title = defUser.title;
          hasChanges = true;
        }
      }
    }

    if (hasChanges || !raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    }
    return users;
  } catch (err) {
    console.error('Error reading stored users:', err);
    return DEFAULT_USERS;
  }
};

export const saveUsers = (users) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  } catch (err) {
    console.error('Error saving users to localStorage:', err);
  }
};

export const authenticateUser = async (identifier, password) => {
  const cleanId = (identifier || '').trim().toLowerCase();
  const cleanPass = (password || '').trim();

  // Try matching from local persistent store
  const users = getStoredUsers();
  const matched = users.find(u => {
    const emailMatch = u.email && u.email.toLowerCase() === cleanId;
    const nameMatch = u.fullName && u.fullName.toLowerCase() === cleanId;
    const usernameMatch = cleanId === 'admin' 
      ? u.role === 'ADMIN' 
      : (cleanId === 'user' ? u.role === 'USER' : false);
    const customUserMatch = (cleanId === 'tanmaya' || cleanId === 'tanmayapany') && u.email?.toLowerCase().includes('tanmaya');

    const passMatch = u.password === cleanPass || 
      (u.email?.toLowerCase() === 'tanmayapany09@gmail.com' && (cleanPass === 'Tanmaya123' || cleanPass === 'user123' || cleanPass.toLowerCase() === 'tanmaya123'));

    return (emailMatch || nameMatch || usernameMatch || customUserMatch) && passMatch;
  });

  if (matched) {
    // If Django backend is online, also inform it (non-blocking)
    try {
      fetch('http://localhost:8000/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: matched.email, password: matched.password, role: matched.role })
      }).catch(() => {});
    } catch (_) {}

    return {
      success: true,
      user: { ...matched }
    };
  }

  // Fallback check against Django API if available
  try {
    const res = await fetch('http://localhost:8000/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: cleanId, password: cleanPass })
    });
    if (res.ok) {
      const data = await res.json();
      if (data && data.status === 'SUCCESS' && data.user) {
        return {
          success: true,
          user: {
            id: data.user.id || `usr-${Date.now()}`,
            fullName: data.user.fullName || cleanId,
            email: data.user.email || cleanId,
            role: data.user.role === 'ADMIN' ? 'ADMIN' : 'USER',
            title: data.user.role === 'ADMIN' ? 'SOC Analyst (Admin)' : 'Enterprise User',
            department: data.user.department || 'Enterprise Staff',
            device: 'Managed Device',
            status: 'ACTIVE',
            avatar: data.user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
          }
        };
      }
    }
  } catch (_) {}

  return {
    success: false,
    error: 'Invalid credentials. Please verify your Email/Username and Password.'
  };
};

export const createNewUser = async (userData) => {
  const users = getStoredUsers();

  // Check if email already exists
  const exists = users.some(u => u.email.toLowerCase() === (userData.email || '').trim().toLowerCase());
  if (exists) {
    throw new Error(`A user with email ${userData.email} already exists.`);
  }

  const newUser = {
    id: `usr-${Date.now()}`,
    fullName: userData.fullName.trim(),
    email: userData.email.trim(),
    password: userData.password,
    role: userData.role || 'USER',
    title: userData.role === 'ADMIN' ? 'SOC Analyst (Admin)' : (userData.title || 'Enterprise User'),
    department: userData.department || 'Operations',
    device: userData.device || `WS-${Math.floor(1000 + Math.random() * 9000)} (192.168.1.${Math.floor(10 + Math.random() * 200)})`,
    status: 'ACTIVE',
    avatar: userData.role === 'ADMIN' 
      ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
      : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19)
  };

  const updatedUsers = [newUser, ...users];
  saveUsers(updatedUsers);

  // Sync to Django API if online
  try {
    fetch('http://localhost:8000/api/v1/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: newUser.fullName,
        email: newUser.email,
        password: newUser.password,
        role: newUser.role,
        department: newUser.department
      })
    }).catch(() => {});
  } catch (_) {}

  return newUser;
};

export const deleteUserById = (userId) => {
  const users = getStoredUsers();
  // Protect default admin from deletion
  const target = users.find(u => u.id === userId);
  if (target && target.email === 'admin@astra.internal') {
    throw new Error('Default SOC Analyst Superadmin cannot be deleted.');
  }
  const filtered = users.filter(u => u.id !== userId);
  saveUsers(filtered);
  return filtered;
};
