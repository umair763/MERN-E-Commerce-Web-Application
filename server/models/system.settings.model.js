const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema({
  key: {
    type: String,
    unique: true,
  },

  value: mongoose.Schema.Types.Mixed,

  description: String,

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
module.exports = mongoose.model('SystemSetting', settingSchema);
