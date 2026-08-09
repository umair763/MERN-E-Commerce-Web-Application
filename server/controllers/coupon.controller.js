const Coupon = require('../models/coupon.model');
const { asyncHandler, AppError } = require('../middlewares/error');
const { generateCouponCode } = require('../utils/idGenerator');
const list = asyncHandler(async (req, res) =>
  res.json({
    success: true,
    data: await Coupon.find({ isActive: true }).sort('-createdAt'),
  }),
);
const available = asyncHandler(async (req, res) => {
  const now = new Date();
  const coupons = await Coupon.find({
    isActive: true,
    $or: [
      { startsAt: { $lte: now } },
      { startsAt: null },
    ],
    $or: [
      { expiresAt: { $gte: now } },
      { expiresAt: null },
    ],
  }).sort('-createdAt');
  res.json({ success: true, data: coupons });
});
const userCoupons = asyncHandler(async (req, res) => {
  const now = new Date();
  const coupons = await Coupon.find({
    isActive: true,
    users: req.user._id,
    $or: [
      { expiresAt: { $gte: now } },
      { expiresAt: null },
    ],
  }).sort('-createdAt');
  res.json({ success: true, data: coupons });
});
const register = asyncHandler(async (req, res) => {
  const { code } = req.body;
  const coupon = await Coupon.findOne({
    code: code.toUpperCase(),
    isActive: true,
  });
  
  if (!coupon) throw new AppError('Invalid coupon code', 404);
  
  const now = new Date();
  if (coupon.expiresAt && coupon.expiresAt < now) {
    throw new AppError('Coupon has expired', 400);
  }
  if (coupon.startsAt && coupon.startsAt > now) {
    throw new AppError('Coupon is not yet active', 400);
  }
  if (coupon.users.includes(req.user._id)) {
    throw new AppError('Coupon already registered to your account', 400);
  }
  
  coupon.users.push(req.user._id);
  await coupon.save();
  
  res.json({ success: true, data: coupon });
});
const create = asyncHandler(async (req, res) => {
  const couponData = {
    ...req.body,
    code: req.body.code || generateCouponCode(),
  };
  res.status(201).json({ success: true, data: await Coupon.create(couponData) });
});
const update = asyncHandler(async (req, res) => {
  const value = await Coupon.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!value) throw new AppError('Coupon not found', 404);
  res.json({ success: true, data: value });
});
const remove = asyncHandler(async (req, res) => {
  await Coupon.findByIdAndUpdate(req.params.id, { isActive: false });
  res.json({ success: true, message: 'Coupon disabled' });
});
const validate = asyncHandler(async (req, res) => {
  const c = await Coupon.findOne({
    code: req.body.code.toUpperCase(),
    isActive: true,
  });
  if (
    !c ||
    (c.expiresAt && c.expiresAt < new Date()) ||
    (c.startsAt && c.startsAt > new Date()) ||
    (c.usageLimit && c.usedCount >= c.usageLimit) ||
    req.body.orderTotal < c.minOrder
  )
    throw new AppError('Coupon is not valid', 400);
  let discount =
    c.type === 'percent' ? (req.body.orderTotal * c.value) / 100 : c.value;
  if (c.maxDiscount) discount = Math.min(discount, c.maxDiscount);
  
  // Increment used count
  await Coupon.findByIdAndUpdate(c._id, { $inc: { usedCount: 1 } });
  
  res.json({
    success: true,
    data: { code: c.code, discount: +discount.toFixed(2) },
  });
});
module.exports = { list, available, userCoupons, register, create, update, remove, validate };
