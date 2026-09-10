import React, { useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import { MapPin, Plus, Trash2, CheckCircle2, Home, Briefcase, Building } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export function CustomerAddressesPage() {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState([
    {
      id: 'addr_1',
      type: 'Home',
      fullName: user?.name || 'Customer User',
      phone: '+1 (555) 234-5678',
      street: '123 Tech Boulevard, Suite 400',
      city: 'San Francisco',
      state: 'CA',
      postalCode: '94107',
      country: 'USA',
      isDefault: true,
    },
    {
      id: 'addr_2',
      type: 'Office',
      fullName: user?.name || 'Customer User',
      phone: '+1 (555) 987-6543',
      street: '456 Innovation Parkway',
      city: 'Austin',
      state: 'TX',
      postalCode: '78701',
      country: 'USA',
      isDefault: false,
    },
  ]);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    type: 'Home',
    fullName: user?.name || '',
    phone: '',
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'USA',
    isDefault: false,
  });

  const handleSetDefault = (id) => {
    setAddresses((prev) =>
      prev.map((addr) => ({
        ...addr,
        isDefault: addr.id === id,
      }))
    );
  };

  const handleDelete = (id) => {
    setAddresses((prev) => prev.filter((addr) => addr.id !== id));
  };

  const handleAddAddress = (e) => {
    e.preventDefault();
    const newAddress = {
      ...formData,
      id: `addr_${Date.now()}`,
      isDefault: addresses.length === 0 || formData.isDefault,
    };

    if (newAddress.isDefault) {
      setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: false })));
    }

    setAddresses((prev) => [...prev, newAddress]);
    setIsAddModalOpen(false);
    setFormData({
      type: 'Home',
      fullName: user?.name || '',
      phone: '',
      street: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'USA',
      isDefault: false,
    });
  };

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <MapPin className="w-6 h-6 text-amber-500" /> Saved Delivery Addresses
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Manage your default shipping address and saved locations for quick checkout.
            </p>
          </div>
          <Button variant="amber" size="sm" onClick={() => setIsAddModalOpen(true)}>
            <Plus className="w-4 h-4 mr-1.5" /> Add New Address
          </Button>
        </div>

        {/* Addresses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {addresses.map((addr) => (
            <Card
              key={addr.id}
              className={`p-6 relative flex flex-col justify-between transition-all ${
                addr.isDefault ? 'border-2 border-amber-400 shadow-xs' : 'border border-slate-200'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    {addr.type === 'Home' ? (
                      <Home className="w-4 h-4 text-amber-600" />
                    ) : (
                      <Briefcase className="w-4 h-4 text-blue-600" />
                    )}
                    <span className="font-extrabold text-slate-900 text-sm">{addr.type} Address</span>
                  </div>
                  {addr.isDefault && (
                    <Badge variant="amber" size="xs">
                      Default Shipping Address
                    </Badge>
                  )}
                </div>

                <div className="space-y-1.5 text-xs text-slate-700 font-medium">
                  <p className="font-bold text-slate-900 text-sm">{addr.fullName}</p>
                  <p>{addr.street}</p>
                  <p>
                    {addr.city}, {addr.state} {addr.postalCode}
                  </p>
                  <p>{addr.country}</p>
                  <p className="text-slate-500 mt-2">Phone: {addr.phone}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 mt-6 border-t border-slate-100">
                {!addr.isDefault ? (
                  <button
                    onClick={() => handleSetDefault(addr.id)}
                    className="text-xs font-bold text-amber-600 hover:text-amber-700 cursor-pointer flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" /> Set as Default
                  </button>
                ) : (
                  <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Active Default
                  </span>
                )}

                <button
                  onClick={() => handleDelete(addr.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                  title="Delete Address"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </Card>
          ))}
        </div>

        {/* Add Address Modal */}
        <Modal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          title="Add New Delivery Address"
        >
          <form onSubmit={handleAddAddress} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Address Label</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 font-semibold text-slate-800"
                >
                  <option value="Home">Home</option>
                  <option value="Office">Office</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <Input
                label="Full Name"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                required
              />
            </div>

            <Input
              label="Phone Number"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+1 (555) 000-0000"
              required
            />

            <Input
              label="Street Address"
              value={formData.street}
              onChange={(e) => setFormData({ ...formData, street: e.target.value })}
              placeholder="House/Apt No., Street name"
              required
            />

            <div className="grid grid-cols-3 gap-3">
              <Input
                label="City"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                required
              />
              <Input
                label="State"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                required
              />
              <Input
                label="Postal Code"
                value={formData.postalCode}
                onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                required
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="defaultCheck"
                checked={formData.isDefault}
                onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                className="rounded border-slate-300 text-amber-500 focus:ring-amber-400"
              />
              <label htmlFor="defaultCheck" className="font-semibold text-slate-700 cursor-pointer">
                Set as primary default address
              </label>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="amber">
                Save Address
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </DashboardLayout>
  );
}

export default CustomerAddressesPage;
