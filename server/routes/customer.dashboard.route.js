const router = require('express').Router();
const customerDashboard = require('../controllers/customer.dashboard.controller');
const { verifyToken, requireRole } = require('../middlewares/verify');

router.get('/stats', verifyToken, requireRole('customer'), customerDashboard.getCustomerDashboardStats);

module.exports = router;
