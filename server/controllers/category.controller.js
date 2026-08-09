const Category = require('../models/category.model');
const { AppError, asyncHandler } = require('../middlewares/error');
const slugify = (value) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
const list = asyncHandler(async (req, res) =>
  res.json({
    success: true,
    data: await Category.find({ isActive: true }).sort('name'),
  }),
);
const create = asyncHandler(async (req, res) =>
  res
    .status(201)
    .json({
      success: true,
      data: await Category.create({
        ...req.body,
        slug: slugify(req.body.name),
      }),
    }),
);
const update = asyncHandler(async (req, res) => {
  const data = { ...req.body };
  if (data.name) data.slug = slugify(data.name);
  const value = await Category.findByIdAndUpdate(req.params.id, data, {
    new: true,
    runValidators: true,
  });
  if (!value) throw new AppError('Category not found', 404);
  res.json({ success: true, data: value });
});
const remove = asyncHandler(async (req, res) => {
  await Category.findByIdAndUpdate(req.params.id, { isActive: false });
  res.json({ success: true, message: 'Category archived' });
});
module.exports = { list, create, update, remove };
