const { asyncHandler } = require('../middlewares/error');
const Order = require('../models/order.model');
const User = require('../models/user.model');

const getCustomerDashboardStats = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  
  const [
    totalOrders,
    totalSpent,
    recentOrders,
    pendingOrders
  ] = await Promise.all([
    Order.countDocuments({ user: userId, deletedAt: null }),
    Order.aggregate([
      { $match: { user: userId, deletedAt: null, status: { $in: ['delivered', 'shipped'] } } },
      { $group: { _id: null, total: { $sum: '$totals.total' } } }
    ]),
    Order.find({ user: userId, deletedAt: null })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('orderNumber totals total status createdAt'),
    Order.countDocuments({ user: userId, deletedAt: null, status: 'pending' })
  ]);
  
  res.json({
    success: true,
    data: {
      totalOrders,
      totalSpent: totalSpent[0]?.total || 0,
      recentOrders,
      pendingOrders
    }
  });
});

module.exports = {
  getCustomerDashboardStats,
};
