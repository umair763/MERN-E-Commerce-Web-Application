const mongoose = require('mongoose');

const permissionSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true,
  },

  module: {
    type: String,
    required: true,
  },

  action: {
    type: String,
    required: true,
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

module.exports = mongoose.model('Permission', permissionSchema);
