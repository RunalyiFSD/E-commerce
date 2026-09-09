import React, { useState } from 'react';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';
import Footer from '../components/layout/Footer';
import { X } from 'lucide-react';

export function DashboardLayout({ children, user = { name: 'Customer User', role: 'CUSTOMER' }, cartCount = 0 }) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar
        user={user}
        cartCount={cartCount}
        onMobileMenuToggle={() => setIsMobileSidebarOpen(true)}
      />

      {/* Body Container */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block shrink-0">
          <Sidebar role={user?.role || 'CUSTOMER'} />
        </div>

        {/* Mobile Slide-over Drawer Sidebar */}
        {isMobileSidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <div
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
              onClick={() => setIsMobileSidebarOpen(false)}
            />
            <div className="relative w-64 max-w-xs bg-white h-full flex flex-col z-10 shadow-2xl animate-in slide-in-from-left duration-200">
              <div className="absolute top-3 right-3">
                <button
                  onClick={() => setIsMobileSidebarOpen(false)}
                  className="p-1 rounded-full text-slate-400 hover:text-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <Sidebar
                role={user?.role || 'CUSTOMER'}
                onItemClick={() => setIsMobileSidebarOpen(false)}
                className="w-full border-r-0"
              />
            </div>
          </div>
        )}

        {/* Main Content Viewport */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-hidden">
          {children}
        </main>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default DashboardLayout;
