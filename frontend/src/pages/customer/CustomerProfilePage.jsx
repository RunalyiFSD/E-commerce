import React, { useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Badge from '../../components/common/Badge';
import Toast from '../../components/common/Toast';
import Modal from '../../components/common/Modal';
import { User, KeyRound, ShieldCheck, Mail, MapPin, Plus, Trash2, Edit3, Home, Briefcase, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export function CustomerProfilePage() {
  const { user, setUser } = useAuth();
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    storeName: user?.storeName || '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Saved Addresses State
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

  // Modal State for Address
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [addressForm, setAddressForm] = useState({
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

  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState({ type: '', text: '' });

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      setUser({ ...user, name: profileData.name });
      localStorage.setItem('user', JSON.stringify({ ...user, name: profileData.name }));
      setToastMessage({ type: 'success', text: 'Profile information updated successfully!' });
    } catch (err) {
      setToastMessage({ type: 'error', text: 'Failed to update profile.' });
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordUpdate = (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setToastMessage({ type: 'error', text: 'New passwords do not match.' });
      return;
    }
    setSaving(true);
    setTimeout(() => {
      setToastMessage({ type: 'success', text: 'Password changed successfully.' });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setSaving(false);
    }, 500);
  };

  // Address Handlers
  const handleOpenAddModal = () => {
    setEditingAddressId(null);
    setAddressForm({
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
    setIsAddressModalOpen(true);
  };

  const handleOpenEditModal = (addr) => {
    setEditingAddressId(addr.id);
    setAddressForm({
      type: addr.type,
      fullName: addr.fullName,
      phone: addr.phone,
      street: addr.street,
      city: addr.city,
      state: addr.state,
      postalCode: addr.postalCode,
      country: addr.country,
      isDefault: addr.isDefault,
    });
    setIsAddressModalOpen(true);
  };

  const handleSaveAddress = (e) => {
    e.preventDefault();
    if (editingAddressId) {
      // Edit existing
      setAddresses((prev) =>
        prev.map((addr) => {
          if (addr.id === editingAddressId) {
            return { ...addressForm, id: addr.id };
          }
          if (addressForm.isDefault) {
            return { ...addr, isDefault: false };
          }
          return addr;
        })
      );
      setToastMessage({ type: 'success', text: 'Address updated successfully!' });
    } else {
      // Add new
      const newAddress = {
        ...addressForm,
        id: `addr_${Date.now()}`,
        isDefault: addresses.length === 0 || addressForm.isDefault,
      };

      if (newAddress.isDefault) {
        setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: false })));
      }

      setAddresses((prev) => [...prev, newAddress]);
      setToastMessage({ type: 'success', text: 'New address added to your profile!' });
    }

    setIsAddressModalOpen(false);
  };

  const handleSetDefaultAddress = (id) => {
    setAddresses((prev) =>
      prev.map((addr) => ({
        ...addr,
        isDefault: addr.id === id,
      }))
    );
    setToastMessage({ type: 'success', text: 'Default shipping address updated.' });
  };

  const handleDeleteAddress = (id) => {
    setAddresses((prev) => prev.filter((addr) => addr.id !== id));
    setToastMessage({ type: 'success', text: 'Address deleted.' });
  };

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6 max-w-4xl">
        {/* Toast feedback */}
        {toastMessage.text && (
          <Toast
            type={toastMessage.type}
            message={toastMessage.text}
            onClose={() => setToastMessage({ type: '', text: '' })}
          />
        )}

        {/* Page Header */}
        <div className="pb-4 border-b border-slate-200">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <User className="w-6 h-6 text-amber-500" /> Account Profile Settings
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            View and manage your personal user details, saved delivery addresses, security settings, and role permissions.
          </p>
        </div>

        {/* User Role & Overview Card */}
        <Card className="p-6 bg-gradient-to-br from-slate-900 via-slate-800 to-amazon-blue text-white">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-400 text-slate-900 flex items-center justify-center font-black text-2xl shadow-md">
                {(user?.name || user?.email || 'U')[0].toUpperCase()}
              </div>
              <div>
                <h2 className="text-lg font-bold">{user?.name || 'Account User'}</h2>
                <p className="text-xs text-slate-300 flex items-center gap-1.5 mt-0.5">
                  <Mail className="w-3.5 h-3.5" /> {user?.email}
                </p>
                {user?.storeName && (
                  <p className="text-xs text-amber-300 font-semibold mt-0.5">Store: {user.storeName}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Badge variant={user?.role === 'ADMIN' ? 'danger' : user?.role === 'SELLER' ? 'amber' : 'info'} size="md">
                Role: {user?.role || 'CUSTOMER'}
              </Badge>
            </div>
          </div>
        </Card>

        {/* Edit Personal Details */}
        <Card className="p-6">
          <h3 className="text-base font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
            <User className="w-4 h-4 text-amber-500" /> Personal Information
          </h3>

          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                required
              />
              <Input
                label="Email Address"
                value={profileData.email}
                disabled
                helperText="Email address cannot be changed."
              />
            </div>

            <div className="flex justify-end pt-3">
              <Button type="submit" variant="amber" disabled={saving}>
                {saving ? 'Saving...' : 'Save Profile Changes'}
              </Button>
            </div>
          </form>
        </Card>

        {/* Change / Edit Shipping Addresses Section */}
        <Card className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-2 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-amber-500" /> Saved Delivery Addresses
            </h3>
            <Button variant="outline" size="sm" onClick={handleOpenAddModal}>
              <Plus className="w-3.5 h-3.5 mr-1" /> Add New Address
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {addresses.map((addr) => (
              <div
                key={addr.id}
                className={`p-4 rounded-xl border flex flex-col justify-between transition-all ${
                  addr.isDefault ? 'border-amber-400 bg-amber-50/20 shadow-2xs' : 'border-slate-200 bg-white'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5 font-bold text-xs text-slate-800">
                      {addr.type === 'Home' ? (
                        <Home className="w-3.5 h-3.5 text-amber-600" />
                      ) : (
                        <Briefcase className="w-3.5 h-3.5 text-blue-600" />
                      )}
                      <span>{addr.type} Address</span>
                    </div>
                    {addr.isDefault && (
                      <Badge variant="amber" size="xs">
                        Default
                      </Badge>
                    )}
                  </div>

                  <div className="text-xs text-slate-600 space-y-0.5">
                    <p className="font-semibold text-slate-900">{addr.fullName}</p>
                    <p>{addr.street}</p>
                    <p>
                      {addr.city}, {addr.state} {addr.postalCode}
                    </p>
                    <p className="text-slate-400 text-[11px]">Phone: {addr.phone}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100 text-xs">
                  {!addr.isDefault ? (
                    <button
                      onClick={() => handleSetDefaultAddress(addr.id)}
                      className="text-amber-600 font-semibold hover:underline cursor-pointer text-[11px]"
                    >
                      Set as Default
                    </button>
                  ) : (
                    <span className="text-emerald-600 font-bold text-[11px] flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Active Default
                    </span>
                  )}

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenEditModal(addr)}
                      className="p-1 text-slate-500 hover:text-amber-600 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                      title="Edit Address"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteAddress(addr.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
                      title="Delete Address"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Change Password Security */}
        <Card className="p-6">
          <h3 className="text-base font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-amber-500" /> Security & Password Update
          </h3>

          <form onSubmit={handlePasswordUpdate} className="space-y-4">
            <Input
              label="Current Password"
              type="password"
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="New Password"
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                required
              />
              <Input
                label="Confirm New Password"
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                required
              />
            </div>

            <div className="flex justify-end pt-3">
              <Button type="submit" variant="outline" disabled={saving}>
                Update Password
              </Button>
            </div>
          </form>
        </Card>

        {/* Address Add / Edit Modal */}
        <Modal
          isOpen={isAddressModalOpen}
          onClose={() => setIsAddressModalOpen(false)}
          title={editingAddressId ? 'Edit Saved Address' : 'Add New Delivery Address'}
        >
          <form onSubmit={handleSaveAddress} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Address Type</label>
                <select
                  value={addressForm.type}
                  onChange={(e) => setAddressForm({ ...addressForm, type: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 font-semibold text-slate-800"
                >
                  <option value="Home">Home</option>
                  <option value="Office">Office</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <Input
                label="Recipient Full Name"
                value={addressForm.fullName}
                onChange={(e) => setAddressForm({ ...addressForm, fullName: e.target.value })}
                required
              />
            </div>

            <Input
              label="Phone Number"
              value={addressForm.phone}
              onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
              placeholder="+1 (555) 000-0000"
              required
            />

            <Input
              label="Street Address"
              value={addressForm.street}
              onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
              placeholder="House/Apt No., Street name"
              required
            />

            <div className="grid grid-cols-3 gap-3">
              <Input
                label="City"
                value={addressForm.city}
                onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                required
              />
              <Input
                label="State"
                value={addressForm.state}
                onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                required
              />
              <Input
                label="Postal Code"
                value={addressForm.postalCode}
                onChange={(e) => setAddressForm({ ...addressForm, postalCode: e.target.value })}
                required
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="profileDefaultCheck"
                checked={addressForm.isDefault}
                onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
                className="rounded border-slate-300 text-amber-500 focus:ring-amber-400"
              />
              <label htmlFor="profileDefaultCheck" className="font-semibold text-slate-700 cursor-pointer">
                Set as default shipping address
              </label>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <Button type="button" variant="outline" onClick={() => setIsAddressModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="amber">
                {editingAddressId ? 'Save Address Changes' : 'Add Address'}
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </DashboardLayout>
  );
}

export default CustomerProfilePage;
