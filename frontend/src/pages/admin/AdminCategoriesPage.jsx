import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Table from '../../components/common/Table';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import LoadingState from '../../components/common/LoadingState';
import Toast from '../../components/common/Toast';
import { Layers, Plus, Edit, Power, RefreshCw, Lock, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import API from '../../services/api';

export function AdminCategoriesPage() {
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState({ type: '', text: '' });
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
    parentCategory: '',
  });

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await API.get('/categories');
      setCategories(res.data.categories || []);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await API.post('/categories', formData);
      setToast({ type: 'success', text: 'Platform Category created successfully! (Rule 8 Enforced)' });
      setIsModalOpen(false);
      setFormData({ name: '', description: '', image: '', parentCategory: '' });
      fetchCategories();
    } catch (err) {
      setToast({ type: 'error', text: err.response?.data?.message || 'Failed to create category.' });
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    {
      header: 'Category Name',
      accessorKey: 'name',
      cell: (row) => (
        <div className="flex items-center gap-3">
          {row.image && (
            <img src={row.image} alt={row.name} className="w-9 h-9 object-cover rounded-lg border border-slate-200" />
          )}
          <div>
            <p className="font-bold text-slate-900">{row.name}</p>
            <p className="text-[11px] text-slate-400 font-mono">slug: /{row.slug || row.name.toLowerCase()}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Description',
      accessorKey: 'description',
      cell: (row) => <span className="text-xs text-slate-600 line-clamp-1">{row.description || 'No description'}</span>,
    },
    {
      header: 'Parent Category',
      accessorKey: 'parentCategory',
      cell: (row) => (
        <Badge variant="neutral" size="xs">
          {row.parentCategory?.name || 'Top-Level'}
        </Badge>
      ),
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (row) => (
        <Badge variant={row.status === 'INACTIVE' ? 'neutral' : 'success'} size="xs">
          {row.status || 'ACTIVE'}
        </Badge>
      ),
    },
  ];

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        {toast.text && <Toast type={toast.type} message={toast.text} onClose={() => setToast({ type: '', text: '' })} />}

        {/* Rule 8 Admin Guard Notice */}
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex items-center gap-3 text-xs text-amber-900 font-medium">
          <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0" />
          <span>
            <strong>Rule 8 Policy Enforced:</strong> Platform category creation is restricted strictly to verified <strong>ADMIN</strong> roles.
          </span>
        </div>

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Layers className="w-6 h-6 text-amber-500" /> Platform Category Management
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Create and maintain top-level and nested selling categories across the marketplace.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={fetchCategories}>
              <RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Refresh
            </Button>
            <Button variant="amber" size="sm" onClick={() => setIsModalOpen(true)}>
              <Plus className="w-4 h-4 mr-1.5" /> Create New Category
            </Button>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <LoadingState label="Loading platform categories..." />
        ) : (
          <Card className="overflow-hidden">
            <Table columns={columns} data={categories} emptyMessage="No categories created yet." />
          </Card>
        )}

        {/* Create Category Modal */}
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create Platform Category (Admin Only)">
          <form onSubmit={handleCreateCategory} className="space-y-4 text-xs">
            <Input
              label="Category Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Home Appliances"
              required
            />

            <div>
              <label className="block font-bold text-slate-700 mb-1">Description</label>
              <textarea
                rows="3"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-none focus:border-amber-400"
                placeholder="Category summary for navigation menus..."
              />
            </div>

            <Input
              label="Thumbnail Image URL"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              placeholder="https://images.unsplash.com/..."
            />

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="amber" disabled={submitting}>
                {submitting ? 'Creating...' : 'Save Category'}
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </DashboardLayout>
  );
}

export default AdminCategoriesPage;
