import React, { useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Badge from '../../components/common/Badge';
import Toast from '../../components/common/Toast';
import { Store, ShieldCheck, Mail, MapPin, Building, Phone } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export function SellerSettingsPage() {
  const { user, setUser } = useAuth();
  const [storeData, setStoreData] = useState({
    storeName: user?.storeName || 'My Marketplace Store',
    description: 'Premier seller of top-quality electronics and lifestyle products.',
    contactEmail: user?.email || 'seller@example.com',
    phone: '+1 (555) 432-8765',
    city: 'San Jose, CA',
  });

  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ type: '', text: '' });

  const handleSave = (e) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setUser({ ...user, storeName: storeData.storeName });
      localStorage.setItem('user', JSON.stringify({ ...user, storeName: storeData.storeName }));
      setToast({ type: 'success', text: 'Store settings updated successfully!' });
      setSaving(false);
    }, 400);
  };

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6 max-w-4xl">
        {toast.text && <Toast type={toast.type} message={toast.text} onClose={() => setToast({ type: '', text: '' })} />}

        {/* Page Header */}
        <div className="pb-4 border-b border-slate-200">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Store className="w-6 h-6 text-amber-500" /> Merchant Store Settings
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage your store identity, public merchant profile, and business details.
          </p>
        </div>

        {/* Status Card */}
        <Card className="p-6 bg-slate-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-400 text-slate-900 rounded-2xl">
              <Store className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-lg font-bold">{storeData.storeName}</h2>
              <p className="text-xs text-slate-400 mt-0.5">Approved Merchant Account</p>
            </div>
          </div>

          <Badge variant="success" size="md">
            <ShieldCheck className="w-3.5 h-3.5 mr-1" /> Active Seller Account
          </Badge>
        </Card>

        {/* Form */}
        <Card className="p-6">
          <form onSubmit={handleSave} className="space-y-4">
            <Input
              label="Store Display Name"
              value={storeData.storeName}
              onChange={(e) => setStoreData({ ...storeData, storeName: e.target.value })}
              required
            />

            <div>
              <label className="block font-bold text-slate-700 text-xs mb-1">Store Description</label>
              <textarea
                rows="3"
                value={storeData.description}
                onChange={(e) => setStoreData({ ...storeData, description: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Support / Contact Email"
                value={storeData.contactEmail}
                onChange={(e) => setStoreData({ ...storeData, contactEmail: e.target.value })}
                required
              />
              <Input
                label="Contact Phone"
                value={storeData.phone}
                onChange={(e) => setStoreData({ ...storeData, phone: e.target.value })}
              />
            </div>

            <Input
              label="Business Location"
              value={storeData.city}
              onChange={(e) => setStoreData({ ...storeData, city: e.target.value })}
            />

            <div className="flex justify-end pt-3 border-t border-slate-100">
              <Button type="submit" variant="amber" disabled={saving}>
                {saving ? 'Saving...' : 'Save Settings'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
}

export default SellerSettingsPage;
