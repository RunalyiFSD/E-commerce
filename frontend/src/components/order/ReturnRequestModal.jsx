import React, { useState } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Select from '../common/Select';
import notificationService from '../../services/notificationService';
import { useToast } from '../common/Toast';
import { formatCurrency } from '../../utils/formatCurrency';
import { RotateCcw, AlertCircle } from 'lucide-react';

export function ReturnRequestModal({ isOpen, onClose, order, onReturnSubmitted }) {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [reason, setReason] = useState('Item damaged or defective');
  const [comment, setComment] = useState('');

  if (!order) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reason) {
      toast.error('Please select a return reason');
      return;
    }

    setLoading(true);
    try {
      await notificationService.requestReturn(order._id, { reason, comment });
      toast.success('Return request submitted successfully. Support team will review shortly.');
      onReturnSubmitted && onReturnSubmitted();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit return request');
    } finally {
      setLoading(false);
    }
  };

  const returnReasons = [
    { value: 'Item damaged or defective', label: 'Item damaged or defective' },
    { value: 'Wrong item delivered', label: 'Wrong item delivered' },
    { value: 'Item not as described', label: 'Item not as described' },
    { value: 'Size or fit issue', label: 'Size or fit issue' },
    { value: 'No longer needed / Changed mind', label: 'No longer needed / Changed mind' },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Request Return — Order #${order.orderNumber}`}
      description="Eligible for 30-day return & refund policy"
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 flex items-start gap-2 text-xs text-amber-900">
          <RotateCcw className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <span>
            Once submitted, your return request will be reviewed by the merchant. Approved returns receive a full refund of <strong>{formatCurrency(order.pricing?.total || 0)}</strong>.
          </span>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">
            Reason for Return *
          </label>
          <Select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            options={returnReasons}
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">
            Additional Comments / Details
          </label>
          <textarea
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Provide specific details about the issue..."
          />
        </div>

        <div className="pt-3 flex justify-end gap-3 border-t border-slate-100">
          <Button variant="outline" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="amber" isLoading={loading}>
            Submit Return Request
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default ReturnRequestModal;
