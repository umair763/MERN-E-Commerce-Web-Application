const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const Role = require('../models/role.model');
const { AppError, asyncHandler } = require('../middlewares/error');
const { createAuditLog } = require('../helpers/audit.helper');

const publicUser = (user) => {
  const value = user.toObject ? user.toObject() : user;
  delete value.password;
  return value;
};
const issue = (user) =>
  jwt.sign({ id: user._id.toString() }, process.env.SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
const setToken = (res, token) =>
  res.cookie('token', token, {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

const register = asyncHandler(async (req, res) => {
  const { name, email, password, contact } = req.body;
  if (await User.exists({ email }))
    throw new AppError('Email is already registered', 409);
  const customerRole = await Role.findOne({ name: 'customer' });
  const user = await User.create({
    name,
    email,
    contact,
    password: await bcrypt.hash(password, 12),
    roles: customerRole ? [customerRole._id] : [],
  });
  setToken(res, issue(user));
  
  await createAuditLog(user._id, 'create', 'User', user._id, null, publicUser(user));
  
  res
    .status(201)
    .json({
      success: true,
      message: 'Account created',
      data: publicUser(user),
    });
});
const login = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email, deletedAt: null })
    .select('+password')
    .populate('roles');
  if (!user || !(await bcrypt.compare(req.body.password, user.password)))
    throw new AppError('Invalid email or password', 401);
  if (user.status !== 'active')
    throw new AppError('Account is not active', 403);
  setToken(res, issue(user));
  res.json({
    success: true,
    message: 'Login successful',
    data: publicUser(user),
  });
});
const logout = asyncHandler(async (req, res) => {
  res.clearCookie('token');
  res.json({ success: true, message: 'Logged out successfully' });
});
const profile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate('roles');
  res.json({ success: true, data: publicUser(user) });
});
const updateProfile = asyncHandler(async (req, res) => {
  if (
    req.body.email &&
    (await User.exists({ email: req.body.email, _id: { $ne: req.user._id } }))
  )
    throw new AppError('Email is already in use', 409);
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $set: req.body },
    { new: true, runValidators: true },
  );
  res.json({
    success: true,
    message: 'Profile updated',
    data: publicUser(user),
  });
});
const changePassword = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('+password');
  if (!(await bcrypt.compare(req.body.currentPassword, user.password)))
    throw new AppError('Current password is incorrect', 400);
  user.password = await bcrypt.hash(req.body.newPassword, 12);
  await user.save();
  res.clearCookie('token');
  res.json({ success: true, message: 'Password changed; please log in again' });
});

const adminLogin = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email, deletedAt: null })
    .select('+password')
    .populate('roles');
  if (!user || !(await bcrypt.compare(req.body.password, user.password)))
    throw new AppError('Invalid email or password', 401);
  if (user.status !== 'active')
    throw new AppError('Account is not active', 403);
  const hasAdminRole = user.roles.some(role => role.name === 'admin' || role.name === 'super_admin');
  if (!hasAdminRole)
    throw new AppError('Access denied. Admin or Super Admin account required.', 403);
  setToken(res, issue(user));
  res.json({
    success: true,
    message: 'Admin login successful',
    data: publicUser(user),
  });
});

const superAdminLogin = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email, deletedAt: null })
    .select('+password')
    .populate('roles');
  if (!user || !(await bcrypt.compare(req.body.password, user.password)))
    throw new AppError('Invalid email or password', 401);
  if (user.status !== 'active')
    throw new AppError('Account is not active', 403);
  const hasSuperAdminRole = user.roles.some(role => role.name === 'super_admin');
  if (!hasSuperAdminRole)
    throw new AppError('Access denied. Super Admin account required.', 403);
  setToken(res, issue(user));
  res.json({
    success: true,
    message: 'Super Admin login successful',
    data: publicUser(user),
  });
});

const createAdmin = asyncHandler(async (req, res) => {
  const { name, email, password, contact } = req.body;
  if (await User.exists({ email }))
    throw new AppError('Email is already registered', 409);
  const adminRole = await Role.findOne({ name: 'admin' });
  if (!adminRole)
    throw new AppError('Admin role not found', 500);
  const user = await User.create({
    name,
    email,
    contact,
    password: await bcrypt.hash(password, 12),
    roles: [adminRole._id],
  });
  res
    .status(201)
    .json({
      success: true,
      message: 'Admin account created',
      data: publicUser(user),
    });
});

const getCustomers = asyncHandler(async (req, res) => {
  const customerRole = await Role.findOne({ name: 'customer' });
  if (!customerRole) {
    return res.json({ success: true, data: [] });
  }
  
  const customers = await User.find({
    roles: customerRole._id,
    deletedAt: null
  }).populate('roles');
  
  res.json({ success: true, data: customers });
});

module.exports = {
  register,
  login,
  logout,
  profile,
  updateProfile,
  changePassword,
  adminLogin,
  superAdminLogin,
  createAdmin,
  getCustomers,
};
