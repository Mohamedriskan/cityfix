import { api, setToken, clearToken } from './api';

const USERS_KEY = 'users';
const CURRENT_USER_KEY = 'current_user';

const toFrontendRole = (role) => {
  const r = (role || '').toLowerCase();
  if (r === 'citizen') return 'citizen';
  if (r === 'officer') return 'officer';
  if (r === 'admin') return 'admin';
  return 'citizen';
};

const enrichWithMock = (user) => {
  const role = toFrontendRole(user.role || user.backendRole);
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone || '',
    role,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.name || 'User')}`,
    registeredDate: user.registeredDate || new Date().toISOString().split('T')[0],
    status: 'Active',
    address: user.address || '',
  };
};

export const authService = {
  async login(email, password) {
    const data = await api.post('/auth/login', { email, password });
    const backendUser = data.user;
    const user = enrichWithMock({
      ...backendUser,
      backendRole: backendUser.role,
    });
    setToken(data.token);
    storageSet(user);
    return user;
  },

  async register(userData) {
    const data = await api.post('/auth/register', {
      name: userData.fullName,
      email: userData.email,
      phone: userData.phone,
      password: userData.password,
    });

    const user = enrichWithMock({
      id: Date.now(),
      name: userData.fullName,
      email: userData.email,
      phone: userData.phone,
      backendRole: 'Citizen',
      address: userData.address,
    });

    storageSet(user);
    return user;
  },

  getCurrentUser() {
    return storageGet();
  },

  async logout() {
    clearToken();
    storageRemove();
    return true;
  },

  async updateProfile(updatedData) {
    const currentUser = storageGet();
    if (!currentUser) {
      throw new Error('Not authenticated');
    }
    const updated = { ...currentUser, ...updatedData };
    storageSet(updated);
    return updated;
  }
};

const storageGet = () => {
  try {
    const raw = localStorage.getItem('cityfix_' + CURRENT_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
};

const storageSet = (user) => {
  try {
    localStorage.setItem('cityfix_' + CURRENT_USER_KEY, JSON.stringify(user));
  } catch (e) {
    console.error('Error storing user:', e);
  }
};

const storageRemove = () => {
  try {
    localStorage.removeItem('cityfix_' + CURRENT_USER_KEY);
  } catch (e) {
    console.error('Error removing user:', e);
  }
};
