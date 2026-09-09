/**
 * Central Theme & System Constants
 */

export const ROLES = {
  ADMIN: 'ADMIN',
  SELLER: 'SELLER',
  CUSTOMER: 'CUSTOMER',
};

export const ORDER_STATUS = {
  PLACED: 'PLACED',
  CONFIRMED: 'CONFIRMED',
  PROCESSING: 'PROCESSING',
  PACKED: 'PACKED',
  SHIPPED: 'SHIPPED',
  IN_TRANSIT: 'IN_TRANSIT',
  OUT_FOR_DELIVERY: 'OUT_FOR_DELIVERY',
  DELIVERED: 'DELIVERED',
  // Exception lifecycles
  CANCELLED: 'CANCELLED',
  DELIVERY_FAILED: 'DELIVERY_FAILED',
  RETURN_REQUESTED: 'RETURN_REQUESTED',
  RETURNED: 'RETURNED',
  REFUND_INITIATED: 'REFUND_INITIATED',
  REFUNDED: 'REFUNDED',
};

export const ORDER_STATUS_CONFIG = {
  [ORDER_STATUS.PLACED]: {
    label: 'Order Placed',
    variant: 'neutral',
    description: 'Order received and awaiting seller confirmation',
    colorClass: 'bg-slate-100 text-slate-700 border-slate-200',
    stepIndex: 0,
  },
  [ORDER_STATUS.CONFIRMED]: {
    label: 'Order Confirmed',
    variant: 'info',
    description: 'Seller confirmed order and preparing items',
    colorClass: 'bg-blue-50 text-blue-700 border-blue-200',
    stepIndex: 1,
  },
  [ORDER_STATUS.PROCESSING]: {
    label: 'Processing',
    variant: 'info',
    description: 'Items are being picked and processed',
    colorClass: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    stepIndex: 2,
  },
  [ORDER_STATUS.PACKED]: {
    label: 'Packed',
    variant: 'amber',
    description: 'Order packed and labeled for courier pickup',
    colorClass: 'bg-amber-50 text-amber-800 border-amber-200',
    stepIndex: 3,
  },
  [ORDER_STATUS.SHIPPED]: {
    label: 'Shipped',
    variant: 'amber',
    description: 'Package handed to courier partner',
    colorClass: 'bg-amber-100 text-amber-900 border-amber-300',
    stepIndex: 4,
  },
  [ORDER_STATUS.IN_TRANSIT]: {
    label: 'In Transit',
    variant: 'info',
    description: 'Package is on its way to destination hub',
    colorClass: 'bg-sky-50 text-sky-800 border-sky-200',
    stepIndex: 5,
  },
  [ORDER_STATUS.OUT_FOR_DELIVERY]: {
    label: 'Out for Delivery',
    variant: 'warning',
    description: 'Courier executive is delivering package today',
    colorClass: 'bg-orange-50 text-orange-800 border-orange-200',
    stepIndex: 6,
  },
  [ORDER_STATUS.DELIVERED]: {
    label: 'Delivered',
    variant: 'success',
    description: 'Package delivered to customer',
    colorClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    stepIndex: 7,
  },
  [ORDER_STATUS.CANCELLED]: {
    label: 'Cancelled',
    variant: 'danger',
    description: 'Order was cancelled',
    colorClass: 'bg-red-50 text-red-700 border-red-200',
    stepIndex: -1,
  },
  [ORDER_STATUS.DELIVERY_FAILED]: {
    label: 'Delivery Failed',
    variant: 'danger',
    description: 'Delivery attempt failed or address unreachable',
    colorClass: 'bg-rose-50 text-rose-800 border-rose-200',
    stepIndex: -1,
  },
  [ORDER_STATUS.RETURN_REQUESTED]: {
    label: 'Return Requested',
    variant: 'warning',
    description: 'Customer submitted return request',
    colorClass: 'bg-purple-50 text-purple-800 border-purple-200',
    stepIndex: -1,
  },
  [ORDER_STATUS.RETURNED]: {
    label: 'Returned',
    variant: 'neutral',
    description: 'Item received back at seller warehouse',
    colorClass: 'bg-slate-100 text-slate-800 border-slate-300',
    stepIndex: -1,
  },
  [ORDER_STATUS.REFUND_INITIATED]: {
    label: 'Refund Initiated',
    variant: 'warning',
    description: 'Refund processing with payment gateway',
    colorClass: 'bg-amber-50 text-amber-800 border-amber-200',
    stepIndex: -1,
  },
  [ORDER_STATUS.REFUNDED]: {
    label: 'Refunded',
    variant: 'success',
    description: 'Amount credited back to original payment method',
    colorClass: 'bg-teal-50 text-teal-800 border-teal-200',
    stepIndex: -1,
  },
};

export const NORMAL_TRACKING_STEPS = [
  ORDER_STATUS.PLACED,
  ORDER_STATUS.CONFIRMED,
  ORDER_STATUS.PROCESSING,
  ORDER_STATUS.PACKED,
  ORDER_STATUS.SHIPPED,
  ORDER_STATUS.IN_TRANSIT,
  ORDER_STATUS.OUT_FOR_DELIVERY,
  ORDER_STATUS.DELIVERED,
];

export const ALL_STATUSES = Object.keys(ORDER_STATUS);

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
  RETURN_REQUESTED: ['RETURNED', 'DELIVERED'],
  RETURNED: ['REFUND_INITIATED'],
  REFUND_INITIATED: ['REFUNDED'],
  REFUNDED: [],
};

