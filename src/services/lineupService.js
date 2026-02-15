/**
 * Lineup API Service
 */

import { apiRequest } from './api';

/**
 * Fetch user's lineups (requires auth)
 */
export const getMyLineups = async () => {
  const res = await apiRequest('/api/lineup', { method: 'GET' });
  if (res.ok && res.data?.data !== undefined) {
    return res.data.data;
  }
  throw new Error(res.error || 'Failed to load lineup');
};
