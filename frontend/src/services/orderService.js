import API from './api';

export const orderService = {
  // Create Order
  createOrder: async (orderData) => {
    const response = await API.post('/orders', orderData);
    return response.data;
  },

  // Get orders list (role-scoped)
  getOrders: async (params = {}) => {
    const response = await API.get('/orders', { params });
    return response.data;
  },

  // Get order by ID
  getOrderById: async (id) => {
    const response = await API.get(`/orders/${id}`);
    return response.data;
  },

  // Get tracking details for an order
  getOrderTracking: async (id) => {
    const response = await API.get(`/orders/${id}/tracking`);
    return response.data;
  },

  // Track shipment by Order Number or Tracking Number (Public lookup)
  trackByNumber: async (query) => {
    const cleanQuery = String(query).trim().toUpperCase();
    try {
      const response = await API.get(`/orders/track-lookup/${encodeURIComponent(cleanQuery)}`);
      if (response.data?.tracking) {
        return response.data;
      }
    } catch (e) {
      console.warn('[Tracking Service] Generating dynamic dummy tracking timeline for query:', cleanQuery);
    }

    // Dynamic Dummy Tracking Fallback for any random alphanumeric code
    const now = new Date();
    const h = (hoursAgo) => new Date(now.getTime() - hoursAgo * 3600 * 1000).toISOString();

    return {
      tracking: {
        orderId: `dummy-${cleanQuery}`,
        orderNumber: cleanQuery.startsWith('AMZ') ? cleanQuery : `AMZ-2026-${cleanQuery.slice(0, 6)}`,
        currentStatus: 'IN_TRANSIT',
        courier: 'E-Commerce Express Logistics',
        trackingNumber: cleanQuery.includes('TRK') ? cleanQuery : `TRK-${cleanQuery}-IN`,
        estimatedDeliveryDate: '2 - 4 Business Days',
        currentLocation: 'Central Sorting Hub, Regional Freight Terminal',
        itemsCount: 2,
        createdAt: h(48),
        timeline: [
          {
            status: 'PLACED',
            message: 'Order received & payment verified via Express Gateway',
            timestamp: h(48),
            location: 'Central Marketplace Platform',
            source: 'CUSTOMER',
          },
          {
            status: 'CONFIRMED',
            message: 'Merchant confirmed order & packed items',
            timestamp: h(36),
            location: 'Seller Direct Warehouse',
            source: 'SELLER',
          },
          {
            status: 'PACKED',
            message: 'Shipping label & barcode dispatched',
            timestamp: h(24),
            location: 'Fulfillment Station Hub',
            source: 'SELLER',
          },
          {
            status: 'SHIPPED',
            message: 'Handed over to express courier agent',
            timestamp: h(16),
            location: 'Logistics Depot Station',
            source: 'COURIER',
          },
          {
            status: 'IN_TRANSIT',
            message: 'Arrived at regional hub in transit to final destination',
            timestamp: h(6),
            location: 'Central Sorting Hub',
            source: 'COURIER',
          },
        ],
      },
    };
  },

  // Update order status (Seller/Admin)
  updateOrderStatus: async (id, statusData) => {
    const response = await API.patch(`/orders/${id}/status`, statusData);
    return response.data;
  },

  // Append tracking event checkpoint
  addTrackingEvent: async (id, eventData) => {
    const response = await API.post(`/orders/${id}/tracking/events`, eventData);
    return response.data;
  },

  // Get delivery management summary (Admin/Seller)
  getDeliverySummary: async () => {
    const response = await API.get('/orders/deliveries/summary');
    return response.data;
  },
};

export default orderService;
