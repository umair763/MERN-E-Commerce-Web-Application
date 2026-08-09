const Cart = require('../models/cart.model'),
  Product = require('../models/product.model');
const { AppError, asyncHandler } = require('../middlewares/error');
const get = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate(
    'items.product',
  );
  res.json({ success: true, data: cart || { items: [] } });
});
const add = asyncHandler(async (req, res) => {
  const { productId, variantId, quantity = 1 } = req.body;
  const product = await Product.findOne({
    _id: productId,
    deletedAt: null,
    status: 'active',
  });
  if (!product) throw new AppError('Product not found', 404);
  const variant = product.variants.id(variantId);
  if (!variant || variant.stock < quantity)
    throw new AppError('Insufficient stock', 409);
  let cart =
    (await Cart.findOne({ user: req.user._id })) ||
    new Cart({ user: req.user._id, items: [] });
  const item = cart.items.find(
    (i) =>
      i.product.toString() === productId &&
      String(i.variantId) === String(variantId),
  );
  if (item) item.quantity += quantity;
  else
    cart.items.push({
      product: productId,
      variantId,
      quantity,
      price: variant.salePrice || variant.price,
    });
  cart.subtotal = cart.items.reduce((sum, i) => sum + i.quantity * i.price, 0);
  await cart.save();
  res
    .status(201)
    .json({ success: true, data: await cart.populate('items.product') });
});
const update = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) throw new AppError('Cart not found', 404);
  const item = cart.items.id(req.params.itemId);
  if (!item) throw new AppError('Cart item not found', 404);
  item.quantity = req.body.quantity;
  cart.subtotal = cart.items.reduce((s, i) => s + i.quantity * i.price, 0);
  await cart.save();
  res.json({ success: true, data: cart });
});
const remove = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (cart) {
    cart.items.pull(req.params.itemId);
    cart.subtotal = cart.items.reduce((s, i) => s + i.quantity * i.price, 0);
    await cart.save();
  }
  res.json({ success: true, data: cart || { items: [] } });
});
const clear = asyncHandler(async (req, res) => {
  await Cart.findOneAndUpdate(
    { user: req.user._id },
    { $set: { items: [], subtotal: 0 } },
  );
  res.json({ success: true, message: 'Cart cleared' });
});
module.exports = { get, add, update, remove, clear };
