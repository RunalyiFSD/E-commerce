import React, { useState } from 'react';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import Badge from '../components/common/Badge';
import Card from '../components/common/Card';
import Modal from '../components/common/Modal';
import Table from '../components/common/Table';
import ToastProvider, { useToast } from '../components/common/Toast';
import LoadingState, { Skeleton } from '../components/common/LoadingState';
import EmptyState from '../components/common/EmptyState';
import ErrorState from '../components/common/ErrorState';
import ProductCard from '../components/product/ProductCard';
import OrderStatusBadge from '../components/order/OrderStatusBadge';
import OrderCard from '../components/order/OrderCard';
import TrackingTimeline from '../components/tracking/TrackingTimeline';
import DashboardLayout from '../layouts/DashboardLayout';
import { Search, Mail, Lock, ShoppingCart, Plus, CheckCircle, Trash2, ExternalLink } from 'lucide-react';
import { useCart } from '../context/CartContext';

function ShowcaseContent() {
  const { addToast } = useToast();
  const { addToCart } = useCart();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [role, setRole] = useState('CUSTOMER');

  const demoColumns = [
    { header: 'Order ID', key: 'id', render: (row) => <span className="font-bold text-slate-800">{row.id}</span> },
    { header: 'Customer', key: 'customer' },
    { header: 'Status', key: 'status', render: (row) => <OrderStatusBadge status={row.status} size="sm" /> },
    { header: 'Amount', key: 'amount', render: (row) => <span className="font-mono font-semibold">₹{row.amount}</span> },
  ];

  const demoTableData = [
    { id: 'ORD-9021', customer: 'Sarah Connor', status: 'SHIPPED', amount: '129.99' },
    { id: 'ORD-9022', customer: 'John Doe', status: 'DELIVERED', amount: '249.50' },
    { id: 'ORD-9023', customer: 'Ellen Ripley', status: 'OUT_FOR_DELIVERY', amount: '89.00' },
    { id: 'ORD-9024', customer: 'Bruce Wayne', status: 'CANCELLED', amount: '1,200.00' },
  ];

  return (
    <div className="space-y-10 pb-12">
      {/* Page Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-extrabold text-amber-500 tracking-wider">Design System & Library</span>
          <h1 className="text-2xl font-black text-slate-900 mt-1">Reusable Component Showcase</h1>
          <p className="text-xs text-slate-500 mt-1">
            Enterprise design tokens, buttons, inputs, tables, product cards, order status badges, and tracking timelines.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <label className="text-xs font-semibold text-slate-700">Preview Role:</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="bg-slate-100 border border-slate-300 rounded-lg text-xs font-bold px-3 py-1.5 focus:outline-none"
          >
            <option value="CUSTOMER">CUSTOMER</option>
            <option value="SELLER">SELLER</option>
            <option value="ADMIN">ADMIN</option>
          </select>
        </div>
      </div>

      {/* Buttons & Badges */}
      <section className="space-y-4">
        <h2 className="text-sm uppercase font-extrabold text-slate-400 tracking-wider">1. Buttons & Badges</h2>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="amber">Amber Primary</Button>
            <Button variant="primary">E-Commerce Blue</Button>
            <Button variant="orange">Orange Action</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="danger">Danger</Button>
            <Button variant="amber" isLoading>Loading</Button>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
            <Badge variant="neutral">Neutral</Badge>
            <Badge variant="info" showDot>Info</Badge>
            <Badge variant="success" showDot>Success</Badge>
            <Badge variant="warning" showDot>Warning</Badge>
            <Badge variant="amber" showDot>Amber</Badge>
            <Badge variant="danger" showDot>Danger</Badge>
            <Badge variant="purple">Purple</Badge>
          </div>
        </div>
      </section>

      {/* Form Controls */}
      <section className="space-y-4">
        <h2 className="text-sm uppercase font-extrabold text-slate-400 tracking-wider">2. Form Controls</h2>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="Email Address"
            placeholder="user@example.com"
            leftIcon={<Mail className="w-4 h-4" />}
            helperText="We'll send order updates here."
          />
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            leftIcon={<Lock className="w-4 h-4" />}
          />
          <Select
            label="Shipping Country"
            options={[
              { value: 'us', label: 'United States' },
              { value: 'ca', label: 'Canada' },
              { value: 'uk', label: 'United Kingdom' },
            ]}
          />
        </div>
      </section>

      {/* Feedback & Toasts */}
      <section className="space-y-4">
        <h2 className="text-sm uppercase font-extrabold text-slate-400 tracking-wider">3. Notifications & Feedback</h2>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 flex flex-wrap gap-3">
          <Button variant="outline" size="sm" onClick={() => addToast({ message: 'Item added to cart successfully!', type: 'success' })}>
            Trigger Success Toast
          </Button>
          <Button variant="outline" size="sm" onClick={() => addToast({ message: 'Failed to update order status.', type: 'error' })}>
            Trigger Error Toast
          </Button>
          <Button variant="outline" size="sm" onClick={() => setIsModalOpen(true)}>
            Open Dialog Modal
          </Button>
        </div>
      </section>

      {/* Data Table */}
      <section className="space-y-4">
        <h2 className="text-sm uppercase font-extrabold text-slate-400 tracking-wider">4. Data Table</h2>
        <Table columns={demoColumns} data={demoTableData} />
      </section>

      {/* Order Status Badges */}
      <section className="space-y-4">
        <h2 className="text-sm uppercase font-extrabold text-slate-400 tracking-wider">5. Order Status Badges (14 States)</h2>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 flex flex-wrap gap-2">
          <OrderStatusBadge status="PLACED" />
          <OrderStatusBadge status="CONFIRMED" />
          <OrderStatusBadge status="PROCESSING" />
          <OrderStatusBadge status="PACKED" />
          <OrderStatusBadge status="SHIPPED" />
          <OrderStatusBadge status="IN_TRANSIT" />
          <OrderStatusBadge status="OUT_FOR_DELIVERY" />
          <OrderStatusBadge status="DELIVERED" />
          <OrderStatusBadge status="CANCELLED" />
          <OrderStatusBadge status="DELIVERY_FAILED" />
          <OrderStatusBadge status="RETURN_REQUESTED" />
          <OrderStatusBadge status="RETURNED" />
          <OrderStatusBadge status="REFUND_INITIATED" />
          <OrderStatusBadge status="REFUNDED" />
        </div>
      </section>

      {/* Domain Component Grid */}
      <section className="space-y-4">
        <h2 className="text-sm uppercase font-extrabold text-slate-400 tracking-wider">6. Product Card</h2>
        <div className="max-w-xs">
          <ProductCard
            onAddToCart={(p) => {
              addToCart(p);
              addToast({ message: `Added ${p.name} to cart`, type: 'success' });
            }}
          />
        </div>
      </section>

      {/* Unified Order Card */}
      <section className="space-y-4">
        <h2 className="text-sm uppercase font-extrabold text-slate-400 tracking-wider">7. Unified Order Card with Role Actions</h2>
        <OrderCard
          role={role}
          onTrackOrder={() => addToast({ message: 'Opening tracking view...', type: 'info' })}
          actionsSlot={
            role === 'SELLER' ? (
              <Button variant="primary" size="sm">Fulfill Shipment</Button>
            ) : role === 'ADMIN' ? (
              <Button variant="danger" size="sm">Audit Order</Button>
            ) : null
          }
        />
      </section>

      {/* Tracking Timeline */}
      <section className="space-y-4">
        <h2 className="text-sm uppercase font-extrabold text-slate-400 tracking-wider">8. Historical Tracking Timeline</h2>
        <TrackingTimeline />
      </section>

      {/* Modal Dialog */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Confirm Order Cancellation"
        description="Are you sure you want to cancel order AMZ-2026-9921?"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" size="sm" onClick={() => { setIsModalOpen(false); addToast({ message: 'Order cancelled', type: 'error' }); }}>
              Confirm Cancellation
            </Button>
          </>
        }
      >
        <p className="text-xs text-slate-600 leading-relaxed">
          Cancelling this order will release the inventory back to the seller and initiate a full refund.
        </p>
      </Modal>
    </div>
  );
}

export function DesignSystemShowcase() {
  return (
    <ToastProvider>
      <DashboardLayout user={{ name: 'Demo User', role: 'CUSTOMER' }} cartCount={2}>
        <ShowcaseContent />
      </DashboardLayout>
    </ToastProvider>
  );
}

export default DesignSystemShowcase;
