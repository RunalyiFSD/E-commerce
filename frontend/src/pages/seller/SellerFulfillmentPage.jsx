import React, { useEffect, useState } from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import OrderCard from '../../components/order/OrderCard';
import FulfillmentModal from '../../components/seller/FulfillmentModal';
import ReturnReviewModal from '../../components/seller/ReturnReviewModal';
import LoadingState from '../../components/common/LoadingState';
import EmptyState from '../../components/common/EmptyState';
import ErrorState from '../../components/common/ErrorState';
import Button from '../../components/common/Button';
import Select from '../../components/common/Select';
import Input from '../../components/common/Input';
import orderService from '../../services/orderService';
import { ALL_STATUSES } from '../../constants/theme';
import { Truck, Search, Filter, RefreshCw, CheckCircle2, RotateCcw } from 'lucide-react';

export function SellerFulfillmentPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Fulfillment & Return Modal State
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);

  const loadOrders = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await orderService.getOrders({
        status: statusFilter || undefined,
        search: searchTerm || undefined,
      });
      setOrders(res.orders || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch seller fulfillment orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadOrders();
  };

  const openFulfillmentModal = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const openReturnReviewModal = (order) => {
    setSelectedOrder(order);
    setIsReturnModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Banner Header */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-amber-600 font-bold text-xs uppercase tracking-wider mb-1">
                <Truck className="w-4 h-4" />
                <span>Seller Dispatch Workspace</span>
              </div>
              <h1 className="text-2xl font-black text-slate-900">
                Fulfillment & Shipment Operations
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Process store orders, assign carrier tracking details, advance lifecycle statuses, and manage deliveries.
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
              icon={<RefreshCw className="w-4 h-4" />}
              onClick={loadOrders}
            >
              Refresh Orders
            </Button>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <form onSubmit={handleSearchSubmit} className="w-full sm:w-80">
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by Order # or Customer..."
              leftIcon={<Search className="w-4 h-4 text-slate-400" />}
            />
          </form>

          <div className="w-full sm:w-64 flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400 shrink-0" />
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={[
                { value: '', label: 'All Lifecycle Statuses' },
                ...ALL_STATUSES.map((st) => ({
                  value: st,
                  label: st.replace(/_/g, ' '),
                })),
              ]}
            />
          </div>
        </div>

        {/* Orders Queue */}
        {loading ? (
          <LoadingState label="Loading seller fulfillment queue..." />
        ) : error ? (
          <ErrorState
            title="Failed to Load Orders"
            message={error}
            onRetry={loadOrders}
          />
        ) : orders.length === 0 ? (
          <EmptyState
            title="No Pending Orders Found"
            message="There are no active orders matching your current filter criteria."
          />
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <OrderCard
                key={order._id}
                order={order}
                role="SELLER"
                actions={
                  order.status === 'RETURN_REQUESTED' ? (
                    <Button
                      variant="amber"
                      size="sm"
                      icon={<RotateCcw className="w-4 h-4" />}
                      onClick={() => openReturnReviewModal(order)}
                    >
                      Review Return Request
                    </Button>
                  ) : (
                    <Button
                      variant="amber"
                      size="sm"
                      icon={<Truck className="w-4 h-4" />}
                      onClick={() => openFulfillmentModal(order)}
                    >
                      Fulfill / Update Status
                    </Button>
                  )
                }
              />
            ))}
          </div>
        )}
      </main>

      {/* Fulfillment Action Modal */}
      <FulfillmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        order={selectedOrder}
        onOrderUpdated={loadOrders}
      />

      {/* Return Review Modal */}
      <ReturnReviewModal
        isOpen={isReturnModalOpen}
        onClose={() => setIsReturnModalOpen(false)}
        order={selectedOrder}
        onReviewProcessed={loadOrders}
      />

      <Footer />
    </div>
  );
}

export default SellerFulfillmentPage;
