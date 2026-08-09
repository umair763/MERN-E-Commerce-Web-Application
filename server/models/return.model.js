const mongoose = require('mongoose');
const schema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    reason: { type: String, required: true },
    items: [{ product: mongoose.Schema.Types.ObjectId, quantity: Number }],
    status: {
      type: String,
      enum: ['requested', 'processing', 'accepted', 'rejected'],
      default: 'requested',
    },
    approvedBy: mongoose.Schema.Types.ObjectId,
    resolutionNote: String,
  },
  { timestamps: true },
);
module.exports = mongoose.models.Return || mongoose.model('Return', schema);
