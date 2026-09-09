/**
 * Payment Gateway Abstraction Module
 * Abstracts payment processor logic (e.g. Razorpay, Stripe, COD)
 */

export async function processPayment({ amount, currency = 'USD', paymentMethod = 'CARD', customerInfo = {} }) {
  // Simulate network processing delay for realistic UX
  await new Promise((resolve) => setTimeout(resolve, 1200));

  const transactionId = `TXN-${paymentMethod}-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

  switch (paymentMethod) {
    case 'CARD':
    case 'UPI':
    case 'NETBANKING':
      return {
        success: true,
        transactionId,
        paymentStatus: 'COMPLETED',
        method: paymentMethod,
        amount,
        currency,
        message: 'Payment processed successfully',
        timestamp: new Date().toISOString(),
      };
    case 'COD':
      return {
        success: true,
        transactionId: `COD-${Date.now()}`,
        paymentStatus: 'PENDING_ON_DELIVERY',
        method: 'CASH_ON_DELIVERY',
        amount,
        currency,
        message: 'Order placed with Cash on Delivery',
        timestamp: new Date().toISOString(),
      };
    default:
      throw new Error(`Unsupported payment method: ${paymentMethod}`);
  }
}

export default {
  processPayment,
};
