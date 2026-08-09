const { asyncHandler } = require('../middlewares/error');
const Order = require('../models/order.model');
const Product = require('../models/product.model');
const User = require('../models/user.model');
const Role = require('../models/role.model');

const getAdminDashboardStats = asyncHandler(async (req, res) => {
  const customerRole = await Role.findOne({ name: 'customer' });
  
  const [
    totalOrders,
    totalRevenue,
    totalProducts,
    totalCustomers,
    recentOrders,
    orderStatusBreakdown
  ] = await Promise.all([
    Order.countDocuments({ deletedAt: null }),
    Order.aggregate([
      { $match: { deletedAt: null } },
      { $group: { _id: null, total: { $sum: '$totals.total' } } }
    ]),
    Product.countDocuments({ deletedAt: null }),
    customerRole ? User.countDocuments({ 
      roles: customerRole._id,
      deletedAt: null 
    }) : 0,
    Order.find({ deletedAt: null })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('user', 'name email')
      .select('orderNumber totals total status createdAt'),
    Order.aggregate([
      { $match: { deletedAt: null } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ])
  ]);
  
  const statusMap = {};
  orderStatusBreakdown.forEach(item => {
    statusMap[item._id] = item.count;
  });
  
  res.json({
    success: true,
    data: {
      totalOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
      totalProducts,
      totalCustomers,
      recentOrders,
      orderStatusBreakdown: statusMap
    }
  });
});

module.exports = {
  getAdminDashboardStats,
};
