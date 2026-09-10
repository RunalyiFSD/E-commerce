import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import CustomerDashboard from '../../components/dashboard/CustomerDashboard';
import SellerDashboard from '../../components/dashboard/SellerDashboard';
import AdminDashboard from '../../components/dashboard/AdminDashboard';
import LoadingState from '../../components/common/LoadingState';
import ErrorState from '../../components/common/ErrorState';
import { useAuth } from '../../context/AuthContext';
import dashboardService from '../../services/dashboardService';

export function DashboardPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dashboardData, setDashboardData] = useState(null);

  const loadStats = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await dashboardService.getDashboardStats();
      setDashboardData(res);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const renderRoleDashboard = () => {
    if (!dashboardData) return null;

    const userRole = user?.role?.toUpperCase();

    switch (userRole) {
      case 'ADMIN':
        return <AdminDashboard data={dashboardData} onRefresh={loadStats} />;
      case 'SELLER':
        return <SellerDashboard data={dashboardData} onRefresh={loadStats} />;
      case 'CUSTOMER':
      default:
        return <CustomerDashboard data={dashboardData} onRefresh={loadStats} />;
    }
  };

  return (
    <DashboardLayout user={user}>
      {loading ? (
        <LoadingState label="Loading role dashboard metrics & analytics..." />
      ) : error ? (
        <ErrorState
          title="Dashboard Error"
          message={error}
          onRetry={loadStats}
        />
      ) : (
        renderRoleDashboard()
      )}
    </DashboardLayout>
  );
}

export default DashboardPage;
