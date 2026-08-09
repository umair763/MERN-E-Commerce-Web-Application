const Order = require('../models/order.model'),
Product = require('../models/product.model');
const { asyncHandler } = require('../middlewares/error');

const dashboard = asyncHandler(async (req, res) => {
  const [orders, revenue, products, lowStock] = await Promise.all([
    Order.countDocuments(),
    Order.aggregate([
      { $match: { 'payment.status': 'paid' } },
      { $group: { _id: null, total: { $sum: '$totals.total' } } },
    ]),
    Product.countDocuments({ deletedAt: null }),
    Product.countDocuments({ 'variants.stock': { $lte: 5 }, deletedAt: null }),
  ]);
  res.json({
    success: true,
    data: { orders, revenue: revenue[0]?.total || 0, products, lowStock },
  });
});

module.exports = { dashboard };
