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

  const { login, demoLogin } = useAuth();
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

  // Demo account shortcut for development testing with real session
  const handleQuickDemoLogin = async (role) => {
    setError('');
    setIsSubmitting(true);
    const result = await demoLogin(role);
    setIsSubmitting(false);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4 font-sans">
      {/* Brand Header */}
      <Link to="/" className="mb-6 flex items-center space-x-2.5">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-indigo-500 to-violet-500 flex items-center justify-center shadow-lg shadow-brand-500/25">
          <span className="text-white font-black text-xl">E</span>
        </div>
        <div className="flex flex-col">
          <span className="text-2xl font-black text-slate-900 tracking-tight leading-none">E Mart</span>
          <span className="text-[10px] uppercase font-extrabold tracking-widest text-brand-600">Marketplace</span>
        </div>
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
              variant="primary"
              size="lg"
              isLoading={isSubmitting}
              leftIcon={<LogIn className="w-4 h-4" />}
              className="w-full font-bold shadow-md shadow-brand-500/25 mt-2"
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
                className="p-2.5 bg-brand-50 hover:bg-brand-100 border border-brand-200 rounded-xl text-center transition-colors"
              >
                <Store className="w-4 h-4 text-brand-600 mx-auto mb-1" />
                <span className="text-[10px] font-bold text-brand-900 block">Seller</span>
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
          New to E Mart?{' '}
          <Link to="/register" className="font-bold text-brand-600 hover:underline ml-1">
            Create an Account
          </Link>
        </Card.Footer>
      </Card>
    </div>
  );
}

export default LoginPage;
