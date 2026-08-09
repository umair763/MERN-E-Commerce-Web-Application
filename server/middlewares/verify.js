const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const { AppError, asyncHandler } = require('./error');

const verifyToken = asyncHandler(async (req, res, next) => {
  const token =
    req.cookies?.token || req.headers.authorization?.replace(/^Bearer\s+/i, '');
  if (!token) throw new AppError('Authentication required', 401);
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.SECRET_KEY);
  } catch {
    throw new AppError('Invalid or expired token', 401);
  }
  const user = await User.findOne({ _id: decoded.id, deletedAt: null })
    .select('+password')
    .populate('roles');
  if (!user || user.status === 'blocked')
    throw new AppError('User is not authorized', 401);
  req.user = user;
  next();
});

const requireRole =
  (...roles) =>
  (req, res, next) => {
    const assigned = (req.user?.roles || []).map((role) =>
      typeof role === 'string' ? role : role.name || role.slug,
    );
    if (
      !roles.some((role) => assigned.includes(role)) &&
      !assigned.includes('super_admin')
    )
      return next(new AppError('Insufficient permissions', 403));
    next();
  };

const requirePermission = (...requiredPermissions) => asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id).populate({
    path: 'roles',
    populate: {
      path: 'permissions',
      match: { deletedAt: null, isActive: true },
    },
  });

  const userPermissions = new Set();
  user.roles.forEach(role => {
    role.permissions.forEach(permission => {
      userPermissions.add(permission.key);
    });
  });

  const hasPermission = requiredPermissions.every(permission => userPermissions.has(permission));

  if (!hasPermission) {
    throw new AppError('Insufficient permissions for this action', 403);
  }

  next();
});

const requireAnyPermission = (...requiredPermissions) => asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id).populate({
    path: 'roles',
    populate: {
      path: 'permissions',
      match: { deletedAt: null, isActive: true },
    },
  });

  const userPermissions = new Set();
  user.roles.forEach(role => {
    role.permissions.forEach(permission => {
      userPermissions.add(permission.key);
    });
  });

  const hasPermission = requiredPermissions.some(permission => userPermissions.has(permission));

  if (!hasPermission) {
    throw new AppError('Insufficient permissions for this action', 403);
  }

  next();
});

module.exports = { verifyToken, requireRole, requirePermission, requireAnyPermission };
