const AuditLog = require('../models/audit.log.model');

const createAuditLog = async (userId, action, entity, entityId, oldData = null, newData = null) => {
  try {
    await AuditLog.create({
      user: userId,
      action,
      entity,
      entityId,
      oldData,
      newData,
    });
  } catch (error) {
    console.error('Failed to create audit log:', error);
  }
};

module.exports = { createAuditLog };
