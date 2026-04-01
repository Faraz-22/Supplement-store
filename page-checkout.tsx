// src/app/(user)/checkout/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  MapPin,
  CreditCard,
  ShoppingBag,
  Plus,
  Check,
  AlertCircle,
} from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { clearCart } from '@/store/slices/cartSlice';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CheckoutPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { items, subtotal } = useAppSelector((state) => state.cart);
  const { user, token } = useAppSelector((state) => state.auth);

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<string>('RAZORPAY');
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showAddAddress, setShowAddAddress] = useState(false);

  const shippingCost = subtotal >= 999 ? 0 : 49;
  const tax = (subtotal - discount) * 0.18;
  const total = subtotal - discount + shippingCost + tax;

  useEffect(() => {
    if (!user) {
      router.push('/login?redirect=/checkout');
      return;
    }

    if (items.length === 0) {
      router.push('/cart');
      return;
    }

    fetchAddresses();
    loadRazorpayScript();
  }, []);

  const loadRazorpayScript = () => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
  };

  const fetchAddresses = async () => {
    try {
      const response = await fetch('/api/addresses', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAddresses(data.data || []);
        
        // Auto-select default address
        const defaultAddr = data.data?.find((a: any) => a.isDefault);
        if (defaultAddr) {
          setSelectedAddress(defaultAddr.id);
        }
      }
    } catch (error) {
      console.error('Failed to fetch addresses:', error);
    }
  };

  const applyCoupon = async () => {
    if (!couponCode.trim()) return;

    try {
      const response = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          code: couponCode,
          orderValue: subtotal,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setDiscount(data.discount);
        alert('Coupon applied successfully!');
      } else {
        alert('Invalid or expired coupon');
      }
    } catch (error) {
      console.error('Coupon validation error:', error);
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      alert('Please select a delivery address');
      return;
    }

    setLoading(true);

    try {
      // Create order
      const orderResponse = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          addressId: selectedAddress,
          items: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
          paymentMethod,
          couponCode: couponCode || undefined,
        }),
      });

      if (!orderResponse.ok) {
        throw new Error('Failed to create order');
      }

      const orderData = await orderResponse.json();

      if (paymentMethod === 'RAZORPAY') {
        // Initiate Razorpay payment
        await initiateRazorpayPayment(orderData.data);
      } else if (paymentMethod === 'COD') {
        // COD order successful
        dispatch(clearCart());
        router.push(`/order-success/${orderData.data.id}`);
      }
    } catch (error) {
      console.error('Order placement error:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const initiateRazorpayPayment = async (order: any) => {
    try {
      // Create Razorpay order
      const razorpayResponse = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          orderId: order.id,
          amount: total,
        }),
      });

      const razorpayData = await razorpayResponse.json();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: razorpayData.amount,
        currency: 'INR',
        name: 'FITPRO',
        description: `Order #${order.orderNumber}`,
        order_id: razorpayData.id,
        handler: async function (response: any) {
          // Verify payment
          const verifyResponse = await fetch('/api/payments/verify', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              orderId: order.id,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            }),
          });

          if (verifyResponse.ok) {
            dispatch(clearCart());
            router.push(`/order-success/${order.id}`);
          } else {
            alert('Payment verification failed');
          }
        },
        prefill: {
          name: `${user?.firstName} ${user?.lastName}`,
          email: user?.email,
        },
        theme: {
          color: '#e8640f',
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Razorpay initialization error:', error);
      alert('Payment initialization failed');
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-center gap-4">
            {[
              { num: 1, label: 'Address' },
              { num: 2, label: 'Payment' },
              { num: 3, label: 'Review' },
            ].map((s, idx) => (
              <div key={s.num} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full font-bold ${
                    step >= s.num
                      ? 'bg-primary-500 text-white'
                      : 'bg-dark-800 text-gray-500'
                  }`}
                >
                  {step > s.num ? <Check size={20} /> : s.num}
                </div>
                <span
                  className={`ml-2 hidden sm:inline ${
                    step >= s.num ? 'text-white' : 'text-gray-500'
                  }`}
                >
                  {s.label}
                </span>
                {idx < 2 && (
                  <div
                    className={`w-12 sm:w-24 h-0.5 mx-4 ${
                      step > s.num ? 'bg-primary-500' : 'bg-dark-700'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step 1: Address Selection */}
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-dark-800 border border-dark-700 rounded-lg p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <MapPin size={24} className="text-primary-500" />
                    Delivery Address
                  </h2>
                  <button
                    onClick={() => setShowAddAddress(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-primary-gradient text-white font-semibold rounded-lg hover:shadow-glow-orange"
                  >
                    <Plus size={18} />
                    Add New
                  </button>
                </div>

                <div className="space-y-4">
                  {addresses.map((address) => (
                    <label
                      key={address.id}
                      className={`block p-4 border rounded-lg cursor-pointer transition-all ${
                        selectedAddress === address.id
                          ? 'border-primary-500 bg-primary-500/10'
                          : 'border-dark-700 hover:border-primary-500/50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="address"
                        value={address.id}
                        checked={selectedAddress === address.id}
                        onChange={() => setSelectedAddress(address.id)}
                        className="sr-only"
                      />
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-bold text-white mb-1">
                            {address.fullName}
                          </p>
                          <p className="text-sm text-gray-400">
                            {address.addressLine1}
                            {address.addressLine2 && `, ${address.addressLine2}`}
                          </p>
                          <p className="text-sm text-gray-400">
                            {address.city}, {address.state} - {address.pincode}
                          </p>
                          <p className="text-sm text-gray-400 mt-2">
                            Phone: {address.phone}
                          </p>
                        </div>
                        {address.isDefault && (
                          <span className="px-2 py-1 bg-primary-500 text-white text-xs font-bold rounded">
                            Default
                          </span>
                        )}
                      </div>
                    </label>
                  ))}
                </div>

                <button
                  onClick={() => setStep(2)}
                  disabled={!selectedAddress}
                  className="w-full mt-6 py-3 bg-primary-gradient text-white font-bold rounded-lg hover:shadow-glow-orange disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue to Payment
                </button>
              </motion.div>
            )}

            {/* Step 2: Payment Method */}
            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-dark-800 border border-dark-700 rounded-lg p-6"
              >
                <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-6">
                  <CreditCard size={24} className="text-primary-500" />
                  Payment Method
                </h2>

                <div className="space-y-4">
                  <label
                    className={`block p-4 border rounded-lg cursor-pointer transition-all ${
                      paymentMethod === 'RAZORPAY'
                        ? 'border-primary-500 bg-primary-500/10'
                        : 'border-dark-700 hover:border-primary-500/50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value="RAZORPAY"
                      checked={paymentMethod === 'RAZORPAY'}
                      onChange={() => setPaymentMethod('RAZORPAY')}
                      className="sr-only"
                    />
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-bold text-white">
                          Credit/Debit Card, UPI, Net Banking
                        </p>
                        <p className="text-sm text-gray-400">
                          Powered by Razorpay
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <img src="/visa.png" alt="Visa" className="h-6" />
                        <img src="/mastercard.png" alt="Mastercard" className="h-6" />
                        <img src="/upi.png" alt="UPI" className="h-6" />
                      </div>
                    </div>
                  </label>

                  <label
                    className={`block p-4 border rounded-lg cursor-pointer transition-all ${
                      paymentMethod === 'COD'
                        ? 'border-primary-500 bg-primary-500/10'
                        : 'border-dark-700 hover:border-primary-500/50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value="COD"
                      checked={paymentMethod === 'COD'}
                      onChange={() => setPaymentMethod('COD')}
                      className="sr-only"
                    />
                    <div>
                      <p className="font-bold text-white">Cash on Delivery</p>
                      <p className="text-sm text-gray-400">
                        Pay when you receive the order
                      </p>
                    </div>
                  </label>
                </div>

                <div className="flex gap-4 mt-6">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 py-3 bg-dark-700 text-white font-bold rounded-lg hover:bg-dark-600"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    className="flex-1 py-3 bg-primary-gradient text-white font-bold rounded-lg hover:shadow-glow-orange"
                  >
                    Continue to Review
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Order Review */}
            {step === 3 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-dark-800 border border-dark-700 rounded-lg p-6"
              >
                <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-6">
                  <ShoppingBag size={24} className="text-primary-500" />
                  Order Review
                </h2>

                <div className="space-y-4 mb-6">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 p-4 bg-dark-900 rounded-lg"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-white">{item.name}</p>
                        <p className="text-sm text-gray-400">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <p className="font-bold text-white">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="flex gap-4 mt-6">
                  <button
                    onClick={() => setStep(2)}
                    className="flex-1 py-3 bg-dark-700 text-white font-bold rounded-lg hover:bg-dark-600"
                  >
                    Back
                  </button>
                  <button
                    onClick={handlePlaceOrder}
                    disabled={loading}
                    className="flex-1 py-3 bg-primary-gradient text-white font-bold rounded-lg hover:shadow-glow-orange disabled:opacity-50"
                  >
                    {loading ? 'Processing...' : 'Place Order'}
                  </button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-dark-800 border border-dark-700 rounded-lg p-6 sticky top-24">
              <h3 className="text-lg font-bold text-white mb-6">
                Order Summary
              </h3>

              {/* Coupon Code */}
              <div className="mb-6">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="Coupon Code"
                    className="flex-1 px-4 py-2 bg-dark-900 border border-dark-700 text-white rounded-lg focus:outline-none focus:border-primary-500"
                  />
                  <button
                    onClick={applyCoupon}
                    className="px-4 py-2 bg-primary-500 text-white font-semibold rounded-lg hover:bg-primary-600"
                  >
                    Apply
                  </button>
                </div>
              </div>

              <div className="space-y-3 mb-6 pb-6 border-b border-dark-700">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal ({items.length} items)</span>
                  <span>₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-500">
                    <span>Discount</span>
                    <span>-₹{discount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-400">
                  <span>Shipping</span>
                  <span>
                    {shippingCost === 0 ? (
                      <span className="text-green-500">FREE</span>
                    ) : (
                      `₹${shippingCost}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Tax (18% GST)</span>
                  <span>₹{tax.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-between items-center text-xl font-bold text-white mb-6">
                <span>Total</span>
                <span>₹{total.toLocaleString('en-IN')}</span>
              </div>

              {subtotal < 999 && (
                <div className="flex items-start gap-2 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg text-sm">
                  <AlertCircle size={16} className="text-yellow-500 flex-shrink-0 mt-0.5" />
                  <p className="text-yellow-500">
                    Add ₹{(999 - subtotal).toFixed(2)} more to get FREE shipping!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
