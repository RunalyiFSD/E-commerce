import React, { useEffect, useState } from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import OrderCard from '../../components/order/OrderCard';
import FulfillmentModal from '../../components/seller/FulfillmentModal';
import LoadingState from '../../components/common/LoadingState';
import EmptyState from '../../components/common/EmptyState';
import ErrorState from '../../components/common/ErrorState';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import orderService from '../../services/orderService';
import { ShieldCheck, Truck, AlertTriangle, CheckCircle, Clock, RefreshCw } from 'lucide-react';

export function AdminDeliveryManagementPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [summaryData, setSummaryData] = useState(null);
  const [activeTab, setActiveTab] = useState('ACTIVE'); // 'ACTIVE' | 'EXCEPTIONS' | 'DELIVERED'

  // Fulfillment Modal State
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadDeliverySummary = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await orderService.getDeliverySummary();
      setSummaryData(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch platform delivery status');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDeliverySummary();
  }, []);

  const openModalForOrder = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-16 w-full">
          <LoadingState label="Analyzing global platform logistics & delivery status..." />
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !summaryData) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-16 w-full">
          <ErrorState
            title="Logistics Monitoring Error"
            message={error || 'Unable to load delivery control tower data.'}
            onRetry={loadDeliverySummary}
          />
        </div>
        <Footer />
      </div>
    );
  }

  const { summary, activeDeliveries = [], exceptionDeliveries = [], delivered = [] } = summaryData;

  const currentList =
    activeTab === 'ACTIVE'
      ? activeDeliveries
      : activeTab === 'EXCEPTIONS'
      ? exceptionDeliveries
      : delivered;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Admin Header */}
        <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-lg mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider mb-1">
                <ShieldCheck className="w-4 h-4" />
                <span>Admin Logistics Control Tower</span>
              </div>
              <h1 className="text-2xl font-black">Global Delivery & Shipment Operations</h1>
              <p className="text-xs text-slate-300 mt-1">
                Platform-wide oversight for active dispatches, delayed shipments, carrier exceptions, and delivery confirmations.
              </p>
            </div>

            <Button
              variant="amber"
              size="sm"
              icon={<RefreshCw className="w-4 h-4" />}
              onClick={loadDeliverySummary}
            >
              Refresh Realtime Data
            </Button>
          </div>
        </div>

        {/* Summary Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div
            onClick={() => setActiveTab('ACTIVE')}
            className={`cursor-pointer bg-white border rounded-2xl p-5 shadow-xs transition-all ${
              activeTab === 'ACTIVE' ? 'ring-2 ring-amber-500 border-amber-500' : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase">Active Shipments</span>
              <Truck className="w-5 h-5 text-amber-500" />
            </div>
            <p className="text-3xl font-black text-slate-900">{summary?.totalActive || 0}</p>
            <p className="text-[11px] text-slate-500 mt-1">In fulfillment & carrier transit</p>
          </div>

          <div
            onClick={() => setActiveTab('EXCEPTIONS')}
            className={`cursor-pointer bg-white border rounded-2xl p-5 shadow-xs transition-all ${
              activeTab === 'EXCEPTIONS' ? 'ring-2 ring-red-500 border-red-500' : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase">Delivery Exceptions</span>
              <AlertTriangle className="w-5 h-5 text-red-500" />
            </div>
            <p className="text-3xl font-black text-red-600">{summary?.totalExceptions || 0}</p>
            <p className="text-[11px] text-slate-500 mt-1">Failed attempts or cancelled dispatches</p>
          </div>

          <div
            onClick={() => setActiveTab('DELIVERED')}
            className={`cursor-pointer bg-white border rounded-2xl p-5 shadow-xs transition-all ${
              activeTab === 'DELIVERED' ? 'ring-2 ring-emerald-500 border-emerald-500' : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase">Completed Deliveries</span>
              <CheckCircle className="w-5 h-5 text-emerald-500" />
            </div>
            <p className="text-3xl font-black text-emerald-700">{summary?.totalDelivered || 0}</p>
            <p className="text-[11px] text-slate-500 mt-1">Successfully delivered packages</p>
          </div>
        </div>

        {/* Tab Filters */}
        <div className="flex border-b border-slate-200 mb-6">
          <button
            onClick={() => setActiveTab('ACTIVE')}
            className={`py-3 px-6 text-xs font-bold border-b-2 transition-colors ${
              activeTab === 'ACTIVE'
                ? 'border-amber-500 text-amber-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Active Dispatches ({activeDeliveries.length})
          </button>
          <button
            onClick={() => setActiveTab('EXCEPTIONS')}
            className={`py-3 px-6 text-xs font-bold border-b-2 transition-colors ${
              activeTab === 'EXCEPTIONS'
                ? 'border-red-500 text-red-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Exceptions & Issues ({exceptionDeliveries.length})
          </button>
          <button
            onClick={() => setActiveTab('DELIVERED')}
            className={`py-3 px-6 text-xs font-bold border-b-2 transition-colors ${
              activeTab === 'DELIVERED'
                ? 'border-emerald-500 text-emerald-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Delivered ({delivered.length})
          </button>
        </div>

        {/* Orders Queue */}
        {currentList.length === 0 ? (
          <EmptyState
            title="No Orders in This Logistics Category"
            message="There are currently no orders under the selected delivery state tab."
          />
        ) : (
          <div className="space-y-4">
            {currentList.map((order) => (
              <OrderCard
                key={order._id}
                order={order}
                role="ADMIN"
                actions={
                  <Button
                    variant="amber"
                    size="sm"
                    icon={<Truck className="w-4 h-4" />}
                    onClick={() => openModalForOrder(order)}
                  >
                    Admin Status Override
                  </Button>
                }
              />
            ))}
          </div>
        )}
      </main>

      {/* Fulfillment Modal for Admin */}
      <FulfillmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        order={selectedOrder}
        onOrderUpdated={loadDeliverySummary}
      />

      <Footer />
    </div>
  );
}

export default AdminDeliveryManagementPage;
