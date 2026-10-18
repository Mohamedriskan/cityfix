/**
 * API client for the CityFix backend.
 * Handles fetch, auth token injection, and error normalization.
 */

const API_BASE = '/api';

const getToken = () => {
  try {
    const raw = localStorage.getItem('cityfix_api_token');
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
};

export const setToken = (token) => {
  try {
    localStorage.setItem('cityfix_api_token', JSON.stringify(token));
  } catch (e) {
    console.error('Error storing token:', e);
  }
};

export const clearToken = () => {
  try {
    localStorage.removeItem('cityfix_api_token');
  } catch (e) {
    console.error('Error clearing token:', e);
  }
};

const authHeaders = () => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const apiRequest = async (path, { method = 'GET', body = null, headers = {}, isFormData = false } = {}) => {
  const requestHeaders = {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...authHeaders(),
    ...headers,
  };

  let payload = body;
  if (body && !isFormData) {
    payload = JSON.stringify(body);
  }

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: requestHeaders,
    body: payload ? payload : undefined,
  });

  let data = null;
  try {
    data = await res.json();
  } catch (e) {
    data = {};
  }

  if (!res.ok) {
    const error = new Error(data.message || data.error || 'Request failed');
    error.status = res.status;
    error.data = data;
    throw error;
  }

  return data;
};

export const api = {
  get: (path, headers = {}) => apiRequest(path, { method: 'GET', headers }),
  post: (path, body, headers = {}, isFormData = false) => apiRequest(path, { method: 'POST', body, headers, isFormData }),
  put: (path, body, headers = {}, isFormData = false) => apiRequest(path, { method: 'PUT', body, headers, isFormData }),
  patch: (path, body, headers = {}) => apiRequest(path, { method: 'PATCH', body, headers }),
  delete: (path, headers = {}) => apiRequest(path, { method: 'DELETE', headers }),
};
