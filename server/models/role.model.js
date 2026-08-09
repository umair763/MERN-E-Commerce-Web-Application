const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    enum: ['guest', 'customer', 'admin', 'super_admin'],
  },

  level: {
    type: Number,
    required: true,
    unique: true,
    min: 0,
    max: 3,
  },

  permissions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Permission',
    },
  ],

  isDefault: {
    type: Boolean,
    default: false,
  },

  description: {
    type: String,
  },

  isActive: {
    type: Boolean,
    default: true,
  },

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

module.exports = mongoose.model('Role', roleSchema);
