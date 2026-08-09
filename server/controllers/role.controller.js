const Role = require('../models/role.model');
const { AppError, asyncHandler } = require('../middlewares/error');

const list = asyncHandler(async (req, res) => {
  const { isActive, page = 1, limit = 50, sort = 'level' } = req.query;
  const filter = { deletedAt: null };
  if (isActive !== undefined) filter.isActive = isActive === 'true';
  const skip = (+page - 1) * Math.min(+limit, 100);
  const [data, total] = await Promise.all([
    Role.find(filter)
      .populate('permissions')
      .sort(sort)
      .skip(skip)
      .limit(Math.min(+limit, 100)),
    Role.countDocuments(filter),
  ]);
  res.json({
    success: true,
    data,
    meta: { page: +page, limit: +limit, total, pages: Math.ceil(total / +limit) },
  });
});

const get = asyncHandler(async (req, res) => {
  const data = await Role.findOne({ _id: req.params.id, deletedAt: null }).populate('permissions');
  if (!data) throw new AppError('Role not found', 404);
  res.json({ success: true, data });
});

const create = asyncHandler(async (req, res) => {
  const data = await Role.create(req.body);
  res.status(201).json({ success: true, data });
});

const update = asyncHandler(async (req, res) => {
  const data = await Role.findByIdAndUpdate(
    req.params.id,
    { ...req.body, updatedAt: Date.now() },
    { new: true, runValidators: true },
  );
  if (!data) throw new AppError('Role not found', 404);
  res.json({ success: true, data });
});

const archive = asyncHandler(async (req, res) => {
  const data = await Role.findByIdAndUpdate(req.params.id, { deletedAt: new Date() });
  if (!data) throw new AppError('Role not found', 404);
  res.json({ success: true, message: 'Role archived' });
});

module.exports = { list, get, create, update, archive };
