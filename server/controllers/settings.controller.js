const { asyncHandler } = require('../middlewares/error');
const SystemSetting = require('../models/system.settings.model');
const { createAuditLog } = require('../helpers/audit.helper');

const getAllSettings = asyncHandler(async (req, res) => {
  const settings = await SystemSetting.find({ deletedAt: null }).sort({ key: 1 });
  res.json({ success: true, data: settings });
});

const getSettingByKey = asyncHandler(async (req, res) => {
  const setting = await SystemSetting.findOne({ 
    key: req.params.key, 
    deletedAt: null 
  });
  
  if (!setting) {
    return res.status(404).json({ success: false, message: 'Setting not found' });
  }
  
  res.json({ success: true, data: setting });
});

const updateSetting = asyncHandler(async (req, res) => {
  const { key, value, description } = req.body;
  
  const setting = await SystemSetting.findOne({ 
    key: req.params.key, 
    deletedAt: null 
  });
  
  if (!setting) {
    return res.status(404).json({ success: false, message: 'Setting not found' });
  }
  
  const oldSettingData = { key: setting.key, value: setting.value, description: setting.description };
  
  const updateData = {};
  if (value !== undefined) updateData.value = value;
  if (description !== undefined) updateData.description = description;
  updateData.updatedAt = new Date();
  
  const updatedSetting = await SystemSetting.findByIdAndUpdate(
    req.params.key,
    { $set: updateData },
    { new: true, runValidators: true }
  );
  
  await createAuditLog(req.user._id, 'update', 'SystemSetting', req.params.key, oldSettingData, { key: updatedSetting.key, value: updatedSetting.value, description: updatedSetting.description });
  
  res.json({
    success: true,
    message: 'Setting updated successfully',
    data: updatedSetting,
  });
});

const createSetting = asyncHandler(async (req, res) => {
  const { key, value, description } = req.body;
  
  const existingSetting = await SystemSetting.findOne({ key, deletedAt: null });
  if (existingSetting) {
    return res.status(409).json({ success: false, message: 'Setting key already exists' });
  }
  
  const setting = await SystemSetting.create({
    key,
    value,
    description,
  });
  
  await createAuditLog(req.user._id, 'create', 'SystemSetting', key, null, { key, value, description });
  
  res.status(201).json({
    success: true,
    message: 'Setting created successfully',
    data: setting,
  });
});

const deleteSetting = asyncHandler(async (req, res) => {
  const setting = await SystemSetting.findOne({ 
    key: req.params.key, 
    deletedAt: null 
  });
  
  if (!setting) {
    return res.status(404).json({ success: false, message: 'Setting not found' });
  }
  
  const oldSettingData = { key: setting.key, value: setting.value, description: setting.description };
  
  await SystemSetting.findByIdAndUpdate(req.params.key, { deletedAt: new Date() });
  
  await createAuditLog(req.user._id, 'delete', 'SystemSetting', req.params.key, oldSettingData, null);
  
  res.json({ success: true, message: 'Setting deleted successfully' });
});

module.exports = {
  getAllSettings,
  getSettingByKey,
  updateSetting,
  createSetting,
  deleteSetting,
};
