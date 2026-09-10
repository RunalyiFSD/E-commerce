import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Table from '../../components/common/Table';
import LoadingState from '../../components/common/LoadingState';
import Toast from '../../components/common/Toast';
import { Layers, AlertTriangle, CheckCircle2, RefreshCw, Search, Plus, Minus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import API from '../../services/api';

export function SellerInventoryPage() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('ALL');
  const [toast, setToast] = useState({ type: '', text: '' });

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await API.get('/products');
      setProducts(res.data.products || []);
    } catch (err) {
      console.error('Failed to fetch inventory:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleUpdateStock = async (id, currentStock, delta) => {
    const newStock = Math.max(0, currentStock + delta);
    try {
      await API.put(`/products/${id}`, { inventory: newStock });
      setProducts((prev) =>
        prev.map((p) => (p._id === id ? { ...p, inventory: newStock } : p))
      );
      setToast({ type: 'success', text: 'Stock updated successfully.' });
    } catch (err) {
      setToast({ type: 'error', text: 'Failed to update stock quantity.' });
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name?.toLowerCase().includes(search.toLowerCase()) || p.SKU?.toLowerCase().includes(search.toLowerCase());
    if (!matchesSearch) return false;
    if (filter === 'LOW_STOCK') return p.inventory <= 10 && p.inventory > 0;
    if (filter === 'OUT_OF_STOCK') return p.inventory === 0;
    return true;
  });

  const lowStockCount = products.filter((p) => p.inventory <= 10 && p.inventory > 0).length;
  const outOfStockCount = products.filter((p) => p.inventory === 0).length;

  const columns = [
    {
      header: 'Product Details',
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
      cell: (row) => <Badge variant="info" size="xs">{row.category}</Badge>,
    },
    {
      header: 'Current Stock',
      accessorKey: 'inventory',
      cell: (row) => (
        <div className="flex items-center gap-2">
          <Badge
            variant={row.inventory > 10 ? 'success' : row.inventory > 0 ? 'amber' : 'danger'}
            size="sm"
          >
            {row.inventory} Units
          </Badge>
          {row.inventory <= 10 && row.inventory > 0 && (
            <span className="text-[10px] font-bold text-amber-600 flex items-center gap-0.5">
              <AlertTriangle className="w-3 h-3" /> Low Stock
            </span>
          )}
        </div>
      ),
    },
    {
      header: 'Quick Adjustment',
      accessorKey: '_id',
      cell: (row) => (
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => handleUpdateStock(row._id, row.inventory, -5)}
            className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-md text-xs transition-colors cursor-pointer"
            title="Minus 5"
          >
            -5
          </button>
          <button
            onClick={() => handleUpdateStock(row._id, row.inventory, -1)}
            className="p-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-md text-xs transition-colors cursor-pointer"
            title="Minus 1"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="w-8 text-center font-bold text-slate-800 text-xs">{row.inventory}</span>
          <button
            onClick={() => handleUpdateStock(row._id, row.inventory, 1)}
            className="p-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-md text-xs transition-colors cursor-pointer"
            title="Add 1"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => handleUpdateStock(row._id, row.inventory, 10)}
            className="px-2 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold rounded-md text-xs transition-colors cursor-pointer"
            title="Add 10"
          >
            +10
          </button>
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
              <Layers className="w-6 h-6 text-amber-500" /> Inventory & Stock Management
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Monitor stock levels, adjust quantities, and address low-stock alerts before items sell out.
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={fetchProducts}>
            <RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Refresh Stock
          </Button>
        </div>

        {/* Summary Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="p-4 bg-emerald-50/50 border-emerald-200 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Total Active Products</p>
              <p className="text-2xl font-black text-emerald-950 mt-1">{products.length}</p>
            </div>
            <CheckCircle2 className="w-8 h-8 text-emerald-500 opacity-80" />
          </Card>

          <Card className="p-4 bg-amber-50/50 border-amber-200 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-amber-800 uppercase tracking-wider">Low Stock Warnings</p>
              <p className="text-2xl font-black text-amber-950 mt-1">{lowStockCount}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-amber-500 opacity-80" />
          </Card>

          <Card className="p-4 bg-rose-50/50 border-rose-200 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-rose-800 uppercase tracking-wider">Out of Stock</p>
              <p className="text-2xl font-black text-rose-950 mt-1">{outOfStockCount}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-rose-500 opacity-80" />
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Filter by product name or SKU..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-9 pr-4 py-2 text-xs font-medium focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold w-full sm:w-auto">
            {['ALL', 'LOW_STOCK', 'OUT_OF_STOCK'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg cursor-pointer transition-all ${
                  filter === f ? 'bg-slate-900 text-white font-bold' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {f.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <LoadingState label="Loading stock records..." />
        ) : (
          <Card className="overflow-hidden">
            <Table columns={columns} data={filteredProducts} emptyMessage="No inventory items found." />
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}

export default SellerInventoryPage;
