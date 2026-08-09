const { asyncHandler } = require('../middlewares/error');
const Order = require('../models/order.model');
const Product = require('../models/product.model');
const User = require('../models/user.model');
const Role = require('../models/role.model');

const getSuperAdminDashboardStats = asyncHandler(async (req, res) => {
  const customerRole = await Role.findOne({ name: 'customer' });
  const adminRole = await Role.findOne({ name: 'admin' });
  
  const [
    totalOrders,
    totalRevenue,
    totalProducts,
    totalCustomers,
    totalAdmins,
    recentOrders,
    orderStatusBreakdown,
    recentUsers
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
    adminRole ? User.countDocuments({ 
      roles: adminRole._id,
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
    ]),
    User.find({ deletedAt: null })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('roles')
      .select('name email status createdAt')
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
      totalAdmins,
      recentOrders,
      orderStatusBreakdown: statusMap,
      recentUsers
    }
  });
});

module.exports = {
  getSuperAdminDashboardStats,
};
