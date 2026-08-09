const Order = require('../models/order.model'),
  Cart = require('../models/cart.model'),
  Product = require('../models/product.model');
const { AppError, asyncHandler } = require('../middlewares/error');
const { generateOrderId } = require('../utils/idGenerator');
const { createAuditLog } = require('../helpers/audit.helper');

const create = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart || !cart.items.length) throw new AppError('Cart is empty', 400);
  const items = [];
  let subtotal = 0;
  for (const line of cart.items) {
    const product = await Product.findOne({
      _id: line.product,
      deletedAt: null,
      status: 'active',
    });
    if (!product) throw new AppError('A product is no longer available', 409);
    const variant = product.variants.id(line.variantId);
    if (!variant || variant.stock < line.quantity)
      throw new AppError(`Insufficient stock for ${product.name}`, 409);
    const price = variant.salePrice || variant.price;
    items.push({
      product: product._id,
      variantId: variant._id,
      name: product.name,
      sku: variant.sku,
      quantity: line.quantity,
      price,
    });
    subtotal += price * line.quantity;
  }
  const shipping = subtotal >= 100 ? 0 : 10;
  const tax = +(subtotal * 0.08).toFixed(2);
  const order = await Order.create({
    orderNumber: generateOrderId(),
    user: req.user._id,
    items,
    shippingAddress: req.body.shippingAddress,
    payment: {
      method: req.body.paymentMethod || 'cod',
      status: 'pending',
    },
    totals: {
      subtotal,
      discount: 0,
      shipping,
      tax,
      total: subtotal + shipping + tax,
    },
    statusHistory: [{ status: 'pending', changedBy: req.user._id }],
  });
  for (const line of items)
    await Product.updateOne(
      { _id: line.product, 'variants._id': line.variantId },
      { $inc: { 'variants.$.stock': -line.quantity } },
    );
  await Cart.findOneAndUpdate(
    { user: req.user._id },
    { $set: { items: [], subtotal: 0, status: 'checked_out' } },
  );
  
  await createAuditLog(req.user._id, 'create', 'Order', order._id, null, { orderNumber: order.orderNumber, total: order.totals.total });
  
  res.status(201).json({ success: true, data: order });
});
const mine = asyncHandler(async (req, res) =>
  res.json({
    success: true,
    data: await Order.find({ user: req.user._id })
      .populate('items.product', 'name image')
      .sort('-createdAt'),
  }),
);
const get = asyncHandler(async (req, res) => {
  const o = await Order.findOne({ _id: req.params.id, user: req.user._id });
  if (!o) throw new AppError('Order not found', 404);
  res.json({ success: true, data: o });
});
const cancel = asyncHandler(async (req, res) => {
  const o = await Order.findOne({ _id: req.params.id, user: req.user._id });
  if (!o) throw new AppError('Order not found', 404);
  if (o.status !== 'pending')
    throw new AppError('Order can only be cancelled in pending state', 409);
  o.status = 'cancelled';
  o.statusHistory.push({ status: 'cancelled', changedBy: req.user._id });
  await o.save();
  res.json({ success: true, data: o });
});
const adminList = asyncHandler(async (req, res) =>
  res.json({
    success: true,
    data: await Order.find().populate('user', 'name email').sort('-createdAt'),
  }),
);
const updateStatus = asyncHandler(async (req, res) => {
  const o = await Order.findById(req.params.id);
  if (!o) throw new AppError('Order not found', 404);
  
  const { status, note } = req.body;
  if (!status) throw new AppError('Status is required', 400);
  
  o.status = status;
  o.statusHistory.push({
    status: o.status,
    note: note || '',
    changedBy: req.user._id,
  });
  await o.save();
  res.json({ success: true, data: o });
});
const adminUpdate = asyncHandler(async (req, res) => {
  const o = await Order.findById(req.params.id);
  if (!o) throw new AppError('Order not found', 404);
  
  const updates = req.body;
  if (updates.shippingAddress) o.shippingAddress = updates.shippingAddress;
  if (updates.totals) o.totals = updates.totals;
  if (updates.items) o.items = updates.items;
  if (updates.status) {
    o.status = updates.status;
    o.statusHistory.push({
      status: o.status,
      note: 'Updated by admin',
      changedBy: req.user._id,
    });
  }
  
  o.adminModified = 'edit';
  o.adminModifiedBy = req.user._id;
  o.adminModifiedAt = new Date();
  
  await o.save();
  res.json({ success: true, data: o });
});
const adminDelete = asyncHandler(async (req, res) => {
  const o = await Order.findById(req.params.id);
  if (!o) throw new AppError('Order not found', 404);
  
  o.status = 'cancelled';
  o.adminModified = 'delete';
  o.adminModifiedBy = req.user._id;
  o.adminModifiedAt = new Date();
  
  await o.save();
  res.json({ success: true, message: 'Order deleted by admin' });
});
module.exports = { create, mine, get, cancel, adminList, updateStatus, adminUpdate, adminDelete };
