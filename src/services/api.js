/**
 * API client for Fastivalle backend.
 * Uses fetch with optional Bearer token from AsyncStorage.
 */

import { API_BASE_URL } from '../config/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AUTH_TOKEN_KEY = '@fastivalle_auth_token';

export const getStoredToken = async () => {
  try {
    return await AsyncStorage.getItem(AUTH_TOKEN_KEY);
  } catch (e) {
    return null;
  }
};

export const setStoredToken = async (token) => {
  try {
    if (token) {
      await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
    } else {
      await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
    }
  } catch (e) {
    console.warn('Failed to store auth token', e);
  }
};

/**
 * Request to API with optional auth header from stored token.
 * @param {string} path - Path without base URL (e.g. '/api/auth/login')
 * @param {RequestInit} options - fetch options (method, body, headers, etc.)
 * @returns {Promise<{ data?: any, error?: string, status: number }>}
 */
export const apiRequest = async (path, options = {}) => {
  const url = `${API_BASE_URL.replace(/\/$/, '')}${path.startsWith('/') ? path : `/${path}`}`;
  const token = await getStoredToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const res = await fetch(url, {
      ...options,
      headers,
    });
    const text = await res.text();
    let data;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = null;
    }

    if (!res.ok) {
      const message = data?.error || data?.message || `Request failed (${res.status})`;
      return { ok: false, status: res.status, error: message, data };
    }
    return { ok: true, status: res.status, data };
  } catch (err) {
    const message = err.message || 'Network error';
    return { ok: false, status: 0, error: message };
  }
};
