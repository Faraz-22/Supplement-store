// src/lib/razorpay.ts
import Razorpay from 'razorpay';
import crypto from 'crypto';

export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export interface CreateOrderOptions {
  amount: number; // in paise (₹1 = 100 paise)
  currency?: string;
  receipt: string;
  notes?: Record<string, string>;
}

/**
 * Create Razorpay order
 */
export async function createRazorpayOrder(options: CreateOrderOptions) {
  try {
    const order = await razorpay.orders.create({
      amount: Math.round(options.amount * 100), // Convert to paise
      currency: options.currency || 'INR',
      receipt: options.receipt,
      notes: options.notes,
    });

    return order;
  } catch (error) {
    console.error('Razorpay order creation error:', error);
    throw new Error('Failed to create payment order');
  }
}

/**
 * Verify Razorpay payment signature
 */
export function verifyPaymentSignature(
  orderId: string,
  paymentId: string,
  signature: string
): boolean {
  try {
    const text = `${orderId}|${paymentId}`;
    const generated_signature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(text)
      .digest('hex');

    return generated_signature === signature;
  } catch (error) {
    console.error('Signature verification error:', error);
    return false;
  }
}

/**
 * Get payment details
 */
export async function getPaymentDetails(paymentId: string) {
  try {
    const payment = await razorpay.payments.fetch(paymentId);
    return payment;
  } catch (error) {
    console.error('Get payment details error:', error);
    throw new Error('Failed to fetch payment details');
  }
}

/**
 * Refund payment
 */
export async function refundPayment(paymentId: string, amount?: number) {
  try {
    const refund = await razorpay.payments.refund(paymentId, {
      amount: amount ? Math.round(amount * 100) : undefined,
    });
    return refund;
  } catch (error) {
    console.error('Refund error:', error);
    throw new Error('Failed to process refund');
  }
}

export default razorpay;
