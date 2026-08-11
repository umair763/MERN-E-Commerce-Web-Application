const mongoose = require('mongoose');

const schema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
      index: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    method: {
      type: String,
      enum: ['cod', 'online'],
      required: true,
    },

    status: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
      index: true,
    },

    // Store the amount in the smallest currency unit.
    // Example: $25.99 => 2599
    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    currency: {
      type: String,
      default: 'usd',
      lowercase: true,
      trim: true,
    },

    /*
     * Generic transaction ID.
     *
     * For Stripe this can contain the PaymentIntent ID.
     * Example: pi_123...
     */
    transactionId: {
      type: String,
      trim: true,
    },

    /*
     * Stripe-specific identifiers.
     */
    stripeSessionId: {
      type: String,
      trim: true,
      index: true,
      sparse: true,
    },

    stripePaymentIntentId: {
      type: String,
      trim: true,
      index: true,
      sparse: true,
    },

    /*
     * Optional timestamps that make payment history easier
     * to reason about.
     */
    paidAt: {
      type: Date,
    },

    refundedAt: {
      type: Date,
    },

    /*
     * Keep gateway information for debugging/auditing.
     *
     * Do NOT store card numbers, CVC, passwords, or other
     * sensitive payment credentials here.
     */
    gatewayResponse: {
      type: mongoose.Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
  },
);

schema.index({ order: 1 }, { unique: true });

module.exports = mongoose.models.Payment || mongoose.model('Payment', schema);