/**
 * Order API Service
 */

import { apiRequest } from './api';

/**
 * Create order (requires auth)
 * @param {Object} body - { eventId, items: [{ ticketTypeId, quantity, unitPrice, category, ticketTypeName }], totalAmount, currency?, paymentMethod? }
 */
export const createOrder = async (body) => {
  const res = await apiRequest('/api/orders', {
    method: 'POST',
    body: JSON.stringify(body),
  });
  if (res.ok && res.data?.data) {
    return res.data.data;
  }
  throw new Error(res.error || 'Failed to create order');
};

/**
 * Fetch order detail by ID (requires auth)
 */
export const getOrderDetail = async (orderId) => {
  const res = await apiRequest(`/api/orders/${orderId}`, { method: 'GET' });
  if (res.ok && res.data?.data) {
    return res.data.data;
  }
  throw new Error(res.error || 'Failed to load order');
};
