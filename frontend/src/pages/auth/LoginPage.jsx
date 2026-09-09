import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, ShieldCheck, Store, UserCheck, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, setUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    const result = await login(email, password);
    setIsSubmitting(false);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
    }
  };

  // Demo account shortcut for development testing
  const handleQuickDemoLogin = (role) => {
    let mockUser;
    if (role === 'ADMIN') {
      mockUser = { id: 'admin-1', name: 'Platform Administrator', email: 'admin@amazon.com', role: 'ADMIN' };
    } else if (role === 'SELLER') {
      mockUser = { id: 'seller-1', name: 'Sony Direct Store', email: 'seller@sony.com', role: 'SELLER', storeName: 'Sony Official' };
    } else {
      mockUser = { id: 'cust-1', name: 'Alex Johnson', email: 'alex@example.com', role: 'CUSTOMER' };
    }

    setUser(mockUser);
    localStorage.setItem('user', JSON.stringify(mockUser));
    localStorage.setItem('token', 'demo-mock-jwt-token-123456');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4 font-sans">
      {/* Brand Header */}
      <Link to="/" className="mb-6 flex items-center space-x-2">
        <span className="text-3xl font-black text-amber-500 tracking-tight">E-Commerce</span>
        <span className="text-xs bg-slate-900 text-white px-2 py-0.5 rounded font-bold uppercase">Enterprise</span>
      </Link>

      <Card className="w-full max-w-md bg-white shadow-xl rounded-3xl border border-slate-200 overflow-hidden">
        <Card.Header className="bg-slate-900 text-white px-6 py-5">
          <div>
            <Card.Title className="text-lg font-black text-white">Sign In to Your Account</Card.Title>
            <Card.Description className="text-xs text-slate-400">
              Access your orders, dashboard, and fulfillment portal
            </Card.Description>
          </div>
        </Card.Header>

        <Card.Body className="p-6 space-y-6">
          {error && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-xs text-rose-700 font-medium">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="user@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail className="w-4 h-4" />}
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftIcon={<Lock className="w-4 h-4" />}
              required
            />

            <Button
              type="submit"
              variant="amber"
              size="lg"
              isLoading={isSubmitting}
              leftIcon={<LogIn className="w-4 h-4" />}
              className="w-full font-bold shadow-md mt-2"
            >
              Sign In
            </Button>
          </form>

          {/* Demo Login Shortcuts Box */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block text-center">
              Instant Demo Quick Login
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('CUSTOMER')}
                className="p-2.5 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-xl text-center transition-colors"
              >
                <UserCheck className="w-4 h-4 text-sky-600 mx-auto mb-1" />
                <span className="text-[10px] font-bold text-sky-900 block">Customer</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('SELLER')}
                className="p-2.5 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl text-center transition-colors"
              >
                <Store className="w-4 h-4 text-amber-600 mx-auto mb-1" />
                <span className="text-[10px] font-bold text-amber-900 block">Seller</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('ADMIN')}
                className="p-2.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl text-center transition-colors"
              >
                <ShieldCheck className="w-4 h-4 text-rose-600 mx-auto mb-1" />
                <span className="text-[10px] font-bold text-rose-900 block">Admin</span>
              </button>
            </div>
          </div>
        </Card.Body>

        <Card.Footer className="bg-slate-50 text-center justify-center p-4 text-xs text-slate-600">
          New to E-Commerce Marketplace?{' '}
          <Link to="/register" className="font-bold text-amber-600 hover:underline ml-1">
            Create an Account
          </Link>
        </Card.Footer>
      </Card>
    </div>
  );
}

export default LoginPage;
