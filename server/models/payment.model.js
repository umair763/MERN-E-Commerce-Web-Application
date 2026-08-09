const mongoose = require('mongoose');
const schema = new mongoose.Schema(
  {
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    method: {
      type: String,
      enum: ['cod', 'online'],
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
    },
    amount: { type: Number, required: true },
    transactionId: String,
    gatewayResponse: Object,
  },
  { timestamps: true },
);
module.exports = mongoose.models.Payment || mongoose.model('Payment', schema);