const Permission = require('../models/permissions.model');
const { AppError, asyncHandler } = require('../middlewares/error');

const list = asyncHandler(async (req, res) => {
  const { module, action, isActive, page = 1, limit = 50, sort = 'module' } = req.query;
  const filter = { deletedAt: null };
  if (module) filter.module = module;
  if (action) filter.action = action;
  if (isActive !== undefined) filter.isActive = isActive === 'true';
  const skip = (+page - 1) * Math.min(+limit, 100);
  const [data, total] = await Promise.all([
    Permission.find(filter).sort(sort).skip(skip).limit(Math.min(+limit, 100)),
    Permission.countDocuments(filter),
  ]);
  res.json({
    success: true,
    data,
    meta: { page: +page, limit: +limit, total, pages: Math.ceil(total / +limit) },
  });
});

const get = asyncHandler(async (req, res) => {
  const data = await Permission.findOne({ _id: req.params.id, deletedAt: null });
  if (!data) throw new AppError('Permission not found', 404);
  res.json({ success: true, data });
});

const create = asyncHandler(async (req, res) => {
  const data = await Permission.create(req.body);
  res.status(201).json({ success: true, data });
});

const update = asyncHandler(async (req, res) => {
  const data = await Permission.findByIdAndUpdate(
    req.params.id,
    { ...req.body, updatedAt: Date.now() },
    { new: true, runValidators: true },
  );
  if (!data) throw new AppError('Permission not found', 404);
  res.json({ success: true, data });
});

const archive = asyncHandler(async (req, res) => {
  const data = await Permission.findByIdAndUpdate(req.params.id, { deletedAt: new Date() });
  if (!data) throw new AppError('Permission not found', 404);
  res.json({ success: true, message: 'Permission archived' });
});

module.exports = { list, get, create, update, archive };
