import API from './api';

export const notificationService = {
  // Get user notifications
  getNotifications: async () => {
    const response = await API.get('/notifications');
    return response.data;
  },

  // Mark single notification as read
  markAsRead: async (id) => {
    const response = await API.patch(`/notifications/${id}/read`);
    return response.data;
  },

  // Mark all notifications as read
  markAllAsRead: async () => {
    const response = await API.patch('/notifications/read-all');
    return response.data;
  },

  // Request order return (Customer)
  requestReturn: async (orderId, returnData) => {
    const response = await API.post(`/orders/${orderId}/return`, returnData);
    return response.data;
  },

  // Process order return review (Seller / Admin)
  processReturn: async (orderId, processData) => {
    const response = await API.patch(`/orders/${orderId}/return`, processData);
    return response.data;
  },
};

export default notificationService;
