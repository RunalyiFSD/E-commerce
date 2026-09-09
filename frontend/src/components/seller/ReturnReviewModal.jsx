import React, { useState } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import notificationService from '../../services/notificationService';
import { useToast } from '../common/Toast';
import { RotateCcw, CheckCircle, XCircle, IndianRupee } from 'lucide-react';

export function ReturnReviewModal({ isOpen, onClose, order, onReviewProcessed }) {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [action, setAction] = useState('APPROVE'); // 'APPROVE' | 'REJECT'
  const [note, setNote] = useState('');

  if (!order) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await notificationService.processReturn(order._id, { action, note });
      if (action === 'APPROVE') {
        toast.success(`Return approved. Refund of ₹${order.pricing?.total?.toFixed(2)} processed for customer.`);
      } else {
        toast.info('Return request rejected.');
      }
      onReviewProcessed && onReviewProcessed();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to process return decision');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Review Return Request — Order #${order.orderNumber}`}
      description="Merchant Return & Refund Authorization"
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Customer Return Request Summary */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs space-y-2">
          <div className="flex items-center justify-between font-bold text-slate-900 border-b border-slate-200/80 pb-2">
            <span>Customer: {order.customer?.name || order.customer?.email}</span>
            <span className="text-amber-700 font-black">₹{order.pricing?.total?.toFixed(2)}</span>
          </div>

          <div className="text-slate-600">
            <span className="font-semibold text-slate-800">Return Reason: </span>
            <span>{order.timeline?.find((t) => t.status === 'RETURN_REQUESTED')?.message || 'Customer requested return'}</span>
          </div>
        </div>

        {/* Action Selection */}
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-2">
            Authorization Decision
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setAction('APPROVE')}
              className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all text-xs font-bold ${
                action === 'APPROVE'
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-500/20'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <CheckCircle className="w-5 h-5 text-emerald-600" />
              <span>Approve & Refund</span>
            </button>

            <button
              type="button"
              onClick={() => setAction('REJECT')}
              className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all text-xs font-bold ${
                action === 'REJECT'
                  ? 'border-red-500 bg-red-50 text-red-800 ring-2 ring-red-500/20'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <XCircle className="w-5 h-5 text-red-600" />
              <span>Reject Request</span>
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">
            Merchant Resolution Note
          </label>
          <textarea
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            rows={3}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder={
              action === 'APPROVE'
                ? 'Item inspected and verified. Processing refund...'
                : 'Reason for rejecting return request...'
            }
          />
        </div>

        <div className="pt-3 flex justify-end gap-3 border-t border-slate-100">
          <Button variant="outline" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant={action === 'APPROVE' ? 'amber' : 'danger'}
            isLoading={loading}
          >
            {action === 'APPROVE' ? 'Approve & Credit Refund' : 'Reject Return'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default ReturnReviewModal;
