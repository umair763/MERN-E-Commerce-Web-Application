const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
  },

  variantId: String,

  quantity: {
    type: Number,
    default: 0,
  },

  reserved: {
    type: Number,
    default: 0,
  },

  warehouse: String,

  createdAt: {
    type: Date,
    default: Date.now,
  },

  updatedAt: {
    type: Date,
    default: Date.now,
  },

  deletedAt: {
    type: Date,
    default: null,
  },
});

module.exports = mongoose.model('Inventory', inventorySchema);
