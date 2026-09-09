import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Input from '../common/Input';
import Select from '../common/Select';
import { VALID_TRANSITIONS } from '../../constants/theme';
import orderService from '../../services/orderService';
import { useToast } from '../common/Toast';
import { Truck, MapPin, Calendar, Hash, FileText } from 'lucide-react';

export function FulfillmentModal({ isOpen, onClose, order, onOrderUpdated }) {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('STATUS'); // 'STATUS' | 'EVENT'

  // Status update state
  const [nextStatus, setNextStatus] = useState('');
  const [courier, setCourier] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [location, setLocation] = useState('');
  const [estimatedDeliveryDate, setEstimatedDeliveryDate] = useState('');
  const [message, setMessage] = useState('');

  // Allowed transitions
  const allowedNext = order ? VALID_TRANSITIONS[order.status] || [] : [];

  useEffect(() => {
    if (order) {
      setNextStatus(allowedNext[0] || order.status);
      setCourier(order.tracking?.courier || 'E-Commerce Express');
      setTrackingNumber(order.tracking?.trackingNumber || `TRK-${Math.floor(100000 + Math.random() * 900000)}-US`);
      setLocation(order.tracking?.currentLocation || '');
      setEstimatedDeliveryDate(order.tracking?.estimatedDeliveryDate || '3 - 5 Business Days');
      setMessage('');
    }
  }, [order]);

  if (!order) return null;

  const handleStatusSubmit = async (e) => {
    e.preventDefault();
    if (!nextStatus) return;

    setLoading(true);
    try {
      await orderService.updateOrderStatus(order._id, {
        status: nextStatus,
        courier,
        trackingNumber,
        location,
        estimatedDeliveryDate,
        message,
      });

      toast.success(`Order status updated to ${nextStatus.replace(/_/g, ' ')}`);
      onOrderUpdated && onOrderUpdated();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update order status');
    } finally {
      setLoading(false);
    }
  };

  const handleEventSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) {
      toast.error('Please enter a tracking checkpoint note');
      return;
    }

    setLoading(true);
    try {
      await orderService.addTrackingEvent(order._id, {
        message,
        location: location || 'Fulfillment Station',
        source: 'SELLER',
      });

      toast.success('Tracking checkpoint event appended');
      onOrderUpdated && onOrderUpdated();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to append tracking event');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Shipment Fulfillment — Order #${order.orderNumber}`}
      description={`Current Status: ${order.status.replace(/_/g, ' ')}`}
      maxWidth="max-w-xl"
    >
      {/* Mode Tabs */}
      <div className="flex border-b border-slate-200 mb-5">
        <button
          type="button"
          onClick={() => setActiveTab('STATUS')}
          className={`flex-1 py-2 text-xs font-semibold border-b-2 text-center transition-colors ${
            activeTab === 'STATUS'
              ? 'border-amber-500 text-amber-600 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          Advance Order Status
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('EVENT')}
          className={`flex-1 py-2 text-xs font-semibold border-b-2 text-center transition-colors ${
            activeTab === 'EVENT'
              ? 'border-amber-500 text-amber-600 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          Append Checkpoint Note
        </button>
      </div>

      {activeTab === 'STATUS' ? (
        <form onSubmit={handleStatusSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Select Next Status Transition
            </label>
            {allowedNext.length > 0 ? (
              <Select
                value={nextStatus}
                onChange={(e) => setNextStatus(e.target.value)}
                options={allowedNext.map((st) => ({
                  value: st,
                  label: st.replace(/_/g, ' '),
                }))}
              />
            ) : (
              <div className="p-3 bg-amber-50 rounded-lg text-xs text-amber-800 font-medium border border-amber-200">
                This order has reached terminal status ({order.status}). No further state transitions allowed.
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Courier Name"
              leftIcon={<Truck className="w-4 h-4 text-slate-400" />}
              value={courier}
              onChange={(e) => setCourier(e.target.value)}
              placeholder="e.g. E-Commerce Express, FedEx"
            />

            <Input
              label="Tracking Code"
              leftIcon={<Hash className="w-4 h-4 text-slate-400" />}
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              placeholder="e.g. TRK-984210-US"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Current Location"
              leftIcon={<MapPin className="w-4 h-4 text-slate-400" />}
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Sort Facility, Chicago IL"
            />

            <Input
              label="Estimated Delivery ETA"
              leftIcon={<Calendar className="w-4 h-4 text-slate-400" />}
              value={estimatedDeliveryDate}
              onChange={(e) => setEstimatedDeliveryDate(e.target.value)}
              placeholder="e.g. Sept 10, 2026"
            />
          </div>

          <Input
            label="Fulfillment Note (Optional)"
            leftIcon={<FileText className="w-4 h-4 text-slate-400" />}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="e.g. Handed to local sorting agent"
          />

          <div className="pt-3 flex justify-end gap-3 border-t border-slate-100">
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={loading}
              disabled={allowedNext.length === 0}
            >
              Update Order Status
            </Button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleEventSubmit} className="space-y-4">
          <Input
            label="Location Checkpoint"
            leftIcon={<MapPin className="w-4 h-4 text-slate-400" />}
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g. Sorting Center Hub 4, Dallas TX"
          />

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Tracking Checkpoint Note *
            </label>
            <textarea
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Provide scan update or courier checkpoint details..."
              required
            />
          </div>

          <div className="pt-3 flex justify-end gap-3 border-t border-slate-100">
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="amber" isLoading={loading}>
              Append Checkpoint
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}

export default FulfillmentModal;
