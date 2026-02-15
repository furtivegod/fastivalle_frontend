/**
 * Ticket API Service
 */

import { apiRequest } from './api';

/**
 * Fetch user's tickets (requires auth)
 */
export const getMyTickets = async () => {
  const res = await apiRequest('/api/tickets', { method: 'GET' });
  if (res.ok && res.data?.data !== undefined) {
    return res.data.data;
  }
  throw new Error(res.error || 'Failed to load tickets');
};
