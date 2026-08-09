const Product = require('../models/product.model');
const { AppError, asyncHandler } = require('../middlewares/error');
const slugify = (v) =>
  v
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
const list = asyncHandler(async (req, res) => {
  const {
    q,
    category,
    brand,
    size,
    color,
    minPrice,
    maxPrice,
    status = 'active',
    page = 1,
    limit = 20,
    sort = '-createdAt',
  } = req.query;
  const filter = { deletedAt: null, status };
  if (q) filter.$text = { $search: q };
  if (category) filter.category = category;
  if (brand) filter.brand = brand;
  if (size) filter['variants.size'] = size;
  if (color) filter['variants.color'] = color;
  if (minPrice || maxPrice)
    filter['variants.price'] = {
      ...(minPrice ? { $gte: +minPrice } : {}),
      ...(maxPrice ? { $lte: +maxPrice } : {}),
    };
  const skip = (+page - 1) * Math.min(+limit, 100);
  const [data, total] = await Promise.all([
    Product.find(filter)
      .populate('category', 'name slug')
      .sort(sort)
      .skip(skip)
      .limit(Math.min(+limit, 100)),
    Product.countDocuments(filter),
  ]);
  res.json({
    success: true,
    data,
    meta: {
      page: +page,
      limit: +limit,
      total,
      pages: Math.ceil(total / +limit),
    },
  });
});
const get = asyncHandler(async (req, res) => {
  const data = await Product.findOne({
    $or: [{ _id: req.params.id }, { slug: req.params.id }],
    deletedAt: null,
  }).populate('category');
  if (!data) throw new AppError('Product not found', 404);
  res.json({ success: true, data });
});
const create = asyncHandler(async (req, res) => {
  const data = await Product.create({
    ...req.body,
    slug: req.body.slug || slugify(req.body.name),
    createdBy: req.user._id,
  });
  res.status(201).json({ success: true, data });
});
const update = asyncHandler(async (req, res) => {
  const data = await Product.findByIdAndUpdate(
    req.params.id,
    { ...req.body, ...(req.body.name ? { slug: slugify(req.body.name) } : {}) },
    { new: true, runValidators: true },
  );
  if (!data) throw new AppError('Product not found', 404);
  res.json({ success: true, data });
});
const archive = asyncHandler(async (req, res) => {
  await Product.findByIdAndUpdate(req.params.id, {
    deletedAt: new Date(),
    status: 'inactive',
  });
  res.json({ success: true, message: 'Product archived' });
});
module.exports = { list, get, create, update, archive };
