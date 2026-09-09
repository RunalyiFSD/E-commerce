import API from './api';

export const dashboardService = {
  // Fetch role-scoped dashboard metrics
  getDashboardStats: async () => {
    const response = await API.get('/dashboard/stats');
    return response.data;
  },
};

export default dashboardService;
