import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Home } from 'lucide-react';
import Button from '../../components/common/Button';

export function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-center font-sans">
      <div className="max-w-md w-full bg-white border border-slate-200 rounded-3xl p-8 shadow-xl space-y-6">
        <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto shadow-xs">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-xs uppercase font-black text-rose-600 tracking-wider">403 Access Forbidden</span>
          <h1 className="text-2xl font-black text-slate-900">Insufficient Role Permissions</h1>
          <p className="text-xs text-slate-500 leading-relaxed">
            Your current account role does not have authorization to view this protected resource.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Link to="/" className="flex-1">
            <Button variant="amber" size="md" leftIcon={<Home className="w-4 h-4" />} className="w-full font-bold">
              Marketplace Home
            </Button>
          </Link>
          <Link to="/login" className="flex-1">
            <Button variant="outline" size="md" leftIcon={<ArrowLeft className="w-4 h-4" />} className="w-full">
              Switch Account
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default UnauthorizedPage;
