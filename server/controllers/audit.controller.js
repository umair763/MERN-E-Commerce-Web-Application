const { asyncHandler } = require('../middlewares/error');
const AuditLog = require('../models/audit.log.model');

const getAllAuditLogs = asyncHandler(async (req, res) => {
  const { page = 1, limit = 50, action, entity } = req.query;
  
  const filter = {};
  if (action) filter.action = action;
  if (entity) filter.entity = entity;
  
  const skip = (page - 1) * limit;
  
  const [logs, total] = await Promise.all([
    AuditLog.find(filter)
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit)),
    AuditLog.countDocuments(filter)
  ]);
  
  res.json({ 
    success: true, 
    data: logs,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit)
    }
  });
});

const getAuditLogById = asyncHandler(async (req, res) => {
  const log = await AuditLog.findById(req.params.id).populate('user', 'name email');
  
  if (!log) {
    return res.status(404).json({ success: false, message: 'Audit log not found' });
  }
  
  res.json({ success: true, data: log });
});

module.exports = {
  getAllAuditLogs,
  getAuditLogById,
};
