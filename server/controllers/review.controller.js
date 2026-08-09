const Review = require('../models/review.model');
const Product = require('../models/product.model');
const { asyncHandler, AppError } = require('../middlewares/error');
const list = asyncHandler(async (req, res) =>
  res.json({
    success: true,
    data: await Review.find({ product: req.params.productId })
      .populate('user', 'name')
      .sort('-createdAt'),
  }),
);
const mine = asyncHandler(async (req, res) =>
  res.json({
    success: true,
    data: await Review.find({ user: req.user._id })
      .populate('user', 'name email')
      .populate('product', 'name image')
      .sort('-createdAt'),
  }),
);
const create = asyncHandler(async (req, res) => {
  const value = await Review.create({
    user: req.user._id,
    product: req.params.productId,
    ...req.body,
  });
  const stats = await Review.aggregate([
    { $match: { product: value.product } },
    { $group: { _id: null, average: { $avg: '$rating' }, count: { $sum: 1 } } },
  ]);
  await Product.findByIdAndUpdate(value.product, {
    $set: {
      rating: { average: +stats[0].average.toFixed(2), count: stats[0].count },
    },
  });
  res.status(201).json({ success: true, data: value });
});
const remove = asyncHandler(async (req, res) => {
  const value = await Review.findOneAndDelete({
    _id: req.params.id,
    user: req.user._id,
  });
  if (!value) throw new AppError('Review not found', 404);
  res.json({ success: true, message: 'Review deleted' });
});
const adminList = asyncHandler(async (req, res) =>
  res.json({
    success: true,
    data: await Review.find()
      .populate('user', 'name email')
      .populate('product', 'name image')
      .sort('-createdAt'),
  }),
);
const adminDelete = asyncHandler(async (req, res) => {
  const value = await Review.findByIdAndDelete(req.params.id);
  if (!value) throw new AppError('Review not found', 404);
  
  const stats = await Review.aggregate([
    { $match: { product: value.product } },
    { $group: { _id: null, average: { $avg: '$rating' }, count: { $sum: 1 } } },
  ]);
  if (stats.length > 0) {
    await Product.findByIdAndUpdate(value.product, {
      $set: {
        rating: { average: +stats[0].average.toFixed(2), count: stats[0].count },
      },
    });
  } else {
    await Product.findByIdAndUpdate(value.product, {
      $set: { rating: { average: 0, count: 0 } },
    });
  }
  
  res.json({ success: true, message: 'Review deleted' });
});
module.exports = { list, mine, create, remove, adminList, adminDelete };
