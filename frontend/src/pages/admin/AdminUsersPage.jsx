import React, { useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Table from '../../components/common/Table';
import Toast from '../../components/common/Toast';
import { Users, Search, ShieldCheck, UserCheck, UserX, Mail, ShieldAlert } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export function AdminUsersPage() {
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [toast, setToast] = useState({ type: '', text: '' });

  const [usersList, setUsersList] = useState([
    {
      id: 'u1',
      name: 'John Customer',
      email: 'customer@example.com',
      role: 'CUSTOMER',
      status: 'ACTIVE',
      joinedAt: '2026-01-15',
    },
    {
      id: 'u2',
      name: 'Tech Gadgets Store',
      email: 'seller@example.com',
      role: 'SELLER',
      status: 'ACTIVE',
      joinedAt: '2026-02-01',
    },
    {
      id: 'u3',
      name: 'System Admin',
      email: 'admin@example.com',
      role: 'ADMIN',
      status: 'ACTIVE',
      joinedAt: '2025-12-01',
    },
    {
      id: 'u4',
      name: 'Sarah Connor',
      email: 'sarah@example.com',
      role: 'CUSTOMER',
      status: 'SUSPENDED',
      joinedAt: '2026-03-10',
    },
  ]);

  const handleToggleStatus = (id) => {
    setUsersList((prev) =>
      prev.map((u) => {
        if (u.id === id) {
          const newStatus = u.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
          setToast({ type: 'success', text: `User status changed to ${newStatus}.` });
          return { ...u, status: newStatus };
        }
        return u;
      })
    );
  };

  const filteredUsers = usersList.filter((u) => {
    const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    if (!matchesSearch) return false;
    if (roleFilter !== 'ALL' && u.role !== roleFilter) return false;
    return true;
  });

  const columns = [
    {
      header: 'User Details',
      accessorKey: 'name',
      cell: (row) => (
        <div>
          <p className="font-bold text-slate-900">{row.name}</p>
          <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
            <Mail className="w-3 h-3" /> {row.email}
          </p>
        </div>
      ),
    },
    {
      header: 'Role',
      accessorKey: 'role',
      cell: (row) => (
        <Badge variant={row.role === 'ADMIN' ? 'danger' : row.role === 'SELLER' ? 'amber' : 'info'} size="xs">
          {row.role}
        </Badge>
      ),
    },
    {
      header: 'Joined Date',
      accessorKey: 'joinedAt',
      cell: (row) => <span className="text-xs text-slate-500 font-mono">{row.joinedAt}</span>,
    },
    {
      header: 'Account Status',
      accessorKey: 'status',
      cell: (row) => (
        <Badge variant={row.status === 'ACTIVE' ? 'success' : 'danger'} size="xs">
          {row.status}
        </Badge>
      ),
    },
    {
      header: 'Action',
      accessorKey: 'id',
      cell: (row) => (
        row.role !== 'ADMIN' && (
          <button
            onClick={() => handleToggleStatus(row.id)}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 ${
              row.status === 'ACTIVE'
                ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
            }`}
          >
            {row.status === 'ACTIVE' ? <UserX className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
            {row.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
          </button>
        )
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
              <Users className="w-6 h-6 text-amber-500" /> Platform User Management
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Inspect registered accounts across Customers, Sellers, and Platform Admins.
            </p>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search user name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-9 pr-4 py-2 text-xs font-medium focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold w-full sm:w-auto">
            {['ALL', 'CUSTOMER', 'SELLER', 'ADMIN'].map((role) => (
              <button
                key={role}
                onClick={() => setRoleFilter(role)}
                className={`px-3 py-1.5 rounded-lg cursor-pointer transition-all ${
                  roleFilter === role ? 'bg-slate-900 text-white font-bold' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {role}
              </button>
            ))}
          </div>
        </div>

        {/* Users Table */}
        <Card className="overflow-hidden">
          <Table columns={columns} data={filteredUsers} emptyMessage="No user accounts match search criteria." />
        </Card>
      </div>
    </DashboardLayout>
  );
}

export default AdminUsersPage;
