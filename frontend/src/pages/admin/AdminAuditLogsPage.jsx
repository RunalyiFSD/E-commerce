import React, { useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Table from '../../components/common/Table';
import { ShieldCheck, Search, Filter, Clock, User, Terminal } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export function AdminAuditLogsPage() {
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('ALL');

  const [auditLogs, setAuditLogs] = useState([
    {
      id: 'log_101',
      actor: 'admin@example.com',
      action: 'CATEGORY_CREATED',
      resource: 'Category',
      resourceId: 'cat_electronics_01',
      timestamp: '2026-09-10 05:42:15',
      ip: '192.168.1.1',
      metadata: 'Created category "Smart Devices"',
    },
    {
      id: 'log_102',
      actor: 'admin@example.com',
      action: 'SELLER_APPROVED',
      resource: 'Seller',
      resourceId: 'seller_tech_gadgets',
      timestamp: '2026-09-09 14:20:00',
      ip: '192.168.1.1',
      metadata: 'Approved seller TechGadgets Inc',
    },
    {
      id: 'log_103',
      actor: 'seller@example.com',
      action: 'STATUS_ADVANCED',
      resource: 'Order',
      resourceId: 'ord_908123',
      timestamp: '2026-09-09 11:15:30',
      ip: '10.0.0.45',
      metadata: 'Advanced order state from PLACED -> CONFIRMED',
    },
    {
      id: 'log_104',
      actor: 'admin@example.com',
      action: 'DELIVERY_OVERRIDE',
      resource: 'OrderTracking',
      resourceId: 'ord_908123',
      timestamp: '2026-09-08 18:45:10',
      ip: '192.168.1.1',
      metadata: 'Admin appended delivery exception checkpoint',
    },
  ]);

  const filteredLogs = auditLogs.filter((log) => {
    const matchesSearch =
      log.actor.toLowerCase().includes(search.toLowerCase()) ||
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.metadata.toLowerCase().includes(search.toLowerCase());
    if (!matchesSearch) return false;
    if (actionFilter !== 'ALL' && log.action !== actionFilter) return false;
    return true;
  });

  const columns = [
    {
      header: 'Timestamp & Actor',
      accessorKey: 'timestamp',
      cell: (row) => (
        <div>
          <span className="text-xs font-mono font-bold text-slate-800 flex items-center gap-1">
            <Clock className="w-3 h-3 text-slate-400" /> {row.timestamp}
          </span>
          <span className="text-[11px] text-slate-500 block font-medium mt-0.5">Actor: {row.actor}</span>
        </div>
      ),
    },
    {
      header: 'Action Event',
      accessorKey: 'action',
      cell: (row) => (
        <Badge
          variant={
            row.action.includes('CREATED')
              ? 'success'
              : row.action.includes('APPROVED')
              ? 'amber'
              : row.action.includes('OVERRIDE')
              ? 'danger'
              : 'info'
          }
          size="xs"
        >
          {row.action}
        </Badge>
      ),
    },
    {
      header: 'Resource',
      accessorKey: 'resource',
      cell: (row) => (
        <div>
          <span className="text-xs font-semibold text-slate-800">{row.resource}</span>
          <span className="text-[10px] text-slate-400 font-mono block">ID: {row.resourceId}</span>
        </div>
      ),
    },
    {
      header: 'Details & Context',
      accessorKey: 'metadata',
      cell: (row) => <span className="text-xs text-slate-600 font-medium">{row.metadata}</span>,
    },
  ];

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-amber-500" /> System Audit Trail & Logs
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Immutable operational audit logs capturing administrative actions, role updates, and state overrides.
            </p>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search by actor email, action, or metadata..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-9 pr-4 py-2 text-xs font-medium focus:outline-none focus:border-amber-400"
            />
          </div>
        </div>

        {/* Audit Log Table */}
        <Card className="overflow-hidden">
          <Table columns={columns} data={filteredLogs} emptyMessage="No audit log entries found." />
        </Card>
      </div>
    </DashboardLayout>
  );
}

export default AdminAuditLogsPage;
