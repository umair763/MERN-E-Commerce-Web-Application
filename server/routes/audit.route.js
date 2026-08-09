const router = require('express').Router();
const auditController = require('../controllers/audit.controller');
const { verifyToken, requireRole } = require('../middlewares/verify');

router.get('/', verifyToken, requireRole('super_admin'), auditController.getAllAuditLogs);
router.get('/:id', verifyToken, requireRole('super_admin'), auditController.getAuditLogById);

module.exports = router;
