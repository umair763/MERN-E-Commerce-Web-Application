const mongoose = require('mongoose');
const schema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    title: String,
    comment: String,
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'approved',
    },
  },
  { timestamps: true },
);
schema.index({ user: 1, product: 1 }, { unique: true });
module.exports = mongoose.models.Review || mongoose.model('Review', schema);
