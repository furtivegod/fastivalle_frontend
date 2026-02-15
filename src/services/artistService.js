/**
 * Artist API Service
 */

import { apiRequest } from './api';

/**
 * Fetch artists list, optionally filtered by search
 */
export const getArtists = async (search = '') => {
  const params = search.trim() ? `?search=${encodeURIComponent(search.trim())}` : '';
  const res = await apiRequest(`/api/artists${params}`, { method: 'GET' });
  if (res.ok && res.data?.data !== undefined) {
    return res.data.data;
  }
  throw new Error(res.error || 'Failed to load artists');
};

/**
 * Fetch artist detail by ID
 */
export const getArtistDetail = async (id) => {
  const res = await apiRequest(`/api/artists/${id}`, { method: 'GET' });
  if (res.ok && res.data?.data) {
    return res.data.data;
  }
  throw new Error(res.error || 'Failed to load artist');
};
