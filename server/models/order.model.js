const mongoose = require('mongoose');
const schema = new mongoose.Schema(
  {
    orderNumber: { type: String, unique: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        variantId: mongoose.Schema.Types.ObjectId,
        name: String,
        sku: String,
        quantity: Number,
        price: Number,
      },
    ],
    shippingAddress: Object,
    payment: {
      method: { 
        type: String, 
        enum: ['cod', 'online'],
        default: 'cod' 
      },
      status: {
        type: String,
        enum: ['pending', 'paid', 'failed', 'refunded'],
        default: 'pending',
      },
      transactionId: String,
    },
    totals: {
      subtotal: Number,
      discount: { type: Number, default: 0 },
      shipping: { type: Number, default: 0 },
      tax: { type: Number, default: 0 },
      total: Number,
    },
    status: {
      type: String,
      enum: [
        'pending',
        'confirmed',
        'processing',
        'shipped',
        'delivered',
        'cancelled',
        'returned',
      ],
      default: 'pending',
    },
    statusHistory: [
      {
        status: String,
        note: String,
        changedBy: mongoose.Schema.Types.ObjectId,
        changedAt: { type: Date, default: Date.now },
      },
    ],
    adminModified: {
      type: String,
      enum: ['edit', 'delete'],
    },
    adminModifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    adminModifiedAt: Date,
  },
  { timestamps: true },
);

module.exports = mongoose.models.Order || mongoose.model('Order', schema);
