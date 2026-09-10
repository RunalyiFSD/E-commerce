import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Truck, CreditCard, CheckCircle2, ShieldCheck, Lock, ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { processPayment } from '../../services/paymentService';
import ToastProvider, { useToast } from '../../components/common/Toast';
import API from '../../services/api';
import { formatCurrency } from '../../utils/formatCurrency';

function CheckoutContent() {
  const { cartItems, grandTotal, clearCart, itemCount } = useCart();
  const { user } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);

  // Address Form State
  const [address, setAddress] = useState({
    fullName: user?.name || 'Alex Johnson',
    street: '742 Evergreen Terrace',
    city: 'Seattle',
    state: 'WA',
    zipCode: '98101',
    phone: '+1 (555) 019-2834',
  });

  // Shipping Method
  const [shippingMethod, setShippingMethod] = useState('STANDARD'); // STANDARD vs EXPRESS

  // Payment Method
  const [paymentMethod, setPaymentMethod] = useState('CARD'); // CARD, UPI, COD

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    try {
      // 1. Process Payment via Gateway Abstraction
      const paymentResult = await processPayment({
        amount: grandTotal,
        paymentMethod,
        customerInfo: { name: address.fullName, email: user?.email },
      });

      // 2. Prepare Order Payload
      const orderPayload = {
        items: cartItems.map((item) => ({
          product: item.product.id || item.product._id,
          productName: item.product.name,
          quantity: item.quantity,
          price: item.product.discountPrice || item.product.price,
          image: item.product.images[0],
        })),
        shippingAddress: address,
        payment: {
          transactionId: paymentResult.transactionId,
          method: paymentMethod,
          status: paymentResult.paymentStatus,
        },
        pricing: {
          total: grandTotal,
        },
      };

      const randomCode = (prefix = 'TRK', len = 8) => {
        const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
        let resStr = '';
        for (let i = 0; i < len; i++) {
          resStr += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return prefix ? `${prefix}-${resStr}-IN` : resStr;
      };

      // Try API POST /api/orders or fallback to client simulation if offline
      let generatedTrackingCode = randomCode('TRK', 8);
      let orderId = `AMZ-2026-${randomCode('', 6)}`;
      try {
        const res = await API.post('/orders', orderPayload);
        if (res.data?.order?._id) {
          orderId = res.data.order.orderNumber || res.data.order._id;
          if (res.data.order.tracking?.trackingNumber) {
            generatedTrackingCode = res.data.order.tracking.trackingNumber;
          }
        }
      } catch (e) {
        console.warn('[API Order Sync Fallback] Operating offline checkout simulation:', e.response?.data?.message || e.message);
      }

      // Save created order in localStorage for confirmation/tracking pages
      const createdOrder = backendOrder || {
        _id: orderId,
        orderNumber: orderId,
        items: orderPayload.items,
        shippingAddress: address,
        pricing: { total: grandTotal, subtotal: grandTotal },
        status: 'PLACED',
        createdAt: new Date().toISOString(),
        tracking: {
          trackingNumber: generatedTrackingCode,
          courier: 'E-Commerce Express Logistics',
        },
        timeline: [
          {
            status: 'PLACED',
            message: 'Order received and payment verified',
            timestamp: new Date().toISOString(),
            source: 'CUSTOMER',
          },
        ],
      };

      localStorage.setItem(`order_${orderId}`, JSON.stringify(createdOrder));
      try {
        const storedList = JSON.parse(localStorage.getItem('customer_orders') || '[]');
        const updatedList = [
          createdOrder,
          ...storedList.filter((o) => (o._id || o.orderNumber) !== (createdOrder._id || createdOrder.orderNumber)),
        ];
        localStorage.setItem('customer_orders', JSON.stringify(updatedList));
      } catch (err) {}

      console.log('\n============================================================');
      console.log('🛒 ORDER PLACEMENT COMPLETE (ALPHANUMERIC CODES GENERATED):');
      console.log(`🔑 ORDER REFERENCE CODE : ${orderId}`);
      console.log(`🚚 TRACKING CODE        : ${generatedTrackingCode}`);
      console.log('============================================================\n');

      // Clear cart
      clearCart();
      setIsProcessing(false);

      addToast({ message: 'Order placed successfully!', type: 'success' });
      navigate(`/order-confirmation/${orderId}`, { state: { order: createdOrder } });
    } catch (error) {
      setIsProcessing(false);
      addToast({ message: error.message || 'Order processing failed', type: 'error' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar cartCount={itemCount} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8">
        {/* Step Indicator Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between max-w-2xl mx-auto py-3 px-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
            {[
              { step: 1, label: 'Address', icon: MapPin },
              { step: 2, label: 'Delivery', icon: Truck },
              { step: 3, label: 'Payment', icon: CreditCard },
              { step: 4, label: 'Review', icon: CheckCircle2 },
            ].map((s) => {
              const Icon = s.icon;
              const isActive = currentStep === s.step;
              const isPassed = currentStep > s.step;

              return (
                <div key={s.step} className="flex items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      isPassed
                        ? 'bg-emerald-500 text-white'
                        : isActive
                        ? 'bg-brand-600 text-white ring-4 ring-brand-500/30'
                        : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className={`text-xs font-bold hidden sm:inline ${isActive ? 'text-slate-900' : 'text-slate-400'}`}>
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Wizard Content */}
          <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
            {/* Step 1: Shipping Address */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                  <MapPin className="w-5 h-5 text-brand-600" />
                  <h2 className="text-base font-black text-slate-900">Step 1: Shipping Address</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Full Name"
                    value={address.fullName}
                    onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                  />
                  <Input
                    label="Phone Number"
                    value={address.phone}
                    onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                  />
                  <div className="sm:col-span-2">
                    <Input
                      label="Street Address"
                      value={address.street}
                      onChange={(e) => setAddress({ ...address, street: e.target.value })}
                    />
                  </div>
                  <Input
                    label="City"
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                  />
                  <Input
                    label="State / Province"
                    value={address.state}
                    onChange={(e) => setAddress({ ...address, state: e.target.value })}
                  />
                  <Input
                    label="ZIP / Postal Code"
                    value={address.zipCode}
                    onChange={(e) => setAddress({ ...address, zipCode: e.target.value })}
                  />
                </div>

                <div className="flex justify-end pt-4">
                  <Button
                    variant="primary"
                    size="md"
                    onClick={() => setCurrentStep(2)}
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                    className="font-bold shadow-md shadow-brand-500/20"
                  >
                    Continue to Delivery
                  </Button>
                </div>
              </div>
            )}

            {/* Step 2: Delivery Method */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                  <Truck className="w-5 h-5 text-brand-600" />
                  <h2 className="text-base font-black text-slate-900">Step 2: Choose Delivery Option</h2>
                </div>

                <div className="space-y-3">
                  <label
                    onClick={() => setShippingMethod('STANDARD')}
                    className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                      shippingMethod === 'STANDARD' ? 'border-brand-600 bg-brand-50/40 ring-2 ring-brand-500/20' : 'border-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${shippingMethod === 'STANDARD' ? 'border-brand-600 bg-brand-600' : 'border-slate-300'}`} />
                      <div>
                        <span className="text-sm font-bold text-slate-900 block">Standard FREE Delivery</span>
                        <span className="text-xs text-slate-500">Delivered in 3-5 business days</span>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-emerald-600">FREE</span>
                  </label>

                  <label
                    onClick={() => setShippingMethod('EXPRESS')}
                    className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                      shippingMethod === 'EXPRESS' ? 'border-brand-600 bg-brand-50/40 ring-2 ring-brand-500/20' : 'border-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${shippingMethod === 'EXPRESS' ? 'border-brand-600 bg-brand-600' : 'border-slate-300'}`} />
                      <div>
                        <span className="text-sm font-bold text-slate-900 block">Express Priority Courier</span>
                        <span className="text-xs text-slate-500">Delivered tomorrow by 10:30 AM</span>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-slate-900">{formatCurrency(14.99)}</span>
                  </label>
                </div>

                <div className="flex justify-between pt-4">
                  <Button variant="outline" size="md" onClick={() => setCurrentStep(1)}>
                    Back to Address
                  </Button>
                  <Button variant="primary" size="md" onClick={() => setCurrentStep(3)} rightIcon={<ArrowRight className="w-4 h-4" />} className="font-bold shadow-md shadow-brand-500/20">
                    Continue to Payment
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Payment Option */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                  <CreditCard className="w-5 h-5 text-brand-600" />
                  <h2 className="text-base font-black text-slate-900">Step 3: Select Payment Method</h2>
                </div>

                <div className="space-y-3">
                  {[
                    { id: 'CARD', title: 'Credit or Debit Card', desc: 'Visa, Mastercard, American Express' },
                    { id: 'UPI', title: 'UPI / NetBanking', desc: 'Instant bank transfer' },
                    { id: 'COD', title: 'Cash on Delivery (COD)', desc: 'Pay cash when package arrives' },
                  ].map((m) => (
                    <label
                      key={m.id}
                      onClick={() => setPaymentMethod(m.id)}
                      className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                        paymentMethod === m.id ? 'border-brand-600 bg-brand-50/40 ring-2 ring-brand-500/20' : 'border-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${paymentMethod === m.id ? 'border-brand-600 bg-brand-600' : 'border-slate-300'}`} />
                        <div>
                          <span className="text-sm font-bold text-slate-900 block">{m.title}</span>
                          <span className="text-xs text-slate-500">{m.desc}</span>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>

                <div className="flex justify-between pt-4">
                  <Button variant="outline" size="md" onClick={() => setCurrentStep(2)}>
                    Back to Delivery
                  </Button>
                  <Button variant="primary" size="md" onClick={() => setCurrentStep(4)} rightIcon={<ArrowRight className="w-4 h-4" />} className="font-bold shadow-md shadow-brand-500/20">
                    Review Order
                  </Button>
                </div>
              </div>
            )}

            {/* Step 4: Final Review & Order Placement */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  <h2 className="text-base font-black text-slate-900">Step 4: Review and Complete Order</h2>
                </div>

                {/* Address Summary */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1">
                  <span className="font-bold text-slate-900 block text-sm">Shipping Address</span>
                  <p className="text-slate-700">{address.fullName} &bull; {address.phone}</p>
                  <p className="text-slate-500">{address.street}, {address.city}, {address.state} {address.zipCode}</p>
                </div>

                {/* Items Summary */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-700 uppercase">Items in Order</span>
                  {cartItems.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-slate-50/50 rounded-xl border border-slate-100 text-xs">
                      <div className="flex items-center gap-3">
                        <img src={item.product.images[0]} alt={item.product.name} className="w-10 h-10 object-contain rounded" />
                        <div>
                          <span className="font-bold text-slate-900">{item.product.name}</span>
                          <span className="text-slate-500 block">Qty: {item.quantity}</span>
                        </div>
                      </div>
                      <span className="font-mono font-bold text-slate-900">₹{((item.product.discountPrice || item.product.price) * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between pt-4 border-t border-slate-100">
                  <Button variant="outline" size="md" onClick={() => setCurrentStep(3)}>
                    Back to Payment
                  </Button>
                  <Button
                    variant="primary"
                    size="lg"
                    isLoading={isProcessing}
                    onClick={handlePlaceOrder}
                    className="font-extrabold px-8 shadow-lg shadow-brand-500/25"
                  >
                    Place Your Order (₹{grandTotal.toFixed(2)})
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Summary Card */}
          <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4 sticky top-24">
            <h3 className="text-xs uppercase font-extrabold text-slate-400 tracking-wider">Order Summary</h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Items ({itemCount})</span>
                <span className="font-semibold text-slate-900">₹{grandTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Shipping</span>
                <span className="font-semibold text-emerald-600">FREE</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline">
                <span className="text-sm font-bold text-slate-900">Total</span>
                <span className="text-xl font-black text-slate-900">₹{grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export function CheckoutPage() {
  return (
    <ToastProvider>
      <CheckoutContent />
    </ToastProvider>
  );
}

export default CheckoutPage;
