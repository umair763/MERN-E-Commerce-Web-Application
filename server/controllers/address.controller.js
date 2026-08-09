const Address = require('../models/address.model');
const { asyncHandler, AppError } = require('../middlewares/error');
const list = asyncHandler(async (req, res) =>
  res.json({
    success: true,
    data: await Address.find({ user: req.user._id, isActive: true }).sort(
      '-isDefault -createdAt',
    ),
  }),
);
const create = asyncHandler(async (req, res) => {
  if (req.body.isDefault)
    await Address.updateMany(
      { user: req.user._id },
      { $set: { isDefault: false } },
    );
  res
    .status(201)
    .json({
      success: true,
      data: await Address.create({ ...req.body, user: req.user._id }),
    });
});
const update = asyncHandler(async (req, res) => {
  if (req.body.isDefault)
    await Address.updateMany(
      { user: req.user._id },
      { $set: { isDefault: false } },
    );
  const value = await Address.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    req.body,
    { new: true, runValidators: true },
  );
  if (!value) throw new AppError('Address not found', 404);
  res.json({ success: true, data: value });
});
const remove = asyncHandler(async (req, res) => {
  await Address.updateOne(
    { _id: req.params.id, user: req.user._id },
    { $set: { isActive: false } },
  );
  res.json({ success: true, message: 'Address removed' });
});
module.exports = { list, create, update, remove };
