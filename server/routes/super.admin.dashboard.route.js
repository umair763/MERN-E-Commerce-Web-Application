const router = require('express').Router();
const superAdminDashboard = require('../controllers/super.admin.dashboard.controller');
const { verifyToken, requireRole } = require('../middlewares/verify');

router.get('/stats', verifyToken, requireRole('super_admin'), superAdminDashboard.getSuperAdminDashboardStats);

module.exports = router;
