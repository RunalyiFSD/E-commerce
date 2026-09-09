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
    const response = await API.get(`/orders/track-lookup/${encodeURIComponent(query)}`);
    return response.data;
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
