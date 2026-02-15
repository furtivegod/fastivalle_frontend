/**
 * Schedule API Service
 */

import { apiRequest } from './api';

/**
 * Fetch all schedule screen data
 */
export const getScheduleData = async () => {
  const res = await apiRequest('/api/schedule', { method: 'GET' });
  if (res.ok && res.data?.data) {
    return res.data.data;
  }
  throw new Error(res.error || 'Failed to load schedule data');
};
