const r = require('express').Router();
const c = require('../controllers/payment.controller');
const { verifyToken } = require('../middlewares/verify');
r.use(verifyToken);
r.post('/checkout', c.createCheckoutSession);
r.get('/session/:sessionId', c.getPaymentBySession);
r.get('/:paymentId', c.getPayment);
module.exports = r;
