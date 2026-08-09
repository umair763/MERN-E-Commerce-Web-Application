const r = require('express').Router();
const c = require('../controllers/return.controller');
const { verifyToken, requireRole } = require('../middlewares/verify');
r.use(verifyToken);
r.post('/', c.create);
r.get('/admin/all', requireRole('admin', 'manager'), c.adminList);
r.patch('/admin/:id', requireRole('admin', 'manager'), c.update);
r.get('/', c.mine);
module.exports = r;
