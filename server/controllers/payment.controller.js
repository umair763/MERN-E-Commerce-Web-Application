const stripe = require('../config/stripe');
const Payment = require('../models/payment.model');
const Order = require('../models/order.model');
const { AppError, asyncHandler } = require('../middlewares/error');

/**
 * Create a Stripe Checkout Session.
 *
 * POST /api/payments/checkout
 *
 * Expected body: { "orderId": "..." }
 *
 * The amount is always taken from the order in MongoDB —
 * never from the frontend.
 */
const createCheckoutSession = asyncHandler(async (req, res) => {
  const { orderId } = req.body;

  if (!orderId) throw new AppError('orderId is required', 400);

  if (!req.user || !req.user._id)
    throw new AppError('User authentication is required', 401);

  /*
   * Get the actual order from MongoDB, scoped to the
   * authenticated user.
   */
  const order = await Order.findOne({ _id: orderId, user: req.user._id });
  if (!order) throw new AppError('Order not found', 404);

  if (order.payment.status === 'paid')
    throw new AppError('Order has already been paid', 400);

  /*
   * Amount comes from the backend/database only.
   * Order totals are stored in major units (e.g. $25.99);
   * Stripe requires the smallest currency unit (2599).
   */
  const amount = Math.round(order.totals.total * 100);
  if (!Number.isInteger(amount) || amount <= 0)
    throw new AppError('Invalid order amount', 400);

  const currency = 'usd';

  /*
   * Reuse a pending payment if one already exists for this
   * order (one Payment document per order).
   */
  let payment = await Payment.findOne({ order: order._id });
  if (payment && payment.status === 'paid')
    throw new AppError('Payment has already been completed', 400);

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: [
      {
        price_data: {
          currency,
          product_data: {
            name: `Order #${order.orderNumber || order._id}`,
          },
          unit_amount: amount,
        },
        quantity: 1,
      },
    ],
    customer_email: req.user.email,
    success_url:
      `${process.env.FRONTEND_URL}/payment/success` +
      `?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.FRONTEND_URL}/payment/cancel`,
    /*
     * Metadata lets the webhook identify the MongoDB records
     * associated with this payment.
     */
    metadata: {
      orderId: order._id.toString(),
      userId: req.user._id.toString(),
    },
    client_reference_id: order._id.toString(),
  });

  if (!payment) {
    payment = new Payment({
      order: order._id,
      user: req.user._id,
      method: 'online',
      status: 'pending',
      amount,
      currency,
      stripeSessionId: session.id,
    });
  } else {
    payment.method = 'online';
    payment.status = 'pending';
    payment.amount = amount;
    payment.currency = currency;
    payment.stripeSessionId = session.id;
  }

  await payment.save();

  /*
   * Only the Checkout URL reaches the frontend — the secret
   * Stripe key never leaves the server.
   */
  res.status(200).json({
    success: true,
    url: session.url,
    sessionId: session.id,
    paymentId: payment._id,
  });
});

/**
 * Stripe Webhook.
 *
 * POST /api/payments/webhook
 *
 * Registered in index.js with express.raw() so the raw body
 * is available for signature verification.
 */
