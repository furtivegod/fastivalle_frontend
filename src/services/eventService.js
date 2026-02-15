/**
 * Event API Service
 */

import { apiRequest } from './api';

/**
 * Fetch event detail by ID
 */
export const getEventDetail = async (id) => {
  const res = await apiRequest(`/api/events/${id}`, { method: 'GET' });
  if (res.ok && res.data?.data) {
    return res.data.data;
  }
  throw new Error(res.error || 'Failed to load event');
};

/**
 * Fetch ticket types for an event (GetTicketScreen)
 */
export const getEventTicketTypes = async (eventId) => {
  const res = await apiRequest(`/api/events/${eventId}/ticket-types`, { method: 'GET' });
  if (res.ok && res.data?.data) {
    return res.data.data;
  }
  throw new Error(res.error || 'Failed to load ticket types');
};
