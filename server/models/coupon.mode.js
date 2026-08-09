const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    unique: true,
    uppercase: true,
  },

  type: {
    type: String,
    enum: ['percentage', 'fixed'],
  },

  value: Number,

  minimumOrderAmount: Number,

  usageLimit: Number,

  usedCount: {
    type: Number,
    default: 0,
  },

  expiresAt: Date,

  isActive: {
    type: Boolean,
    default: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Coupon', couponSchema);