const handleStripeWebhook = asyncHandler(async (req, res) => {
  const signature = req.headers['stripe-signature'];

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (error) {
    throw new AppError(
      `Webhook signature verification failed: ${error.message}`,
      400,
    );
  }

  switch (event.type) {
    /*
     * Customer successfully completed Checkout.
     */
    case 'checkout.session.completed': {
      const session = event.data.object;

      const payment = await Payment.findOne({ stripeSessionId: session.id });
      if (!payment) {
        console.error('Payment not found for Stripe session:', session.id);
        break;
      }

      /*
       * Idempotency protection — Stripe may retry webhooks.
       */
      if (payment.status === 'paid') break;

      payment.status = 'paid';
      payment.transactionId = session.payment_intent || undefined;
      payment.stripePaymentIntentId = session.payment_intent || undefined;
      payment.paidAt = new Date();
      payment.gatewayResponse = {
        eventId: event.id,
        eventType: event.type,
        checkoutSessionId: session.id,
        paymentStatus: session.payment_status,
      };
      await payment.save();

      /*
       * Mark the order as paid. Order schema stores payment
       * info nested under `payment`.
       */
      await Order.findByIdAndUpdate(payment.order, {
        $set: {
          'payment.status': 'paid',
          'payment.transactionId': payment.transactionId,
        },
      });

      /*
       * STAGE 3 (order fulfillment): inventory was already
       * reserved when the order was created — add email
       * confirmation + any fulfillment jobs here.
       */

      console.log(`Payment ${payment._id} marked as paid`);
      break;
    }

    /*
     * Checkout session expired without payment.
     */
    case 'checkout.session.expired': {
      const session = event.data.object;

      const payment = await Payment.findOne({ stripeSessionId: session.id });
      if (!payment || payment.status === 'paid') break;

      payment.status = 'failed';
      payment.gatewayResponse = {
        eventId: event.id,
        eventType: event.type,
        checkoutSessionId: session.id,
      };
      await payment.save();
      break;
    }

    /*
     * Payment failed.
     */
    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object;

      const payment = await Payment.findOne({
        stripePaymentIntentId: paymentIntent.id,
      });
      if (!payment || payment.status === 'paid') break;

      payment.status = 'failed';
      payment.gatewayResponse = {
        eventId: event.id,
        eventType: event.type,
        paymentIntentId: paymentIntent.id,
        failureMessage: paymentIntent.last_payment_error?.message,
      };
      await payment.save();
      break;
    }

    /*
     * Payment refunded.
     */
    case 'charge.refunded': {
      const charge = event.data.object;

      const payment = await Payment.findOne({
        stripePaymentIntentId: charge.payment_intent,
      });
      if (!payment) break;

      payment.status = 'refunded';
      payment.refundedAt = new Date();
      payment.gatewayResponse = {
        eventId: event.id,
        eventType: event.type,
        chargeId: charge.id,
        paymentIntentId: charge.payment_intent,
      };
      await payment.save();

      await Order.findByIdAndUpdate(payment.order, {
        $set: { 'payment.status': 'refunded' },
      });
      break;
    }

    default:
      console.log(`Unhandled Stripe event: ${event.type}`);
  }

  /*
   * Stripe needs a 2xx response as soon as possible.
   */
  res.status(200).json({ received: true });
});

/**
 * Look up a payment by its Stripe Checkout session ID.
 *
 * GET /api/payments/session/:sessionId
 *
 * Used by the success page after Stripe redirects the
 * customer back to the app.
 *
 * If the local payment is still `pending`, also ask Stripe
 * directly for the session status. This covers dev
 * environments where the Stripe webhook has not been
 * configured (Stripe CLI / ngrok) — the webhook remains the
 * source of truth in production.
 */
const getPaymentBySession = asyncHandler(async (req, res) => {
  const { sessionId } = req.params;

  let payment = await Payment.findOne({
    stripeSessionId: sessionId,
    user: req.user._id,
  }).populate('order');

  if (!payment) throw new AppError('Payment not found', 404);

  if (payment.status === 'pending') {
    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId);

      if (session.payment_status === 'paid') {
        payment.status = 'paid';
        payment.transactionId = session.payment_intent || undefined;
        payment.stripePaymentIntentId = session.payment_intent || undefined;
        payment.paidAt = new Date();
        payment.gatewayResponse = {
          eventType: 'checkout.session.completed (manual verify)',
          checkoutSessionId: session.id,
          paymentStatus: session.payment_status,
        };
        await payment.save();

        await Order.findByIdAndUpdate(payment.order, {
          $set: {
            'payment.status': 'paid',
            'payment.transactionId': payment.transactionId,
          },
        });

        payment = await Payment.findById(payment._id).populate('order');
      } else if (session.status === 'expired') {
        payment.status = 'failed';
        payment.gatewayResponse = {
          eventType: 'checkout.session.expired (manual verify)',
          checkoutSessionId: session.id,
        };
        await payment.save();
      }
    } catch (stripeErr) {
      console.error('Stripe session verify error:', stripeErr.message);
      // Fall through — return whatever local state we have.
    }
  }

  res.json({ success: true, data: payment });
});

/**
 * Get a payment belonging to the current user.
 *
 * GET /api/payments/:paymentId
 */
const getPayment = asyncHandler(async (req, res) => {
  const { paymentId } = req.params;

  const payment = await Payment.findOne({
    _id: paymentId,
    user: req.user._id,
  }).populate('order');

  if (!payment) throw new AppError('Payment not found', 404);

  res.json({ success: true, data: payment });
});

module.exports = {
  createCheckoutSession,
  handleStripeWebhook,
  getPaymentBySession,
  getPayment,
};
