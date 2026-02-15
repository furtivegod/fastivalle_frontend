/**
 * Home API Service
 */

import { apiRequest } from './api';

/**
 * Fetch all home screen data
 */
export const getHomeData = async () => {
  const res = await apiRequest('/api/home', { method: 'GET' });
  if (res.ok && res.data?.data) {
    return res.data.data;
  }
  throw new Error(res.error || 'Failed to load home data');
};
