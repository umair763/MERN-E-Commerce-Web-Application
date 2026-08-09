const r = require('express').Router();
const c = require('../controllers/payment.controller');
const { verifyToken, requireRole } = require('../middlewares/verify');
r.use(verifyToken);
r.post('/', c.create);
r.post('/process', c.processPayment);
r.get('/order/:orderId', c.getByOrder);
r.patch('/:id/refund', requireRole('admin', 'manager'), c.refund);
module.exports = r;