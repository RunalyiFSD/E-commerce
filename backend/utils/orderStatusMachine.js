export const ORDER_STATUS = {
  PLACED: 'PLACED',
  CONFIRMED: 'CONFIRMED',
  PROCESSING: 'PROCESSING',
  PACKED: 'PACKED',
  SHIPPED: 'SHIPPED',
  IN_TRANSIT: 'IN_TRANSIT',
  OUT_FOR_DELIVERY: 'OUT_FOR_DELIVERY',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED',
  DELIVERY_FAILED: 'DELIVERY_FAILED',
  RETURN_REQUESTED: 'RETURN_REQUESTED',
  RETURNED: 'RETURNED',
  REFUND_INITIATED: 'REFUND_INITIATED',
  REFUNDED: 'REFUNDED',
};

// Central Status Constants
export const ALL_STATUSES = [
  'PLACED',
  'CONFIRMED',
  'PROCESSING',
  'PACKED',
  'SHIPPED',
  'IN_TRANSIT',
  'OUT_FOR_DELIVERY',
  'DELIVERED',
  'CANCELLED',
  'DELIVERY_FAILED',
  'RETURN_REQUESTED',
  'RETURNED',
  'REFUND_INITIATED',
  'REFUNDED',
];

// Valid Transition Graph (Rule 9 Enforcement)
export const VALID_TRANSITIONS = {
  PLACED: ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['PROCESSING', 'CANCELLED'],
  PROCESSING: ['PACKED', 'CANCELLED'],
  PACKED: ['SHIPPED', 'CANCELLED'],
  SHIPPED: ['IN_TRANSIT', 'DELIVERY_FAILED'],
  IN_TRANSIT: ['OUT_FOR_DELIVERY', 'DELIVERY_FAILED'],
  OUT_FOR_DELIVERY: ['DELIVERED', 'DELIVERY_FAILED'],
  DELIVERED: ['RETURN_REQUESTED'],
  CANCELLED: [],
  DELIVERY_FAILED: ['SHIPPED', 'RETURNED'],
  RETURN_REQUESTED: ['RETURNED', 'DELIVERED'], // Approved vs Rejected
  RETURNED: ['REFUND_INITIATED'],
  REFUND_INITIATED: ['REFUNDED'],
  REFUNDED: [],
};

/**
 * Validate if a status transition is permitted
 * @param {string} currentStatus
 * @param {string} nextStatus
 * @returns {boolean}
 */
export function isValidTransition(currentStatus, nextStatus) {
  if (!currentStatus || !nextStatus) return false;
  if (currentStatus === nextStatus) return true; // Idempotent same-status update

  const allowedNextStates = VALID_TRANSITIONS[currentStatus] || [];
  return allowedNextStates.includes(nextStatus);
}
