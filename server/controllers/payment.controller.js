const Payment = require('../models/payment.model');
const Order = require('../models/order.model');
const { asyncHandler, AppError } = require('../middlewares/error');

const create = asyncHandler(async (req, res) => {
  const { orderId, method } = req.body;
  
  const order = await Order.findById(orderId);
  if (!order) throw new AppError('Order not found', 404);

  
  const payment = await Payment.create({
    order: orderId,
    user: req.user._id,
    method: method || 'cod',
    amount: order.totals.total,
    status: method === 'cod' ? 'pending' : 'pending',
  });
  
  // Update order payment status
  order.payment.method = method || 'cod';
  order.payment.status = method === 'cod' ? 'pending' : 'pending';
  await order.save();
  
  res.status(201).json({ success: true, data: payment });
});

const processPayment = asyncHandler(async (req, res) => {
  const { paymentId, transactionId, gatewayResponse } = req.body;
  
  const payment = await Payment.findById(paymentId);
  if (!payment) throw new AppError('Payment not found', 404);
  
  payment.transactionId = transactionId;
  payment.gatewayResponse = gatewayResponse;
  payment.status = 'paid';
  await payment.save();
  
  // Update order payment status
  await Order.findByIdAndUpdate(payment.order, {
    'payment.status': 'paid',
    'payment.transactionId': transactionId,
  });
  
  res.json({ success: true, data: payment });
});

const getByOrder = asyncHandler(async (req, res) => {
  const payments = await Payment.find({ order: req.params.orderId })
    .populate('order', 'orderNumber')
    .sort('-createdAt');
  res.json({ success: true, data: payments });
});

const refund = asyncHandler(async (req, res) => {
  const payment = await Payment.findById(req.params.id);
  if (!payment) throw new AppError('Payment not found', 404);
  if (payment.status !== 'paid') throw new AppError('Payment cannot be refunded', 400);
  
  payment.status = 'refunded';
  await payment.save();
  
  // Update order payment status
  await Order.findByIdAndUpdate(payment.order, {
    'payment.status': 'refunded',
  });
  
  res.json({ success: true, message: 'Payment refunded' });
});

module.exports = { create, processPayment, getByOrder, refund };