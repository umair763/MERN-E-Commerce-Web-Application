const mongoose = require('mongoose');
const schema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        variantId: mongoose.Schema.Types.ObjectId,
        quantity: { type: Number, min: 1, default: 1 },
        price: Number,
      },
    ],
    status: {
      type: String,
      enum: ['active', 'checked_out', 'abandoned'],
      default: 'active',
    },
    subtotal: { type: Number, default: 0 },
  },
  { timestamps: true },
);
module.exports = mongoose.models.Cart || mongoose.model('Cart', schema);
