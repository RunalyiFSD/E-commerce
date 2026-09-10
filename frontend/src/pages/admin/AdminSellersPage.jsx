import React, { useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Table from '../../components/common/Table';
import Toast from '../../components/common/Toast';
import { Store, CheckCircle, XCircle, Clock, ShieldCheck, Mail, Building } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export function AdminSellersPage() {
  const { user } = useAuth();
  const [toast, setToast] = useState({ type: '', text: '' });
  const [filter, setFilter] = useState('ALL');

  const [sellers, setSellers] = useState([
    {
      id: 's1',
      storeName: 'TechGadgets Inc',
      ownerName: 'Alex Mercer',
      email: 'alex@techgadgets.com',
      productsCount: 14,
      status: 'APPROVED',
      appliedAt: '2026-01-10',
    },
    {
      id: 's2',
      storeName: 'Urban Fashion Hub',
      ownerName: 'Elena Rostova',
      email: 'elena@urbanfashion.com',
      productsCount: 28,
      status: 'APPROVED',
      appliedAt: '2026-01-22',
    },
    {
      id: 's3',
      storeName: 'Apex Audio Supplies',
      ownerName: 'Marcus Vance',
      email: 'marcus@apexaudio.com',
      productsCount: 0,
      status: 'PENDING_APPROVAL',
      appliedAt: '2026-03-08',
    },
    {
      id: 's4',
      storeName: 'Bargain Traders',
      ownerName: 'David Miller',
      email: 'david@bargaintraders.com',
      productsCount: 5,
      status: 'SUSPENDED',
      appliedAt: '2026-02-15',
    },
  ]);

  const handleUpdateSellerStatus = (id, newStatus) => {
    setSellers((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: newStatus } : s))
    );
    setToast({ type: 'success', text: `Seller status updated to ${newStatus}.` });
  };

  const filteredSellers = sellers.filter((s) => {
    if (filter === 'ALL') return true;
    return s.status === filter;
  });

  const columns = [
    {
      header: 'Store & Merchant Info',
      accessorKey: 'storeName',
      cell: (row) => (
        <div>
          <p className="font-bold text-slate-900 flex items-center gap-1.5">
            <Store className="w-4 h-4 text-amber-500" /> {row.storeName}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Owner: {row.ownerName} ({row.email})
          </p>
        </div>
      ),
    },
    {
      header: 'Catalog Size',
      accessorKey: 'productsCount',
      cell: (row) => <span className="font-semibold text-xs text-slate-700">{row.productsCount} Products</span>,
    },
    {
      header: 'Application Date',
      accessorKey: 'appliedAt',
      cell: (row) => <span className="text-xs text-slate-500 font-mono">{row.appliedAt}</span>,
    },
    {
      header: 'Merchant Status',
      accessorKey: 'status',
      cell: (row) => (
        <Badge
          variant={
            row.status === 'APPROVED' ? 'success' : row.status === 'PENDING_APPROVAL' ? 'amber' : 'danger'
          }
          size="xs"
        >
          {row.status.replace('_', ' ')}
        </Badge>
      ),
    },
    {
      header: 'Approval Actions',
      accessorKey: 'id',
      cell: (row) => (
        <div className="flex items-center gap-2">
          {row.status === 'PENDING_APPROVAL' && (
            <button
              onClick={() => handleUpdateSellerStatus(row.id, 'APPROVED')}
              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs transition-colors cursor-pointer flex items-center gap-1"
            >
              <CheckCircle className="w-3.5 h-3.5" /> Approve
            </button>
          )}

          {row.status === 'APPROVED' && (
            <button
              onClick={() => handleUpdateSellerStatus(row.id, 'SUSPENDED')}
              className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold rounded-lg text-xs transition-colors cursor-pointer flex items-center gap-1"
            >
              <XCircle className="w-3.5 h-3.5" /> Suspend
            </button>
          )}

          {row.status === 'SUSPENDED' && (
            <button
              onClick={() => handleUpdateSellerStatus(row.id, 'APPROVED')}
              className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold rounded-lg text-xs transition-colors cursor-pointer flex items-center gap-1"
            >
              <CheckCircle className="w-3.5 h-3.5" /> Reinstate
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        {toast.text && <Toast type={toast.type} message={toast.text} onClose={() => setToast({ type: '', text: '' })} />}

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Store className="w-6 h-6 text-amber-500" /> Seller Verification & Management
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Review new merchant applications, grant platform selling privileges, and monitor active seller stores.
            </p>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 text-xs font-semibold">
          {[
            { id: 'ALL', label: 'All Sellers' },
            { id: 'APPROVED', label: 'Approved Merchants' },
            { id: 'PENDING_APPROVAL', label: 'Pending Applications' },
            { id: 'SUSPENDED', label: 'Suspended Stores' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-4 py-2 rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                filter === f.id
                  ? 'bg-slate-900 text-white font-bold'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Sellers Table */}
        <Card className="overflow-hidden">
          <Table columns={columns} data={filteredSellers} emptyMessage="No sellers found." />
        </Card>
      </div>
    </DashboardLayout>
  );
}

export default AdminSellersPage;
