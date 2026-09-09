import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Store,
  Layers,
  Truck,
  AlertTriangle,
  Clock,
  Heart,
  MapPin,
  User,
  Settings,
  ShieldCheck,
} from 'lucide-react';
import { cn } from '../../utils/cn';
import Badge from '../common/Badge';

export function Sidebar({ role = 'CUSTOMER', className, onItemClick }) {
  const getRoleMenuItems = () => {
    switch (role) {
      case 'ADMIN':
        return [
          { label: 'Overview', path: '/dashboard', icon: LayoutDashboard },
          { label: 'Manage Users', path: '/dashboard/users', icon: Users },
          { label: 'Manage Sellers', path: '/dashboard/sellers', icon: Store },
          { label: 'Platform Products', path: '/dashboard/products', icon: Package },
          { label: 'Selling Categories', path: '/dashboard/categories', icon: Layers },
          { label: 'All Orders', path: '/dashboard/orders', icon: ShoppingBag },
          { label: 'Active Deliveries', path: '/dashboard/deliveries/active', icon: Truck },
          { label: 'Delayed / Failed', path: '/dashboard/deliveries/issues', icon: AlertTriangle },
          { label: 'Audit Logs', path: '/dashboard/audit-logs', icon: ShieldCheck },
        ];
      case 'SELLER':
        return [
          { label: 'Seller Dashboard', path: '/dashboard', icon: LayoutDashboard },
          { label: 'My Products', path: '/dashboard/seller/products', icon: Package },
          { label: 'Inventory Management', path: '/dashboard/seller/inventory', icon: Layers },
          { label: 'Seller Orders', path: '/dashboard/seller/orders', icon: ShoppingBag },
          { label: 'Shipments & Fulfillment', path: '/dashboard/seller/fulfillment', icon: Truck },
          { label: 'Store Settings', path: '/dashboard/seller/settings', icon: Settings },
        ];
      case 'CUSTOMER':
      default:
        return [
          { label: 'Customer Dashboard', path: '/dashboard', icon: LayoutDashboard },
          { label: 'Order History', path: '/dashboard/customer/orders', icon: ShoppingBag },
          { label: 'Active Deliveries', path: '/dashboard/customer/deliveries', icon: Truck },
          { label: 'Wishlist', path: '/wishlist', icon: Heart },
          { label: 'Saved Addresses', path: '/dashboard/customer/addresses', icon: MapPin },
          { label: 'Profile Settings', path: '/dashboard/customer/profile', icon: User },
        ];
    }
  };

  const menuItems = getRoleMenuItems();

  return (
    <aside className={cn('w-64 bg-white border-r border-slate-200 flex flex-col h-full select-none', className)}>
      {/* Sidebar Header */}
      <div className="p-5 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h2 className="text-xs uppercase tracking-wider font-extrabold text-slate-400">Navigation Menu</h2>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm font-bold text-slate-800">{role} Panel</span>
            <Badge
              variant={role === 'ADMIN' ? 'danger' : role === 'SELLER' ? 'brand' : 'info'}
              size="sm"
            >
              {role}
            </Badge>
          </div>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/dashboard'}
              onClick={onItemClick}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150',
                  isActive
                    ? 'bg-brand-50 text-brand-950 border border-brand-200 shadow-2xs font-bold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                )
              }
            >
              <Icon className="w-4 h-4 shrink-0 text-slate-500 group-hover:text-slate-800" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Sidebar Footer Info */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/60 text-[11px] text-slate-500">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>Role RBAC Active</span>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
