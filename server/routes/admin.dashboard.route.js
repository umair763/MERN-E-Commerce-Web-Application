const router = require('express').Router();
const adminDashboard = require('../controllers/admin.dashboard.controller');
const { verifyToken, requireRole } = require('../middlewares/verify');

router.get('/stats', verifyToken, requireRole('admin', 'super_admin'), adminDashboard.getAdminDashboardStats);

module.exports = router;
