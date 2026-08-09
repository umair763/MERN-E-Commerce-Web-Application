const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { asyncHandler } = require('../middlewares/error');
const User = require('../models/user.model');
const Role = require('../models/role.model');
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

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({ deletedAt: null })
    .populate('roles')
    .sort({ createdAt: -1 });
  
  res.json({ success: true, data: users });
});

const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findOne({ 
    _id: req.params.id, 
    deletedAt: null 
  }).populate('roles');
  
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }
  
  res.json({ success: true, data: publicUser(user) });
});

const createUser = asyncHandler(async (req, res) => {
  const { name, email, password, contact, roleNames } = req.body;
  
  if (await User.exists({ email })) {
    return res.status(409).json({ success: false, message: 'Email is already registered' });
  }
  
  const roles = [];
  if (roleNames && Array.isArray(roleNames)) {
    for (const roleName of roleNames) {
      const role = await Role.findOne({ name: roleName });
      if (role) roles.push(role._id);
    }
  }
  
  if (roles.length === 0) {
    const customerRole = await Role.findOne({ name: 'customer' });
    if (customerRole) roles.push(customerRole._id);
  }
  
  const user = await User.create({
    name,
    email,
    contact,
    password: await bcrypt.hash(password, 12),
    roles,
  });
  
  const populatedUser = await User.findById(user._id).populate('roles');
  
  setToken(res, issue(user));
  
  await createAuditLog(req.user._id, 'create', 'User', user._id, null, publicUser(populatedUser));
  
  res.status(201).json({
    success: true,
    message: 'User created successfully',
    data: publicUser(populatedUser),
  });
});

const updateUser = asyncHandler(async (req, res) => {
  const { name, email, contact, roleNames, status } = req.body;
  const userId = req.params.id;
  
  const user = await User.findOne({ _id: userId, deletedAt: null });
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }
  
  const oldUserData = publicUser(user);
  
  if (email && email !== user.email) {
    if (await User.exists({ email, _id: { $ne: userId } })) {
      return res.status(409).json({ success: false, message: 'Email is already in use' });
    }
  }
  
  const updateData = {};
  if (name) updateData.name = name;
  if (email) updateData.email = email;
  if (contact) updateData.contact = contact;
  if (status) updateData.status = status;
  
  if (roleNames && Array.isArray(roleNames)) {
    const roles = [];
    for (const roleName of roleNames) {
      const role = await Role.findOne({ name: roleName });
      if (role) roles.push(role._id);
    }
    updateData.roles = roles;
  }
  
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $set: updateData },
    { new: true, runValidators: true }
  ).populate('roles');
  
  await createAuditLog(req.user._id, 'update', 'User', userId, oldUserData, publicUser(updatedUser));
  
  res.json({
    success: true,
    message: 'User updated successfully',
    data: publicUser(updatedUser),
  });
});

const deleteUser = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  
  const user = await User.findOne({ _id: userId, deletedAt: null });
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }
  
  const oldUserData = publicUser(user);
  
  await User.findByIdAndUpdate(userId, { deletedAt: new Date() });
  
  await createAuditLog(req.user._id, 'delete', 'User', userId, oldUserData, null);
  
  res.json({ success: true, message: 'User deleted successfully' });
});

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
