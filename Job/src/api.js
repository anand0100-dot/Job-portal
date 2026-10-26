// Configurable API base URL using Vite environment variables (fallback to localhost:5000)
export const API_BASE = (import.meta.env?.VITE_API_URL || 'http://localhost:5000/api').replace(/\/+$/, '');

const BACKEND_BASE = API_BASE.replace(/\/api\/?$/, '');

// Token and User Local Storage Keys
export const TOKEN_KEY = 'jobportal_token';
export const USER_KEY = 'jobportal_user';

export function getStoredToken() {
  try {
    return localStorage.getItem(TOKEN_KEY) || localStorage.getItem('token') || null;
  } catch {
    return null;
  }
}

export function getStoredUser() {
  try {
    const raw = localStorage.getItem(USER_KEY) || localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveAuthData(user, token) {
  try {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem('token', token);
    }
    if (user) {
      const userStr = JSON.stringify(user);
      localStorage.setItem(USER_KEY, userStr);
      localStorage.setItem('user', userStr);
    }
  } catch (e) {
    console.error('Failed to save auth data in localStorage', e);
  }
}

export function clearAuthData() {
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem('token');
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem('user');
  } catch (e) {
    console.error('Failed to clear auth data from localStorage', e);
  }
}

export async function checkBackendHealth() {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 1500);
    const res = await fetch(`${BACKEND_BASE}/`, { signal: controller.signal });
    clearTimeout(timer);
    return res.ok;
  } catch {
    return false;
  }
}

export async function registerUser({ name, email, password, role = 'jobseeker' }) {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password, role }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const error = new Error(data.message || 'Registration failed');
    error.status = res.status;
    throw error;
  }
  return data;
}

export async function loginUser({ email, password }) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const error = new Error(data.message || 'Login failed');
    error.status = res.status;
    throw error;
  }
  return data;
}

export async function fetchJobs(params = {}) {
  const queryParams = new URLSearchParams();
  if (params.search && params.search.trim()) {
    queryParams.set('search', params.search.trim());
  }
  if (params.location && params.location.trim()) {
    queryParams.set('location', params.location.trim());
  }
  if (params.skills && params.skills.trim()) {
    queryParams.set('skills', params.skills.trim());
  }

  const queryStr = queryParams.toString();
  const url = `${API_BASE}/jobs${queryStr ? `?${queryStr}` : ''}`;
  const res = await fetch(url);
  const data = await res.json().catch(() => []);
  if (!res.ok) {
    const error = new Error(data.message || 'Failed to fetch jobs');
    error.status = res.status;
    throw error;
  }
  return Array.isArray(data) ? data : [];
}

export async function applyJob(jobId, token) {
  if (!token) {
    const error = new Error('Authentication required to apply for jobs');
    error.status = 401;
    throw error;
  }

  const res = await fetch(`${API_BASE}/applications`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ job_id: jobId }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const error = new Error(data.message || 'Failed to submit application');
    error.status = res.status;
    throw error;
  }
  return data;
}

export async function fetchMyApplications(token) {
  if (!token) {
    const error = new Error('Authentication required');
    error.status = 401;
    throw error;
  }

  const res = await fetch(`${API_BASE}/applications/my`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await res.json().catch(() => []);
  if (!res.ok) {
    const error = new Error(data.message || 'Failed to fetch applications');
    error.status = res.status;
    throw error;
  }
  return Array.isArray(data) ? data : [];
}

export async function createJob(jobData, token) {
  if (!token) {
    const error = new Error('Authentication required to post jobs');
    error.status = 401;
    throw error;
  }

  const res = await fetch(`${API_BASE}/jobs`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(jobData),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const error = new Error(data.message || 'Failed to post job');
    error.status = res.status;
    throw error;
  }
  return data;
}
