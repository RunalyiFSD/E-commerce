import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Mail, Lock, User, Store, UserCheck, ShieldCheck, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';

export function RegisterPage() {
  const [searchParams] = useSearchParams();
  const defaultRole = searchParams.get('role') === 'SELLER' ? 'SELLER' : 'CUSTOMER';

  const [role, setRole] = useState(defaultRole);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [storeName, setStoreName] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (role === 'SELLER' && !storeName.trim()) {
      setError('Store name is required for seller registration.');
      return;
    }

    setIsSubmitting(true);
    const result = await register({
      name,
      email,
      password,
      role,
      storeName: role === 'SELLER' ? storeName : undefined,
    });
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
      <Link to="/" className="mb-6 flex items-center space-x-2">
        <span className="text-3xl font-black text-amber-500 tracking-tight">E-Commerce</span>
        <span className="text-xs bg-slate-900 text-white px-2 py-0.5 rounded font-bold uppercase">Enterprise</span>
      </Link>

      <Card className="w-full max-w-md bg-white shadow-xl rounded-3xl border border-slate-200 overflow-hidden">
        <Card.Header className="bg-slate-900 text-white px-6 py-5">
          <div>
            <Card.Title className="text-lg font-black text-white">Create E-Commerce Account</Card.Title>
            <Card.Description className="text-xs text-slate-400">
              Join as a customer or register a merchant store
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

          {/* Role Selection Toggle */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">Account Type</label>
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => setRole('CUSTOMER')}
                className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  role === 'CUSTOMER' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5 text-sky-500" /> Customer
              </button>
              <button
                type="button"
                onClick={() => setRole('SELLER')}
                className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  role === 'SELLER' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Store className="w-3.5 h-3.5 text-amber-500" /> Seller / Merchant
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              leftIcon={<User className="w-4 h-4" />}
              required
            />

            {role === 'SELLER' && (
              <Input
                label="Store / Business Name"
                placeholder="e.g. Apex Electronics Store"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                leftIcon={<Store className="w-4 h-4" />}
                required
              />
            )}

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
              label="Password (min 6 characters)"
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
              className="w-full font-bold shadow-md mt-2"
            >
              Register & Create Account
            </Button>
          </form>
        </Card.Body>

        <Card.Footer className="bg-slate-50 text-center justify-center p-4 text-xs text-slate-600">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-amber-600 hover:underline ml-1">
            Sign In
          </Link>
        </Card.Footer>
      </Card>
    </div>
  );
}

export default RegisterPage;
