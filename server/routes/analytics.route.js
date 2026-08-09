const r = require('express').Router();
const { dashboard } = require('../controllers/analytics.controller');
const { verifyToken, requireRole } = require('../middlewares/verify');
r.get('/dashboard', verifyToken, requireRole('admin', 'manager'), dashboard);
module.exports = r;
