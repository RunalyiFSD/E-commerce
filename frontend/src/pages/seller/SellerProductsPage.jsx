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
import { Package, Plus, Edit2, Power, Search, RefreshCw, Layers } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import API from '../../services/api';

export function SellerProductsPage() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [toast, setToast] = useState({ type: '', text: '' });
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    discountPrice: '',
    category: 'Electronics',
    inventory: '25',
    SKU: '',
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80'],
  });

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await API.get('/products');
      setProducts(res.data.products || []);
    } catch (err) {
      console.error('Failed to fetch products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        price: Number(formData.price),
        discountPrice: formData.discountPrice ? Number(formData.discountPrice) : undefined,
        inventory: Number(formData.inventory),
        SKU: formData.SKU || `SKU-${Date.now()}`,
      };

      await API.post('/products', payload);
      setToast({ type: 'success', text: 'Product created successfully!' });
      setIsAddModalOpen(false);
      setFormData({
        name: '',
        description: '',
        price: '',
        discountPrice: '',
        category: 'Electronics',
        inventory: '25',
        SKU: '',
        images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80'],
      });
      fetchProducts();
    } catch (err) {
      setToast({ type: 'error', text: err.response?.data?.message || 'Failed to create product.' });
    } finally {
      setSubmitting(false);
    }
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.SKU?.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    {
      header: 'Product Info',
      accessorKey: 'name',
      cell: (row) => (
        <div className="flex items-center gap-3">
          {row.images?.[0] && (
            <img src={row.images[0]} alt={row.name} className="w-10 h-10 object-cover rounded-lg border border-slate-200" />
          )}
          <div>
            <p className="font-bold text-slate-900 line-clamp-1">{row.name}</p>
            <p className="text-[11px] text-slate-400 font-mono">SKU: {row.SKU || 'N/A'}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Category',
      accessorKey: 'category',
      cell: (row) => <Badge variant="info" size="xs">{row.category || 'General'}</Badge>,
    },
    {
      header: 'Price',
      accessorKey: 'price',
      cell: (row) => (
        <div>
          <span className="font-bold text-slate-900">₹{row.price?.toFixed(2)}</span>
          {row.discountPrice && (
            <span className="text-[10px] text-emerald-600 block font-semibold">
              Sale: ₹{row.discountPrice.toFixed(2)}
            </span>
          )}
        </div>
      ),
    },
    {
      header: 'Stock',
      accessorKey: 'inventory',
      cell: (row) => (
        <Badge variant={row.inventory > 10 ? 'success' : row.inventory > 0 ? 'amber' : 'danger'} size="xs">
          {row.inventory} in stock
        </Badge>
      ),
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (row) => (
        <Badge variant={row.status === 'ACTIVE' || !row.status ? 'success' : 'neutral'} size="xs">
          {row.status || 'ACTIVE'}
        </Badge>
      ),
    },
  ];

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        {toast.text && (
          <Toast type={toast.type} message={toast.text} onClose={() => setToast({ type: '', text: '' })} />
        )}

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Package className="w-6 h-6 text-amber-500" /> My Store Products
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Manage your product catalog, prices, categories, and inventory stock.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={fetchProducts}>
              <RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Refresh
            </Button>
            <Button variant="amber" size="sm" onClick={() => setIsAddModalOpen(true)}>
              <Plus className="w-4 h-4 mr-1.5" /> Add New Product
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-slate-200">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search products by title or SKU..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-9 pr-4 py-2 text-xs font-medium focus:outline-none focus:border-amber-400"
            />
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <LoadingState label="Loading product catalog..." />
        ) : (
          <Card className="overflow-hidden">
            <Table columns={columns} data={filteredProducts} emptyMessage="No products found in your seller account." />
          </Card>
        )}

        {/* Add Product Modal */}
        <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Create New Product">
          <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
            <Input
              label="Product Title"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Wireless Noise-Canceling Earbuds"
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Price ($)"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
              />
              <Input
                label="Discount Price ($) Optional"
                type="number"
                step="0.01"
                value={formData.discountPrice}
                onChange={(e) => setFormData({ ...formData, discountPrice: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 font-semibold text-slate-800"
                >
                  <option value="Electronics">Electronics</option>
                  <option value="Fashion">Fashion</option>
                  <option value="Home & Kitchen">Home & Kitchen</option>
                  <option value="Books">Books</option>
                </select>
              </div>

              <Input
                label="Stock Quantity"
                type="number"
                value={formData.inventory}
                onChange={(e) => setFormData({ ...formData, inventory: e.target.value })}
                required
              />
            </div>

            <Input
              label="Product SKU Code"
              value={formData.SKU}
              onChange={(e) => setFormData({ ...formData, SKU: e.target.value })}
              placeholder="e.g. SKU-ELEC-908"
            />

            <div>
              <label className="block font-bold text-slate-700 mb-1">Description</label>
              <textarea
                rows="3"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-none focus:border-amber-400"
                placeholder="Product highlights, specifications, and details..."
                required
              />
            </div>

            <Input
              label="Image URL"
              value={formData.images[0]}
              onChange={(e) => setFormData({ ...formData, images: [e.target.value] })}
              placeholder="https://images.unsplash.com/..."
            />

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="amber" disabled={submitting}>
                {submitting ? 'Creating...' : 'Publish Product'}
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </DashboardLayout>
  );
}

export default SellerProductsPage;
