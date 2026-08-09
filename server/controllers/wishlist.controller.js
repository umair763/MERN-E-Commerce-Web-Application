const User = require('../models/user.model'),
  Product = require('../models/product.model');
const { asyncHandler, AppError } = require('../middlewares/error');
const { createAuditLog } = require('../helpers/audit.helper');
const list = asyncHandler(async (req, res) =>
  res.json({
    success: true,
    data:
      (await User.findById(req.user._id).populate('wishlist')).wishlist || [],
  }),
);
const add = asyncHandler(async (req, res) => {
  if (
    !(await Product.exists({
      _id: req.params.productId,
      deletedAt: null,
      status: 'active',
    }))
  )
    throw new AppError('Product not found', 404);
  const value = await User.findByIdAndUpdate(
    req.user._id,
    { $addToSet: { wishlist: req.params.productId } },
    { new: true },
  ).populate('wishlist');
  
  await createAuditLog(req.user._id, 'add', 'Wishlist', req.params.productId, null, { productId: req.params.productId });
  
  res.json({ success: true, data: value.wishlist });
});
const remove = asyncHandler(async (req, res) => {
  const value = await User.findByIdAndUpdate(
    req.user._id,
    { $pull: { wishlist: req.params.productId } },
    { new: true },
  ).populate('wishlist');
  
  await createAuditLog(req.user._id, 'remove', 'Wishlist', req.params.productId, { productId: req.params.productId }, null);
  
  res.json({ success: true, data: value.wishlist });
});
module.exports = { list, add, remove };
