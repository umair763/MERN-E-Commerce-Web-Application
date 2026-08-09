const mongoose = require('mongoose');
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 80,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: { type: String, required: true, select: false },
    contact: { type: String, trim: true },
    roles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Role' }],
    profile_img: String,
    status: {
      type: String,
      enum: ['active', 'blocked', 'pending'],
      default: 'active',
      index: true,
    },
    addresses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Address' }],
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    emailVerifiedAt: Date,
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true },
);
module.exports = mongoose.models.User || mongoose.model('User', userSchema);
