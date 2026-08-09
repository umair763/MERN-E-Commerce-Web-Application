const mongoose = require('mongoose');
const schema = new mongoose.Schema(
  {
    code: { type: String, unique: true, uppercase: true, trim: true },
    type: { type: String, enum: ['percent', 'fixed'], required: true },
    value: { type: Number, min: 0, required: true },
    minOrder: { type: Number, default: 0 },
    maxDiscount: Number,
    startsAt: Date,
    expiresAt: Date,
    usageLimit: Number,
    usedCount: { type: Number, default: 0 },
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);
module.exports = mongoose.models.Coupon || mongoose.model('Coupon', schema);
